const BACKEND_URL = "https://tournest-d2kq.onrender.com";

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
        const res = await fetch(`${BACKEND_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
          // Save session in localStorage
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("role", data.role);
          localStorage.setItem("id", data.id);
          localStorage.setItem("name", data.name);

          // Redirect according to role
          if (data.role === "ceo") {
            window.location.href = "../views/ceo-dashboard.html";
          } else if (data.role === "owner") {
            window.location.href = "../views/owner-dashboard.html";
          } else if (data.role === "user") {
            window.location.href = "../views/user-dashboard.html";
          }
        } else {
          alert(data.message || "Incorrect credentials");
        }
      } catch (err) {
        console.error(err);
        alert("Server error, please try again");
      }
    });
  }

  // --------------------
  // REGISTER
  // --------------------
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Capture form data
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const documentNumber = document.getElementById("document").value.trim();
      const date_birth = document.getElementById("date_birth").value;
      const phone = document.getElementById("phone").value.trim();

      // Password validation
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const newUser = {
        name,
        email,
        password,
        document: documentNumber,
        date_birth,
        phone,
        role: "user" // Default role
      };

      try {
        const res = await fetch(`${BACKEND_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser)
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Error registering user");
        }

        alert("User registered successfully");
        registerForm.reset();
        window.location.href = "./login.html";
      } catch (err) {
        console.error(err);
        alert(`Error: ${err.message}`);
      }
    });
  }
});
