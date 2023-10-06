import React, { useEffect, useState } from "react";
import { WrapperSignInLeft, WrapperSignInRight, WrapperTextLight } from "./style";
import { InputFormComponent } from "../../components/InputFormComponent/InputFormComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import COMICSTORE from "../../asset/img/COMICSTORE.webp";
import { Image } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import * as UserService from "../../service/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { Loading } from "../../components/LoadingComponent/Loading";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slices/userSlice";

export const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const location = useLocation();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const mutation = useMutationHooks((data) => UserService.loginUser(data));
    const { data, isLoading, isSuccess } = mutation;

    useEffect(() => {
        if (isSuccess) {
            if (location?.state) {
                navigate(location?.state);
            } else {
                navigate("/");
            }
            localStorage.setItem("access_token", JSON.stringify(data?.access_token));
            if (data?.access_token) {
                const decoded = jwt_decode(data?.access_token);
                if (decoded?.id) {
                    handleGetDetailsUser(decoded?.id, data?.access_token);
                }
            }
        }
    }, [isSuccess]);

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token);
        dispatch(updateUser({ ...res?.data, access_token: token }));
    };

    const handleOnchangeEmail = (value) => {
        setEmail(value.target.value);
    };
    const handleOnchangePassword = (value) => {
        setPassword(value.target.value);
    };

    const handleSignIn = () => {
        mutation.mutate({
            email,
            password,
        });
    };

    const handleNavigateSignUp = () => {
        navigate("/sign-up");
    };
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.53)", height: "100vh" }}>
            <div
                style={{
                    width: "800px",
                    height: "443px",
                    borderRadius: " 6px",
                    background: "#fff",
                    display: "flex",
                    fontSize: "16px",
                    fontFamily: "ui-sans-serif",
                }}
            >
                <WrapperSignInLeft style={{ width: "450px" }}>
                    <h1 style={{ margin: "10px 0 10px" }}>Xin chào</h1>
                    <p>Đăng nhập hoặc tạo tài khoản</p>
                    <InputFormComponent style={{ marginBottom: "10px" }} placeholder="Nhập gmail của bạn" onChange={handleOnchangeEmail} />
                    <div style={{ position: "relative" }}>
                        <InputFormComponent
                            style={{ marginBottom: "15px" }}
                            placeholder="Nhập mật khẩu của bạn"
                            onChange={handleOnchangePassword}
                        />
                    </div>
                    {data?.status === "ERR" && <span style={{ color: "red" }}>{data?.message}1</span>}
                    <Loading isLoading={isLoading}>
                        <ButtonComponent
                            disabled={email === "" || password === ""}
                            onClick={handleSignIn}
                            textbutton="Đăng nhập"
                            size={40}
                            styleButton={{
                                background: "red",
                                height: "48px",
                                width: "100%",
                                border: "none",
                                borderRadius: "4px",
                                margin: "26px 0 10px",
                            }}
                            styleTextButton={{ color: "#fff" }}
                        ></ButtonComponent>
                    </Loading>
                    <p>
                        <WrapperTextLight>Quên mật khẩu</WrapperTextLight>
                    </p>
                    <p>
                        Chưa có tài khoản{" "}
                        <WrapperTextLight onClick={handleNavigateSignUp} style={{ cursor: "pointer" }}>
                            {" "}
                            Đăng ký
                        </WrapperTextLight>
                    </p>
                </WrapperSignInLeft>
                <WrapperSignInRight>
                    <Image
                        src={COMICSTORE}
                        preview={false}
                        alt="img-logo"
                        height="100%"
                        style={{ right: "0px", borderRadius: "6px" }}
                    ></Image>
                </WrapperSignInRight>
            </div>
        </div>
    );
};
