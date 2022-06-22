import {ProductionRule} from "./ProductionRule";
import {NonTerminalSymbol} from "./NonTerminalSymbol";
import {StartRule} from "./StartRule";

export class TransducerAutomaton {
    history: { from: string, to: string, byRule: number }[] = [];
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

    deriveString() {
        return this.history[this.history.length - 1].to;
    }

    reset() {
        this.history = [{from: "", to: this.start_symbol.toString(), byRule: -1}];
    }

    private actual_rule() {
        return this.history[this.history.length - 1].byRule;
    }

    private is_start_state() {
        return this.actual_rule() === -1;
    }
}