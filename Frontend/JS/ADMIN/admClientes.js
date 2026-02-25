// URL del backend - ajusta según tu configuración
const API_URL = 'http://localhost:8080/usuarios';

let todosLosUsuarios = [];

// Cargar usuarios al iniciar la página
window.addEventListener('DOMContentLoaded', cargarUsuarios);

async function cargarUsuarios() {
    const contenedor = document.getElementById('contenedor');
    contenedor.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Cargando usuarios...</p>
        </div>
    `;

    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Intentar obtener el token si existe
        const jwtData = localStorage.getItem('jwt');
        if (jwtData) {
            try {
                const { token } = JSON.parse(jwtData);
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            } catch (e) {
                console.warn('Error al parsear JWT:', e);
            }
        }

        const response = await fetch(API_URL, { headers });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        todosLosUsuarios = await response.json();
        mostrarUsuarios(todosLosUsuarios);
        
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        contenedor.innerHTML = `
            <div class="error">
                <h3><i class="bi bi-exclamation-triangle"></i> Error al cargar los datos</h3>
                <p>${error.message}</p>
                <p>Verifica que el backend esté ejecutándose en: ${API_URL}</p>
            </div>
        `;
    }
}

function mostrarUsuarios(usuarios) {
    const contenedor = document.getElementById('contenedor');
    document.getElementById('totalUsuarios').textContent = usuarios.length;

    if (usuarios.length === 0) {
        contenedor.innerHTML = `
            <div class="no-data">
                <i class="bi bi-inbox" style="font-size: 3em; color: #ccc;"></i>
                <p>No se encontraron usuarios</p>
            </div>
        `;
        return;
    }

    const tablaHTML = `
        <div class="table-container">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre Completo</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Mascotas</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${usuarios.map(usuario => `
                        <tr>
                            <td><strong>#${usuario.idUsuario}</strong></td>
                            <td>${usuario.nombre} ${usuario.apellido}</td>
                            <td>
                                <i class="bi bi-telephone"></i> ${usuario.telefono}
                            </td>
                            <td>
                                <i class="bi bi-envelope"></i> ${usuario.email}
                            </td>
                            <td>
                                <span class="badge-rol rol-${usuario.rol.toLowerCase()}">
                                    ${usuario.rol}
                                </span>
                            </td>
                            <td>
                                ${usuario.mascotas && usuario.mascotas.length > 0
                                    ? `
                                    <i class="bi bi-heart-fill" style="color: #2AB7AE;"></i>
                                        ${usuario.mascotas.map(m => m.nombreMascota).join(', ')}
                                    `
                                    : '<span style="color: #999;">Sin mascotas</span>'
                                }
                            </td>
                            <td>
                                <div class="action-icons">
                                    <i class="bi bi-trash action-icon" title="Eliminar" onclick="eliminar(${usuario.idUsuario})"></i>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    contenedor.innerHTML = tablaHTML;
}

function filtrarPorRol() {
    const rolSeleccionado = document.getElementById('filtroRol').value;
    
    if (rolSeleccionado === '') {
        mostrarUsuarios(todosLosUsuarios);
    } else {
        const usuariosFiltrados = todosLosUsuarios.filter(
            usuario => usuario.rol === rolSeleccionado
        );
        mostrarUsuarios(usuariosFiltrados);
    }
}

// Funciones de acción (puedes personalizarlas según tus necesidades)
function verDetalle(id) {
    const usuario = todosLosUsuarios.find(u => u.idUsuario === id);
    if (usuario) {
        let detalles = `Detalles del Usuario #${id}\n\n`;
        detalles += `Nombre: ${usuario.nombre} ${usuario.apellido}\n`;
        detalles += `Teléfono: ${usuario.telefono}\n`;
        detalles += `Email: ${usuario.email}\n`;
        detalles += `Rol: ${usuario.rol}\n`;
        if (usuario.mascotas && usuario.mascotas.length > 0) {
            detalles += `\nMascotas:\n`;
            usuario.mascotas.forEach(m => {
                detalles += `- ${m.nombre || 'Sin nombre'}\n`;
            });
        }
        alert(detalles);
    }
}

async function eliminar(id) {
    const resultado = await mostrarAlerta('confirmar', 
        `¿Estás seguro de que deseas eliminar al usuario <strong>#${id}</strong>?<br>Esta acción no se puede deshacer.`, 
        { botonConfirmar: 'Eliminar definitivamente' }
    );

    if (resultado && resultado.isConfirmed) {
        try {
            // Obtener el objeto JWT del localStorage
            const jwtData = localStorage.getItem('jwt');
            
            if (!jwtData) {
                mostrarAlerta('error', 'No estás autenticado. Por favor, inicia sesión.');
                return;
            }
            
            // Parsear el JSON y extraer el token
            const { token } = JSON.parse(jwtData);
            
            if (!token) {
                mostrarAlerta('error', 'Token no válido. Por favor, inicia sesión nuevamente.');
                return;
            }

            const response = await fetch(`${API_URL}/eliminar/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                mostrarAlerta('exito', 'El usuario ha sido eliminado correctamente.');
                await cargarUsuarios(); 
            } else if (response.status === 401 || response.status === 403) {
                mostrarAlerta('error', 'No tienes permisos para eliminar usuarios o tu sesión ha expirado.');
            } else {
                const mensajeError = await response.text();
                mostrarAlerta('error', `No se pudo eliminar: ${mensajeError || 'Error del servidor'}`);
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            mostrarAlerta('error', 'Ocurrió un fallo en la conexión con el servidor.');
        }
    }
}

function mostrarAlerta(tipo, mensaje, opciones = {}) {
    if (opciones.campoId) {
        const field = document.getElementById(opciones.campoId);
        if (!field) return;
        const formFloating = field.closest('.form-floating');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message text-danger mt-1 small';
        errorElement.textContent = mensaje;
        formFloating.appendChild(errorElement);
        field.classList.add('is-invalid');
        return;
    }

    if (tipo === 'confirmar') {
        return Swal.fire({
            icon: 'warning',
            title: '¿Confirmar?',
            html: mensaje,
            showCancelButton: true,
            confirmButtonColor: '#e97502',
            cancelButtonColor: '#2ab7ae',
            confirmButtonText: opciones.botonConfirmar || 'Sí',
            cancelButtonText: 'Cancelar'
        });
    }

    const config = {
        html: mensaje,
        confirmButtonColor: '#e97502'
    };

    if (tipo === 'exito') {
        config.icon = 'success';
        config.title = '¡Éxito!';
        config.timer = opciones.duracion || 2000;
        config.showConfirmButton = false;
        config.timerProgressBar = true;
    } else if (tipo === 'error') {
        config.icon = 'error';
        config.title = 'Error';
        config.confirmButtonText = 'Entendido';
    } else if (tipo === 'info') {
        config.icon = 'info';
        config.title = 'Información';
    }

    if (opciones.titulo) config.title = opciones.titulo;

    Swal.fire(config);
}
