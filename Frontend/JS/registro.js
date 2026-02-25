const API_URL = 'http://localhost:8080';
let contadorMascotas = 1;
const MAX_MASCOTAS = 4;
let sizeBubbleTimeout = null;

const input = document.getElementById("contrasenaUsuario");
const bubble = document.getElementById("passwordBubble");
let timeoutBubble = null;

if (input && bubble) {
    input.addEventListener("focus", () => {
        bubble.style.display = "block";

        if (timeoutBubble) {
            clearTimeout(timeoutBubble);
        }

        timeoutBubble = setTimeout(() => {
            bubble.style.display = "none";
        }, 10000);
    });

    input.addEventListener("blur", () => {
        bubble.style.display = "none";

        if (timeoutBubble) {
            clearTimeout(timeoutBubble);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const btnRegistro = document.getElementById('btnRegistro');

    if (btnRegistro) {
        btnRegistro.addEventListener('click', async function (e) {
            e.preventDefault();
            await validaciones();
        });
    }
    activarTogglePassword("contrasenaUsuario", "togglePassword1");
    activarTogglePassword("confirmarContraUsuario", "togglePassword2");
});

function activarTogglePassword(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);

    toggle.classList.add("bi-eye");
    toggle.classList.remove("bi-eye-slash");

    toggle.addEventListener("click", () => {
        const mostrando = input.type === "text";

        if (mostrando) {
            input.type = "password";
            toggle.classList.remove("bi-eye-slash");
            toggle.classList.add("bi-eye");
        } else {
            input.type = "text";
            toggle.classList.remove("bi-eye");
            toggle.classList.add("bi-eye-slash");
        }
    });
}

function mostrarValidaciones(id, mensaje) {
    const field = document.getElementById(id);
    if (!field) return;

    const formFloating = field.closest('.form-floating');
    if (!formFloating) return;

    const errorExistente = formFloating.querySelector('.error-message');
    if (errorExistente) {
        errorExistente.textContent = mensaje;
    } else {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message text-danger mt-1 small';
        errorElement.textContent = mensaje;
        formFloating.appendChild(errorElement);
    }

    field.classList.add('is-invalid');
}

function limpiarValidaciones() {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    document.querySelectorAll('.is-invalid').forEach(field => field.classList.remove('is-invalid'));
}

function limpiarFormulario() {
    const form = document.getElementById("formRegistro");
    if (form) {
        form.reset();
        contadorMascotas = 1;

        for (let i = 2; i <= MAX_MASCOTAS; i++) {
            const container = document.getElementById(`mascotaContainer${i}`);
            if (container) {
                container.remove();
            }
        }
        const botonAgregarContainer = document.getElementById('botonAgregarMascota');
        if (botonAgregarContainer) {
            botonAgregarContainer.style.display = 'flex';
        }
    }
}

function contarCamposMascota() {
    let count = 1;
    for (let i = 2; i <= contadorMascotas; i++) {
        if (document.getElementById(`mascotaContainer${i}`)) {
            count++;
        }
    }
    return count;
}

function agregarCampoMascota() {
    const camposActuales = contarCamposMascota();

    if (camposActuales >= MAX_MASCOTAS) {
        mostrarAlerta('info', `Límite alcanzado:</strong> Solo puedes registrar hasta 4 mascotas.`);
        return;
    }

    contadorMascotas++;

    const columnForm = document.querySelector('.column-form');
    const botonRegistro = columnForm.querySelector('.form-floating.d-flex.justify-content-center');

    const nuevoDiv = document.createElement('div');
    nuevoDiv.className = 'd-flex flex-column flex-md-row w-100 w-lg-75 align-items-center px-3 my-lg-1';
    nuevoDiv.id = `mascotaContainer${contadorMascotas}`;

    nuevoDiv.innerHTML = `
    <div class="form-floating w-100 w-md-50 m-3">
            <input type="text" class="form-control entrada" id="mascota${contadorMascotas}Usuario" placeholder="">
            <label for="mascota${contadorMascotas}Usuario">Nombre de tu mascota</label>
        </div>

        <div class="form-floating w-100 w-md-40 m-3">
            <select class="form-select entrada" id="tamanoMascota${contadorMascotas}">
                <option value="" disabled selected>Selecciona tamaño</option>
                <option value="Pequeno">Pequeño</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
            </select>
            <label for="tamanoMascota${contadorMascotas}">Tamaño</label>
        </div>

                <div class="w-100 w-md-50 m-3 d-flex align-items-center justify-content-center justify-content-md-start">
            <button type="button" class="btn-eliminar-mascota" onclick="eliminarCampoMascota(${contadorMascotas})">
                <i class="bi bi-trash"></i> Eliminar
            </button>        
        </div>
    `;

    columnForm.insertBefore(nuevoDiv, botonRegistro);

    if (contarCamposMascota() >= MAX_MASCOTAS) {
        const botonAgregarContainer = document.getElementById('botonAgregarMascota');
        if (botonAgregarContainer) {
            botonAgregarContainer.style.display = 'none';
        }
    }
}

function eliminarCampoMascota(numero) {
    const container = document.getElementById(`mascotaContainer${numero}`);
    if (container) {
        container.remove();

        const botonAgregarContainer = document.getElementById('botonAgregarMascota');
        if (botonAgregarContainer && botonAgregarContainer.style.display === 'none') {
            botonAgregarContainer.style.display = 'flex';
        }
    }
}

async function validaciones() {
    limpiarValidaciones();

    const nombreUsuario = document.getElementById("nombreUsuario").value.trim();
    const apellidosUsuario = document.getElementById("apellidosUsuario").value.trim();
    const correoUsuario = document.getElementById("correoUsuario").value.trim();
    const contrasenaUsuario = document.getElementById("contrasenaUsuario").value.trim();
    const confirmarContraUsuario = document.getElementById("confirmarContraUsuario").value.trim();
    const telefonoUsuario = document.getElementById("telefonoUsuario").value.trim();

    let esValido = true;

    // Validar nombre
    if (nombreUsuario.length <= 2 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreUsuario)) {
        mostrarValidaciones('nombreUsuario', 'El nombre debe ser alfabético y mínimo de dos caracteres.');
        return false;
    }

    // Validar apellidos
    if (apellidosUsuario.length <= 2 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellidosUsuario)) {
        mostrarValidaciones('apellidosUsuario', 'Los apellidos deben ser alfabéticos y mínimo de dos caracteres.');
        return false;
    }

    // Validar teléfono
    if (!/^\d{10}$/.test(telefonoUsuario)) {
        mostrarValidaciones('telefonoUsuario', 'El teléfono debe contener 10 dígitos.');
        return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correoUsuario)) {
        mostrarValidaciones('correoUsuario', 'Por favor ingresa un email válido.');
        return false;
    }

    // Validar contraseña
    const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    if (!regexContrasena.test(contrasenaUsuario)) {
        mostrarValidaciones(
            'contrasenaUsuario',
            'La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y caracter especial.'
        );
        return false;
    }

    // Validar confirmación de contraseña
    if (contrasenaUsuario !== confirmarContraUsuario) {
        mostrarValidaciones('confirmarContraUsuario', 'Las contraseñas no coinciden.');
        return false;
    }

    // Validar mascotas
    const mascota1Usuario = document.getElementById("mascota1Usuario").value.trim();
    if (mascota1Usuario.length <= 2 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(mascota1Usuario)) {
        mostrarValidaciones('mascota1Usuario', 'Debes ingresar al menos el nombre de una mascota (mínimo 2 caracteres alfabéticos).');
        return false;
    }

    // Validar tamaño de mascota
    const tamanoMascota1 = document.getElementById("tamanoMascota1").value;
    if (!tamanoMascota1 || tamanoMascota1 === "") {
        mostrarValidaciones('tamanoMascota1', 'Por favor selecciona el tamaño de tu mascota.');
        return false;
    }

    // Validar mascotas adicionales
    for (let i = 2; i <= contadorMascotas; i++) {
        const mascotaInput = document.getElementById(`mascota${i}Usuario`);
        const tamanoInput = document.getElementById(`tamanoMascota${i}`);

        if (mascotaInput && mascotaInput.value.trim().length > 0) {

            const valorMascota = mascotaInput.value.trim();
            const valorTamano = tamanoInput ? tamanoInput.value : '';

            if (valorMascota.length <= 2 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valorMascota)) {
                mostrarValidaciones(`mascota${i}Usuario`, 'El nombre debe ser alfabético y mínimo de dos caracteres.');
                return false;
            }

            if (!valorTamano || valorTamano === "") {
                mostrarValidaciones(`tamanoMascota${i}`, 'Por favor selecciona el tamaño de la mascota.');

                return false;
            }
        }
    }

    if (!esValido) {
        return false;
    }

    const btnRegistro = document.getElementById('btnRegistro');
    const textoOriginal = btnRegistro.innerHTML;
    btnRegistro.disabled = true;
    btnRegistro.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registrando...';

    try {
        const usuarioGuardado = await registrarUsuarioBackend({
            nombre: nombreUsuario,
            apellido: apellidosUsuario,
            telefono: telefonoUsuario,
            email: correoUsuario,
            passwordUsuario: contrasenaUsuario,
            rol: 'Cliente'
        });

        const usuarioId = usuarioGuardado.idUsuario;
        console.log('Usuario registrado con ID:', usuarioId);

        if (!usuarioId) {
            throw new Error('No se pudo obtener el ID del usuario registrado');
        }

        if (mascota1Usuario.length > 0) {
            const mascotasGuardadas = await guardarMascotasParaUsuario(usuarioId);
            mostrarAlerta('exito', `Usuario <strong>${nombreUsuario} ${apellidosUsuario}</strong> creado exitosamente.<br>Email: <strong>${correoUsuario}</strong>.<br>Mascotas registradas: <strong>${mascotasGuardadas}</strong`);
        } else {
            mostrarAlerta('exito', `Usuario <strong>${nombreUsuario} ${apellidosUsuario}</strong> creado exitosamente.<br>Email: <strong>${correoUsuario}</strong>.<br>Mascotas registradas: <strong>${mascotasGuardadas}</strong`);
        }

        limpiarFormulario();

        setTimeout(() => {
            window.location.href = "../HTML/inicioSesion.html";
        }, 2000);

    } catch (error) {
        console.error('Error en el registro:', error);
        mostrarAlerta('error', `<strong>Error de registro:</strong> ${error.message}`);

        btnRegistro.disabled = false;
        btnRegistro.innerHTML = textoOriginal;
    }

    return true;
}

async function registrarUsuarioBackend(datosUsuario) {
    try {

        const response = await fetch(`${API_URL}/auth/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: datosUsuario.nombre,
                apellido: datosUsuario.apellido,
                telefono: datosUsuario.telefono,
                email: datosUsuario.email,
                passwordUsuario: datosUsuario.passwordUsuario,
                rol: "Cliente"
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error del servidor:', errorText);
            throw new Error(`Error al registrar usuario: ${errorText}`);
        }

        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);


        let usuarioId;

        if (responseData.idUsuario) {
            usuarioId = responseData.idUsuario;
        } else if (responseData.id) {
            usuarioId = responseData.id;
        } else if (responseData.usuario && responseData.usuario.idUsuario) {
            usuarioId = responseData.usuario.idUsuario;
        } else if (responseData.usuario && responseData.usuario.id) {
            usuarioId = responseData.usuario.id;
        } else {

            console.warn('No se encontró ID en la respuesta, buscando por email...');
            usuarioId = await obtenerIdUsuarioPorEmail(datosUsuario.email);
        }

        console.log('ID de usuario extraído:', usuarioId);

        return {
            idUsuario: usuarioId,
            ...responseData
        };

    } catch (error) {
        console.error('Error registrando usuario:', error);
        throw error;
    }
}

async function obtenerIdUsuarioPorEmail(email) {
    try {
        const response = await fetch(`${API_URL}/usuarios`);
        if (response.ok) {
            const usuarios = await response.json();
            const usuarioEncontrado = usuarios.find(u => u.email === email);
            return usuarioEncontrado ? usuarioEncontrado.idUsuario : null;
        }
        return null;
    } catch (error) {
        console.error('Error obteniendo usuario por email:', error);
        return null;
    }
}


async function guardarMascotaParaUsuario(usuarioId, nombreMascota, tamanoMascota) {
    const mascotaData = {
        nombreMascota,
        tamanoMascota
    };

    const response = await fetch(`${API_URL}/usuarios/${usuarioId}/mascotas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mascotaData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
    }

    return await response.json();
}


async function guardarMascotasParaUsuario(usuarioId) {
    let mascotasGuardadas = 0;
    const mascotas = [];

    for (let i = 1; i <= contadorMascotas; i++) {
        const nombreInput = document.getElementById(`mascota${i}Usuario`);
        const tamanoSelect = document.getElementById(`tamanoMascota${i}`);

        if (nombreInput && tamanoSelect) {
            const nombreMascota = nombreInput.value.trim();
            const tamanoMascota = tamanoSelect.value;

            if (nombreMascota.length > 0 && tamanoMascota) {
                mascotas.push({ nombreMascota, tamanoMascota });
            }
        }
    }

    console.log(`Guardando ${mascotas.length} mascotas para usuario ID:`, usuarioId);

    for (const mascota of mascotas) {
        try {
            const resultado = await guardarMascotaParaUsuario(
                usuarioId,
                mascota.nombreMascota,
                mascota.tamanoMascota
            );

            if (resultado) {
                mascotasGuardadas++;
                console.log(`Mascota guardada: ${mascota.nombreMascota}`);
            }
        } catch (error) {
            console.error(`Error guardando mascota ${mascota.nombreMascota}:`, error);
        }
    }

    console.log(`Total mascotas guardadas: ${mascotasGuardadas}`);
    return mascotasGuardadas;
}


function toggleSizeBubble(bubbleId) {
    const bubble = document.getElementById(bubbleId);
    if (!bubble) return;

    const isVisible = bubble.style.display === "block";


    document.querySelectorAll(".size-bubble").forEach(b => b.style.display = "none");

    if (sizeBubbleTimeout) {
        clearTimeout(sizeBubbleTimeout);
    }

    if (!isVisible) {
        bubble.style.display = "block";

        sizeBubbleTimeout = setTimeout(() => {
            bubble.style.display = "none";
        }, 10000);
    }
}

document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("size-info-icon")) {
        document.querySelectorAll(".size-bubble").forEach(b => b.style.display = "none");
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const ids = [
        "nombreUsuario", "apellidosUsuario", "correoUsuario",
        "contrasenaUsuario", "confirmarContraUsuario", "telefonoUsuario",
        "mascota1Usuario"
    ];
    inicializarValidacionCampos(ids);
});