define("isCollectionEmpty", [], function () {
    var e = function (e) {
        if (Array.isArray(e)) return 0 === e.length;
        if ("object" != typeof e) return !0;
        for (var t in e) return !1;
        return !0
    };
    return e
})