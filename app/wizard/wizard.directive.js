/**
 * Created by Damian on 08/03/2016.
 */
(function(){
    "use strict";
	angular
		.module('dotWidget.wizard', ['angularMoment',
								     'dotWidget.settings',
									 'dotWidget.wizard.rideSummary',
									 'dotWidget.wizard.pickUpForm',
                                     'dotWidget.wizard.vehicleSelection',
                                     'pascalprecht.translate'])
            .config(configFn)
			.directive('wizard', wizardDirectiveFn);

	function wizardDirectiveFn(){
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/wizard/wizard.view.html',
			controller: wizardControllerFn,
            require : ['$scope', '$http', 'moment', 'appSettings', '$translate']
		};
	}

    function wizardControllerFn($scope, $http, moment, appSettings, $translate) {
		$scope.stepEneable = 1;
		$scope.cargando = false;
		$scope.services = [];
		$scope.selectedService = {};
		$scope.appSettings = appSettings;
		$scope.ride = {
			type : 'hours',
			date: moment().add(3, 'days').toDate(),
			time: new Date(1970, 1, 1, 10, 0),
			from: null,
			to: null,
            hours: '2',
            passengers : '1',
            bags : '0',
			vehicle: {
				image: null,
				description: null
			},
			total: {
				currency: null,
				value: null
			}
		};

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