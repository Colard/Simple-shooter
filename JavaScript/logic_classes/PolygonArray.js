function isNestedArray(value) {
    return Array.isArray(value) && (value.length === 0 || Array.isArray(value[0]));
}
export class PolygonHandler {
    static DrawFilledPolygon(context, polygon) {
        context.beginPath();
        const polygonForm = polygon.GetPolygonForm();
        const polygonsPointsLength = polygonForm.length;
        const polygonAbsolutePosition = polygon.GetAbsolutePosition();
        if (polygonsPointsLength < 2)
            return;
        context.moveTo(polygonForm[0].x + polygonAbsolutePosition.x, polygonForm[0].y + polygonAbsolutePosition.y);
        for (let i = 1; i < polygonForm.length; i++) {
            context.lineTo(polygonForm[i].x + polygonAbsolutePosition.x, polygonForm[i].y + polygonAbsolutePosition.y);
        }
        context.closePath();
        context.fill();
    }
    static DoPolygonsIntersect(poly1, poly2) {
        let poly1Points = poly1.GetAbsolutePolygonForm();
        let poly1Length = poly1Points.length;
        let poly2Points = poly2.GetAbsolutePolygonForm();
        let poly2Length = poly2Points.length;
        for (let i = 0; i < poly1Length; i++) {
            const nextIndex = (i + 1) % poly1Length;
            const edge = {
                x: poly1Points[nextIndex].x - poly1Points[i].x,
                y: poly1Points[i].y - poly1Points[i].y
            };
            const axis = {
                y: -edge.y,
                x: edge.x
            };
            ;
            if (this.isSeparatingAxis(axis, poly1Points, poly2Points)) {
                return false;
            }
        }
        for (let i = 0; i < poly2Length; i++) {
            const nextIndex = (i + 1) % poly2Length;
            const edge = {
                x: poly2Points[nextIndex].x - poly2Points[i].x,
                y: poly2Points[i].y - poly2Points[i].y
            };
            const axis = {
                x: -edge.y,
                y: edge.x
            };
            ;
            if (this.isSeparatingAxis(axis, poly1Points, poly2Points)) {
                return false;
            }
        }
        return true;
    }
    static PolygonDecomp(polygon) {
        this.tmpLine1 = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
        this.tmpLine2 = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
        let edges = this.polygonGetCutEdges(polygon);
        if (edges.length > 0) {
            return this.polygonSlice(polygon, edges);
        }
        else {
            return [polygon];
        }
    }
    static isSeparatingAxis(axis, poly1Points, poly2Points) {
        let poly1Length = poly1Points.length;
        for (let i = 0; i < poly1Length; i++) {
            const projectedPoly1 = this.projectPolygonOntoAxis(poly1Points, axis);
            const projectedPoly2 = this.projectPolygonOntoAxis(poly2Points, axis);
            if (!this.isOverlap(projectedPoly1, projectedPoly2)) {
                return true;
            }
        }
        return false;
    }
    static projectPolygonOntoAxis(polygon, axis) {
        let min = Number.MAX_VALUE;
        let max = -Number.MAX_VALUE;
        for (let i = 0; i < polygon.length; i++) {
            const dotProduct = this.dot(polygon[i], axis);
            min = Math.min(min, dotProduct);
            max = Math.max(max, dotProduct);
        }
        return { min: min, max: max };
    }
    static isOverlap(range1, range2) {
        return range1.max >= range2.min && range1.min <= range2.max;
    }
    static dot(point, axis) {
        return point.y * axis.y + point.x * axis.x;
    }
    static polygonGetCutEdges(polygon) {
        let min = [];
        let tmp1 = [];
        let tmp2 = [];
        let tmpPoly = [];
        let nDiags = Number.MAX_VALUE;
        for (let i = 0; i < polygon.length; ++i) {
            if (!this.polygonIsReflex(polygon, i)) {
                continue;
            }
            for (var j = 0; j < polygon.length; ++j) {
                if (this.polygonCanSee(polygon, i, j)) {
                    tmp1 = this.polygonGetCutEdges(this.polygonCopy(polygon, i, j, tmpPoly));
                    tmp2 = this.polygonGetCutEdges(this.polygonCopy(polygon, j, i, tmpPoly));
                    for (var k = 0; k < tmp2.length; k++) {
                        tmp1.push(tmp2[k]);
                    }
                    if (tmp1.length < nDiags) {
                        min = tmp1;
                        nDiags = tmp1.length;
                        min.push([
                            this.polygonAt(polygon, i),
                            this.polygonAt(polygon, j)
                        ]);
                    }
                }
            }
        }
        return min;
    }
    static polygonIsReflex(polygon, i) {
        return this.isRight(this.polygonAt(polygon, i - 1), this.polygonAt(polygon, i), this.polygonAt(polygon, i + 1));
    }
    static isRight(a, b, c) {
        return this.triangleArea(a, b, c) < 0;
    }
    static isRightOn(a, b, c) {
        return this.triangleArea(a, b, c) <= 0;
    }
    static isLeft(a, b, c) {
        return this.triangleArea(a, b, c) > 0;
    }
    static isLeftOn(a, b, c) {
        return this.triangleArea(a, b, c) >= 0;
    }
    static triangleArea(a, b, c) {
        return (((b.x - a.x) * (c.y - a.y)) - ((c.x - a.x) * (b.y - a.y)));
    }
    static polygonAt(polygon, i) {
        let s = polygon.length;
        return polygon[i < 0 ? i % s + s : i % s];
    }
    static polygonCanSee(polygon, a, b) {
        let p;
        let dist;
        let l2 = PolygonHandler.tmpLine2;
        let l1 = PolygonHandler.tmpLine1;
        if (this.isLeftOn(this.polygonAt(polygon, a + 1), this.polygonAt(polygon, a), this.polygonAt(polygon, b)) && this.isRightOn(this.polygonAt(polygon, a - 1), this.polygonAt(polygon, a), this.polygonAt(polygon, b))) {
            return false;
        }
        dist = this.sqdist(this.polygonAt(polygon, a), this.polygonAt(polygon, b));
        for (var i = 0; i !== polygon.length; ++i) {
            if ((i + 1) % polygon.length === a || i === a) {
                continue;
            }
            if (this.isLeftOn(this.polygonAt(polygon, a), this.polygonAt(polygon, b), this.polygonAt(polygon, i + 1)) && this.isRightOn(this.polygonAt(polygon, a), this.polygonAt(polygon, b), this.polygonAt(polygon, i))) {
                l1[0] = this.polygonAt(polygon, a);
                l1[1] = this.polygonAt(polygon, b);
                l2[0] = this.polygonAt(polygon, i);
                l2[1] = this.polygonAt(polygon, i + 1);
                p = this.lineInt(l1, l2);
                if (this.sqdist(this.polygonAt(polygon, a), p) < dist) {
                    return false;
                }
            }
        }
        return true;
    }
    static sqdist(a, b) {
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        return dx * dx + dy * dy;
    }
    static lineInt(l1, l2, precision = 0) {
        precision = precision;
        var i = { x: 0, y: 0 };
        var a1, b1, c1, a2, b2, c2, det;
        a1 = l1[1].y - l1[0].y;
        b1 = l1[0].x - l1[1].x;
        c1 = a1 * l1[0].x + b1 * l1[0].y;
        a2 = l2[1].y - l2[0].y;
        b2 = l2[0].x - l2[1].x;
        c2 = a2 * l2[0].x + b2 * l2[0].y;
        det = a1 * b2 - a2 * b1;
        if (!this.scalar_eq(det, 0, precision)) {
            i.x = (b2 * c1 - b1 * c2) / det;
            i.y = (a1 * c2 - a2 * c1) / det;
        }
        return i;
    }
    static scalar_eq(a, b, precision = 0) {
        precision = precision;
        return Math.abs(a - b) <= precision;
    }
    static polygonCopy(polygon, i, j, targetPoly = []) {
        let p = targetPoly;
        this.polygonClear(p);
        if (i < j) {
            for (var k = i; k <= j; k++) {
                p.push(polygon[k]);
            }
        }
        else {
            for (var k = 0; k <= j; k++) {
                p.push(polygon[k]);
            }
            for (var k = i; k < polygon.length; k++) {
                p.push(polygon[k]);
            }
        }
        return p;
    }
    static polygonClear(polygon) {
        polygon.length = 0;
    }
    static polygonSlice(polygon, cutEdges) {
        if (cutEdges instanceof Array && cutEdges.length === 0)
            return [polygon];
        if (Array.isArray(cutEdges) && cutEdges.length && Array.isArray(cutEdges[0]) && cutEdges[0].length === 2) {
            let polys = [polygon];
            for (let i = 0; i < cutEdges.length; i++) {
                let cutEdge = cutEdges[i];
                for (let j = 0; j < polys.length; j++) {
                    let poly = polys[j];
                    let result = this.polygonSlice(poly, cutEdge);
                    if (result) {
                        polys.splice(j, 1);
                        polys.push(result[0], result[1]);
                        break;
                    }
                }
            }
            return polys;
        }
        else {
            let cutEdge = cutEdges;
            let i = -1;
            let j = -1;
            console.log(cutEdge);
            console.log(polygon);
            if (!Array.isArray(cutEdge)) {
                i = polygon.indexOf(cutEdge);
                j = polygon.indexOf(cutEdge);
            }
            else if (!isNestedArray(cutEdge)) {
                const edgeArray = cutEdge;
                i = polygon.indexOf(edgeArray[0]);
                j = polygon.indexOf(edgeArray[1]);
            }
            if (i !== -1 && j !== -1) {
                return [this.polygonCopy(polygon, i, j), this.polygonCopy(polygon, j, i)];
            }
            else {
                return [];
            }
        }
    }
}
