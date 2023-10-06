import React, { Fragment, useEffect, useRef, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperButtonMore, WrapperProduct, WrapperTypeProduct } from "./style.js";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import Slider1 from "../../asset/img/Slider1.webp";
import Slider2 from "../../asset/img/Slider2.webp";
import Slider3 from "../../asset/img/Slider3.webp";
import CardComponent from "../../components/CardComponent/CardComponent";
import * as ProductService from "../../service/ProductService";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { Loading } from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";

const HomePage = () => {
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(6);
    const [typeProduct, setTypeProduct] = useState([]);
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounce(searchProduct, 500);

    const fetchProductAll = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1];
        const search = context?.queryKey && context?.queryKey[2];
        const res = await ProductService.getAllProduct(search, limit);

        return res;
    };
    const fetchAllTypeProduct = async (context) => {
        const res = await ProductService.getAllTypeProduct();
        if (res?.status === "success") {
            setTypeProduct(res?.data);
        }
        /* return res; */
    };
    useEffect(() => {
        fetchAllTypeProduct();
    }, []);
    const {
        isLoading,
        data: products,
        isPreviousData,
    } = useQuery(["products", limit, searchDebounce], fetchProductAll, {
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true,
    });

    return (
        <Loading isLoading={isLoading || loading}>
            <div style={{ width: "1270px", margin: "0 auto" }}>
                <WrapperTypeProduct>
                    {typeProduct.map((product) => {
                        return <TypeProduct name={product} key={product}></TypeProduct>;
                    })}
                </WrapperTypeProduct>
            </div>
            <div className="body" style={{ width: "100%", backgroundColor: "#efefef" }}>
                <div id="container" style={{ margin: "0 auto", height: "2000px", width: "1270px " }}>
                    <SliderComponent arrImages={[Slider1, Slider2, Slider3]} />
                    <WrapperProduct>
                        {products?.data?.map((product) => {
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
                    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "10px" }}>
                        <WrapperButtonMore
                            textbutton="Xem thêm"
                            type="outline"
                            styleButton={{
                                border: "1px solid rgb(11,116,229) ",
                                color: `${products?.total === products?.data?.length ? "#ccc" : "rgb(11,116,229)"}`,
                                width: "240px",
                                height: "38px",
                                borderRadius: "4px",
                            }}
                            disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                            onClick={() => setLimit((prev) => prev + 6)}
                        ></WrapperButtonMore>
                    </div>
                    {/* <NavbarComponent></NavbarComponent> */}
                </div>
            </div>
        </Loading>
    );
};

export default HomePage;
