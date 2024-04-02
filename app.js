const firebaseConfig = {
  apiKey: "AIzaSyDRySH20RBkB_oEDqOuJyNpKqmVtv-sEfY",
  authDomain: "lovealarm-ca997.firebaseapp.com",
  databaseURL: "https://lovealarm-ca997-default-rtdb.firebaseio.com",
  projectId: "lovealarm-ca997",
  storageBucket: "lovealarm-ca997.appspot.com",
  messagingSenderId: "781543481797",
  appId: "1:781543481797:web:5003ba49c069cb1ebf6bac",
  measurementId: "G-W7S775858C",
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
// Referencia a la base de datos de Firebase
const database = firebase.database();

var latitudGSeleccion = null;
var longitudGSeleccion = null;
var latitudG = null;
var longitudG = null;
var valorSeleccionado = null;
// Esperamos a que el DOM esté cargado
$(document).ready(function () {
  
  obtenerUsuariosDisponibles();
  // Escuchamos el evento de clic del botón
  $("#btnUbicacion").click(function () {
    // Llamar a la función para comenzar a seguir la ubicación
    seguirUbicacion();
  });

  $("#ubicaciones").change(function () {
     valorSeleccionado = $('input[name="usuarioSeleccionado"]:checked').val();
    console.log("El usuario seleccionado es: " + valorSeleccionado);
    // Referencia al nodo del usuario seleccionado
    const usuarioRef = database.ref("usuarios/" + valorSeleccionado);
    // Escucha cambios en los datos del usuario seleccionado
    usuarioRef.on("value", function (snapshot) {
        
        // Obtiene los datos del usuario seleccionado
        const usuario = snapshot.val();
        
        // Comprueba si el usuario existe
        if (usuario) {
            console.log("Datos del usuario seleccionado:", usuario);
            console.log(usuario.lat)
            if((usuario.lat != latitudGSeleccion || usuario.lng != longitudGSeleccion) && (latitudGSeleccion != null && longitudGSeleccion != null)) {
                console.log("actualizo")
                latitudGSeleccion = usuario.lat;
                longitudGSeleccion = usuario.lng;
            }  else{
                console.log("primera inserccion")
                latitudGSeleccion = usuario.lat;
                longitudGSeleccion = usuario.lng;
            }

            var distanciaSeparado = calcularDistancia(latitudG,longitudG,latitudGSeleccion,longitudGSeleccion)
            console.log("separacion: ",distanciaSeparado)
            if(distanciaSeparado < 10){
                alert("en menos de 10 metros, una persona te quiere");
                console.log(distanciaSeparado)
            }
        
            // Aquí puedes hacer lo que necesites con los datos del usuario
        } else {
            console.log("El usuario seleccionado no existe.");
        }
    });
  });



});

// Función para obtener la lista de usuarios disponibles
function obtenerUsuariosDisponibles(nombreUsuarioActual) {
    
  const usuariosDisponiblesRef = database.ref("usuarios");

  // Escucha los cambios en la lista de usuarios
  usuariosDisponiblesRef.on("value", function (snapshot) {
    const usuariosDisponibles = snapshot.val();
    // Borra la lista de usuarios disponibles actual para actualizarla
    // Itera sobre cada usuario y agrega un radio button para seleccionarlo
    $("#ubicaciones").empty();
    for (let usuario in usuariosDisponibles) {
      if (usuario !== nombreUsuarioActual) {
        // Excluir tu propio usuario
        const nombre = usuario;
        const ubicacion = usuariosDisponibles[usuario];
        console.log(nombre);
        
        $("#ubicaciones").append(
          `<input type="radio" name="usuarioSeleccionado" id="${nombre}" value="${nombre}"> ${nombre}`
        );
      }
    }
    $("#"+ valorSeleccionado).prop('checked',true);
  });
}

// Función para seguir constantemente la ubicación del usuario
function seguirUbicacion() {
  if (navigator.geolocation) {
    // El navegador soporta geolocalización
    var watchId = navigator.geolocation.watchPosition(
      function (position) {
        // Éxito: Se obtuvo la posición del usuario
        var latitud = position.coords.latitude;
        var longitud = position.coords.longitude;

        if (latitudG == null || longitudG == null) {
          latitudG = latitud;
          longitudG = longitud;
          nombre = $("#nombreUsuario").val();
          var ubicacion = {
            lat: latitudG,
            lng: longitudG,
          };
          database.ref("usuarios/" + nombre).set(ubicacion);
          $("#ubicaciones").empty();
          obtenerUsuariosDisponibles();
        } else {
            console.log("global: ",latitudG)
            console.log("global: ",longitudG)
            console.log("nueva: ",latitud)
            console.log("nueva: ",longitud)
          var distancia = calcularDistancia(
            latitudG,
            longitudG,
            latitud,
            longitud
          );
          if (distancia > 0.5) {
            nombre = $("#nombreUsuario").val();
            var ubicacion = {
              lat: latitudG,
              lng: longitudG,
            };
            database.ref("usuarios/" + nombre).set(ubicacion);
            $("#ubicaciones").empty();
            obtenerUsuariosDisponibles();
          }
          latitudG = latitud;
          longitudG = longitud;
        }

        // Aquí puedes hacer lo que necesites con la latitud y longitud obtenidas
        console.log("Latitud: " + latitudG + ", Longitud: " + longitudG);
      },
      function (error) {
        // Error al obtener la posición del usuario
        console.error("Error al obtener la ubicación: " + error.message);
      }
    );
  } else {
    // El navegador no soporta geolocalización
    console.error("Geolocalización no es soportada por este navegador.");
  }
}

// Función para calcular la distancia entre dos puntos (fórmula de Haversine)
function calcularDistancia(lat1, lon1, lat2, lon2) {
  var R = 6371e3; // Radio de la Tierra en metros
  var φ1 = (lat1 * Math.PI) / 180; // Convertimos a radianes
  var φ2 = (lat2 * Math.PI) / 180;
  var Δφ = ((lat2 - lat1) * Math.PI) / 180;
  var Δλ = ((lon2 - lon1) * Math.PI) / 180;

  var a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  var distancia = R * c;
  return distancia;
}

/* function insertarUsuario(nombreUsuario, latitud, longitud) {
  var ubicacion = {
    lat: latitud,
    lng: longitud,
  };
  firebase
    .database()
    .ref("usuarios/" + nombreUsuario)
    .set(ubicacion);
  // Insertar los datos del nuevo usuario
}
 */
