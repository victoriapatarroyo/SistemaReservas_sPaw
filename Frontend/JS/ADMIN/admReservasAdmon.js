// URL del backend
const API_URL = 'http://localhost:8080/reservas';

let todasLasReservas = [];

// Cargar reservas al iniciar la página
window.addEventListener('DOMContentLoaded', cargarReservas);

async function cargarReservas() {
    const contenedor = document.getElementById('contenedor');
    contenedor.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Cargando reservas...</p>
        </div>
    `;

    try {
        const headers = { 'Content-Type': 'application/json' };

        const jwtData = localStorage.getItem('jwt');
        if (jwtData) {
            const { token } = JSON.parse(jwtData);
            if (token) headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(API_URL, { headers });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        todasLasReservas = await response.json();
        mostrarReservas(todasLasReservas);

    } catch (error) {
        console.error('Error al cargar reservas:', error);
        contenedor.innerHTML = `
            <div class="error">
                <h3><i class="bi bi-exclamation-triangle"></i> Error al cargar reservas</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

function mostrarReservas(reservas) {
    const contenedor = document.getElementById('contenedor');
    document.getElementById('totalReservas').textContent = reservas.length;


    if (reservas.length === 0) {
        contenedor.innerHTML = `
            <div class="no-data">
                <i class="bi bi-calendar-x" style="font-size: 3em; color: #ccc;"></i>
                <p>No hay reservas registradas</p>
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
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Hora inicio</th>
                        <th>Hora final</th>
                        <th>Groomer</th>
                        <th>Servicio</th>
                        <th>Mascota</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${reservas.map(reserva => `
                        <tr>
                            <td><strong>#${reserva.idReserva}</strong></td>
                            <td>
                                <i class="bi bi-person-circle"></i>
                                ${reserva.mascota?.usuario
                                ? `${reserva.mascota.usuario.nombre} ${reserva.mascota.usuario.apellido}`
                                : 'No asignado'}
                            </td>                            
                            <td>${reserva.fecha}</td>
                            <td>${reserva.horaInicio}</td>
                            <td>${reserva.horaFinal}</td>
                            <td>
                                <i class="bi bi-person"></i>
                                ${reserva.groomer
                                    ? `${reserva.groomer.nombre} ${reserva.groomer.apellido}`
                                    : 'No asignado'}
                            </td>
                            <td>
                                <i class="bi bi-scissors"></i>
                                ${reserva.servicio?.nombre || 'No asignado'}
                            </td>
                            <td>
                                <i class="bi bi-heart-fill" style="color:#2AB7AE;"></i>
                                ${reserva.mascota?.nombreMascota || 'No asignada'}
                            </td>
                            <td>
                                <div class="action-icons">
                                    <i class="bi bi-trash action-icon"
                                       title="Eliminar"
                                       onclick="eliminarReserva(${reserva.idReserva})"></i>
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


async function eliminarReserva(id) {
    const resultado = await mostrarAlerta(
        'confirmar',
        `¿Deseas eliminar la reserva <strong>#${id}</strong>?<br>Esta acción no se puede deshacer.`,
        { botonConfirmar: 'Eliminar reserva' }
    );

    if (!resultado?.isConfirmed) return;

    try {
        const jwtData = localStorage.getItem('jwt');
        if (!jwtData) {
            mostrarAlerta('error', 'No estás autenticado.');
            return;
        }

        const { token } = JSON.parse(jwtData);

        const response = await fetch(`${API_URL}/eliminar/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            mostrarAlerta('exito', 'Reserva eliminada correctamente');
            cargarReservas();
        } else {
            const msg = await response.text();
            mostrarAlerta('error', msg || 'No se pudo eliminar la reserva');
        }
    } catch (error) {
        console.error(error);
        mostrarAlerta('error', 'Error de conexión con el servidor');
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
