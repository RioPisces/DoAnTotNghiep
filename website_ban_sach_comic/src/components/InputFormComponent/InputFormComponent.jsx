import React from "react";
import { WrapperInputStyle } from "./style";

export const InputFormComponent = (props) => {
    const { placeholder = "Nhập", ...rests } = props;
    const handleOnchangeInput = (e) => {
        props.onChange(e);
    };
    return (
        <>
            <WrapperInputStyle placeholder={placeholder} value={props.value} name={props.name} {...rests} onChange={handleOnchangeInput} />
            {/* <span>An</span> */}
        </>
    );
};
