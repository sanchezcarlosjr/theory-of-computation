import {SimpleForm, TextInput} from "react-admin";
import * as React from "react";
import {useFormState} from "react-final-form";
import {NondeterministicFiniteAutomaton} from "./domain/NondeterministicFiniteAutomaton";
import Graphviz from "graphviz-react";
import {DotView} from "./dotView";

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


const DeterministicFiniteAutomatonInput = () => {
    const {values} = useFormState();
    try {
        const json = JSON.parse(values['nfa']);
        const nondeterministicFiniteAutomatonInput = new NondeterministicFiniteAutomaton(json);
        const dotView = new DotView(nondeterministicFiniteAutomatonInput);
        return (<>
            <section>
                <h2>NFA</h2>
                <Graphviz dot={dotView.transform()}/>
            </section>
            <section>
                <h2>DFA</h2>
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