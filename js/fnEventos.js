import {
  buscarDatosRepetidos,
  buscarKeyValue,
  campoVacio,
  creacionInput,
  crearAlerta,
  crearModalConfirmacion,
  crearSelect,
  crearSelectAnidado,
  eliminarColumna,
  eliminarElementoArray,
  encontrarCelda,
  modificarArrayLS,
  ordenarArray,
  tablaHorizontal,
} from "./funciones.js";


// variables guardadas en local storage
// guardo en una variable las marcas almacenados en local storage
const marcasLS = JSON.parse(localStorage.getItem("marcas"));
// creo un array con las marcas registradas para usar en los selects
const marcasRegistradas = marcasLS ? marcasLS.map(marca => marca.marca) : [];
// guardo en una variable los modelos almacenados en local storage
const modelosLS = JSON.parse(localStorage.getItem("modelos"));
// guardo en una variable las marcas que poseen modelos registrados
const auxMarcas = modelosLS ? modelosLS.map((elemento) => elemento.marca) : [];
// verifco que haya datos guardados en local storage. Si no los hay es una array vacio
const modelosRegistrados = modelosLS ? modelosLS : [];
// del array modelosRegistrados filtro las marcas y guardo cada una valor una vez (modelosRegistrados puede contener varias veces la misma marca)
const marcaModelo = [...new Set(auxMarcas)]

// variable globales para la funcion //! modificarDatosTablas
// aux para saber si el boton fue presionado
let eliminarBtn = false;
// guardo todas las filas a las que corresponde el boton presionado
let trModificado = [];
// guardo en un array los id de los usuarios a eliminar
let auxKeyEliminar = [];

/**
 *
 * @param {Event} e evento click sobre la tabla que deseo modificar celdas
 * @param {string} idTabla id de la tabla que posee en el HTML
 * @param {Array} array donde se almacenan los datos mostrados en la tabla
 * @param {string} variableLS clave para almacenar los datos en el LS para la variable arrray
 * @param {Array} arrayClavesNoRepetir  array con las claves que se deben validar para modificar un elemento
 * @param {Array} ordenArray array con las claves en orden de como se desea ordena la tabla
 */
export const modificarDatosTablas = (
  e,
  idTabla,
  array,
  variableLS,
  arrayClavesNoRepetir,
  ordenArray
) => {
  // guardo en una variable la tabla sobre la que hare modificaciones
  const tabla = document.getElementById(idTabla);

  // creo la variable pAlert para ver si ya fue creado en el DOM
  const pAlert = document.getElementById(`${idTabla}MsjAlert`);

  // si pAlert no existe en el DOM entonces creo a <p></p>
  if (!pAlert) {
    // creacion de etique <p></p> para creacion de mensaje de alerta relacionada a la tabla
    const p = document.createElement("p");
    p.classList.add("msjAlerta", "oculto");
    p.id = `${idTabla}MsjAlert`;
    tabla.appendChild(p);
  }

  // guardo en una variable los encabezados <th></th> que son las claves de los objetos
  const th = tabla.querySelectorAll("th");
  // guardo en un array las claves
  const key = Array.from(th).map((key) => key.textContent.toLocaleLowerCase());

  // guardo en una variable en donde hice click
  const btnClick = e.target;

  // verifico si hice click en un boton
  if (btnClick.tagName == "BUTTON") {
    //* modificacion de usuarios
    // verifico si el boton presionado es modificar
    if (btnClick.getAttribute("data-id") == "modificar") {
      // muestro y oculto los botones para el caso modificar
      document.getElementById(`${idTabla}AceptarBtn`).classList.remove("oculto");
      document.getElementById(`${idTabla}DescartarBtn`).classList.remove("oculto");
      btnClick.classList.add("oculto");

      if (!eliminarBtn) {
        eliminarColumna(idTabla, encontrarCelda(idTabla, "eliminar"));
        eliminarBtn = true;
      }

      // guardo en una variable la fila correspondiente al boton presionado
      const tr = btnClick.closest("tr");
      trModificado.push(tr);

      // agrego la clase modificado a la fila correspondiente al boton seleccionado
      tr.classList.add("modificando");

      // guardo los td correspondiente a la fila
      const tdNodeList = tr.querySelectorAll("td");
      // variable auxilizar para guardar el valor del id de la celda
      let id = '';
      // por cada celda agrego un input segun el tipo de dato
      tdNodeList.forEach((td, index) => {
        const value = td.textContent;
        switch (key[index]) {
          case "id":
            id = td.textContent;
            break;
          case undefined:
            break;
          case "admin":
            td.textContent = "";
            const selectAdmin = crearSelect(["true", "false"]);
            td.appendChild(selectAdmin);
            selectAdmin.value = value;
            break;
          case "marca":
            td.textContent = "";
            switch (variableLS) {
              case "modelos":
                const selectMarca = crearSelect(marcasRegistradas, `${id}Primario`);
                td.appendChild(selectMarca)
                selectMarca.value = value;
                break;
              case "productos":
                // td.textContent = "";
                const selectMarcas = crearSelect(marcaModelo, `${id}Primario`);
                td.appendChild(selectMarcas);
                selectMarcas.value = value;
                break;
              default:
                // td.textContent = "";
                const inputText = creacionInput(key[index]);
                td.appendChild(inputText);
                inputText.value = value;
                break;
            }
            break;
          case "modelo":
            switch (variableLS) {
              case "productos":
                td.textContent = "";
                const selectModelo = crearSelectAnidado(`${id}Primario`, modelosRegistrados, ['marca', 'modelo'], `${id}Secundario`);
                td.appendChild(selectModelo);
                selectModelo.value = value;
                break;
              default:
                td.textContent = "";
                const inputText = creacionInput(key[index]);
                td.appendChild(inputText);
                inputText.value = value;
                break;
            }
            break;
          case "imagen":
            td.textContent = "";
            const inputImg = creacionInput(key[index]);
            const p = document.createElement('p');
            p.textContent = value;
            td.appendChild(p);
            td.appendChild(inputImg);
            break;
          case "descripcion":
            td.textContent = '';
            const textArea = document.createElement('textarea');
            textArea.textContent = value;
            textArea.style.width = '150px';
            textArea.style.height = '150px';
            td.appendChild(textArea);
            break;
          default:
            td.textContent = "";
            const inputText = creacionInput(key[index]);
            td.appendChild(inputText);
            inputText.value = value;
            break;
        }
      });

      //* aceptar cambios realizados
      document.getElementById(`${idTabla}AceptarBtn`).onclick = () => {
        // array con los nuevos datos de los usuarios que fueron modificados
        const arrayNuevosDatos = [];

        // itero sobre cada fila del NodeList de filas
        trModificado.forEach((tr) => {
          // por cada fila obtengo el NodeList de las celdas
          const tdNodeList = tr.querySelectorAll("td");
          // objeto para guardar los datos del usuario modificado
          const objetoModificado = {};
          // por cada celda obtengo el valor
          tdNodeList.forEach((td, index) => {
            switch (key[index]) {
              case undefined:
                break;
              case "id":
                objetoModificado[key[index]] = td.textContent;
                break;
              case "imagen":
                const imgFile = td.querySelector('input[type = "file"]').files;
                objetoModificado[key[index]] = imgFile.length > 0 ?  imgFile[0].name : td.textContent
                // objetoModificado[key[index]] = imgFile[0].name;
                break;
              default:
                objetoModificado[key[index]] = td.firstChild.value;
                break;
            }
          });
          arrayNuevosDatos.push(objetoModificado);
        });

        console.log(arrayNuevosDatos);
        // verifico que todos los datos esten completos
        const datoVacio = campoVacio(arrayNuevosDatos);

        /**
         * validacion de datos segun la tabla que se esta modificando.
         *
         * ! Si se esta validando tablas de usuarios y marcas --> SI AL MENOS UN DATO ESTA REPETIDO SE CANCELA LA MODIFICACION
         * ? usuarios --> no puede haber mas de un usuario con el mismo "nombre de usuario", "mail" o "telefono"
         * ? marcas --> no se pueden cargar dos marcas con el mismo nombre. Por ejemplo marca: Fender debe ser unica
         *
         * ! Si se esta validando tabla de modelos --> SE DEBE VERIFICAR COINCIDENCIAS ENTRE TODOS LOS DATOS
         * 
         * ? modelos --> no puede haber para la misma marca dos modelos iguales. Pero puede haber distintos modelos para la misma marca.
         * Por ejemplo es valido --> marca: Fender - modelo: Jazz Bass y marca: Fender - modelo: Presicion
         * Por ejemplo no es valido --> dos o mas objetos marca: Fender - modelo: Jazz Bass
         * 
         * ? productos --> no puede haber dos o ma productos que posean los mismos valores para marca, modelo y tipo
         * ejemplo es valido --> marca: Fender - modelo: Jazz Bass  - producto Bajo y marca: Fender - modelo: Jazz Bass - tipo Guitarra
         * Por ejemplo no es valido --> dos o mas objetos marca: Fender - modelo: Jazz Bass - tipo: Bajo
         * 
         *
         */
        /* validacion de datos segun la tabla que se esta modificando. */
        switch (datoVacio) {
          case true:
            crearAlerta("Todos los datos son OBLIGATORIOS", `${idTabla}MsjAlert`);
            break;
          case false:
            switch (variableLS) {
              case "usuarios":
              case "marcas":
                // verifico que no haya NINGUN valor repetidos para las claves detalladas en arrayClavesNoRepetir (dos marcas iguales)
                const { objetosRepetidos, clavesRepetidas } = buscarDatosRepetidos(arrayNuevosDatos, array, arrayClavesNoRepetir);
                switch (objetosRepetidos.length != 0) {
                  case true:
                    crearAlerta(`El ${clavesRepetidas[0][0].toUpperCase()}: ${objetosRepetidos[0][clavesRepetidas[0]]} ya se encuentra registrado`, `${idTabla}MsjAlert`);
                    break;
                  case false:
                    // verifico que los datos no esten repetidos entre los objetos repetidos (por ejemplo no se carguen dos telefonos iguales entre las celdas modificadas)
                    const { objetosRepetidos: objIngresadoRepetidos, clavesRepetidas: clavesValoresRepetidos, } = buscarDatosRepetidos(arrayNuevosDatos, arrayNuevosDatos, arrayClavesNoRepetir);
                    switch (objIngresadoRepetidos.length != 0) {
                      case true:
                        crearAlerta(`El ${clavesValoresRepetidos[0][0].toUpperCase()}: ${objIngresadoRepetidos[0][clavesValoresRepetidos[0]]} fue utilizado en varias modificaciones`, `${idTabla}MsjAlert`);
                        break;
                      // si no se verifican datos repetidos guardo en LS y muestro la tabla
                      case false:
                        // modifico el array con los nuevos valores, ordeno el array y lo guardo en Local Storage
                        array = modificarArrayLS(array, arrayNuevosDatos, variableLS, ordenArray);
                        // oculto los botones
                        document.getElementById(`${idTabla}AceptarBtn`).classList.add("oculto");
                        document.getElementById(`${idTabla}DescartarBtn`).classList.add("oculto");
                        // actualizo la tabla con los nuevos valores
                        tablaHorizontal(array, idTabla);
                        // vuelvo a inicializar las variables
                        trModificado = [];
                        eliminarBtn = false;
                        location.reload();
                        break;
                    }
                    break;
                }
                break;
              case 'productos':
              case 'modelos':
                // verifico que para una misma marca no haya no se haya ingresado un modelo ya existente
                const elementoRepetido = buscarKeyValue(array, arrayNuevosDatos, arrayClavesNoRepetir);
                switch (elementoRepetido != -1) {
                  case true:
                    crearAlerta(`Para la Marca: ${array[elementoRepetido].marca} el Modelo: ${array[elementoRepetido].modelo} ya e encuentra cargado`, `${idTabla}MsjAlert`);
                    break;
                  case false:
                    // verifico que no se hayan ingresado como modificacion dos modelos iguale para la misma marca
                    const elementoIngresadoRepetido = buscarKeyValue(arrayNuevosDatos, arrayNuevosDatos, arrayClavesNoRepetir);
                    switch (elementoIngresadoRepetido != -1) {
                      case true:
                        crearAlerta(`El Modelo: ${arrayNuevosDatos[elementoIngresadoRepetido].modelo} para la Marca: ${arrayNuevosDatos[elementoIngresadoRepetido].marca} se ingreso varias veces`, `${idTabla}MsjAlert`);
                        break;
                      case false:
                        // modifico el array con los nuevos valores, ordeno el array y lo guardo en Local Storage
                        array = modificarArrayLS(array, arrayNuevosDatos, variableLS, ordenArray);
                        // oculto los botones
                        document.getElementById(`${idTabla}AceptarBtn`).classList.add("oculto");
                        document.getElementById(`${idTabla}DescartarBtn`).classList.add("oculto");
                        // actualizo la tabla con los nuevos valores
                        tablaHorizontal(array, idTabla);
                        // vuelvo a inicializar las variables
                        trModificado = [];
                        eliminarBtn = false;
                        location.reload();
                        break;
                    }
                    break;
                }
                break;
            }
            break;
        }
      };
    }

    // acciones para la accion eliminar
    if (btnClick.getAttribute("data-id") == "eliminar") {
      // muestro los botones correspondientes a eliminar
      document.getElementById(`${idTabla}EliminarBtn`).classList.remove("oculto");
      document.getElementById(`${idTabla}DescartarBtn`).classList.remove("oculto");
      btnClick.classList.add("oculto");

      // si presione eliminar, borro todos los botones de mnodificar de la tabla
      if (!eliminarBtn) {
        /* elimino la columna a traves de la funcion eliminarColumna encontrando las filas a traves de la
        funcion encontrarCelda */
        eliminarColumna(idTabla, encontrarCelda(idTabla, "modificar"));
        eliminarBtn = true;
      }

      // guardo en una variable la fila correspondiente al boton presionado
      const tr = btnClick.closest("tr");

      // agrego la clase modificado a la fila correspondiente al boton seleccionado
      tr.classList.add("eliminando");

      // itero sobre el NodeList para obtener los ids de los usuarios que deseo elimninar
      const tdNodeListEliminar = tr.querySelectorAll("td");
      tdNodeListEliminar.forEach((td, index) => {
        key[index] == "id" && auxKeyEliminar.push(td.textContent);
      });

      // confirmacion que se desea eliminar el elemento y creacion de modal
      document.getElementById(`${idTabla}EliminarBtn`).onclick = () => {
        // creo un modal para la confirmacion
        const divModal = document.createElement("div");
        divModal.id = `${idTabla}Modal`;
        tabla.appendChild(divModal);
        crearModalConfirmacion(
          "¿Esta seguro que desea ELIMINAR los datos seleccionados? SITUACION IRREVERSIBLE",
          `${idTabla}Modal`
        );
        // confirmacion en modal de aceptar borrar
        document.getElementById(`${idTabla}ModalConfirmar`).onclick = () => {
          array = eliminarElementoArray(array, auxKeyEliminar);
          ordenarArray(array, ordenArray);
          localStorage.setItem(variableLS, JSON.stringify(array));
          divModal.remove();
          tablaHorizontal(array, idTabla);
          document.getElementById(`${idTabla}EliminarBtn`).classList.add("oculto");
          document.getElementById(`${idTabla}DescartarBtn`).classList.add("oculto");
          eliminarBtn = false;
          auxKeyEliminar = [];
          location.reload();
        };
        // cancelo la baja en modal
        document.getElementById(`${idTabla}ModalCancelar`).onclick = () => {
          divModal.remove();
        };
      };
    };

    // decarto cualquier cambio realizado (modificacion o eliminar)
    document.getElementById(`${idTabla}DescartarBtn`).onclick = () => {
      document.getElementById(`${idTabla}EliminarBtn`).classList.add("oculto");
      document.getElementById(`${idTabla}AceptarBtn`).classList.add("oculto");
      document.getElementById(`${idTabla}DescartarBtn`).classList.add("oculto");
      tablaHorizontal(array, idTabla);
      eliminarBtn = false;
      auxKeyEliminar = [];
      trModificado = [];
    };
  }
};