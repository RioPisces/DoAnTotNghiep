import React, { useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Col, Pagination, Row } from "antd";
import { WrapperProduct, WrapperNavbar } from "./style";
import { useLocation, useNavigate } from "react-router-dom";
import * as ProductService from "../../service/ProductService";
import { Loading } from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";

const TypeProductPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounce(searchProduct, 500);
    const navigate = useNavigate();
    const { state } = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 10,
        total: 1,
    });

    const fetchProductOnType = async (type, page, limit) => {
        setLoading(true);
        const res = await ProductService.getProductOnType(type, page, limit);
        if (res.status === "success") {
            setLoading(false);
            setProducts(res?.data);
            setPanigate({ ...panigate, total: res?.total });
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (state) {
            fetchProductOnType(state, panigate.page, panigate.limit);
        }
    }, [state, panigate.page, panigate.limit]);
    const onChangePage = (current, pageSize) => {
        setPanigate({ ...panigate, page: current - 1, limit: pageSize });
    };
    const handleNavigate = (type) => {
        navigate("/");
    };
    return (
        <Loading isLoading={loading}>
            <div style={{ padding: "0 120px", background: "#efefef", height: "calc(100vh-64px)" }}>
                {/* <div style={{ width: "1270px", margin: "0 auto" }}> */}
                <h5 style={{ fontWeight: "inherit", fontSize: "20px", margin: "20px 0 0 0" }}>
                    <span style={{ cursor: "pointer", fontWeight: "bold" }} onClick={handleNavigate}>
                        Trang chủ
                    </span>
                    <span> - </span>{state}
                </h5>
                <Row style={{ flexWrap: "nowrap", paddingTop: "10px", height: "calc(100%-20px)" }}>
                    <WrapperNavbar span={4}>
                        <NavbarComponent></NavbarComponent>
                    </WrapperNavbar>
                    <Col span={20} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <WrapperProduct>
                            {products
                                ?.filter((pro) => {
                                    if (searchDebounce === "") {
                                        return pro;
                                    } else if (pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())) {
                                        return pro;
                                    }
                                })
                                ?.map((product) => {
                                    return (
                                        <CardComponent
                                            key={product?._id}
                                            title={product?.title}
                                            images={product?.images}
                                            type={product.type}
                                            cost={product.cost}
                                            rate={product.rate}
                                            inventory={product.inventory}
                                            description={product.description}
                                            sold={product.sold}
                                            discount={product.discount}
                                            id={product?._id}
                                        ></CardComponent>
                                    );
                                })}
                        </WrapperProduct>
                        <Pagination
                            defaultCurrent={panigate?.page + 1}
                            total={panigate?.total}
                            onChange={onChangePage}
                            style={{ textAlign: "center", marginTop: "10px" }}
                        />
                    </Col>
                </Row>
                {/* </div> */}
            </div>
        </Loading>
    );
};

export default TypeProductPage;
