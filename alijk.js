/*
全局变量：
window.doseusages:药品用法,{id:{id,name}}
window.dosefrequencies:药品频次,{id:{id,name}}
*/
//test
;(function(w){
    var rvalidchars = /^[\],:{}\s]*$/,
        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
        rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g;
	var A = w.alijk = {
        parseJSON: function(data){
            if(window.JSON) return JSON.parse(data);
            if ( rvalidchars.test( data.replace( rvalidescape, "@" )
                .replace( rvalidtokens, "]" )
                .replace( rvalidbraces, "")) ) {
                return ( new Function( "return " + data ) )();
            }
            alert('alijk.parseJSON unkown value:' + data);
        },
        toJSON: function(obj){
            return alijk.getJson(obj);
        },
        _getJson: function(obj, t){
            switch(typeof obj){
                case 'number':
                case 'date':
                case 'boolean':
                    return obj;
            }
            var objArr = [];
            for (var j in obj) {
                var o = obj[j],
                    _type = typeof o;
                if ( _type == 'function')
                    objArr.push('"' + j + '":"' + o.name + '"');
                else if (_type == 'object')
                    objArr.push('"' + j + '":' + A._getJson(o));
                else if((_type == 'object' || _type =='array') && typeof o.length == 'number'){
                    objArr.push('[');
                    var index = 0,
                        len = o.length;
                    for(; index<len; index++){
                        var _o = o[index];
                        objArr.push('{' + A._getJson(_o) + '}');
                        if(index != len -1) objArr.push(',');
                    }
                    objArr.push(']');
                }
                else{
                    objArr.push('"' + j + '":"' + o + '"');
                }
            }
            return objArr.join(',');
        },
        
        getJson: function(obj){
            if(window.JSON) return JSON.stringify(obj);
            if(typeof obj.length == 'number'){
                var arr = [];
                arr.push('[');
                var index = 0,
                    len = obj.length;
                for(; index<len; index++){
                    var o = obj[index];
                    arr.push('{' + A._getJson(o, t) + '}');
                    if(index != len -1) arr.push(',');
                }
                arr.push(']');
                return arr.join('');
            }else
                return '{' + A._getJson(obj, t) + '}';
        },
        
        callService : function(sid, method, param){
        	var SESSIONID = null;
        	var params = A.getParamsFromHref();
        	var token = params["TOKEN"];
        	if (token && token.lengt != 0) {
        		SESSIONID = token;
        	}
        	var url = PATH + "/xhrService/" + sid + "/" + method + "?token="
			+ SESSIONID;
        	var paramsstr = $.toJSON(param);
        	var response = $.ajax({
        		type : "post",
        		url : url,
        		data : {
        			params : paramsstr
        		},
        		dataType : "json",
        		async : false
        	});
        	var destr = response.responseText;
        	var res = getJsonObject(destr);
        	if (res.rtnCode != "2000") {
        		alert(res.rtnMsg);
        	}
        	return res;
        },
        
        getParamsFromHref : function(){
        	var s = window.location.search.substr(1);
        	var o = new Object();
        	var aryVars = s.split('&');
        	for ( var i = 0; i < aryVars.length; i++) {
        		var index = aryVars[i].indexOf('=');
        		var aryPair = [ aryVars[i].substring(0, index),
        				aryVars[i].substring(index + 1) ];
        		o[aryPair[0]] = aryPair[1];
        	}
        	return o;
        },
        
        getformdata : function(formId){
        	var params = decodeURI($("#" + formId).serialize());
        	var obj = new Object();
        	var aryVars = params.split('&');
        	for (var i = 0; i < aryVars.length; i++) {
        		var index = aryVars[i].indexOf('=');
        		var key = aryVars[i].substring(0, index);
        		var value = aryVars[i].substring(index + 1);
        		obj[key] = value;
        	}
        	return obj;
        },
        
        getQueryString : function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return r[2]; return null;
        },
        
		extend: function(target){
			var len = arguments.length,
				index = 1,
				first = arguments[0];
			if(typeof target == 'boolean'){
				if(target) first = {};
				else{
					first = arguments[1];
					index = 2;
				}
			}
			for(; index < len; index++){
				var o = arguments[index];
				for(i in o) if(o[i] !== undefined) first[i] = o[i];
			}
			return first;
		},
		on: function (handle, type, el, bubble) {
            el.addEventListener(type, handle, !!bubble);
        },
        off: function (handle, type, el, bubble) {
            el.removeEventListener(type, handle, !!bubble);
        },
		showErr : function(ex, title) {
			try {
				var message = [];
				for (i in ex) {
					//if (typeof ex[i] == 'function' || typeof ex[i] == 'object') continue;
					message.push("\n" + i + ":" + ex[i]);
				}
				alert(title + ":" + message.join(';'));
				//throw ex;
			} catch (err) {
				alert(ex.type + ':' + ex.message);
			}
		},
		getVendor: function(){
			if(typeof my._vendor !== 'undefined') return my._vendor;
			var vendors = 't,webkitT,MozT,msT,OT'.split(','),
				t,
				i = 0,
				l = vendors.length,
				docStyle = document.documentElement.style;

			for ( ; i < l; i++ ) {
				t = vendors[i] + 'ransform';
				if ( t in docStyle) {
					my._vendor = vendors[i].substr(0, vendors[i].length - 1).toLowerCase();
				}
			}
			return my._vendor;
		},
		each: function(elements, callback){
			var i, key
			if (typeof elements.length == 'number') {
			  for (i = 0; i < elements.length; i++)
				if (callback.call(elements[i], i, elements[i]) === false) return elements
			} else {
			  for (key in elements)
				if (callback.call(elements[key], key, elements[key]) === false) return elements
			}

			return elements
		},
		showMask: function () {
            var doc = document,
            	target = doc.body,
            	th = target.clientHeight,
                tw = target.clientWidth,
                top = 0,
                left = 0,
                zIndex = parseInt(target.style.zIndex, 10),
                z = isNaN(zIndex) ? 99 : zIndex - 1,
				fr = doc.getElementById("mybabyMask");
            if(th < window.innerHeight) th = window.innerHeight;
            if(tw < window.innerWidth) tw = window.innerWidth;
            //z = z > 0 ? z : 1;
            if (!fr) {
                fr = document.createElement("div");
                fr.setAttribute("id", 'mybabyMask');
                fr.setAttribute("style", "background:none repeat scroll 0 0 rgba(0, 0, 0, 0.9);dispaly:block;margin:0px;padding:0px;border:0px;position:absolute;z-index:" + z + ";opacity:0.5;width:" + tw + "px;height:" + th + "px;left:" + left + "px;top:" + top + "px");
                target.appendChild(fr);
            }
            else {
                fr.style.width = tw + 'px';
                fr.style.height = th + 'px';
                fr.style.display = 'block';
            }
        },
        hideMask: function () {
            mybabyMask.style.display = "none";
        },
        hideMessage: function(){
        	messageShow.style.display = 'none';
        	mybabyMask.style.display = 'none';
        },
        getParam: function(paramName) {
            var url = document.URL; //URL参数，你也可以用document.URL来获取，方法太多了
            var oRegex = new RegExp('[\?&]' + paramName + '=([^&]+)', 'i');
            //var oMatch = oRegex.exec( window.top.location.search ) ; //获取当前窗口的URL
            var oMatch = oRegex.exec(url);
            if (oMatch && oMatch.length > 1)
                return oMatch[1]; //返回值
            else
                return '';
        },
        log: function(obj){
            if(window.console) console.log(this.toJSON(obj));
        },
        showMessage: function (options) {
            this.showMask();
//          if (!options.buttonType) {
//              options.buttonType = 3; //0000 0011
//          }
            if (!options.innerHTML) {
                options.innerHTML = ' \
                    <section class="tips_bg no-padding">\
                        <article class="tips_title">' + (options.title || '提示消息') + '</article>\
                        <article class="tips_txt" id="messageContent">' + options.content + '</article>\
                        <section class="sectionbtn" id="sectionbtn">\
                        </section>\
                    </section>';
            }
            var doc = document,
            	messageShow = doc.getElementById("messageShow");
            if (messageShow) {
                messageShow.innerHTML = options.innerHTML;
                messageShow.style.display = "block";
            }
            else {
                messageShow = doc.createElement("div");
                messageShow.id = "messageShow";
                messageShow.innerHTML = options.innerHTML;
                doc.body.appendChild(messageShow);
            }
            if (options.hideSelectors) {
                my.each(doc.querySelectorAll(options.hideSelectors), function(hide){
                	hide.style.display = "none";
                });
            }
            if (options.afterShow)
                options.afterShow.call(this, messageShow);
            else{
               	document.getElementById("sectionbtn").innerHTML = '<input type="button" class="btn yes single" value="确定">';
                messageShow.querySelector('input.btn.yes').onclick = function(){
                	messageShow.style.display = 'none'
                	my.hideMask();
                }
                if(options.onhide) options.onhide.call(this);
            }
            var cwidth = messageShow.clientWidth,
                cheight = messageShow.clientHeight,
                winHeight = options.winHeight || window.innerHeight,
                winWidth = options.winWidth || window.innerWidth,
                top = winHeight <= cheight ? 0 : (winHeight - cheight) / 2,
                left = winWidth <= cwidth ? 0 : (winWidth - cwidth) / 2;
            messageShow.style.left = left + "px";
            messageShow.style.top = top + "px";
        },
        GetWebRootPath: function() {
            if (this.PATH) {
                return this.PATH;
            }
            var webroot = document.location.href;
            webroot = webroot.substring(webroot.indexOf('//') + 2, webroot.length);
            webroot = webroot.substring(webroot.indexOf('/') + 1, webroot.length);
            webroot = webroot.substring(0, webroot.indexOf('/'));
            if (webroot.length > 0)//存在
                this.PATH = "/" + webroot;
            else
                this.PATH = "";
            return this.PATH;
        }
	}
})(this);
