/*Adds a post method shortcut*/
(function (window) {
	"use strict";

	if (typeof jaxxy === 'undefined' || !!jaxxy.modules.xhr) return false;
	var xhr = function (type, url, data, async, successCallback, errorCallback) {
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

	jaxxy.modules.xhr = xhr;
}(window));

		