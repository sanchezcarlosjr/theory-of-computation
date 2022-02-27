import {MathFieldComponent} from "./mathFieldComponent";
import {useInput} from "react-admin";

export const MathInput = (props: any) => {
    const {
        input: {name, onChange, ...rest},
        meta: {touched, error},
        isRequired
    } = useInput(props);

    return (
        <MathFieldComponent
            name={name}
            label={props.label}
            onChange={onChange}
            virtual-keyboard-mode="manual"
            error={!!(touched && error)}
            helperText={touched && error}
            required={isRequired}
            {...rest}
        />
    );
}