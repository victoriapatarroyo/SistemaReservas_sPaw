function validaciones() {

    limpiarValidaciones();

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value;
    const mensaje = document.getElementById('mensaje').value.trim();


    if (nombre.length <= 2 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
        mostrarValidaciones('nombre','El nombre debe ser alfabético y mínimo dos caracteres');
        return false;
    }

    if (apellido.length <= 2 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellido)) {
        mostrarValidaciones('apellido','El nombre debe ser alfabético y mínimo dos caracteres');
        return false;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarValidaciones('email','Por favor ingresa un email válido');
        return false;
    }

    if (telefono.length < 10 || isNaN(telefono)) {
        mostrarValidaciones('telefono','El teléfono debe contener 10 dígitos');
        return false;
    }

    if (mensaje.length < 10) {
        mostrarValidaciones('mensaje','El mensaje debe tener al menos 10 caracteres');
        return false;
    }

    mostrarAlerta('success', '<strong>¡Éxito!</strong> Todos los campos son válidos. Enviando formulario...');
            

    setTimeout(() => {
        document.getElementById('formContactenos').submit();
    }, 1500);        

    return true;
}

document.addEventListener("DOMContentLoaded", () => {

    const campos = [
    "nombre",
    "apellido",
    "email",
    "telefono",
    "mensaje"
    ];

    inicializarValidacionCampos(campos);

});