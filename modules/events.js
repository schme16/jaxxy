/*Adds a post method shortcut*/
(function (window) {
	"use strict";

	if (typeof jaxxy === 'undefined' || !!jaxxy.modules.xhr) return false;
	var events  = {};
	events.on = function (el, eventName, handler) {
		if (el.addEventListener) {
			el.addEventListener(eventName, handler);
		}
		else {
			el.attachEvent('on' + eventName, function() {
				handler.call(el);
			});
		}
	}

	events.off = function (el, eventName, handler) {
		if (el.removeEventListener) el.removeEventListener(eventName, handler);
		else el.detachEvent('on' + eventName, handler);
	}


	jaxxy.modules.events = events;
}(window));

		