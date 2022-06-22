export function breakTokens(v: string, set: Set<string>): string[] {
    if (v === undefined) {
        return [];
    }
    const array: string[] = [];
    let j = 0;
    while (j < v.length) {
        let i = j;
        let acc = "";
        while (i < v.length) {
            acc = acc + v[i];
            if (set.has(acc)) {
                array.push(acc);
                j = i;
            }
            i++;
        }
        j++;
    }
    return array;
}