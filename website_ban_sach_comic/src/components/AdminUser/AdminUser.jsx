import { WrapperHeader, WrapperUploadFile } from "./style";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Space } from "antd";
import { DeleteOutlined, EditOutlined, SearchOutlined,UploadOutlined } from "@ant-design/icons";
import { TableComponent } from "../TableComponent/TableComponent";
import { InputFormComponent } from "../InputFormComponent/InputFormComponent";
import * as UserService from "../../service/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { Loading } from "../LoadingComponent/Loading";
import * as message from "../../components/MessageComponent/Message";
import { useQuery } from "react-query";
import { DrawerComponent } from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import { ModalComponent } from "../ModalComponent/ModalComponent";
import { getBase64 } from "../../utils";

export const AdminUser = () => {
    const [rowSelected, setRowSelected] = useState("");
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [form] = Form.useForm();
    const user = useSelector((state) => state?.user);

    const searchInput = useRef(null);

    
    const [stateUserDetail, setStateUserDetail] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        phone: "",
        isAdmin: "",
        avatar: ''
    });
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined
                    style={{ color: "red", fontSize: "24px", cursor: "pointer", margin: "0 4px" }}
                    onClick={() => setIsModalOpenDelete(true)}
                />
                <EditOutlined
                    style={{ color: "orange", fontSize: "24px", cursor: "pointer", margin: "0 4px" }}
                    onClick={handleDetailUser}
                />
            </div>
        );
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    const handleReset = (clearFilters) => {
        clearFilters();
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <InputFormComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        password="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps("name"),
        },
        {
            title: "Email",
            dataIndex: "email",
            sorter: (a, b) => a.email.length - b.email.length,
            ...getColumnSearchProps("email"),
        },
        {
            title: "Phone",
            dataIndex: "phone",
        },
        {
            title: "Address",
            dataIndex: "address",
        },
        {
            title: "IsAdmin",
            dataIndex: "isAdmin",
            filters: [
                {
                    text: "True",
                    value: true,
                },
                {
                    text: "False",
                    value: false,
                },
            ],
            filterMode: "tree",
            filterSearch: true,
            onFilter: (value, record) => {
                if (value === true) {
                    return record.isAdmin === true;
                } else {
                    return record.isAdmin === false;
                }
            },
            width: "30%",
        },

        {
            title: "Action",
            dataIndex: "action",
            render: renderAction,
        },
    ];

    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = UserService.updateUser(id, { ...rests }, token);
        return res;
    });
    const mutationDelete = useMutationHooks((data) => {
        const { id, token } = data;
        const res = UserService.deleteUser(id, token);
        return res;
    });
    const mutationDeleteMany = useMutationHooks((data) => {
        const { token, ...ids } = data;
        const res = UserService.deleteManyUser(ids, token);
        return res;
    });
    const getAllUsers = async () => {
        const res = await UserService.getAllUser();
        return res;
    };

    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate;
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete;
    const {
        data: dataDeletedMany,
        isLoading: isLoadingDeletedMany,
        isSuccess: isSuccessDeletedMany,
        isError: isErrorDeletedMany,
    } = mutationDeleteMany;
    const queryUser = useQuery(["user"], getAllUsers);
    const { data: users, isLoading: isLoadingUser } = queryUser;
    const fetchGetDetailUser = async (rowSelected) => {
        console.log(rowSelected);
        const res = await UserService.getDetailsUser(rowSelected);
        if (res?.data) {
            setStateUserDetail({
                name: res?.data?.name,
                email: res?.data?.email,
                password: res?.data?.password,
                address: res?.data?.address,
                phone: res?.data?.phone,
                isAdmin: res?.data?.isAdmin,
                avatar: res?.data?.avatar,
            });
        }
        setIsLoadingUpdate(false);
        /* return res; */
    };

    useEffect(() => {
        form.setFieldsValue(stateUserDetail);
    }, [form, stateUserDetail]);

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true);
            fetchGetDetailUser(rowSelected);
        }
    }, [rowSelected,isOpenDrawer]);

    const handleDetailUser = () => {
        setIsOpenDrawer(true);
    };

    const dataTable =
        users?.data?.length &&
        users?.data?.map((user) => {
            return { ...user, key: user._id, isAdmin: user.isAdmin ? "True" : "False" };
        });

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === "success") {
            message.success();
            handleCancelDrawer();
        } else if (isErrorUpdated && (dataUpdated?.status === "OK" || dataUpdated?.status === "ERR")) {
            message.error();
        }
    }, [isSuccessUpdated]);
    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === "success") {
            message.success();
            handleCancelDelete();
        } else if (isErrorDeleted && (dataDeleted?.status === "OK" || dataDeleted?.status === "ERR")) {
            message.error();
        }
    }, [isSuccessDeleted]);
    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === "success") {
            message.success();
        } else if (isErrorDeletedMany && (dataDeletedMany?.status === "OK" || dataDeletedMany?.status === "ERR")) {
            message.error();
        }
    }, [isSuccessDeletedMany]);
    const handleCancelDrawer = () => {
        setIsOpenDrawer(false);
        setStateUserDetail({
            name: "",
            email: "",
            password: "",
            address: "",
            phone: "",
            isAdmin: "",
            avatar: "",
        });
        form.resetFields();
    };
    const handleOnchangeAvatarDetail = async({fileList}) =>{
        const file = fileList[0]
        if(!file.url && !file.preview){
            file.preview =await getBase64(file.originFileObj);
        }
        setStateUserDetail({
            ...stateUserDetail,
            avatar: file.preview    
        })
    }
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };
    const handleDeleteUser = () => {
        mutationDelete.mutate(
            { id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    queryUser.refetch();
                },
            }
        );
    };
    const handleDeleteManyUser = (ids) => {
        mutationDeleteMany.mutate(
            { ids: ids, token: user?.access_token },
            {
                onSettled: () => {
                    queryUser.refetch();
                },
            }
        );
    };
    const onUpdateUser = () => {
        mutationUpdate.mutate(
            { id: rowSelected, token: user?.access_token, ...stateUserDetail },
            {
                onSettled: () => {
                    queryUser.refetch();
                },
            }
        );
    };

    const handleOnchangeDetail = (e) => {
        setStateUserDetail({
            ...stateUserDetail,
            [e.target.name]: e.target.value,
        });
    };
    console.log('stateUserDetail', stateUserDetail);
    return (
        <div>
            <WrapperHeader>Quản lý người dùng</WrapperHeader>

            <div>
                <TableComponent
                    handleDeleteMany={handleDeleteManyUser}
                    columns={columns}
                    isLoading={isLoadingUser}
                    data={dataTable}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                setRowSelected(record._id);
                            }, // click row
                        };
                    }}
                    onHeaderRow={(columns, index) => {
                        return {
                            onClick: () => {}, // click header row
                        };
                    }}
                />
            </div>

            <DrawerComponent name="Chi tiết sản phẩm" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        name="basic"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        style={{ maxWidth: 600 }}
                        onFinish={onUpdateUser}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item label="name" name="name" rules={[{ required: true, message: "Tên người dùng" }]}>
                            <InputFormComponent value={stateUserDetail.name} onChange={handleOnchangeDetail} name="name" />
                        </Form.Item>
                        <Form.Item label="email" name="email" rules={[{ required: true, message: "Email của người dùng" }]}>
                            <InputFormComponent value={stateUserDetail.email} onChange={handleOnchangeDetail} name="email" />
                        </Form.Item>
                        <Form.Item label="password" name="password" rules={[{ required: true, message: "Mật khẩu" }]}>
                            <InputFormComponent value={stateUserDetail.password} onChange={handleOnchangeDetail} name="password" />
                        </Form.Item>
                        <Form.Item label="address" name="address" rules={[{ required: true, message: "Địa chỉ" }]}>
                            <InputFormComponent value={stateUserDetail.address} onChange={handleOnchangeDetail} name="address" />
                        </Form.Item>
                        <Form.Item label="phone" name="phone" rules={[{ required: true, message: "Điện thoại" }]}>
                            <InputFormComponent value={stateUserDetail.phone} onChange={handleOnchangeDetail} name="phone" />
                        </Form.Item>
                        <Form.Item label="isAdmin" name="isAdmin" rules={[{ required: true, message: "IsAdmin" }]}>
                            <InputFormComponent value={stateUserDetail.isAdmin} onChange={handleOnchangeDetail} name="isAdmin" />
                        </Form.Item>
                        {<Form.Item label="Avatar" name="avatar" rules={[{ required: true, message: "Ảnh đại diện" }]}>
                            <WrapperUploadFile onChange={handleOnchangeAvatarDetail} maxCount={1}>
                                <Button icon={<UploadOutlined />}>Upload</Button>
                                {stateUserDetail?.avatar && (
                                    <img
                                        src={stateUserDetail?.avatar}
                                        style={{
                                            height: "60px",
                                            width: "60px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            marginLeft: "10px",
                                        }}
                                        alt="avatar"
                                    />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>}
                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button password="primary" htmlType="submit">
                                Apply
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent
                forceRender
                name="Xóa người dùng"
                open={isModalOpenDelete}
                onOk={handleDeleteUser}
                onCancel={handleCancelDelete}
            >
                <Loading isLoading={isLoadingDeleted}>
                    <div>Bạn có chắc chắn muốn xóa người dùng này không</div>
                </Loading>
            </ModalComponent>
        </div>
    );
};
