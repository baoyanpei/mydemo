define("NpcCorners", ["../Math/Cartesian3"], function (e) {
    var t = {
        LeftBottomRear: 0,
        RightBottomRear: 1,
        LeftTopRear: 2,
        RightTopRear: 3,
        LeftBottomFront: 4,
        RightBottomFront: 5,
        LeftTopFront: 6,
        RightTopFront: 7,
        CornerCount: 8,
        First: 0,
        Last: 7,
        NPC_000: 0,
        NPC_100: 1,
        NPC_010: 2,
        NPC_110: 3,
        NPC_001: 4,
        NPC_101: 5,
        NPC_011: 6,
        NPC_111: 7,
        Corners: [new e(0, 0, 0), new e(1, 0, 0), new e(0, 1, 0), new e(1, 1, 0), new e(0, 0, 1), new e(1, 0, 1), new e(0, 1, 1), new e(1, 1, 1)]
    };
    return t
})