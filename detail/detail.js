'use strict';

angular.module('myApp.detail', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/pack-detail/:id', {
		templateUrl: 'detail/detail.html',
		controller: 'detailCtrl'
	});
}])

.controller('detailCtrl', function ($scope, $http, $route, $routeParams, API) {

	$scope.init = function(){
		$scope.exportingUsers = false;
		$scope.users = [];
		$scope.currentPack = {};
		$scope.showExtras = false
		$scope.exportedUsers = "";
	}

	$http.get(API + 'users/' + $routeParams.id).then(function (response) {
		$scope.users = response.data.map(function(item){
		    item.showExtras = false;
		    return item;
		});
	});

	$http.get(API + 'pack' + '/' + $routeParams.id).then(function(pack){
		$scope.currentPack = pack.data;
	});

	$scope.confirm = function (user) {
		$http.post(API + 'users/confirm/' + user.username + '/' + $routeParams.id, { paid: true }).then(function (err, response) {
			if (err) console.log(err);
			$http.post(API + 'users', { user: user, pack: $routeParams.id });
			swal('OK', 'Se acaba de mandar el email al usuario confirmado.', 'success');

			$route.reload();
		})
	}

	$scope.reactivate = function (user) {
		$http.post(API + 'users/confirm/' + user.username + '/' + $routeParams.id, { paid: false }).then(function (err, response) {
			if (err) console.log(err);
			swal('OK', 'Se acaba de activar el usuario ' + user.username, 'success');
			$route.reload();
		})
	}

	$scope.exportUsers = function(){
		$scope.exportingUsers = true;
		$scope.exportedUsers = "";
		$scope.exportedUsers = $scope.users.map(function(item){
			return item.username;
		}).join('\n@');
	}
	
	$scope.sendMail = function(email, packId){
	    $http.post(API + 'users', { user: {email: email}, pack: packId || $routeParams.id }).then(function(response){
			swal("Enviado!", "Email mandado al correo " + email);
		});
	}

	$scope.openSendSwal = function(){
		swal({
			title: "Enviar correo unitario",
			text: "Email del destinatario:",
			type: "input",
			showCancelButton: true,
			closeOnConfirm: false,
			animation: "slide-from-top",
			inputPlaceholder: "correo@codigodiario.me"
		},
		function(inputValue){
			if (inputValue === false) return false;

			if (!inputValue) {
				swal.showInputError("No hay ningún email indicado");
				return false
			}

			
			$scope.sendMail(inputValue);
		});
	}


});