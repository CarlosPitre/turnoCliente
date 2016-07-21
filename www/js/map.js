//clase Poligono
function Poligono() {
   this.coordenadas = null;
   this.marcador = null;
}


//variables globales
var Mapa;
var vecPoligono = new Array();
var pol = null;

function mapa(){
    var contenedor = document.getElementById("mapa");
    var centro = new google.maps.LatLng(10.469201834901309, -73.25340270996094);
    var propiedades =
    {
        zoom: 14,
        center: centro,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(contenedor, propiedades);
    
    google.maps.event.addListener(map, "click", function(evento) {
         
         var latitud = evento.latLng.lat();
         var longitud = evento.latLng.lng();
         var coordenadas = new google.maps.LatLng(latitud, longitud);

         var marcador = new google.maps.Marker(
             {
                 position: coordenadas,
                 map: map, 
                 animation: google.maps.Animation.DROP, 
                 title:"marcador"
             }
         );
        
         var po = new Poligono();
         po.coordenadas = coordenadas;
         po.marcador = marcador;

        vecPoligono.push(po);
        
        //dibujarPoligono();
     }); 
    
    Mapa = map;
    
}

function dibujarPoligono(){
    var puntos = [];
    for(var i = 0; i < vecPoligono.length; i++){
        puntos.push(vecPoligono[i].coordenadas);
    }
    
    if(pol != null){
        pol.setMap(null);
    }
    
    pol = new google.maps.Polygon({
        paths: puntos,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    });

    pol.setMap(Mapa);
}

function limpiar(){
    while(vecPoligono.length > 0) {
        vecPoligono[vecPoligono.length-1].marcador.setMap(null);
        vecPoligono.pop();
    }
    dibujarPoligono();
}

function eliminarUltimoPunto(){
    vecPoligono[vecPoligono.length-1].marcador.setMap(null);
    vecPoligono.pop();
    dibujarPoligono();
}





