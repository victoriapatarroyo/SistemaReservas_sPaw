document.addEventListener("DOMContentLoaded", () => {

  const btnLogin = document.getElementById("btnLogin");
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  const jwt = localStorage.getItem("jwt");

  if (btnLogin && usuarioActivo?.nombre && jwt) {
    // Determinar si el usuario es administrador
    const esAdmin = usuarioActivo.email === "administrador01@spaw.com";    

    // Generar el menú según el perfil del usuario
    const opcionMenu = esAdmin 
      ? `<li>
          <a class="dropdown-item" href="../ADMIN/index.html" id="">
            Administración
          </a>
        </li>`
      : `<li>
          <a class="dropdown-item" href="../HTML/misReservas.html" id="">
            Mis reservas
          </a>
        </li>`;
    
    btnLogin.outerHTML = `
      <div class="nav-item dropdown">
        <a class="boton-login dropdown-toggle d-flex align-items-center"
          id="btnLogin"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false">
          <i class="bi bi-person-circle me-2"></i>
          ${capitalizeFirstLetter(usuarioActivo.nombre)}
        </a>
        <ul class="dropdown-menu dropdown-menu-end list-unstyled">
          ${opcionMenu}
          <li>
            <a class="dropdown-item" href="#" id="cerrarSesion">
              Cerrar sesión
            </a>
          </li>
        </ul>
      </div>
    `;

    setTimeout(() => {
      const cerrarSesion = document.getElementById("cerrarSesion");

      if (cerrarSesion) {
        cerrarSesion.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("usuarioActivo");
          localStorage.removeItem("jwt");
          window.location.href = "../../index.html";
        });
      }
    }, 0);
  }

  const botonesAgenda = document.querySelectorAll(".btn-agenda");

  if (botonesAgenda.length) {
    botonesAgenda.forEach(boton => {
      boton.addEventListener("click", () => {

        if (usuarioActivo?.nombre) {
          window.location.href = "../HTML/reservas.html";
        } else {
          window.location.href = "../HTML/inicioSesion.html";
        }
      });
    });
  }

});

function capitalizeFirstLetter(string) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
}

function seleccionarPrecio(btn, precio) {
  const card = btn.closest(".card-servicio");

  card.querySelectorAll(".btn-size").forEach(b =>
    b.classList.remove("active")
  );

  btn.classList.add("active");

  const spanPrecio = card.querySelector(".precio-final span");
  spanPrecio.textContent = precio.toLocaleString("es-CO");
}


