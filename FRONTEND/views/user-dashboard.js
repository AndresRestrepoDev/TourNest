document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");

  if (isLoggedIn !== "true" || role !== "user") {
    alert("Acceso no autorizado");
    window.location.href = "./login.html"; // vuelve al login
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear(); // elimina toda la sesión
  window.location.href = "./login.html"; // vuelve al login
});

