/*Adds a post method shortcut*/
(function (window) {
	"use strict";

	if (typeof jaxxy === 'undefined' || !!jaxxy.modules.get) return false;
	var get = function (url, data, async) {
		var successCallbacks = [],
			errorCallbacks = [],
			returnObj = {
				then: function (a) {
					if (typeof a === "function") successCallbacks.push(a);
					return returnObj
				},
				error: function (a) {
					if (typeof a === "function") errorCallbacks.push(a);
					return returnObj
				},
			},
			handleCallbacks = function (callbacks) {
				return function (a, b) {
					for (var i = 0; i < callbacks.length; i++) {
						callbacks[i](a, b);
					}
				}
			};
			returnObj.success = returnObj.then;


			jaxxy.modules.xhr("GET", url, data, async, handleCallbacks(successCallbacks), handleCallbacks(errorCallbacks))


		return returnObj;
	}

	jaxxy.modules.get = get;
	jaxxy.set('get', get);
}(window));

		