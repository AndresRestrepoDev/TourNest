const apiHotel = "http://localhost:5000/hotels";
const apiHabitacion = "http://localhost:5000/rooms";
const apiActividad = "http://localhost:5000/activitys";

document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");
  const id = localStorage.getItem("id");
  const name = localStorage.getItem("name");

  if (isLoggedIn !== "true" || role !== "owner") {
    alert("Acceso no autorizado");
    window.location.href = "../index.html"; 
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear(); // elimina toda la sesión
  window.location.href = "../index.html"; 
});

// Mostrar nombre del propietario
const ownerName = localStorage.getItem("name");
if (ownerName) {
  document.getElementById("owner-name").textContent = ownerName;
} else {
  document.getElementById("owner-name").textContent = "Propietario";
} 

let hotels = [];
const container = document.getElementById("hotel-list");
const hotelForm = document.getElementById("hotelForm");

async function loadHotels() {
  const ownerId = localStorage.getItem("id");
  container.innerHTML = ""; // limpiar antes de renderizar

  try {
    const response = await fetch(`http://localhost:5000/hotels/owner/${ownerId}`);
    if (!response.ok) throw new Error("Error en la respuesta del servidor");

    hotels = await response.json();

    hotels.forEach(hotel => {
      const card = document.createElement("div");
      card.classList.add("hotel-card");
      card.dataset.id = hotel.id_hotel;
      card.innerHTML = `
        <div class="hotel-card-content">
          <img src="${hotel.img_url || 'https://static.vecteezy.com/system/resources/previews/012/942/784/non_2x/broken-image-icon-isolated-on-a-white-background-no-image-symbol-for-web-and-mobile-apps-free-vector.jpg'}" alt="${hotel.name}">
          <div class="hotel-info">
            <h3>${hotel.name}</h3>
            <p><strong>Ciudad:</strong> ${hotel.city}</p>
            <p><strong>Rating:</strong> ⭐ ${hotel.rating_average}</p>
            <p>${hotel.description}</p>
            <div class="hotel-actions">
              <button class="update-btn" data-id="${hotel.id_hotel}">Editar</button>
              <button class="delete-btn" data-id="${hotel.id_hotel}">Eliminar</button>
            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error cargando hoteles:", error);
  }
}

// Render inicial
document.addEventListener("DOMContentLoaded", loadHotels);

// Manejo de botones Editar y Eliminar
container.addEventListener("click", (e) => {
  const idHotel = Number(e.target.dataset.id);
  const hotel = hotels.find(h => h.id_hotel === idHotel);

  if (e.target.classList.contains("update-btn")) {
    if (!hotel) return alert("Hotel no encontrado");

    // Llenar formulario
    document.getElementById("hotel_nombre").value = hotel.name;
    document.getElementById("hotel_ciudad").value = hotel.city;
    document.getElementById("hotel_descripcion").value = hotel.description;
    document.getElementById("hotel_rating").value = hotel.rating_average;
    document.getElementById("hotel_img_url").value = hotel.img_url || "";

    hotelForm.dataset.editId = idHotel;
    hotelForm.querySelector("button[type='submit']").textContent = "Actualizar Hotel";

  } else if (e.target.classList.contains("delete-btn")) {
    const confirmDelete = confirm("¿Seguro que deseas eliminar este hotel?");
    if (!confirmDelete) return;

    fetch(`http://localhost:5000/hotels/${idHotel}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error("Error eliminando hotel");
        // Actualizar array y renderizar
        hotels = hotels.filter(h => h.id_hotel !== idHotel);
        loadHotels();
        alert("Hotel eliminado con éxito");
      })
      .catch(err => console.error(err));
  }
});

// Manejo de formulario (Agregar / Editar)
hotelForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const ownerId = localStorage.getItem("id");
  const editId = hotelForm.dataset.editId;

  const hotelData = {
    id_owner: parseInt(ownerId),
    name: document.getElementById("hotel_nombre").value,
    city: document.getElementById("hotel_ciudad").value,
    description: document.getElementById("hotel_descripcion").value,
    rating_average: Number(document.getElementById("hotel_rating").value),
    img_url: document.getElementById("hotel_img_url").value || "https://static.vecteezy.com/system/resources/previews/012/942/784/non_2x/broken-image-icon-isolated-on-a-white-background-no-image-symbol-for-web-and-mobile-apps-free-vector.jpg"
  };

  try {
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${apiHotel}/${editId}` : apiHotel;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hotelData)
    });

    if (res.ok) {
      alert(editId ? "Hotel actualizado ✅" : "Hotel agregado ✅");
      hotelForm.reset();
      delete hotelForm.dataset.editId;
      hotelForm.querySelector("button[type='submit']").textContent = "Agregar Hotel";
      loadHotels(); // recargar lista sin duplicados
    } else {
      alert("Error al guardar hotel");
    }
  } catch (err) {
    console.error(err);
  }
});

//CRUD para gestionar habitaciones de los habitaciones

// Función para llenar el select de hoteles solo del owner logueado
async function cargarHoteles() {
  try {
    const response = await fetch(apiHotel); 
    const hoteles = await response.json();

    const ownerId = parseInt(localStorage.getItem("id")); // id del owner logueado

    // filtrar solo hoteles de este owner
    const misHoteles = hoteles.filter(hotel => hotel.id_owner === ownerId);

    const select = document.getElementById("hotel_ident");

    // resetear opciones
    select.innerHTML = '<option value="">Seleccione un hotel</option>';

    // agregar cada hotel como opción
    misHoteles.forEach(hotel => {
      const option = document.createElement("option");
      option.value = hotel.id_hotel;   // ID del hotel
      option.textContent = hotel.name; // Nombre del hotel
      select.appendChild(option);
    });

  } catch (error) {
    console.error("Error cargando hoteles:", error);
  }
}

document.addEventListener("DOMContentLoaded", cargarHoteles);

let habitaciones = [];
const habitacionForm = document.getElementById("habitacionForm");
const habitacionContainer = document.getElementById("room-list"); // crea un div con este id en tu HTML
const hotelSelect = document.getElementById("hotel_ident");

// 1️⃣ Cargar hoteles en el select (solo del owner logueado)
async function cargarHoteles() {
  try {
    const ownerId = parseInt(localStorage.getItem("id"));
    const res = await fetch(`${apiHotel}/owner/${ownerId}`);
    const hoteles = await res.json();

    hotelSelect.innerHTML = '<option value="">Seleccione uno de mis hoteles</option>';
    hoteles.forEach(hotel => {
      const option = document.createElement("option");
      option.value = hotel.id_hotel;
      option.textContent = hotel.name;
      hotelSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error cargando hoteles:", err);
  }
}

// 2️⃣ Cargar habitaciones del owner
async function loadHabitaciones() {
  try {
    const ownerId = parseInt(localStorage.getItem("id"));
    habitacionContainer.innerHTML = ""; // limpiar contenedor

    // Traer todas las habitaciones
    const res = await fetch(apiHabitacion);
    let rooms = await res.json();

    // Filtrar solo habitaciones de los hoteles del owner
    const hotelRes = await fetch(`${apiHotel}/owner/${ownerId}`);
    const misHoteles = await hotelRes.json();
    const hotelIds = misHoteles.map(h => h.id_hotel);

    habitaciones = rooms.filter(r => hotelIds.includes(r.id_hotel));

    // Renderizar
    habitaciones.forEach(room => {
      const card = document.createElement("div");
      card.classList.add("room-card");
      card.dataset.id = room.id_room; // suponiendo que tu id de habitación es id_room
      card.innerHTML = `
        <h4>Hotel: ${misHoteles.find(h => h.id_hotel === room.id_hotel)?.name || "Desconocido"}</h4>
        <p>Número: ${room.number_room}</p>
        <p>Capacidad: ${room.capacity}</p>
        <p>Precio: $${room.price}</p>
        <p>Estado: ${room.state}</p>
        <img src="${room.room_img_url || 'https://static.vecteezy.com/system/resources/previews/012/942/784/non_2x/broken-image-icon-isolated-on-a-white-background-no-image-symbol-for-web-and-mobile-apps-free-vector.jpg'}" alt="Habitación">
        <button class="update-room-btn" data-id="${room.id_room}">Editar</button>
        <button class="delete-room-btn" data-id="${room.id_room}">Eliminar</button>
      `;
      habitacionContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Error cargando habitaciones:", err);
  }
}

// 4️⃣ Inicializar todo al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  cargarHoteles();
  loadHabitaciones();
});

// Agregar / Editar habitación
habitacionForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const editId = habitacionForm.dataset.editId;

  const roomData = {
    id_hotel: parseInt(hotelSelect.value),
    capacity: parseInt(document.getElementById("capacidad").value),
    price: parseFloat(document.getElementById("precio").value),
    img_url: document.getElementById("room_img_url").value || "",
    number_room: document.getElementById("numero_habitacion").value,
    state: document.getElementById("estado").value
  };

  try {
    const url = editId ? `${apiHabitacion}/${editId}` : apiHabitacion;
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roomData)
    });

    if (res.ok) {
      alert(editId ? "Habitación actualizada ✅" : "Habitación agregada ✅");
      habitacionForm.reset();
      delete habitacionForm.dataset.editId;
      habitacionForm.querySelector("button[type='submit']").textContent = "Agregar Habitación";
      await loadHabitaciones();
    } else {
      alert("Error al guardar habitación");
    }
  } catch (err) {
    console.error(err);
  }
});

// Editar / Eliminar habitación desde las cards
habitacionContainer.addEventListener("click", (e) => {
  const idRoom = Number(e.target.dataset.id);
  const room = habitaciones.find(r => r.id_room === idRoom);

  if (e.target.classList.contains("update-room-btn")) {
    if (!room) return alert("Habitación no encontrada");

    hotelSelect.value = room.id_hotel;
    document.getElementById("numero_habitacion").value = room.number_room;
    document.getElementById("capacidad").value = room.capacity;
    document.getElementById("precio").value = room.price;
    document.getElementById("room_img_url").value = room.img_url || "";
    document.getElementById("estado").value = room.state;

    habitacionForm.dataset.editId = idRoom;
    habitacionForm.querySelector("button[type='submit']").textContent = "Actualizar Habitación";

  } else if (e.target.classList.contains("delete-room-btn")) {
    if (!confirm("¿Desea eliminar esta habitación?")) return;

    fetch(`${apiHabitacion}/${idRoom}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error("Error eliminando habitación");
        habitaciones = habitaciones.filter(r => r.id_room !== idRoom);
        loadHabitaciones();
        alert("Habitación eliminada ✅");
      })
      .catch(err => console.error(err));
  }
});

// CRUD para gestionar actividades de los propietarios

let actividades = [];
const actividadContainer = document.getElementById("actividad-list");
const actividadForm = document.getElementById("actividadForm");

// Cargar actividades del owner logueado
async function loadActividades() {
  try {
    const ownerId = parseInt(localStorage.getItem("id"));
    actividadContainer.innerHTML = "";

    const res = await fetch(`${apiActividad}/owner/${ownerId}`);
    if (!res.ok) throw new Error("Error cargando actividades");
    actividades = await res.json();

    actividades.forEach(act => {
      const card = document.createElement("div");
      card.classList.add("actividad-card");
      card.dataset.id = act.id_activity;

      card.innerHTML = `
        <h4>${act.name}</h4>
        <p>${act.description}</p>
        <p><strong>Precio:</strong> $${act.price}</p>
        <p><strong>Duración:</strong> ${act.duration || "No especificada"}</p>
        <p><strong>Lugar:</strong> ${act.place || "No especificado"}</p>
        <p><strong>Cupos disponibles:</strong> ${act.quota_available}</p>
        <img src="${act.img_url || 'https://static.vecteezy.com/system/resources/previews/012/942/784/non_2x/broken-image-icon-isolated-on-a-white-background-no-image-symbol-for-web-and-mobile-apps-free-vector.jpg'}" alt="${act.name}">
        <button class="update-actividad-btn" data-id="${act.id_activity}">Editar</button>
        <button class="delete-actividad-btn" data-id="${act.id_activity}">Eliminar</button>
      `;

      actividadContainer.appendChild(card);
    });

  } catch (err) {
    console.error(err);
  }
}

// Agregar / Editar actividad
actividadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const editId = actividadForm.dataset.editId;

  const actData = {
    id_owner: parseInt(localStorage.getItem("id")),
    name: document.getElementById("actividad_nombre").value,
    description: document.getElementById("actividad_descripcion").value,
    price: parseFloat(document.getElementById("actividad_precio").value),
    duration: document.getElementById("actividad_duracion").value,
    img_url: document.getElementById("actividad_img").value,
    place: document.getElementById("actividad_lugar").value,
    quota_available: parseInt(document.getElementById("actividad_cupos").value)
  };

  try {
    const url = editId ? `${apiActividad}/${editId}` : apiActividad;
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(actData)
    });

    if (res.ok) {
      alert(editId ? "Actividad actualizada ✅" : "Actividad agregada ✅");
      actividadForm.reset();
      delete actividadForm.dataset.editId;
      actividadForm.querySelector("button[type='submit']").textContent = "Agregar Actividad";
      await loadActividades();
    } else {
      alert("Error al guardar actividad");
    }

  } catch (err) {
    console.error(err);
  }
});

// Editar / Eliminar desde las cards
actividadContainer.addEventListener("click", (e) => {
  const idAct = Number(e.target.dataset.id);
  const act = actividades.find(a => a.id_activity === idAct);

  if (e.target.classList.contains("update-actividad-btn")) {
    if (!act) return alert("Actividad no encontrada");

    document.getElementById("actividad_nombre").value = act.name;
    document.getElementById("actividad_descripcion").value = act.description;
    document.getElementById("actividad_precio").value = act.price;
    document.getElementById("actividad_duracion").value = act.duration;
    document.getElementById("actividad_img").value = act.img_url;
    document.getElementById("actividad_lugar").value = act.place;
    document.getElementById("actividad_cupos").value = act.quota_available;

    actividadForm.dataset.editId = idAct;
    actividadForm.querySelector("button[type='submit']").textContent = "Actualizar Actividad";

  } else if (e.target.classList.contains("delete-actividad-btn")) {
    if (!confirm("¿Desea eliminar esta actividad?")) return;

    fetch(`${apiActividad}/${idAct}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error("Error eliminando actividad");
        actividades = actividades.filter(a => a.id_activity !== idAct);
        loadActividades();
        alert("Actividad eliminada ✅");
      })
      .catch(err => console.error(err));
  }
});

// Inicializar
document.addEventListener("DOMContentLoaded", loadActividades);



// Obtener todos los botones de la barra lateral
const sidebarButtons = document.querySelectorAll(".sidebar button[data-section]");

// Obtener todas las secciones
const sections = document.querySelectorAll(".section");

// Función para mostrar solo la sección seleccionada
function showSection(sectionId) {
  sections.forEach(sec => {
    if (sec.id === `section-${sectionId}`) {
      sec.style.display = "block";
    } else {
      sec.style.display = "none";
    }
  });
}

// Asignar evento a cada botón
sidebarButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const section = btn.dataset.section;
    showSection(section);
  });
});

// Mostrar por defecto "hoteles"
showSection("mis-hoteles");  
  