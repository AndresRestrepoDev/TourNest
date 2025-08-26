const apiHotel = "http://localhost:5000/hotels";

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



// Vamos a mostrar mis hoteles
async function loadHotels() {
  const ownerId = localStorage.getItem("id"); 
  const container = document.getElementById("hotel-list");
  container.innerHTML = "";

  try {
    const response = await fetch(`http://localhost:5000/hotels/owner/${ownerId}`);
    if (!response.ok) throw new Error("Error en la respuesta del servidor: " + response.status);

    const hotels = await response.json();

    hotels.forEach(hotel => {
      const card = document.createElement("div");
      card.classList.add("hotel-card");
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

// Se llama al cargar la página
document.addEventListener("DOMContentLoaded", loadHotels);


//eliminar hotel
const container = document.getElementById("hotel-list");
container.addEventListener("click", async (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const idHotel = e.target.dataset.id;
        const confirmDelete = confirm("¿Seguro que deseas eliminar este hotel?");
        if (!confirmDelete) return;

        try {
          const res = await fetch(`http://localhost:5000/hotels/${idHotel}`, {
            method: "DELETE",
          });

          if (res.ok) {
            alert("Hotel eliminado con éxito");
            // 🟢 Eliminar la tarjeta sin recargar
            e.target.parentElement.remove();
          } else {
            alert("Error al eliminar el hotel");
          }
        } catch (err) {
          console.error("Error eliminando hotel:", err);
        }
      }
  });

// agregar hotel con el id del owner logueado
const hotelForm = document.getElementById("hotelForm");
hotelForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const ownerId = localStorage.getItem("id");
  const name = document.getElementById("hotel_nombre").value;
  const city = document.getElementById("hotel_ciudad").value;
  const description = document.getElementById("hotel_descripcion").value;
  const rating = (document.getElementById("hotel_rating").value);
  const imgUrl = document.getElementById("hotel_img_url").value;

  const newHotel = {
    id_owner: parseInt(ownerId),
    name,
    description,
    city,
    rating_average: parseFloat(rating),
    img_url: imgUrl
  };

  try {
    const response = await fetch(apiHotel, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newHotel)
    });

    if (response.ok) {
      alert("Hotel agregado con éxito");
      hotelForm.reset();
      loadHotels(); // Recargar la lista de hoteles
    } else {
      alert("Error al agregar el hotel");
    }
  } catch (error) {
    console.error("Error al agregar el hotel:", error);
  }
});

//editar hotel











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
  