
import { modificarDatosTablas } from "./fnEventos.js";

import {
    buscarKeyValue,
    crearAlerta,
    crearSelect,
    generarCodigoUnico,
    ordenarArray,
    tablaHorizontal
} from "./funciones.js";

//! constructores

class Modelo {
    constructor(objeto) {
        !objeto.id ? this.id = generarCodigoUnico() : this.id = objeto.id
        this.marca = objeto.marca;
        this.modelo = objeto.modelo;
    }
}

//! variables globales

// array con el orden de las claves para ordenar el array modelos
const ordenarModelo = ['marca', 'modelo'];
// guardo en una variable el formulario para ingresar los selects y capturar datos
const formulario = document.getElementById('formularioNuevoModelo');
// variables que no se pueden repetir
const noRepetirModelo = ['marca', 'modelo'];

//! datos en local sotrage

// carga de marcas guarrdas en local storage
const marcasLS = JSON.parse(localStorage.getItem('marcas'));
// creacion de array con las marcas registradas para crear select
const marcasCargadas = marcasLS ? marcasLS.map(elemento => elemento.marca): [];

// carga de modelos guardados en local storage
const modelosLS = JSON.parse(localStorage.getItem('modelos'));
modelosLS && ordenarArray(modelosLS, ordenarModelo);
let modelos = modelosLS ? modelosLS.map(modelo => new Modelo(modelo)) : [];

//! codigo de la pagina

// creacion de select para mostrar las marcas registradas
const selectMarcas = crearSelect(marcasCargadas, 'marcaSelect', 'marca');
formulario.insertBefore(selectMarcas, formulario.firstChild)

// creacion de tabla mostrando las marcas registradas
tablaHorizontal(modelos, 'tablaModelos');

// registro de un nuevo modelo, se agrega en el array modelos y se guarda en local storage
formulario.onsubmit = (e) => {
    e.preventDefault();
    // variables locales
    // variable para almacenar los datos ingresados en el formulariio
    const nuevoModelo = {};

    // obtengo los datos que se ingresaron en el formulario
    const formModelo = new FormData(formulario);
    formModelo.forEach((value, key) => nuevoModelo[key] = value.trim());

    // verifico que no haya datos vacios
    const DatoVacio = Object.values(nuevoModelo).some(value => value == '');

    if (DatoVacio) {
        crearAlerta('TODOS los campos son Obligatorios', 'alertaModelo');
    } else {
        // verifico que el modelo no se encuentre ya cargado
        const ModeloRepetido = buscarKeyValue (modelos, nuevoModelo,noRepetirModelo);
        if (ModeloRepetido != -1) {
            crearAlerta(`Para la Marca: ${nuevoModelo.marca} el Modelo: ${nuevoModelo.modelo} ya se encuentra cargado`,'alertaModelo');
        // si se ingresaron datos validos guardo en array modelos y en local storage
        } else {
            modelos.push(new Modelo(nuevoModelo));
            ordenarArray(modelos, ordenarModelo)
            localStorage.setItem('modelos', JSON.stringify(modelos));
            tablaHorizontal(modelos, 'tablaModelos');
            formulario.reset()
        }
    }   
} 

// modificacion o eliminacion de modelos. guardado en local storage
document.getElementById('tablaModelos').onclick = (e) => {

    modificarDatosTablas (e, 'tablaModelos', modelos, 'modelos', noRepetirModelo, ordenarModelo)

}
