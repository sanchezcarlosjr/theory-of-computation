import {FiniteAutomaton} from "./domain/FiniteAutomaton";

export class DotView {
    transform(finiteAutomaton: FiniteAutomaton): string {
        let acceptingStates = Array.from(finiteAutomaton.accepting_states).join(" ");
        acceptingStates = acceptingStates === "" ? "" : `node [shape = doublecircle]; ${acceptingStates};`;
        let nodes: string = "";
        finiteAutomaton.iterate((state, symbol, rState) =>
            nodes = nodes + `${state} -> ${rState} [label = "${symbol}"];`
        );
        return `
             digraph finite_state_machine {
                fontname="Helvetica,Arial,sans-serif"
                node [fontname="Helvetica,Arial,sans-serif"]
                edge [fontname="Helvetica,Arial,sans-serif"]
                rankdir=LR;
                node [shape = point ]; qi
                ${acceptingStates}
                node [shape = circle];
                qi -> ${finiteAutomaton.startState};
                ${nodes}
        }
        `;
    }
}