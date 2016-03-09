(function(){
    'use strict';
	angular
		.module('dotWidget.wizard.rideSummary', [])		
			.directive('rideSummary', function() {
				return {
					restrict : 'E',
					replace: true,
					scope: false,
					templateUrl: 'app/wizard/rideSummary/rideSummary.view.html',
					controller : rideSummaryCtrl,
					require : ['$scope']
				};
			});

	function rideSummaryCtrl($scope) {
	}	
})();