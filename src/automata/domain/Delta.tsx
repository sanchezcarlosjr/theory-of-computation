export interface Delta {
    [state: string]: {
        [symbol: string]: Set<string> | string | number
    }
}