'use strict';

angular.module('myApp.list', ['ngRoute'])

	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'list/list.html',
			controller: 'listCtrl'
		});
	}])

	.controller('listCtrl', function ($scope, $http, $route, API, LANG, $cookies) {

		$scope.init = function () {
			$scope.editing = false;
			$scope.adding = false;
			getPacks();
		};

		$scope.editItem = function (pack) {
			$scope.selectedItem = angular.copy(pack);
			$scope.editing = true;
		}

		$scope.newItem = function () {
			$scope.adding = true;
			$scope.selectedItem = {};
		};

		$scope.deleteItem = function (pack) {
			swal({
				title: "Eliminación de conjunta",
				text: "Está seguro de querer borrar la conjunta " + pack.name,
				showCancelButton: true,
				closeOnConfirm: false,
				animation: "slide-from-top",
			},
				function (isConfirm) {
					if (isConfirm) {
						$http.delete(API + 'pack' + '/' + pack._id).then(function (response) {
							if (response.data.error) swal('ERROR', response.data.msg, 'warning');
							swal('OK', response.data.msg, 'success');
							getPacks();
						});
					}
				});

		};

		$scope.finishPack = function(pack){
			let params = {
				id: pack._id,
				status: !pack.finished
			}

			$http.put(API + 'pack/change/status/', params)
			.then(function(response){
				response = response.data;
				if(response.err) swal('ERROR', response.msg, 'error');
				else{
					swal('OK', response.msg, 'success');
					getPacks();
				}
			})
		}

		$scope.save = function () {
			if (!$scope.selectedItem.name || !$scope.selectedItem.link || !$scope.selectedItem.email_title|| !$scope.selectedItem.dateEnd) {
				swal('Campos obligatorios', LANG.invalid, 'warning');
			} else {
				let params = {
					name: $scope.selectedItem.name,
					link: $scope.selectedItem.link,
					email_title: $scope.selectedItem.email_title,
					dateEnd: $scope.selectedItem.dateEnd
				};
				if ($scope.editing) params.id = $scope.selectedItem._id;

				let method = $scope.adding ? 'post' : 'put';

				$http[method](API + 'pack', params).then(function (done, err) {
					if (err) swal(err)
					swal(done.data.msg);
					getPacks();
					delete $scope.selectedItem.dateEnd;
					$scope.adding = false;
					$scope.editing = false;
				});
			}
		};

		$scope.logOut = function(){
			$cookies.remove('user')
			$route.reload();
		}


		function getPacks() {
			$http.get(API + 'pack').then(function (packs) {
				$scope.packs = packs.data;
			});
		}

	});