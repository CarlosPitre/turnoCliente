angular.module('app.controllers', [])
  
.controller('sectoresCtrl', function($scope,serverData,sectorService) {
	$scope.Sectores = [];
	loadSectores();

	function loadSectores () {
		var promiseGet = sectorService.getSectores(); 
        promiseGet.then(function (pl) {
            $scope.Sectores = pl.data;
            
        },
        function (errorPl) {
            console.log('failure loading sucursal', errorPl);
        });
	}

	$scope.getEmpresas = function  (sector) {
		console.log(JSON.stringify(sector));
		serverData.json = sector;
	}

})
   
.controller('sucursalesCtrl', function($scope,serverData,sectorService) {

	$scope.Servicios = [];
	loadServicios();
	$scope.idServicio = '';

	function ObtenerPosicion () {
		if (navigator.geolocation) {
        	navigator.geolocation.getCurrentPosition(function(position) {
        	var pos = {
            	lat: position.coords.latitude,
            	lng: position.coords.longitude
        	};
        	map = new google.maps.Map(document.getElementById('map'), {
		    	center: pos,
		    	zoom:  14
		  	});
        	lat = JSON.stringify(pos.lat)
        	long = JSON.stringify(pos.lng)
        	var geocoder = new google.maps.Geocoder;
        	var infowindow = new google.maps.InfoWindow;
        	geocodeLatLng(geocoder,lat,long, map);

	        },function() {
	            handleLocationError(true, infoWindow, map.getCenter());
	        });
	    }else{
	    	console.log("error Geo");
	    	handleLocationError(false, infoWindow, map.getCenter());
	    }
	}

	function geocodeLatLng(geocoder,lat,long, map) {
  		var latlng = {lat: parseFloat(lat), lng: parseFloat(long)}
  		geocoder.geocode({'location': latlng}, function(results, status) {
    		if (status === google.maps.GeocoderStatus.OK) {
      			if (results[1]) {
		        	var city = results[2].address_components[1].long_name;
		        	console.log(city);   
		        	console.log(lat);
		        	console.log(long);    
		        	var promiseGet = sectorService.getSucursalesByCiudad($scope.idServicio,city,lat,long); 
			        promiseGet.then(function (pl) {
			            $scope.Sucursales = pl.data; 
			            addMarker(latlng,map);   
			        },
			        function (errorPl) {
			            console.log('failure loading sucursal', errorPl);
			        });
      			} else {
        			window.alert('No results found');
      			}
    		} else {
      			window.alert('Geocoder failed due to: ' + status);
    		}
 		});
	}

	function addMarker(location, map) {
		var indice = 1;
		var marker = new google.maps.Marker({
			position: location,
			icon: {
			  path: google.maps.SymbolPath.CIRCLE,
			  scale: 7, //tamaño
			  strokeColor: '#00f', //color del borde
			  strokeWeight: 1, //grosor del borde
			  fillColor: '#00f', //color de relleno
			  fillOpacity:1// opacidad del relleno
			},
			map: map
		});
		for (var i = 0; i < $scope.Sucursales.length; i++) {
			indice = i + 1;
			location = {lat: parseFloat($scope.Sucursales[i].latitud), lng: parseFloat($scope.Sucursales[i].longitud)}
			var marker = new google.maps.Marker({
				position: location,
				label : indice.toString(),
				map: map
			});
		};
	}

	function loadServicios () {
		var promiseGet = sectorService.getServicios(serverData.json.id); 
        promiseGet.then(function (pl) {
            $scope.Servicios = pl.data; 
            $scope.idServicio = $scope.Servicios[0].id;   
            ObtenerPosicion()        
        },
        function (errorPl) {
            console.log('failure loading sucursal', errorPl);
        });
	}

})
   
.controller('misTunosCtrl', function($scope) {

})
      
.controller('editarPerfilCtrl', function($scope) {

})
 