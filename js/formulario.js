const arrayHeaders = new Array("ID","MODELO","AÑO FABRIACION","VELOCIDAD MAXIMA","ALTURA MAXIMA","AUTONOMIA","PUERTAS","RUEDAS");
let filtroSelected = document.getElementById('filtro-tabla-vehiculos');
let btnCalcularVelocidadPromedio = document.getElementById("btnCalcularVelocidadPromedio");
let btnAgregar = document.getElementById("btnAgregar");
let btnAlta = document.getElementById("btnAlta");
let btnModificar = document.getElementById("btnModificar");
let btnEliminar = document.getElementById("btnEliminar");
let btnCancelar = document.getElementById("btnCancelar");
let formAlta = document.getElementById("form-alta");
let esAlta = 1; //1 es alta, 0 es modificacion y -1 es eliminar
let tabla = document.getElementById("tabla-vehiculos");
let tipoVehiculoSelect = document.getElementById("tipo-vehiculo");
let checkboxContainer = document.getElementById("checkbox-div");

window.addEventListener("load", agregarDatos);

//CLICK EN BOTON velMax
btnCalcularVelocidadPromedio.addEventListener("click", calcularVelocidadPromedio);

//CAMBIE EL FILTRO
filtroSelected.addEventListener("change", function() {
    agregarDatos();
});

//AGREGAR DATOS A LA TABLA
function agregarDatos() {
    let filtro = filtroSelected.value;

    limpiarTabla(tabla);
    tabla.appendChild(crearTabla(arrayVehiculos,filtro));
}
 
function limpiarTabla(tabla){
    let velocidadPromedioTxt = document.getElementById("velocidadPromedioTxt");
    velocidadPromedioTxt.value = 0;

    while (tabla.firstChild) {
        tabla.removeChild(tabla.firstChild);
    }
}

//SE CREAN LOS CHECKBOXES
arrayHeaders.map(headerName => {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = obtenerNombreCampo(headerName) + "Chk";
    //console.log(checkbox.id);

    checkbox.checked = true;
    checkbox.addEventListener("change", function () {
        agregarDatos();
    });

    let label = document.createElement("label");
    label.textContent = headerName;
    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);
});


function crearTabla(arrayVehiculos, filtro) {
    const tabla = document.createElement("table");
    tabla.setAttribute("id", "tablaVehiculos");
    tabla.appendChild(crearCabecera(filtro));
    crearCuerpo(arrayVehiculos, tabla,filtro);
    return tabla;
}

function obtenerNombreCampo(header){

    switch(header){
        case 'AÑO FABRIACION':
            return 'anoFab';
        case 'VELOCIDAD MAXIMA':
            return 'velMax';
        case 'ALTURA MAXIMA':
            return 'altMax';
        case 'PUERTAS':
            return 'cantPue';
        case 'RUEDAS':
            return 'cantRue';
        default:
            return header.toLocaleLowerCase().toString(); 
    }

}

function crearCabecera(filtro) {
    let tHead = document.createElement("thead");
    let headRow = document.createElement("tr");
    arrayHeaders.forEach(header => {
        let headerAux = obtenerNombreCampo(header);
        switch(filtro){
            case 'terrestres':
                if(header != 'ALTURA MAXIMA' && header != 'AUTONOMIA' &&
                (document.getElementById(headerAux+ "Chk")).checked){
                    headRow.appendChild(crearTh(header));
                }
                break;
            case 'aereos':
                if(header != 'PUERTAS' && header != 'RUEDAS' &&
                (document.getElementById(headerAux+ "Chk")).checked){
                    headRow.appendChild(crearTh(header));
                }
                break;
            default:
                if((document.getElementById(headerAux+ "Chk")).checked){
                    headRow.appendChild(crearTh(header));
                }
                break;
        }
    });

    tHead.appendChild(headRow);
    return tHead;
}

function crearTh(header){
    let th = document.createElement("th");
    let button = document.createElement("button");
    th.setAttribute("class","thVehiculo");
    // th.textContent = header;
    button.textContent = header;
    th.appendChild(button);
    
    button.addEventListener("click", () => ordenarTablaPorColumna(obtenerNombreCampo(header))); 

    return th;     
}

function crearCuerpo(data, tabla, filtro) {
    let tBody = document.createElement('tbody');

    tBody.setAttribute("id", "table-tbody");

    data.forEach(vehiculo => {
        let dataFiltrada = filtrarData(data,vehiculo,filtro);
        if(dataFiltrada.length){
            CrearFila(dataFiltrada, tBody);
        }
    });

    tabla.appendChild(tBody);
}

function filtrarData(data, vehiculo, filtro){
    const columnasData = new Array();

    if((filtro != 'terrestres' && vehiculo instanceof Aereo) || (filtro != 'aereos' && vehiculo instanceof Terrestre)){

        if((document.getElementById("idChk")).checked)
            columnasData.push( {data: vehiculo.id} )

        if((document.getElementById("modeloChk")).checked)
            columnasData.push( {data: vehiculo.modelo} )

        if((document.getElementById("anoFabChk")).checked)
            columnasData.push( {data: vehiculo.anoFab} )

        if((document.getElementById("velMaxChk")).checked)
            columnasData.push( {data: vehiculo.velMax} )

        if((document.getElementById("altMaxChk")).checked && filtro != 'terrestres')
            columnasData.push( {data: vehiculo.altMax} )

        if((document.getElementById("autonomiaChk")).checked && filtro != 'terrestres')
            columnasData.push( {data: vehiculo.autonomia} )

        if((document.getElementById("cantPueChk")).checked && filtro != 'aereos')
            columnasData.push( {data: vehiculo.cantPue} )

        if((document.getElementById("cantRueChk")).checked && filtro != 'aereos')
            columnasData.push( {data: vehiculo.cantRue} )
    }
    

    return columnasData;

}


function CrearFila(columnasData, tBody) {
    let fila = document.createElement("tr");
    columnasData.forEach(columnaInfo => {
        let celda = document.createElement("td");
        celda.textContent = columnaInfo.data != null ? columnaInfo.data : "-";
        fila.appendChild(celda);
    });

    tBody.appendChild(fila);
}

//CALCULAR VELOCIDAD PROMEDIO
function calcularVelocidadPromedio() {
    let filtro = filtroSelected.value;
    const vehiculosFiltrados = filtrarLista(filtro,arrayVehiculos); 
    let sumaVelocidad = vehiculosFiltrados.reduce(function(acumulado, vehiculo){

        let velMax = parseInt(vehiculo.velMax);
        if (!isNaN(velMax)) {
            return acumulado + velMax;
        }
        return acumulado;
    }, 0);

    const velocidadPromedioTxt = document.getElementById("velocidadPromedioTxt");
    velocidadPromedioTxt.value = sumaVelocidad / vehiculosFiltrados.length;
}

function filtrarLista(filtro, listadoAFiltrar){
    let listadoFiltrado = listadoAFiltrar;
    switch (filtro) {
      case 'aereos':
        listadoFiltrado = listadoAFiltrar.filter(vehiculo => vehiculo instanceof Aereo);
        break;
      case 'terrestres':
        listadoFiltrado = listadoAFiltrar.filter(vehiculo => vehiculo instanceof Terrestre);
        break;

    }
    return listadoFiltrado;
}

//ABM

tipoVehiculoSelect.addEventListener("change", () => {
    let esAereo = tipoVehiculoSelect.value === "aereo";
    filtrarFormAlta(esAereo);
});

function filtrarFormAlta(esAereo){
    let campoAltMax = document.getElementById('campoAltMax');
    let campoAutonomia = document.getElementById('campoAutonomia');
    let campoCantPue = document.getElementById('campoCantPue');
    let campoCantRue = document.getElementById('campoCantRue');

    if (esAereo) {
        campoAltMax.style.display = 'block';
        campoAutonomia.style.display = 'block';
        
        campoCantPue.style.display = 'none';
        campoCantRue.style.display = 'none';
    } else {
        campoAltMax.style.display = 'none';
        campoAutonomia.style.display = 'none';

        campoCantPue.style.display = 'block';
        campoCantRue.style.display = 'block';
    }

}

function mostrarBotones(esBtnAlta){
    btnAgregar.hidden=true;
    if(esBtnAlta==1){
        btnModificar.hidden=true;
        btnEliminar.hidden=true;
        btnAlta.hidden=false;
        document.getElementById("tipo-vehiculo").disabled = false;

    }else{
        btnModificar.hidden=false;
        btnEliminar.hidden=false;
        btnAlta.hidden=true;
        document.getElementById("tipo-vehiculo").disabled = true;
    }
}

function validarVehiculo(vehiculo){
    
    if(vehiculo.id == null || vehiculo.id < 1 || vehiculo.modelo == null || parseInt(vehiculo.anoFab) < 1886 || vehiculo.velMax < 1){
        return false;
    }else if(vehiculo instanceof Aereo && (vehiculo.altMax == null || vehiculo.altMax < 1 || vehiculo.autonomia == null || vehiculo.autonomia < 1)){
        return false;
    }else if(vehiculo instanceof Terrestre && (vehiculo.cantPue == null || vehiculo.cantPue < 0 || vehiculo.cantRue == null || vehiculo.cantRue < 1)){
        return false;
    }

    return true;
    
}

function modificarTablaYArray(vehiculo) {
    let pIndex;
    if(esAlta != -1 && !validarVehiculo(vehiculo)){ //no importa si los datos estan ok si es Eliminar
        alert("Hubo un problema al cargar el vehiculo. Revisar los datos");
    }else{
        switch(esAlta){
            case 1:
                arrayVehiculos.push(vehiculo);
                break;
            case 0:
                pIndex = arrayVehiculos.findIndex((p) => p.id == vehiculo.id);
                if(pIndex !== -1){
                    arrayVehiculos[pIndex] = vehiculo;
                }else{
                    alert("Hubo un problema al modificar.");
                }
                break;
            case -1:
                pIndex = arrayVehiculos.findIndex((p) => p.id == vehiculo.id);
                arrayVehiculos.splice(pIndex, 1);
                break;
        }
    }
    agregarDatos();
    LimpiarCampos();
    formAlta.hidden = true;
    btnAgregar.hidden=false;
}

function obtenerVehiculoDesdeFormAlta() {
    let tipoVehiculoSelect = document.getElementById("tipo-vehiculo");
    let idTxt = document.getElementById("txtId").value;
    let txtModelo = document.getElementById("txtModelo").value;
    let txtAnoFabriacion = document.getElementById("txtAnoFabriacion").value;
    let txtVelMax = document.getElementById("txtVelMax").value;
    let tipoVehiculo = tipoVehiculoSelect.value;

    if (tipoVehiculo == "aereo") {
        let txtAltMax = document.getElementById("txtAltMax").value;
        let txtAutonomia = document.getElementById("txtAutonomia").value;
        return new Aereo(idTxt, txtModelo, txtAnoFabriacion, txtVelMax, txtAltMax, txtAutonomia);
    } else if (tipoVehiculo == "terrestre") {
        let txtCantPue = document.getElementById("txtCantPue").value;
        let txtCantRue = document.getElementById("txtCantRue").value;
        return new Terrestre(idTxt, txtModelo, txtAnoFabriacion, txtVelMax, txtCantPue, txtCantRue);
    } else {
        return new Vehiculo(idTxt, txtModelo, txtAnoFabriacion, txtVelMax);
    }
}

tabla.addEventListener("dblclick", (e) => {
    e.preventDefault();
    formAlta.hidden = false;

    let filaClickeada = event.target.parentElement; //me trae la table-row
    let idVehiculoClickeado = filaClickeada.querySelector("td:first-child") != null ? filaClickeada.querySelector("td:first-child").textContent : null;    //selecciono el primer elemento de la fila (el id) 
    let id;
    if (idVehiculoClickeado != null) {
        let idTxt = document.getElementById("txtId");
        id = idVehiculoClickeado;
        idTxt.value = id;
    }
    mostrarBotones(false);
    cargarVehiculo(buscarVehiculoPorId(id));
});

//Alta
btnAlta.addEventListener("click", (e) => {
    modificarTablaYArray(obtenerVehiculoDesdeFormAlta());
});

btnAgregar.addEventListener("click", (e) => {
    e.preventDefault();
    esAlta=1;
    formAlta.hidden = false;
    let idTxt = document.getElementById("txtId");
    id = generarNuevoId();  
    idTxt.value = id;  

    mostrarBotones(true);
});

function generarNuevoId(){
    let mayorId = arrayVehiculos.reduce((maxId, vehiculo) => {
        return Math.max(maxId, vehiculo.id);
      }, 0);
    return mayorId + 1;

}

//Modificar
btnModificar.addEventListener("click", (e) => {
    esAlta=0;
    modificarTablaYArray(obtenerVehiculoDesdeFormAlta());
});

function cargarVehiculo(vehiculo) {
    let txtModelo = document.getElementById("txtModelo");
    txtModelo.value = vehiculo.modelo;

    let txtAnoFabriacion = document.getElementById("txtAnoFabriacion");
    txtAnoFabriacion.value = vehiculo.anoFab;

    let velMaxTxt = document.getElementById("txtVelMax");
    velMaxTxt.value = vehiculo.velMax;

    let tipoVehiculoSelect = document.getElementById("tipo-vehiculo");

    if (vehiculo instanceof Aereo) {
        tipoVehiculoSelect.value = 'aereo';
        filtrarFormAlta(true);
        let txtAltMax = document.getElementById("txtAltMax");
        txtAltMax.value = vehiculo.altMax;
        
        let txtAutonomia = document.getElementById("txtAutonomia");
        txtAutonomia.value = vehiculo.autonomia;

    } else if (vehiculo instanceof Terrestre) {
        tipoVehiculoSelect.value = 'terrestre';
        filtrarFormAlta(false);

        let txtCantPue = document.getElementById("txtCantPue");
        txtCantPue.value = vehiculo.cantPue;
        
        let txtCantRue = document.getElementById("txtCantRue");
        txtCantRue.value = vehiculo.cantRue;
    }
}

function buscarVehiculoPorId(id) {
    return arrayVehiculos.filter(vehiculo => vehiculo.id == id)[0];
}

//Eliminar
btnEliminar.addEventListener("click", (e) => {
    esAlta=-1;
    modificarTablaYArray(obtenerVehiculoDesdeFormAlta());
});


//Cancelar
btnCancelar.addEventListener("click", (e) => {
    formAlta.hidden=true;
    LimpiarCampos();
});

function LimpiarCampos(){

    let txtModelo = document.getElementById("txtModelo");
    txtModelo.value = "";
    let txtAnoFabriacion = document.getElementById("txtAnoFabriacion");
    txtAnoFabriacion.value = "";
    let velMaxTxt = document.getElementById("txtVelMax");
    velMaxTxt.value = "";
    let tipoVehiculoSelect = document.getElementById("tipo-vehiculo");
    tipoVehiculoSelect.value = 'aereo';
    let txtAltMax = document.getElementById("txtAltMax");
    txtAltMax.value = "";
    let txtAutonomia = document.getElementById("txtAutonomia");
    txtAutonomia.value = "";
    let txtCantPue = document.getElementById("txtCantPue");
    txtCantPue.value = "";
    let txtCantRue = document.getElementById("txtCantRue");
    txtCantRue.value = "";

}


//ORDENAR TABLA
function ordenarTablaPorColumna(columna) {
    let tipoColumna = obtenerTipoColumna(columna);

    arrayVehiculos.sort((a,b) =>{
        let valorA = tipoColumna === "number" ? parseFloat(a[columna]) : a[columna];
        let valorB = tipoColumna === "number" ? parseFloat(b[columna]) : b[columna];
        if(valorA > valorB){
            return 1;
        }else if(valorA < valorB){
            return -1;
        }else{
            return 0;
        }

    });

    agregarDatos();
}

function obtenerTipoColumna(columna) {
    switch (columna) {
        case "id":
        case "velMax":
        case "cantPue":
        case "cantRue":
        case "altMax":
        case "autonomia":
            return "number";
        default:
            return "string";
    }
}
