import * as React from "react";
import {Datagrid, List, TextInput} from 'react-admin';
import {MathField} from "../@core/application/math";

const grammarFilters = [
    <TextInput label="Search" source="name" alwaysOn />,
];

export const GrammarList = (props: any) => (
    <List  filters={grammarFilters}  {...props}>
        <Datagrid rowClick="edit">
            <MathField source="name"/>
            <MathField source="terminal_symbols"/>
            <MathField source="nonterminal_symbols"/>
            <MathField source="start_symbol"/>
            <MathField source="production_rules"/>
        </Datagrid>
    </List>
);
