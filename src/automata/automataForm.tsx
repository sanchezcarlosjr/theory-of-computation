import {SimpleForm, TextInput} from "react-admin";
import * as React from "react";
import {useFormState} from "react-final-form";
import {NondeterministicFiniteAutomaton} from "./domain/NondeterministicFiniteAutomaton";
import Graphviz from "graphviz-react";
import {FiniteAutomaton} from "./domain/FiniteAutomaton";

const initialAutomata = `{
  "q0": {
      "0": ["q0", "q1"],
      "1": ["q0"]
   },
   "q1": {
      "0": [],
      "1": ["q2"]
   },
   "q2": {
      "0": [],
      "1": [],
      "accept": true
   }
}`;

const FiniteAutomatonGraphviz = ({finiteAutomaton}: {finiteAutomaton: FiniteAutomaton}) => {
    let acceptingStates = Array.from(finiteAutomaton.accepting_states).join(" ");
    acceptingStates = acceptingStates === "" || acceptingStates === " " ? "" : `node [shape = doublecircle]; ${acceptingStates};`;
    let nodes: string = "";
    finiteAutomaton.iterate((state, symbol, rState) =>
        nodes = nodes + `${state === " " || state === "" ? "Ø" : state} -> ${rState === " " || rState === "" ? "Ø" : rState} [label = "${symbol}"];`
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

const DeterministicFiniteAutomatonInput = () => {
    const {values} = useFormState();
    try {
        const json = JSON.parse(values['nfa']);
        const nondeterministicFiniteAutomaton = new NondeterministicFiniteAutomaton(json);
        const deterministicFiniteAutomaton = nondeterministicFiniteAutomaton.toDeterministicFiniteAutomaton();
        const equivalentStates  = deterministicFiniteAutomaton.findEquivalentStates();
        const minDeterministicFiniteAutomaton = deterministicFiniteAutomaton.minimize();
        return (<>
            <section>
                <h2>NFA</h2>
                <FiniteAutomatonGraphviz finiteAutomaton={nondeterministicFiniteAutomaton} />
            </section>
            <section>
                <h2>DFA</h2>
                <FiniteAutomatonGraphviz finiteAutomaton={deterministicFiniteAutomaton} />
            </section>
            <section>
                <h2>DFA Minimization</h2>
                {
                    equivalentStates.map((equivalentState, index) => (<p>p{index}:{equivalentState.join(",")}</p>))
                }
                <FiniteAutomatonGraphviz finiteAutomaton={minDeterministicFiniteAutomaton} />
            </section>
        </>);
    } catch (e: any) {
        return (<p>{e?.message}</p>);
    }
};


export const AutomataForm = (props: any) => {
    return (<SimpleForm {...props}>
        <TextInput
            initialValue={initialAutomata}
            source="nfa"
            multiline
            label="NFA"
            fullWidth
        />
        <DeterministicFiniteAutomatonInput/>
    </SimpleForm>);
}