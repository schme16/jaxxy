var tttt
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
			return false;
		}
		var id = mule.genID(),
		payload = jaxxy.modules.jsonfn.stringify({id:id, parentID: mule.parentID, url:mule.server, data:data, func: function(prev) {

			/*$.ajax({
				type: "POST",
				url: prev.url,
				data: prev.data,
				contentType: "application/x-www-form-urlencoded;charset=UTF-8",
				success: function (d) {
					parent.postMessage(jsonfn.stringify({parentID: prev.parentID, id:prev.id, data:d}), "*");
				},
				error: function (e) {
					if(console) console.log(JSON.stringify(e))
					//alert('ERROR!')
				}
			})*/

		}});

		mule.element.contentWindow.postMessage(payload, "*");
		mule.messageQueue[id] = function (e) { func(e); };
	};
			
	mule.get = function(url, data, func) {
		if(!mule.ready) {
			mule.getQueue.push([url, data, func]);
			return false;
		}


		var id = mule.genID(),
		payload = jaxxy.modules.jsonfn.stringify({id:id, parentID: mule.parentID, url: url, data:data, func: function(prev) {

			//console.log(222);

			jaxxy.get(prev.url)
				.success(function (d) {
					parent.postMessage(jaxxy.modules.jsonfn.stringify({parentID: prev.parentID, id:prev.id, data:d}), "*");
				})
				.error(function (e) {
					if(console) console.log(JSON.stringify(e))
				});

		}});

		mule.element.contentWindow.postMessage(payload, "*");
		mule.messageQueue[id] = func;
	}

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
				console.log(mule.messageQueue[k.id])
				if(!!k && !!mule.messageQueue[k.id] && !!k.id) {
					mule.messageQueue[k.id](k);
				}
			} catch (e){ if (typeof console !== null && typeof console !== undefined) console.error(e.message)}

		}
	}





	
	jaxxy.modules.mule = mule;



}(window));