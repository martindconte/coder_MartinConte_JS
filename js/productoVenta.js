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

    stockDisponible() {
        if (this.stock > 0) {
            const productoConStock = { ...this };

            const precioFormateado = Intl.NumberFormat("es-AR", {
                currency: "ARS",
                currencySymbol: "$",
                minimumFractionDigits: 2
            });

            productoConStock.precio = precioFormateado.format(this.precio);
            return productoConStock;
        }
        return null;
    }
}


const productosLS = JSON.parse(localStorage.getItem('productos'));
const productosCargados = productosLS ? productosLS.map(producto => new Producto(producto)) : [];

/* a traves del metodo constructor stockDisponible le doy formato de moneda a precio y filtro
los objetos que no poseen stock */
const productosVenta = productosCargados
    .map(producto => producto.stockDisponible())
    .filter(producto => producto !== null);

//! FUNCIONAES LOCALES
/**
 * funcion para mostrar en el HTML los objetos dentro de array 
 * @param {Array} array array con los objetos que deseo renderizar en el HTML
 * @returns retorna un section con los objetos dentro de array
 */
const renderProducto = (array) => {
    const container = document.createElement('section');
    container.className ='articulos__tarjetas';
    array.forEach(({ id, marca, modelo, origen, imagen, descripcion, precio }) => {
        const producto = document.createElement('div');
        producto.classList.add('tarjetas');
        const titulo = document.createElement('p');
        titulo.innerText = `${marca} ${modelo} ${origen}`.toUpperCase();
        titulo.classList.add('titulo');
        const img = document.createElement('img');
        img.src = `../img/${imagen}`;
        const pPrecio = document.createElement('p');
        pPrecio.innerText = `$ ${precio}`;
        pPrecio.classList.add('precio');
        const pDescripcion = document.createElement('p');
        pDescripcion.innerText = descripcion;
        pDescripcion.classList.add('descripcion');
        const button = document.createElement('button');
        button.classList.add('btn-comprar');
        button.id = id;
        button.innerText = 'COMPRAR'
        producto.appendChild(titulo)
        producto.appendChild(img)
        producto.appendChild(pDescripcion)
        producto.appendChild(pPrecio)
        producto.appendChild(button)
        container.appendChild(producto)
    }); 
    return container;
}

const tarjetas = renderProducto(productosVenta)
const prodcutosTarjetas =  document.querySelector('main')
prodcutosTarjetas.appendChild(tarjetas)

const sectionProductos = document.querySelector('section')
const btnCompra = sectionProductos.querySelectorAll('button')


btnCompra.forEach((button) => {
    button.onclick = (e) => {
        const id = e.target.id
        const productoComprar = productosVenta.find(producto => producto.id == id)
        localStorage.setItem('productoComprar',JSON.stringify(productoComprar))
        window.location.href = './compraProducto.html'
    }
})


