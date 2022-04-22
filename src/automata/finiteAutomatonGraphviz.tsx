import {FiniteAutomaton} from "./domain/FiniteAutomaton";
import Graphviz from "graphviz-react";
import * as React from "react";

export const FiniteAutomatonGraphviz = ({finiteAutomaton}: { finiteAutomaton: FiniteAutomaton }) => {
    let acceptingStates = Array.from(finiteAutomaton.accepting_states).join(" ");
    acceptingStates = acceptingStates === "" || acceptingStates === " " ? "" : `node [shape = doublecircle]; ${acceptingStates};`;
    let nodes: string = "";
    finiteAutomaton.iterate((state, symbol, rState) =>
        nodes = nodes + `${state === "NULL" ? "Ø" : state} -> ${rState === "NULL" ? "Ø" : rState} [label = "${symbol === "" ? "λ" : symbol}"];`
    );
    return <Graphviz dot={`
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
        `}/>;
}