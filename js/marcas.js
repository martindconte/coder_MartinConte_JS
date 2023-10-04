import { modificarDatosTablas } from "./fnEventos.js";

import {
    buscarKeyValue,
    crearAlerta,
    generarCodigoUnico,
    ordenarArray,
    tablaHorizontal,
} from "./funciones.js";

//! constructores

class Marca {
    constructor(objeto) {
        !objeto.id ? this.id = generarCodigoUnico() : this.id = objeto.id
        this.marca = objeto.marca;
    }
}

//! variables globales

// array con el orden de las claves para ordenar el array marcas
const ordenarMarca = ['marca'];
// array con las claves cuyo valores no se pueden repetir entre los objetos marca
const clavesNoRepetir = ['marca']

//! local storage

const marcasLS = JSON.parse(localStorage.getItem('marcas'))
marcasLS && ordenarArray(marcasLS, ordenarMarca)
let marcas = marcasLS ? marcasLS.map(marca => new Marca(marca)) : [];

//! codigo de la pagina

// creacion de tabla mostrando las marcas registradas
tablaHorizontal(marcas, 'tablaMarcas')

// registro de nueva marca, se agrega en el array marcas y se guarda en local storage
document.getElementById('marcasRegistar').onclick = () => {

    // variables locales
    const marcaIngresada = {};

    // guardo en el objeto marcaIngresada el valor ingresado
    marcaIngresada['marca'] = document.getElementById('marcaIngresada').value.trim();
    console.log(marcaIngresada);

    // verifico que la marca ingresada no se encuentre ya cargada
    const marcaRepetida = buscarKeyValue(marcas, marcaIngresada, ['marca']);
    console.log((marcaRepetida));

    if (marcaIngresada.marca == '') {
        crearAlerta('Debe ingresar una Marca', 'msjAlertaMarca');
    } else if (marcaRepetida != -1) {
        crearAlerta(`la MARCA: ${marcaIngresada.marca} ya se encuentra cargada`, 'msjAlertaMarca');
    } else {
        marcas.push(new Marca(marcaIngresada));
        ordenarArray(marcas, ordenarMarca);
        localStorage.setItem('marcas', JSON.stringify(marcas));
        tablaHorizontal(marcas, 'tablaMarcas');
        document.getElementById('marcaIngresada').value = '';
    }
}

// modificacion o eliminacion de marcas. guardado en local storage
document.getElementById('tablaMarcas').onclick = (e) => {

    modificarDatosTablas (e, 'tablaMarcas', marcas, 'marcas', clavesNoRepetir, ordenarMarca)

}
