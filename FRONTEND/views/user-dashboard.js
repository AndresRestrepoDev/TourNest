document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");

  if (isLoggedIn !== "true" || role !== "user") {
    alert("Acceso no autorizado");
    window.location.href = "../index.html"; 
  }

  // Mostrar nombre del usuario
  const UserName = localStorage.getItem("name") || "Usuario";
  document.getElementById("User-name").textContent = UserName;

  // Cargar hoteles y actividades al iniciar
  loadUserHotels();
  loadUserActivities();
});

// Cerrar sesión
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../index.html";
});

// Secciones y navegación
const sidebarButtons = document.querySelectorAll(".sidebar button[data-section]");
const sections = document.querySelectorAll(".section");

function showSection(sectionId) {
  sections.forEach(sec => {
    sec.style.display = (sec.id === `section-${sectionId}`) ? "block" : "none";
  });
}

sidebarButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    showSection(btn.dataset.section);
  });
});

// Mostrar por defecto hoteles
showSection("hoteles-disponibles");

// Elementos contenedores
const userHotelList = document.getElementById("user-hotel-list");
const userRoomList = document.getElementById("user-room-list");
const actividadList = document.getElementById("actividad-list");

// Cargar hoteles
async function loadUserHotels() {
  userHotelList.innerHTML = "<p>Cargando hoteles...</p>";
  try {
    const res = await fetch("http://localhost:5000/hotels");
    if (!res.ok) throw new Error("Error cargando hoteles");
    const hotels = await res.json();

    userHotelList.innerHTML = "";
    hotels.forEach(hotel => {
      const card = document.createElement("div");
      card.classList.add("hotel-card");
      card.innerHTML = `
        <img src="${hotel.img_url || 'https://static.vecteezy.com/system/resources/previews/012/942/784/non_2x/broken-image-icon-isolated-on-a-white-background-no-image-symbol-for-web-and-mobile-apps-free-vector.jpg'}">
        <h3>${hotel.name}</h3>
        <p>${hotel.city}</p>
        <p>${hotel.description}</p>
        <p>⭐ ${hotel.rating_average}</p>
        <button class="view-rooms-btn" data-id="${hotel.id_hotel}">Ver Habitaciones</button>
      `;
      userHotelList.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    userHotelList.innerHTML = "<p>Error cargando hoteles</p>";
  }
}

// Cargar habitaciones según hotel
async function loadRooms(hotelId) {
  userRoomList.innerHTML = "<p>Cargando habitaciones...</p>";
  try {
    const res = await fetch(`http://localhost:5000/rooms/hotel/${hotelId}`);
    if (!res.ok) throw new Error("Error cargando habitaciones");
    const rooms = await res.json();

    userRoomList.innerHTML = "";
    rooms.forEach(room => {
      const card = document.createElement("div");
      card.classList.add("room-card");
      card.innerHTML = `
        <img src="${room.room_img_url || 'https://static.vecteezy.com/system/resources/previews/012/942/784/non_2x/broken-image-icon-isolated-on-a-white-background-no-image-symbol-for-web-and-mobile-apps-free-vector.jpg'}" alt="Habitación">
        <h4>Habitación ${room.number_room}</h4>
        <p>Capacidad: ${room.capacity}</p>
        <p>Precio: $${room.price}</p>
        <p>Estado: ${room.state}</p>
      `;
      userRoomList.appendChild(card);
    });

    // Mostrar sección de habitaciones
    showSection("habitaciones-disponibles");
  } catch (err) {
    console.error(err);
    userRoomList.innerHTML = "<p>Error cargando habitaciones</p>";
  }
}

// Clic en botón "Ver Habitaciones"
userHotelList.addEventListener("click", (e) => {
  if (e.target.classList.contains("view-rooms-btn")) {
    const hotelId = e.target.dataset.id;
    loadRooms(hotelId);
  }
});

// Botón volver a hoteles
document.getElementById("back-to-hotels").addEventListener("click", () => {
  showSection("hoteles-disponibles");
});

// Cargar actividades
async function loadUserActivities() {
  actividadList.innerHTML = "<p>Cargando actividades...</p>";
  try {
    const res = await fetch("http://localhost:5000/activitys");
    if (!res.ok) throw new Error("Error cargando actividades");
    const activities = await res.json();

    actividadList.innerHTML = "";
    activities.forEach(act => {
      const card = document.createElement("div");
      card.classList.add("actividad-card");
      card.innerHTML = `
        <img src="${act.img_url || 'https://static.vecteezy.com/system/resources/previews/012/942/784/non_2x/broken-image-icon-isolated-on-a-white-background-no-image-symbol-for-web-and-mobile-apps-free-vector.jpg'}">
        <h4>${act.name}</h4>
        <p>${act.description}</p>
        <p><strong>Precio:</strong> $${act.price}</p>
        <p><strong>Duración:</strong> ${act.duration || "No especificada"}</p>
        <p><strong>Lugar:</strong> ${act.place || "No especificado"}</p>
        <p><strong>Cupos disponibles:</strong> ${act.quota_available}</p>
      `;
      actividadList.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    actividadList.innerHTML = "<p>Error cargando actividades</p>";
  }
}
