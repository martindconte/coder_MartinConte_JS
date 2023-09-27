import { buscarKeyValue, crearAlerta } from "./funciones.js";

//! constructores

class Usuario {
    constructor(objeto) {
        this.id = objeto.id;
        this.apellido = objeto.apellido;
        this.nombre = objeto.nombre;
        this.usuario = objeto.usuario;
        this.password = objeto.password;
        this.fechanacimiento = objeto.fechanacimiento;
        this.telefono = objeto.telefono;
        this.email = objeto.email;
        this.admin = objeto.admin === "true";
    }
}

//! variables globales

// variable con los administradores del sistema
const userAdmin = [
    {
        id: 0,
        usuario: 'admin',
        password: 'admin',
        email: 'admin@gcfmusic.com',
        admin: true,
    },
    {
        id: 1,
        usuario: 'CONTEM',
        password: '123456',
        email: 'contem@gcfmusic.com',
        admin: true,
    }
]

//! funciones de la pagina

const contenidoIndex = () => {
    document.getElementById('headerLoguin').remove();
    // document.getElementById('headerNavBar').classList.remove('oculto');
    const main = document.querySelector('main');
    const pIntro = document.createElement('p');
    pIntro.innerText = 'Bienvenido a GFCMusic - Administrador de Instrumentos Musicales';
    pIntro.classList.add('bienvenida');
    main.appendChild(pIntro)
}

//! codigo de la pagina

//? Variables guardadas en local storage

const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'))
console.log(usuarioLogueado);

const usuariosLS = JSON.parse(localStorage.getItem('usuarios'))
const usuarios = usuariosLS ? usuariosLS.map(usuario => new Usuario(usuario)) : [];

// verifico si hay un usuario logeado (almacenado en local storage)
if (usuarioLogueado) {
    // si hay un usuario logueado borro el formulario de loguin
    contenidoIndex()
    // if (usuarioLogueado.admin) {
    //     document.getElementById('headerUsuarioAdmin').classList.remove('oculto')
    // }
} else {

    //? Logueo de un usuario
    document.getElementById('formLogUser').onsubmit = (e) => {
        e.preventDefault();

        // variables locales
        // variable para guardar los datos ingresados para loguearse
        const usuarioIngresado = {};

        // obtengo los datos del formulario de logueo
        const formLog = document.getElementById('formLogUser');
        const formDataLog = new FormData(formLog);
        formDataLog.forEach((value, key) => {
            usuarioIngresado[key] = value;
        });

        // verifico que se hayan ingresado todos los datos
        const datoVacio = Object.values(usuarioIngresado).some(value => value == '');

        if (datoVacio) {
            // si falta algun dato se muestra mensaje de alerta
            crearAlerta('Datos INCORRECTOS', 'msjAlertaLogeoUsuario');
        } else {
            // creo un array con las claves-valor del usuario que se ingreso
            const arrayObjetoUsuario = Object.entries(usuarioIngresado);
            // verifico si el usuario ingresado corresponde a un usuario administrador del sistema
            const isAdmin = userAdmin.findIndex(userAdmin => {
                return arrayObjetoUsuario.every(([key, value]) => {
                    return (userAdmin[key] == value);
                })
            })
            if (isAdmin != -1) {
                localStorage.setItem('usuarioLogueado', JSON.stringify(userAdmin[isAdmin]));
                contenidoIndex();
                location.href = location.href;
            } else {
                // si el usuario no es administrador del sistema busco entre los usuarios registrados
                const usuarioExistente = buscarKeyValue(usuarios, usuarioIngresado, ['usuario', 'password']);
                // si se encuentra un usuario registrado se guarda en local storage
                if (usuarioExistente != -1) {
                    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarios[usuarioExistente]));
                    contenidoIndex();
                    location.href = location.href;
                    // se verifica el perfil del usuaerio (permiso de administrador)
                    if (usuarios[usuarioExistente].admin) {
                        document.getElementById('headerUsuarioAdmin').classList.remove('oculto');
                    }
                } else {
                    crearAlerta('USUARIO / CONTRASEÑA INCORRECTA', 'msjAlertaLogeoUsuario');
                }
            }
        }
    }
}

