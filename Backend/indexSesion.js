const SPAWBK_API_URL = 'http://localhost:8080/auth';


document.getElementById("mostrarPass").addEventListener("click", function () {
  const pass = document.getElementById("password");
  // const eyeIcon = document.getElementById("eyeIcon");

  const eyeIcon = this.querySelector("i");
  const isPassword = pass.type === "password";

  // Cambiar tipo de input
  pass.type = isPassword ? "text" : "password";

  // cambia el icono del ojo
  eyeIcon.classList.toggle("bi-eye", !isPassword);
  eyeIcon.classList.toggle("bi-eye-slash", isPassword);
});

const formInicioSesion = document.getElementById('formInicioSesion');

if (formInicioSesion) {
  formInicioSesion.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const passwordUsuario = document.getElementById('password').value.trim();

    limpiarValidaciones();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      mostrarValidaciones("email", "Por favor ingresa un email válido.");
      return;
    }

    const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    if (!regexContrasena.test(passwordUsuario)) {
        mostrarValidaciones(
            "password", "La contraseña debe tener mínimo: 8 caracteres, incluir una mayúscula, una minúscula, un número y un caracter especial.");
        return false;
    }

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Iniciando sesión...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(`${SPAWBK_API_URL}/loginConDTO`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          passwordUsuario: passwordUsuario
        })
      });

      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        localStorage.setItem('jwt', JSON.stringify(data));

        const usuario = data.usuario;

        console.log('✅ Datos de usuario recibidos:', usuario);

        const usuarioActivoData = {
          idUsuario: usuario.idUsuario,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email
        };

        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivoData));
        localStorage.setItem('jwt', JSON.stringify(data)); 

        mostrarAlerta('exito', '<strong>¡Bienvenido a sPaw!</strong><br>Inicio de sesión exitoso.');

        setTimeout(() => {
          window.location.href = '../index.html';
        }, 1000);

      } else {
        const errorMessage = await response.text();
        mostrarAlerta('error', '<strong>Error en validación de credenciales.');
        //mostrarAlerta(`<strong>Error:</strong> ${errorMessage}`, "danger");
      }
    } catch (error) {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      mostrarAlerta('error', '<strong>Error de conexión.');
      //mostrarAlerta('<strong>Error de conexión con el servidor.</strong>', "danger");
    }
  });
}

/* function mostrarValidaciones(id, mensaje) {
  const field = document.getElementById(id);
  const formFloating = field.closest(".form-floating");

  const errorElement = document.createElement("div");
  errorElement.className = "error-message text-danger mt-1 small";
  errorElement.textContent = mensaje;

  formFloating.appendChild(errorElement);

  field.classList.add("is-invalid");
} */

/* function limpiarValidaciones() {
  document
    .querySelectorAll(".error-message")
    .forEach((error) => error.remove());
  document
    .querySelectorAll(".is-invalid")
    .forEach((field) => field.classList.remove("is-invalid"));
} */

/* function mostrarAlerta(mensaje, tipo) {
  const alertContainer = document.getElementById("alertContainer");

  const alerta = document.createElement("div");
  alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
  alerta.role = "alert";
  alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

  alertContainer.innerHTML = "";
  alertContainer.appendChild(alerta);

  setTimeout(() => {
    alerta.classList.remove("show");
    setTimeout(() => alerta.remove(), 150);
  }, 3000);
} */

function limpiarFormulario() {
  document.getElementById("formInicioSesion").reset();
}

// Quitar mensaje de advertencia al diligenciar campos de formulario
/* function validarCampo(campo) {
  if (campo.checkValidity() && campo.value.trim() !== "") {
    campo.classList.remove("is-invalid");
    campo.classList.add("is-valid");

    // elimina mensaje de error si existe
    const error = campo
      .closest(".form-floating")
      ?.querySelector(".error-message");

    if (error) error.remove();
  }
} */

document.addEventListener("DOMContentLoaded", () => {

  const campos = [
    "email",
    "password"
  ];

  inicializarValidacionCampos(campos);

});