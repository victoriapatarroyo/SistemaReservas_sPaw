const API_URL = 'http://localhost:8080';
let usuarioActual = null;
let mascotasUsuario = [];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Inicializando perfil...');
    inicializarPerfil();
    configurarEventListeners();
    cargarHistorial();
});

async function inicializarPerfil() {
    try {
        const usuarioId = obtenerUsuarioIdDeSesion();
        
        console.log('🔑 ID de usuario obtenido:', usuarioId);
        
        if (!usuarioId) {
            mostrarAlerta('error', 'No hay sesión activa. Por favor, inicia sesión.');
            setTimeout(() => {
                window.location.href = '../HTML/inicioSesion.html';
            }, 2000);
            return;
        }

        await cargarDatosUsuario(usuarioId);
        await cargarMascotas(usuarioId);
        
        // Activar toggles de contraseña
        activarTogglePassword('perfilPassword', 'togglePasswordPerfil');
        activarTogglePassword('perfilConfirmPassword', 'toggleConfirmPasswordPerfil');
        
    } catch (error) {
        console.error('❌ Error inicializando perfil:', error);
        mostrarAlerta('error', 'Error al cargar los datos del perfil');
    }
}

function obtenerUsuarioIdDeSesion() {
    // PRIMERO: Intentar igual que reservas.js
    const usuarioActivoStr = localStorage.getItem('usuarioActivo');
    console.log('📝 usuarioActivo en localStorage:', usuarioActivoStr);
    
    if (usuarioActivoStr) {
        try {
            const usuarioActivo = JSON.parse(usuarioActivoStr);
            console.log('✅ Usuario activo parseado:', usuarioActivo);
            
            if (usuarioActivo.idUsuario) {
                console.log('🎯 ID obtenido de usuarioActivo.idUsuario:', usuarioActivo.idUsuario);
                return usuarioActivo.idUsuario;
            }
            
            // También verificar otras posibles propiedades
            if (usuarioActivo.id) {
                console.log('🎯 ID obtenido de usuarioActivo.id:', usuarioActivo.id);
                return usuarioActivo.id;
            }
            
        } catch (error) {
            console.error('❌ Error parseando usuarioActivo:', error);
        }
    }
    
    // SEGUNDO: Verificar JWT token (como en reservas.js)
    const jwtData = localStorage.getItem('jwt');
    console.log('🔐 JWT en localStorage:', jwtData);
    
    if (jwtData) {
        try {
            const jwt = JSON.parse(jwtData);
            console.log('✅ JWT parseado:', jwt);
            
            if (jwt.idUsuario) {
                console.log('🎯 ID obtenido de JWT.idUsuario:', jwt.idUsuario);
                return jwt.idUsuario;
            }
            
            if (jwt.sub) {
                console.log('🎯 Sub obtenido de JWT:', jwt.sub);
                // Si el JWT contiene el ID en el subject
                return jwt.sub;
            }
            
        } catch (e) {
            console.log('⚠️ JWT no es JSON, token directo:', jwtData);
            // Podría ser un token string directamente
        }
    }
    
    // TERCERO: Token directo
    const tokenDirecto = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (tokenDirecto) {
        console.log('🔑 Token directo encontrado:', tokenDirecto.substring(0, 20) + '...');
        // Si el token es JWT, podríamos decodificarlo
        try {
            const payload = JSON.parse(atob(tokenDirecto.split('.')[1]));
            console.log('🔓 Payload del token:', payload);
            if (payload.idUsuario || payload.sub || payload.id) {
                const id = payload.idUsuario || payload.sub || payload.id;
                console.log('🎯 ID obtenido del token decodificado:', id);
                return id;
            }
        } catch (error) {
            console.error('❌ Error decodificando token:', error);
        }
    }
    
    // CUARTO: usuarioId directo (como tenías antes)
    const idGuardado = localStorage.getItem('usuarioId');
    console.log('📌 usuarioId en localStorage:', idGuardado);
    
    if (idGuardado) {
        console.log('🎯 ID obtenido de usuarioId:', idGuardado);
        return parseInt(idGuardado);
    }
    
    // QUINTO: Parámetro URL
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('id');
    console.log('🔗 ID de URL:', idFromUrl);
    
    if (idFromUrl) {
        console.log('🎯 ID obtenido de URL:', idFromUrl);
        localStorage.setItem('usuarioId', idFromUrl);
        return parseInt(idFromUrl);
    }
    
    // SEXTO: Debug - mostrar todo lo que hay en localStorage
    console.log('📋 Contenido completo de localStorage:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`  ${key}:`, value);
    }
    
    console.warn('⚠️ NO SE ENCONTRÓ ID DE USUARIO EN NINGUNA FUENTE');
    return null;
}

async function cargarDatosUsuario(usuarioId) {
    try {
        console.log('🌐 Solicitando datos del usuario...');
        const response = await fetch(`${API_URL}/usuarios/${usuarioId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Usuario no encontrado (404)');
            }
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        
        usuarioActual = await response.json();
        console.log('✅ Datos del usuario recibidos:', usuarioActual);
        
        mostrarDatosUsuario();
        
    } catch (error) {
        console.error('❌ Error cargando datos usuario:', error);
        mostrarAlerta('error', `No se pudieron cargar los datos del usuario: ${error.message}`);
    }
}

function mostrarDatosUsuario() {
    if (!usuarioActual) {
        console.warn('⚠️ No hay datos de usuario para mostrar');
        return;
    }
    
    console.log('📤 Mostrando datos del usuario...');
    
    // Mapear posibles nombres de propiedades
    const nombre = usuarioActual.nombre || usuarioActual.nombreUsuario || '';
    const apellido = usuarioActual.apellido || usuarioActual.apellidos || usuarioActual.apellidoUsuario || '';
    const email = usuarioActual.email || usuarioActual.correo || usuarioActual.correoUsuario || '';
    const telefono = usuarioActual.telefono || usuarioActual.telefonoUsuario || '';
    
    console.log('📊 Datos mapeados:', { nombre, apellido, email, telefono });
    
    // Campos de solo lectura
    document.getElementById('perfilNombre').value = nombre;
    document.getElementById('perfilApellido').value = apellido;
    
    // Campos editables
    document.getElementById('perfilEmail').value = email;
    document.getElementById('perfilTelefono').value = telefono;
    
    console.log('✅ Campos llenados correctamente');
}

async function cargarMascotas(usuarioId) {
    try {
        console.log('🐕 Cargando mascotas del usuario...');
        const response = await fetch(`${API_URL}/mascotas/usuario/${usuarioId}`);
        
        if (response.ok) {
            mascotasUsuario = await response.json();
            console.log(`✅ ${mascotasUsuario.length} mascotas recibidas:`, mascotasUsuario);
            mostrarMascotas();
        } else if (response.status === 404) {
            console.log('ℹ️ Usuario no tiene mascotas registradas');
            mascotasUsuario = [];
            mostrarMascotas();
        } else {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
    } catch (error) {
        console.error('❌ Error cargando mascotas:', error);
        mostrarAlerta('error', 'Error al cargar las mascotas');
    }
}

function mostrarMascotas() {
    const listaMascotas = document.getElementById('listaMascotas');
    
    if (!listaMascotas) return;
    
    if (mascotasUsuario.length === 0) {
        listaMascotas.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-heart"></i>
                <h4>No tienes mascotas registradas</h4>
                <p class="text-muted">Agrega tu primera mascota usando el formulario de abajo</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    mascotasUsuario.forEach((mascota, index) => {
        const sizeClass = getSizeClass(mascota.tamanoMascota);
        const sizeText = getSizeText(mascota.tamanoMascota);
        
        html += `
            <div class="pet-card" id="petCard${mascota.idMascota || index}">
                <div class="pet-avatar">
                    <i class="bi bi-${getPetIcon(mascota.tamanoMascota)}"></i>
                </div>
                <div class="pet-info">
                    <div class="pet-name">${mascota.nombreMascota}</div>
                    <div class="pet-size">
                        <span class="pet-size-badge ${sizeClass}">${sizeText}</span>
                    </div>
                </div>
                <div class="pet-actions">
                    <button class="btn-pet-action btn-edit-pet" onclick="editarMascota(${mascota.idMascota || index})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-pet-action btn-delete-pet" onclick="eliminarMascota(${mascota.idMascota || index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    listaMascotas.innerHTML = html;
}

function getSizeClass(tamano) {
    switch(tamano) {
        case 'Pequeno': return 'size-pequeno';
        case 'Mediano': return 'size-mediano';
        case 'Grande': return 'size-grande';
        default: return '';
    }
}

function getSizeText(tamano) {
    switch(tamano) {
        case 'Pequeno': return 'Pequeño';
        case 'Mediano': return 'Mediano';
        case 'Grande': return 'Grande';
        default: return tamano;
    }
}

function getPetIcon(tamano) {
    switch(tamano) {
        case 'Pequeno': return 'emoji-smile';
        case 'Mediano': return 'emoji-neutral';
        case 'Grande': return 'emoji-angry';
        default: return 'heart';
    }
}

function configurarEventListeners() {
    const formPerfil = document.getElementById('formPerfil');
    const formNuevaMascota = document.getElementById('formNuevaMascota');
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    
    if (formPerfil) {
        formPerfil.addEventListener('submit', async (e) => {
            e.preventDefault();
            await actualizarPerfil();
        });
    }
    
    if (formNuevaMascota) {
        formNuevaMascota.addEventListener('submit', async (e) => {
            e.preventDefault();
            await agregarNuevaMascota();
        });
    }
    
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', cerrarSesion);
    }
}

async function actualizarPerfil() {
    const nombre = document.getElementById('perfilNombre').value.trim();
    const apellido = document.getElementById('perfilApellido').value.trim();
    const email = document.getElementById('perfilEmail').value.trim();
    const telefono = document.getElementById('perfilTelefono').value.trim();
    const password = document.getElementById('perfilPassword').value;
    const confirmPassword = document.getElementById('perfilConfirmPassword').value;
    
    if (!validarDatosPerfil(nombre, apellido, email, telefono, password, confirmPassword)) {
        return;
    }
    
    const datosActualizar = {
        nombre,
        apellido,
        email,
        telefono
    };
    
    if (password) {
        datosActualizar.passwordUsuario = password;
    }
    
    const btnActualizar = document.getElementById('btnActualizarPerfil');
    const textoOriginal = btnActualizar.innerHTML;
    btnActualizar.disabled = true;
    btnActualizar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Actualizando...';
    
    try {
        const usuarioId = obtenerUsuarioIdDeSesion();
        const response = await fetch(`${API_URL}/usuarios/${usuarioId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizar)
        });
        
        if (response.ok) {
            usuarioActual = await response.json();
            mostrarAlerta('exito', 'Perfil actualizado correctamente');
            
            document.getElementById('perfilPassword').value = '';
            document.getElementById('perfilConfirmPassword').value = '';
            
        } else {
            throw new Error('Error al actualizar el perfil');
        }
        
    } catch (error) {
        console.error('Error actualizando perfil:', error);
        mostrarAlerta('error', 'Error al actualizar el perfil');
    } finally {
        btnActualizar.disabled = false;
        btnActualizar.innerHTML = textoOriginal;
    }
}

function validarDatosPerfil(nombre, apellido, email, telefono, password, confirmPassword) {
    // Validar nombre
    if (nombre.length <= 2 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
        mostrarAlerta('error', 'El nombre debe ser alfabético y mínimo de dos caracteres.');
        return false;
    }
    
    // Validar apellidos
    if (apellido.length <= 2 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellido)) {
        mostrarAlerta('error', 'Los apellidos deben ser alfabéticos y mínimo de dos caracteres.');
        return false;
    }
    
    // Validar teléfono
    if (!/^\d{10}$/.test(telefono)) {
        mostrarAlerta('error', 'El teléfono debe contener 10 dígitos.');
        return false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarAlerta('error', 'Por favor ingresa un email válido.');
        return false;
    }
    
    // Validar contraseña
    if (password) {
        const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
        if (!regexContrasena.test(password)) {
            mostrarAlerta('error', 
                'La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y caracter especial.'
            );
            return false;
        }
        
        if (password !== confirmPassword) {
            mostrarAlerta('error', 'Las contraseñas no coinciden.');
            return false;
        }
    }
    
    return true;
}

async function agregarNuevaMascota() {
    const nombre = document.getElementById('nuevaMascotaNombre').value.trim();
    const tamano = document.getElementById('nuevaMascotaTamano').value;
    
    if (nombre.length <= 2 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
        mostrarAlerta('error', 'El nombre de la mascota debe ser alfabético y mínimo de dos caracteres.');
        return;
    }
    
    if (!tamano) {
        mostrarAlerta('error', 'Por favor selecciona el tamaño de la mascota.');
        return;
    }
    
    const usuarioId = obtenerUsuarioIdDeSesion();
    if (!usuarioId) {
        mostrarAlerta('error', 'No se puede identificar al usuario.');
        return;
    }
    
    const btnAgregar = document.getElementById('btnAgregarMascota');
    const textoOriginal = btnAgregar.innerHTML;
    btnAgregar.disabled = true;
    btnAgregar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Agregando...';
    
    try {
        const mascotaData = {
            nombreMascota: nombre,
            tamanoMascota: tamano
        };
        
        const response = await fetch(`${API_URL}/usuarios/${usuarioId}/mascotas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mascotaData)
        });
        
        if (response.ok) {
            const nuevaMascota = await response.json();
            mascotasUsuario.push(nuevaMascota);
            mostrarMascotas();
            mostrarAlerta('exito', 'Mascota agregada correctamente');
            
            document.getElementById('formNuevaMascota').reset();
            
        } else {
            throw new Error('Error al agregar mascota');
        }
        
    } catch (error) {
        console.error('Error agregando mascota:', error);
        mostrarAlerta('error', 'Error al agregar la mascota');
    } finally {
        btnAgregar.disabled = false;
        btnAgregar.innerHTML = textoOriginal;
    }
}

async function editarMascota(mascotaId) {
    const mascota = mascotasUsuario.find(m => m.idMascota === mascotaId);
    
    if (!mascota) {
        mostrarAlerta('error', 'No se encontró la mascota');
        return;
    }
    
    const nuevoNombre = prompt('Nuevo nombre de la mascota:', mascota.nombreMascota);
    
    if (!nuevoNombre || nuevoNombre.trim() === '') {
        return;
    }
    
    if (nuevoNombre.length <= 2 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nuevoNombre)) {
        mostrarAlerta('error', 'El nombre debe ser alfabético y mínimo de dos caracteres.');
        return;
    }
    
    try {
        // CORREGIDO: Asegurar que mascotaId sea numérico
        const response = await fetch(`${API_URL}/usuarios/mascotas/${mascotaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombreMascota: nuevoNombre.trim(),
                tamanoMascota: mascota.tamanoMascota
            })
        });
        
        if (response.ok) {
            const mascotaActualizada = await response.json();
            // Actualizar en la lista local
            const index = mascotasUsuario.findIndex(m => m.idMascota === mascotaId);
            if (index !== -1) {
                mascotasUsuario[index] = mascotaActualizada;
            }
            mostrarMascotas();
            mostrarAlerta('exito', 'Mascota actualizada correctamente');
        } else {
            throw new Error('Error al actualizar mascota');
        }
        
    } catch (error) {
        console.error('Error editando mascota:', error);
        mostrarAlerta('error', 'Error al actualizar la mascota');
    }
}

async function eliminarMascota(mascotaId) {
    const confirmacion = await mostrarAlerta('confirmar', 
        'Esta acción no se puede deshacer',
        {
            titulo: '¿Eliminar mascota?',
            botonConfirmar: 'Sí, eliminar'
        }
    );
    
    if (!confirmacion.isConfirmed) return;
    
    try {
        // CORREGIDO: Asegurar que mascotaId sea numérico
        const response = await fetch(`${API_URL}/usuarios/mascotas/eliminar/${mascotaId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            // Eliminar de la lista local
            mascotasUsuario = mascotasUsuario.filter(m => m.idMascota !== mascotaId);
            mostrarMascotas();
            mostrarAlerta('exito', 'Mascota eliminada correctamente');
        } else {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al eliminar mascota');
        }
        
    } catch (error) {
        console.error('Error eliminando mascota:', error);
        mostrarAlerta('error', 'Error al eliminar la mascota');
    }
}

function cerrarSesion() {
    console.log('🚪 Cerrando sesión...');
    
    mostrarAlerta('confirmar', 'Serás redirigido a la página de inicio', {
        titulo: '¿Cerrar sesión?',
        botonConfirmar: 'Sí, cerrar sesión'
    }).then((result) => {
        if (result.isConfirmed) {
            // Limpiar TODOS los datos de sesión (igual que en otras páginas)
            localStorage.removeItem('usuarioActivo');
            localStorage.removeItem('jwt');
            localStorage.removeItem('token');
            localStorage.removeItem('usuarioId');
            sessionStorage.clear();
            
            console.log('✅ Datos de sesión eliminados');
            window.location.href = '../HTML/inicioSesion.html';
        }
    });
}

async function cargarHistorial() {
    setTimeout(() => {
        const historialBody = document.getElementById('historialActividades');
        if (historialBody) {
            historialBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-5">
                        <div class="empty-state">
                            <i class="bi bi-calendar-x"></i>
                            <h5>No hay actividades recientes</h5>
                            <p class="text-muted">Cuando hagas reservas o actividades, aparecerán aquí.</p>
                            <a href="../HTML/servicios.html" class="btn btn-primary mt-3">
                                <i class="bi bi-plus-circle me-2"></i>Explorar Servicios
                            </a>
                        </div>
                    </td>
                </tr>
            `;
        }
    }, 1000);
}

function activarTogglePassword(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    
    if (!input || !toggle) return;
    
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

function toggleSizeBubble(bubbleId) {
    const bubble = document.getElementById(bubbleId);
    if (!bubble) return;
    
    const isVisible = bubble.style.display === "block";
    
    document.querySelectorAll(".size-bubble").forEach(b => b.style.display = "none");
    
    if (!isVisible) {
        bubble.style.display = "block";
        
        setTimeout(() => {
            bubble.style.display = "none";
        }, 10000);
    }
}

document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("size-info-icon")) {
        document.querySelectorAll(".size-bubble").forEach(b => b.style.display = "none");
    }
});


window.editarMascota = editarMascota;
window.eliminarMascota = eliminarMascota;
window.toggleSizeBubble = toggleSizeBubble;
window.cerrarSesion = cerrarSesion;