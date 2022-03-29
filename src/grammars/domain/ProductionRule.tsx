import {NonTerminalSymbols, TerminalSymbol} from "./Grammar";

interface ConstructorParams {
    from: string;
    to: string;
}

export function findStringFromSet(v: string, set: Set<string>): string[] {
    const array: string[] = [];
    let j = 0;
    while(j<v.length) {
        let i = j;
        let acc = "";
        while(i < v.length) {
            acc = acc + v[i];
            if(set.has(acc)) {
                array.push(acc);
                j=i;
            }
            i++;
        }
        j++;
    }
    return array;
}

export class ProductionRule {
    protected acceptable_rules: Set<number> = new Set<number>();
    protected from = [] as string[];
    protected to = [] as string[];
    private terminals = new Set<TerminalSymbol>();
    private nonterminals = new NonTerminalSymbols("");

    constructor(private rule: ConstructorParams) {
    }

    private _is_a_terminal_rule = false;

    get is_a_terminal_rule(): boolean {
        return this._is_a_terminal_rule;
    }

    private _type: number = 3.1;

    get type(): number {
        return this._type;
    }

    private _is_start_rule = false;

    get is_start_rule(): boolean {
        return this._is_start_rule;
    }

    acceptable_next_rule(production_rule: number) {
        return true;
    }

    derive(derivative_string: String) {
        return derivative_string.replace(this.rule.from, this.rule.to+" ");
    }

    showAsChomskyForm() {
        return `${this.rule.from}\\to ${this.rule.to}`;
    }

    setSymbols(terminals: Set<TerminalSymbol>, nonterminals: NonTerminalSymbols) {
        this.terminals = terminals;
        this.nonterminals = nonterminals;
        this._is_start_rule = nonterminals.isStartSymbol(this.rule.from);
        const symbols = new Set([...Array.from(terminals), ...nonterminals.toArray(), "\\lambda", "\\epsilon"]
            .map((x) => x.toString()));
        this.from = findStringFromSet(this.rule.from, symbols);
        this.to = findStringFromSet(this.rule.to, symbols);
        this._is_a_terminal_rule = !this.to.some((toSymbol) => this.nonterminals.has(toSymbol));
        this.determineType();
        return this;
    }

    setAcceptableProductionRules(production_rules: ProductionRule[]) {
        for (let i = 0; i < production_rules.length; i++) {
            if (production_rules[i].rule.from.match(this.rule.to)) {
                this.acceptable_rules.add(i);
            }
        }
    }

    private determineType() {
        if(this.from.length  > this.to.length) {
            this._type = 0;
            return;
        }
        if(this.from.length >= 2) {
            this._type = 1;
            return;
        }
        if(this.to[0] === "\\lambda"  || this.to[0] === "\\epsilon") {
            this._type = 3.1;
            return;
        }
        const all_terminals = this.to.filter((toSymbol) => this.nonterminals.has(toSymbol));
        if(all_terminals.length <= 1) {
            this._type = 3.1;
            return;
        }
        this._type = 2;
    }
}