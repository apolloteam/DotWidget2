(function() {
    'use strict';
    angular
		.module('dotWidget.wizard.vehicleSelection', ['dotWidget.services', 
													   'ngAnimate', 
													   'toastr'])        
			.directive('vehicleSelection', vehicleSelectionDirectiveFn);

	function vehicleSelectionDirectiveFn() {
		return {
			restrict: 'E',
			scope: false,
			replace: true,
			templateUrl: 'app/wizard/vehicleSelection/vehicleSelection.view.html',
			controller: vehicleSelectionCtrlFn,
			require : ['$scope', 'apiServices', 'toastr']
		};
	}

	function vehicleSelectionCtrlFn($scope, apiServices, toastr) {
        $scope.volver = volverFn;

        function volverFn() {
			$scope.stepEneable = 1;
        }
    }
})();