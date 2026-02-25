function mostrarAlerta(tipo, mensaje, opciones = {}) {
    if (opciones.campoId) {
        const field = document.getElementById(opciones.campoId);
        if (!field) return;
        
        limpiarErroresCampo(field);
        
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

    const config = { html: mensaje, confirmButtonColor: '#e97502' };

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
    
    return Swal.fire(config);
}

function limpiarErroresCampo(field) {
    const formFloating = field.closest('.form-floating');
    if (formFloating) {
        const errores = formFloating.querySelectorAll('.error-message');
        errores.forEach(error => error.remove());
    }
    field.classList.remove('is-invalid');
}

function limpiarTodosErrores(formId = null) {
    const selector = formId ? `#${formId} .is-invalid` : '.is-invalid';
    const campos = document.querySelectorAll(selector);
    
    campos.forEach(campo => {
        campo.classList.remove('is-invalid');
        const formFloating = campo.closest('.form-floating');
        if (formFloating) {
            const errores = formFloating.querySelectorAll('.error-message');
            errores.forEach(error => error.remove());
        }
    });
}

function mostrarValidaciones(campoId, mensaje) {
    mostrarAlerta('error', mensaje, { campoId: campoId });
}

function limpiarValidaciones() {
    limpiarTodosErrores();
}

function validarCampo(campo) {
    if (campo.checkValidity() && campo.value.trim() !== "") {
        campo.classList.remove("is-invalid");
        campo.classList.add("is-valid");
        const error = campo.closest(".form-floating")?.querySelector(".error-message");
        if (error) error.remove();
    }
}

function inicializarValidacionCampos(ids) {
    ids.forEach(id => {
        const campo = document.getElementById(id);
        if (!campo) return;
        campo.addEventListener("input", () => validarCampo(campo));
        campo.addEventListener("change", () => validarCampo(campo));
    });
}

window.mostrarAlerta = mostrarAlerta;
window.limpiarErroresCampo = limpiarErroresCampo;
window.limpiarTodosErrores = limpiarTodosErrores;
window.mostrarValidaciones = mostrarValidaciones;
window.limpiarValidaciones = limpiarValidaciones;
window.validarCampo = validarCampo;
window.inicializarValidacionCampos = inicializarValidacionCampos;