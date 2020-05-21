define("RDS", [], function () {
  var e = {
    getCONNECTToken: function (e) {
      var t = Cesium.when.defer(),
        n = new XMLHttpRequest;
      return n.open("POST", e.baseURL + e.tokenURL, !0), n.onload = function (e) {
        4 === n.readyState && 200 === n.status ? t.resolve(n.responseText) : t.reject(n.statusText)
      }, n.onerror = function (e) {
        t.reject(e)
      }, n.send(null), t
    },
    requestJSON: function (e, t) {
      var n = Cesium.when.defer(),
        r = new XMLHttpRequest;
      return r.open("GET", e, !0), r.setRequestHeader("Content-Type", "application/json"), r.onload = function (e) {
        if (4 === r.readyState && 200 === r.status) {
          var t = r.response;
          try {
            t = "string" == typeof t ? JSON.parse(t) : JSON.parse(JSON.stringify(t)), n.resolve(t)
          } catch (e) {
            n.reject("Failed to parse JSON")
          }
        } else {
          var t = r.response;
          try {
            t = "string" == typeof t ? JSON.parse(t) : JSON.parse(JSON.stringify(t)), Cesium.defined(t.errorMessage) ? n.reject(t.errorMessage) : n.reject(r.statusText)
          } catch (e) {
            n.reject(r.statusText)
          }
        }
      }, r.onerror = function (e) {
        n.reject(e)
      }, r.send(null), n
    },
    getBlobContainerURL: function (e, t, n, r) {
      var i = Cesium.when.defer(),
        o = r.baseURL + r.APIURLBegin + (Cesium.defined(t) ? t : r.APIURLMiddle) + r.APIURLEnd + "/" + e + r.fileAccessURL;
      return Cesium.when(this.requestJSON(o, n)).then(function (e) {
        Cesium.defined(e.errorMessage) ? i.reject(e.errorMessage) : Cesium.defined(e.instances) && 0 != e.instances.length ? e.instances.length > 1 ? i.reject("Multiple instances were returned") : Cesium.defined(e.instances[0].properties.Url) ? i.resolve(e.instances[0].properties.Url) : i.reject("Url property is not defined") : i.reject("No instance was returned")
      }, function (e) {
        i.reject(e)
      }), i
    },
    getDocumentProperties: function (e, t, n, r) {
      var i = Cesium.when.defer(),
        o = r.baseURL + r.APIURLBegin + (Cesium.defined(t) ? t : r.APIURLMiddle) + r.APIURLEnd + "/" + e;
      return Cesium.when(this.requestJSON(o, n)).then(function (e) {
        if (Cesium.defined(e.errorMessage)) i.reject(e.errorMessage);
        else if (Cesium.defined(e.instances) && 0 != e.instances.length)
          if (e.instances.length > 1) i.reject("Multiple instances were returned");
          else {
            var t = e.instances[0].properties.Name,
              n = e.instances[0].properties.RootDocument,
              r = e.instances[0].properties.Type;
            Cesium.defined(r) ? "RealityMesh3DTiles" != r ? i.reject("Dataset is not of the expected type Reality Mesh 3DTiles") : Cesium.defined(t) ? Cesium.defined(n) ? i.resolve({
              Name: t,
              RootDocument: n
            }) : i.reject("RootDocument property is not defined") : i.reject("Name property is not defined") : i.reject("Type property is not defined")
          }
        else i.reject("No instance was returned")
      }, function (e) {
        i.reject(e)
      }), i
    },
    getTilesetNameAndURL: function (e, t, n) {
      var r = Cesium.when.defer(),
        i = this;
      return Cesium.when(this.getCONNECTToken(n)).then(function (o) {
        Cesium.when.all([Cesium.when(i.getBlobContainerURL(e, t, o, n)), Cesium.when(i.getDocumentProperties(e, t, o, n))]).then(function (e) {
          var t = e[0],
            n = e[1].Name,
            i = e[1].RootDocument,
            o = t,
            a = o.indexOf("?"),
            s = o.substring(a);
          o = o.substring(0, a) + "/" + i + s, r.resolve({
            Name: n,
            URL: o
          })
        }, function (e) {
          r.reject(e)
        })
      }, function (e) {
        r.reject(e)
      }), r
    }
  };
  return e
})
