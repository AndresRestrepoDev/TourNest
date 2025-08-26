const apiHotel = "http://localhost:5000/hotels";

document.addEventListener("DOMContentLoaded", async () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");
  const ownerId = localStorage.getItem("ownerId"); // recuperas el id

  if (isLoggedIn !== "true" || role !== "ceo") {
    alert("Acceso no autorizado");
    window.location.href = "../index.html";
    return;
  }

  console.log("El ID del propietario logueado es:", ownerId);

  // Aquí podrías usar el ownerId para traer SOLO sus hoteles
  await loadHotels(ownerId);
  await loadRooms(ownerId);
  await loadActivities(ownerId);
});


// Botón logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../index.html";
});

async function cargarOwnersHotels() {
  try {
    const response = await fetch("http://localhost:5000/owners"); 
    const owners = await response.json();

    const select = document.getElementById("id_owner_hotel");

    // resetear opciones
    select.innerHTML = '<option value="">Seleccione un Propietario</option>';

    // agregar cada owner
    owners.forEach(owner => {
      const option = document.createElement("option");
      option.value = owner.id_owner;
      option.textContent = owner.name;
      select.appendChild(option);
    });

  } catch (error) {
    console.error("Error cargando owners:", error);
  }
}

document.addEventListener("DOMContentLoaded", cargarOwnersHotels);


let hoteles = []; // variable global para almacenar los hoteles

// Función para cargar hoteles
async function loadHotels() {
  try {
    const res = await fetch(apiHotel);
    hoteles = await res.json();

    const container = document.getElementById("hotel-list");
    container.innerHTML = "";

    hoteles.forEach(hotel => {
      const card = document.createElement("div");
      card.classList.add("hotel-card");

      card.innerHTML = `
        <img src="${hotel.img_url || 'https://via.placeholder.com/300'}" alt="Imagen hotel">
        <h3>${hotel.name}</h3>
        <p>${hotel.description}</p>
        <p>Ciudad: ${hotel.city}</p>
        <p>Calificacion: ${hotel.rating_average}</p>
        <button class="edit" data-id="${hotel.id_hotel}">Editar</button>
        <button class="delete" data-id="${hotel.id_hotel}">Eliminar</button>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error al cargar hoteles:", err);
  }
}

// Eliminar hotel
const container = document.getElementById("hotel-list");

container.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete")) {
    const hotelId = e.target.dataset.id;
    if (confirm("¿Seguro que deseas eliminar este hotel?")) {
      try {
        const res = await fetch(`${apiHotel}/${hotelId}`, {
          method: "DELETE"
        });
        if (res.ok) {
          alert("Hotel eliminado ✅");
          await loadHotels();
        } else {
          alert("Error al eliminar hotel");
        }
      } catch (err) {
        console.error("Error DELETE:", err);
      }
    }
  }
});

// Listener para botones Editar
container.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    const hotelId = Number(e.target.dataset.id);
    const hotel = hoteles.find(h => h.id_hotel === hotelId);

    if (!hotel) return alert("Hotel no encontrado");

    // Llenar el formulario con los datos
    document.getElementById("id_owner_hotel").value = hotel.id_owner;
    document.getElementById("name").value = hotel.name;
    document.getElementById("city").value = hotel.city;
    document.getElementById("description").value = hotel.description;
    document.getElementById("rating_average").value = hotel.rating_average;
    document.getElementById("img_url").value = hotel.img_url;

    // Marcar formulario en modo edición
    hotelForm.dataset.editId = hotelId;
    hotelForm.querySelector("button[type='submit']").textContent = "Actualizar Hotel";
  }
});

hotelForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const editId = hotelForm.dataset.editId; // Si existe, estamos editando

  const hotelData = {
    id_owner: document.getElementById("id_owner_hotel").value,
    name: document.getElementById("name").value,
    city: document.getElementById("city").value,
    description: document.getElementById("description").value,
    rating_average: document.getElementById("rating_average").value,
    img_url: document.getElementById("img_url").value || "https://static.vecteezy.com/system/resources/previews/012/942/784/non_2x/broken-image-icon-isolated-on-a-white-background-no-image-symbol-for-web-and-mobile-apps-free-vector.jpg"
  };

  try {
    let res;
    if (editId) {
      // Modo edición → PUT
      res = await fetch(`${apiHotel}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hotelData)
      });
    } else {
      // Modo agregar → POST
      res = await fetch(apiHotel, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hotelData)
      });
    }

    if (res.ok) {
      alert(editId ? "Hotel actualizado ✅" : "Hotel agregado ✅");
      delete hotelForm.dataset.editId; // limpiar modo edición
      hotelForm.querySelector("button[type='submit']").textContent = "Agregar Hotel";
      hotelForm.reset();
      await loadHotels(); // recargar lista
    } else {
      alert(editId ? "Error al actualizar hotel" : "Error al agregar hotel");
    }
  } catch (err) {
    console.error("Error en la petición:", err);
  }
});


//CRUD para gestionar habitaciones de los habitaciones

// Función para llenar el select de hoteles
async function cargarHoteles() {
  try {
    const response = await fetch(apiHotel); 
    const hoteles = await response.json();

    // Obtener el select único por id
    const select = document.getElementById("hotel_id");

    // resetear opciones
    select.innerHTML = '<option value="">Seleccione un hotel</option>';

    // agregar cada hotel como opción
    hoteles.forEach(hotel => {
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

const apiRoom = "http://localhost:5000/rooms";

let rooms = []; // variable global para almacenar las habitaciones

// Función para cargar habitaciones
async function loadRooms() {
  try {
    const res = await fetch(apiRoom);
    rooms = await res.json();           

    const container = document.getElementById("room-list");
    container.innerHTML = "";

    rooms.forEach(room => {
      const card = document.createElement("div");
      card.classList.add("room-card");

      card.innerHTML = `
        <img src="${room.img_url || 'https://static.vecteezy.com/system/resources/previews/012/942/784/non_2x/broken-image-icon-isolated-on-a-white-background-no-image-symbol-for-web-and-mobile-apps-free-vector.jpg'}" alt="Imagen habitación">
        <h3>Habitación ${room.number_room}</h3>
        <p>Hotel ID: ${room.id_hotel}</p>
        <p>Capacidad: ${room.capacity}</p>
        <p>Precio: $${room.price}</p>
        <p>Estado: ${room.state}</p>
        <button class="edit" data-id="${room.id_room}">Editar</button>
        <button class="delete" data-id="${room.id_room}">Eliminar</button>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error al cargar habitaciones:", err);
  }
}

// Eliminar habitación
const roomContainer = document.getElementById("room-list");

roomContainer.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete")) {
    const roomId = e.target.dataset.id;
    if (confirm("¿Seguro que deseas eliminar esta habitación?")) {
      try {
        const res = await fetch(`${apiRoom}/${roomId}`, {
          method: "DELETE"
        });
        if (res.ok) {
          alert("Habitación eliminada ✅");
          await loadRooms();
        } else {
          alert("Error al eliminar habitación");
        }
      } catch (err) {
        console.error("Error DELETE:", err);
      }
    }
  }
});


// Listener para botones Editar habitaciones
roomContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    const roomId = Number(e.target.dataset.id);
    const room = rooms.find(r => r.id_room === roomId);

    if (!room) return alert("Habitación no encontrada");

    // Llenar el formulario con los datos
    document.getElementById("hotel_id").value = room.id_hotel;
    document.getElementById("numero_habitacion").value = room.number_room;
    document.getElementById("capacidad").value = room.capacity;
    document.getElementById("precio").value = room.price;
    document.getElementById("room_img_url").value = room.img_url;
    document.getElementById("estado").value = room.state;

    // Marcar formulario en modo edición
    habitacionForm.dataset.editId = roomId;
    habitacionForm.querySelector("button[type='submit']").textContent = "Actualizar Habitación";
  }
});

// Listener para envío del formulario (Agregar/Editar)
habitacionForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const editId = habitacionForm.dataset.editId; // Si existe → modo edición

  const roomData = {
    id_hotel: document.getElementById("hotel_id").value,
    number_room: document.getElementById("numero_habitacion").value,
    capacity: document.getElementById("capacidad").value,
    price: document.getElementById("precio").value,
    img_url: document.getElementById("room_img_url").value || "https://static.vecteezy.com/system/resources/previews/012/942/784/non_2x/broken-image-icon-isolated-on-a-white-background-no-image-symbol-for-web-and-mobile-apps-free-vector.jpg",
    state: document.getElementById("estado").value
  };

  try {
    let res;
    if (editId) {
      // Modo edición → PUT
        console.log("Editando habitación con ID:", editId, roomData);
      res = await fetch(`${apiRoom}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData)
      });
    } else {
      // Modo agregar → POST
      res = await fetch(apiRoom, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData)
      });
    }

    if (res.ok) {
      alert(editId ? "Habitación actualizada ✅" : "Habitación agregada ✅");
      habitacionForm.removeAttribute("data-edit-id");
      habitacionForm.querySelector("button[type='submit']").textContent = "Agregar Habitación";
      habitacionForm.reset();
      await loadRooms(); // recargar lista
    } else {
      alert(editId ? "Error al actualizar habitación" : "Error al agregar habitación");
    }
  } catch (err) {
    console.error("Error en la petición:", err);
  }
});

// CRUD para gestionar actividades turísticas

// Función para llenar el select de owners
async function cargarOwners() {
  try {
    const response = await fetch("http://localhost:5000/owners"); 
    const owners = await response.json();

    const select = document.getElementById("actividad_owner");

    // resetear opciones
    select.innerHTML = '<option value="">Seleccione un Propietario</option>';

    // agregar cada owner
    owners.forEach(owner => {
      const option = document.createElement("option");
      option.value = owner.id_owner;
      option.textContent = owner.name;
      select.appendChild(option);
    });

  } catch (error) {
    console.error("Error cargando owners:", error);
  }
}


// Llamar cuando cargue la página o la sección
document.addEventListener("DOMContentLoaded", cargarOwners, cargarHoteles, cargarOwnersHotels);


const apiActivity = "http://localhost:5000/activitys";

let activities = []; // variable global para almacenar las actividades

// Función para cargar actividades
async function loadActivities() {
  try {
    const res = await fetch(apiActivity);
    activities = await res.json();

    const container = document.getElementById("actividad-list");
    container.innerHTML = "";

    activities.forEach(activity => {
      const card = document.createElement("div");
      card.classList.add("activity-card");

      card.innerHTML = `
        <img src="${activity.img_url || 'https://static.vecteezy.com/system/resources/previews/012/942/784/non_2x/broken-image-icon-isolated-on-a-white-background-no-image-symbol-for-web-and-mobile-apps-free-vector.jpg'}" alt="Imagen actividad">
        <h3>${activity.name}</h3>
        <p><strong>Descripción:</strong> ${activity.description || "Sin descripción"}</p>
        <p><strong>Precio:</strong> $${activity.price}</p>
        <p><strong>Duración:</strong> ${activity.duration || "No especificada"}</p>
        <p><strong>Lugar:</strong> ${activity.place || "No definido"}</p>
        <p><strong>Cupos:</strong> ${activity.quota_available}</p>
        <p><strong>Owner ID:</strong> ${activity.id_owner}</p>
        <button class="edit" data-id="${activity.id_activity}">Editar</button>
        <button class="delete" data-id="${activity.id_activity}">Eliminar</button>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error al cargar actividades:", err);
  }
}

// Eliminar actividad
const activityContainer = document.getElementById("actividad-list");

activityContainer.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete")) {
    const activityId = e.target.dataset.id;
    if (confirm("¿Seguro que deseas eliminar esta actividad?")) {
      try {
        const res = await fetch(`${apiActivity}/${activityId}`, {
          method: "DELETE"
        });
        if (res.ok) {
          alert("Actividad eliminada ✅");
          await loadActivities(); // recargar la lista
        } else {
          alert("Error al eliminar actividad ❌");
        }
      } catch (err) {
        console.error("Error DELETE:", err);
      }
    }
  }
});

// Listener para botones Editar actividades
activityContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    const activityId = Number(e.target.dataset.id);
    const activity = activities.find(a => a.id_activity === activityId);

    if (!activity) return alert("Actividad no encontrada");

    // Llenar el formulario con los datos
    document.getElementById("actividad_nombre").value = activity.name_activity;
    document.getElementById("actividad_descripcion").value = activity.description;
    document.getElementById("actividad_precio").value = activity.price;
    document.getElementById("actividad_img").value = activity.img_url;
    document.getElementById("actividad_lugar").value = activity.place;
    document.getElementById("actividad_duracion").value = activity.duration;
    document.getElementById("actividad_cupos").value = activity.quota_available;
    document.getElementById("actividad_owner").value = activity.id_owner;    

    // Marcar formulario en modo edición
    actividadForm.dataset.editId = activityId;
    actividadForm.querySelector("button[type='submit']").textContent = "Actualizar Actividad";
  }
});

// Listener para envío del formulario (Agregar/Editar)
actividadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const editId = actividadForm.dataset.editId; // Si existe → modo edición

  const activityData = {
    name: document.getElementById("actividad_nombre").value,
    description: document.getElementById("actividad_descripcion").value,
    price: document.getElementById("actividad_precio").value,
    img_url: document.getElementById("actividad_img").value || "https://static.vecteezy.com/system/resources/previews/012/942/784/non_2x/broken-image-icon-isolated-on-a-white-background-no-image-symbol-for-web-and-mobile-apps-free-vector.jpg",
    place: document.getElementById("actividad_lugar").value,
    duration: document.getElementById("actividad_duracion").value,
    quota_available: document.getElementById("actividad_cupos").value,
    id_owner: document.getElementById("actividad_owner").value
  };

  console.log("Datos de la actividad:", activityData);

  try {
    let res;
    if (editId) {
      // Modo edición → PUT
      res = await fetch(`${apiActivity}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData)
      });
    } else {
      // Modo agregar → POST
      res = await fetch(apiActivity, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData)
      });
    }

    if (res.ok) {
      alert(editId ? "Actividad actualizada ✅" : "Actividad agregada ✅");
      delete actividadForm.dataset.editId; // limpiar modo edición
      actividadForm.querySelector("button[type='submit']").textContent = "Agregar Actividad";
      actividadForm.reset();
      await loadActivities(); // recargar lista
    } else {
      alert(editId ? "Error al actualizar actividad" : "Error al agregar actividad");
    }
  } catch (err) {
    console.error("Error en la petición:", err);
  }
});





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

// Opcional: mostrar por defecto "hoteles"
showSection("hoteles");









