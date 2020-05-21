define("BeDuration", [], function () {
  return Number.prototype.toSeconds = function () {
    return this / 1e3
  }, Number.prototype.isZero = function () {
    return 0 === this
  }, Number.prototype.isTowardsFuture = function () {
    return this > 0
  }, Number.prototype.isTowardsPast = function () {
    return this < 0
  }, Number
})
