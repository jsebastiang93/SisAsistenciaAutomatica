document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita que el formulario se envíe normalmente
  
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorDisplay = document.getElementById('loginError');
  
    // Usuario válido (puedes cambiarlo)
    const validEmail = "admin@unicatolica.edu.co";
    const validPassword = "123456";
  
    if (email === validEmail && password === validPassword) {
      // Redirigir al dashboard
      window.location.href = "dashboard.html";
    } else {
      // Mostrar error
      errorDisplay.textContent = "Correo o contraseña incorrectos.";
      errorDisplay.style.color = "red";
    }
  });
  