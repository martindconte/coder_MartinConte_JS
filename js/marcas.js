import {
    buscarKeyValue,
    buscarYReemplazarID,
    creacionInput,
    crearAlerta,
    crearModalConfirmacion,
    eliminarColumna,
    eliminarElementoArray,
    encontrarCelda,
    generarCodigoUnico,
    ordenarArray,
    tablaHorizontal,
    valoresRepetidos
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

document.getElementById('tablaUsuarios').onclick = (e) => {
    
    modificarDatosTablas (e, 'tablaMarcas', marcas, 'marcas', clavesNoRepetir, ordenarMarca)

}

// // modificacion o eliminacion de marcas
// document.getElementById('tablaMarcas').onclick = (e) => {

//     // variable locales
//     // guardo en una variable la tabla que se desea modificar
//     const tabla = document.getElementById('tablaMarcas');
//     // guardo en una variable los encabezados <th></th> que son las claves de los objetos
//     const th = tabla.querySelectorAll('th');
//     // guardo en un array las claves
//     const key = Array.from(th).map(key => key.textContent.toLocaleLowerCase());

//     // guardo en una variable en donde hice click
//     const btnClick = e.target;

//     // verifico si hice click en un boton
//     if (btnClick.tagName == 'BUTTON') {

//         //* modificacion de marcas
//         // verifico si el boton presionado es modificar
//         if (btnClick.getAttribute('data-id') == 'modificar') {

//             // muestro y oculto los botones para el caso modificar
//             document.getElementById('marcasRegistar').classList.add('oculto');
//             document.getElementById('btnMarcasCambiosAceptar').classList.remove('oculto');
//             document.getElementById('btnMarcasDescartar').classList.remove('oculto');
//             // ocultarBtnModificar();
//             btnClick.classList.add('oculto');

//             // elimiino los botones eliminar si presione modificar
//             if (!eliminarBtn) {
//                 eliminarColumna('tablaMarcas', encontrarCelda('tablaMarcas', 'eliminar'));
//                 eliminarBtn = true;
//             }

//             // guardo en una variable la fila correspondiente al boton presionado
//             const tr = btnClick.closest('tr');
//             trModificado.push(tr);

//             // agrego la clase modificado a la fila correspondiente al boton seleccionado
//             tr.classList.add('modificando');
//             // guardo los td correspondiente a la fila
//             const tdNodeList = tr.querySelectorAll('td');
//             // por cada celda agrego un input segun el tipo de dato
//             tdNodeList.forEach((td, index) => {
//                 const value = td.textContent;
//                 switch (key[index]) {
//                     case 'id':
//                     case undefined:
//                         break;
//                     case 'password':
//                         td.textContent = '';
//                         const inputPass = creacionInput(key[index]);
//                         td.appendChild(inputPass);
//                         inputPass.value = value;
//                         break;
//                     case 'fechanacimiento':
//                         td.textContent = '';
//                         const inputDate = creacionInput(key[index]);
//                         td.appendChild(inputDate);
//                         inputDate.value = value;
//                         break;
//                     case 'email':
//                         td.textContent = '';
//                         const inputEmail = creacionInput(key[index]);
//                         td.appendChild(inputEmail);
//                         inputEmail.value = value;
//                         break;
//                     case 'admin':
//                         td.textContent = '';
//                         const selectAdmin = crearSelect(['true', 'false'])
//                         td.appendChild(selectAdmin);
//                         selectAdmin.value = value;
//                         break;
//                     default:
//                         td.textContent = '';
//                         const inputText = creacionInput(key[index]);
//                         td.appendChild(inputText);
//                         inputText.value = value;
//                         break;
//                 }
//             })

//             //* aceptar cambios realizados
//             document.getElementById('btnMarcasCambiosAceptar').onclick = () => {

//                 // array con los nuevos datos de los usuarios que fueron modificados
//                 const arrayNuevosDatos = [];

//                 // itero sobre cada fila del NodeList de filas
//                 trModificado.forEach(tr => {
//                     // por cada fila obtengo el NodeList de las celdas
//                     const tdNodeList = tr.querySelectorAll('td')
//                     // objeto para guardar los datos del usuario modificado
//                     const elementoModificado = {};
//                     // por cada celda obtengo el valor
//                     tdNodeList.forEach((td, index) => {
//                         switch (key[index]) {
//                             case undefined:
//                                 break;
//                             case 'id':
//                                 elementoModificado[key[index]] = td.textContent;
//                                 break;
//                             default:
//                                 elementoModificado[key[index]] = td.firstChild.value;
//                                 break;
//                         }
//                     })
//                     arrayNuevosDatos.push(elementoModificado)
//                 })

//                 // verifico que todos los datos esten completos
//                 const datoVacio = arrayNuevosDatos.some(objeto => {
//                     return Object.values(objeto).some(value => value == '')
//                 })

//                 if (datoVacio) {
//                     crearAlerta('Todos los datos son OBLIGATORIOS', 'msjAlertaMarca')
//                 } else {
//                     // verifico que los datos nuevos ingresados no esten repetidos con otros usuarios
//                     const marcaRepetida = arrayNuevosDatos.filter(objecto => {
//                         const index = valoresRepetidos(marcas, objecto, clavesNoRepetir)
//                         return index != -1 && objecto;
//                     })
//                     if (marcaRepetida.length != 0) {
//                         crearAlerta(`La Marca: ${marcaRepetida[0].marca} ya se encuentra registrado`, 'msjAlertaMarca');
//                     } else {
//                         // verifico los datos modificado no esten repetidos entre ellos.
//                         const datoIngreasoRepetido = arrayNuevosDatos.filter(objeto => {
//                             const index = valoresRepetidos(arrayNuevosDatos, objeto, clavesNoRepetir)
//                             return index != -1 && objeto;
//                         })
//                         if (datoIngreasoRepetido.length != 0) {
//                             crearAlerta(`La Marca: ${datoIngreasoRepetido[0].marca} fue utilizado en varias modificaciones`, 'msjAlertaMarca');
//                         } else {
//                             marcas = buscarYReemplazarID(marcas, arrayNuevosDatos)
//                             ordenarArray(marcas, ordenarMarca);
//                             localStorage.setItem('marcas', JSON.stringify(marcas))
//                             // oculto los botones luego de la modificacion de datos
//                             document.getElementById('marcasRegistar').classList.remove('oculto');
//                             document.getElementById('btnMarcasCambiosAceptar').classList.add('oculto');
//                             document.getElementById('btnMarcasDescartar').classList.add('oculto');
//                             tablaHorizontal(marcas, 'tablaMarcas');
//                             trModificado = [];
//                             eliminarBtn = false;
//                         }
//                     }
//                 }
//             }

//         }

//         // si presiono eliminar
//         if (btnClick.getAttribute('data-id') == 'eliminar') {

//             // muestro los botones correspondientes a eliminar
//             document.getElementById('marcasRegistar').classList.add('oculto');
//             document.getElementById('btnMarcasEliminarAceptar').classList.remove('oculto');
//             document.getElementById('btnMarcasDescartar').classList.remove('oculto');

//             btnClick.classList.add('oculto');

//             // si presione eliminar, borro todos los botones de mnodificar de la tabla
//             if (!eliminarBtn) {
//                 eliminarColumna('tablaMarcas', encontrarCelda('tablaMarcas', 'modificar'));
//                 eliminarBtn = true;
//             }

//             // guardo en una variable la fila correspondiente al boton presionado
//             const tr = btnClick.closest('tr');

//             // agrego la clase modificado a la fila correspondiente al boton seleccionado
//             tr.classList.add('eliminando');

//             // itero sobre el NodeList para obtener los ids de los usuarios que deseo elimninar
//             const tdNodeListEliminar = tr.querySelectorAll('td')
//             tdNodeListEliminar.forEach((td, index) => {
//                 key[index] == 'id' && auxKeyEliminar.push(td.textContent);
//             })

//             // confirmacion que se desea eliminar el usuario y creacion de modal
//             document.getElementById('btnMarcasEliminarAceptar').onclick = () => {
//                 // creo un modal para la confirmacion
//                 crearModalConfirmacion('¿Esta seguro que desea ELIMINAR las Marcas seleccionados? SITUACION IRREVERSIBLE', 'modalMarcas')
//                 // confirmacion en modal de aceptar borrar usuarios
//                 document.getElementById('modalMarcasConfirmar').onclick = () => {
//                     marcas = eliminarElementoArray(marcas, auxKeyEliminar);
//                     ordenarArray(marcas, ordenarMarca);
//                     localStorage.setItem('marcas', JSON.stringify(marcas));
//                     document.getElementById('modalMarcas').textContent = '';
//                     tablaHorizontal(marcas, 'tablaMarcas');
//                     // oculto los botones una vez terminada la operacion
//                     document.getElementById('marcasRegistar').classList.remove('oculto');
//                     document.getElementById('btnMarcasEliminarAceptar').classList.add('oculto');
//                     document.getElementById('btnMarcasDescartar').classList.add('oculto');

//                     eliminarBtn = false;
//                     auxKeyEliminar = [];
//                 }
//                 // cancelo la baja en modal
//                 document.getElementById('modalMarcasCancelar').onclick = () => {
//                     document.getElementById('modalMarcas').textContent = '';
//                 }
//             }
//         }

//         // decarto cualquier cambio realizado (modificacion o eliminar)
//         document.getElementById('btnMarcasDescartar').onclick = () => {
//             document.getElementById('marcasRegistar').classList.remove('oculto')
//             document.getElementById('btnMarcasCambiosAceptar').classList.add('oculto')
//             document.getElementById('btnMarcasEliminarAceptar').classList.add('oculto')
//             document.getElementById('btnMarcasDescartar').classList.add('oculto')
//             tablaHorizontal(marcas, 'tablaMarcas');
//             eliminarBtn = false;
//             auxKeyEliminar = [];
//             trModificado = [];
//         }
//     }
// }