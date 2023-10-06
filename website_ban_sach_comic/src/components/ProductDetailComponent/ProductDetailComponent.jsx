import { Col, Image, Rate, Row } from "antd";
import React, { useState } from "react";
import spiderman2099 from "../../asset/img/spiderman2099.webp";
import VenomVS2099 from "../../asset/img/VenomVS2099.webp";
import * as ProductService from "../../service/ProductService";

import {
    WrapperStyleColImage,
    WrapperStyleSmallImage,
    WrapperStyleNameProduct,
    WrapperStyleTextSell,
    WrapperPriceProduct,
    WrapperPriceTextProduct,
    WrapperAddressPriceProduct,
    WrapperQualityProduct,
    WrapperInputNumber,
} from "./style";
import { StarFilled, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useQuery } from "react-query";
import { Loading } from "../LoadingComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
/* import { addOrderProduct } from "../../redux/slices/orderSlice"; */

export const ProductDetailComponent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(0);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const onChange = (value) => {
        setNumProduct(Number(value));
    };
    const fetchGetDetailProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1];
        if (id) {
            const res = await ProductService.getDetailProduct(id);
            return res.data;
        }
    };

    const { isLoading, data: productDetails } = useQuery(["product-details", idProduct], fetchGetDetailProduct, { enabled: !!idProduct });
    const handleChangeCount = (type) => {
        if (type === "increase") {
            setNumProduct(numProduct + 1);
        } else if (type === "decrease") {
            setNumProduct(numProduct - 1);
        }
    };
    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate("/sign-in", { state: location?.pathname });
        } else {
            dispatch(
                /* addOrderProduct({
                    orderItems: {
                        title: productDetails?.title,
                        amount: numProduct,
                        images: productDetails?.images,
                        cost: productDetails?.cost,
                        product: productDetails?._id,
                    },
                }) */
                
            );
        }
    };
    return (
        <Loading isLoading={isLoading}>
            <Row style={{ padding: "16px", background: "#fff", borderRadius: "4px" }}>
                <Col span={10} style={{ borderRight: "1px solid #e5e5e5", paddingRight: "15px" }}>
                    <Image src={productDetails?.images} alt="image-product" preview={false}></Image>
                    <Row style={{ paddingTop: "10px", justifyContent: "space-between" }}>
                        {/* <WrapperStyleColImage span={4}>
                            <WrapperStyleSmallImage src={VenomVS2099} alt="small-image-product" preview={false}></WrapperStyleSmallImage>
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleSmallImage src={VenomVS2099} alt="small-image-product" preview={false}></WrapperStyleSmallImage>
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleSmallImage src={VenomVS2099} alt="small-image-product" preview={false}></WrapperStyleSmallImage>
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleSmallImage src={VenomVS2099} alt="small-image-product" preview={false}></WrapperStyleSmallImage>
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleSmallImage src={VenomVS2099} alt="small-image-product" preview={false}></WrapperStyleSmallImage>
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleSmallImage src={VenomVS2099} alt="small-image-product" preview={false}></WrapperStyleSmallImage>
                        </WrapperStyleColImage> */}
                    </Row>
                </Col>
                <Col span={14} style={{ padding: "0 15px 0" }}>
                    <WrapperStyleNameProduct>{productDetails?.title}</WrapperStyleNameProduct>
                    <div>
                        <Rate defaultValue={productDetails?.rate} value={productDetails?.rate} />
                        <WrapperStyleTextSell>|Đã bán {productDetails?.sold}</WrapperStyleTextSell>
                    </div>
                    <WrapperPriceProduct>
                        <WrapperPriceTextProduct>{productDetails?.cost} VND</WrapperPriceTextProduct>
                    </WrapperPriceProduct>
                    <WrapperAddressPriceProduct style={{ borderTop: "1px solid #e5e5e5" }}>
                        <span>Giao đến </span>
                        <span className="address">{user?.address}</span> -<span className="change-address"> Đổi địa chỉ</span>
                    </WrapperAddressPriceProduct>
                    <div style={{ margin: "10px 0 20px", paddingTop: "10px 0" }}>
                        <div style={{ margin: "0 0 6px 0 " }}>Số lượng </div>
                        <WrapperQualityProduct>
                            <button
                                style={{ border: "none", background: "transparent", cursor: "pointer" }}
                                onClick={() => handleChangeCount("decrease")}
                            >
                                <MinusOutlined style={{ color: "#000", fontSize: "20px" }} size="20px" />
                            </button>
                            <WrapperInputNumber onChange={onChange} value={numProduct} defaultValue={0} size="small" />
                            <button
                                style={{ border: "none", background: "transparent", cursor: "pointer" }}
                                onClick={() => handleChangeCount("increase")}
                            >
                                <PlusOutlined style={{ color: "#000", fontSize: "20px" }} size="20px " />
                            </button>
                        </WrapperQualityProduct>
                    </div>
                    <div>
                        <ButtonComponent
                            textbutton="Mua"
                            size={40}
                            styleButton={{
                                background: "rgb(255,57,69)",
                                height: "48px",
                                width: "220px",
                                border: "none",
                                borderRadius: "4px",
                            }}
                            onClick={handleAddOrderProduct}
                            styleTextButton={{ color: "#fff" }}
                        ></ButtonComponent>
                    </div>
                </Col>
            </Row>
        </Loading>
    );
};
