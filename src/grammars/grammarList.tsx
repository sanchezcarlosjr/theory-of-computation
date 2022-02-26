import * as React from "react";
import {List, Datagrid, TextField } from 'react-admin';

export const GrammarList = (props: any) => (
    <List {...props}>
        <Datagrid>
            <TextField source="name"/>
        </Datagrid>
    </List>
);
