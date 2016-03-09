/**
 * Created by Damian on 06/03/2016.
 */
(function(){
	angular
		.module('dotWidget.services.location', ['dotWidget.settings'])
			.factory('apiLocationService', ['$http', 
											'apiBase', 
											'appSettings', apiLocationServiceFn]);
	
	function apiLocationServiceFn($http, apiBase, appSettings){
		/**
		* getLocation
		* @description
		* @param query {string} Gets a list with one or many geolocated locations resulting from a query made through search by text.
		* @returns {promise}
		*/
		function getLocationFn(query){
			return $http({  method: 'GET', 
							url : appSettings.api.urlBase + '/locations', 
							params : { query : query },
							headers: apiBase.getHeaders()
						});
		}		
		/**
		* @returns {object} API Service.
		*/
		return {
			getLocation : getLocationFn,
		};
	}
})();