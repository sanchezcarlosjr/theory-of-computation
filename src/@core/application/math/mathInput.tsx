import {useInput} from "react-admin";
import {MathFieldComponent} from "./mathFieldComponent";

export const MathInput = (props: any) => {
    const {
        input: {name, onChange, ...rest}
    } = useInput(props);
    return (
        <MathFieldComponent
            onContentDidChange={(e: { getValue: () => any; }) =>onChange(e.getValue()) }
            virtualKeyboardMode="manual"
            {...rest}
        />
    );
}