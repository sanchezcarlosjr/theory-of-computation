import {breakTokens} from "./BreakTokens";
import {NonTerminalSymbols} from "./NonTerminalSymbols";
import {TerminalSymbol} from "./TerminalSymbol";

interface ConstructorParams {
    from: string;
    to: string;
}

export class ProductionRule {
    protected acceptable_rules: Set<number> = new Set<number>();
    protected from = [] as string[];
    protected to = [] as string[];
    private terminals = new Set<TerminalSymbol>();
    private nonterminals = new NonTerminalSymbols("");

    constructor(private rule: ConstructorParams) {
    }

    private _backusFormRightSide: string[] = [];

    get backusFormRightSide(): string[] {
        return this._backusFormRightSide;
    }

    private _backusFormLeftSide: string[] = [];

    get backusFormLeftSide(): string[] {
        return this._backusFormLeftSide;
    }

    get normalFormRightSide(): string[] {
        return this.to;
    }

    private _position: number = 0;

    get position(): number {
        return this._position;
    }

    set position(value: number) {
        this._position = value;
    }

    private _is_a_terminal_rule = false;

    get is_a_terminal_rule(): boolean {
        return this._is_a_terminal_rule;
    }

    private _type: number = 3;

    get type(): number {
        return this._type;
    }

    private _is_start_rule = false;

    get is_start_rule(): boolean {
        return this._is_start_rule;
    }

    get applicationString() {
        return this.rule?.to ?? "";
    }

    get fromString() {
        return this.rule?.from ?? "";
    }

    acceptable_next_rule(production_rule: number) {
        return true;
    }

    derive(derivative_string: String) {
        if (this.rule.to === "\\lambda" || this.rule.to === "\\epsilon") {
            return derivative_string.replace(this.rule.from, "");
        }
        return derivative_string.replace(this.rule.from, this.rule.to);
    }

    showAsChomskyForm() {
        return `${this.rule.from}\\to ${this.rule.to}`;
    }

    setSymbols(terminals: Set<TerminalSymbol>, nonterminals: NonTerminalSymbols) {
        this.terminals = terminals;
        this.nonterminals = nonterminals;
        this._is_start_rule = nonterminals.isStartSymbol(this.rule.from);
        const symbols = new Set([...Array.from(terminals), ...nonterminals.toArray()].map((x) => x.toString()));
        this.from = breakTokens(this.rule.from, symbols);
        this.to = breakTokens(this.rule.to, symbols);
        this._is_a_terminal_rule = !this.to.some((toSymbol) => this.nonterminals.has(toSymbol));
        this.determineType();
        this._backusFormRightSide = this.to.map((x) => {
            if(this.nonterminals.has(x)) {
                return `<${x}>`;
            }
            if(this.terminals.has(x)) {
                return x;
            }
            return "";
        });
        this._backusFormLeftSide = this.from.map((x) => {
            if(this.nonterminals.has(x)) {
                return `<${x}>`;
            }
            if(this.terminals.has(x)) {
                return x;
            }
            return "";
        });
        return this;
    }

    setAcceptableProductionRules(production_rules: ProductionRule[]) {
        for (let i = 0; i < production_rules.length; i++) {
            if (production_rules[i].rule.from.match(this.rule.to)) {
                this.acceptable_rules.add(i);
            }
        }
    }

    isReduceBy(str: string) {
        return this.rule.to === str;
    }

    inverse(derivative_string: string) {
        return derivative_string.replace(this.rule.to, this.rule.from);
    }

    private determineType() {
        if (this.from.length > this.to.length) {
            this._type = 0;
            return;
        }
        if (this.from.length >= 2) {
            this._type = 1;
            return;
        }
        const all_terminals = this.to.filter((toSymbol) => this.nonterminals.has(toSymbol));
        if (all_terminals.length >= 2) {
            this._type = 2;
            return;
        }
        if (this.nonterminals.has(this.to[0]) && this.to.length !== 1) {
            this._type = 3.1;
            return;
        }
        if (this.nonterminals.has(this.to[this.to.length - 1]) && this.to.length !== 1) {
            this._type = 3.2;
            return;
        }
        this._type = 3;
    }

    isDerivativeBy(str: string) {
        return this.rule.from === str;
    }
}