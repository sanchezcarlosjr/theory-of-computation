import {SimpleForm, TextInput, RadioButtonGroupInput, FormDataConsumer} from "react-admin";
import * as React from "react";
import {useFormState} from "react-final-form";
import {NondeterministicFiniteAutomaton} from "./domain/NondeterministicFiniteAutomaton";
import {FiniteAutomatonGraphviz} from "./finiteAutomatonGraphviz";
import {RegularExpression} from "../regex/domain/RegularExpression";

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
        const nondeterministicFiniteAutomaton = values['representation'] === 'regex' ? (() => {
            return new RegularExpression(values['regex']).compile();
        })() : (() => {
            const json = JSON.parse(values['nfa']);
            return new NondeterministicFiniteAutomaton(json);
        })();
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
            <section>
                <h2>JSON DFA</h2>
                {
                    minDeterministicFiniteAutomaton.stringify()
                }
            </section>
        </>);
    } catch (e: any) {
        return (<p>{e?.message}</p>);
    }
};


export const AutomataForm = (props: any) => {
    return (<SimpleForm {...props}>
        <TextInput
            source="name"
            label="Name"
            fullWidth
        />
        <RadioButtonGroupInput source="representation" defaultValue={"nfa"} choices={[
            { id: 'regex', name: 'Regex' },
            { id: 'nfa', name: 'NFA' },
        ]} />
        <FormDataConsumer>
            {({ formData, ...rest }) => (
                formData && formData.representation === 'regex' ? <TextInput
                    initialValue={"a"}
                    source="regex"
                    label="Regex"
                    fullWidth
                    /> : <TextInput
                    initialValue={initialAutomata}
                    source="nfa"
                    multiline
                    label="NFA"
                    fullWidth
                />
            )}
        </FormDataConsumer>
        <DeterministicFiniteAutomatonInput/>
    </SimpleForm>);
}