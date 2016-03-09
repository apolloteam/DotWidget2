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
									 'dotWidget.wizard.vehicleSelection'])
			.directive('wizard', wizardDirectiveFn);

	function wizardDirectiveFn(){
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/wizard/wizard.view.html',
			controller: wizardControllerFn,
			require : ['$scope', '$http', 'moment', 'appSettings']
		};
	}

	function wizardControllerFn($scope, $http, moment, appSettings){
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
			hours: null,
			passengers : null,
			bags : null,
			vehicle: {
				image: null,
				description: null
			},
			total: {
				currency: null,
				value: null
			}
		};
	}	
})();