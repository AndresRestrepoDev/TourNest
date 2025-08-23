document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email_login").value;
  const password = document.getElementById("password_login").value;

  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    

    if (res.ok) {

      // Guardamos sesión en localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", data.role);
      
      // Redirección según rol
      if (data.role === "ceo") {
        window.location.href = "../views/ceo-dashboard.html";
      } else if (data.role === "owner") {
        window.location.href = "../views/owner-dashboard.html";
      } else if (data.role === "user") {
        window.location.href = "../views/user-dashboard.html";
      }
    } else {
      alert(data.message || "Credenciales incorrectas");
    }
  } catch (err) {
    console.error(err);
    alert("Error en el servidor, intenta de nuevo");
  }
});
