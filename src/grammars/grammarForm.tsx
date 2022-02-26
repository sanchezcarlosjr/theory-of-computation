import {SimpleForm, TextInput} from "react-admin";
import * as React from "react";

export const GrammarForm = (props: any) => (
    <SimpleForm {...props}>
        <TextInput source="name" label="Name"/>
        <TextInput source="terminal_symbols" label="Terminal symbols" multiline/>
        <TextInput source="nonterminal_symbols" label="Nonterminal symbols" multiline/>
        <TextInput source="start_symbol" label="Start symbol" multiline/>
        <TextInput source="production_rules" label="Production rules" multiline/>
    </SimpleForm>
)