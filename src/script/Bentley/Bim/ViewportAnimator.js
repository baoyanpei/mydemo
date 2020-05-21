define("ViewportAnimator", ["./AnimatorState", "../Math/Constants", "./BeDuration"], function (e, t) {
  function n(t, n, r) {
    this.totalTime = r.totalTime, this.velocityFactor = r.velocityFactor, this.viewport = r.viewport, this.allowZoom = r.allowZoom, this.state = new e(this.totalTime, t, n)
  }
  return n.prototype.animate = function (e) {
    var t = Date.now();
    Cesium.defined(this.startTime) || (this.startTime = t, this.animateTotalTime = this.initTimeSegments());
    var n = this.animateTotalTime,
      r = this.startTime + n;
    if (r <= t) return this.moveToTimeSegment(n), !0;
    var i = t - this.startTime;
    return i > n && (i = n), this.moveToTimeSegment(i), !1
  }, n.prototype.moveToTimeSegment = function (e) {
    e <= this.state.firstSegmentTime && this.state.animationTime.isTowardsFuture() ? (this.state.fraction = this.state.firstSegmentTime.isTowardsFuture() ? e.toSeconds() / this.state.firstSegmentTime.toSeconds() : 0, this.state.setUpLinearInterpolatedFrustum(this.state.initialViewBox, this.state.intermediateBox, !0, this.viewport)) : (this.state.fraction = this.state.animationTime !== this.state.firstSegmentTime ? (e - this.state.firstSegmentTime) / (this.state.animationTime - this.state.firstSegmentTime) : 0, this.state.setUpLinearInterpolatedFrustum(this.state.initialViewBox, this.state.destViewBox, !0, this.viewport))
  }, n.prototype.interrupt = function (e) {
    Cesium.defined(this.startTime) && this.moveToTimeSegment(this.animateTotalTime), this.destroy()
  }, n.prototype.initTimeSegments = function () {
    var e = this.totalTime / 10,
      n = this.viewport.getFrustum(),
      r = this.state.computeScaleTranslationTimeFactor(n, this.state.intermediateBox) + this.state.segment1scale - 1;
    Math.abs(1 - this.state.segment1scale) < t.mgds_fc_epsilon && (r = 0);
    var i = this.state.computeScaleTranslationTimeFactor(this.state.destViewBox, this.state.intermediateBox) + Math.abs(this.state.segment2scale - 1),
      o = e * (r + i);
    return o = Math.min(o, this.totalTime), o = Math.max(o, 4 * e), this.state.animationTime = o, this.state.firstSegmentTime = this.state.animationTime * r / (r + i), this.state.animationTime
  }, n.prototype.destroy = function () {
    return Cesium.destroyObject(this)
  }, n
})
