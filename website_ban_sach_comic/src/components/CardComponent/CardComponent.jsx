import React from "react";
import { WrapperReportText, StyleNameProduct, WrapperPriceText, WrapperDiscountText, WrapperCardStyle } from ".";
import { StarFilled } from "@ant-design/icons";
import logo from "../../asset/img/logo.png";
import { useNavigate } from "react-router-dom";
const CardComponent = (props) => {
    const { key, title, images, type, cost, rate, inventory, description,sold,discount,id } = props;
    const navigate = useNavigate()

    const handleDetailProduct = (id) => {
        navigate(`/product-details/${id}`)
    }
    return (
        <WrapperCardStyle
            hoverable
            headStyle={{ width: "200px", height: "200px" }}
            style={{ width: 200 }}
            bodyStyle={{ padding: "10px" }}
            cover={<img alt="example" src={images} />}
            onClick={() => handleDetailProduct(id)}
        >
            <img
                alt="logo"
                src={logo}
                style={{ position: "absolute", top: "-4px", left: "-4px", borderTopLeftRadius: "3px", height: "40px", width: "50px" }}
            ></img>
            <StyleNameProduct>{title}</StyleNameProduct>
            <WrapperReportText>
                <span style={{ marginRight: "4px" }}>
                    <span>{rate}</span>
                    <StarFilled style={{ fontSize: "12px", color: "yellow" }} />
                </span>

                <span> | Da ban {sold}</span>
            </WrapperReportText>
            <WrapperPriceText>
                <span style={{ marginRight: "8px" }}> {cost?.toLocaleString()}</span>

                <WrapperDiscountText>-{discount}%</WrapperDiscountText>
            </WrapperPriceText>
        </WrapperCardStyle>
    );
};

export default CardComponent;
