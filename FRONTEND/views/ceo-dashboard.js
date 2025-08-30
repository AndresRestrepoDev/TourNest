// API endpoints for Render backend
const BACKEND_URL = "https://tournest-d2kq.onrender.com";
const apiHotel = `${BACKEND_URL}/hotels`;
const apiRoom = `${BACKEND_URL}/rooms`;
const apiActivity = `${BACKEND_URL}/activitys`;
const apiOwners = `${BACKEND_URL}/owners`;

// When the DOM is loaded, check login and load data
document.addEventListener("DOMContentLoaded", async () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");
  const ownerId = localStorage.getItem("ownerId"); // Retrieve owner ID

  if (isLoggedIn !== "true" || role !== "ceo") {
    alert("Unauthorized access");
    window.location.href = "../index.html";
    return;
  }

  console.log("Logged owner ID:", ownerId);

  // Load all data
  await loadHotels(ownerId);
  await loadRooms(ownerId);
  await loadActivities(ownerId);
});

// Logout button event
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../index.html";
});

// Load owners for hotel select
async function cargarOwnersHotels() {
  try {
    const response = await fetch(apiOwners); 
    const owners = await response.json();

    const select = document.getElementById("id_owner_hotel");

    // Reset options
    select.innerHTML = '<option value="">Select an Owner</option>';

    // Add each owner as option
    owners.forEach(owner => {
      const option = document.createElement("option");
      option.value = owner.id_owner;
      option.textContent = owner.name;
      select.appendChild(option);
    });

  } catch (error) {
    console.error("Error loading owners:", error);
  }
}

document.addEventListener("DOMContentLoaded", cargarOwnersHotels);

let hoteles = []; // Global variable to store hotels

// Function to load hotels
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
        <img src="${hotel.img_url || 'https://via.placeholder.com/300'}" alt="Hotel image">
        <h3>${hotel.name}</h3>
        <p>${hotel.description}</p>
        <p>City: ${hotel.city}</p>
        <p>Rating: 🌟 ${hotel.rating_average}</p>
        <button class="edit" data-id="${hotel.id_hotel}">Edit</button>
        <button class="delete" data-id="${hotel.id_hotel}">Delete</button>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading hotels:", err);
  }
}

// Delete hotel
const container = document.getElementById("hotel-list");

container.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete")) {
    const hotelId = e.target.dataset.id;
    if (confirm("Are you sure you want to delete this hotel?")) {
      try {
        const res = await fetch(`${apiHotel}/${hotelId}`, {
          method: "DELETE"
        });
        if (res.ok) {
          alert("Hotel deleted ✅");
          await loadHotels();
          await cargarHoteles(); // Reload hotel select
        } else {
          alert("Error deleting hotel");
        }
      } catch (err) {
        console.error("Error DELETE:", err);
      }
    }
  }
});

// Listener for Edit buttons
container.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    const hotelId = Number(e.target.dataset.id);
    const hotel = hoteles.find(h => h.id_hotel === hotelId);

    if (!hotel) return alert("Hotel not found");

    // Fill the form with hotel data
    document.getElementById("id_owner_hotel").value = hotel.id_owner;
    document.getElementById("name").value = hotel.name;
    document.getElementById("city").value = hotel.city;
    document.getElementById("description").value = hotel.description;
    document.getElementById("rating_average").value = hotel.rating_average;
    document.getElementById("img_url").value = hotel.img_url;

    // Mark form as edit mode
    hotelForm.dataset.editId = hotelId;
    hotelForm.querySelector("button[type='submit']").textContent = "Update Hotel";

    window.scrollTo({
    top: 0,
    behavior: 'smooth'
    });
  }
});

// Hotel form submit event (Add/Edit)
hotelForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const editId = hotelForm.dataset.editId; // If exists, we are editing

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
      // Edit mode → PUT
      res = await fetch(`${apiHotel}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hotelData)
      });
    } else {
      // Add mode → POST
      res = await fetch(apiHotel, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hotelData)
      });
    }

    if (res.ok) {
      alert(editId ? "Hotel updated ✅" : "Hotel added ✅");
      delete hotelForm.dataset.editId; // Clear edit mode
      hotelForm.querySelector("button[type='submit']").textContent = "Add Hotel";
      hotelForm.reset();
      await loadHotels(); // Reload list
      await cargarHoteles(); // Reload hotel select
    } else {
      alert(editId ? "Error updating hotel" : "Error adding hotel");
    }
  } catch (err) {
    console.error("Request error:", err);
  }
});


// CRUD for managing rooms

// Function to fill hotel select for rooms
async function cargarHoteles() {
  try {
    const response = await fetch(apiHotel); 
    const hoteles = await response.json();

    // Get the select by id
    const select = document.getElementById("hotel_id");

    // Reset options
    select.innerHTML = '<option value="">Select a hotel</option>';

    // Add each hotel as option
    hoteles.forEach(hotel => {
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

let rooms = []; // Global variable to store rooms

// Function to load rooms
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
        <img src="${room.img_url || 'https://static.vecteezy.com/system/resources/previews/012/942/784/non_2x/broken-image-icon-isolated-on-a-white-background-no-image-symbol-for-web-and-mobile-apps-free-vector.jpg'}" alt="Room image">
        <h3>Room ${room.number_room}</h3>
        <p>Hotel ID: ${room.id_hotel}</p>
        <p>Capacity: ${room.capacity}</p>
        <p>Price: $${room.price}</p>
        <p>Status: ${room.state}</p>
        <button class="edit" data-id="${room.id_room}">Edit</button>
        <button class="delete" data-id="${room.id_room}">Delete</button>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading rooms:", err);
  }
}

// Delete room
const roomContainer = document.getElementById("room-list");

roomContainer.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete")) {
    const roomId = e.target.dataset.id;
    if (confirm("Are you sure you want to delete this room?")) {
      try {
        const res = await fetch(`${apiRoom}/${roomId}`, {
          method: "DELETE"
        });
        if (res.ok) {
          alert("Room deleted ✅");
          await loadRooms();
        } else {
          alert("Error deleting room");
        }
      } catch (err) {
        console.error("Error DELETE:", err);
      }
    }
  }
});

// Listener for Edit buttons in rooms
roomContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    const roomId = Number(e.target.dataset.id);
    const room = rooms.find(r => r.id_room === roomId);

    if (!room) return alert("Room not found");

    // Fill the form with room data
    document.getElementById("hotel_id").value = room.id_hotel;
    document.getElementById("numero_habitacion").value = room.number_room;
    document.getElementById("capacidad").value = room.capacity;
    document.getElementById("precio").value = room.price;
    document.getElementById("room_img_url").value = room.img_url;
    document.getElementById("estado").value = room.state;

    // Mark form as edit mode
    habitacionForm.dataset.editId = roomId;
    habitacionForm.querySelector("button[type='submit']").textContent = "Update Room";

    window.scrollTo({
    top: 0,
    behavior: 'smooth'
    });
  }
});

// Listener for room form submit (Add/Edit)
habitacionForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const editId = habitacionForm.dataset.editId; // If exists → edit mode

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
      // Edit mode → PUT
      console.log("Editing room with ID:", editId, roomData);
      res = await fetch(`${apiRoom}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData)
      });
    } else {
      // Add mode → POST
      res = await fetch(apiRoom, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData)
      });
    }

    if (res.ok) {
      alert(editId ? "Room updated ✅" : "Room added ✅");
      habitacionForm.removeAttribute("data-edit-id");
      habitacionForm.querySelector("button[type='submit']").textContent = "Add Room";
      habitacionForm.reset();
      await loadRooms(); // Reload list
    } else {
      alert(editId ? "Error updating room" : "Error adding room");
    }
  } catch (err) {
    console.error("Request error:", err);
  }
});

// CRUD for managing activities

// Function to fill owner select for activities
async function cargarOwners() {
  try {
    const response = await fetch(apiOwners); 
    const owners = await response.json();

    const select = document.getElementById("actividad_owner");

    // Reset options
    select.innerHTML = '<option value="">Select an Owner</option>';

    // Add each owner as option
    owners.forEach(owner => {
      const option = document.createElement("option");
      option.value = owner.id_owner;
      option.textContent = owner.name;
      select.appendChild(option);
    });

  } catch (error) {
    console.error("Error loading owners:", error);
  }
}

// Call when page or section loads
document.addEventListener("DOMContentLoaded", cargarOwners, cargarHoteles, cargarOwnersHotels);

let activities = []; // Global variable to store activities

// Function to load activities
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
        <img src="${activity.img_url || 'https://static.vecteezy.com/system/resources/previews/012/942/784/non_2x/broken-image-icon-isolated-on-a-white-background-no-image-symbol-for-web-and-mobile-apps-free-vector.jpg'}" alt="Activity image">
        <h3>${activity.name}</h3>
        <p><strong>Description:</strong> ${activity.description || "No description"}</p>
        <p><strong>Price:</strong> $${activity.price}</p>
        <p><strong>Duration:</strong> ${activity.duration || "Not specified"}</p>
        <p><strong>Location:</strong> ${activity.place || "Not defined"}</p>
        <p><strong>Spots:</strong> ${activity.quota_available}</p>
        <p><strong>Owner ID:</strong> ${activity.id_owner}</p>
        <button class="edit" data-id="${activity.id_activity}">Edit</button>
        <button class="delete" data-id="${activity.id_activity}">Delete</button>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading activities:", err);
  }
}

// Delete activity
const activityContainer = document.getElementById("actividad-list");

activityContainer.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete")) {
    const activityId = e.target.dataset.id;
    if (confirm("Are you sure you want to delete this activity?")) {
      try {
        const res = await fetch(`${apiActivity}/${activityId}`, {
          method: "DELETE"
        });
        if (res.ok) {
          alert("Activity deleted ✅");
          await loadActivities(); // Reload list
        } else {
          alert("Error deleting activity");
        }
      } catch (err) {
        console.error("Error DELETE:", err);
      }
    }
  }
});

// Listener for Edit buttons in activities
activityContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    const activityId = Number(e.target.dataset.id);
    const activity = activities.find(a => a.id_activity === activityId);

    if (!activity) return alert("Activity not found");

    // Fill the form with activity data
    document.getElementById("actividad_nombre").value = activity.name;
    document.getElementById("actividad_descripcion").value = activity.description;
    document.getElementById("actividad_precio").value = activity.price;
    document.getElementById("actividad_img").value = activity.img_url;
    document.getElementById("actividad_lugar").value = activity.place;
    document.getElementById("actividad_duracion").value = activity.duration;
    document.getElementById("actividad_cupos").value = activity.quota_available;
    document.getElementById("actividad_owner").value = activity.id_owner;    

    // Mark form as edit mode
    actividadForm.dataset.editId = activityId;
    actividadForm.querySelector("button[type='submit']").textContent = "Update Activity";

    window.scrollTo({
    top: 0,
    behavior: 'smooth'
    });
  }
});

// Listener for activity form submit (Add/Edit)
actividadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const editId = actividadForm.dataset.editId; // If exists → edit mode

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

  console.log("Activity data:", activityData);

  try {
    let res;
    if (editId) {
      // Edit mode → PUT
      res = await fetch(`${apiActivity}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData)
      });
    } else {
      // Add mode → POST
      res = await fetch(apiActivity, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData)
      });
    }

    if (res.ok) {
      alert(editId ? "Activity updated ✅" : "Activity added ✅");
      delete actividadForm.dataset.editId; // Clear edit mode
      actividadForm.querySelector("button[type='submit']").textContent = "Add Activity";
      actividadForm.reset();
      await loadActivities(); // Reload list
    } else {
      alert(editId ? "Error updating activity" : "Error adding activity");
    }
  } catch (err) {
    console.error("Request error:", err);
  }
});

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

// Optionally: show "hoteles" section by default
showSection("hoteles");









