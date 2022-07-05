// Proyecto final - Filolearning Student Shop

// Declaración de variables
let carrito;
// Si ya hay un carrito guardado en el local storage lo traemos tal como está, si no será un array vacío de momento.
carrito = JSON.parse(localStorage.getItem('carrito')) || []
let productosJSON = [];
let dolarCompra;
let tabla = document.getElementById("tablaCarrito");
let vacio = document.getElementById("vacio");
let finalizarCompra = document.getElementById("finalizar");
let vaciarCarrito = document.getElementById("vaciar");
let campoSuscripcion = document.getElementById("suscripcion");
let suscripcion = document.getElementById("suscribirse");
// Si el carrito está vacio el usuario podrá visualizar un aviso en la tabla de los productos 
// si no, no verá el aviso pues habrá productos en el carrito
carrito.length === 0 ? vacio.innerHTML = `<strong>El carrito está vacío</strong>` : vacio.innerHTML = ``

//Evento para cuando la ventana está cargada
window.onload=()=>{
    document.querySelector("#fila_prueba").style.background="lightsalmon";
    obtenerValorDolar();
    //selector y evento change
    document.querySelector("#seleccion option[value='pordefecto']").setAttribute("selected", true);
    document.querySelector("#seleccion").onchange=()=>filtrarProductos();
    document.querySelector("#filtrado option[value='pordefecto']").setAttribute("selected", true);
    document.querySelector("#filtrado").onchange=()=>filtrarProductos();
};

// Funciones

// La idea de esta función es el renderizado de un array de productos mediante el uso de un ciclo for 
// para que se muestren en el html y poder agregarlos al carrito
function mostrarProductos(array) {
    console.log(array);
    for (const producto of array) {
        document.querySelector("#contenedorCards").innerHTML += (`<li class="col-sm-3 list-group-item">
        <h3>ID: ${producto.id}</h3>
        <img src="${producto.img}" width="250px" height="250px">
        <strong> ${producto.descripcion}</strong>
        <p> ${producto.marca}</p>
        <p>Precio $ ${producto.precio}</p>
        <p>Precio U$ ${(producto.precio/dolarCompra).toFixed(1)}</p>
        <button class="btn btn-success" id='btn${producto.id}'>COMPRAR</button>
    </li>`);
    }
    for (const producto of array) {
        //Evento para cada boton que permita agregar el producto al carrito
            document.querySelector(`#btn${producto.id}`).onclick= function() {
                agregarAlCarrito(producto);
            };
    }
}

// Declaración de clase constructora que servirá como molde para productos que sean agregados al carrito como objetos
class ProductoCarrito {
    constructor(objetoProducto) {
        this.id = objetoProducto.id;
        this.img = objetoProducto.img;
        this.descripcion = objetoProducto.descripcion;
        this.marca = objetoProducto.marca;
        this.precio = objetoProducto.precio;
        this.tipo = objetoProducto.tipo;
        this.cantidad = 1;
    }
}

// Función que permitira agregar los productos al carrito
function agregarAlCarrito (productoComprado) {
    let productoEncontrado = carrito.find(producto => producto.id == productoComprado.id);
    console.log (productoEncontrado);

    if (productoEncontrado == undefined) {

        // "Creación" del producto comprado utilizando la clase constructora como molde
        let alCarrito = new ProductoCarrito (productoComprado);
        carrito.push(alCarrito);
        console.log(carrito);

        // Toast que notificará al usuario el agregado al carrito
        Toastify({
            text: `Agregaste ${productoComprado.descripcion} al carrito`,
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            onClick: function(){} // Callback after click
        }).showToast();

        // Agregamos el producto comprado a la tabla
        document.querySelector("#tablaCarrito").innerHTML+=(`
            <tr id='fila${alCarrito.id}'>
                <td> ${alCarrito.id} </td>
                <td> ${alCarrito.descripcion}</td>
                <td> ${alCarrito.marca}</td>
                <td id='${alCarrito.id}'> ${alCarrito.cantidad}</td>
                <td> ${alCarrito.precio}</td>
                <td> <button class='btn btn-light' onclick='quitarDelCarrito(${alCarrito.id})'>🗑️</button>
            </tr>`);
    } else {
        // Si el producto se repite, solo aumentamos la cantidad en la tabla
        let posicion = carrito.findIndex(producto => producto.id == productoComprado.id);
        console.log(posicion);
        carrito[posicion].cantidad += 1;
        document.getElementById(productoComprado.id).innerHTML=carrito[posicion].cantidad;

        // Toast que notificará el agregado de un producto repetido
        Toastify({
            text: `Agregaste otra unidad de ${productoComprado.descripcion} al carrito`,
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            onClick: function(){} // Callback after click
        }).showToast();
    }
    // Al agregar un producto, el aviso de "el carrito está vacío" desaparecerá
    vacio.innerHTML = ``
    // El precio de la compra se ira actualizando a medida que se sume un producto al carrito
    document.querySelector("#total").innerText=(`Total de su compra: $ ${calcularTotal()}`);
    // El carrito se guardará en el local storage y se irá actualizando con cada agregado
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Si al ingresar al sitio ya hay un carrito guardado en el local storage, lo traemos con esta función
// y el usuario podrá visualizarlo en la tabla y seguir agregando productos si así lo desea. 
function actualizarTabla () {
    for (const producto of carrito) {
        tabla.innerHTML += (`
        <tr id='fila${producto.id}'>
            <td>${producto.id}</td>
            <td>${producto.descripcion}</td>
            <td>${producto.marca}</td>
            <td id = '${producto.id}'>${producto.cantidad}</td>
            <td>$${producto.precio}</td>
            <td> <button class='btn btn-light' onclick='quitarDelCarrito(${producto.id})'>🗑️</button>
        </tr>`);
        carrito.length === 0 ? vacio.innerHTML = `<strong>El carrito está vacío</strong>` : vacio.innerHTML = ``
        document.querySelector("#total").innerText=(`Total de su compra: $ ${calcularTotal()}`);      
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Mediante esta función se calculará el total de la compra considerando los precios de los productos 
// y la cantidad repetida de ellos en el carrito. 
function calcularTotal() {
    let total = 0;
    // Se realiza una multiplicación entre el precio y la cantidad.
    for (const elemento of carrito) {
        total = total + (elemento.precio * elemento.cantidad);
    }
    // Se retorna el valor total calculado, que aparecerá en el DOM.
    return total;
}

// El usuario podrá tener la posibilidad de eliminar un producto del carrito si así lo desea.
// Al realizarla también se elimina el producto del local storage y se actualiza el precio de compra. 
function quitarDelCarrito(id){
    let indice=carrito.findIndex(producto => producto.id==id);
    carrito.splice(indice,1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    
    // Toast que notificará la eliminación de un producto del carrito.
    Toastify({
        text: `Eliminaste un producto del carrito`,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "red",
        },
        onClick: function(){} // Callback after click
    }).showToast();
    
    // La fila del producto es removida de la tabla
    let fila=document.getElementById(`fila${id}`);
    document.getElementById("tablaCarrito").removeChild(fila);
    carrito.length === 0 ? vacio.innerHTML = `<strong>El carrito está vacío</strong>` : vacio.innerHTML = ``
    
    // El total de la compra se verá afectado también por la eliminación de un producto
    document.querySelector("#total").innerText=(`Total de su compra: $ ${calcularTotal()}`);
}

// Esta function permite reordenar los productos de un array de productos según determinados criterios
// que el usuario tendrá disponible en el apartado SELECCIONAR. 
function seleccionarProductos(array) {
    let seleccion = document.querySelector("#seleccion").value;
    console.log(seleccion);
    if (seleccion == "menor") {
        // Ordenar de menor a mayor precio
        array.sort(function(a, b) {
            return a.precio - b.precio
        }); 
    } else if (seleccion == "mayor") {
        // Ordenar de mayor a menor precio
        array.sort(function(a, b) {
            return b.precio - a.precio
        });
    } else if (seleccion == "alfabetico") {
        // Ordenar por orden alfabético
        array.sort(function(a, b) {
            return a.descripcion.localeCompare(b.descripcion);
        });
    } else if (seleccion == "pordefecto") {
        // Poner los productos por defecto, tal como son presentados
        array.sort(function(a, b) {
            return a.id - b.id
        });
    }
    document.querySelector("#contenedorCards").innerHTML="";
    mostrarProductos(array);
}

// Esta function permitirá al usuario filtrar por productos si este así lo desea. 
// Cada condición tiene dentro la function seleccionar para que el usuario pueda
// establecer criterios aún con los productos filtrados
function filtrarProductos () {
    let filtrado = document.querySelector("#filtrado").value;
    console.log(filtrado)
    if (filtrado == "calculadoras") {
        // Filtrar por calculadoras
        let calculadoras = productosJSON.filter((el) => el.tipo.includes(`calculadoras`));
        console.log(calculadoras);
        document.querySelector("#contenedorCards").innerHTML=""; 
        mostrarProductos(calculadoras);
        seleccionarProductos(calculadoras);
    } else if (filtrado == "utiles") {
        // Filtrar por útiles
        let utiles = productosJSON.filter((el) => el.tipo.includes(`utiles`));
        console.log(utiles);
        document.querySelector("#contenedorCards").innerHTML=""; 
        mostrarProductos(utiles); 
        seleccionarProductos(utiles);
    } else if (filtrado == "cuadernos") {
        // Filtrar por cuadernos
        let cuadernos = productosJSON.filter((el) => el.tipo.includes(`cuadernos`));
        console.log(cuadernos);
        document.querySelector("#contenedorCards").innerHTML=""; 
        mostrarProductos(cuadernos); 
        seleccionarProductos(cuadernos);
    } else if (filtrado == "hojas") {
        // Filtrar por hojas
        let hojas = productosJSON.filter((el) => el.tipo.includes(`hojas`));
        console.log(hojas);
        document.querySelector("#contenedorCards").innerHTML=""; 
        mostrarProductos(hojas); 
        seleccionarProductos(hojas);
    } else if (filtrado == "pordefecto") {
        // Filtro por defecto, se muestran todos los productos tal como fueron presentados
        document.querySelector("#contenedorCards").innerHTML=""; 
        mostrarProductos(productosJSON);
        seleccionarProductos(productosJSON);
    }
}

//GETJSON de productos.json. Aquí traemos los productos desde el archivo JSON 
// y los mostramos mediante la función mostrarProductos. 
async function obtenerJSON() {
    const URLJSON="/productos.json"
    const resp=await fetch("productos.json")
    const data= await resp.json()
    productosJSON = data;
    mostrarProductos(productosJSON);
    // También se conecta con la function actualizarTabla mediante un operador lógico AND. 
    // actualizarTabla solo se ejecutará en caso de que el array de carrito no este vacío
    // lease que ya traiga productos desde el storage. 
    carrito.length !== 0 && actualizarTabla()
}

//Función para obtener el valor del dolar blue en tiempo real a través de una API.
async function obtenerValorDolar() {
    const URLDOLAR = "https://api.bluelytics.com.ar/v2/latest";
    const resp=await fetch(URLDOLAR)
    const data=await resp.json()
    // El precio del dólar podrá ser visualizado en el DOM
    document.querySelector("#fila_prueba").innerHTML+=(`<p align="center">Dolar compra: $ ${data.blue.value_buy}  Dolar venta: $ ${data.blue.value_sell}</p>`);
    dolarCompra = data.blue.value_buy;
    obtenerJSON();
}

// Eventos de botones del index

// Botón a través del cual el usuario podrá dar por finalizada su compra. 
finalizarCompra.onclick=()=>{
    if (carrito.length === 0) {
        // El usuario no podrá avanzar si el carrito está vacío.
        Swal.fire({
            icon: 'error',
            title: 'Atención',
            text: 'Debes llenar el carrito para continuar',
        }) 
    } else {
        // Si hay al menos un producto se ejecutará esta condición
        // Una vez presionado le saltará una alerta y se desplegará un formulario que deberá completar 
        // con algunos datos.
        Swal.fire({
            title: 'Deseas avanzar con la compra?',
            text: "Selecciona una opción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si!'
        }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        'Entendido!',
                        'Muchas gracias por tu compra!',
                        'success'
                        )
                        formularioCompra.innerHTML += `
                        <div>
                        <h2>Formulario de compra</h2>
                        </div>
                        <div>
                        <p>Por favor, completa el siguiente formulario de compra y un vendedor se comunicará contigo para concretar la entrega.</p>
                        </div>
                        <form class="row gy-2 gx-3 align-items-center formulario" id="confirmacionCompra">
                        <div class="col-auto">
                        <label class="visually-hidden" for="autoSizingInput">Name</label>
                        <input type="text" class="form-control" id="autoSizingInput" placeholder="Nombre y Apellido" required>
                        </div>
                        <div class="col-auto">
                        <label class="visually-hidden" for="autoSizingInputGroup">Username</label>
                        <div class="input-group">
                        <div class="input-group-text">@</div>
                            <input type="email" class="form-control" id="autoSizingInputGroup" placeholder="Email" required>
                        </div>
                    </div>
                    <div class="col-auto">
                        <label class="visually-hidden" for="autoSizingSelect">Preference</label>
                        <select class="form-select" id="autoSizingSelect" required>
                        <option selected>Forma de entrega</option>
                        <option value="1">Envío</option>
                        <option value="2">Retiro en local</option>
                        </select>
                        </div>
                        <div class="col-auto">
                        <label class="visually-hidden" for="autoSizingSelect">Preference</label>
                        <select class="form-select" id="autoSizingSelect" required>
                        <option selected>Medio de pago</option>
                        <option value="1">Mercado pago</option>
                        <option value="2">Débito</option>
                        <option value="3">Crédito</option>
                        <option value="4">Efectivo</option>
                        </select>
                        </div>
                        <div class="col-auto">
                        <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="autoSizingCheck" required>
                        <label class="form-check-label" for="autoSizingCheck">
                        Acepto términos y condiciones
                        </label>
                        </div>
                        </div>
                        <div class="col-auto">
                        <button type="submit" class="btn btn-primary" id="confirmacionCompra">Enviar</button>
                        </div>
                        </form>`
                        
                        // Evento para validación de formulario al presionar enviar
                        let confirmacionCompra = document.getElementById("confirmacionCompra");
                        confirmacionCompra.addEventListener("submit", validarCompra); 
                        
                        function validarCompra (e) {
                        e.preventDefault();
                        Swal.fire(
                            'Compra confirmada!',
                            'Un vendedor se comunicará contigo vía mail dentro de 24 hs hábiles',
                            'success'
                        )
                        }
                    }
                })
    }
        }

// El usuario también tendrá la opción de eliminar todo su carrito de compras a través de botón.  
vaciarCarrito.onclick=()=>{
    if (carrito.length === 0) {
        // El usuario será alertado con este aviso si presiona este botón y no ha agregado ningún producto al carrito.
        Swal.fire({
            icon: 'error',
            title: 'Atención',
            text: 'No puedes vaciar tu carrito porque está vacío',
        })  
    } else {
        // Advertencia de eliminación de carrito
        // Si el carrito tiene al menos un producto, podrá vaciarlo completamente
        Swal.fire({
            title: 'Estas seguro que deseas vaciar el carrito?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        'Listo!',
                        'El carrito se ha vaciado.',
                        'success'
                    )
                    // Los productos son removidos del local storage.
                    localStorage.removeItem("carrito");
                    vaciarTabla();
                    console.log(carrito);
                    
                    // Los productos se eliminan de la tabla
                    function vaciarTabla() {
                    tabla.innerHTML = " ";
                    formularioCompra.innerHTML = " ";
                    carrito.splice(0, carrito.length);
                    vacio.innerHTML = `<strong>El carrito está vacío</strong>`
                    document.querySelector("#total").innerText=(`Total de su compra: $ ${calcularTotal()}`);
                    }
                }
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

