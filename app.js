'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'myApp.detail',
  'myApp.list',
  'myApp.login',
]).
config(['$locationProvider', '$routeProvider', '$httpProvider','$qProvider', function($locationProvider, $routeProvider, $httpProvider, $qProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/'});
  $qProvider.errorOnUnhandledRejections(false);
  $httpProvider.interceptors.push(function($q, $location, $cookies){
  	return {
  		request: function(config){
  			config.headers = config.headers || {};
  			let token = $cookies.get('user');
            if (token) {
                config.headers["Authorization"] = 'Bearer ' + token;
            }
            return config;
  		},
  		response: function(response){
  			return response;
  		},
  		responseError: function(response){
  			if(response.status === 401 || response.status === 403){
  				$location.path('/login')
  			}
  			return $q.reject(response);
  		}
  	}
  })


}]);

app.constant('API', "http://localhost:3000/");
// app.constant('API', "http://codigodiario.me:3000/");

var literals = {
  "invalid": "Algunos de los campos obligatorios no han sido informados"
}

app.constant('LANG', literals);
