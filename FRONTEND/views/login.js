document.addEventListener("DOMContentLoaded", () => {
  // --------------------
  // LOGIN
  // --------------------
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
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
          localStorage.setItem("id", data.id);
          localStorage.setItem("name", data.name);

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
  }

  // --------------------
  // REGISTRO
  // --------------------
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Capturar datos del formulario
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const documentNumber = document.getElementById("document").value.trim();
      const date_birth = document.getElementById("date_birth").value;
      const phone = document.getElementById("phone").value.trim();

      // Validación de contraseñas
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }

      const newUser = {
        name,
        email,
        password,
        document: documentNumber,
        date_birth,
        phone,
        role: "user" // Rol por defecto
      };

      try {
        const res = await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser)
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Error al registrar usuario");
        }

        alert("Usuario registrado correctamente");
        registerForm.reset();
        window.location.href = "./login.html";
      } catch (err) {
        console.error(err);
        alert(`Error: ${err.message}`);
      }
    });
  }
});
