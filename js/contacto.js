// Eventos para el formulario

// Declaración de variables

let formulario = document.getElementById ("formulario");
let campoConsulta = document.getElementById("consulta");
let campoNombre = document.getElementById("nombre");
let campoSuscripcion = document.getElementById("suscripcion");
let suscripcion = document.getElementById("suscribirse");
formulario.addEventListener("submit", validarFormulario); // Llamada a función validar

// Declaración de funciones y eventos

// Evento para el campo que solicita el nombre
campoNombre.oninput=()=> {
    // Si el usuario ingresa una entrada no válida como un número será notificado
    if (!isNaN(campoNombre.value)) {
        // Incluso, la entrada se verá en color rojo para llamar la atención
        campoNombre.style.color="red";
        Toastify({
            text: "Por favor, ingresa un nombre válido",
            duration: 2000,
            destination: "https://github.com/apvarun/toastify-js",
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            background: "red",
            },
            onClick: function(){} // Callback after click
        }).showToast();    
    } else {
        // Caso contrario, se verá en negro, lo cual indica que la entrada es válida.
        campoNombre.style.color="black";
    }
}

// Esta función simulará el envío de un formulario.
function validarFormulario (e){
    // Si el usuario no completa el campo de la consulta, al presionar enviar se le notificará de ello.
    if(campoConsulta.value=="") {
        e.preventDefault();
        Swal.fire({
            icon: 'info',
            title: 'Atención',
            text: 'Por favor, dejá tu consulta',
        }) 
    //Si el usuario lo completa, recibirá una alerta de envío de formulario con éxito 
    } else {
        e.preventDefault();
        Swal.fire({
            icon: 'success',
            title: 'Su consulta ha sido envíada',
            text: 'Le responderemos dentro de un plazo de 48 hs hábiles',
        }) 
    } 
}

// Mediante el botón de SUSCRIBIRME se simulará un proceso de suscripción para que el usuario reciba ofertas vía mail. 
suscripcion.onclick=()=>{
    if (campoSuscripcion.value == "") {
        // Si el campo del mail está vacío, se le notificará al usuario.
        Swal.fire({
            icon: 'error',
            title: 'Algo salió mal...',
            text: 'Por favor, ingresa tu mail para poder suscribirte',
        }) 
    } else {
        // Si está completo, se le notifica con una alerta de suscripción exitosa.
        Swal.fire({
            icon: 'success',
            title: 'Gracias!',
            text: 'A partir de ahora te notificaremos sobre las mejores ofertas',
        }) 
    }
}