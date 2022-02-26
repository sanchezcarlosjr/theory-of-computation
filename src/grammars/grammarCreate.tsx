import * as React from "react";
import {
    Create,
    SimpleForm,
    TextInput,
} from 'react-admin';

export const GrammarCreate = (props: any) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name"/>
        </SimpleForm>
    </Create>
);