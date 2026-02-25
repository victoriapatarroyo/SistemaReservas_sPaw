class ReservaCard extends HTMLElement {

    connectedCallback() {

        const rawData = {
            servicio: this.getAttribute('nombreServicio'),
            mascota: this.getAttribute('nombreMascota'),
            tamano: this.getAttribute('tamanoMascota'),
            groomer: this.getAttribute('nombreGroomer'),
            fecha: this.getAttribute('fechaReserva'),
            hora: this.getAttribute('horaReserva'),
            id: this.getAttribute('idReserva')
        };

        const nombreServicio = rawData.servicio || 'Servicio no especificado';
        const nombreMascota = rawData.mascota || 'Mascota no especificada';
        const tamanoMascota = rawData.tamano || 'No especificado';
        const nombreGroomer = rawData.groomer || 'Groomer no asignado';
        const fechaReserva = rawData.fecha || 'Fecha no definida';
        const horaReserva = rawData.hora || 'Hora no definida';
        const idReserva = rawData.id || '0';

        this.innerHTML = `
            <div class="col d-flex">
                <div class="card h-100 w-100 card-reserva">
                    <div class="card-header bg-light border-0 py-3" style="min-height: 80px;">
                        <div class="d-flex justify-content-between align-items-start">
                            <h3 class="h5 fw-bold mb-0 text-primary titulo-controlado"
                                title="${nombreServicio}">
                                ${nombreServicio}
                            </h3>
                            <button class="btn btn-eliminar-reserva eliminar-reserva"
                                    data-id="${idReserva}"
                                    title="Eliminar reserva">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body py-3 d-flex flex-column bg-light">
                        <div class="mb-3 flex-grow-1">
                            <div class="text-start">
                                <p class="mb-2"><strong>Nombre de la mascota:</strong> ${nombreMascota}</p>
                                <p class="mb-2"><strong>Tamaño:</strong> 
                                    <span class="badge bg-primary text-white">${tamanoMascota}</span>
                                </p>
                                <p class="mb-2"><strong>Groomer escogido:</strong> ${nombreGroomer}</p>
                                <p class="mb-2"><strong>Fecha:</strong> ${fechaReserva}</p>
                                <p class="mb-0"><strong>Hora:</strong> ${horaReserva}</p>
                            </div>
                        </div>
                        <div class="mt-auto pt-3">
                            <a href="../HTML/servicios.html" 
                            class="btn btn-primary w-100 py-2">
                                <i class="bi bi-arrow-left me-2"></i>
                                Volver a servicios
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('reserva-card', ReservaCard);