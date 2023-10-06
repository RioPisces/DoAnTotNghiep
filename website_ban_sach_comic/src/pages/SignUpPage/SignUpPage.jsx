import React, { useEffect, useState } from "react";
import { WrapperSignInLeft, WrapperSignInRight, WrapperTextLight } from "./style";
import { InputFormComponent } from "../../components/InputFormComponent/InputFormComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import COMICSTORE from "../../asset/img/COMICSTORE.webp";
import * as UserService from "../../service/UserService";
import { Image } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { Loading } from "../../components/LoadingComponent/Loading";
import * as message from "../../components/MessageComponent/Message";
export const SignUpPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const mutation = useMutationHooks((data) => UserService.signupUser(data));
    const { data, isLoading, isSuccess, isError } = mutation;

    useEffect(() => {
        if (isSuccess) {
            message.success();
            handleNavigateSignIn();
        } else if (isError) {
            message.error();
        }
    }, [isSuccess, isError]);

    const handleOnchangeEmail = (value) => {
        setEmail(value.target.value);
    };
    const handleOnchangePassword = (value) => {
        setPassword(value.target.value);
    };
    const handleOnchangeConfirmPassword = (value) => {
        setConfirmPassword(value.target.value);
    };
    const handleNavigateSignIn = () => {
        navigate("/sign-in");
    };
    const handleSignUp = () => {
        mutation.mutate({ email, password, confirmPassword });
        console.log("Sign Up", email === "", password, confirmPassword);
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
                    <InputFormComponent
                        id="emailInputForm"
                        style={{ marginBottom: "10px" }}
                        placeholder="Nhập gmail của bạn"
                        onChange={handleOnchangeEmail}
                    />

                    <InputFormComponent
                        id="passwordInputForm"
                        style={{ marginBottom: "10px" }}
                        placeholder="Nhập mật khẩu của bạn"
                        onChange={handleOnchangePassword}
                    />
                    <InputFormComponent
                        id="confirmPasswordInputForm"
                        placeholder="Nhập lại mật khẩu"
                        onChange={handleOnchangeConfirmPassword}
                    />
                    {data?.status === "ERR" && <span style={{ color: "red" }}>{data?.message}</span>}
                    <Loading isLoading={isLoading}>
                        <ButtonComponent
                            disabled={email === "" || password === "" || confirmPassword === ""}
                            onClick={handleSignUp}
                            textbutton="Đăng ký"
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
                        Bạn đã có tài khoản?{" "}
                        <WrapperTextLight onClick={handleNavigateSignIn} style={{ cursor: "pointer" }}>
                            {" "}
                            Đăng nhập
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
