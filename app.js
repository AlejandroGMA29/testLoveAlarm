$(document).ready(function() {
    var watchId = null; // Variable para almacenar el ID del seguimiento de la ubicación
    var ultimaUbicacion = null; // Variable para almacenar la última ubicación del usuario

    // Función para obtener la distancia entre dos puntos dadas sus coordenadas
    function calcularDistancia(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radio de la Tierra en kilómetros
        var dLat = (lat2 - lat1) * Math.PI / 180; // Diferencia de latitud en radianes
        var dLon = (lon2 - lon1) * Math.PI / 180; // Diferencia de longitud en radianes
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distancia en kilómetros
        return d * 1000; // Convertir la distancia a metros
    }

    // Función para mostrar la ubicación en pantalla y en la consola
    function mostrarUbicacionEnPantalla(latitude, longitude, hora) {
        // Agregar marcador al mapa
        var mapa = $('#map');
        mapa.append('<p>Nueva ubicación: Latitud ' + latitude + ', Longitud ' + longitude + ' (Actualizado a las ' + hora + ')</p>');
        
        // Agregar entrada a la lista de ubicaciones
        var ubicaciones = $('#ubicaciones');
        ubicaciones.append('<div class="ubicacion">Latitud: ' + latitude + ', Longitud: ' + longitude + ' (Actualizado a las ' + hora + ')</div>');

        // Mostrar en la consola
        console.log("Nueva ubicación: Latitud " + latitude + ", Longitud " + longitude + " (Actualizado a las " + hora + ")");
    }

    // Función para obtener la ubicación actual y actualizar la variable de última ubicación si la distancia es mayor a 2 metros
    function obtenerUbicacion(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var hora = new Date().toLocaleTimeString(); // Obtener la hora actual
        
        // Si es la primera ubicación o la distancia a la última ubicación es mayor a 2 metros
        if (!ultimaUbicacion || calcularDistancia(ultimaUbicacion.latitude, ultimaUbicacion.longitude, latitude, longitude) > 2) {
            ultimaUbicacion = {latitude: latitude, longitude: longitude}; // Actualizar la última ubicación
            mostrarUbicacionEnPantalla(latitude, longitude, hora); // Mostrar la ubicación en pantalla
        }
    }

    // Solicitar permiso para acceder a la ubicación del usuario al cargar la página
    navigator.geolocation.getCurrentPosition(function(position) {
        // Manejar la respuesta del usuario (permiso otorgado o denegado)
        // No es necesario hacer nada aquí, ya que la función de envío del formulario se encargará de iniciar el seguimiento de la ubicación
    });

    // Manejar el envío del formulario
    $('#formulario').submit(function(event) {
        event.preventDefault(); // Evitar que se recargue la página al enviar el formulario
        
        var nombreUsuario = $('#nombreUsuario').val();
        alert('¡Hola ' + nombreUsuario + '! Se empezará a seguir tu ubicación.');
        
        // Obtener la primera ubicación
        navigator.geolocation.getCurrentPosition(function(position) {
            obtenerUbicacion(position); // Actualizar la variable de última ubicación
            watchId = navigator.geolocation.watchPosition(obtenerUbicacion); // Empezar a seguir la ubicación del usuario
        });
    });
});
