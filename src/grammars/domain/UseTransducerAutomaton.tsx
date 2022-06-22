import {ProductionRule} from "./ProductionRule";
import {NonTerminalSymbol} from "./NonTerminalSymbol";
import {StartRule} from "./StartRule";
import {useState} from "react";

export function useTransducerAutomaton(production_rules: ProductionRule[], start_symbol: NonTerminalSymbol) {
    const start_state = new StartRule();
    start_state.setAcceptableProductionRules(production_rules);
    production_rules.forEach((rule) => rule.setAcceptableProductionRules(production_rules));

    const initialState = {
        history: [{from: `Start \\to ${start_symbol}`, to: start_symbol.toString(), byRule: -1}],
        language: new Set<string>()
    };
    const [state, setState] = useState(initialState);

    const applyRule = (rule: any) => {
        const application = state.history[state.history.length - 1].to;
        const result = production_rules[rule].derive(application);
        if (state.history[state.history.length - 1].byRule === -1) {
            setState({history: [], language: new Set(state.language)});
        }
        setState({
            history: [...state.history, {from: application, to: result, byRule: rule}],
            language: new Set(state.language)
        });
        if (production_rules[rule].is_a_terminal_rule) {
            setState({
                history: [{from: `Start \\to ${start_symbol}`, to: start_symbol.toString(), byRule: -1}],
                language: new Set(state.language.add((result === "") ? "\\lambda" : result))
            });
        }
    }

    const reset = () => setState(initialState);

    return {
        state, applyRule, reset
    };
}