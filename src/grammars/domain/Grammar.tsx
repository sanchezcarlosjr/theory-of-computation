import {ProductionRule} from "./ProductionRule";

export class NonTerminalSymbols extends Set {
    constructor(...nonterminal_symbols: NonTerminalSymbol[]) {
        super(nonterminal_symbols);
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
        private name: string,
        private terminal_symbols: TerminalSymbol[],
        private nonterminal_symbols: NonTerminalSymbols,
        private production_rules: ProductionRule[],
        private start_symbol: NonTerminalSymbol
    ) {
        this.ensureStartSymbolIsNonTerminalSymbolSet();
    }

    buildTransducerAutomaton(): TransducerAutomaton {
        return new TransducerAutomaton(this.production_rules, this.start_symbol);
    }

    private ensureStartSymbolIsNonTerminalSymbolSet() {
        if (!this.nonterminal_symbols.has(this.start_symbol)) {
            throw new Error("Start symbol is not a non terminal symbol.");
        }
    }
}