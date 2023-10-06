import React, { useEffect, useState } from "react";
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from "./style";
import { InputFormComponent } from "../../components/InputFormComponent/InputFormComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import * as UserService from "../../service/UserService";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/MessageComponent/Message";
import { Loading } from "../../components/LoadingComponent/Loading";
import { updateUser } from "../../redux/slices/userSlice";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";
export const ProfilePage = () => {
    const user = useSelector((state) => state.user);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [avatar, setAvatar] = useState("");

    const mutation = useMutationHooks((data) => {
        const { id, access_token, ...rests } = data;
        UserService.updateUser(id, rests, access_token);
    });
    const dispatch = useDispatch();
    const { data, isLoading, isSuccess, isError } = mutation;

    useEffect(() => {
        setName(user?.name);
        setEmail(user?.email);
        setPhone(user?.phone);
        setAddress(user?.address);
        setAvatar(user?.avatar);
    }, [user]);

    useEffect(() => {
        if (isSuccess) {
            message.success();
            handleGetDetailsUser(user?.id, user?.access_token);
        } else if (isError) {
            message.error();
        }
    }, [isSuccess, isError]);

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token);
        dispatch(updateUser({ ...res?.data, access_token: token }));
    };
    const handleOnchangeName = (value) => {
        setName(value);
    };
    const handleOnchangeEmail = (value) => {
        setEmail(value);
    };
    const handleOnchangePhone = (value) => {
        setPhone(value);
    };
    const handleOnchangeAddress = (value) => {
        setAddress(value);
    };
    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview);
    };

    const handleUpdate = () => {
        mutation.mutate({ id: user?.id, name, email, phone, address, avatar, access_token: user?.access_token });
    };
    return (
        <div stlye={{ width: "1270px", margin: "0 auto", height: "500px" }}>
            <WrapperHeader>Thông tin người dùng</WrapperHeader>
            <Loading isLoading={isLoading}>
                <WrapperContentProfile>
                    <WrapperInput>
                        <WrapperLabel htmlFor="name">Name</WrapperLabel>
                        <InputFormComponent /* style={{width: '300px'}} */ id="name" value={name} onChange={handleOnchangeName} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            textbutton="Cập nhật"
                            size={40}
                            styleButton={{
                                height: "30px",
                                width: "100px",
                                padding: "6px",
                                border: "1px solid rgb(11, 116, 229)",
                                borderRadius: "4px",
                                lineHeight: "15px",
                            }}
                            styleTextButton={{ color: "rgb(11, 116, 229)", fontSize: "15px", fontWeight: "700" }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="email">Email</WrapperLabel>
                        <InputFormComponent /* style={{width: '300px'}} */ id="email" value={email} onChange={handleOnchangeEmail} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            textbutton="Cập nhật"
                            size={40}
                            styleButton={{
                                height: "30px",
                                width: "100px",
                                padding: "6px",
                                border: "1px solid rgb(11, 116, 229)",
                                borderRadius: "4px",
                                lineHeight: "15px",
                            }}
                            styleTextButton={{ color: "rgb(11, 116, 229)", fontSize: "15px", fontWeight: "700" }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="phone">Phone</WrapperLabel>
                        <InputFormComponent /* style={{width: '300px'}} */ id="phone" value={phone} onChange={handleOnchangePhone} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            textbutton="Cập nhật"
                            size={40}
                            styleButton={{
                                height: "30px",
                                width: "100px",
                                padding: "6px",
                                border: "1px solid rgb(11, 116, 229)",
                                borderRadius: "4px",
                                lineHeight: "15px",
                            }}
                            styleTextButton={{ color: "rgb(11, 116, 229)", fontSize: "15px", fontWeight: "700" }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="address">Address</WrapperLabel>
                        <InputFormComponent /* style={{width: '300px'}} */ id="address" value={address} onChange={handleOnchangeAddress} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            textbutton="Cập nhật"
                            size={40}
                            styleButton={{
                                height: "30px",
                                width: "100px",
                                padding: "6px",
                                border: "1px solid rgb(11, 116, 229)",
                                borderRadius: "4px",
                                lineHeight: "15px",
                            }}
                            styleTextButton={{ color: "rgb(11, 116, 229)", fontSize: "15px", fontWeight: "700" }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
                        <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </WrapperUploadFile> 
                        {avatar && (
                            <img
                                src={avatar}
                                style={{
                                    height: "60px",
                                    width: "60px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                }}
                                alt="avatar"
                            />
                        )}
                        {/* <InputFormComponent  id="avatar" value={avatar} onChange={handleOnchangeAvatar} /> */}
                        <ButtonComponent
                            onClick={handleUpdate}
                            textbutton="Cập nhật"
                            size={40}
                            styleButton={{
                                height: "30px",
                                width: "100px",
                                padding: "6px",
                                border: "1px solid rgb(11, 116, 229)",
                                borderRadius: "4px",
                                lineHeight: "15px",
                            }}
                            styleTextButton={{ color: "rgb(11, 116, 229)", fontSize: "15px", fontWeight: "700" }}
                        ></ButtonComponent>
                    </WrapperInput>
                </WrapperContentProfile>
            </Loading>
        </div>
    );
};
