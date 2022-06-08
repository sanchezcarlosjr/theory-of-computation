import * as React from "react";
import {Create, Edit} from 'react-admin';
import {GrammarForm} from "./grammarForm";


export const GrammarCreate = (props: any) => (
    <Create  {...props}>
        <GrammarForm redirect="edit" />
    </Create>
);

export const GrammarEdit = (props: any) => (
    <Edit {...props}>
        <GrammarForm  redirect={false} />
    </Edit>
);