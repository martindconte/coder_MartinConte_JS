import { modificarDatosTablas } from "./fnEventos.js";
import {
    buscarKeyValue,
    campoVacio,
    crearAlerta,
    crearSelect,
    crearSelectAnidado,
    generarCodigoUnico,
    ordenarArray,
    tablaHorizontal
} from "./funciones.js";

//! ********** codigo de la pagina ***********

class Producto {
    constructor(objeto) {
        !objeto.id ? (this.id = generarCodigoUnico()) : (this.id = objeto.id);
        this.marca = objeto.marca;
        this.modelo = objeto.modelo;
        this.tipo = objeto.tipo;
        this.origen = objeto.origen;
        this.descripcion = objeto.descripcion;
        this.imagen = objeto.imagen;
        this.precio = Number(objeto.precio);
        this.stock = Number(objeto.stock);
    }
}

//! variable globales
// array para ordenar al array productos
const ordenarProductos = ['marca', 'modelos', 'tipo', 'origen'];
/* array con las claves que no se pueden repetir en simultaneo
(no puede existir un producto que tenga los mismos valores para esas claves) */
const noRepetirProducto = ['marca', 'modelo', 'tipo', 'origen'];

//! datos en local storage

// carga de modelos guardados en local storage
const modelosLS = JSON.parse(localStorage.getItem('modelos'));
let productosLS = JSON.parse(localStorage.getItem('productos'));
productosLS && ordenarArray(productosLS, ordenarProductos)
let productos = productosLS ? productosLS.map(producto => new Producto(producto)) : [];

// array con los modelos cargados
const modelosCargados = modelosLS ? modelosLS.map(objeto => objeto.modelo) : [];
// variable auxiliar para obtener las marcas que poseen modelos cargados
const auxMarca = modelosLS ? modelosLS.map(objeto => objeto.marca) : [];
// array con las marcas que tienen modelos registrados sin repetir
const marcasRegistradas = [...new Set(auxMarca)]
tablaHorizontal(productos, 'tablaProductos');

//! elementos del DOM
// creacion de selects para seleccionar marcas y modelos
const formProducto = document.getElementById('formProducto');
// creacion de select primario (marcas)
const selectMarcas = crearSelect(marcasRegistradas, 'selectMarcas', 'marca');
// coloco el select marcas como primer hijo del formulario
formProducto.insertBefore(selectMarcas, formProducto.firstChild)
// creacion de select secundario. Mostrara como opciones los modelos para las marcas cargadas
const selectModelos = crearSelectAnidado('selectMarcas', modelosLS, ['marca', 'modelo'], 'selectModelo', 'modelo')
// formProducto.appendChild(selectModelos)
// coloco el select modelos como segundo elemento del formulario (a continuacion del select marcas)
formProducto.insertBefore(selectModelos, formProducto.firstChild.nextSibling)

// evento change para actualizar el select secundario cuando haya un cambio en la opcion del select primario (marcas)
document.getElementById("selectMarcas").onchange = () => {
    crearSelectAnidado('selectMarcas', modelosLS, ['marca', 'modelo'], 'selectModelo', 'modelo')
};

// cargar un nuevo producto y guardarlo en local storage
formProducto.onsubmit = (e) => {
    e.preventDefault();

    // variables locales
    const nuevoProducto = {};

    const formDataProducto = new FormData(formProducto);
    formDataProducto.forEach((value, key) => {
        if (value instanceof File) {
            if (value.name != "") {
                nuevoProducto[key] = value.name;
            } else {
                nuevoProducto[key] = "default.jpeg";
            }
        } else {
            nuevoProducto[key] = value.trim();
        }
    });

    const datoVacio = campoVacio(nuevoProducto);

    if (datoVacio) {
        crearAlerta('TODOS los campos son obligatorios', 'alertaProducto');
    } else {
        const productoRepetido = buscarKeyValue(productos, nuevoProducto, noRepetirProducto);
        if (productoRepetido != -1) {
            crearAlerta(
                `Marca: ${productos[productoRepetido].marca}
                Modelo: ${productos[productoRepetido].marca}
                ${productos[productoRepetido].tipo}
                ${productos[productoRepetido].origen} ya se encuentra cargado`,
                'alertaProducto'
            );
        } else {
            productos.push(new Producto(nuevoProducto));
            ordenarArray(productos, ordenarProductos);
            localStorage.setItem('productos', JSON.stringify(productos));
            tablaHorizontal(productos, 'tablaProductos');
            formProducto.reset()
        }
    }
}

// modificacion o eliminacion de marcas. guardado en local storage
document.getElementById('tablaProductos').onclick = (e) => {

    modificarDatosTablas(e, 'tablaProductos', productos, 'productos', noRepetirProducto, ordenarProductos);

}

// manejo de eventos para los selects que estan en las tabla de productos registrados
const tablaProductos = document.getElementById('tablaProductos')
tablaProductos.onchange = (e) => {

    // guardo en una variable el elemento que tuvo un cambio
    const objChange = e.target;
    // guardo en una variable la fila a la que pertenece el elemento que cambio
    const tr = objChange.closest('tr');
    // guardo en una varible el NodeList correspondiente td
    const tdNodeList = tr.querySelectorAll("td");
    // guardo en una variable el id correspondiente al prodcuto en la cual hubo un cambio en la celda
    const id = tdNodeList[0].textContent;

    // Verifico si el evento se originó en un elemento <select> y que sea el <select> de marcas
    if (objChange.tagName === "SELECT" &&
        objChange.id == `${id}Primario`) {

        crearSelectAnidado(
            `${id}Primario`,
            modelosLS,
            ['marca','modelo'],
            `${id}Secundario`
        );

    }
}
