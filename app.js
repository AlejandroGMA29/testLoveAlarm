// Esperamos a que el DOM esté cargado
$(document).ready(function () {
    // Escuchamos el evento de clic del botón
    $("#btnUbicacion").click(function () {
        // Llamar a la función para comenzar a seguir la ubicación
        seguirUbicacion();
    });
});

var latitudG = null;
var longitudG = null;

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
                } else {
                    var distancia = calcularDistancia(latitudG, longitudG, latitud, longitud);
                    if (distancia > 2) {
                        alert("La distancia es mayor a 2: " + distancia);
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
