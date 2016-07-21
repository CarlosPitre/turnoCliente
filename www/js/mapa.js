var marker = null;
var localizacion = null;
var latitud = null;
var longuitud = null;
var infoWindow;
var geocoder;
//var map;
///SALVATORE1982

function initMap() {

  map = new google.maps.Map(document.getElementById('mapa'), {
	  center: {lat: -34.397, lng: 150.644},
	  zoom: 14
	});
  
  geocoder = new google.maps.Geocoder();

	//var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  	if (navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position) {
	    var pos = {
	    	lat: position.coords.latitude,
	      lng: position.coords.longitude
	    };

      	//infoWindow.setPosition(pos);
      	//infoWindow.setContent('Esta es tu ubicación actual');
      	map.setCenter(pos);
    },function() {
      	handleLocationError(true, infoWindow, map.getCenter());
    });
  	}else{
    	handleLocationError(false, infoWindow, map.getCenter());
  	}

  	google.maps.event.addListener(map, 'click', function(event) {
    	addMarker(event.latLng, map);
      //infoWindow = new google.maps.InfoWindow({map: map});
      latitud = localizacion.lat()
      longuitud = localizacion.lng()
      //alert(JSON.stringify(localizacion.lat()));
  	});
}

var labels = 'A';
var labelIndex = 0;
var cont = 0;

function addMarker(location, map) {
  // Add the marker at the clicked location, and add the next-available label
    if(marker!=null){
        marker.setMap(null);
    }
    //infoWindow = new google.maps.InfoWindow({map: map});
    localizacion = location;
    marker = new google.maps.Marker({
        position: location,
        label: labels[labelIndex++ % labels.length],
        map: map
    });
    //alert(cont)
    cont = cont + 1;

  // from the array of alphabetical characters.
   
  //alert(JSON.stringify(localizacion));
}

function initMap1() {
  
    map = new google.maps.Map(document.getElementById('map1'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 14
    });

    //infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          //infoWindow.setPosition(pos);
          //infoWindow.setContent('Esta es tu ubicación actual');
            map.setCenter(pos);
        },function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
      }else{
        handleLocationError(false, infoWindow, map.getCenter());
      }

    /*google.maps.event.addListener(map, 'click', function(event) {
      addMarker(event.latLng, map);
    });*/  
  
}

function geocodeAddress(geocoder, resultsMap,address) {
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
        
      resultsMap.setCenter(results[0].geometry.location);
        addMarker(results[0].geometry.location,resultsMap);
        latitud = results[0].geometry.location.lat();
        longuitud = results[0].geometry.location.lng();
        console.log(results[0].geometry.location)
        //alert(results[0].geometry.location.lng());
    } else {
      alert('No se a agregado una dirección fisica: ' + status);
    }
  });
}

function GetLocation(direccion){
    geocodeAddress(geocoder,map,direccion);

}

