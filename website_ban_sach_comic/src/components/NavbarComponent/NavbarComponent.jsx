import React from "react";
import { WrapperContent, WrapperLabel, WrapperTextValue } from "./style";
import { Checkbox, Rate } from "antd";

const NavbarComponent = () => {
    const onChange = () => {};
    const renderContent = (type, options) => {
        switch (type) {
            case "text":
                return options.map((option) => {
                    return <WrapperTextValue>{option}</WrapperTextValue>;
                });
            case "checkbox":
                return (
                    <Checkbox.Group style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }} onChange={onChange}>
                        {options.map((option) => {
                            return (
                                <Checkbox style={{ marginLeft: 0 }} value="option.value">
                                    {option.label}
                                </Checkbox>
                            );
                        })}
                    </Checkbox.Group>
                );
            case "star":
                return options.map((option) => {
                    return (
                        <div style={{ display: "flex" }}>
                            <Rate style={{ fontSize: "12px" }} disabled defaultValue={option} />
                            <span>{`tu ${option} sao`}</span>
                        </div>
                    );
                });
            case "price":
                return options.map((option) => {
                    return (
                        <div>
                            <div style={{ padding:'4px',borderRadius: "10px", backgroundColor: "rgb(238,238,238)",color:'rgb(56,56,61)', width:'fit-content' }}>{option}</div>
                        </div>
                    );
                });
            default:
                return {};
        }
    };
    return (
        <div>
            <WrapperLabel>Label1</WrapperLabel>
            <WrapperContent>
                {renderContent("text", ["Sach1", "Sach2", "Sach3", "Sach4"])}
                {/* {renderContent("checkbox", [
                    { value: "a", label: "a" },
                    { value: "b", label: "b" },
                ])}
                {renderContent("star", [3, 4, 5])}
                {renderContent("price", ["duoi 400000", "tren 400000"])} */}
            </WrapperContent>
        </div>
    );
};

export default NavbarComponent;
