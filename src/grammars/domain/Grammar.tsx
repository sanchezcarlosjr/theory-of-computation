import {ProductionRule} from "./ProductionRule";
import {GrammarRecord} from "../grammarRecord";
import {useState} from "react";

export class NonTerminalSymbols {
    private symbols = new Set();
    private readonly _start_symbol: NonTerminalSymbol | undefined;

    constructor(start_symbol: NonTerminalSymbol, ...nonterminal_symbols: NonTerminalSymbol[]) {
        this._start_symbol = start_symbol;
        this.add(start_symbol);
        nonterminal_symbols.forEach((symbol) => {
            this.add(symbol);
        });
    }

    get start_symbol(): NonTerminalSymbol | undefined {
        return this._start_symbol;
    }

    isStartSymbol(start_symbol: string) {
        return this._start_symbol?.toString() === start_symbol;
    }

    has<T>(value: T) {
        return this.symbols.has(value);
    }

    add(value: any) {
        this.symbols.add(value.toString());
        this.symbols.add(value);
        return this;
    }

    toArray() {
        return Array.from(this.symbols);
    }
}

export class TerminalSymbol extends String {
}

export class NonTerminalSymbol extends String {
}

class StartRule  extends ProductionRule {
    constructor() {
        super({from: "", to: ""});
    }
    derive(derivation_string: string) {
        return derivation_string;
    }

    setSymbols(terminals: Set<TerminalSymbol>, nonterminals: NonTerminalSymbols): this {
        return this;
    }

    setAcceptableProductionRules(production_rules: ProductionRule[]) {
        production_rules.forEach((rule, index) => {
            if (rule.is_start_rule) {
                this.acceptable_rules.add(index);
            }
        });
    }
}


export function useTransducerAutomaton(production_rules: ProductionRule[], start_symbol: NonTerminalSymbol) {
    const start_state = new StartRule();
    start_state.setAcceptableProductionRules(production_rules);
    production_rules.forEach((rule) => rule.setAcceptableProductionRules(production_rules));

    const initialState = {
        history: [{from: `Start \\to ${start_symbol}`, to: start_symbol.toString(), byRule: -1}]
    };

    const [state, setState] = useState(initialState);

    const applyRule = (rule: any) => {
        const application = state.history[state.history.length-1].to;
        const result = production_rules[rule].derive(application);
        if (state.history[state.history.length-1].byRule === -1) {
            setState({history: []});
        }
        setState({
            history: [...state.history, {from: application, to: result, byRule: rule}]
        });
    }

    const reset = () => setState(initialState)

    return {
        state,
        applyRule,
        reset
    };
}

export class TransducerAutomaton {
    history: {from: string, to: string, byRule: number}[] = [];
    private start_state = new StartRule();

    constructor(private production_rules: ProductionRule[], private start_symbol: NonTerminalSymbol) {
        this.start_state.setAcceptableProductionRules(production_rules);
        this.production_rules.forEach((rule) => rule.setAcceptableProductionRules(production_rules));
        this.reset();
    }

    applyRule(rule: number) {
        if (!this.actual_state().acceptable_next_rule(rule)) {
            throw new Error("It's not acceptable production rule");
        }
        const from = this.deriveString();
        const to = this.production_rules[rule].derive(from);
        if (this.is_start_state()) {
            this.history = [];
        }
        this.history.push({from: from, to: to, byRule: rule});
    }

    actual_state() {
        if (this.is_start_state()) {
            return this.start_state;
        }
        return this.production_rules[this.actual_rule()];
    }

    private actual_rule() {
        return this.history[this.history.length - 1].byRule;
    }

    private is_start_state() {
        return this.actual_rule() === -1;
    }

    deriveString() {
        return this.history[this.history.length-1].to;
    }

    reset() {
        this.history = [{from: "", to: this.start_symbol.toString(), byRule: -1}];
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
        this._production_rules.forEach((rule) =>
            rule.setSymbols(this.terminal_symbols, this.nonterminal_symbols)
        );
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
        record.nonterminal_symbols.split(",").forEach((symbol) => non_terminals_symbols.add(symbol.trim()));
        record.terminal_symbols.split(",").forEach((symbol) => terminal_symbols.add(symbol.trim()));
        const production_rules = record
            .production_rules
            .split(",")
            .map((rule) =>
                rule.split("\\to")
                    .reduce((acc: any, actual) => ([...acc, ...actual.split("|")]), [])
                    .reduce((acc: any, actual: any, index: any, array: any[]) => (
                        [...acc, new ProductionRule({from: array[0], to: actual.trim()})]), []
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