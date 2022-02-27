import {required, SimpleForm} from "react-admin";
import * as React from "react";
import {MathInput} from "../@core/application/mathInput";

// https://cortexjs.io/mathlive/demo/
const initialValue =
    "\\begin{equation*} G=\\left\\lbrace terminal:\\left\\lbrace a\\right\\rbrace,nonterminal:\\left\\lbrace\\Sigma,S\\right\\rbrace,start\\_symbol:\\Sigma,production\\_rules:\\left\\lbrace\\Sigma\\to S,S\\to\\lambda,S\\to a\\rbrace\\right\\rbrace\\right \\end{equation*}";
export const GrammarForm = (props: any) => (
    <SimpleForm warnWhenUnsavedChanges {...props}>
            <MathInput source="grammar" initialValue={initialValue} label="Grammar" validate={required("A grammar is required")} />
    </SimpleForm>
)