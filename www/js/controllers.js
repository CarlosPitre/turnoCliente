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
		sessionStorage.setItem('jsonSector',JSON.stringify(sector));
		serverData.json = sector;
	}

})

.controller('sucursalesCtrl', function($scope,serverData,sectorService,$timeout) {

	$scope.Servicios = [];
	loadServicios();
	$scope.data = {};

	function ObtenerPosicion () {
		var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
    var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
		navigator.geolocation.getCurrentPosition(function(pos) {
		    map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
		    var myLocation = new google.maps.Marker({
		        position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
		        map: map,
		        title: "My Location"
			  });
				$scope.lat = pos.coords.latitude;
				$scope.long = pos.coords.longitude;
				$scope.map = map;
				var geocoder = new google.maps.Geocoder;
				var infowindow = new google.maps.InfoWindow;
				var latlng = {lat: pos.coords.latitude , lng: pos.coords.longitude}
				geocoder.geocode({'location': latlng}, function(results, status) {
	    		if (status === google.maps.GeocoderStatus.OK) {
	      			if (results[1]) {
			        	$scope.city = results[2].address_components[1].long_name;
								addMarker(latlng,map);
								$scope.getSucursales();
	      			} else {
	        			window.alert('No results found');
	      			}
	    		} else {
	      			window.alert('Geocoder failed due to: ' + status);
	    		}
	 		});
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

	}

	function loadServicios () {
		var json = JSON.parse(sessionStorage.getItem('jsonSector'));
		var promiseGet = sectorService.getServicios(json.id);
        promiseGet.then(function (pl) {
            $scope.Servicios = pl.data;
						setTimeout(function() {
				      $scope.data.idServicio = String($scope.Servicios[0].id);
							ObtenerPosicion()
				    }, 1000);

        },
        function (errorPl) {
            console.log('failure loading sucursal', errorPl);
        });
	}

	$scope.getSucursales = function () {
		console.log($scope.data.idServicio);
		var promiseGet = sectorService.getSucursalesByCiudad($scope.data.idServicio,$scope.city,$scope.lat,$scope.long);
		promiseGet.then(function (pl) {
				$scope.Sucursales = pl.data;
				console.log($scope.Sucursales);
				for (var i = 0; i < $scope.Sucursales.length; i++) {
					indice = i + 1;
					loc = {lat: parseFloat($scope.Sucursales[i].latitud), lng: parseFloat($scope.Sucursales[i].longitud)}
					var marker = new google.maps.Marker({
						position: loc,
						label : indice.toString(),
						map: $scope.map
					});
				};
		},
		function (errorPl) {
				console.log('failure loading sucursal', errorPl);
		});
	}


  $scope.getEmpleados = function (sucursal) {
		var json = JSON.parse(sessionStorage.getItem('jsonSector'));
    sessionStorage.setItem('idSucursal',sucursal.id)
		sessionStorage.setItem('idServicio',$scope.data.idServicio)
    if (json.aplicaReserva == "SI") {
      window.location.href = "#/side-menu21/reservas";
    }
  }

})

.controller('misTunosCtrl', function($scope) {

})

.controller('editarPerfilCtrl', function($scope) {

})

.controller('reservasCtrl', function ($scope, reservaService, serverData, $ionicModal, $timeout, $ionicPopup, infoFiltro) {

	$ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });


	$scope.arrayHoras = [];
	$scope.EmpleadosDisponibles = [];
	$scope.Empleados = [];
	$scope.Reserva = [];
	$scope.loginData = {};
	$scope.posicion;
	$scope.Reservas = {};
	$scope.ArrayReservas = [];
	$scope.serv = infoFiltro.rango;

	var hora = new Date();
	$scope.serv.fechaInicio = hora;
	horas(hora)
	getEmpleados()
	getReservas()

	function horas(hora) {
 		$scope.idSucursal = sessionStorage.getItem('idSucursal');
 		$scope.idServicio = sessionStorage.getItem('idServicio');
		$scope.arrayHoras= [];
		var promiseGet = reservaService.getMinutos($scope.idServicio,$scope.idSucursal);
    promiseGet.then(function (pl) {
			var horaNueva = hora.getHours();
			var minutos = 00;
			var index = 0;
			hora.setMinutes(00);
			while (horaNueva < 23) {
				hora.setMinutes(hora.getMinutes() + pl.data.minutos);
				horaNueva = hora.getHours();
				minutos = hora.getMinutes();
				if(horaNueva<10){horaNueva='0'+horaNueva}
 				if(minutos<10){minutos='0'+minutos}
				$scope.arrayHoras.push(
					{
							id : index,
							hora : horaNueva + ":" + minutos,
							status : false,
					}
				);
				index = index + 1;
			}
    },
    function (errorPl) {
        console.log('failure loading sucursal', errorPl);
    });
	}

	function getEmpleados() {
		var promiseGet = reservaService.getEmpleados($scope.idServicio,$scope.idSucursal);
    promiseGet.then(function (pl) {
        $scope.Empleados = pl.data;

    },
    function (errorPl) {
        console.log('failure loading sucursal', errorPl);
    });
	}

	function getReservas() {
		var mes = ($scope.serv.fechaInicio.getMonth() + 1);
		var dia = ($scope.serv.fechaInicio.getDate());
		if (mes < 10) {
			mes = "0" + mes;
		}
		if (dia < 10) {
			dia = "0" + dia;
		}
		var fecha = $scope.serv.fechaInicio.getFullYear() + '-' + mes + "-" + dia;
		var promiseGet = reservaService.getReservas($scope.idServicio,$scope.idSucursal, fecha);
    promiseGet.then(function (pl) {
        $scope.Reserva = pl.data;
				console.log(JSON.stringify($scope.Reserva));
    },
    function (errorPl) {
        console.log('failure loading sucursal', errorPl);
    });
	}

	$scope.getEmpleadosDisponibles = function (hora) {
		//
		var json = JSON.parse(sessionStorage.getItem('jsonSector'));
		if (json.aleatorio != 0) {
			$scope.post(hora,$scope.Empleados[0].id);
		}else {
			getEmpleadosDisponibles(hora)
		}
	}

	function getEmpleadosDisponibles(hora) {
		$scope.EmpleadosDisponibles = [];
		if (hora.status == true) {
			hora.status = false;
		}else{
			hora.status = true;
		}
		var horaSolicitud = hora.hora + ":" + "00";
		var cont = 0;
		var pos = 0;
		$scope.ArrayReservas = []
		for (var i = 0; i < $scope.Reserva.length; i++) {
			if (horaSolicitud == $scope.Reserva[i].horaReserva) {
					$scope.ArrayReservas.push(
						{
							idEmpleado: $scope.Reserva[i].idEmpleado
						}
					)
			}
		}
		for (var i = 0; i < $scope.arrayHoras.length; i++) {
			if (hora.id != $scope.arrayHoras[i].id ) {
					$scope.arrayHoras[i].status = false;
			}
		}
		agregarEmpleados()
	}

	function agregarEmpleados() {
		$scope.EmpleadosDisponibles = [];
		if ($scope.ArrayReservas.length > 0) {
			for (empleado of $scope.Empleados) {
				for (reserva of $scope.ArrayReservas) {
					if (empleado.id != reserva.idEmpleado) {
						$scope.EmpleadosDisponibles.push(
							{
								id: empleado.id,
								nombre : empleado.nombres + " " + empleado.apellidos,
							}
						)
					}
				}
			}
		}else {
			for (empleado of $scope.Empleados) {
				$scope.EmpleadosDisponibles.push(
					{
						id: empleado.id,
						nombre : empleado.nombres + " " + empleado.apellidos,
					}
				)
			}
		}

	}

	$scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.post = function(hora, idEmpleado) {
		$scope.Hora = hora.hora;
		$scope.idEmpleado = idEmpleado;
		if (localStorage.getItem('idCliente')) {
			postTurno();
		}else {
			$scope.modal.show();
		}
  };

	$scope.login = function () {
		var data = {
			email : $scope.loginData.email,
			pass : $scope.loginData.pass
		}
		var promiseGet = reservaService.login(data);
    promiseGet.then(function (pl) {
			if (pl.data.std != 1) {
				var alertPopup = $ionicPopup.alert({
				 title: 'Mensaje De Información',
				 template: pl.data.msg
				});
				alertPopup.then(function(res) {
				 console.log('Thank you for not eating my delicious ice cream cone');
				});
			}else {
				localStorage.setItem('idCliente', pl.data.cliente.id);
				$scope.modal.hide();
			}

    },
    function (errorPl) {
        console.log('failure loading ', errorPl);
    });
	}

	function postTurno() {

		var mes = ($scope.serv.fechaInicio.getMonth() + 1);
		var dia = ($scope.serv.fechaInicio.getDate());
		if (mes < 10) {
			mes = "0" + mes;
		}
		if (dia < 10) {
			dia = "0" + dia;
		}
		var fecha = $scope.serv.fechaInicio.getFullYear() + '-' + mes + "-" + dia;

		var data = {
				idCliente : localStorage.getItem('idCliente'),
				idEmpleado : $scope.idEmpleado,
				idSucursal : $scope.idSucursal,
				idServicio : $scope.idServicio,
				fechaReserva : $scope.Fecha,
				horaReserva : $scope.Hora,
				cupos : "1",
				fechaReserva : fecha,
		};
		console.log(JSON.stringify(data));
		var promiseGet = reservaService.postReserva(data);
    promiseGet.then(function (pl) {
			var alertPopup = $ionicPopup.alert({
			 title: 'Mensaje De Información',
			 template: pl.data.msg
			});
			alertPopup.then(function(res) {
			 	getEmpleados()
			 	getReservas()
			});
    },
    function (errorPl) {
        console.log('failure loading sucursal', errorPl);
    });
	}

	$scope.buscarHoras = function () {
		var horaNueva = new Date($scope.serv.fechaInicio.getFullYear(),$scope.serv.fechaInicio.getMonth(),$scope.serv.fechaInicio.getDate(),0,0);
		horas(horaNueva);
	}


})
