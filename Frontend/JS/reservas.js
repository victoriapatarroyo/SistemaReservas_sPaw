document.addEventListener('DOMContentLoaded', function () {

    const API_URL = 'http://localhost:8080';

    flatpickr.localize(flatpickr.l10ns.es);

    let picker = flatpickr("#fechaReserva", {
        locale: "es",
        minDate: "today",
        maxDate: new Date().fp_incr(90),
        dateFormat: "d-m-Y",
        altInput: false,
        allowInput: false,
        disableMobile: false,

        // Check verde al seleccionar fecha
        onChange: function (selectedDates, dateStr) {
            const fechaInput = document.getElementById("fechaReserva");
            if (dateStr) {
                fechaInput.classList.remove("is-invalid");
                fechaInput.classList.add("is-valid");
            } else {
                fechaInput.classList.remove("is-valid");
                fechaInput.classList.add("is-invalid");
            }
        }
    });

    const btnReservar = document.getElementById('btnReservar');
    const inputNombreMascota = document.getElementById('nombreMascota');
    const inputTamanoMascota = document.getElementById('tamanoMascota');
    const inputNombreGroomer = document.getElementById('nombreGroomer');
    const inputNombreServicio = document.getElementById('nombreServicio');
    const inputFechaReserva = document.getElementById('fechaReserva');
    const inputHoraReserva = document.getElementById('horaReserva');

    btnReservar.addEventListener('click', function (e) {
        e.preventDefault();

        limpiarValidaciones();

        const selectMascota = document.getElementById('nombreMascota');
        const selectGroomer = document.getElementById('nombreGroomer');
        const selectServicio = document.getElementById('nombreServicio');
        const inputFecha = document.getElementById('fechaReserva');
        const selectHora = document.getElementById('horaReserva');

        if (!selectMascota || !selectGroomer || !selectServicio || !inputFecha || !selectHora) {
            return false;
        }

        const nombreMascota = selectMascota.value.trim();
        const nombreGroomer = selectGroomer.value.trim();
        const nombreServicio = selectServicio.value.trim();
        const fechaReserva = inputFecha.value.trim();
        const horaReserva = selectHora.value.trim();

        if (nombreMascota === "" || nombreMascota === null) {
            mostrarValidaciones('nombreMascota', 'Por favor selecciona una mascota');
            return false;
        }

        if (nombreGroomer === "") {
            mostrarValidaciones('nombreGroomer', 'Por favor selecciona un groomer');
            return false;
        }
        if (nombreServicio === "") {
            mostrarValidaciones('nombreServicio', 'Por favor selecciona un servicio');
            return false;
        }
        if (fechaReserva === "") {
            mostrarValidaciones('fechaReserva', 'Por favor selecciona una fecha para la reserva');
            return false;
        }

        if (horaReserva < "08:00" || horaReserva > "18:00" || horaReserva === "") {
            mostrarValidaciones('horaReserva', 'Debe seleccionar una hora entre 08:00 AM y 06:00 PM');
            return false;
        }

        mostrarAlerta('exito', 'Todos los campos son válidos.');


        procesarReserva({
            nombreMascota,
            fechaReserva,
            horaReserva
        });
        return true;
    });

    function obtenerToken() {
        const jwtData = localStorage.getItem('jwt');
        if (jwtData) {
            try {
                const jwt = JSON.parse(jwtData);
                if (jwt.token) {
                    return jwt.token;
                }
            } catch (e) {
                console.log('⚠️ jwt no es JSON, es token directo');
                return jwtData;
            }
        }

        const tokenDirecto = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (tokenDirecto) {
            console.log('✅ Token obtenido de token directo');
            return tokenDirecto;
        }

        console.log('❌ No se encontró token');
        return null;
    }

    async function fetchAutenticado(url, options = {}) {
        const token = obtenerToken();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, { ...options, headers });

            if (response.status === 403) {
                const text = await response.text();
            }

            return response;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    function calcularHoraFinal(horaInicio) {
        const [horas, minutos] = horaInicio.split(':').map(Number);
        const horaFinal = new Date();
        horaFinal.setHours(horas + 2, minutos, 0);

        return `${horaFinal.getHours().toString().padStart(2, '0')}:${horaFinal.getMinutes().toString().padStart(2, '0')}:00`;
    }

    async function obtenerUsuarioId() {
        const usuarioActivoStr = localStorage.getItem('usuarioActivo');

        if (!usuarioActivoStr) return null;

        try {
            const usuarioActivo = JSON.parse(usuarioActivoStr);
            return usuarioActivo.idUsuario || null;
        } catch {
            return null;
        }
    }

    async function obtenerUsuarioIdPorEmail(email) {
        try {
            const response = await fetchAutenticado(`${API_URL}/usuarios/email/${email}`);
            if (response.ok) {
                const usuario = await response.json();
                return usuario.idUsuario;
            }
            return null;
        } catch (error) {
            console.error('Error obteniendo usuario por email:', error);
            return null;
        }
    }

    async function obtenerMascotasUsuario(usuarioId) {
        try {
            const response = await fetchAutenticado(`${API_URL}/mascotas/usuario/${usuarioId}`);
            if (response.ok) {
                return await response.json();
            }
            return [];
        } catch (error) {
            console.error('Error obteniendo mascotas:', error);
            return [];
        }
    }

    async function obtenerServicios() {
        try {
            const response = await fetch(`${API_URL}/servicio`);
            if (response.ok) {
                const servicios = await response.json();
                return servicios;
            } else {
                console.log('Error obteniendo servicios:', response.status);
                return [];
            }
        } catch (error) {
            console.error('Error en obtenerServicios:', error);
            return [];
        }
    }

    async function obtenerGroomers() {
        try {

            const responseAuth = await fetchAutenticado(`${API_URL}/groomers`);

            if (responseAuth.ok) {
                const data = await responseAuth.json();
                return data;
            }

            const response = await fetch(`${API_URL}/groomers`);

            if (response.ok) {
                const data = await response.json();
                return data;
            }

            return [
                { idGroomer: 1, nombre: 'Manuel', apellido: 'Miranda' },
                { idGroomer: 2, nombre: 'Jorge', apellido: 'González' },
                { idGroomer: 3, nombre: 'Sergio', apellido: 'Rincón' },
                { idGroomer: 4, nombre: 'Sandra', apellido: 'López' },
                { idGroomer: 5, nombre: 'Adriana', apellido: 'Ramírez' },
                { idGroomer: 6, nombre: 'Diana', apellido: 'Ortega' }
            ];

        } catch (error) {
            console.error('🚨 Error obtenerGroomers:', error);
            return [];
        }
    }
    //funciones para mostrar datos en el formulario

    async function cargarMascotasUsuario() {
        const usuarioId = await obtenerUsuarioId();
        if (!usuarioId) {
            console.log('Usuario no autenticado');
            return;
        }

        const mascotas = await obtenerMascotasUsuario(usuarioId);

        if (!mascotas || mascotas.length === 0) {
            console.log('No hay mascotas para mostrar');
            return;
        }

        const selectElement = document.getElementById('nombreMascota');

        if (!selectElement) {
            console.error('No se encontró el select de mascotas');
            return;
        }

        // Limpiar y llenar opciones
        selectElement.innerHTML = '<option value="" disabled selected></option>';

        mascotas.forEach(mascota => {
            const option = document.createElement('option');
            option.value = mascota.idMascota;
            option.textContent = mascota.nombreMascota;
            selectElement.appendChild(option);
        });

        // Configurar validación para este campo
        selectElement.addEventListener('change', () => validarCampo(selectElement));

        console.log(`✅ Cargadas ${mascotas.length} mascotas`);
    }

    async function cargarServicios() {
        try {
            const selectServicio = document.getElementById('nombreServicio');

            const servicios = await obtenerServicios();

            if (!servicios || servicios.length === 0) {
                console.warn('⚠️ No se recibieron servicios o el array está vacío');
                return;
            }

            if (!selectServicio) {
                console.error('❌ Select de servicio no encontrado');
                return;
            }

            selectServicio.innerHTML = '<option value="" disabled selected></option>';

            servicios.forEach((servicio, index) => {

                const nombre = servicio.nombreServicio ||
                    servicio.nombre ||
                    servicio.descripcion ||
                    servicio.servicioNombre ||
                    `Servicio ${index + 1}`;

                const id = servicio.idServicio || servicio.id || index;

                const option = document.createElement('option');
                option.value = id;
                option.textContent = nombre;
                selectServicio.appendChild(option);
            });

        } catch (error) {
            console.error('🚨 Error en cargarServicios:', error);
        }
    }

    async function cargarGroomers() {
        try {
            const groomers = await obtenerGroomers();

            const selectGroomer = document.getElementById('nombreGroomer');
            if (!selectGroomer) return;

            selectGroomer.innerHTML = '<option value="" disabled selected></option>';

            groomers.forEach((groomer, index) => {

                const option = document.createElement('option');
                option.value = groomer.idGroomer;
                option.textContent = `${groomer.nombre} ${groomer.apellido}`;
                selectGroomer.appendChild(option);
            });

        } catch (error) {
            console.error('Error cargando groomers:', error);
        }
    }

    // funciones para la reserva

    async function procesarReserva(datosReserva) {
        try {
            const usuarioId = await obtenerUsuarioId();
            if (!usuarioId) {
                mostrarAlerta('error', 'Debes iniciar sesión para hacer una reserva');
                return;
            }
            const mascotaId = datosReserva.nombreMascota;
            if (!mascotaId) {
                mostrarAlerta('error', 'Por favor selecciona una mascota');
                return;
            }
            const mascotas = await obtenerMascotasUsuario(usuarioId);
            if (mascotas.length === 0) {
                mostrarAlerta('error', 'No tienes mascotas registradas.');
                return;
            }
            const mascotaSeleccionada = mascotas.find(m => m.idMascota == mascotaId);
            if (!mascotaSeleccionada) {
                mostrarAlerta('error', 'No se encontró la mascota seleccionada.');
                return;
            }
            const [groomers, servicios] = await Promise.all([
                obtenerGroomers(),
                obtenerServicios()
            ]);

            const groomerSelect = document.getElementById('nombreGroomer');
            const servicioSelect = document.getElementById('nombreServicio');

            const groomerId = parseInt(groomerSelect.value);

            let groomerSeleccionado = null;

            groomerSeleccionado = groomers.find(g => g.idGroomer === groomerId);

            if (!groomerSeleccionado) {
                groomerSeleccionado = groomers.find(g => g.idGroomer == groomerId);
            }

            if (!groomerSeleccionado) {
                const textoSelect = groomerSelect.options[groomerSelect.selectedIndex]?.text;
                groomerSeleccionado = groomers.find(g =>
                    textoSelect === `${g.nombre} ${g.apellido}` ||
                    textoSelect.includes(g.nombre) ||
                    textoSelect.includes(g.apellido)
                );
            }

            if (!groomerSeleccionado) {

                mostrarAlerta('error', 'No se encontró el groomer seleccionado');
                return;
            }

            const servicioId = parseInt(servicioSelect.value);

            const servicioSeleccionado = servicios.find(s => s.idServicio == servicioId);

            if (!servicioSeleccionado) {
                mostrarAlerta('error', 'No se encontró el servicio seleccionado');
                return;
            }
            const [dia, mes, anio] = datosReserva.fechaReserva.split('-');
            const fechaFormateada = `${anio}-${mes}-${dia}`;

            const reservaData = {
                fecha: fechaFormateada,
                horaInicio: datosReserva.horaReserva + ":00",
                horaFinal: calcularHoraFinal(datosReserva.horaReserva),
                groomer: { idGroomer: groomerSeleccionado.idGroomer },
                servicio: { idServicio: servicioSeleccionado.idServicio },
                mascota: { idMascota: mascotaSeleccionada.idMascota }
            };
            ;

            const response = await fetchAutenticado(
                `${API_URL}/reservas/usuario/${usuarioId}/crear`,
                {
                    method: 'POST',
                    body: JSON.stringify(reservaData)
                }
            );
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${errorText}`);
            }

            const reservaGuardada = await response.json();

            mostrarAlerta('exito', '¡Reserva creada exitosamente!');
            limpiarFormulario();
            await mostrarReservasUsuario();

        } catch (error) {
            mostrarAlerta('error', error.message);
        }
    }

    //funcion para mostrar todas las reservas
    async function mostrarReservas() {
        try {
            const response = await fetchAutenticado(`${API_URL}/reservas`);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const todasReservas = await response.json();
            return todasReservas;

        } catch (error) {

            mostrarAlerta('error', 'No se pudieron cargar las reservas del sistema');
            return [];
        }
    }

    //funcion para mostrar las card de las reservas del usuario
    async function mostrarReservasUsuario() {
        try {
            const usuarioId = await obtenerUsuarioId();
            if (!usuarioId) {
                document.getElementById("servicio-reservado").innerHTML =
                    '<div class="alert alert-warning">Debes iniciar sesión para ver tus reservas</div>';
                return;
            }

            const response = await fetchAutenticado(`${API_URL}/reservas/usuario/${usuarioId}`);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const reservasUsuario = await response.json();

            const contenedor = document.getElementById("servicio-reservado");

            if (!reservasUsuario || reservasUsuario.length === 0) {
                contenedor.innerHTML = `
                    <div class="col-12 text-center py-5 w-100">
                        <div class="d-flex flex-column align-items-center justify-content-center">
                            <i class="bi bi-calendar-x display-1 text-muted mb-3"></i>
                            <h4 class="text-muted mb-2">No tienes reservas</h4>
                            <p class="text-muted mb-4">¡Agenda tu primera cita para consentir a             tu mascota!</p>
                            <button class="boton-login" onclick="nuevaReserva()">Hacer mi primera           reserva</button>
                        </div>
                    </div>
                `;

                const boton = document.getElementById('btnReserva');
                if (boton) boton.style.display = "none";
                return;
            }

            contenedor.innerHTML = "";

            reservasUsuario.forEach(reserva => {
                const servicioNombre = reserva.servicio?.nombre ||
                    reserva.servicio?.nombreServicio ||
                    'Servicio no disponible';

                const mascotaNombre = reserva.mascota?.nombreMascota ||
                    reserva.mascota?.nombre ||
                    'Mascota no disponible';

                const mascotaTamano = reserva.mascota?.tamanoMascota ||
                    reserva.mascota?.tamano ||
                    'No especificado';

                const groomerNombre = reserva.groomer ?
                    `${reserva.groomer.nombre || ''} ${reserva.groomer.apellido || ''}`.trim() :
                    'Groomer no disponible';

                let fechaFormateada = '';
                if (reserva.fecha) {
                    const [anio, mes, dia] = reserva.fecha.split('-');
                    fechaFormateada = `${dia}-${mes}-${anio}`;
                }

                let horaFormateada = reserva.horaInicio || '';
                if (horaFormateada.includes(':')) {
                    horaFormateada = horaFormateada.substring(0, 5);
                }

                const card = document.createElement('reserva-card');
                card.setAttribute('nombreServicio', servicioNombre);
                card.setAttribute('nombreMascota', mascotaNombre);
                card.setAttribute('tamanoMascota', mascotaTamano);
                card.setAttribute('nombreGroomer', groomerNombre);
                card.setAttribute('fechaReserva', fechaFormateada);
                card.setAttribute('horaReserva', horaFormateada);
                card.setAttribute('idReserva', reserva.idReserva);

                contenedor.appendChild(card);
            });

            const boton = document.getElementById('btnReserva');
            if (boton) {
                boton.style.display = "block";
                boton.textContent = "Hacer otra reserva";
            };


        } catch (error) {

            const contenedor = document.getElementById("servicio-reservado");
            contenedor.innerHTML = `
            <div class="alert alert-danger">
                <strong>Error:</strong> No se pudieron cargar tus reservas.
                <small>${error.message}</small>
            </div>
            `;
        }
    }

    //eliminar reserva
    document.addEventListener('click', async function (e) {
        const botonEliminar = e.target.closest('.eliminar-reserva');

        if (!botonEliminar) return;

        e.preventDefault();
        const idReserva = parseInt(botonEliminar.dataset.id);

        if (!idReserva) {
            console.error('ID de reserva no encontrado');
            return;
        }

        const confirmacion = await mostrarAlerta('confirmar',
            '¿Eliminar esta reserva?<br><small>¡Esta acción no se puede deshacer!</small>', {
            botonConfirmar: 'Sí, eliminar'
        });

        if (!confirmacion.isConfirmed) return;

        try {
            const response = await fetchAutenticado(`${API_URL}/reservas/eliminar/${idReserva}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error del servidor: ${errorText}`);
            }

            const resultado = await response.text();
            console.log('Respuesta eliminación:', resultado);

            const card = botonEliminar.closest('reserva-card');
            if (card) {

                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';
                card.style.transition = 'all 0.3s ease';

                setTimeout(() => {
                    card.remove();

                    const contenedor = document.getElementById('servicio-reservado');
                    const cardsRestantes = contenedor.querySelectorAll('reserva-card').length;

                    if (cardsRestantes === 0) {
                        mostrarReservasUsuario();
                    }
                }, 300);
            }

            mostrarAlerta('exito', 'La reserva ha sido eliminada correctamente.');

        } catch (error) {
            console.error('Error al eliminar reserva:', error);
            mostrarAlerta('error', `Error al eliminar la reserva: ${error.message}`);
        }
    });

    function limpiarFormulario() {
        document.getElementById("formReserva").reset();
    }


    cargarMascotasUsuario();
    cargarGroomers();
    cargarServicios();
    mostrarReservasUsuario();

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
        "horaReserva"
    ];

    inicializarValidacionCampos(campos);

});