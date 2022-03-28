import {NonTerminalSymbols, TerminalSymbol} from "./Grammar";

interface ConstructorParams {
    from: string;
    to: string;
}

export class ProductionRule {
    protected acceptable_rules: Set<number> = new Set<number>();

    constructor(private rule: ConstructorParams) {
    }

    private _is_start_rule = false;

    get is_start_rule(): boolean {
        return this._is_start_rule;
    }

    acceptable_next_rule(production_rule: number) {
        return true;
    }

    derive(derivative_string: String) {
        return derivative_string.replace(this.rule.from, this.rule.to);
    }

    showAsChomskyForm() {
        return `${this.rule.from}\\to ${this.rule.to}`;
    }

    setSymbols(terminals: Set<TerminalSymbol>, nonterminals: NonTerminalSymbols) {
        this._is_start_rule = nonterminals.isStartSymbol(this.rule.from);
        return this;
    }

    setAcceptableProductionRules(production_rules: ProductionRule[]) {
        for (let i = 0; i < production_rules.length; i++) {
            if(production_rules[i].rule.from.match(this.rule.to)) {
                this.acceptable_rules.add(i);
            }
        }
    }

}