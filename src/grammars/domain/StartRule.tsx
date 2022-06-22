import {ProductionRule} from "./ProductionRule";
import {TerminalSymbol} from "./TerminalSymbol";
import {NonTerminalSymbols} from "./NonTerminalSymbols";

export class StartRule extends ProductionRule {
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