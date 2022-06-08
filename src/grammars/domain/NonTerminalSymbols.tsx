import {NonTerminalSymbol} from "./NonTerminalSymbol";

export class NonTerminalSymbols {
    private symbols = new Set();
    private readonly _start_symbol: NonTerminalSymbol | undefined;

    constructor(start_symbol: NonTerminalSymbol, ...nonterminal_symbols: NonTerminalSymbol[]) {
        this._start_symbol = start_symbol.toString();
        this.add(start_symbol);
        nonterminal_symbols.forEach((symbol) => {
            this.add(symbol);
        });
    }

    get start_symbol(): NonTerminalSymbol | undefined {
        return this._start_symbol;
    }

    isStartSymbol(start_symbol: string) {
        return this._start_symbol === start_symbol;
    }

    has<T>(value: T) {
        return this.symbols.has(value);
    }

    add(value: any) {
        this.symbols.add(value);
        return this;
    }

    toArray(): string[] {
        return Array.from(this.symbols) as string[];
    }
}