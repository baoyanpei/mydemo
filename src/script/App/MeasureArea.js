define("MeasureArea", ["./math.min"], function (e) {
    function t() {
        return this
    }
    var n = {
        test: function () {
            var e = [];
            e.push({
                x: 24.6468,
                y: 381.461,
                z: 845.956
            }), e.push({
                x: -37.2669,
                y: 370.757,
                z: 828.06
            }), e.push({
                x: -126.696,
                y: 337.96,
                z: 817.206
            }), e.push({
                x: -106.622,
                y: 286.136,
                z: 811.693
            }), e.push({
                x: -7.81157,
                y: 286.593,
                z: 830.903
            });
            var t = this.fitPlane(e),
                n = this.projectionPoints(e, t);
            this.convertTo2D(n, t), this.dimensionsOfPolygon(n, t)
        },
        fitPlane: function (t) {
            var n = [
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0]
                ],
                r = [0, 0, 0],
                i = [0, 0, 0],
                o = {
                    a: 0,
                    b: 0,
                    c: 0,
                    d: 0
                },
                a = t.length;
            if (!a) return null;
            for (var s = 0; s < a; s++) i[0] += t[s].x, i[1] += t[s].y, i[2] += t[s].z;
            i[0] /= a, i[1] /= a, i[2] /= a;
            for (var s = 0; s < a; s++) n[0][0] += (t[s].x - i[0]) * (t[s].x - i[0]), n[0][1] += (t[s].x - i[0]) * (t[s].y - i[1]), n[0][2] += t[s].x - i[0], n[1][1] += (t[s].y - i[1]) * (t[s].y - i[1]), n[1][2] += t[s].y - i[1], r[0] += (t[s].x - i[0]) * (t[s].z - i[2]), r[1] += (t[s].y - i[1]) * (t[s].z - i[2]), r[2] += t[s].z - i[2];
            n[1][0] = n[0][1], n[2][0] = n[0][2], n[2][1] = n[1][2], n[2][2] = a;
            var u = e.matrix(n),
                c = e.det(u);
            if (0 == c) return null;
            var l = e.inv(u),
                f = e.multiply(l, r),
                h = e.subset(f, e.index(0)),
                p = e.subset(f, e.index(1)),
                m = e.sqrt(h * h + p * p + 1);
            return o.a = -h / m, o.b = -p / m, o.c = 1 / m, o.d = (-h * i[0] - p * i[1] + i[2]) / m, o
        },
        projectionPoints: function (t, n) {
            var r = [],
                i = t.length;
            if (!i) return r;
            var o, a, s, u, c, l = [0, 0, 0],
                f = [n.a, n.b, n.c];
            l = 0 != n.a ? e.add(l, [n.d / n.a, 0, 0]) : 0 != n.b ? e.add(l, [0, n.d / n.b, 0]) : e.add(l, [0, 0, n.c / n.d]);
            for (var h = 0; h < i; h++) s = [t[h].x - l[0], t[h].y - l[1], t[h].z - l[2]], u = e.dot(s, f), c = e.multiply(u, f), o = e.subtract(s, c), a = e.add(l, o), r.push({
                x: a[0],
                y: a[1],
                z: a[2]
            });
            return r
        },
        centroidOfPoints: function (e) {
            for (var t = {
                    x: 0,
                    y: 0,
                    z: 0
                }, n = e.length, r = 0; r < n; r++) t.x += e[r].x, t.y += e[r].y, t.z += e[r].z;
            return n > 0 && (t.x /= n, t.y /= n, t.z /= n), t
        },
        dimensionsOfPolygon: function (e, n) {
            var r = this.convertTo2D(e, n),
                i = new t.Polygon2D(r);
            return i.is_simple() ? {
                area: i.area(),
                perimeter: i.perimeter()
            } : {
                area: 0,
                perimeter: 0
            }
        },
        convertTo2D: function (t, n) {
            var r = [n.b, -n.a, 0],
                i = e.sqrt(r[0] * r[0] + r[1] * r[1] + r[2] * r[2]),
                o = n.c,
                a = i;
            0 != i && (r[0] /= i, r[1] /= i, r[2] /= i);
            for (var s, u = this.computeRotMat(r, o, a), c = (e.matrix(u), []), l = [0, 0, 0], f = t.length, h = 0; h < f; h++) l = [t[h].x, t[h].y, t[h].z], s = e.multiply(u, l), c.push({
                x: s[0],
                y: s[1]
            });
            return c
        },
        computeRotMat: function (e, t, n) {
            var r = [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ];
            return r[0][0] = t + e[0] * e[0] * (1 - t), r[0][1] = e[0] * e[1] * (1 - t) - e[2] * n, r[0][2] = e[0] * e[2] * (1 - t) + e[1] * n, r[1][0] = e[0] * e[1] * (1 - t) + e[2] * n, r[1][1] = t + e[1] * e[1] * (1 - t), r[1][2] = e[2] * e[1] * (1 - t) - e[0] * n, r[2][0] = e[2] * e[0] * (1 - t) - e[1] * n, r[2][1] = e[2] * e[1] * (1 - t) + e[0] * n, r[2][2] = t + e[2] * e[2] * (1 - t), r
        }
    };
    return t.Polygon2D = function (e) {
        this.points = e, this.edges = [];
        for (var t = this.points.length, n = 1; n < t; n++) this.edges.push({
            x1: this.points[n - 1].x,
            y1: this.points[n - 1].y,
            x2: this.points[n].x,
            y2: this.points[n].y
        });
        t > 2 && this.edges.push({
            x1: this.points[t - 1].x,
            y1: this.points[t - 1].y,
            x2: this.points[0].x,
            y2: this.points[0].y
        })
    }, t.Polygon2D.prototype = {}, t.Polygon2D.prototype.is_simple = function () {
        var e = this.edges.length;
        if (e <= 3) return !0;
        for (var t = 0; t < e; t++) {
            var n = e - 1;
            0 == t && (n = e - 2);
            for (var r = t + 2; r <= n; r++)
                if (this.lines_intersect(this.edges[t], this.edges[r])) return !1
        }
        return !0
    }, t.Polygon2D.prototype.lines_intersect = function (e, t) {
        var n, r, i, o, a, s;
        return n = e.x2 - e.x1, r = e.y2 - e.y1, i = t.x2 - t.x1, o = t.y2 - t.y1, a = (-r * (e.x1 - t.x1) + n * (e.y1 - t.y1)) / (-i * r + n * o), s = (i * (e.y1 - t.y1) - o * (e.x1 - t.x1)) / (-i * r + n * o), a >= 0 && a <= 1 && s >= 0 && s <= 1
    }, t.Polygon2D.prototype.area = function () {
        var e = 0,
            t = 0;
        nbPoints = this.points.length;
        for (var n = 0; n < nbPoints - 1; n++) e += this.points[n].x * this.points[n + 1].y, t += this.points[n].y * this.points[n + 1].x;
        e += this.points[nbPoints - 1].x * this.points[0].y, t += this.points[nbPoints - 1].y * this.points[0].x;
        var r = (e - t) / 2;
        return r < 0 && (r *= -1), r
    }, t.Polygon2D.prototype.perimeter = function () {
        for (var t = 0, n = this.edges.length, r = 0; r < n; r++) length_square = (this.edges[r].x2 - this.edges[r].x1) * (this.edges[r].x2 - this.edges[r].x1) + (this.edges[r].y2 - this.edges[r].y1) * (this.edges[r].y2 - this.edges[r].y1), t += e.sqrt(length_square);
        return t
    }, n
})