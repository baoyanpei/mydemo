define("requestJson", [], function () {
  var e = function (e, t) {
    var n = new XMLHttpRequest;
    n.open("GET", e, !0), n.responseType = "json", n.onload = function (e) {
      if (4 === n.readyState && 200 === n.status) {
        var r = n.response;
        try {
          r = "string" == typeof r ? JSON.parse(r) : JSON.parse(JSON.stringify(r)), t(void 0, r)
        } catch (e) {
          t("Invalid Json", void 0)
        }
      } else t(n.statusText, void 0)
    }, n.onerror = function (e) {
      t(e, void 0)
    }, n.send(null)
  };
  return e
})
