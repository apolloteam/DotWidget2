(function() {
    'use strict';
    angular
		.module('dotWidget.wizard.pickUpForm', ['dotWidget.services', 
												 'angularMoment', 
												 'ngAnimate', 
                                                 'toastr',
                                                 'ngMessages',
                                                 'pascalprecht.translate'])
            .config(configFn)
			.directive('pickUpForm', pickUpFormDirectiveFn);
	
	function pickUpFormDirectiveFn() {
		return {
			restrict: 'E',
			scope: false,
			replace: true,
			templateUrl: 'app/wizard/pickUpForm/pickUpForm.view.html',
			controller: pickUpFormCtrlFn,
            require: ['$scope', '$q', 'apiServices', 'moment', 'toastr', '$translate']
		};
	}
	
	function pickUpFormCtrlFn($scope, $q, apiServices, moment, toastr, $translate) {
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
            $scope.cargando = false;			
            var msg = $translate.instant('ResGlobal.GeneralError') + '<br>';

            if(reasons.data) {
				var data = reasons.data;
				if (data.errorUniqueId) {
				    msg += $translate.instant('ResGlobal.GeneralErrorWithUniqueId', data) + '<br><br>';
				}
				
			    // TODO: Ver si hay que mostrar el errorUniqueId. 
				if(reasons.status === 401){
				    switch (reasons.data.errorCode) {
				        case 'ERR.AUTH.ACCESSTOKEN.EXPIRED':
				            msg = $translate.instant('ResGlobal.AuthorizationExpired') + '<br>';
				            break;

				        default:
				            msg = $translate.instant('ResGlobal.AuthorizationError') + '<br>';
				    }

				    msg += $translate.instant('ResGlobal.PleaseReloadPage');
				}			
			}
			
			toastr.error(msg, $translate.instant('ResGlobal.AnErrorOccurred'), { allowHtml : true, autoDismiss: false, timeOut : 0, maxOpened: 0, extendedTimeOut: 0 });
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

        //Se setea el idioma inicial.
        $scope.setLanguage = function (langCode) {
            $translate.use(langCode);
        }
    }

    function configFn($translateProvider) {
        // traducciones definidas en un objeto, almacenadas en archivos js.
        //Para acceder a la propiedad por ejemplo mediante traduccion_es.RES_GLOBAL.BIENVENIDA
        $translateProvider.translations('es', traduccion_es);
        $translateProvider.translations('en', traduccion_en);


        //Setea el idioma preferido según la configuración del navegador.        
        $translateProvider.preferredLanguage(getBrowserLanguage());
    }	

    /**
    * Obtiene el idioma del navegador.    
    */
    function getBrowserLanguage() {
        //Lectura del idioma del navegador desde window
        return (window.navigator.language || window.navigator.userLanguage).substring(0, 2);
    };
})();