define("ViewPan", ["./ViewingToolHandle", "../Util/extend", "../Math/Cartesian3", "./ViewHandleType", "./ViewManipHitPriority", "./Cursor"], function (e, t, n, r, i, o) {
    function a(t) {
        e.call(this, t), this.anchorPt = new n, this.lastPtNpc = new n, this.lastGoodNpc = new n, this.handleType = r.ViewPan
    }
    a.prototype.getHandleCursor = function () {
        return this.viewTool.isDragging ? o.ClosedHand : o.OpenHand
    };
    var s = {
        doPan: {
            dist: new n,
            firstPt: new n,
            secondPt: new n
        },
        doManipulation: {
            newPtWorld: new n,
            thisPtNpc: new n,
            firstPtNpc: new n
        }
    };
    return a.prototype.doManipulation = function (e, t) {
        var n = s.doManipulation,
            r = this.viewport,
            i = e.point.clone(n.newPtWorld),
            o = r.worldToNpc(i, n.thisPtNpc),
            a = r.worldToNpc(this.anchorPt, n.firstPtNpc);
        return o.z = a.z, !!this.lastPtNpc.isEqual(o, 1e-10) || (i = r.npcToWorld(o, i), this.lastPtNpc.copyFrom(o), this.doPan(i))
    }, a.prototype.firstPoint = function (e) {
        var t = this.viewport;
        if (this.anchorPt.copyFrom(e.point), t.isCameraOn) {
            var n = t.pickDepthBuffer(e.viewPoint);
            if (Cesium.defined(n)) this.anchorPt.copyFrom(n);
            else {
                var r = t.worldToNpc(this.anchorPt);
                r.z = t.getFocusPlaneNpc(), this.anchorPt = t.npcToWorld(r, this.anchorPt)
            }
        }
        return !0
    }, a.prototype.onReinitialize = function () {
        var e = this.viewTool.viewHandles.hitHandle;
        e == this && this.viewTool.toolAdmin.setViewCursor(this.getHandleCursor())
    }, a.prototype.testHandleForHit = function (e) {
        return {
            distance: 0,
            priority: i.Low
        }
    }, a.prototype.doPan = function (e) {
        var t = s.doPan,
            r = this.viewport;
        if (r.isCameraOn) {
            var i = n.fromDifferenceOf(this.anchorPt, e, t.dist),
                o = r.view,
                a = n.fromSumOf(o.eyePoint, i, void 0, t.firstPt);
            if (r.pointIsBelowSurface(a)) return this.doPan(this.resetNpcYCoordinate(e));
            this.setLastGoodNpc(e);
            var u = n.fromSumOf(o.targetPoint, i, void 0, t.secondPt);
            if (!o.lookAt(a, u, o.yVector)) return !1;
            r.synchWithView(!1)
        } else {
            var c = r.worldToView(this.anchorPt, t.firstPt),
                l = r.worldToView(e, t.secondPt),
                i = n.fromDifferenceOf(c, l, t.dist),
                f = Math.floor(i.x),
                h = Math.floor(i.y);
            if (!r.scroll(f, h)) return !1
        }
        return !0
    }, a.prototype.resetNpcYCoordinate = function (e) {
        var t = this.viewport.worldToNpc(e);
        return t.y = this.lastGoodNpc.y, this.viewport.npcToWorld(t, e)
    }, a.prototype.setLastGoodNpc = function (e) {
        this.lastGoodNpc.copyFrom(this.viewport.worldToNpc(e)), this.lastGoodNpc.isEqual(this.lastPtNpc) && this.lastPtNpc.copyFrom(this.lastGoodNpc)
    }, t(e, a), a
})