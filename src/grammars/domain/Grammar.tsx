import {ProductionRule} from "./ProductionRule";
import {GrammarRecord} from "../grammarRecord";
import {Parser} from "./Parser";
import {BottomUpParser} from "./BottomUpParser";
import {breakTokens} from "./BreakTokens";
import {GrammarTypeAutomaton} from "./GrammarTypeAutomaton";
import {TransducerAutomaton} from "./TransducerAutomaton";
import {NonTerminalSymbols} from "./NonTerminalSymbols";
import {TerminalSymbol} from "./TerminalSymbol";
import {NonTerminalSymbol} from "./NonTerminalSymbol";


export class Grammar {
    constructor(private _name: string, private _terminal_symbols: Set<TerminalSymbol>, private _nonterminal_symbols: NonTerminalSymbols, private _production_rules: ProductionRule[], private _start_symbol: NonTerminalSymbol) {
        this.ensureStartSymbolIsNonTerminalSymbolSet();
        this._production_rules.forEach((rule, index) => {
            rule.setSymbols(this.terminal_symbols, this.nonterminal_symbols);
            rule.position = index;
        });
        this.determineType();
    }

    private _type = 3;

    get type(): number {
        return this._type;
    }

    get nameType(): string {
        switch (this._type) {
            case 0:
                return "Recursively enumerable";
            case 1:
                return "Context-sensitive";
            case 2:
                return "Free context grammar";
            case 3.1:
                return "Left-regular grammar";
            case 3.2:
                return "Right-regular grammar";
            case 3:
                return "Regular grammar";
            default:
                return "Error";
        }
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

    static build(record: GrammarRecord) {
        const start_symbol = new NonTerminalSymbol(record.start_symbol);
        const non_terminals_symbols = new NonTerminalSymbols(start_symbol);
        const terminal_symbols = new Set<TerminalSymbol>();
        record.nonterminal_symbols.split(",").forEach((symbol) => non_terminals_symbols.add(symbol.trim()));
        record.terminal_symbols.split(",").forEach((symbol) => terminal_symbols.add(symbol.trim()));
        const production_rules = record
            .production_rules
            .split(",")
            .map((rule) => rule.split("\\to")
                .reduce((acc: any, actual) => ([...acc, ...actual.split("|")]), [])
                .reduce((acc: any, actual: any, index: any, array: any[]) => ([...acc, new ProductionRule({
                    from: array[0],
                    to: actual.trim()
                })]), [])
                .splice(1)).flat();
        return new Grammar(record.name, terminal_symbols, non_terminals_symbols, production_rules, start_symbol);
    }

    parse(str: string, parser: Parser = new BottomUpParser()) {
        parser.grammar = this;
        return parser.parse(str);
    }

    breakTokens(str: string) {
        const symbols = new Set([...Array.from(this.terminal_symbols), ...this.nonterminal_symbols.toArray(), "\\lambda", "\\epsilon"]
            .map((x) => x.toString()));
        return breakTokens(str, symbols);
    }

    buildTransducerAutomaton(): TransducerAutomaton {
        return new TransducerAutomaton(this._production_rules, this._start_symbol);
    }

    private ensureStartSymbolIsNonTerminalSymbolSet() {
        if (!this._nonterminal_symbols.has(this._start_symbol)) {
            throw new Error("Start symbol is not a non terminal symbol.");
        }
    }

    private determineType() {
        const automaton = new GrammarTypeAutomaton();
        this.production_rules.forEach((rule) => automaton.transit(rule.type));
        this._type = automaton.type;
    }
}