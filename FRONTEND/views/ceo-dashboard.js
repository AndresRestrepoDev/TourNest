const apiHotel = "http://localhost:5000/hotels";

document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");

  if (isLoggedIn !== "true" || role !== "ceo") {
    alert("Acceso no autorizado");
    window.location.href = "./login.html"; // vuelve al login
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear(); // elimina toda la sesión
  window.location.href = "./login.html"; // vuelve al login
});

document.addEventListener("DOMContentLoaded", async () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");

  if (isLoggedIn !== "true" || role !== "ceo") {
    alert("Acceso no autorizado");
    window.location.href = "../index.html";
    return;
  }

  // Cargar hoteles
  await loadHotels();
  await loadRooms();
});

// Botón logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "./login.html";
});

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
    document.getElementById("id_owner").value = hotel.id_owner;
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
    id_owner: document.getElementById("id_owner").value,
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


//CRUD para gestionar habitaciones de los hoteles
const apiRoom = "http://localhost:5000/rooms";

let rooms = []; // variable global para almacenar las habitaciones

// Función para cargar habitaciones
async function loadRooms() {
  try {
    const res = await fetch(apiRoom);
    rooms = await res.json();

    const container = document.getElementById("room-list"); // asegúrate de tener este div en tu HTML
    container.innerHTML = "";

    rooms.forEach(room => {
      const card = document.createElement("div");
      card.classList.add("room-card");

      card.innerHTML = `
        <img src="${room.img_url || 'https://via.placeholder.com/300'}" alt="Imagen habitación">
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









