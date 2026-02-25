/*async function subirImagenCloudinary(file) {
  const CLOUD_NAME = "dehyt5u4e";
  const UPLOAD_PRESET = "servicios_preset";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();

  if (data.error) {
    console.error("Cloudinary error:", data.error);
    return null;
  }

  return data.secure_url || data.url;
}*/


async function actualizarServicios() {
  const contenedor = document.getElementById("servicios_Basicos");
  if (!contenedor) return;

  try {
    // Llamado al endpoint del backend
    const response = await fetch('http://localhost:8080/servicio');
    
    if (!response.ok) {
      throw new Error('Error al obtener los servicios');
    }
    
    const servicios = await response.json();
    contenedor.innerHTML = "";

    servicios.forEach((p) => {
      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-4 d-flex justify-content-center";

      col.innerHTML = `
        <div class="card-servicio rounded-5 p-4 h-100 d-flex flex-column align-items-center justify-content-between text-center">

          <div class="dog-mask mb-3">
            <img src="${p.imagen || 'default-image.jpg'}" class="img-básicos" alt="Imagen perro">
          </div>

          <h3 class="tercertitulo">
            ${p.nombre}
          </h3>

          <p class="descripcion">
            ${p.descripcion}
          </p>

          <p class="fw-bold">Tamaño:</p>

          <div class="d-flex justify-content-center gap-2 mb-3">
            <button class="btn-size" onclick="seleccionarPrecio(this, ${p.precioTamPequeno})">
              Pequeño
            </button>
            <button class="btn-size" onclick="seleccionarPrecio(this, ${p.precioTamMediano})">
              Mediano
            </button>
            <button class="btn-size" onclick="seleccionarPrecio(this, ${p.precioTamGrande})">
              Grande
            </button>
          </div>

          <p class="precio-final fw-bold fs-4">$<span>—</span></p>

          <button class="boton-login btn-agenda" onclick="agendar()">
            ¡Agenda ahora!
          </button>

        </div>
      `;

      contenedor.appendChild(col);
    });
  } catch (error) {
    console.error('Error al cargar los servicios:', error);
    contenedor.innerHTML = `
      <div class="col-12 text-center">
        <p class="text-danger">Error al cargar los servicios. Por favor, intenta nuevamente.</p>
      </div>
    `;
  }
}

function mostrarAlerta(mensaje, tipo = "success") {
  const alertContainer = document.getElementById("alertContainer");

  if (!alertContainer) {
    console.warn("alertContainer no existe en el DOM");
    return;
  }

  const alerta = document.createElement("div");
  alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
  alerta.role = "alert";
  alerta.innerHTML = `
    <strong>${
      tipo === "success"
        ? "¡Éxito!"
        : tipo === "danger"
          ? "¡Error!"
          : "¡Atención!"
    }</strong> ${mensaje}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  alertContainer.appendChild(alerta);

  setTimeout(() => {
    alerta.classList.remove("show");
    setTimeout(() => alerta.remove(), 150);
  }, 5000);
}

function mostrarValidaciones(id, mensaje) {
  const field = document.getElementById(id);
  const formFloating = field.closest(".form-floating");

  const errorElement = document.createElement("div");
  errorElement.className = "error-message text-danger mt-1 small";
  errorElement.textContent = mensaje;

  formFloating.appendChild(errorElement);

  field.classList.add("is-invalid");
}

function limpiarValidaciones() {
  document
    .querySelectorAll(".error-message")
    .forEach((error) => error.remove());
  document
    .querySelectorAll(".is-invalid")
    .forEach((field) => field.classList.remove("is-invalid"));
}

function limpiarFormulario() {
  const form = document.getElementById("formServicios");
  if (form) {
    form.reset();
  }
}

function limpiarAlertas() {
  const alertContainer = document.getElementById("alertContainer");
  alertContainer.innerHTML = "";
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

actualizarServicios();
