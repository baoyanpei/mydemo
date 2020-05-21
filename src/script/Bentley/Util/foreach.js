define("foreach", [], function () {
  var e = function (e, t) {
    if (Array.isArray(e))
      for (var n = 0; n < e.length; n++) t(e[n]);
    else if ("object" == typeof e)
      for (var r in e) e.hasOwnProperty(r) && t(e[r])
  };
  return e
})
