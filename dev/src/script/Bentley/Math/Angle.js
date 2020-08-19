define("scripts/Bentley/Math/Angle", [], function () {
  var e = {};
  return e.cyclic3dAxis = function (e) {
    return 0 <= e ? e < 3 ? e : e % 3 : e > -3 ? 3 + e : 2 - (-1 - e) % 3
  }, e.atan2 = function (e, t) {
    return 0 == t && 0 == e ? 0 : Math.atan2(e, t)
  }, e
})
