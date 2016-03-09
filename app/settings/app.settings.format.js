/**
 * Created by Damian on 09/03/2016.
 */
(function(){
    "use strict";
	angular
		.module('dotWidget.settings.format', [])
			.factory('formatSettings', formatSettingsFn);

	function formatSettingsFn(){
		return {
			'dateFormat': 'dd/MM/yyyy',
			'timeFormat': 'HH:mm',
		};
	}
})();