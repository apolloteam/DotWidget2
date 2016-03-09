/**
 * Created by Damian on 09/03/2016.
 */
(function(){
    "use strict";
	angular
		.module('dotWidget.settings', ['dotWidget.settings.api', 
									 'dotWidget.settings.format'])
			.factory('appSettings', ['apiSettings', 
									 'formatSettings', 
									 appSettingsFn]);

	function appSettingsFn(apiSettings, formatSettings) {
		return {
			api : apiSettings,
			format : formatSettings
		};
	}
})();