import React, {useEffect, useRef} from "react";
import MathView, {MathViewRef} from "react-math-view";

export function MathFieldComponent(props: any) {
    const ref = useRef<MathViewRef>(null);
    const {children, value, ...rest} = props;

    useEffect(() => {
        const {current} = ref;
        if (current === undefined) {
            return;
        }
        // @ts-ignore
        if (current && current.value !== value && value) {
            current.value = value;
        }
    });

    return <MathView
        ref={ref}
        {...rest}
    />;
}