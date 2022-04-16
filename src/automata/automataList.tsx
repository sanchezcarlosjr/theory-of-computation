import * as React from "react";
import {Datagrid, List, TextInput} from 'react-admin';

const automataFilters = [
    <TextInput label="Search" source="name" alwaysOn />,
];

export const AutomataList = (props: any) => (
    <List  filters={automataFilters}  {...props}>
        <Datagrid rowClick="edit">
        </Datagrid>
    </List>
);