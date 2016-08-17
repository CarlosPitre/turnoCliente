angular.module('app.services', [])

.service('sectorService', function($http){
	this.getSectores = function () {
        var req = $http.get(uri+'/sector/activos');
        return req;
    };
    this.getServicios = function  (idSector) {
    	var req = $http.get(uri+'/sector/'+ idSector + '/servicio');
        return req;
    }
    this.getSucursalesByCiudad = function (idServicio,ciudad,latitud,longitud) {
        var req = $http.get(uri+'/servicio/'+idServicio+'/ciudad/'+ciudad+'/posicion/'+latitud+'/'+longitud+'/sucursal');
        return req;
    };
})

.service('reservaService', function($http) {
	this.getMinutos = function (idServicio, idSucursal) {
		var req = $http.get(uri+'/minutos/sucursal/'+ idSucursal + '/servicio/' + idServicio);
		return req;
	}
	this.getEmpleados = function (idServicio,idSucursal) {
		console.log(uri+ '/empleado/' + idServicio + '/' + idSucursal + '/empleados/activos');
		var req = $http.get(uri+ '/empleado/' + idServicio + '/' + idSucursal + '/empleados/activos');
		return req;
	}
	this.getReservas = function (idServicio, idSucursal,fecha) {
		var req = $http.get(uri + "/empleado/disponibles/"+idServicio+'/'+idSucursal+'/'+fecha);
		return req;
	}
	this.login = function (object) {
    var req = $http.post(uri + '/cliente/sesion', object);
    return req;
  }
	this.postReserva = function (object) {
		var req = $http.post(uri + '/turno/reserva', object);
		return req;
	}
})

.service("infoFiltro", function () {
    return {
        rango: {}
    }
})

.service('serverData', function ()
	{
	return {
		json : {}
	};
});
