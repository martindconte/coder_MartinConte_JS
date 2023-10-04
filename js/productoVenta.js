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

const productosVenta = productosCargados
    .map(producto => producto.stockDisponible())
    .filter(producto => producto !== null);

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
console.log(tarjetas);
