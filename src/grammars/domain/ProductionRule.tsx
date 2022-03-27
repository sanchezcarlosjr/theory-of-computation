import {NonTerminalSymbols, TerminalSymbol} from "./Grammar";

interface ConstructorParams {
    from: string;
    to: string;
}

export class ProductionRule {
    constructor(private rule: ConstructorParams) {
    }

    derive(derivative_string: String) {
        return derivative_string.replace(this.rule.from, this.rule.to);
    }

    setSymbols(terminals: Set<TerminalSymbol>, nonterminals: NonTerminalSymbols) {
        // TODO
    }
}