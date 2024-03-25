$(document).ready(function() {
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

    // Función para obtener la ubicación actual y compararla con la última ubicación cada 30 segundos
    function obtenerUbicacionYComparar() {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var hora = new Date().toLocaleTimeString(); // Obtener la hora actual

            // Si es la primera ubicación o la distancia a la última ubicación es mayor a 2 metros
            if (!ultimaUbicacion || calcularDistancia(ultimaUbicacion.latitude, ultimaUbicacion.longitude, latitude, longitude) > 2) {
                // Mostrar la ubicación en pantalla
                mostrarUbicacionEnPantalla(latitude, longitude, hora);
                // Actualizar la última ubicación
                ultimaUbicacion = {latitude: latitude, longitude: longitude};
            }
        });
    }

    // Solicitar permiso para acceder a la ubicación del usuario al cargar la página
    navigator.geolocation.getCurrentPosition(function(position) {
        // Obtener la primera ubicación y compararla con la última
        obtenerUbicacionYComparar();
    });

    // Manejar el envío del formulario
    $('#formulario').submit(function(event) {
        event.preventDefault(); // Evitar que se recargue la página al enviar el formulario
        
        var nombreUsuario = $('#nombreUsuario').val();
        alert('¡Hola ' + nombreUsuario + '! Se seguirá tu ubicación cada 30 segundos.');

        // Iniciar la comparación de ubicaciones cada 30 segundos
        setInterval(function() {
            obtenerUbicacionYComparar();
            mostrarUbicacionEnPantalla(ultimaUbicacion.latitude, ultimaUbicacion.longitude, new Date().toLocaleTimeString());
        }, 30000);

    });
});
