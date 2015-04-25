/*Adds a post method shortcut*/
(function (window) {
	"use strict";

	if (typeof jaxxy === 'undefined' || !!jaxxy.modules.post) return false;
	var post = function (url, data, async) {
		var successCallbacks = [],
			errorCallbacks = [],
			returnObj = {
				then: function (a) {
					if (typeof a === "function") successCallbacks.push(a);
				},
				error: function (a) {
					if (typeof a === "function") errorCallbacks.push(a);
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


			jaxxy.xhr("POST", url, data, async, handleCallbacks(successCallbacks), handleCallbacks(errorCallbacks))


		return returnObj;
	};

	jaxxy.modules.post = post;
	jaxxy.set('post', post);

}(window));