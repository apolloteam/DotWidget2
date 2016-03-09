/**
 * Created by Damian on 06/03/2016.
 */
(function(){
	angular
		.module('dotWidget.services', ['dotWidget.settings', 
									   'dotWidget.services.location',
									   'dotWidget.services.booking'])
			.factory('apiBase', ['appSettings', apiBaseFn])
				.factory('apiServices', ['apiLocationService', 
										 'apiBookingService', 
										 apiServicesFn]);

	function apiBaseFn(appSettings){		
		function getHeaders(){
			return { 'Access-Token': appSettings.api.accessToken };
		}
		
		return {
			getHeaders : getHeaders
		};
	}

	function apiServicesFn(apiLocationService, apiBookingService){
		return {
			location : apiLocationService,
			booking : apiBookingService			
		};
	}
})();