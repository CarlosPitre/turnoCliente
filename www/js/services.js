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



.service('serverData', function () 
	{
	return {
		json : {}
	};
});

