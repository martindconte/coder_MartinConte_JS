Aplicacion Web para Administrar Inventario de un Negocio

*********** PROPUESTA DE LA APLICACION ************

Se intenta crear un aplicion para llevar el control de inventario de un nogocio/e-commerce donde se podra, dependiendo del perfil del usuario logueado, realizar la carga
de catalogo de marcas, modelos, productos, etc.

La idea es que haya un control sobre lo que se cataloga es por eso que se deben realizar los siguientes pasos:

// USUARIO LOGUEADO CON PERFIL ADMIN

El usuario Admin podra acceder a traves del header al link administrador donde podra crear/modificar/eliminarr usuarios

1. Se debera realizar la carga de las marcas de las marcas (en este caso es una tienda de musica), por ejemplo las marcas Fender, Gibson, Jackson, etc. No se podran
cargar dos marcas con el mismo nombre.

2. Con las marcas creadas, en la pagina de modelos se podran asociar modelos para las marcas. Por ejemplo Marca: Fender - Modelo: Jazz Bass. No se podra para la misma
marca asignar el mismo nombre a dos o mas modelos. Por ejemplo es valido Marca: Fender - Modelo: Telecaster y Marcas: Squier - Modelo: Telecaster.

3. Con las marcas y modelos creados se podra dar altas productos. Por ejemplo Marca: Focusrite - Modelo: 2i2 3° Gen - Tipo: Placa de Audio - Origen: Inglaterra - Imagen / Precio / etc.
No se podra haber un productos que posea los mismos valores para el conjunto de claves de marca modelo tipo origen (de esta manera se controla que no se cargauen varias veces el mismo producto)
IMPORTANTE: LAS IMAGENES DEBEN ESTAR GUARDADAS EN LA CARPETA img

4. Para los productos cargados en el punto 3, los que posean stock mayor a 0 se mostraran en Productos para Vender

********************* ESTILOS *********************

Habilitar SASS --> sass -w scss/main.scss css/style.css

base (creacion de variables para ser reutilizadas en todo el codigo)
    color.scss --> variable de colores a utilizarse
    fonts --> fuentes a utilizarse (google fonts)
    normalize --> normalizacion del HTML para quitar estilos que vienen por default

components (componentes de estilos que serean reutilizados en toda las paginas)
    common --> extends y clases que se reutilizan a lo largo del proyecto (clases para botones, estils para tablas, etc)
    modal --> estilos para el modal
    tipografia --> creacion de estilos para tipografia y creacion de extends con formato %font-<FUENTE>-<TAMAÑO> (ejemplo %font-primary-xs)

layout (estilos para HTML que seran reutilizados a lo largo del proyecto)
    header --> estilos correspondiente al header que se reutilza a lo largo de todas las paginas
    footer --> no se creo aun (entiendo que para lo evaluado no se requiere. Se construira para la entrega final)

pages (estilos de las paginas)
    index --> estilos para la pagina index
    marcas --> estilos para la pagina marcas
    modelos --> estilos para la pagina modelos
    productos --> estilos para la pagina productos
    usuarios --> estilos para la pagina usuarios
    productosVenta --> estilos para la pagina productosVenta

utilities (mixins y funciones)
    mixins --> creacion de mixins

********************** CODIGO *********************

Cada pagina HTML y el header posee su archivo JS que maneja DOM y eventos en cada pagina.

El archivo funciones.,js posee todas las funciones que son reutilizadas a lo largo de todo el proyecto (funciona para verificar si un dato vacio, funciones para modificar el DOM,
funciones para buscar un objeto en un array, etc)

En el archivo fnEventos.js se creo una funcion que controla la modificaciones de datos cargados (marcas, modelos, productos, usuarios, etc).
Cuando escribi el codigo me di cuenta que habia mucho codigo que era reutilizable pero que, dependiendo el caso, habia que validar una serie de datos (por ejemplo...
al momento de cargar / modidifcar una marca se debia verificar que el "dato marca" no se encuentre al repetido... similar a usuarios, pero que para modelos / productos las
validaciones eran multiples, en simultaneo no debia haber datos repetidos). Entonces me parecio mas limpio escribir la funcion que maneja los eventos de modificaciones y eliminar
escribirla en un archivo aparte dado que tambien requeria de variables globales para que funcione.

******************** CONCLUSION *******************

Espero que lo realizado este correcto... No me maten, estoy aprendiendo (nunca escribi una linea de codigo en mi vida...).
