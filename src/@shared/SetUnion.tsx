export function union(setA: Set<any>, setB: Set<any>|Array<any>) {
    let _union = new Set(setA);
    for (let elem of setB) {
        _union.add(elem);
    }
    return _union;
}
