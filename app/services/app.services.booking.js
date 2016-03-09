/**
 * Created by Damian on 06/03/2016.
 */
(function(){
	angular
		.module('dotWidget.services.booking', ['dotWidget.settings'])
			.factory('apiBookingService', ['$http', 
										'apiBase',
										'appSettings', apiBookingServiceFn]);

	
	function apiBookingServiceFn($http, apiBase, appSettings){
		/**
		* getRatedServices
		* @description Returns a list of the different categories of vehicles with their features and rates that can perform a transfer.
		* @param scheduleDate{string} Date and time for the pick-up (format yyyy-MM-ddTHH:mm). (e.g. 2014-12-26T17:30).
		* @param passengerUserName {string} Passenger user name.
		* @param originLat {number} Origin Latitude.
		* @param originLng {number} Origin Longitude.
		* @param originSearchText {string} A text to find and geolocalize the origin location.	
		* @param originObjectToken {string} Token that represents a previously obtained locationInfo for the origin.
		* @param originPassengerLocation {string} Origin passenger location.
		* @param destinationLat	{number} Destination Latitude.
		* @param destinationLng	{number} Destination Longitude.	
		* @param destinationSearchText {string} A text to find and geolocalize the destination location.
		* @param destinationObjectToken	{string} Token that represents a previously obtained locationInfo for the destination.
		* @param destinationPassengerLocation {string} Destination passenger location.	
		* @param time {integer} Service time required when a the service is at disposal (in minutes).
		* @param vehicleCategory {string} Vehicle category code (e.g. STD).
		* @param currency {string} Currency code (ISO 4217) to determine which currency should get rates. The default is USD. (e.g: "EUR").	
		* @returns {promise}
		*/		
		function getRatedServicesFn(scheduleDate,
									passengerUserName,
									originLat,
									originLng,
									originSearchText,
									originObjectToken,
									originPassengerLocation,
									destinationLat,
									destinationLng,
									destinationSearchText,
									destinationObjectToken,
									destinationPassengerLocation,
									time,
									vehicleCategory,
									currency){
			return $http({  method: 'GET', 
							url : appSettings.api.urlBase + '/bookings/ratedservices', 
							params : { 
								scheduleDate : scheduleDate, 
								passengerUserName : passengerUserName,
								originLat : originLat,
								originLng : originLng,
								originSearchText : originSearchText,
								originObjectToken : originObjectToken,
								originPassengerLocation : originPassengerLocation,
								destinationLat : destinationLat,
								destinationLng : destinationLng,
								destinationSearchText : destinationSearchText,
								destinationObjectToken : destinationObjectToken,
								destinationPassengerLocation : destinationPassengerLocation,
								time : time,
								vehicleCategory : vehicleCategory,
								currency : currency
							},
							headers: apiBase.getHeaders()
						});
		}
		/**
		* @returns {object} API Service.
		*/
		return {
			getRatedServices : getRatedServicesFn
		};
	}
})();