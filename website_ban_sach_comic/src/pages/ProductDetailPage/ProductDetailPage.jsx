import React from "react";
import { ProductDetailComponent } from "../../components/ProductDetailComponent/ProductDetailComponent";
import { useNavigate, useParams } from "react-router-dom";

export const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const handleNavigate = (type) => {
        navigate('/')
    }
    return (
        <div style={{ padding: "0 120px", background: "#efefef", height: "100vh" }}>
            <h5 style={{ fontWeight: "inherit", fontSize: "20px", margin: "20px 0" }}>
                <span style={{ cursor: "pointer", fontWeight: "bold" }} onClick={handleNavigate}>
                    Trang chủ
                </span>
                <span> - </span>Chi tiết sản phẩm
            </h5>
            <ProductDetailComponent idProduct={id}></ProductDetailComponent>
            <div style={{ display: "flex", background: "#fff" }}></div>
        </div>
    );
};
