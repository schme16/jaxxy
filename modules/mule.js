/*Utilities for the cors avoiding mule*/
(function (window) {
	"use strict";

	if (typeof jaxxy === 'undefined' || !!jaxxy.modules.mule) return false;
	var mule = {
		ready:false,
		postQueue:[],
		getQueue:[],
		messageQueue:{}
	},

	events = jaxxy.modules.events;

	mule.randomTo = function (from, to) {
		return Math.floor(Math.random() * (to - from + 1) + from);
	};

	mule.genID = function () {
		return (new Date().getTime()) + '-' + mule.randomTo(100000,999999) + '-' + mule.randomTo(100000,999999)  + '-' + mule.randomTo(100000,999999);
	};

	mule.post = function(url, data, func) {
		if(!mule.ready) {
			mule.postQueue.push([url, data, func]);
			return mule;
		}


		var id = mule.genID(),
			returnObj = {
				then: function (a) {
					if (typeof a === "function") mule.messageQueue[id].then.push(a);
					return returnObj;
				},
				success: function (a) {
					if (typeof a === "function") mule.messageQueue[id].success.push(a);
					return returnObj;
				},
				error: function (a) {
					if (typeof a === "function") mule.messageQueue[id].error.push(a);
					return returnObj;
				},
			},


			handleCallbacks = function (callbacks) {
				return function (a, b) {
					for (var i = 0; i < callbacks.length; i++) {
						callbacks[i](a, b);
					}
				}
			},
			payload = jaxxy.modules.jsonfn.stringify({id:id, parentID: mule.parentID, url: url, data:data, func: function(prev) {
				jaxxy.post(prev.url, prev.data, prev.async)
					.success(function (d) {
						parent.postMessage(jaxxy.modules.jsonfn.stringify({parentID: prev.parentID, id:prev.id, data:d}), "*");
					})
					.error(function (e) {
						parent.postMessage(jaxxy.modules.jsonfn.stringify({parentID: prev.parentID, id:prev.id, data:false, error: e}), "*");
						if(console) console.log(JSON.stringify(e))
					});
			}});
		mule.element.contentWindow.postMessage(payload, "*");
		mule.messageQueue[id] = {success: [], error: [], then: []};
		returnObj.then(func);







		return returnObj
	};

	mule.get = function(url, data, func) {
		if(!mule.ready) {
			mule.getQueue.push([url, data, func]);
			return mule;
		}


		var id = mule.genID(),
			returnObj = {
				then: function (a) {
					if (typeof a === "function") mule.messageQueue[id].then.push(a);
					return returnObj;
				},
				success: function (a) {
					if (typeof a === "function") mule.messageQueue[id].success.push(a);
					return returnObj;
				},
				error: function (a) {
					if (typeof a === "function") mule.messageQueue[id].error.push(a);
					return returnObj;
				},
			},
			handleCallbacks = function (callbacks) {
				return function (a, b) {
					for (var i = 0; i < callbacks.length; i++) {
						callbacks[i](a, b);
					}
				}
			},
			payload = jaxxy.modules.jsonfn.stringify({id:id, parentID: mule.parentID, data: data, url: url, func: function(prev) {
				jaxxy.get(prev.url, prev.data, prev.async)
					.success(function (d) {
						parent.postMessage(jaxxy.modules.jsonfn.stringify({parentID: prev.parentID, id:prev.id, data:d}), "*");
					})
					.error(function (e) {
						parent.postMessage(jaxxy.modules.jsonfn.stringify({parentID: prev.parentID, id:prev.id, data:false, error: e}), "*");
						if(console) console.log(JSON.stringify(e))
					});
			}});
		mule.element.contentWindow.postMessage(payload, "*");
		mule.messageQueue[id] = {success: [], error: [], then: []};
		returnObj.then(func)







		return returnObj
	};

	mule.init = function (muleServer, setGet, setPost) {
		if (!muleServer) {
			return console.warn('Ignored - no server was specified');			
		}

		if (!!setGet) jaxxy.set('get', mule.get);

		if (!!setPost) jaxxy.set('post', mule.post);

		mule.muleServer = muleServer;
		
		mule.parentID = mule.genID();

		//events.off(window, "message", jaxxy.__muleReceiver);

		events.on(window, "message", mule.__muleReceiver);

		mule.element = document.createElement('iframe');

		mule.element.src = mule.muleServer;

		mule.element.style.display = 'none';

		events.on(mule.element, 'load', function () {
			mule.ready = true;
			for(var i in mule.getQueue){
				mule.get(mule.getQueue[i][0], mule.getQueue[i][1], mule.getQueue[i][2]);
			}

			for(var i in mule.postQueue){
				mule.post(mule.postQueue[i][0], mule.postQueue[i][1], mule.postQueue[i][2]);
			}
			mule.element.onload = null;
		});

		document.body.appendChild(mule.element);
	}

	mule.__muleReceiver = function (event) {
		if (event.data) {
			try {
				var k = jaxxy.modules.jsonfn.parse(event.data);
				if(!!k && !!mule.messageQueue[k.id] && !!k.id) {
					if (!k.error) for (var i in mule.messageQueue[k.id].success) {
						(mule.messageQueue[k.id].success[i] || function () {})(k.data, k);
					}
					else for (var i in mule.messageQueue[k.id].error) {
						(mule.messageQueue[k.id].error[i] || function () {})(k.error, k);
					}
					
 					for (var i in mule.messageQueue[k.id].then) {
						(mule.messageQueue[k.id].then[i] || function () {})(k.error, k.data, k);
					}


				}
			} catch (e) {
				if (typeof console !== null && typeof console !== undefined) {
					console.error(e.message)
					for (var i in mule.messageQueue[k.id][i].error) {
						(mule.messageQueue[k.id].error[i] || function () {})(e, k);
					}

				}
			}

		}
	}





	
	jaxxy.modules.mule = mule;



}(window));