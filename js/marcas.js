import {
    buscarKeyValue,
    creacionInput,
    crearAlerta,
    eliminarColumna,
    encontrarCelda,
    generarCodigoUnico,
    ordenarArray,
    tablaHorizontal
} from "./funciones.js";

//! constructores

export class Marca {
    constructor(objeto) {
        !objeto.id ? this.id = generarCodigoUnico() : this.id = objeto.id
        this.marca = objeto.marca;
    }
}

//! variables globales

// array con el orden de las claves para ordenar el array marcas
const ordenarMarca = ['marca'];
// variable aux para saber si fue presionado un boton en la tabla
let eliminarBtn = false;
// guardo todas las filas a las que corresponde el boton presionado
let trModificado = [];
// guardo en un array los id de los usuarios a eliminar
let auxKeyEliminar = [];

//! local storage

const marcasLS = JSON.parse(localStorage.getItem('marcas'))
marcasLS && ordenarArray(marcasLS, ordenarMarca)
const marcas = marcasLS ? marcasLS.map(marca => new Marca(marca)) : [];

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

    if (marcaIngresada == '') {
        crearAlerta('Debe ingresar una Marca', 'alertaMarca');
    } else if (marcaRepetida != -1) {
        crearAlerta(`la MARCA: ${marcaIngresada.marca} ya se encuentra cargada`, 'alertaMarca');
    } else {
        marcas.push(new Marca(marcaIngresada));
        ordenarArray(marcas, ordenarMarca);
        localStorage.setItem('marcas', JSON.stringify(marcas));
        tablaHorizontal(marcas, 'tablaMarcas');
    }
}

// modificacion o eliminacion de marcas
document.getElementById('tablaMarcas').onclick = (e) => {

    // variable locales
    // guardo en una variable la tabla que se desea modificar
    const tabla = document.getElementById('tablaMarcas');
    // guardo en una variable los encabezados <th></th> que son las claves de los objetos
    const th = tabla.querySelectorAll('th');
    // guardo en un array las claves
    const key = Array.from(th).map(key => key.textContent.toLocaleLowerCase());

    // guardo en una variable en donde hice click
    const btnClick = e.target; 

    // verifico si hice click en un boton
    if (btnClick.tagName == 'BUTTON') {

        //* modificacion de marcas
        // verifico si el boton presionado es modificar
        if (btnClick.getAttribute('data-id') == 'modificar') {

            // muestro y oculto los botones para el caso modificar
            // ocultarBtnModificar();
            btnClick.classList.add('oculto');

            // elimiino los botones eliminar si presione modificar
            if (!eliminarBtn) {
                eliminarColumna('tablaMarcas', encontrarCelda('tablaMarcas', 'eliminar'));
                eliminarBtn = true;
            }

            // guardo en una variable la fila correspondiente al boton presionado
            const tr = btnClick.closest('tr');
            trModificado.push(tr);

            // agrego la clase modificado a la fila correspondiente al boton seleccionado
            tr.classList.add('modificando');
            // guardo los td correspondiente a la fila
            const tdNodeList = tr.querySelectorAll('td');
            // por cada celda agrego un input segun el tipo de dato
            tdNodeList.forEach((td, index) => {
                const value = td.textContent;
                switch (key[index]) {
                    case 'id':
                    case undefined:
                        break;
                    case 'password':
                        td.textContent = '';
                        const inputPass = creacionInput(key[index]);
                        td.appendChild(inputPass);
                        inputPass.value = value;
                        break;
                    case 'fechanacimiento':
                        td.textContent = '';
                        const inputDate = creacionInput(key[index]);
                        td.appendChild(inputDate);
                        inputDate.value = value;
                        break;
                    case 'email':
                        td.textContent = '';
                        const inputEmail = creacionInput(key[index]);
                        td.appendChild(inputEmail);
                        inputEmail.value = value;
                        break;
                    case 'admin':
                        td.textContent = '';
                        const selectAdmin = crearSelect(['true', 'false'])
                        td.appendChild(selectAdmin);
                        selectAdmin.value = value;
                        break;
                    default:
                        td.textContent = '';
                        const inputText = creacionInput(key[index]);
                        td.appendChild(inputText);
                        inputText.value = value;
                        break;
                }
            })

            
        }
    }
}