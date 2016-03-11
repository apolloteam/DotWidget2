(function() {
    'use strict';
    angular
		.module('dotWidget.wizard.pickUpForm', ['dotWidget.services', 
												 'angularMoment', 
												 'ngAnimate', 
												 'toastr',
		                                         'ngMessages'])
			.directive('pickUpForm', pickUpFormDirectiveFn);
	
	function pickUpFormDirectiveFn() {
		return {
			restrict: 'E',
			scope: false,
			replace: true,
			templateUrl: 'app/wizard/pickUpForm/pickUpForm.view.html',
			controller: pickUpFormCtrlFn,
			require : ['$scope', '$q', 'apiServices', 'moment', 'toastr' ]
		};
	}
	
	function pickUpFormCtrlFn($scope, $q, apiServices, moment, toastr) {
	    $scope.noPickupResults = false;
	    $scope.noDropOffResults = false;
	    $scope.continuar = continuarFn;

        function getLocationSuccess(results) {
            $scope.cargando = false;
            // TODO: Determinar si se esta buscando por 1 o por 2 ubicaciones simultaneamente.
            if (validateLocation(results[0], 'from') && validateLocation(results[1], 'to')) {
                assignLocation(results[0], 'from');
                assignLocation(results[1], 'to');
                var scheduleDate = angular.copy($scope.ride.date);
                // scheduleDate.setTime($scope.ride.time.getTime());                
                var scopeTime = $scope.ride.time;
                scheduleDate.setHours(scopeTime.getHours());
                scheduleDate.setMinutes(scopeTime.getMinutes());
                scheduleDate.setSeconds(scopeTime.getSeconds());

                var toObjectToken,
                    time;
                if ($scope.ride.type === 'location') {
                    toObjectToken = $scope.ride.toObjectToken;
                    time = 0;
                } else {
                    toObjectToken = '';
                    time = $scope.ride.hours * 60;
                }

                // TODO: Cambiar el mensaje del "cargando"
                $scope.cargando = true;
                apiServices.booking.getRatedServices(
                    moment(scheduleDate).format('YYYY-MM-DDTHH:mm') /* scheduleDate */,
                    null /* passengerUserName */,
                    null /* originLat */,
                    null /* originLng */,
                    null /* originSearchText */,
                    $scope.ride.fromObjectToken /* originObjectToken */,
                    null /* originPassengerLocation */,
                    null /* destinationLat */,
                    null /* destinationLng */,
                    null /* destinationSearchText */,
                    $scope.ride.toObjectToken /* destinationObjectToken */,
                    null /* destinationPassengerLocation */,
                    time /* time */,
                    null /* vehicleCategory */,
                    null /* currency */
                ).then(function (result) {
                        // TODO: Refactorizar extrayendo a función.
                        $scope.stepEneable = 2;
                        $scope.services = result.data;
                        $scope.cargando = false;
                    },
                    function (reasons) {
                        // TODO: Refactorizar extrayendo a función.
                        // TODO: Tratar los Errores de busqueda de vehiculos.
                        $scope.cargando = false;
                    });
            } else {
                // TODO: Mostrar mensaje segun si se busco por 1 o por 2 ubicaciones simultaneamente.
                // Alguna de las 2 rutas no fue encontrada.
                if (results[0].data.length == 0) {
                    $scope.noPickupResults = true;
                }

                if (results[1].data.length == 0) {
                    $scope.noDropOffResults = true;
                }
            }
        }

        function getLocationFail(reasons) {
            // TODO: Localizar mensajes.
            $scope.cargando = false;
			var msg = 'No te preocupes, un ejercito de monos altamente entrenados esta yendo a solucionar el problema.<br>';
			if(reasons.data) {
				var data = reasons.data;
				if(data.errorUniqueId){
					msg += 'Si ves alguno por ahi, dale esto: ' + data.errorUniqueId + '<br><br>';
				}

			    // TODO: Ver si hay que mostrar el errorUniqueId. 
				if(reasons.status === 401){
				    switch (reasons.data.errorCode) {
				        case 'ERR.AUTH.ACCESSTOKEN.EXPIRED':
				            msg = 'Se ha producido un error de autenticación vencida.<br>';
				            break;

				        default:
				            msg = 'Se ha producido un error de autenticación.<br>';
				    }

				    msg += 'Por favor recargue la página.';
				}			
			}
            
			toastr.error(msg, 'Se produjo un error', { allowHtml : true, autoDismiss: false, timeOut : 0, maxOpened: 0, extendedTimeOut: 0 });
        }

        function continuarFn() {
            // TODO: Determinar si que hay que ir a geolocalizar .
            $scope.cargando = true;
            var tasks = [];
            tasks.push(apiServices.location.getLocation($scope.ride.from));
            if ($scope.ride.type === 'location') {
                tasks.push(apiServices.location.getLocation($scope.ride.to));
                
            }

            $q.all(tasks)
                .then(getLocationSuccess, getLocationFail);

        }

        function validateLocation(resp, prefix) {
            return resp.data.length == 1;
        }

        function assignLocation(resp, prefix) {
            $scope.ride[prefix + 'Query'] = $scope.ride[prefix];
            $scope.ride[prefix] = resp.data[0].summary;
            $scope.ride[prefix + 'ObjectToken'] = resp.data[0].objectToken;
        }
    }	
})();