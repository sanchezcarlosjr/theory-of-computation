import * as React from "react";
import {List, TextInput, Datagrid, TextField } from 'react-admin';

const grammarFilters = [
    <TextInput label="Search" source="q" alwaysOn />,
];

export const GrammarList = (props: any) => (
    <List  filters={grammarFilters}  {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name"/>
            <TextField source="terminal_symbols"/>
            <TextField source="nonterminal_symbols"/>
            <TextField source="start_symbol"/>
            <TextField source="production_rules"/>
        </Datagrid>
    </List>
);
