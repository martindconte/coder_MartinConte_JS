//! ********************** FUNCIONES **********************

//? GENERAR CODIGO UNICO

export const generarCodigoUnico = () => {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let codigo = "";

  for (let i = 0; i < 5; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    codigo += caracteres.charAt(indiceAleatorio);
  }

  return codigo;
};

//? CREO UN MENSAJE DE ALERTA

export const crearAlerta = (text, id) => {
  let newAlerta = document.getElementById(id);
  newAlerta.classList.remove("oculto");
  newAlerta.innerText = `${text}`;
  setInterval(() => {
    newAlerta.classList.add("oculto");
  }, 5000);
  return newAlerta;
};

/**
 * funcion que busca un elemento en un array. Compara si existe un elemento que posea los
 * mismos valores para //! TODAS LAS CLAVES detalladas en el array.
 *
 * @param {Array} array array donde deseo comparar a element
 * @param {Object || Array} elemento objeto que deseo buscar en array
 * @param {Array} claves array con las claves que deseo comprar entre array y objeto
 * @returns {number} retorn el index en array si se encuentra un element que posea mismo valores para las claves detalladas en el array claves
 */
export const buscarKeyValue = (array, elemento, claves) => {
  const index = array.findIndex((objArray) => {
    return claves.every(key => {
      // verifico si elemento es un array
      if (Array.isArray(elemento)) {
        return elemento.some(objeto => {
          if (objeto.id != objArray.id) {
            return objeto[key].toLowerCase() == objArray[key].toLowerCase();
          }
        })
      // si no es un array lo conidero un objeto
      } else {
        return elemento[key].toLowerCase() == objArray[key].toLowerCase();
      }
    })
  });
  return index;
};

/**
 * funcion que busca un elemento en un array para determinar si para una clave dada (en el array claves) existe //!AL MENOS UNICO
 * objeto en array que poseea el mismo valor. Por ejemplo si cargo un usuario con el cel 123456, busco si hay algun otro
 * usuario dentro de array que poseea ese mismo cel. Retorna un objeto con dos arrays.
 * objetosConValoresRepetidos --> array con los objetos de elemento que poseen al menos una clave con el mismo valor que elemento
 * clavesConValoresRepetidos --> array que por index indica por objeto que claves estan repetidas
 *
 * @param {Array} elemento array con objetos que deseo comprar para saber si hay alguna clave que posea el mismo valor que en array.
 * @param {Array} array array en donde voy a buscar a elemento
 * @param {Array} claves array con las claves que deseo comprar si existe mismo valores
 * @returns {Object} retorna un objetos con dos arrays
 */
export const buscarDatosRepetidos = (elemento, array, claves) => {
  const objetosRepetidos = [];
  const clavesRepetidas = [];

  elemento.forEach(objNuevo => {
    const coincidencias = array.filter(objUsuario => {
      if (objNuevo.id != objUsuario.id) {
          return claves.some(clave => objNuevo[clave].toLowerCase().trim() === objUsuario[clave].toLowerCase().trim());
      }
    });

    if (coincidencias.length > 0) {
      objetosRepetidos.push(objNuevo);
      const clavesRepetidasPorObjeto = claves.filter(clave => {
        return coincidencias.some(objUsuario => objUsuario[clave].toLowerCase().trim() === objNuevo[clave].toLowerCase().trim());
      });
      clavesRepetidas.push(clavesRepetidasPorObjeto);
    }
  });

  return {
    objetosRepetidos,
    clavesRepetidas
  }
}

/**
 * funcion que busca un elemento en un array para determinar si para una clave dada (en el array claves) existe
 * objeto en array que poseea el mismo valor. Por ejemplo si cargo un usuario con el cel 123456, busco si hay algun otro
 * usuario dentro de array que poseea ese mismo cel. Si lo encuentra devuelve la posicion en el array
 *
 * @param {Array} array array donde deseo buscar los valores del elemento para las claves detalladas en el array claves
 * @param {Object} elemento elemento que deseo buscar en array para comparar sus valores segun las claves declaradas en el array claves
 * @param {Array} claves array con las claves que deseo comprar entre el array y el elemento
 * @returns {number} devuelvo la posicion en array donde se haya coincidencia para un mismo valor segun la clave dada
 */
export const valoresRepetidos = (array, elemento, claves) => {
  const index = array.findIndex((objArray) => {
    if (objArray.id != elemento.id) {
      return claves.some((key) => {
        if ( typeof elemento[key] === "number" && typeof objArray[key] === "number") {
          return elemento[key] === objArray[key];
        } else {
          return elemento[key].toLowerCase() === objArray[key].toLowerCase();
        }
      });
    }
  });
  return index;
};

/**
 * ordeno el array segun el orden detallado en el arrayKey
 * @param {Array} array //* array que deseo ordenar
 * @param {Array} arrayKey //* array con el orden de las claves por las que deseo ordenar al array
 * @returns {Array} //* deveuelve el array ordenado
 */
export function ordenarArray(array, arrayKey) {
  return array.sort((a, b) => {
    for (let propiedad of arrayKey) {
      if (a[propiedad] !== b[propiedad]) {
        return a[propiedad].localeCompare(b[propiedad]);
      }
    }
    return 0;
  });
}

/**
 * Busca un objeto o array por su ID dentro de un array y reemplaza sus valores.
 * @param {array} arrayActual - El array en el que se busca el elemento. Si se encuentra, se reemplazan los valores.
 * @param {array | Object} elemento - El elemento que se utilizará para reemplazar el objeto que se encuentra en arrayActual.
 * @returns {array} - El array actual modificado.
 */
export const buscarYReemplazarID = (arrayActual, elemento) => {
  // Verifica si elemento es un array
  if (Array.isArray(elemento)) {
    // Si elemento es un array, itera sobre cada elemento
    for (let i = 0; i < elemento.length; i++) {
      // Encuentra el índice del objeto con el mismo ID en arrayActual
      const index = arrayActual.findIndex(
        (objeto) => objeto.id == elemento[i].id
      );
      // Reemplaza el objeto en arrayActual con el nuevo elemento
      arrayActual[index] = elemento[i];
    }
  } else {
    // Si elemento no es un array (es un objeto), itera sobre las claves del objeto
    for (let key in elemento) {
      // Encuentra el índice del objeto con el mismo ID en arrayActual
      const index = arrayActual.findIndex(
        (objeto) => objeto.id == elemento[key]
      );
      // verifco que index sea distinto de -1
      if (index != -1) {
        // Reemplaza el objeto en arrayActual con el nuevo elemento
        arrayActual[index] = elemento;
      }
    }
  }
  // Retorna el array actual modificado
  return arrayActual;
};

/**
 * elimino los objetos de un array segun los ids indicados en arrayId
 * @param {Array} array array del cual quieres eliminar los elementos cuyos ids coincidan en arrayId
 * @param {Array} arrayId array con los ids que deseo eliminar de array
 * @returns {Array} array modificado
 */

export const eliminarElementoArray = (array, arrayId) => {
  return array.filter((objArray) => !arrayId.some((key) => key == objArray.id));
};

/**
 * busco si algun objeto que este dentro de un array posea un value = ''
 * @param {Array || Object} elemento array que tiene objetos donde deseo buscar valores vacios  
 * @returns {boolean} true o false
 */
export const campoVacio = (elemento) => {
  let inputSinDato = false;
  if (Array.isArray(elemento)) {
    inputSinDato = elemento.some((objeto) => {
      return Object.values(objeto).some((value) => value == "");
    });
  } else {
    inputSinDato = Object.values(elemento).some(value => value == '');
  }
  return inputSinDato;
}

/**
 * 
 * @param {Array} array array al que deseo modificar un objeto 
 * @param {Array} nuevoValores array con objetos que deseo reemplazar en array
 * @param {String} variableLS key para guardar en local storage
 * @param {Array} ordenArray array con las claves para ordenar el array
 * @returns {Array} se rertorna el array modificado
 */
export const modificarArrayLS = (array, nuevoValores, variableLS, ordenArray) => {
  let nuevoArray = buscarYReemplazarID(array, nuevoValores);
  ordenarArray(array , ordenArray);
  localStorage.setItem(variableLS, JSON.stringify(array));
  
  return nuevoArray
}

//! ********** FUNCIONES PARA MODIFICAR EL DOM ************

//? CREAR TABLA HORIZONTAL

export const tablaHorizontal = (elemento, id) => {
  const tablaContainer = document.getElementById(id);
  tablaContainer.innerText = "";
  const tabla = document.createElement("table");

  // si element es un objeto
  if (!Array.isArray(elemento)) {
    // los encabezados seran las claves del objeto
    const encabezados = document.createElement("tr");
    // los datos seran los valores del objeto
    const tr = document.createElement("tr");

    for (const key in elemento) {
      const th = document.createElement("th");
      th.textContent = key.charAt(0).toUpperCase() + key.slice(1);
      encabezados.appendChild(th);

      const td = document.createElement("td");
      td.textContent = elemento[key];
      tr.appendChild(td);
    }
    // agrego los botones por las filas
    const botonModificar = document.createElement("td");
    botonModificar.innerHTML = `<button class="btnTableV__modificar" data-id="modificar">MODIFICAR</button>`;
    tr.appendChild(botonModificar);
    const botonEliminar = document.createElement("td");
    botonEliminar.innerHTML = `<button class="btnTableV__eliminar" data-id="eliminar">ELIMNAR</button>`;
    tr.appendChild(botonEliminar);
    tabla.appendChild(encabezados);
    tabla.appendChild(tr);

    // si elemento es un array
  } else if (Array.isArray(elemento)) {
    // los encabezados seran las claves del los objetos dentro del array
    const encabezados = document.createElement("tr");

    for (const keyObjeto in elemento[0]) {
      const th = document.createElement("th");
      th.textContent = keyObjeto.charAt(0).toUpperCase() + keyObjeto.slice(1);
      encabezados.appendChild(th);
    }

    tabla.appendChild(encabezados);

    for (const obj of elemento) {
      const fila = document.createElement("tr");
      for (const keyObj in obj) {
        const td = document.createElement("td");
        td.textContent = obj[keyObj];
        fila.appendChild(td);
      }

      const botonModificar = document.createElement("td");
      botonModificar.innerHTML = `<button class="btnTableV__modificar" data-id="modificar" id="btnModificar${obj.id}" type="button">MODIFICAR</button>`;
      fila.appendChild(botonModificar);
      const botonEliminar = document.createElement("td");
      botonEliminar.innerHTML = `<button class="btnTableV__eliminar" data-id="eliminar" id="btnEliminar${obj.id}" type="button">ELIMNAR</button>`;
      fila.appendChild(botonEliminar);

      tabla.appendChild(fila);
    }
  }
  tablaContainer.appendChild(tabla);
};

/**
 *
 * @param {text} id id HTL de la tabla a la cual le quiero eliminar una columna
 * @param {number} columna numero de columna de la tabla que deseo eliminar
 */
export const eliminarColumna = (id, columna) => {
  // guardo en una variable la tabla sobre la que deseo hacer modificaciones
  const tabla = document.getElementById(id);
  // guardo en un variable las filas de la tabla
  const tr = tabla.querySelectorAll("tr");
  // recorro las filas y borro la que corresponde al numero de columna que deseo eliminar
  tr.forEach((fila) => {
    const tdEliminar = fila.children[columna];
    if (tdEliminar != undefined) {
      fila.removeChild(tdEliminar);
    }
  });
};

/**
 * encuentro el numero de columna que corresponde a un boton segun su data-id
 * @param {text} idTabla id HTML de la tabla
 * @param {text} dataId data-id del boton que deseo encontrar
 * @returns {number} retorna el numero de fila que ocupa dentro de una fila
 */
export const encontrarCelda = (idTabla, dataId) => {
  const tabla = document.getElementById(idTabla);
  const btnModificar = tabla.querySelector(`button[data-id = ${dataId}]`);
  const tdBtnModificar = btnModificar.closest("td");
  const trBtnModificar = tdBtnModificar.closest("tr");

  const celasFilas = trBtnModificar.querySelectorAll("td");
  for (let i = 0; i < celasFilas.length; i++) {
    if (celasFilas[i] == tdBtnModificar) {
      return i;
    }
  }
};

/**
 * creacion de input segun el tipo de dato ingresado (si key es nombre el input sera text)
 * @param key - clave del objeto para crear un input segun el dato a ingresar
 */

export const creacionInput = (key) => {
  const input = document.createElement("input");
  switch (key) {
    case "password":
      input.type = "password";
      break;

    case "fechanacimiento":
      input.type = "date";
      break;

    case "telefono":
    case "precio":
    case "stock":
      input.type = "number";
      input.min = 0;
      break;

    case "email":
      input.type = "email";
      break;

    case "imagen":
      input.type="file";
      input.accept="image/*";
      input.multiple = "true";
      break;

    default:
      input.type = "text";
      break;
  }
  return input;
};

/**
   creacion de select con las opcion que estan en arrayOption
   * @param {Array} arrayOption array con las opciones a mostrar
   * @param {string} idSelect id que se le dara al select  
   * @param {string}  formDataName atribute name del select
   */
export const crearSelect = (arrayOption, idSelect, formDataName) => {
  const select = document.createElement("select");
  select.id = idSelect;
  select.name = formDataName;

  //* CREO LAS OPCIONES CON LAS MARCAS REGISTRADAS
  arrayOption.forEach((element) => {
    const option = document.createElement("option");
    option.value = element;
    option.textContent = element;
    select.appendChild(option);
  });
  return select;
};

/**
 * creo un select de los modelos segun la marca seleccionada
 * @param {id} idArrayPrimario id del select que posee el select primario (el secundario dara opciones segun lo que se seleccione del primero)
 * @param {Array} arraysecundario array con las opciones que se mostaran en select secundario.
 * ejemplo de arraySecundario = [
 * {
 *  marca: Fender, --> Dato del select primario
 *  modelo: Jazz Bass 
 * },
 * {
 *  marca: Fender, --> Dato del select primario
 *  modelo: Presicion 
 * },
 * {
 *  marca: Spector, --> Dato del select primario
 *  modelo: NS2
 * },
 * ]
 * @param {Array} clavesFiltrar array con las claves que se desea filtrar el select primario y el secundario. Por ejemplo ['marcas', 'modelo'] 
 * @param {string} id id del HTML en donde se inserta el select
 * @param {string} idSelectSecundario id que se le dara al select secundario
 * @param {string} formDataNombre atributo name del select secundario para extraer datos en FormData
 * @param {select} return retorna la funcion crearSelect que crea un select con los datos ingresados
 */
export const crearSelectAnidado = (idSelectPrimario, arraySecundario, clavesFiltrar, idSelectSecundario, formDataNombre) => {
  // guardo en una variable el id del select primario el cual leera el segundo select para mostrar las opciones
  const selectPrimario = document.getElementById(idSelectPrimario);
  // guardo el valor del primer select
  const selectPrimarioValor = selectPrimario.value;
  /* guardo en una variable los valores encontrados en el array secundario cuyas claves coinciden que poseen los valores seleccionados en el select primario
  por ejemplo si el select primario selecciono la marca: Fender. En el array selectSecundarioFiltrado guardare todos los
  objetos cuya clave marca sea fender*/
  const selectSecundarioFiltrado = arraySecundario.filter((objeto) => objeto[clavesFiltrar[0]] == selectPrimarioValor);
  /* guardo en un array los valores de las claves correspondientes al select secundario. del array selectSecundarioFiltrado obtengo los valores
  de la clave detallada en la posicion 1 del array clavesFiltrar */
  const arrayModelosFiltrados = selectSecundarioFiltrado.map((objeto) => objeto[clavesFiltrar[1]]);
  
  // elimino el select si esta creado para que cuando haya un cambio en la marca se cree uno nuevo
  let selectSecundario = document.getElementById(idSelectSecundario)
  // const selectSecundario = document.getElementById(idSelectSecundario);

  if (!selectSecundario) {
      selectSecundario = crearSelect(arrayModelosFiltrados, idSelectSecundario, formDataNombre);
  } else {
      selectSecundario.innerHTML = "";
      arrayModelosFiltrados.forEach((element) => {
          const option = document.createElement("option");
          option.value = element;
          option.textContent = element;
          selectSecundario.appendChild(option);
      });
  }
  return selectSecundario;
};

/**
 * CREO MODAL CON DOS BOTONES LOS CUALES TIENE LOS id=${id}Confirmar y id=${id}Cancelar
 * @param {string} text TEXTO QUE SE DESEA EN LA VENTANA DEL MODAL
 * @param {string} id ID HTML EN DONDE SE DECLARA
 */
export const crearModalConfirmacion = (text, id) => {
  const modalContainer = document.getElementById(id);
  modalContainer.innerText = "";
  const modal = document.createElement("div");
  const modalVentana = document.createElement("div");
  const parrafo = document.createElement("p");
  const modalButton = document.createElement("div");
  const btnConfirmar = document.createElement("button");
  const btnCancelar = document.createElement("button");

  modal.id = id;
  parrafo.textContent = text;
  btnConfirmar.textContent = "Confirmar";
  btnCancelar.textContent = "Cancelar";
  btnConfirmar.id = id + "Confirmar";
  btnCancelar.id = id + "Cancelar";

  modal.className = "modal";
  modalVentana.className = "modal__ventana";
  parrafo.className = "modal__parrafo";
  modalButton.className = "modal__botones";
  btnConfirmar.className = "modal__btnConfirmar";
  btnCancelar.className = "modal__btnCancelar";

  modalButton.appendChild(btnConfirmar);
  modalButton.appendChild(btnCancelar);
  modalVentana.appendChild(parrafo);
  modalVentana.appendChild(modalButton);
  modal.appendChild(modalVentana);
  modalContainer.appendChild(modal);
};
