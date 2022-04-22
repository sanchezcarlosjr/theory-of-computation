export function union(setA: Set<any>, setB: Set<any>|Array<any>) {
    if (setB === undefined) {
        return setA;
    }
    let _union = new Set(setA);
    for (let elem of setB) {
        _union.add(elem);
    }
    return _union;
}

export function intersection(setA: Set<any>, setB: Set<any>|Array<any>) {
    let _intersection = new Set();
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}

export function difference(setA: Set<any>, setB: Set<any>) {
    let _difference = new Set(setA);
    for (let elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
}