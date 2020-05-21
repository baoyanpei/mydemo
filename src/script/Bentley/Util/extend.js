define("extend", [], function () {
    var e = function (e, t) {
        var n = t.prototype;
        t.prototype = Object.create(e.prototype);
        for (var r in n) t.prototype[r] = n[r];
        Object.defineProperty(t.prototype, "constructor", {
            enumerable: !1,
            value: t
        })
    };
    return e
})