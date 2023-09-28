import {
    buscarYReemplazarID,
    creacionInput,
    crearAlerta,
    crearModalConfirmacion,
    crearSelect,
    eliminarColumna,
    eliminarElementoArray,
    encontrarCelda,
    generarCodigoUnico,
    modificarDatosTablas,
    ordenarArray,
    tablaHorizontal,
    valoresRepetidos
} from "./funciones.js";

//! constructores
class Usuario {
    constructor(objeto) {
        !objeto.id ? this.id = generarCodigoUnico() : this.id = objeto.id
        this.usuario = objeto.usuario;
        this.password = objeto.password;
        this.nombre = objeto.nombre;
        this.apellido = objeto.apellido;
        this.fechanacimiento = objeto.fechanacimiento;
        this.telefono = objeto.telefono;
        this.email = objeto.email;
        this.admin = objeto.admin;
    }
}

//! funciones locales

const ocultarBtnModificar = () => {
    document.getElementById('btnFormRegistrar').classList.add('oculto')
    document.getElementById('btnUsuarioCambiosAceptar').classList.remove('oculto')
    document.getElementById('btnUsuarioDescartar').classList.remove('oculto')
}

const mostrarBtnModificar = () => {
    document.getElementById('btnFormRegistrar').classList.remove('oculto')
    document.getElementById('btnUsuarioCambiosAceptar').classList.add('oculto')
    document.getElementById('btnUsuarioDescartar').classList.add('oculto')
}

const mostrarBtnEliminar = () => {
    document.getElementById('btnFormRegistrar').classList.add('oculto')
    document.getElementById('btnUsuarioEliminarAceptar').classList.remove('oculto')
    document.getElementById('btnUsuarioDescartar').classList.remove('oculto')
}

const ocultarBtnEliminar = () => {
    document.getElementById('btnFormRegistrar').classList.remove('oculto')
    document.getElementById('btnUsuarioEliminarAceptar').classList.add('oculto')
    document.getElementById('btnUsuarioDescartar').classList.add('oculto')
}

//! variables globales
// array con las claves que no pueden tener el mismo valor. Por ejemplo dos usuarios con el mismo telefono
const arrayNuevoUsuarioNoRepetir = ['usuario', 'telefono', 'email']
// aux para saber si el boton fue presionado
let eliminarBtn = false;
// array con el orden de como se ordena el array usuarios
const ordenarUsuarios = ['apellido', 'nombre', 'usuario']
// guardo todas las filas a las que corresponde el boton presionado
let trModificado = [];
// guardo en un array los id de los usuarios a eliminar
let auxKeyEliminar = [];

//! variables guardadas en local storage

const usuariosLS = JSON.parse(localStorage.getItem('usuarios'))
usuariosLS && ordenarArray(usuariosLS, ordenarUsuarios)
let usuarios = usuariosLS ? usuariosLS.map(usuario => new Usuario(usuario)) : [];

//! codigo de la pagina

// creo una tabla con la informacion de usuarios 
tablaHorizontal(usuarios, 'tablaUsuarios');

//? creacion de nuevo usuario

document.getElementById('formNuevoUsuario').onsubmit = (e) => {
    e.preventDefault();

    // variables locales 
    const nuevoUsuario = {}

    const formNuevoUsuario = document.getElementById('formNuevoUsuario');
    const formDataNuevoUsuario = new FormData(formNuevoUsuario);
    formDataNuevoUsuario.forEach((value, key) => {
        nuevoUsuario[key] = value;
    })

    // verifico que todos los datos hayan sido cargados
    const datoVacio = Object.values(nuevoUsuario).some(value => value == '');
    // verifico que los valores para usuario, telefono y email (arrayNuevoUsuarioNoRepetir) no se encuentra ya cargados
    const repetido = valoresRepetidos(usuarios, nuevoUsuario, arrayNuevoUsuarioNoRepetir);

    // si todo se cumple guardo el usuario
    if (datoVacio) {
        crearAlerta('TODOS los campos son Obligatorios', 'msjAlertaUsuario');
    } else if (repetido != -1) {
        crearAlerta(`Usuario / Telefono / e-mail ya se encuentra registrado para el usuario ${usuarios[repetido].usuario}`, 'msjAlertaUsuario');
    } else if (nuevoUsuario.usuario == 'CONTEM' || nuevoUsuario.usuario == 'admin') {
        crearAlerta('Valores de USUARIOS reservados. Por favor elija otro ', 'msjAlertaUsuario');
    } else {
        usuarios.push(new Usuario(nuevoUsuario));
        ordenarArray(usuarios, ordenarUsuarios)
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        tablaHorizontal(usuarios, 'tablaUsuarios');
        formNuevoUsuario.reset()
    }
}


document.getElementById('tablaUsuarios').onclick = (e) => {
    
        modificarDatosTablas (e, 'tablaUsuarios', usuarios, 'usuarios', arrayNuevoUsuarioNoRepetir, ordenarUsuarios)
}






// ? modificacion de usuarios registrados (modificar o eliminar)

// document.getElementById('tablaUsuarios').onclick = (e) => {

//     // variable locales
//     // guardo en una variable la tabla sobre la que hare modificaciones
//     const tablaUsuarios = document.getElementById('tablaUsuarios');
//     // guardo en una variable los encabezados <th></th> que son las claves de los objetos
//     const th = tablaUsuarios.querySelectorAll('th');
//     // guardo en un array las claves
//     const key = Array.from(th).map(key => key.textContent.toLocaleLowerCase());

//     // guardo en una variable en donde hice click
//     const btnClick = e.target;

//     // verifico si hice click en un boton
//     if (btnClick.tagName == 'BUTTON') {

//         //* modificacion de usuarios
//         // verifico si el boton presionado es modificar
//         if (btnClick.getAttribute('data-id') == 'modificar') {

//             // muestro y oculto los botones para el caso modificar
//             ocultarBtnModificar();
//             btnClick.classList.add('oculto');

//             if (!eliminarBtn) {
//                 eliminarColumna('tablaUsuarios', encontrarCelda('tablaUsuarios', 'eliminar'));
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
//             document.getElementById('btnUsuarioCambiosAceptar').onclick = () => {

//                 // array con los nuevos datos de los usuarios que fueron modificados
//                 const arrayNuevosDatos = [];

//                 // itero sobre cada fila del NodeList de filas
//                 trModificado.forEach(tr => {
//                     // por cada fila obtengo el NodeList de las celdas
//                     const tdNodeList = tr.querySelectorAll('td')
//                     // objeto para guardar los datos del usuario modificado
//                     const usuarioModificado = {};
//                     // por cada celda obtengo el valor
//                     tdNodeList.forEach((td, index) => {
//                         switch (key[index]) {
//                             case undefined:
//                                 break;
//                             case 'id':
//                                 usuarioModificado[key[index]] = td.textContent;
//                                 break;
//                             default:
//                                 usuarioModificado[key[index]] = td.firstChild.value;
//                                 break;
//                         }
//                     })
//                     arrayNuevosDatos.push(usuarioModificado)
//                 })

//                 // verifico que todos los datos esten completos
//                 const datoVacio = arrayNuevosDatos.some(objeto => {
//                     return Object.values(objeto).some(value => value == '')
//                 })

//                 if (datoVacio) {
//                     crearAlerta('Todos los datos son OBLIGATORIOS', 'msjAlertaUsuario')
//                 } else {
//                     // verifico que los datos nuevos ingresados no esten repetidos con otros usuarios
//                     const usuarioRepetido = arrayNuevosDatos.filter(objUsuario => {
//                         const index = valoresRepetidos(usuarios, objUsuario, arrayNuevoUsuarioNoRepetir)
//                         return index != -1 && objUsuario;
//                     })

//                     if (usuarioRepetido.length != 0) {
//                         crearAlerta(`El USUARIO: ${usuarioRepetido[0].usuario} o el EMAIL: ${usuarioRepetido[0].email} o el TELEFONO: ${usuarioRepetido[0].telefono} ya se encuentra registrado`, 'msjAlertaUsuario');
//                     } else {
//                         // verifico los datos modificado no esten repetidos entre ellos.
//                         const datoIngreasoRepetido = arrayNuevosDatos.filter(objUsuario => {
//                             const index = valoresRepetidos(arrayNuevosDatos, objUsuario, arrayNuevoUsuarioNoRepetir)
//                             return index != -1 && objUsuario;
//                         })
//                         if (datoIngreasoRepetido.length != 0) {
//                             crearAlerta(`El USUARIO: ${datoIngreasoRepetido[0].usuario} o el EMAIL: ${datoIngreasoRepetido[0].email} o el TELEFONO: ${datoIngreasoRepetido[0].telefono} fue utilizado en varias modificaciones`, 'msjAlertaUsuario');
//                         } else {
//                             usuarios = buscarYReemplazarID(usuarios, arrayNuevosDatos)
//                             ordenarArray(usuarios, ordenarUsuarios);
//                             localStorage.setItem('usuarios', JSON.stringify(usuarios))
//                             mostrarBtnModificar();
//                             tablaHorizontal(usuarios, 'tablaUsuarios');
//                             trModificado = [];
//                             eliminarBtn = false;
//                         }
//                     }
//                 }
//             }
//         }

//         if (btnClick.getAttribute('data-id') == 'eliminar') {

//             // muestro los botones correspondientes a eliminar
//             mostrarBtnEliminar();
//             btnClick.classList.add('oculto');

//             // si presione eliminar, borro todos los botones de mnodificar de la tabla
//             if (!eliminarBtn) {
//                 eliminarColumna('tablaUsuarios', encontrarCelda('tablaUsuarios', 'modificar'));
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
//             document.getElementById('btnUsuarioEliminarAceptar').onclick = () => {
//                 // creo un modal para la confirmacion
//                 crearModalConfirmacion('¿Esta seguro que desea ELIMINAR los USUARIOS seleccionados? SITUACION IRREVERSIBLE', 'modalUsuarios')
//                 // confirmacion en modal de aceptar borrar usuarios
//                 document.getElementById('modalUsuariosConfirmar').onclick = () => {
//                     usuarios = eliminarElementoArray(usuarios, auxKeyEliminar);
//                     ordenarArray(usuarios, ordenarUsuarios);
//                     localStorage.setItem('usuarios', JSON.stringify(usuarios));
//                     document.getElementById('modalUsuarios').textContent = '';
//                     tablaHorizontal(usuarios, 'tablaUsuarios');
//                     ocultarBtnEliminar();
//                     eliminarBtn = false;
//                     auxKeyEliminar = [];
//                 }
//                 // cancelo la baja en modal
//                 document.getElementById('modalUsuariosCancelar').onclick = () => {
//                     document.getElementById('modalUsuarios').textContent = '';
//                 }
//             }
//         }

//         // decarto cualquier cambio realizado (modificacion o eliminar)
//         document.getElementById('btnUsuarioDescartar').onclick = () => {
//             document.getElementById('btnFormRegistrar').classList.remove('oculto')
//             document.getElementById('btnUsuarioEliminarAceptar').classList.add('oculto')
//             document.getElementById('btnUsuarioCambiosAceptar').classList.add('oculto')
//             document.getElementById('btnUsuarioDescartar').classList.add('oculto')
//             tablaHorizontal(usuarios, 'tablaUsuarios');
//             eliminarBtn = false;
//             auxKeyEliminar = [];
//             trModificado = [];
//         }
//     }
// }
