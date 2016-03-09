/**
 * Created by Damian on 06/03/2016.
 */
(function(){
    "use strict";
	angular
		.module('dotWidget.settings.api', [])
			.factory('apiSettings', apiSettingsFn);

	function apiSettingsFn(){
		return {
			'urlBase': 'https://api.dottransfers.com/v1',
			'accessToken':  '235c3e0561c0407ead3606e73cbcb41d' /* 'Access-Token-Invalid' */
		};
	}
})();