import * as React from "react";
import {Datagrid, List, TextField, TextInput} from 'react-admin';

const automataFilters = [
    <TextInput label="Search" source="name" alwaysOn />,
];

export const AutomataList = (props: any) => (
    <List  filters={automataFilters}  {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name"/>
        </Datagrid>
    </List>
);