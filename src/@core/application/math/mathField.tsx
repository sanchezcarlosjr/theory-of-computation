import {useRecordContext} from "react-admin";
import {MathFieldComponent} from "./mathFieldComponent";
import * as React from "react";

export const MathField = (props: any) => {
    const {source} = props;
    const record = useRecordContext(props);
    return <MathFieldComponent readOnly value={record[source]}/>;
}