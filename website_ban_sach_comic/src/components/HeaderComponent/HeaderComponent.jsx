import React, { useEffect, useState } from "react";
import { Badge, Col, Popover } from "antd";
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall } from "./style";
import Search from "antd/es/input/Search";
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../service/UserService";
import { useDispatch, useSelector } from "react-redux";
import { resetUser } from "../../redux/slices/userSlice";
import { Loading } from "../LoadingComponent/Loading";
import { searchProduct } from "../../redux/slices/productSlice";

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [avatar, setAvatar] = useState("");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const order = useSelector((state) => state.order)

    const handleLogout = async () => {
        setLoading(true);
        await UserService.logoutUser();
        dispatch(resetUser());
        setLoading(false);
        console.log("User logged out");
    };

    useEffect(() => {
        setLoading(true);
        setAvatar(user?.avatar);
        setLoading(false);
    }, [user?.avatar]);

    const content = (
        <div>
            <WrapperContentPopup onClick={() => navigate("/profile-user")}>Thông tin người dùng</WrapperContentPopup>
            {user?.isAdmin && <WrapperContentPopup onClick={() => navigate("/system/admin")}>Quản lí hệ thống</WrapperContentPopup>}
            <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
        </div>
    );

    const onSearchBox = (e) => {
        setSearch(e);
        dispatch(searchProduct(e));
    };
    return (
        <div style={{ width: "100%", background: "rgb(26,148,255)", display: "flex", justifyContent: "center" }}>
            <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenSearch ? "space-between" : "unset" }}>
                <Col span={3}>
                    <WrapperTextHeader cursor="pointer" onClick={() => navigate('/')}>
                        COMIC STORE
                    </WrapperTextHeader>
                </Col>
                {!isHiddenSearch && (
                    <Col span={15}>
                        <Search placeholder="input search text" allowClear enterButton="Tìm kiếm" size="large" onSearch={onSearchBox} />
                    </Col>
                )}
                <Col span={6} style={{ display: "flex", gap: "54px", alignItems: "center" }}>
                    <Loading isLoading={loading}>
                        <WrapperHeaderAccount>
                            {avatar ? (
                                <img
                                    src={avatar}
                                    alt="avatar"
                                    style={{
                                        height: "60px",
                                        width: "60px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <UserOutlined style={{ fontSize: "30px" }} />
                            )}
                            {user?.access_token ? (
                                <>
                                    <Popover content={content} trigger="click">
                                        <div style={{ cursor: "pointer", textDecoration: "underline" }}>
                                            {user.name === "" ? "User" : user.name}
                                        </div>
                                    </Popover>
                                </>
                            ) : (
                                <div
                                    onClick={() => {
                                        navigate("/sign-in");
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                                    <div>
                                        <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                                        <CaretDownOutlined />
                                    </div>
                                </div>
                            )}
                        </WrapperHeaderAccount>
                    </Loading>
                    {!isHiddenCart && (
                        <div onClick={() => navigate("/order")} style={{ cursor: "pointer" }}>
                            <Badge count={order?.orderItems?.length} size="small">
                                <ShoppingCartOutlined style={{ fontSize: "30px", color: "#fff", gap: "20px" }} />
                            </Badge>
                            <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
                        </div>
                    )}
                </Col>
            </WrapperHeader>
        </div>
    );
};

export default HeaderComponent;
