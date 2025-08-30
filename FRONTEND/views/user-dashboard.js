const BACKEND_URL = "https://tournest-d2kq.onrender.com"; // Use your Render backend URL

document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");

  // Check if user is logged in and is user
  if (isLoggedIn !== "true" || role !== "user") {
    alert("Unauthorized access");
    window.location.href = "../index.html"; 
  }

  // Show user name
  const UserName = localStorage.getItem("name") || "User";
  document.getElementById("User-name").textContent = UserName;

  // Load hotels and activities on start
  loadUserHotels();
  loadUserActivities();
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../index.html";
});

// Sections and navigation
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

// Show hotels section by default
showSection("hoteles-disponibles");

// Container elements
const userHotelList = document.getElementById("user-hotel-list");
const userRoomList = document.getElementById("user-room-list");
const actividadList = document.getElementById("actividad-list");

// Load hotels
async function loadUserHotels() {
  userHotelList.innerHTML = "<p>Loading hotels...</p>";
  try {
    const res = await fetch(`${BACKEND_URL}/hotels`);
    if (!res.ok) throw new Error("Error loading hotels");
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
        <button class="view-rooms-btn" data-id="${hotel.id_hotel}">View Rooms</button>
      `;
      userHotelList.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    userHotelList.innerHTML = "<p>Error loading hotels</p>";
  }
}

// 1. Get references to the new modal
const modalProximamente = document.getElementById("modal-proximamente");
const closeBtn = document.querySelector("#modal-proximamente .close");

// 2. Listen for clicks in the parent container of rooms
document.getElementById("user-room-list").addEventListener("click", (event) => {
  // 3. Check if the click was on an element with the class .Modal-Reservas
  if (event.target.classList.contains("Modal-Reservas")) {
    event.preventDefault(); // Prevent link from reloading the page
    modalProximamente.style.display = "block"; // Show modal
  }
});

// 4. Logic to close the modal
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    modalProximamente.style.display = "none";
  });
}

// 5. Close the modal when clicking outside the content
window.addEventListener('click', (event) => {
  if (event.target === modalProximamente) {
    modalProximamente.style.display = "none";
  }
});

// Load rooms by hotel
async function loadRooms(hotelId) {
  userRoomList.innerHTML = "<p>Loading rooms...</p>";
  try {
    const res = await fetch(`${BACKEND_URL}/rooms/hotel/${hotelId}`);
    if (!res.ok) throw new Error("Error loading rooms");
    const rooms = await res.json();

    userRoomList.innerHTML = "";
    rooms.forEach(room => {
      const card = document.createElement("div");
      card.classList.add("room-card");
      card.innerHTML = `
        <img src="${room.img_url || 'https://static.vecteezy.com/system/resources/previews/012/942/784/non_2x/broken-image-icon-isolated-on-a-white-background-no-image-symbol-for-web-and-mobile-apps-free-vector.jpg'}" alt="Room">
        <h4>Room ${room.number_room}</h4>
        <p>Capacity: ${room.capacity}</p>
        <p>Price: $${room.price}</p>
        <p>Status: ${room.state}</p>
        <a href="#" class="Modal-Reservas">Reserve</a>
      `;
      userRoomList.appendChild(card);
    });

    // Show rooms section
    showSection("habitaciones-disponibles");
  } catch (err) {
    console.error(err);
    userRoomList.innerHTML = "<p>Error loading rooms</p>";
  }
}

// Click on "View Rooms" button
userHotelList.addEventListener("click", (e) => {
  if (e.target.classList.contains("view-rooms-btn")) {
    const hotelId = e.target.dataset.id;
    loadRooms(hotelId);
  }
});

// Button to go back to hotels
document.getElementById("back-to-hotels").addEventListener("click", () => {
  showSection("hoteles-disponibles");
});

// 2. Listen for clicks in the parent container of activities
document.getElementById("actividad-list").addEventListener("click", (event) => {
  // 3. Check if the click was on an element with the class .Modal-Reservas
  if (event.target.classList.contains("Modal-Reservas")) {
    event.preventDefault(); // Prevent link from reloading the page
    modalProximamente.style.display = "block"; // Show modal
  }
});

// 4. Logic to close the modal
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    modalProximamente.style.display = "none";
  });
}

// 5. Close the modal when clicking outside the content
window.addEventListener('click', (event) => {
  if (event.target === modalProximamente) {
    modalProximamente.style.display = "none";
  }
});

// Load activities
async function loadUserActivities() {
  actividadList.innerHTML = "<p>Loading activities...</p>";
  try {
    const res = await fetch(`${BACKEND_URL}/activitys`);
    if (!res.ok) throw new Error("Error loading activities");
    const activities = await res.json();

    actividadList.innerHTML = "";
    activities.forEach(act => {
      const card = document.createElement("div");
      card.classList.add("actividad-card");
      card.innerHTML = `
        <img src="${act.img_url || 'https://static.vecteezy.com/system/resources/previews/012/942/784/non_2x/broken-image-icon-isolated-on-a-white-background-no-image-symbol-for-web-and-mobile-apps-free-vector.jpg'}">
        <h3>${act.name}</h3>
        <p>${act.description}</p>
        <p><strong>Price:</strong> $${act.price}</p>
        <p><strong>Duration:</strong> ${act.duration || "Not specified"}</p>
        <p><strong>Location:</strong> ${act.place || "Not specified"}</p>
        <p><strong>Available spots:</strong> ${act.quota_available}</p>
        <a href="#" class="Modal-Reservas">Reserve</a>
      `;
      actividadList.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    actividadList.innerHTML = "<p>Error loading activities</p>";
  }
}


