angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('menu.sectores', {
    url: '/page1',
    views: {
      'side-menu21': {
        templateUrl: 'templates/sectores.html',
        controller: 'sectoresCtrl'
      }
    }
  })

  .state('menu.sucursales', {
    url: '/page2',
    views: {
      'side-menu21': {
        templateUrl: 'templates/sucursales.html',
        controller: 'sucursalesCtrl'
      }
    }
  })

  .state('menu.misTunos', {
    url: '/page3',
    views: {
      'side-menu21': {
        templateUrl: 'templates/misTunos.html',
        controller: 'misTunosCtrl'
      }
    }
  })

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    abstract:true
  })

  .state('menu.editarPerfil', {
    url: '/page4',
    views: {
      'side-menu21': {
        templateUrl: 'templates/editarPerfil.html',
        controller: 'editarPerfilCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/side-menu21/page1')

  

});