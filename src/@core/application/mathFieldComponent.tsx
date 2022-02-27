import React, {useEffect, useRef} from "react";
import "mathlive/dist/mathlive-fonts.css";
import {MathfieldElement} from "mathlive";

export function MathFieldComponent(props: any) {
    new MathfieldElement();
    const ref = useRef();
    const {children, value, onChange, ...rest} = props;

    function invokeCallback(event: any) {
        if (onChange) {
            onChange(event, ref.current);
        }
    }

    useEffect(() => {
        const {current} = ref;
        if (current === undefined) {
            return;
        }
        // @ts-ignore
        if (ref && ref.current && ref.current.value !== value && value) {
            // @ts-ignore
            ref.current.value = value;
        }
        // @ts-ignore
        current.addEventListener('input', invokeCallback);
        return () => {
            // @ts-ignore
            current.removeEventListener('input', invokeCallback);
        }
    });

    // @ts-ignore
    return <math-field ref={ref} virtual-keyboard-mode="manual" {...rest}></math-field>;
}