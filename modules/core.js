/*This is the base file, where any core items will be placed, such namespacing and promises*/

(function (window) {
	"use strict";
	var init = function () {

		var jaxxy = {
			modules: {},
			set: function (method, func) {
				if (method === 'get') {
					jaxxy.get = func;
				}
				else if (method === 'post') {
					jaxxy.post = func;
				}
			},
			default: function (method) {
				if (method === 'get') {
					jaxxy.get = jaxxy.modules.get;
				}
				else if (method === 'post') {
					jaxxy.get = jaxxy.modules.post;
				}
			}
		};

		return jaxxy;
	}

	window['jaxxy-' + new Date().getTime()] = window.jaxxy = init();

}(window));