/*This is the base file, where any core items will be placed, such namespacing and promises*/

(function (window) {
	"use strict";

	var init = function () {

		var jaxxy = {},
			xhr = function (type, url, data, async, successCallback, errorCallback) {
				var request = new XMLHttpRequest(),
					isAsync = (typeof async === "null" || typeof async === "undefined"  || !!async ? true : false);
				
				//Type: GET/POST
				//Url: URL to get/post
				//Async: is this async or not (defaults to async)
				request.open(type, url,  isAsync);

				request.onreadystatechange = function() {
					if (this.readyState === 4) {
						if (this.status >= 200 && this.status < 400) {
							// Success!
							if (typeof successCallback === "function") successCallback(this.responseText, this);
						}
						else {
							if (typeof errorCallback === "function") errorCallback(this);
						}
					}
				};

				request.send(data);
				request = null;
			};

		jaxxy.get = function (url, data, async) {
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


				xhr("GET", url, data, async, handleCallbacks(successCallbacks), handleCallbacks(errorCallbacks))


			return returnObj;
		}

		jaxxy.post = function (url, data, async) {
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


				xhr("POST", url, data, async, handleCallbacks(successCallbacks), handleCallbacks(errorCallbacks))


			return returnObj;
		}

		



		return jaxxy;
	}

	window['jaxxy-' + new Date().getTime()] = window.jaxxy = init();

})(window)