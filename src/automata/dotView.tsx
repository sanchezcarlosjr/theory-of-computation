import {FiniteAutomaton} from "./domain/FiniteAutomaton";

export class DotView {
    constructor(private finiteAutomaton: FiniteAutomaton) {
    }

    transform(): string {
        const acceptingStates = Array.from(this.finiteAutomaton.accepting_states).join(" ");
        let nodes: string = "";
        this.finiteAutomaton.states.forEach((state) => {
            Object.keys(this.finiteAutomaton.delta[state]).forEach((symbol) => {
                (this.finiteAutomaton.delta[state][symbol] as Set<string>)
                    .forEach((rState) =>
                        nodes = nodes + `${state} -> ${rState} [label = "${symbol}"];`);
            })
        });
        return `
        digraph finite_state_machine {
            \tfontname="Helvetica,Arial,sans-serif"
            \tnode [fontname="Helvetica,Arial,sans-serif"]
            \tedge [fontname="Helvetica,Arial,sans-serif"]
            \trankdir=LR;
            \tnode [shape = doublecircle]; ${acceptingStates};
            \tnode [shape = circle];
              ${nodes}
            }
        `;
    }
}