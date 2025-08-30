const BACKEND_URL = "https://tournest-d2kq.onrender.com"; // Use your Render backend URL

const apiHotel = `${BACKEND_URL}/hotels`;
const apiHabitacion = `${BACKEND_URL}/rooms`;
const apiActividad = `${BACKEND_URL}/activitys`;

// When the DOM is loaded, check login and load data
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");
  const id = localStorage.getItem("id");
  const name = localStorage.getItem("name");

  // Check if user is logged in and is owner
  if (isLoggedIn !== "true" || role !== "owner") {
    alert("Access denied");
    window.location.href = "../index.html"; 
  }
});

// Logout button event
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear(); // Remove all session data
  window.location.href = "../index.html"; 
});

// Show owner name in sidebar
const ownerName = localStorage.getItem("name");
if (ownerName) {
  document.getElementById("owner-name").textContent = ownerName;
} else {
  document.getElementById("owner-name").textContent = "Owner";
} 

let hotels = [];
const container = document.getElementById("hotel-list");
const hotelForm = document.getElementById("hotelForm");

// Load hotels for the logged owner
async function loadHotels() {
  const ownerId = localStorage.getItem("id");
  container.innerHTML = ""; // Clear before rendering

  try {
    const response = await fetch(`${apiHotel}/owner/${ownerId}`);
    if (!response.ok) throw new Error("Server response error");

    hotels = await response.json();

    // Render hotel cards
    hotels.forEach(hotel => {
      const card = document.createElement("div");
      card.classList.add("hotel-card");
      card.dataset.id = hotel.id_hotel;
      card.innerHTML = `
        <div class="hotel-card-content">
          <img src="${hotel.img_url || 'https://static.vecteezy.com/system/resources/previews/012/942/784/non_2x/broken-image-icon-isolated-on-a-white-background-no-image-symbol-for-web-and-mobile-apps-free-vector.jpg'}" alt="${hotel.name}">
          <div class="hotel-info">
            <h3>${hotel.name}</h3>
            <p><strong>City:</strong> ${hotel.city}</p>
            <p><strong>Rating:</strong> ⭐ ${hotel.rating_average}</p>
            <p>${hotel.description}</p>
            <div class="hotel-actions">
              <button class="update-btn" data-id="${hotel.id_hotel}">Edit</button>
              <button class="delete-btn" data-id="${hotel.id_hotel}">Delete</button>
            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading hotels:", error);
  }
}

// Initial render of hotels when DOM is loaded
document.addEventListener("DOMContentLoaded", loadHotels);

// Handle Edit and Delete buttons for hotels
container.addEventListener("click", (e) => {
  const idHotel = Number(e.target.dataset.id);
  const hotel = hotels.find(h => h.id_hotel === idHotel);

  // Edit hotel
  if (e.target.classList.contains("update-btn")) {
    if (!hotel) return alert("Hotel not found");

    // Fill form with hotel data
    document.getElementById("hotel_nombre").value = hotel.name;
    document.getElementById("hotel_ciudad").value = hotel.city;
    document.getElementById("hotel_descripcion").value = hotel.description;
    document.getElementById("hotel_rating").value = hotel.rating_average;
    document.getElementById("hotel_img_url").value = hotel.img_url || "";

    hotelForm.dataset.editId = idHotel;
    hotelForm.querySelector("button[type='submit']").textContent = "Update Hotel";

  // Delete hotel
  } else if (e.target.classList.contains("delete-btn")) {
    const confirmDelete = confirm("Are you sure you want to delete this hotel?");
    if (!confirmDelete) return;

    fetch(`${apiHotel}/${idHotel}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error("Error deleting hotel");
        // Update array and render
        hotels = hotels.filter(h => h.id_hotel !== idHotel);
        loadHotels();
        cargarHoteles(); // Update select
        alert("Hotel deleted successfully");
      })
      .catch(err => console.error(err));
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
    });
});

// Handle hotel form (Add / Edit)
hotelForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const ownerId = localStorage.getItem("id");
  const editId = hotelForm.dataset.editId;

  // Collect hotel data from form
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
      alert(editId ? "Hotel updated ✅" : "Hotel added ✅");
      hotelForm.reset();
      delete hotelForm.dataset.editId;
      hotelForm.querySelector("button[type='submit']").textContent = "Add Hotel";
      loadHotels(); // Reload list
      cargarHoteles(); // Update select
    } else {
      alert("Error saving hotel");
    }
  } catch (err) {
    console.error(err);
  }
});

// CRUD for managing rooms

// Function to fill hotel select only for the logged owner
async function cargarHoteles() {
  try {
    const response = await fetch(apiHotel); 
    const hoteles = await response.json();

    const ownerId = parseInt(localStorage.getItem("id")); // Logged owner ID

    // Filter only hotels for this owner
    const misHoteles = hoteles.filter(hotel => hotel.id_owner === ownerId);

    const select = document.getElementById("hotel_ident");

    // Reset options
    select.innerHTML = '<option value="">Select a hotel</option>';

    // Add each hotel as option
    misHoteles.forEach(hotel => {
      const option = document.createElement("option");
      option.value = hotel.id_hotel;   // Hotel ID
      option.textContent = hotel.name; // Hotel name
      select.appendChild(option);
    });

  } catch (error) {
    console.error("Error loading hotels:", error);
  }
}

document.addEventListener("DOMContentLoaded", cargarHoteles);

let habitaciones = [];
const habitacionForm = document.getElementById("habitacionForm");
const habitacionContainer = document.getElementById("room-list"); // Create a div with this id in your HTML
const hotelSelect = document.getElementById("hotel_ident");

// Load hotels in the select (only for the logged owner)
async function cargarHoteles() {
  try {
    const ownerId = parseInt(localStorage.getItem("id"));
    const res = await fetch(`${apiHotel}/owner/${ownerId}`);
    const hoteles = await res.json();

    hotelSelect.innerHTML = '<option value="">Select one of my hotels</option>';
    hoteles.forEach(hotel => {
      const option = document.createElement("option");
      option.value = hotel.id_hotel;
      option.textContent = hotel.name;
      hotelSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading hotels:", err);
  }
}

// Load rooms for the owner
async function loadHabitaciones() {
  try {
    const ownerId = parseInt(localStorage.getItem("id"));
    habitacionContainer.innerHTML = ""; // Clear container

    // Get all rooms
    const res = await fetch(apiHabitacion);
    let rooms = await res.json();

    // Filter only rooms for the owner's hotels
    const hotelRes = await fetch(`${apiHotel}/owner/${ownerId}`);
    const misHoteles = await hotelRes.json();
    const hotelIds = misHoteles.map(h => h.id_hotel);

    habitaciones = rooms.filter(r => hotelIds.includes(r.id_hotel));

    // Render room cards
    habitaciones.forEach(room => {
      const card = document.createElement("div");
      card.classList.add("room-card");
      card.dataset.id = room.id_room; // Assuming your room id is id_room
      card.innerHTML = `
        <img src="${room.img_url || 'https://static.vecteezy.com/system/resources/previews/012/942/784/non_2x/broken-image-icon-isolated-on-a-white-background-no-image-symbol-for-web-and-mobile-apps-free-vector.jpg'}" alt="Room">
        <h3>Hotel: ${misHoteles.find(h => h.id_hotel === room.id_hotel)?.name || "Unknown"}</h3>
        <p>Number: ${room.number_room}</p>
        <p>Capacity: ${room.capacity}</p>
        <p>Price: $${room.price}</p>
        <p>Status: ${room.state}</p>
        <button class="update-room-btn" data-id="${room.id_room}">Edit</button>
        <button class="delete-room-btn" data-id="${room.id_room}">Delete</button>
      `;
      habitacionContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading rooms:", err);
  }
}

// Initialize everything when the page loads
document.addEventListener("DOMContentLoaded", () => {
  cargarHoteles();
  loadHabitaciones();
});

// Add / Edit room
habitacionForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const editId = habitacionForm.dataset.editId;

  // Collect room data from form
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
      alert(editId ? "Room updated ✅" : "Room added ✅");
      habitacionForm.reset();
      delete habitacionForm.dataset.editId;
      habitacionForm.querySelector("button[type='submit']").textContent = "Add Room";
      await loadHabitaciones();
    } else {
      alert("Error saving room");
    }
  } catch (err) {
    console.error(err);
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
    });
});

// Edit / Delete room from cards
habitacionContainer.addEventListener("click", (e) => {
  const idRoom = Number(e.target.dataset.id);
  const room = habitaciones.find(r => r.id_room === idRoom);

  // Edit room
  if (e.target.classList.contains("update-room-btn")) {
    if (!room) return alert("Room not found");

    hotelSelect.value = room.id_hotel;
    document.getElementById("numero_habitacion").value = room.number_room;
    document.getElementById("capacidad").value = room.capacity;
    document.getElementById("precio").value = room.price;
    document.getElementById("room_img_url").value = room.img_url || "";
    document.getElementById("estado").value = room.state;

    habitacionForm.dataset.editId = idRoom;
    habitacionForm.querySelector("button[type='submit']").textContent = "Update Room";

  // Delete room
  } else if (e.target.classList.contains("delete-room-btn")) {
    if (!confirm("Do you want to delete this room?")) return;

    fetch(`${apiHabitacion}/${idRoom}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error("Error deleting room");
        habitaciones = habitaciones.filter(r => r.id_room !== idRoom);
        loadHabitaciones();
        cargarHoteles();
        alert("Room deleted ✅");
      })
      .catch(err => console.error(err));
    cargarHoteles();
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
    });
});

// CRUD for managing owner activities

let actividades = [];
const actividadContainer = document.getElementById("actividad-list");
const actividadForm = document.getElementById("actividadForm");

// Load activities for the logged owner
async function loadActividades() {
  try {
    const ownerId = parseInt(localStorage.getItem("id"));
    actividadContainer.innerHTML = "";

    const res = await fetch(`${apiActividad}/owner/${ownerId}`);
    if (!res.ok) throw new Error("Error loading activities");
    actividades = await res.json();

    // Render activity cards
    actividades.forEach(act => {
      const card = document.createElement("div");
      card.classList.add("actividad-card");
      card.dataset.id = act.id_activity;

      card.innerHTML = `
        <img src="${act.img_url || 'https://static.vecteezy.com/system/resources/previews/012/942/784/non_2x/broken-image-icon-isolated-on-a-white-background-no-image-symbol-for-web-and-mobile-apps-free-vector.jpg'}" alt="${act.name}">
        <h3>${act.name}</h3>
        <p>${act.description}</p>
        <p><strong>Price:</strong> $${act.price}</p>
        <p><strong>Duration:</strong> ${act.duration || "Not specified"}</p>
        <p><strong>Location:</strong> ${act.place || "Not specified"}</p>
        <p><strong>Available spots:</strong> ${act.quota_available}</p>
        <button class="update-actividad-btn" data-id="${act.id_activity}">Edit</button>
        <button class="delete-actividad-btn" data-id="${act.id_activity}">Delete</button>
      `;

      actividadContainer.appendChild(card);
    });

  } catch (err) {
    console.error(err);
  }
}

// Add / Edit activity
actividadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const editId = actividadForm.dataset.editId;

  // Collect activity data from form
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
      alert(editId ? "Activity updated ✅" : "Activity added ✅");
      actividadForm.reset();
      delete actividadForm.dataset.editId;
      actividadForm.querySelector("button[type='submit']").textContent = "Add Activity";
      await loadActividades();
    } else {
      alert("Error saving activity");
    }

  } catch (err) {
    console.error(err);
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
    });
});

// Edit / Delete activity from cards
actividadContainer.addEventListener("click", (e) => {
  const idAct = Number(e.target.dataset.id);
  const act = actividades.find(a => a.id_activity === idAct);

  // Edit activity
  if (e.target.classList.contains("update-actividad-btn")) {
    if (!act) return alert("Activity not found");

    document.getElementById("actividad_nombre").value = act.name;
    document.getElementById("actividad_descripcion").value = act.description;
    document.getElementById("actividad_precio").value = act.price;
    document.getElementById("actividad_duracion").value = act.duration;
    document.getElementById("actividad_img").value = act.img_url;
    document.getElementById("actividad_lugar").value = act.place;
    document.getElementById("actividad_cupos").value = act.quota_available;

    actividadForm.dataset.editId = idAct;
    actividadForm.querySelector("button[type='submit']").textContent = "Update Activity";

  // Delete activity
  } else if (e.target.classList.contains("delete-actividad-btn")) {
    if (!confirm("Do you want to delete this activity?")) return;

    fetch(`${apiActividad}/${idAct}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error("Error deleting activity");
        actividades = actividades.filter(a => a.id_activity !== idAct);
        loadActividades();
        alert("Activity deleted successfully");
      })
      .catch(err => console.error(err));
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
    });
});

// Initialize activities on page load
document.addEventListener("DOMContentLoaded", loadActividades);

// Get all sidebar buttons with data-section attribute
const sidebarButtons = document.querySelectorAll(".sidebar button[data-section]");

// Get all sections
const sections = document.querySelectorAll(".section");

// Function to show only the selected section
function showSection(sectionId) {
  sections.forEach(sec => {
    if (sec.id === `section-${sectionId}`) {
      sec.style.display = "block";
    } else {
      sec.style.display = "none";
    }
  });
}

// Assign event to each sidebar button
sidebarButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const section = btn.dataset.section;
    showSection(section);
  });
});

// Show hotels section by default
showSection("hoteles-propios");
