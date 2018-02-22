"use strict";
!function() {
  void 0 === Object.assign && (Object.assign = function(e) {
    if (void 0 === e || null === e)
      throw new TypeError("Cannot convert undefined or null to object");
    for (var t = Object(e), n = 1; n < arguments.length; n++) {
      var i = arguments[n];
      if (void 0 !== i && null !== i)
        for (var s in i)
          Object.prototype.hasOwnProperty.call(i, s) && (t[s] = i[s])
    }
    return t
  });
  var e = Object.freeze({Release: "Release", Debug: "Debug"}),
    t = function() {
      return {staticHost: "https://static.bimface.com", APIHost: "https://api.bimface.com", viewToken: null, configuration: e.Release}
    },
    n = function e(t, n, s) {
      var o = t.length;
      i(t[n], function(i) {
        n++,
        n == o
          ? s(i)
          : e(t, n, s)
      })
    },
    i = function(e, t) {
      var n,
        i = document.getElementsByTagName("head")[0];
      return e.indexOf(".css") > -1
        ? (n = document.createElement("link"), n.setAttribute("href", e), n.setAttribute("rel", "stylesheet"))
        : (n = document.createElement("script"), n.setAttribute("src", e)),
      n.isLoaded = !1,
      n.addEventListener("load", function() {
        n.isLoaded = !0,
        t && t({message: "success"})
      }),
      n.addEventListener("error", function() {
        n.isLoaded = !1,
        t && t({element: e, message: "error"})
      }),
      i.appendChild(n),
      n
    },
    s = function(e) {
      var t,
        n = {
          type: "get",
          data: null,
          success: null,
          failure: null
        },
        i = Object.assign(n, e);
      t = window.XMLHttpRequest
        ? new XMLHttpRequest
        : new ActiveXObject("Microsoft.XMLHTTP"),
      t.onreadystatechange = function() {
        if (4 == t.readyState) {
          var e = t.status;
          e >= 200 && e < 300
            ? i.success && i.success(t.responseText, t.responseXML)
            : i.failure && i.failure(e)
        }
      },
      t.open(i.type, i.url, i.async),
      t.send(i.data)
    },
    o = function(e, t) {
      function n(n) {
        s({
          type: "put",
          url: "https://api.bimface.com/inside/version?viewToken=" + e + "&jsSDKVersion=" + t.jsSDKVersion + "&viewType=" + i,
          success: n
        })
      }
      if (window.localStorage) {
        var i = t.renderType;
        if ("bimView" == i && (i = "3DView"), localStorage[i] && localStorage[i] == t.jsSDKVersion)
          return !1;
        n(function() {
          localStorage.setItem(i, t.jsSDKVersion)
        })
      } else
        n()
    },
    a = {
      load: function(t, i, a) {
        s({
          url: t.APIHost + "/inside/databag?viewToken=" + t.viewToken,
          success: function(s) {
            var c = JSON.parse(s);
            if ("success" == c.code) {
              var r = c.data,
                u = t.configuration == e.Debug
                  ? "-debug"
                  : "",
                l = [
                  "./api/Bimface/Bimface.css",
                  "./api/Bimface/Bimface.js"
                ];
              o(t.viewToken, r),
              n(l, 0, function(e) {
                if ("success" == e.message) {
                  var n = r.renderType;
                  "bimView" == n && (n = "3DView"),
                  i && i({viewToken: t.viewToken, viewType: n})
                } else
                  a && a(c)
              })
            } else
              a && a(c)
          },
          failure: function(e) {
            a && a(e)
          }
        })
      }
    };
  window.BimfaceConfigrationOption = e,
  window.BimfaceSDKLoaderConfig = t,
  window.BimfaceSDKLoader = a
}();
