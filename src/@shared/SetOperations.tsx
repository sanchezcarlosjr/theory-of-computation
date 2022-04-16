export function union(setA: Set<any>, setB: Set<any>|Array<any>) {
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
