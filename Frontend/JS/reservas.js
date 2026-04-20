document.addEventListener("DOMContentLoaded", function () {
  const API_URL = "http://localhost:8080";

  flatpickr.localize(flatpickr.l10ns.es);

  let picker = flatpickr("#fechaReserva", {
    locale: "es",
    minDate: "today",
    maxDate: new Date().fp_incr(90),
    dateFormat: "d-m-Y",
    altInput: false,
    allowInput: false,
    disableMobile: false,

    onChange: function (selectedDates, dateStr) {
      const fechaInput = document.getElementById("fechaReserva");
      if (dateStr) {
        fechaInput.classList.remove("is-invalid");
        fechaInput.classList.add("is-valid");
      } else {
        fechaInput.classList.remove("is-valid");
        fechaInput.classList.add("is-invalid");
      }
      // ─── NUEVO: al cambiar la fecha, actualizar horarios disponibles ───
      actualizarHorariosDisponibles();
    },
  });

  const btnReservar = document.getElementById("btnReservar");
  const inputNombreMascota = document.getElementById("nombreMascota");
  const inputTamanoMascota = document.getElementById("tamanoMascota");
  const inputNombreGroomer = document.getElementById("nombreGroomer");
  const inputNombreServicio = document.getElementById("nombreServicio");
  const inputFechaReserva = document.getElementById("fechaReserva");
  const inputHoraReserva = document.getElementById("horaReserva");

  // ─── NUEVO: al cambiar el groomer, actualizar horarios disponibles ────────
  if (inputNombreGroomer) {
    inputNombreGroomer.addEventListener("change", () => {
      actualizarHorariosDisponibles();
    });
  }

  btnReservar.addEventListener("click", function (e) {
    e.preventDefault();

    limpiarValidaciones();

    const selectMascota = document.getElementById("nombreMascota");
    const selectGroomer = document.getElementById("nombreGroomer");
    const selectServicio = document.getElementById("nombreServicio");
    const inputFecha = document.getElementById("fechaReserva");
    const selectHora = document.getElementById("horaReserva");

    if (
      !selectMascota ||
      !selectGroomer ||
      !selectServicio ||
      !inputFecha ||
      !selectHora
    ) {
      return false;
    }

    const nombreMascota = selectMascota.value.trim();
    const nombreGroomer = selectGroomer.value.trim();
    const nombreServicio = selectServicio.value.trim();
    const fechaReserva = inputFecha.value.trim();
    const horaReserva = selectHora.value.trim();

    if (nombreMascota === "" || nombreMascota === null) {
      mostrarValidaciones("nombreMascota", "Por favor selecciona una mascota");
      return false;
    }
    if (nombreGroomer === "") {
      mostrarValidaciones("nombreGroomer", "Por favor selecciona un groomer");
      return false;
    }
    if (nombreServicio === "") {
      mostrarValidaciones("nombreServicio", "Por favor selecciona un servicio");
      return false;
    }
    if (fechaReserva === "") {
      mostrarValidaciones(
        "fechaReserva",
        "Por favor selecciona una fecha para la reserva",
      );
      return false;
    }
    if (horaReserva === "") {
      mostrarValidaciones(
        "horaReserva",
        "Por favor selecciona un horario disponible",
      );
      return false;
    }

    mostrarAlerta("exito", "Todos los campos son válidos.");

    procesarReserva({
      nombreMascota,
      fechaReserva,
      horaReserva,
    });
    return true;
  });

  // =========================================================================
  // NUEVO: Consulta de disponibilidad al backend
  // =========================================================================

  /**
   * Convierte la fecha del formato d-m-Y (flatpickr) al formato YYYY-MM-DD
   * que espera el backend.
   */
  function parsearFecha(fechaStr) {
    if (!fechaStr) return null;
    const [dia, mes, anio] = fechaStr.split("-");
    if (!dia || !mes || !anio) return null;
    return `${anio}-${mes}-${dia}`;
  }

  /**
   * Llama a /reservas/disponibilidad y devuelve un array de strings "HH:mm"
   * con los horarios libres. Devuelve [] si falta groomer o fecha.
   */
  async function consultarDisponibilidad(fechaISO, idGroomer) {
    try {
      const url = `${API_URL}/reservas/disponibilidad?fecha=${fechaISO}&idGroomer=${idGroomer}`;
      const response = await fetchAutenticado(url);

      if (!response.ok) {
        console.warn("Error consultando disponibilidad:", response.status);
        return [];
      }

      const data = await response.json();

      // El backend puede devolver { mensaje: "No hay horarios..." } cuando está lleno
      if (!Array.isArray(data)) {
        return [];
      }

      // El backend devuelve ["09:00:00", "10:00:00", ...] — recortamos a "HH:mm"
      return data.map((h) => h.substring(0, 5));
    } catch (error) {
      console.error("Error en consultarDisponibilidad:", error);
      return [];
    }
  }

  /**
   * Lee groomer y fecha del formulario, consulta la API y repuebla
   * el select #horaReserva con solo los horarios disponibles.
   * También renderiza la agenda visual del groomer.
   */
  async function actualizarHorariosDisponibles() {
    const selectGroomer = document.getElementById("nombreGroomer");
    const inputFecha = document.getElementById("fechaReserva");
    const selectHora = document.getElementById("horaReserva");

    if (!selectGroomer || !inputFecha || !selectHora) return;

    const idGroomer = selectGroomer.value;
    const fechaISO = parsearFecha(inputFecha.value.trim());

    // Si falta uno de los dos, resetear el select, ocultar agenda y salir
    if (!idGroomer || !fechaISO) {
      resetearSelectHora(selectHora, "Primero selecciona groomer y fecha");
      ocultarAgenda();
      return;
    }

    // Indicador visual de carga en el select
    selectHora.disabled = true;
    selectHora.innerHTML =
      '<option value="" disabled selected>Consultando disponibilidad...</option>';

    // Mostrar spinner en agenda
    mostrarCargaAgenda(inputFecha.value.trim());

    // Consultar al backend los horarios libres
    const horariosLibres = await consultarDisponibilidad(fechaISO, idGroomer);

    // Todos los turnos posibles del día (09:00 a 17:00)
    const todosLosTurnos = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ];

    // Renderizar agenda visual
    renderizarAgendaGroomer(todosLosTurnos, horariosLibres);

    // Repoblar select de hora
    selectHora.innerHTML = "";

    if (horariosLibres.length === 0) {
      selectHora.innerHTML =
        '<option value="" disabled selected>Sin disponibilidad para este día</option>';
      selectHora.disabled = true;
      mostrarEstadoDisponibilidad("sin-horarios");
    } else {
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.disabled = true;
      placeholder.selected = true;
      placeholder.textContent = `${horariosLibres.length} horario(s) disponible(s)`;
      selectHora.appendChild(placeholder);

      horariosLibres.forEach((hora) => {
        const option = document.createElement("option");
        option.value = hora;
        option.textContent = hora;
        selectHora.appendChild(option);
      });

      selectHora.disabled = false;
      mostrarEstadoDisponibilidad("con-horarios", horariosLibres.length);
    }
  }

  /**
   * Renderiza los slots del día como badges ocupado/libre
   * dentro del bloque #agenda-groomer del HTML.
   */
  function renderizarAgendaGroomer(todosLosTurnos, horariosLibres) {
    const contenedor = document.getElementById("agenda-groomer");
    const slotsDiv = document.getElementById("agenda-slots");
    const loadingDiv = document.getElementById("agenda-loading");

    if (!contenedor || !slotsDiv) return;

    // Ocultar spinner y mostrar panel
    if (loadingDiv) loadingDiv.classList.add("d-none");
    contenedor.classList.remove("d-none");
    slotsDiv.innerHTML = "";

    todosLosTurnos.forEach((turno) => {
      const libre = horariosLibres.includes(turno);
      const slot = document.createElement("div");
      slot.className = `agenda-slot ${libre ? "libre" : "ocupado"}`;
      slot.innerHTML = libre
        ? `<i class="bi bi-check-circle-fill"></i> ${turno}`
        : `<i class="bi bi-x-circle-fill"></i> ${turno}`;
      slotsDiv.appendChild(slot);
    });
  }

  /** Muestra el panel de agenda con spinner mientras carga */
  function mostrarCargaAgenda(fechaTexto) {
    const contenedor = document.getElementById("agenda-groomer");
    const loadingDiv = document.getElementById("agenda-loading");
    const slotsDiv = document.getElementById("agenda-slots");
    const tituloSpan = document.getElementById("agenda-fecha-titulo");

    if (!contenedor) return;
    contenedor.classList.remove("d-none");
    if (tituloSpan) tituloSpan.textContent = fechaTexto;
    if (loadingDiv) loadingDiv.classList.remove("d-none");
    if (slotsDiv) slotsDiv.innerHTML = "";
  }

  /** Oculta el panel de agenda */
  function ocultarAgenda() {
    const contenedor = document.getElementById("agenda-groomer");
    if (contenedor) contenedor.classList.add("d-none");
  }

  /**
   * Muestra un badge/mensaje debajo del select de hora
   * informando el estado de la disponibilidad.
   */
  function mostrarEstadoDisponibilidad(estado, cantidad = 0) {
    // Buscar o crear el elemento de feedback
    let feedback = document.getElementById("disponibilidad-feedback");
    if (!feedback) {
      feedback = document.createElement("div");
      feedback.id = "disponibilidad-feedback";
      feedback.className = "form-text mt-1";
      const selectHora = document.getElementById("horaReserva");
      selectHora.parentNode.insertBefore(feedback, selectHora.nextSibling);
    }

    if (estado === "sin-horarios") {
      feedback.innerHTML =
        '<span class="badge bg-danger">⚠ No hay turnos disponibles para este groomer en la fecha seleccionada</span>';
    } else if (estado === "con-horarios") {
      feedback.innerHTML = `<span class="badge bg-success">✓ ${cantidad} turno(s) disponible(s)</span>`;
    } else {
      feedback.innerHTML = "";
    }
  }

  /** Resetea el select de hora a su estado inicial */
  function resetearSelectHora(selectHora, mensaje = "Selecciona una hora") {
    selectHora.innerHTML = `<option value="" disabled selected>${mensaje}</option>`;
    selectHora.disabled = false;
    mostrarEstadoDisponibilidad("");
  }

  // =========================================================================
  // Funciones existentes (sin modificar)
  // =========================================================================

  function obtenerToken() {
    const jwtData = localStorage.getItem("jwt");
    if (jwtData) {
      try {
        const jwt = JSON.parse(jwtData);
        if (jwt.token) return jwt.token;
      } catch (e) {
        return jwtData;
      }
    }
    return (
      localStorage.getItem("token") || sessionStorage.getItem("token") || null
    );
  }

  async function fetchAutenticado(url, options = {}) {
    const token = obtenerToken();
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const response = await fetch(url, { ...options, headers });
      return response;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  function calcularHoraFinal(horaInicio) {
    const [horas, minutos] = horaInicio.split(":").map(Number);
    const horaFinal = new Date();
    horaFinal.setHours(horas + 1, minutos, 0);
    return `${horaFinal.getHours().toString().padStart(2, "0")}:${horaFinal.getMinutes().toString().padStart(2, "0")}:00`;
  }

  async function obtenerUsuarioId() {
    const usuarioActivoStr = localStorage.getItem("usuarioActivo");
    if (!usuarioActivoStr) return null;
    try {
      const usuarioActivo = JSON.parse(usuarioActivoStr);
      return usuarioActivo.idUsuario || null;
    } catch {
      return null;
    }
  }

  async function obtenerMascotasUsuario(usuarioId) {
    try {
      const response = await fetchAutenticado(
        `${API_URL}/mascotas/usuario/${usuarioId}`,
      );
      if (response.ok) return await response.json();
      return [];
    } catch (error) {
      console.error("Error obteniendo mascotas:", error);
      return [];
    }
  }

  async function obtenerServicios() {
    try {
      const response = await fetch(`${API_URL}/servicio`);
      if (response.ok) return await response.json();
      return [];
    } catch (error) {
      console.error("Error en obtenerServicios:", error);
      return [];
    }
  }

  async function obtenerGroomers() {
    try {
      const response = await fetchAutenticado(`${API_URL}/groomers`);
      if (response.ok) return await response.json();
      return [];
    } catch (error) {
      console.error("Error obtenerGroomers:", error);
      return [];
    }
  }

  async function cargarMascotasUsuario() {
    const usuarioId = await obtenerUsuarioId();
    if (!usuarioId) return;

    const mascotas = await obtenerMascotasUsuario(usuarioId);
    if (!mascotas || mascotas.length === 0) return;

    const selectElement = document.getElementById("nombreMascota");
    if (!selectElement) return;

    selectElement.innerHTML = '<option value="" disabled selected></option>';
    mascotas.forEach((mascota) => {
      const option = document.createElement("option");
      option.value = mascota.idMascota;
      option.textContent = mascota.nombreMascota;
      selectElement.appendChild(option);
    });

    selectElement.addEventListener("change", () => validarCampo(selectElement));
  }

  async function cargarServicios() {
    try {
      const selectServicio = document.getElementById("nombreServicio");
      const servicios = await obtenerServicios();
      if (!servicios || servicios.length === 0 || !selectServicio) return;

      selectServicio.innerHTML = '<option value="" disabled selected></option>';
      servicios.forEach((servicio, index) => {
        const nombre =
          servicio.nombre || servicio.nombreServicio || `Servicio ${index + 1}`;
        const id = servicio.idServicio || index;
        const option = document.createElement("option");
        option.value = id;
        option.textContent = nombre;
        selectServicio.appendChild(option);
      });
    } catch (error) {
      console.error("Error en cargarServicios:", error);
    }
  }

  async function cargarGroomers() {
    try {
      const groomers = await obtenerGroomers();
      const selectGroomer = document.getElementById("nombreGroomer");
      if (!selectGroomer) return;

      selectGroomer.innerHTML = '<option value="" disabled selected></option>';
      groomers.forEach((groomer) => {
        const option = document.createElement("option");
        option.value = groomer.idGroomer;
        option.textContent = `${groomer.nombre} ${groomer.apellido}`;
        selectGroomer.appendChild(option);
      });
    } catch (error) {
      console.error("Error cargando groomers:", error);
    }
  }

  async function procesarReserva(datosReserva) {
    try {
      const usuarioId = await obtenerUsuarioId();
      if (!usuarioId) {
        mostrarAlerta("error", "Debes iniciar sesión para hacer una reserva");
        return;
      }

      const mascotaId = datosReserva.nombreMascota;
      if (!mascotaId) {
        mostrarAlerta("error", "Por favor selecciona una mascota");
        return;
      }

      const mascotas = await obtenerMascotasUsuario(usuarioId);
      if (mascotas.length === 0) {
        mostrarAlerta("error", "No tienes mascotas registradas.");
        return;
      }

      const mascotaSeleccionada = mascotas.find(
        (m) => m.idMascota == mascotaId,
      );
      if (!mascotaSeleccionada) {
        mostrarAlerta("error", "No se encontró la mascota seleccionada.");
        return;
      }

      const [groomers, servicios] = await Promise.all([
        obtenerGroomers(),
        obtenerServicios(),
      ]);

      const groomerSelect = document.getElementById("nombreGroomer");
      const servicioSelect = document.getElementById("nombreServicio");

      const groomerId = parseInt(groomerSelect.value);
      const groomerSeleccionado = groomers.find(
        (g) => g.idGroomer === groomerId || g.idGroomer == groomerId,
      );

      if (!groomerSeleccionado) {
        mostrarAlerta("error", "No se encontró el groomer seleccionado");
        return;
      }

      const servicioId = parseInt(servicioSelect.value);
      const servicioSeleccionado = servicios.find(
        (s) => s.idServicio == servicioId,
      );

      if (!servicioSeleccionado) {
        mostrarAlerta("error", "No se encontró el servicio seleccionado");
        return;
      }

      const [dia, mes, anio] = datosReserva.fechaReserva.split("-");
      const fechaFormateada = `${anio}-${mes}-${dia}`;

      const reservaData = {
        fecha: fechaFormateada,
        horaInicio: datosReserva.horaReserva + ":00",
        horaFinal: calcularHoraFinal(datosReserva.horaReserva),
        groomer: { idGroomer: groomerSeleccionado.idGroomer },
        servicio: { idServicio: servicioSeleccionado.idServicio },
        mascota: { idMascota: mascotaSeleccionada.idMascota },
      };

      const response = await fetchAutenticado(
        `${API_URL}/reservas/usuario/${usuarioId}/crear`,
        { method: "POST", body: JSON.stringify(reservaData) },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${errorText}`);
      }

      mostrarAlerta("exito", "¡Reserva creada exitosamente!");
      limpiarFormulario();

      // Resetear select de hora
      const selectHora = document.getElementById("horaReserva");
      if (selectHora)
        resetearSelectHora(selectHora, "Selecciona groomer y fecha primero");

      // Ocultar panel de agenda
      ocultarAgenda();

      // Ocultar el formulario
      const seccionReserva = document.getElementById("seccionReserva");
      if (seccionReserva) seccionReserva.classList.add("d-none");

      // Restaurar texto del botón principal
      const btnReserva = document.getElementById("btnReserva");
      if (btnReserva) {
        btnReserva.style.display = "block";
        btnReserva.textContent = "Hacer otra Reserva";
      }

      await mostrarReservasUsuario();
    } catch (error) {
      mostrarAlerta("error", error.message);
    }
  }

  async function mostrarReservasUsuario() {
    try {
      const usuarioId = await obtenerUsuarioId();
      if (!usuarioId) {
        document.getElementById("servicio-reservado").innerHTML =
          '<div class="alert alert-warning">Debes iniciar sesión para ver tus reservas</div>';
        return;
      }

      const response = await fetchAutenticado(
        `${API_URL}/reservas/usuario/${usuarioId}`,
      );
      if (!response.ok)
        throw new Error(`Error ${response.status}: ${response.statusText}`);

      const reservasUsuario = await response.json();
      const contenedor = document.getElementById("servicio-reservado");

      if (!reservasUsuario || reservasUsuario.length === 0) {
        contenedor.innerHTML = `
                    <div class="col-12 text-center py-5 w-100">
                        <div class="d-flex flex-column align-items-center justify-content-center">
                            <i class="bi bi-calendar-x display-1 text-muted mb-3"></i>
                            <h4 class="text-muted mb-2">No tienes reservas</h4>
                            <p class="text-muted mb-4">¡Agenda tu primera cita para consentir a tu mascota!</p>
                            <button class="boton-login" onclick="nuevaReserva()">Hacer mi primera reserva</button>
                        </div>
                    </div>`;
        const boton = document.getElementById("btnReserva");
        if (boton) boton.style.display = "none";
        return;
      }

      contenedor.innerHTML = "";

      reservasUsuario.forEach((reserva) => {
        const servicioNombre =
          reserva.servicio?.nombre ||
          reserva.servicio?.nombreServicio ||
          "Servicio no disponible";
        const mascotaNombre =
          reserva.mascota?.nombreMascota ||
          reserva.mascota?.nombre ||
          "Mascota no disponible";
        const mascotaTamano =
          reserva.mascota?.tamanoMascota ||
          reserva.mascota?.tamano ||
          "No especificado";
        const groomerNombre = reserva.groomer
          ? `${reserva.groomer.nombre || ""} ${reserva.groomer.apellido || ""}`.trim()
          : "Groomer no disponible";

        let fechaFormateada = "";
        if (reserva.fecha) {
          const [anio, mes, dia] = reserva.fecha.split("-");
          fechaFormateada = `${dia}-${mes}-${anio}`;
        }

        let horaFormateada = reserva.horaInicio || "";
        if (horaFormateada.includes(":"))
          horaFormateada = horaFormateada.substring(0, 5);

        const card = document.createElement("reserva-card");
        card.setAttribute("nombreServicio", servicioNombre);
        card.setAttribute("nombreMascota", mascotaNombre);
        card.setAttribute("tamanoMascota", mascotaTamano);
        card.setAttribute("nombreGroomer", groomerNombre);
        card.setAttribute("fechaReserva", fechaFormateada);
        card.setAttribute("horaReserva", horaFormateada);
        card.setAttribute("idReserva", reserva.idReserva);
        contenedor.appendChild(card);
      });

      const boton = document.getElementById("btnReserva");
      if (boton) {
        boton.style.display = "block";
        boton.textContent = "Hacer otra reserva";
      }
    } catch (error) {
      document.getElementById("servicio-reservado").innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error:</strong> No se pudieron cargar tus reservas.
                    <small>${error.message}</small>
                </div>`;
    }
  }

  document.addEventListener("click", async function (e) {
    const botonEliminar = e.target.closest(".eliminar-reserva");
    if (!botonEliminar) return;

    e.preventDefault();
    const idReserva = parseInt(botonEliminar.dataset.id);
    if (!idReserva) return;

    const confirmacion = await mostrarAlerta(
      "confirmar",
      "¿Eliminar esta reserva?<br><small>¡Esta acción no se puede deshacer!</small>",
      { botonConfirmar: "Sí, eliminar" },
    );

    if (!confirmacion.isConfirmed) return;

    try {
      const response = await fetchAutenticado(
        `${API_URL}/reservas/eliminar/${idReserva}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del servidor: ${errorText}`);
      }

      const card = botonEliminar.closest("reserva-card");
      if (card) {
        card.style.opacity = "0";
        card.style.transform = "translateY(-20px)";
        card.style.transition = "all 0.3s ease";
        setTimeout(() => {
          card.remove();
          const contenedor = document.getElementById("servicio-reservado");
          const cardsRestantes =
            contenedor.querySelectorAll("reserva-card").length;
          if (cardsRestantes === 0) mostrarReservasUsuario();
        }, 300);
      }

      mostrarAlerta("exito", "La reserva ha sido eliminada correctamente.");
    } catch (error) {
      mostrarAlerta("error", `Error al eliminar la reserva: ${error.message}`);
    }
  });

  function limpiarFormulario() {
    document.getElementById("formReserva").reset();
  }

  // Inicialización
  cargarMascotasUsuario();
  cargarGroomers();
  cargarServicios();
  mostrarReservasUsuario();

  // Dejar el select de hora deshabilitado hasta que se elija groomer + fecha
  const selectHoraInicial = document.getElementById("horaReserva");
  if (selectHoraInicial) {
    resetearSelectHora(selectHoraInicial, "Selecciona groomer y fecha primero");
  }
});

function nuevaReserva() {
  const seccion = document.getElementById("seccionReserva");
  seccion.classList.toggle("d-none");
  seccion.scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  const campos = [
    "nombreMascota",
    "nombreGroomer",
    "nombreServicio",
    "fechaReserva",
    "horaReserva",
  ];
  inicializarValidacionCampos(campos);
});
