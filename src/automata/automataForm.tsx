import {FormDataConsumer, RadioButtonGroupInput, SimpleForm, TextInput, useInput} from "react-admin";
import * as React from "react";
import {useFormState} from "react-final-form";
import {NondeterministicFiniteAutomaton} from "./domain/NondeterministicFiniteAutomaton";
import {FiniteAutomatonGraphviz} from "./finiteAutomatonGraphviz";
import {RegularExpression} from "../regex/domain/RegularExpression";
import TextField from '@material-ui/core/TextField';
import {debounce} from "lodash";

const DebounceTextField = (props: any) => {
    const {
        input: {name, onChange, value, ...rest},
    } = useInput(props);
    return (<TextField
            name={name}
            label={props.label}
            fullWidth
            multiline
            variant="outlined"
            onChange={debounce(onChange, 500)}
        />);
};

const initialAutomata = `
{
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
            const json = values['nfa'] ? JSON.parse(values['nfa']): {'q0': {}};
            return new NondeterministicFiniteAutomaton(json);
        })();
        const deterministicFiniteAutomaton = nondeterministicFiniteAutomaton.toDeterministicFiniteAutomaton();
        const equivalentStates = deterministicFiniteAutomaton.findEquivalentStates();
        const minDeterministicFiniteAutomaton = deterministicFiniteAutomaton.minimize();
        return (<>
            <section>
                <h2>NFA</h2>
                <FiniteAutomatonGraphviz finiteAutomaton={nondeterministicFiniteAutomaton}/>
            </section>
            <section>
                <h2>DFA</h2>
                <FiniteAutomatonGraphviz finiteAutomaton={deterministicFiniteAutomaton}/>
            </section>
            <section>
                <h2>DFA Minimization</h2>
                {equivalentStates.map((equivalentState, index) => (<p>p{index}:{equivalentState.join(",")}</p>))}
                <FiniteAutomatonGraphviz finiteAutomaton={minDeterministicFiniteAutomaton}/>
            </section>
            <section>
                <h2>JSON DFA</h2>
                {minDeterministicFiniteAutomaton.stringify()}
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
        <RadioButtonGroupInput source="representation" defaultValue={"nfa"}
                               choices={[{id: 'regex', name: 'Regex'}, {id: 'nfa', name: 'NFA'},]}/>
        <FormDataConsumer>
            {({formData, ...rest}) => (formData && formData.representation === 'regex' ? <>
                    <section>
                        <h3>Docs</h3>
                        <p>Options are *,+,|</p>
                        <p>Examples are </p>
                        <ul>
                            <li>abc</li>
                            <li>(ab)*|(s*)</li>
                            <li>(a(1|x))*|(s*(1)\*)</li>
                        </ul>
                    </section>
                    <section>
                        <h3>Your regular expression</h3>
                        <DebounceTextField
                            source="regex"
                            label="Regex"
                            fullWidth
                            variant="filled"
                        />
                    </section>
                </> : <>
                    <section>
                        <h4>Example</h4>
                        <p>It's a JSON standard.</p>
                        <TextField disabled fullWidth variant="outlined" multiline value={initialAutomata}/>
                    </section>
                    <section>
                        <h4>Your machine</h4>
                        <DebounceTextField
                            source="nfa"
                            multiline
                            label="NFA"
                            fullWidth
                        />
                    </section>
                </>)}
            {}
        </FormDataConsumer>
        <DeterministicFiniteAutomatonInput/>
    </SimpleForm>);
}