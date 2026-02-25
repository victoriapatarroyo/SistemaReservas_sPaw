function guardarInformacion() {
    let nombreServicio = document.getElementById("nombreServicio").value;
    let descripcionServicio = document.getElementById("descripcionServicio").value;
    let imgServicio = "../../IMG/SERVICIOS/servicio_basico3.png"
    let precioPequeno = document.getElementById("precioPequeno").value;
    let precioMediano = document.getElementById("precioMediano").value;
    let precioGrande = document.getElementById("precioGrande").value;
    let duracionPequeno = document.getElementById("duracionPequeno").value;
    let duracionMediano = document.getElementById("duracionMediano").value;
    let duracionGrande = document.getElementById("duracionGrande").value;

    const infoServicios = {
        nombre: nombreServicio,
        descripcion: descripcionServicio,
        precioPequeno: precioPequeno,
        duracionPequeno: duracionPequeno,
        precioMediano: precioMediano,
        duracionMediano: duracionMediano,
        precioGrande: precioGrande,
        duracionGrande: duracionGrande
    };

    let listaServicios = JSON.parse(localStorage.getItem("listaServicios")) || [];
    listaServicios.push(infoServicios);
    localStorage.setItem("listaServicios", JSON.stringify(listaServicios));

    //Aleta para el usuario
    mostrarAlerta('Información enviada correctamente.', 'success');
            
    actualizarServicios();
}

function actualizarServicios() {
    const servicios = JSON.parse(localStorage.getItem("listaServicios")) || [];
    const contenedor = document.getElementById("servicios_Basicos");

    contenedor.innerHTML = "";

    servicios.forEach(p => {
        const div = document.createElement("div");
        div.className = "card-servicio-basico col-12 col-xl-5 d-flex rounded-5 justify-content-center my-3 p-4";
        div.innerHTML = `

                    <div class="d-flex flex-column">
                        <h3 class="subtittle mb-2">${p.nombre}</h3>
                        <p>${p.descripcion}</p>
                        <ul class="lista-valores p-0">
                            Precio:
                            <li><img src="/IMG/spaw0.png" class="list-style" alt="">${p.precioPequeno}</li>
                            <li><img src="/IMG/spaw0.png" class="list-style" alt="">${p.precioMediano}</li>
                            <li><img src="/IMG/spaw0.png" class="list-style" alt="">${p.precioGrande}</li>
                        </ul>
                    </div>
                    <div class="d-flex flex-column  align-items-center justify-content-evenly">
                        <button class="btn-servicios">¡Agenda ahora!</button>
                        <img src="../IMG/SERVICIOS/servicio_basico.png" class="img-básicos" alt="Imagen perro">
                    </div>

        `;
        contenedor.appendChild(div);
    });
}

function mostrarAlerta(mensaje, tipo = 'success') {
    const alertContainer = document.getElementById('alertContainer');
            
    // Crear el elemento de alerta
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
    alerta.role = 'alert';
    alerta.innerHTML = `
        <strong>${tipo === 'success' ? '¡Éxito!' : tipo === 'danger' ? '¡Error!' : '¡Atención!'}</strong> ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
            
    // Agregar la alerta al contenedor
    alertContainer.appendChild(alerta);
            
    // Remover la alerta después de 5 segundos
    setTimeout(() => {
        alerta.classList.remove('show');
        setTimeout(() => alerta.remove(), 150);
    }, 5000);
}

