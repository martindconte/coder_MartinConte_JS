import { modificarDatosTablas } from "./fnEventos.js";
import {
    crearAlerta,
    generarCodigoUnico,
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

//! variables globales
// array con las claves que no pueden tener el mismo valor. Por ejemplo dos usuarios con el mismo telefono
const arrayNuevoUsuarioNoRepetir = ['usuario', 'telefono', 'email']
// array con el orden de como se ordena el array usuarios
const ordenarUsuarios = ['apellido', 'nombre', 'usuario']

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
    formDataNuevoUsuario.forEach((value, key) => nuevoUsuario[key] = value);

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

// eventos realizados sobre la tabla. Se guardan los cambios realizado en local storage.
document.getElementById('tablaUsuarios').onclick = (e) => {

    modificarDatosTablas(e, 'tablaUsuarios', usuarios, 'usuarios', arrayNuevoUsuarioNoRepetir, ordenarUsuarios)
}
