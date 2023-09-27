//! FUNCIONES

const generarCodigoUnico = () => {
    let codigo = "";
    for (let i = 0; i < 5; i++) {
        const randomNum = Math.floor(Math.random() * 10);
        const randomChar = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
        const randomChoice = Math.random() < 0.5 ? randomNum : randomChar;
        codigo += randomChoice;
    }
    return codigo;
}

/**
* ORDENO UN ARRAY SEGUN EL ORDEN QUE SE DETALLA EN EÑ ARRAY KEYs
* @param {Array} array array que deseo ordenar 
* @param {Array} propiedades array con el orden de las claves por las que deseo ordenar al array 
* @returns {Array} deveuelve el array ordenado
*/

const ordenarArray = (array, key) => {
    return array.sort((a, b) => {
        for (let propiedad of key) {
            if (a[propiedad] !== b[propiedad]) {
                return a[propiedad].localeCompare(b[propiedad]);
            }
        }
        return 0;
    });
}

/**
* 
* @param {object} objeto Objeto que deseo buscar en array 
* @param {array} array Array en donde es buscado objeto
* @param {array} arraySinCoincidencias Array con las claves que no deseo comprar
* @returns {number} numero de indice que de donde se encontro la coincidencia en array (-1 si no se encontro) 
*/
const objetoRepetido = (array, objeto, arraySinCoincidencias) => {
    /**
     * creo aux con los datos de objeto menos las claves que no deseo comparar
     * por ejemplo si tengo un objeto con las claves nombre paellido y edad y
     * elimino a edad, se buscara en array que no haya objetos con el mismo 
     * nombre y apellido que se encuentra en objeto 
     */
    const aux = {...objeto}
    arraySinCoincidencias.forEach(value => {
        delete aux[value]
    })
    /**
     * Object.entries me crea un array que adentro tiene arrays con los datos [clave, valor]
     * luego con every cada clave - valor lo verifico si ya esta cargado
     */
    const index = array.findIndex((objetoProducto, index) => {
        return Object.entries(aux).every(([key, value]) => {
            if (array[index].id != objeto.id) {
                return objetoProducto[key].toLowerCase() == value.toLowerCase()
            }
        })
    })
    return index;
}

const datoVacio = (objeto, claves) => {
    const vacio = Object.entries(objeto).some(([keyObj, valueObj]) => {
        return claves.includes(keyObj) && valueObj == ''
    })
    return vacio
}


//! CODIGO DE LA PAGINA

//? clases
class Marca {
    constructor(objeto) {
        // se asume una probabilidad casi de nula de que se repita el ID dado que combina numeros y letras
        this.id = generarCodigoUnico();
        this.marca = objeto.marca;
    }
}

class Modelo {
    constructor(objeto) {
        this.id = generarCodigoUnico();
        this.marca = objeto.marca;
        this.modelo = objeto.modelo;

    }
}

class Producto {
    constructor(objeto) {
        if (objeto.id == undefined) {
            this.id = generarCodigoUnico();
        } else {
            this.id = objeto.id;
        }
        this.marca = objeto.marca;
        this.modelo = objeto.modelo;
        this.producto = objeto.producto;
        this.origen = objeto.origen;
        this.precio = objeto.precio;
        this.stock = objeto.stock;
    }

    // Método para verificar si hay stock disponible y actualizar el precio con IVA para esos productos
    stockDisponible() {
        if (this.stock > 0) {
            // Crear una copia del objeto actual antes de modificarlo (proble con assign y se modifica el original)
            const copiaProducto = { ...this };
            copiaProducto.precio *= 1.21; // Aumentar el precio en un 21% (IVA)
            return copiaProducto; // Devolver la copia con el precio actualizado
        } else {
            return this; // Si no hay stock disponible, devolver el objeto original sin cambios
        }
    }
}

//? variables globales

// array con las claves con el cual se va a ordenar el array productos
const arrayOrdenProducto = ['marca', 'modelo', 'producto', 'stock']

// array con las marcas que se han registrado
const marcas = [
    {
        id: '10',
        marca: 'Tama'
    },
    {
        id: '11',
        marca: 'Sonor'
    },
    {
        id: '12',
        marca: 'Dean'
    }

];
// array con los modelos que se han registrado
const modelos = [
    {
        id: '20',
        marca: 'Dean',
        modelo: 'Flyv Kingdom'
    },
    {
        id: '21',
        marca: 'Fender',
        modelo: 'Jazz Bass'
    },
    {
        id: '22',
        marca: 'Sonor',
        modelo: 'Aq2 Safari 4'
    },
    {
        id: '23',
        marca: 'Tama',
        modelo: 'Superstar'
    },
];
// array con los productos registrados para comprar
let productos = [
    {
        id: '0',
        marca: 'Fender',
        modelo: 'Jazz Bass',
        producto: 'Bajo',
        origen: 'USA',
        precio: 1_200,
        stock: 10
    },
    {
        id: '1',
        marca: 'Gibson',
        modelo: 'SG',
        producto: 'Guitarra',
        origen: 'USA',
        precio: 3_200,
        stock: 5
    },
    {
        id: '2',
        marca: 'Spector',
        modelo: 'Legend',
        producto: 'Bajo',
        origen: 'Korea',
        precio: 1_000,
        stock: 5
    },
    {
        id: '3',
        marca: 'Spector',
        modelo: 'NS2',
        producto: 'Bajo',
        origen: 'USA',
        precio: 1_000,
        stock: 0
    },
];

productos = productos.map(producto => new Producto(producto))
console.log(productos);

// confirmo que deseo catalogar una Marca
if (window.confirm("¿Desea Catalogar una Marca?")) {
    // bucle de registro de marca. Se interrumpe cuando el usuario cancela la carga
    do {
        // se guarda en una variable la marca ingresada
        const marcaIngresada = prompt("Ingrese el nombre de la Marca").trim();
        // se verifica que la marca ingresada no se encuentre ya registrada
        const index = marcas.findIndex(objMarca => marcaIngresada.toLocaleLowerCase() == objMarca.marca.toLocaleLowerCase());
        if (marcaIngresada == '') {
            // se muestra el alerta de no ingresar un valor para la marca
            alert('Se debe ingresar una marca valida');
        } else if (index != -1) {
            // se muestra el alert si la marca ingresada ya se encuentra registrada
            alert('La marca ' + marcaIngresada + ' ya se encuentra cargada');
        } else {
            // si se ingreso una marca valida (no vacia y no repetida) se guarda el valor
            marcas.push(new Marca({ marca: marcaIngresada }));
            ordenarArray(marcas, ['marca'])
            console.log('La marca ' + marcaIngresada + ' se ha registrado correctamente')
        }
    } while (window.confirm("Desea Registar otra marca?"))
    // se ofrece mostrar en tabla las marcas ingresadas
    if (window.confirm('Desea visualizar las marcas registradas?')) {
        console.clear();
        console.table(marcas)
    }
}

// confirmo que se desea realizar la carga de un Modelo para una Marca registrada
if (window.confirm("¿Desea Catalogar un Modelo a las Marcas registradas?")) {
    
    // variable local para guardar las marcas registradas
    const arrayMarcas = marcas.map(objMarca => objMarca.marca);
    const auxModeloIngresado = {};

    // se verifica que el array de marcas tenga al menos una marca registrada
    if (arrayMarcas.length) {
        // se muestra en un alert las marcas registradas al momento
        alert('Las Marcas registradas al momento son:\n- ' + arrayMarcas.join('\n- ') + '\ntambien se pueden observar por consola');
        do {
            // se solicita el nombre de la Marca a la cual se desea asociar un modelo
            auxModeloIngresado.marca = prompt('Elija la marca a la que desea registrar un Modelos. Las registradas son ' + arrayMarcas.join(' - ')).trim();
            // verifico que no se haya ingresado un valor vacio
            if (auxModeloIngresado.marca == '') {
                alert('Debe ingresar una Marca valida. Las registradas son:\n-' + arrayMarcas.join('\n- '))
            } else {
                // se busca la marca ingresada en el array de marcas
                const indexMarca = arrayMarcas.findIndex(marca => marca.toLocaleLowerCase() == auxModeloIngresado.marca.toLocaleLowerCase());
                // se verifica que la marca este registrada
                if (indexMarca != -1) {
                    auxModeloIngresado.modelo = prompt('Ingrese el nombre del Modelo para la Marca ' + arrayMarcas[indexMarca]);
                    if (auxModeloIngresado.modelo != '') {
                        // verifico si el modelo ingresado para la marca seleccionada no se encuentra cargado
                        const indexModelo = objetoRepetido(modelos, auxModeloIngresado,['id'])
                        // const indexModelo = modelos.findIndex(objModelo => objModelo.modelo.toLocaleLowerCase() == modeloIngresado.toLocaleLowerCase());
                        if (indexModelo != -1) {
                            alert(`Para la Marca ${auxModeloIngresado.marca} el Modelo ${auxModeloIngresado.modelo} ya se encuentra registrado.`);
                            // si los datos estan correctos se carga el MODELO
                        } else {
                            modelos.push(new Modelo(auxModeloIngresado));
                            // modelos.push(new Modelo({
                            //     marca: marcaSeleccionada,
                            //     modelo: modeloIngresado
                            // }))
                            ordenarArray(modelos, ['marca', 'modelo'])
                            console.log(`Se ha registrado para la Marca ${auxModeloIngresado.marca} el Modelo ${auxModeloIngresado.modelo}`);
                        }
                        // se informa que el modelo ingresada no es valido. No se ingreso el nombre del modelo
                    } else {
                        alert('No hay Ingresado el nombre del Modelo. Vuelva a Intentarlo')
                    }
                    // se informa que la marca ingresada no se encuentra registrada
                } else {
                    alert('No se registrado la Marca: ' + auxModeloIngresado.marca);
                }
            }
        } while (window.confirm("Desea Registar otro Modelo?"));
        // si no hay marca registrada no se puede asociar un modelo
    } else {
        alert('No hay Marcas registradas. Primero registre una Marca para carga un Modelo');
    }
    if (window.confirm('Desea visualizar los Modelos registradas?')) {
        console.clear();
        console.table(modelos)
    }
}

// confirmo que se desea realizar la carga de un PRODUCTO para una Marca y Modelo registrados
if (window.confirm("¿Desea Catalogar un Producto para una Marca y Modelo?")) {

    // variables locales
    // variable para guardar en un objeto el producto que se desea cargar
    const auxProductoCargado = {};
    // Variable para almacenar el texto a mostrarse en MARCAS / MODELOS registrados.
    let auxModelos = '';
    // array con claves que no importa que tengan el mismo valor (puede haber mas de un mismo objeto con el mismo precio o stock)
    const arrayNoComparar = ['precio', 'stock']
    // array con los datos que no pueden estar vacios
    const datosNecesarios = ['producto', 'origen']

    // verifico que haya al menos un modelo cargado (si hay un modelo cargado es porque previamente se creo una marca)
    if (modelos.length) {
        for (let i = 0; i < modelos.length; i++) {
            const marca = modelos[i].marca;
            const modelo = modelos[i].modelo;
            auxModelos += `- OPCION ${i}. Marca: ${marca} Modelo: ${modelo}\n`;
        }

        do {
            // guardo en una variable el modelo para el cual deseo crear un producto
            const opcionTexto = prompt('Elija la OPCION de las Marcas/Modelos Registrados\n' + auxModelos);
            const opcionNumber = Number(opcionTexto)

            // verifico que se haya ingresado un valor valiido
            if (!isNaN(opcionNumber) && opcionTexto != '') {
                if (opcionNumber < modelos.length) {
                    alert(`Ha eligido la opcion ${modelos[opcionNumber].marca} ${modelos[opcionNumber].modelo}`);
                    // guardo la MARCA y MODELO para el cual se desea cargar un prodcuto.
                    auxProductoCargado['marca'] = modelos[opcionNumber].marca;
                    auxProductoCargado['modelo'] = modelos[opcionNumber].modelo;
                    // variable para guardar el valor ingresado que tendra el producto.
                    auxProductoCargado['producto'] = prompt('Ingrese el PRODUCTO/INSTRUMENTO que desea cargar (Guitarra / Bajo / Bateria / Teclados / DJ / etc)').trim();
                    // variable para guardar el valor ingresado que tendra el producto.
                    auxProductoCargado['origen'] = prompt('Ingrese el ORIGEN del PRODUCTO/INSTRUMENTO').trim();
                    // variable para guardar el valor ingresado que tendra el producto.
                    auxProductoCargado['precio'] = Number(prompt('Ingrese el PRECIO SIN IVA que poseera el producto'));
                    // variable para guardar el valor ingresado que tendra el producto.
                    auxProductoCargado['stock'] = Number(prompt('Ingrese la cantidad de articulos que hay en stock para el PRODUCTO/INSTRUMENTO'));

                    // se verifica que para la misma MARCA / MODELO no pueda existir el mismo producto
                    // no importa si hay varios productos con el mismo precio o stock, pero no puede haber mismo MARCA / MODELO / PRODUCTO / ORIGEN
                    const index = objetoRepetido(productos, auxProductoCargado, arrayNoComparar);
                    // verifico que no se haya ingresado un dato vacio
                    const datosOk = datoVacio(auxProductoCargado, datosNecesarios)

                    console.log(auxProductoCargado);
                    console.log(index);

                    // verifico que se haya ingresado valores numericos para precio y stock
                    if (auxProductoCargado.precio == NaN && auxProductoCargado.stock == NaN) {
                        alert('Debe INGRESAR un valor valido para PRECIO y STOCK');
                    } else if (index != -1) {
                        alert(`Ya hay cargado un PRODUCTO ${auxProductoCargado.producto} para la Marca: ${auxProductoCargado.marca} Modelo: ${auxProductoCargado.modelo}`);
                    } else if (datosOk) {
                        alert('Los datos de Marca / Modelo / Producto / Origen / Precio / Stock son necesarios para catalogar un producto')
                    } else {
                        productos.push(new Producto(auxProductoCargado))

                        console.log(`Se ha creado el producto ${auxProductoCargado.producto} para la Marca: ${auxProductoCargado.marca} Modelo: ${auxProductoCargado.modelo}`);
                    }
                } else {
                    alert('La opcion: ' + opcionTexto + ' NO es una OPCION valiida.');
                }
            } else {
                alert('No ha ingresado una opcion valida!!!');
            }
            console.log(opcionTexto);
            console.log(auxModelos);

        } while (window.confirm("Desea Registar otro Producto?"))

        // si no hay una Marca ni un Modelo registrado no se podra registar un producto. 
    } else {
        alert('Debe registrar una Marca y un Modelo antes de poder cargar un producto para la venta')
    }
    ordenarArray(productos, arrayOrdenProducto)

    if (window.confirm('Desea visualizar los Productos registradas?')) {
        console.clear();
        console.table(productos)
    }
}

if (window.confirm('Desea visualizar los Productos disponibles con stock para poner en venta con el precio CON IVA?')) {
    // con el metodo filter creo un nuevo array con los productos que poseen stock.
    const productoEnStock = productos.filter(producto => producto.stock > 0);
    // con map itero sobre el array para utilizar el metodo stockDisponible
    const productosVenta = productoEnStock.map (producto => producto.stockDisponible())
    console.clear();
    console.table(productosVenta)
}