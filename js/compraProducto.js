import { crearAlerta } from "./funciones.js";

//! variables tomadas desde el HTML

const selectMoneda = document.getElementById('selectMoneda');
const inputMoneda = document.getElementById('inputMoneda');
const selectMonedaEquivalente = document.getElementById('selectMonedaEquivalente');
const inputConversion = document.getElementById('conversionMoneda');
const imgProducto = document.getElementById('productoImagen');
const datosProducto = document.getElementById('productoDatos')

//! funciones locales


// se consulta una API para ver cotizaciones de las monedas y se calculan los valores.
const calcularMoneda = async () => {

	// almaceno en una variable local a la funcion los valores ingresados en el input
	const monedaOne = selectMoneda.value;
	const monedaTwo = selectMonedaEquivalente.value;

	try {
		// consulta a API para saber la cotizacion del dia
		const respuesta = await fetch(`https://open.er-api.com/v6/latest/${monedaOne}`);
		const resultado = await respuesta.json();
		const monedaOneValue = resultado.rates[monedaOne];
		const monedaTwoValue = resultado.rates[monedaTwo];

		inputConversion.value = (inputMoneda.value * monedaTwoValue).toFixed(2);

		return [monedaOneValue, monedaTwoValue];

	} catch (error) {
		crearAlerta ('No es posible realizar la cotizacion en este momento','alertaCompra');
	}

}

// funcion para renderizar los valores del objeto a comprar (precio, stock, descripcion, etc)
const renderPrecio = (objeto) => {

	const precioFormateado = Intl.NumberFormat("es-AR", {
		// currency: "ARS",
		// currencySymbol: "$",
		// minimumFractionDigits: 2
	});

	const container = document.createElement('article');
	const titulo = document.createElement('h3');
	const descripcion = document.createElement('p');
	descripcion.classList.add('descripcion');
	const precio = document.createElement('p');
	precio.classList.add('precio');
	const stock = document.createElement('p');
	const cantidadStock = document.createElement('span');
	stock.innerText = 'Stock Disponible: ';
	cantidadStock.textContent = parseInt(objeto.stock)
	stock.appendChild(cantidadStock)
	stock.classList.add('stock')
	const btnComprar = document.createElement('button');
	btnComprar.id = `comprar${objeto.id}`
	btnComprar.textContent = 'COMPRAR'
	btnComprar.classList.add('btnComprar')
	const btnDescartar = document.createElement('button');
	btnDescartar.id = `descartar${objeto.id}`
	btnDescartar.textContent = 'DESCARTAR'
	btnDescartar.classList.add('btnDescartar')
	titulo.textContent = `${objeto.marca} ${objeto.modelo} ${objeto.origen}`
	precio.innerText = `$ ${objeto.precio}`
	descripcion.textContent = objeto.descripcion

	container.append(titulo, precio, descripcion, stock, btnComprar, btnDescartar)
	return container
}

//! datos guardados en local  storage

const productoComprar = JSON.parse(localStorage.getItem('productoComprar')) || {}
console.log(productoComprar);
//! eventos para actualizar las cotizaciones

inputMoneda.addEventListener('change', calcularMoneda)
selectMoneda.addEventListener('change', calcularMoneda)
selectMonedaEquivalente.addEventListener('change', calcularMoneda)

// insercion en la tarjeta de compra la imagen del producto
const img = document.createElement('img')
img.src = `../img/${productoComprar.imagen}`
imgProducto.appendChild(img)

// insercion de los valores del productos a traves de la funcion renderPrecio()
datosProducto.appendChild(renderPrecio(productoComprar))

// evento para realizar la compra

document.getElementById(`comprar${productoComprar.id}`).onclick = () => {
	Swal.fire({
		icon: 'success',
		title: 'COMPRA REALIZADA',
		text: `ADQUIRIO ${productoComprar.marca} ${productoComprar.modelo} ${productoComprar.origen}`,
	})
}