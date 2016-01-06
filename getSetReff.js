(function() {

function rC(k){return(document.cookie.match('(^|; )'+k+'=([^;]*)')||0)[2]}

function getSetReff()
{

    if (!Array.prototype.filter) //Array.filter() isn't included in IE until version 9.
    {
      Array.prototype.filter = function(fun /*, thisArg */)
      {
        "use strict";

        if (this === void 0 || this === null)
          throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function")
          throw new TypeError();

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++)
        {
          if (i in t)
          {
            var val = t[i];

            // NOTE: Technically this should Object.defineProperty at
            //       the next index, as push can be affected by
            //       properties on Object.prototype and Array.prototype.
            //       But that method's new, and collisions should be
            //       rare, so use the more-compatible alternative.
            if (fun.call(thisArg, val, i, t))
              res.push(val);
          }
        }

        return res;
      };
    }

    var _reff=[];
    _reff = dataLayer.filter(function (value) {if (value.setDomain)  return value; });
    if (_reff.length === 0) _reff[0]={'setDomain':document.location.hostname};

    function sC(n,v,d) { dd = new Date(); dd.setTime(dd.getTime() + (d*24*60*60*1000)) ;e = typeof d != "undefined" ? ";expires="+dd.toGMTString() : ""; document.cookie = n+"="+v+e+";domain="+_reff[0].setDomain+";path=/"; }
    function gcP(p) { if (document.location.search.indexOf(p) != -1) { return (""+document.location.search.split(p+"=")[1]).split("&")[0]; } else { return "not-set"; }  }
    
    //every pageview
    var __asc = (typeof rC("__sreff") != "undefined" ? rC("__sreff") : "");
    var __apc = (typeof rC("__reff") != "undefined" ? rC("__reff") : "");
    var __tsc = t__apc = [];
    var __rf = __tpc = res__apc = __gsr = __nwss = "";
    var __cmp = "utm_campaign";
    var __mdm = "utm_medium";
    var __srcs = "utm_source";
	var __trm = "utm_term";
	var __cnt = "utm_content";

	var isUTM, isAdWords;


    //referrer or params?
    if (document.location.search.indexOf(__cmp) != -1 || document.location.search.indexOf(__mdm) != -1 || document.location.search.indexOf(__srcs) != -1)
    {
        __gsr = "//campaign::c:["+gcP(__cmp)+"]m:["+gcP(__mdm)+"]s:["+gcP(__srcs)+"]t:["+gcP(__trm)+"]n:["+gcP(__cnt)+"]";
		isUTM = true;
    } else { 
		__gsr = document.referrer; 
	}

    //console.log(__gsr);
    //get referrer domain & verify adwords
    if (document.location.search.indexOf("gclid") != -1 && !isUTM) {
	   __gsr = "//campaign::[adwords]";
	   isAdWords = true;
	}

	if (!isUTM && !isAdWords && document.referrer) { // organic, parse referrer to determine source
		// regex is from gilly3@so (http://stackoverflow.com/a/8498629/382610)
		var refHost = document.referrer.match(/^https?\:\/\/(www\d?\.)?([^\/?#]+)(?:[\/?#]|$)/i)[2];
		var headSearch = "//org-sc::";
		var headSocial = "//org-so::";

		if (refHost.match(/^google\./)) { // check regex as google have different TLDs per location
			__gsr = headSearch + "[gl]";
		} else { // switch for exact domains
			switch(refHost) {
				case "facebook.com":
					__gsr = headSocial + "[fb]";
					break;
				case "twitter.com":
					__gsr = headSocial + "[tw]";
					break;
				case "bing.com":
					__gsr = headSearch + "[bn]";
					break;
				case "linkedin.com":
					__gsr = headSocial + "[li]";
					break;
			}
		}
	}

    __gsr = ((typeof __gsr == "undefined" || __gsr == "" || __gsr.indexOf(_reff[0].setDomain)!=-1) ? "(direct)" : __gsr.split('/')[2]);

    if (__asc)
    {
        __tsc = __asc.split(".");
        __tsc[1] = new Date().getTime();
        __tsc[2]++;
        __asc = __tsc.join(".");
        sC("__sreff",__asc);
    }
    else
    {
        __tsc[0] = __tsc[1] = new Date().getTime(); //start time = current time
        __tsc[2]=1; //first pageview
        __asc = __tsc.join(".");
        __nwss = 1;
        sC("__sreff",__asc);
    }
    


    //if new session
    if (__nwss == 1)
    {
        res__apc = (__apc != "" ? __apc+"|" : ""); 
        sC("__reff",res__apc+__gsr+"&"+__asc,730);
    }
    else
    {
        t__apc = __apc.split("|");
        __tpc = t__apc[t__apc.length-1];
        __tpc=__tpc.split("&")[0] != "" ? __tpc.split("&")[0] : __gsr;
        res__apc = (t__apc.length == 1 ? "" : (t__apc.slice(0,-1).join("|")+"|"));

        if (__gsr == "(direct)" || __gsr.indexOf(__tpc.split("&")[0])!=-1) 
        {
            sC("__reff",res__apc+__tpc+"&"+__asc,730);
        }
        else
        {
            sC("__reff",__apc+"|"+__gsr+"&"+__asc,730);
        } 
    }
    return rC("__reff");
}

function parse() {
    var referrers = rC("__reff").split("|");

    return referrers.map(function(e) {
        var matches;

        if (matches = e.match(/^campaign::c:\[(.+)\]m:\[(.+)\]s:\[(.+)\]t:\[(.+)\]n:\[(.+)\]&([0-9.]+)$/)) {
            // campaign
            return {
                type: "utm",
                campaign: matches[1],
                medium: matches[2],
                source: matches[3],
                term: matches[4],
                content: matches[5]
            };
        } else if (matches = e.match(/^org-(\w+)::\[(w+)\]&([0-9,]+)$/)) {
			return {
				type: "organic",
				subtype: matches[1] === "sc" ? "search" : "social",
				service: matches[2]
			};
		} else {
            // catch-all for now
            return e;
        }
    });
}


function definition() {
    return {
        getSetReff: getSetReff,
        parse: parse
    };
}

if (typeof module !== undefined) {
    module.exports = definition();
} else if (typeof define == 'function' && typeof define.amd == 'object') {
    define(definition);
} else {
    window.getSetReff = definition();
}

})();
