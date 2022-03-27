import {ProductionRule} from "./ProductionRule";
import {GrammarRecord} from "../grammarRecord";

export class NonTerminalSymbols {
    private symbols = new Set();

    constructor(start_symbol: NonTerminalSymbol, ...nonterminal_symbols: NonTerminalSymbol[]) {
        this.add(start_symbol);
        nonterminal_symbols.forEach((symbol) => {
            this.add(symbol);
        });
    }

    has<T>(value: T) {
        return this.symbols.has(value);
    }

    add(value: any) {
        this.symbols.add(value.toString());
        this.symbols.add(value);
        return this;
    }
}

export class TerminalSymbol extends String {
}

export class NonTerminalSymbol extends String {
}


export class TransducerAutomaton {
    private derivative_string: String = "";

    constructor(private production_rules: ProductionRule[], private start_symbol: NonTerminalSymbol) {
        this.reset();
    }

    applyRule(rule: number) {
        this.derivative_string = this.production_rules[rule].derive(this.derivative_string);
    }

    deriveString() {
        return this.derivative_string;
    }

    reset() {
        this.derivative_string = this.start_symbol;
    }
}

export class Grammar {
    constructor(
        private _name: string,
        private _terminal_symbols: Set<TerminalSymbol>,
        private _nonterminal_symbols: NonTerminalSymbols,
        private _production_rules: ProductionRule[],
        private _start_symbol: NonTerminalSymbol
    ) {
        this.ensureStartSymbolIsNonTerminalSymbolSet();
    }

    get name(): string {
        return this._name;
    }

    get terminal_symbols(): Set<TerminalSymbol> {
        return this._terminal_symbols;
    }

    get nonterminal_symbols(): NonTerminalSymbols {
        return this._nonterminal_symbols;
    }

    get production_rules(): ProductionRule[] {
        return this._production_rules;
    }

    get start_symbol(): NonTerminalSymbol {
        return this._start_symbol;
    }

    static parse(record: GrammarRecord) {
        const start_symbol = new NonTerminalSymbol(record.start_symbol);
        const non_terminals_symbols = new NonTerminalSymbols(start_symbol);
        const terminal_symbols = new Set<TerminalSymbol>();
        record.nonterminal_symbols.split(",").forEach((symbol) => non_terminals_symbols.add(symbol));
        record.terminal_symbols.split(",").forEach((symbol) => terminal_symbols.add(symbol));
        const production_rules = record
            .production_rules
            .split(",")
            .map((rule) =>
                rule.split("\\to")
                    .reduce((acc: any, actual) => ([...acc, ...actual.split("|")]), [] )
                    .reduce((acc: any, actual: any, index: any, array: any[]) =>  (
                        [...acc, new ProductionRule({from: array[0], to: actual})]), []
                    )
                    .splice(1)
            ).flat();
        return new Grammar(record.name, terminal_symbols, non_terminals_symbols, production_rules, start_symbol);
    }

    buildTransducerAutomaton(): TransducerAutomaton {
        return new TransducerAutomaton(this._production_rules, this._start_symbol);
    }

    private ensureStartSymbolIsNonTerminalSymbolSet() {
        if (!this._nonterminal_symbols.has(this._start_symbol)) {
            throw new Error("Start symbol is not a non terminal symbol.");
        }
    }
}