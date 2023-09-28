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
 * mismos valores para las claves detalladas en el array.
 *
 * @param {Array} array array donde deseo comparar a element
 * @param {Object || Array} elemento objeto que deseo buscar en array
 * @param {Array} claves array con las claves que deseo comprar entre array y objeto
 * @returns {number} retorn el index en array si se encuentra un element que posea mismo valores para las claves detalladas en el array claves
 */
export const buscarKeyValue = (array, elemento, claves) => {
  const index = array.findIndex((objArray) => {
    // verifico si es un array
    if (Array.isArray(elemento)) {
      console.log("constinuar construyendo...");
      // si no es un array es un objeto
    } else {
      return claves.every(
        (key) => elemento[key].toLowerCase() == objArray[key].toLowerCase()
      );
    }
  });

  return index;

  // // si element es un objeto
  // if (Array.isArray(elemento)) {
  //   const index = array.findIndex(() => {
  //     console.log('continuar construyendo');
  //   })
  //   // si da false entonces es un objeto
  // } else {
  //   const index = array.findIndex((objArray) => {
  //     return claves.every(key => elemento[key] == objArray[key])
  //   })
  // }
  // return index
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
          return claves.some(clave => objNuevo[clave] === objUsuario[clave]);
      }
    });

    if (coincidencias.length > 0) {
      objetosRepetidos.push(objNuevo);
      const clavesRepetidasPorObjeto = claves.filter(clave => {
        return coincidencias.some(objUsuario => objUsuario[clave] === objNuevo[clave]);
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
 * funcion que busca un elemento en un array para determinar si para una clave dada (en el array claves) existe //!AL MENOS UNO
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
        if (
          typeof elemento[key] === "number" &&
          typeof objArray[key] === "number"
        ) {
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

// /**
//  * RETORNA UN ARRAY: BUSCA UN ELEMENTO EN UN ARRAY POR ID Y LO ELIMINA SI LO ENCUENTRA
//  * @param {Array} array ARRAY DEL CUAL QUIERES ELIMINAR EL ELEMENTO
//  * @param {Object | Array} elemento OBJETO O ARRAY QUE DESEAS ELIMINAR DEL ARRAY
//  * @returns {Array} EL ARRAY SIN EL ELEMENTO
//  */
// export const eliminarElementoArray = (array, elemento) => {
//   // Verifica si elemento es un array
//   if (Array.isArray(elemento)) {
//     // Filtra el array para mantener solo los elementos que no están en elemento
//     return array.filter(objArray => !elemento.some(objElemento => objElemento.id === objArray.id));
//   } else {
//     // Si no es un array elemento es un objeto. Busco por ID en el array para eliminarlo
//     return array.filter(objeto => objeto.id !== elemento.id);
//   }
// }

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

    default:
      input.type = "text";
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
 * @param {*} idTabla id de la tabla que posee en el HTML
 * @param {*} array donde se almacenan los datos mostradoss en la tabla
 * @param {*} variableLS clave para almacenar los datos en el LS para la variable arrray
 * @param {*} arrayClavesNoRepetir  array con las claves que se deben validar para modificar un elemento
 * @param {*} ordenArray array con las claves en orden de como se desea ordena la tabla 
 */
export const modificarDatosTablas = (e, idTabla, array, variableLS, arrayClavesNoRepetir, ordenArray) => {

  // guardo en una variable la tabla sobre la que hare modificaciones
  const tabla = document.getElementById(idTabla);
  
  // creo la variable pAlert para ver si ya fue creado en el DOM
  const pAlert = document.getElementById(`${idTabla}MsjAlert`)
  
  // si pAlert no existe en el DOM entonces creo a <p></p>
  if (!pAlert) {
    // creacion de etique <p></p> para creacion de mensaje de alerta relacionada a la tabla
    const p = document.createElement("p");
    p.classList.add("msjAlerta", "oculto");
    p.id = `${idTabla}MsjAlert`;
    tabla.appendChild(p);
  }

  // variable locales
  // variable aux para saber si presione un boton de eliminar o modificar para borrar el que no corresponde
  // se almacenan en sesion storage dado que en cada click la variable se inicializa
  // let eliminarBtn = JSON.parse(sessionStorage.getItem('eliminarBtn')) || false; 
  // let eliminarBtn = false;
  
  // variable para guardar las filas correspondientes al botones presionado
  // se almacenan en sesion storage dado que en cada click la variable se inicializa
  // let trModificado = JSON.parse(sessionStorage.getItem('trModificado')) || [];
  // let trModificado = [];

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
      const btn = document.getElementById(`${idTabla}AceptarBtn`);
      const a = `${idTabla}AceptarBtn`
      document.getElementById(`${idTabla}AceptarBtn`).classList.remove('oculto')
      document.getElementById(`${idTabla}DescartarBtn`).classList.remove('oculto')
      btnClick.classList.add("oculto");

      if (!eliminarBtn) {
        eliminarColumna(idTabla , encontrarCelda(idTabla , "eliminar"));
        eliminarBtn = true;
        // sessionStorage.setItem('eliminarBtn',JSON.stringify(eliminarBtn))
      }

      // guardo en una variable la fila correspondiente al boton presionado
      const tr = btnClick.closest("tr");
      trModificado.push(tr);
      sessionStorage.setItem('trModificado',JSON.stringify(trModificado))

      // agrego la clase modificado a la fila correspondiente al boton seleccionado
      tr.classList.add("modificando");

      // guardo los td correspondiente a la fila
      const tdNodeList = tr.querySelectorAll("td");
      // por cada celda agrego un input segun el tipo de dato
      tdNodeList.forEach((td, index) => {
        const value = td.textContent;
        switch (key[index]) {
          case "id":
          case undefined:
            break;
          case "password":
            td.textContent = "";
            const inputPass = creacionInput(key[index]);
            td.appendChild(inputPass);
            inputPass.value = value;
            break;
          case "fechanacimiento":
            td.textContent = "";
            const inputDate = creacionInput(key[index]);
            td.appendChild(inputDate);
            inputDate.value = value;
            break;
          case "email":
            td.textContent = "";
            const inputEmail = creacionInput(key[index]);
            td.appendChild(inputEmail);
            inputEmail.value = value;
            break;
          case "admin":
            td.textContent = "";
            const selectAdmin = crearSelect(["true", "false"]);
            td.appendChild(selectAdmin);
            selectAdmin.value = value;
            break;
          default:
            td.textContent = "";
            const inputText = creacionInput(key[index]);
            td.appendChild(inputText);
            inputText.value = value;
            break;
        }
      });

      console.log(trModificado);
      console.log(eliminarBtn);


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
              default:
                objetoModificado[key[index]] = td.firstChild.value;
                break;
            }
          });
          arrayNuevosDatos.push(objetoModificado);
        });

        // verifico que todos los datos esten completos
        const datoVacio = arrayNuevosDatos.some((objeto) => {
          return Object.values(objeto).some((value) => value == "");
        });

        if (datoVacio) {
          crearAlerta("Todos los datos son OBLIGATORIOS", `${idTabla}MsjAlert`);
        } else {
          // verifico que los datos nuevos ingresados no esten repetidos con otros usuarios
          const { objetosRepetidos, clavesRepetidas } = buscarDatosRepetidos(arrayNuevosDatos, array, arrayClavesNoRepetir);
          // si objetoRepetiidos esta vacio los datos son validos
          if (objetosRepetidos.length != 0) {
            crearAlerta(`El ${clavesRepetidas[0][0].toUpperCase()}: ${objetosRepetidos[0][clavesRepetidas[0]]} ya se encuentra registrado`,`${idTabla}MsjAlert`);
          } else {
            // verifico los datos modificado no esten repetidos entre ellos.
            const { objetosRepetidos: objIngresadoRepetidos, clavesRepetidas: clavesValoresRepetidos  } = buscarDatosRepetidos(arrayNuevosDatos, arrayNuevosDatos, arrayClavesNoRepetir);
            if (objIngresadoRepetidos.length != 0) {
              crearAlerta(`El ${clavesValoresRepetidos[0][0].toUpperCase()}: ${objIngresadoRepetidos[0][clavesValoresRepetidos[0]]} fue utilizado en varias modificaciones`,`${idTabla}MsjAlert`);
            } else {
              // modifico el array. Busco los objetos en array y los reemplazo con los nuevos valores
              array = buscarYReemplazarID(array, arrayNuevosDatos);
              // ordeno el array
              ordenarArray(array, ordenArray);
              // guardo en Local Storage
              localStorage.setItem(variableLS, JSON.stringify(array));
              // oculto los botones
              document.getElementById(`${idTabla}AceptarBtn`).classList.add('oculto')
              document.getElementById(`${idTabla}DescartarBtn`).classList.add('oculto')
              // actualizo la tabla con los nuevos valores
              tablaHorizontal(array, idTabla);
              // vuelvo a inicializar las variables
              trModificado = [];
              eliminarBtn = false;
              // sessionStorage.clear();
            }
          }
        }
      };
    }

    if (btnClick.getAttribute("data-id") == "eliminar") {
      // muestro los botones correspondientes a eliminar
      document.getElementById(`${idTabla}EliminarBtn`).classList.remove('oculto')
      document.getElementById(`${idTabla}DescartarBtn`).classList.remove('oculto')
      btnClick.classList.add("oculto");

      // si presione eliminar, borro todos los botones de mnodificar de la tabla
      if (!eliminarBtn) {
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

      // confirmacion que se desea eliminar el usuario y creacion de modal
      document.getElementById(`${idTabla}EliminarBtn`).onclick = () => {
        // creo un modal para la confirmacion
        const divModal = document.createElement('div');
        divModal.id = `${idTabla}Modal`;
        tabla.appendChild(divModal);
        crearModalConfirmacion("¿Esta seguro que desea ELIMINAR los USUARIOS seleccionados? SITUACION IRREVERSIBLE", `${idTabla}Modal`);
        // confirmacion en modal de aceptar borrar usuarios
        document.getElementById(`${idTabla}ModalConfirmar`).onclick = () => {
          array = eliminarElementoArray(array, auxKeyEliminar);
          ordenarArray(array, ordenArray);
          localStorage.setItem(variableLS, JSON.stringify(array));
          divModal.remove();
          tablaHorizontal(array, idTabla);
          document.getElementById(`${idTabla}EliminarBtn`).classList.add('oculto')
          document.getElementById(`${idTabla}DescartarBtn`).classList.add('oculto')
          eliminarBtn = false;
          auxKeyEliminar = [];
          // sessionStorage.clear();
        };
        // cancelo la baja en modal
        document.getElementById(`${idTabla}ModalCancelar`).onclick = () => {
          divModal.remove();
        };
      };
    }

    // decarto cualquier cambio realizado (modificacion o eliminar)
    document.getElementById(`${idTabla}DescartarBtn`).onclick = () => {
      document.getElementById(`${idTabla}EliminarBtn`).classList.add("oculto");
      document.getElementById(`${idTabla}AceptarBtn`).classList.add('oculto')
      document.getElementById(`${idTabla}DescartarBtn`).classList.add('oculto')
      tablaHorizontal(array, idTabla);
      eliminarBtn = false;
      auxKeyEliminar = [];
      trModificado = [];
      // sessionStorage.clear();
    };
  }
};
