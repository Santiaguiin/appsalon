let paso = 1;

const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios:[],
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion(); // muestra y oculta las secciones
    tabs();// Cambia la seccion cuando se presionen los tabs
    botonesPaginador(); //Agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();

    consultarAPI(); // Consulta la API en el backend de PHP

    idCliente(); // anade el id del cliente al objeto de cita
    nombreCliente(); // anade el nombre del cliente al objeto de cita
    seleccionarFecha(); // anade la fecha de la cita en el objeto
    seleccionarHora(); // anade la hora de la cita en el objeto

    mostrarResumen(); // Muestra el resumen de la cita 


}
function mostrarSeccion() {

    //Ocultar la clase de mostrar antes de que se seleccione una nueva seccion
    const seccionAnterior = document.querySelector('.mostrar');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');//quitar la clase de mostrar
    }
    

    //Seleccionar la seccion con el paso que se cambia en tabs...
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    // Quita la clase de actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    //Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');

}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach(boton => {
        boton.addEventListener('click', function (e) {
            paso = parseInt( e.target.dataset.paso);

            mostrarSeccion();
            botonesPaginador();
        });
    });
}

function botonesPaginador() {

    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if (paso === 1) {
        paginaSiguiente.classList.remove('ocultar');
        paginaAnterior.classList.add('ocultar');
    }else if (paso === 2) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    }

    mostrarSeccion();
}
function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function () {
        if (paso <= pasoInicial) return;
        paso--;

        botonesPaginador();
    })
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function () {
        if (paso >= pasoFinal) return;
        paso++;

        botonesPaginador();
    })
}

async function consultarAPI() {

    try {
        
        const url = `${location.origin}/api/servicios`;
        const resultado =  await fetch(url);
        const servicios =  await resultado.json();

        mostrarServicios(servicios);

    } catch (error) {
        console.log(error);
    }

}

function mostrarServicios(servicios) {
    servicios.forEach( servicio => {
        const {id, nombre, precio} = servicio;
        
        const precioFormateado = precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); //darle formato al precio con puntos

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precioFormateado}`;

        const servicioDiv =  document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function() {
            seleccionarServicio(servicio)
        };

        servicioDiv.appendChild(nombreServicio);// ponemos nombreServicio dentro de servicioDiv
        servicioDiv.appendChild(precioServicio);// ponemos precioServicio dentro de servicioDiv luego de nombreServicio

        document.querySelector('#servicios').appendChild(servicioDiv);// anadimos los servicios al html

    });
}

function seleccionarServicio(servicio) {
    const {id} = servicio;// seleccionar como variable el id que esta dentro de servicio
    const { servicios } = cita;// seleccionar como variable los servicios que estan dentro de cita
  
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`); // Identificar el elemento al que se le da click

    //Comprobar si un servicio ya fue agregado o quitarlo
    if ( servicios.some( agregado => agregado.id === id) ) { // servicios es el mismo agregado solo que se le cambia el nombre dentro de la funcion de some, con esa funcion va a iterar y nos va a comprobar si el elemento que estamos seleccionando ya esta dentro del arreglo

        //Eliminar el elemento que ya estaba seleccionado
        cita.servicios = servicios.filter( agregado => agregado.id !== id );
        divServicio.classList.remove('seleccionado');

    } else {
        //Agregar el elemento si no estaba seleccionado aun
        cita.servicios = [...servicios, servicio]; // anadimos a cita servicios una copia de lo que ya hay en el arreglo y le anadimos lo nuevo que se seleccione
        divServicio.classList.add('seleccionado');
    }
}

function idCliente() {
    const id = document.querySelector('#id').value;

    cita.id = id; 
}

function nombreCliente() {
    const nombre =  document.querySelector('#nombre').value;// Seleccionamos el value del elemento que tiene el id nombre

    cita.nombre = nombre; // le anadimos el nombre al arreglo
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e){
        const dia = new Date(e.target.value).getUTCDay(); // seleccionamos que dia selecciono el usuario
        if ( [6,0].includes(dia) ) {// le pasamos a include el arreglo y el dato con el cual lo va a comparar
            e.target.value = ''; // si selecciona un sabado u domingo lo deja vacio 
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
        } else {
            cita.fecha = e.target.value; // le anadimos a el arreglo de cita en el campo de fecha, el valor que el usuario selecciono
        }
    });
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e) {
        const horaCita = e.target.value;
        const hora = horaCita.split(":");
        if (hora[0] < 10 || hora[0] > 19) {
            e.target.value = '';
            mostrarAlerta('Esta hora no es permitida', 'error', '.formulario');
        } else {
            cita.hora = e.target.value;
        }
    });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
    const alertaPrevia = document.querySelector('.alerta');

    if (alertaPrevia) { // Evitamos que se genere mas de una alerta seguida
        alertaPrevia.remove();
    }
    // Script para crear la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje; 
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);  

    //Eliminar la alerta despues de 3 segundos
    if (desaparece) {
        setTimeout(() => {
            alerta.remove();
        }, 5000);
    }

}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    // Formatear el div de resumen
    const { nombre, fecha, hora, servicios } = cita;

    //Limpiar el contenido de resumen
    while (resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if (Object.values(cita).includes("") || cita.servicios.length == 0) { //iteremos con el object sobre el objeto de citas y revisamos si incluye un string vacio
        mostrarAlerta('Faltan datos de servicios, fecha u hora', 'error', '.contenido-resumen', false);
        return;
    }

    // Headin para los servicios 
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

    // Iterando y mostrando los servicios
    servicios.forEach(servicio => {
        const{ id, precio, nombre } = servicio;
        const precioFormateado = precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precioFormateado}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    });

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span> Nombre: </span> ${nombre}`;

    //Formatear la fecha en espanol
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date( Date.UTC( year, mes, dia ) );

    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    const fechaFormateada = fechaUTC.toLocaleDateString("es-CO", opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span> Fecha: </span> ${fechaFormateada}`;
    
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span> Hora: </span> ${hora} horas`;

    const resumenCita = document.createElement('H3');
    resumenCita.textContent = 'Resumen de Datos';
    resumen.appendChild(resumenCita);

    // Boton para Crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);
}

async function reservarCita() {
    const {nombre, fecha, hora, servicios, id} = cita;

    const idServicios = servicios.map( servicio => servicio.id ); //iterar sobre los servicios y obtener el campo id

    const datos = new FormData();

    // Datos de la cita
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('usuarioId', id);
    datos.append('servicios', idServicios);

    // console.log(...datos);

    try {
        // Peticion hacia la api
        const url = `${location.origin}/api/citas`;
        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });

        resultado = await respuesta.json();

        if (resultado.resultado) {
            Swal.fire({
                icon: "success",
                title: "Cita Creada",
                text: "Tu cita fue creada correctamente",
                button: 'OK'
            }).then( () => {
                window.location.reload();
            })
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al guardar la cita"
          });
    }

}

