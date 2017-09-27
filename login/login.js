'use strict';

angular.module('myApp.login', ['ngRoute'])

	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/login', {
			templateUrl: 'login/login.html',
			controller: 'loginCtrl'
		});
	}])

	.controller('loginCtrl', function ($scope, $http, $route, API, LANG, $cookies, $location) {

		$scope.init = function(){
			$scope.logingIn = false;
		};

		$scope.userLogin = function(username, password){
			$scope.logingIn = true;
			let params = {username: username, password: password}
			$http.post(API + 'auth/login', params).then(function(ok){
				if(ok.data.success){
					var token = ok.data.token;
					if(ok.data.success) {
						$cookies.put('user', token);
						$location.path('/')
					}
				} else{
					swal('FAIL', ok.data.message, 'error');
				}
				$scope.logingIn = false;
			})
		}
	});