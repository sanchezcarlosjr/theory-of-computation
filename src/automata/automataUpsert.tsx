import {Create, Edit} from "react-admin";
import * as React from "react";
import {AutomataForm} from "./automataForm";

export const AutomataCreate = (props: any) => (
    <Create {...props}>
        <AutomataForm redirect="edit"/>
    </Create>
);

export const AutomataEdit = (props: any) => (
    <Edit {...props}>
        <AutomataForm redirect={false}/>
    </Edit>
);
