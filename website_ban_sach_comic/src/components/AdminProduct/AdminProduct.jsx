import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Select, Space } from "antd";
import { PlusOutlined, UploadOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { TableComponent } from "../TableComponent/TableComponent";
import { InputFormComponent } from "../InputFormComponent/InputFormComponent";
import { getBase64, renderOption } from "../../utils";
import * as ProductService from "../../service/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { Loading } from "../LoadingComponent/Loading";
import * as message from "../../components/MessageComponent/Message";
import { useQuery } from "react-query";
import { DrawerComponent } from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import { ModalComponent } from "../ModalComponent/ModalComponent";

export const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState("");
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [typeSelect, setTypeSelect] = useState("");

    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [form] = Form.useForm();
    const user = useSelector((state) => state?.user);

    const searchInput = useRef(null);

    const [stateProduct, setStateProduct] = useState({
        title: "",
        images: "",
        type: "",
        author: "",
        cost: "",
        rate: "",
        inventory: "",
        description: "",
        discount: "",
        sold: "",
        newType: "",
    });
    const [stateProductDetail, setStateProductDetail] = useState({
        title: "",
        images: "",
        type: "",
        author: "",
        cost: "",
        rate: "",
        inventory: "",
        description: "",
        discount: "",
        sold: "",
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
                    onClick={handleDetailProduct}
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
                        type="primary"
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
            title: "Title",
            dataIndex: "title",
            sorter: (a, b) => a.title.length - b.title.length,
            ...getColumnSearchProps("title"),
        },
        {
            title: "Cost",
            dataIndex: "cost",
            sorter: (a, b) => a.cost - b.cost,
            filters: [
                {
                    text: ">=50",
                    value: ">=",
                },
                {
                    text: "<50",
                    value: "<",
                },
            ],
            filterMode: "tree",
            filterSearch: true,
            onFilter: (value, record) => {
                if (value === ">=") {
                    return record.cost >= 50;
                } else {
                    return record.cost < 50;
                }
            },
            width: "30%",
        },
        {
            title: "Rate",
            dataIndex: "rate",
            sorter: (a, b) => a.rate - b.rate,
            filters: [
                {
                    text: ">=3",
                    value: ">=",
                },
                {
                    text: "<3",
                    value: "<",
                },
            ],
            filterMode: "tree",
            filterSearch: true,
            onFilter: (value, record) => {
                if (value === ">=") {
                    return record.rate >= 3;
                } else {
                    return record.rate < 3;
                }
            },
            width: "30%",
        },
        {
            title: "Type",
            dataIndex: "type",
        },
        {
            title: "Action",
            dataIndex: "action",
            render: renderAction,
        },
    ];

    const mutation = useMutationHooks((data) => {
        const { title, images, type, author, cost, rate, inventory, description, discount, sold } = data;
        const res = ProductService.createProduct({ title, images, type, author, cost, rate, inventory, description, discount, sold });
        return res;
    });
    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = ProductService.updateProduct(id, token, { ...rests });
        return res;
    });
    const mutationDelete = useMutationHooks((data) => {
        const { id, token } = data;
        const res = ProductService.deleteProduct(id, token);
        return res;
    });
    const mutationDeleteMany = useMutationHooks((data) => {
        const { token, ...ids } = data;
        const res = ProductService.deleteManyProduct(ids, token);
        return res;
    });
    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct();
        return res;
    };
    const handleDeleteManyProduct = (ids) => {
        mutationDeleteMany.mutate(
            { ids: ids, token: user?.access_token },
            {
                onSettled: () => {
                    queryProduct.refetch();
                },
            }
        );
    };
    const { data, isLoading, isSuccess, isError } = mutation;
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate;
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete;
    const {
        data: dataDeletedMany,
        isLoading: isLoadingDeletedMany,
        isSuccess: isSuccessDeletedMany,
        isError: isErrorDeletedMany,
    } = mutationDeleteMany;

    const fetchAllTypeProduct = async (context) => {
        const res = await ProductService.getAllTypeProduct();
        return res;
        /* return res; */
    };
    const queryProduct = useQuery(["product"], getAllProducts);
    const typeProduct = useQuery(["type-product"], fetchAllTypeProduct);
    const { data: products, isLoading: isLoadingProduct } = queryProduct;
    const fetchGetDetailProduct = async (rowSelected) => {
        const res = await ProductService.getDetailProduct(rowSelected);
        if (res?.data) {
            setStateProductDetail({
                title: res?.data?.title,
                images: res?.data?.images,
                type: res?.data?.type,
                author: res?.data?.author,
                cost: res?.data?.cost,
                rate: res?.data?.rate,
                inventory: res?.data?.inventory,
                description: res?.data?.description,
                discount: res?.data?.discount,
                sold: res?.data?.sold,
            });
        }
        setIsLoadingUpdate(false);
        /* return res; */
    };

    useEffect(() => {
        form.setFieldsValue(stateProductDetail);
    }, [form, stateProductDetail]);

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true);
            fetchGetDetailProduct(rowSelected);
        }
    }, [rowSelected, isOpenDrawer]);

    const handleDetailProduct = () => {
        setIsOpenDrawer(true);
    };

    const dataTable =
        products?.data?.length &&
        products?.data?.map((product) => {
            return { ...product, key: product._id };
        });
    useEffect(() => {
        if (isSuccess && data?.status === "success") {
            message.success();
            handleCancel();
        } else if (isError && (data?.status === "OK" || data?.status === "ERR")) {
            message.error();
        }
    }, [isSuccess]);
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
        setStateProductDetail({
            title: "",
            images: "",
            type: "",
            author: "",
            cost: "",
            rate: "",
            inventory: "",
            description: "",
            discount: "",
            sold: "",
        });
        form.resetFields();
    };
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };
    const handleDeleteProduct = () => {
        mutationDelete.mutate(
            { id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    queryProduct.refetch();
                },
            }
        );
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            title: "",
            images: "",
            type: "",
            author: "",
            cost: "",
            rate: "",
            inventory: "",
            description: "",
            discount: "",
            sold: "",
        });
        form.resetFields();
    };
    const onFinish = () => {
        const params = {
            title: stateProduct.title,
            images: stateProduct.images,
            type: stateProduct.type === "add_type" ? stateProduct.newType : stateProduct.type,
            author: stateProduct.author,
            cost: stateProduct.cost,
            rate: stateProduct.rate,
            inventory: stateProduct.inventory,
            description: stateProduct.description,
            discount: stateProduct.discount,
            sold: stateProduct.sold,
        };
        mutation.mutate(params, {
            onSettled: () => {
                queryProduct.refetch();
            },
        });
    };

    const onUpdateProduct = () => {
        mutationUpdate.mutate(
            { id: rowSelected, token: user?.access_token, ...stateProductDetail },
            {
                onSettled: () => {
                    queryProduct.refetch();
                },
            }
        );
    };

    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            images: file.preview,
        });
    };
    const handleOnchangeDetailAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetail({
            ...stateProductDetail,
            images: file.preview,
        });
    };
    const handleOnchange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value,
        });
    };
    const handleOnchangeDetail = (e) => {
        setStateProductDetail({
            ...stateProductDetail,
            [e.target.name]: e.target.value,
        });
    };
    const handleOnchangeSelect = (value) => {
        setStateProduct({
            ...stateProduct,
            type: value,
        });
    };
    return (
        <div>
            <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
            <div style={{ marginTop: "10px" }}>
                <Button
                    style={{ height: "150px", width: "150px", borderRadius: "6px", borderStyle: "dashed" }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <PlusOutlined style={{ fontSize: "60px" }} />
                </Button>
            </div>
            <div>
                <TableComponent
                    columns={columns}
                    isLoading={isLoadingProduct}
                    data={dataTable}
                    handleDeleteMany={handleDeleteManyProduct}
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
            <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Loading isLoading={isLoading}>
                    <Form
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        style={{ maxWidth: 600 }}
                        onFinish={onFinish}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item label="title" name="title" rules={[{ required: true, message: "Tên sản phẩm/ Tựa đề" }]}>
                            <InputFormComponent value={stateProduct.title} onChange={handleOnchange} name="title" />
                        </Form.Item>

                        <Form.Item label="description" name="description" rules={[{ required: true, message: "Mô tả sản phẩm" }]}>
                            <InputFormComponent value={stateProduct.description} onChange={handleOnchange} name="description" />
                        </Form.Item>
                        <Form.Item label="images" name="images" rules={[{ required: true, message: "Ảnh bìa sản phẩm" }]}>
                            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                                <Button icon={<UploadOutlined />}>Upload</Button>
                                {stateProduct?.images && (
                                    <img
                                        src={stateProduct?.images}
                                        style={{
                                            height: "60px",
                                            width: "60px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            marginLeft: "10px",
                                        }}
                                        alt="images"
                                    />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>

                        <Form.Item label="type" name="type" rules={[{ required: true, message: "Thể loại" }]}>
                            <Select
                                name="type"
                                value={stateProduct.type}
                                onChange={handleOnchangeSelect}
                                options={renderOption(typeProduct?.data?.data)}
                            />
                        </Form.Item>
                        {stateProduct.type === "add_type" && (
                            <Form.Item label="New type" name="newType" rules={[{ required: true, message: "Thể loại" }]}>
                                <InputFormComponent value={stateProduct.newType} onChange={handleOnchange} name="newType" />
                            </Form.Item>
                        )}
                        <Form.Item label="author" name="author" rules={[{ required: true, message: "Tác giả" }]}>
                            <InputFormComponent value={stateProduct.author} onChange={handleOnchange} name="author" />
                        </Form.Item>
                        <Form.Item label="cost" name="cost" rules={[{ required: true, message: "Giá" }]}>
                            <InputFormComponent value={stateProduct.cost} onChange={handleOnchange} name="cost" />
                        </Form.Item>
                        <Form.Item label="rate" name="rate" rules={[{ required: true, message: "Đánh giá" }]}>
                            <InputFormComponent value={stateProduct.rate} onChange={handleOnchange} name="rate" />
                        </Form.Item>
                        <Form.Item label="inventory" name="inventory" rules={[{ required: true, message: "Hàng còn trong kho" }]}>
                            <InputFormComponent value={stateProduct.inventory} onChange={handleOnchange} name="inventory" />
                        </Form.Item>
                        <Form.Item label="sold" name="sold" rules={[{ required: true, message: "Đã bán" }]}>
                            <InputFormComponent value={stateProduct.sold} onChange={handleOnchange} name="sold" />
                        </Form.Item>
                        <Form.Item label="discount" name="discount" rules={[{ required: true, message: "Ưu đãi" }]}>
                            <InputFormComponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Xác nhận
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>
            <DrawerComponent title="Chi tiết sản phẩm" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        name="basic"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        style={{ maxWidth: 600 }}
                        onFinish={onUpdateProduct}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item label="title" name="title" rules={[{ required: true, message: "Tên sản phẩm/ Tựa đề" }]}>
                            <InputFormComponent value={stateProductDetail.title} onChange={handleOnchangeDetail} name="title" />
                        </Form.Item>

                        <Form.Item label="description" name="description" rules={[{ required: true, message: "Mô tả sản phẩm" }]}>
                            <InputFormComponent value={stateProductDetail.description} onChange={handleOnchangeDetail} name="description" />
                        </Form.Item>
                        <Form.Item label="images" name="images" rules={[{ required: true, message: "Ảnh bìa sản phẩm" }]}>
                            <WrapperUploadFile onChange={handleOnchangeDetailAvatar} maxCount={1}>
                                <Button icon={<UploadOutlined />}>Upload</Button>
                                {stateProductDetail?.images && (
                                    <img
                                        src={stateProductDetail?.images}
                                        style={{
                                            height: "60px",
                                            width: "60px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            marginLeft: "10px",
                                        }}
                                        alt="images"
                                    />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>

                        <Form.Item label="type" name="type" rules={[{ required: true, message: "Thể loại" }]}>
                            <InputFormComponent value={stateProductDetail.type} onChange={handleOnchangeDetail} name="type" />
                        </Form.Item>
                        <Form.Item label="author" name="author" rules={[{ required: true, message: "Tác giả" }]}>
                            <InputFormComponent value={stateProductDetail.author} onChange={handleOnchangeDetail} name="author" />
                        </Form.Item>
                        <Form.Item label="cost" name="cost" rules={[{ required: true, message: "Giá" }]}>
                            <InputFormComponent value={stateProductDetail.cost} onChange={handleOnchangeDetail} name="cost" />
                        </Form.Item>
                        <Form.Item label="rate" name="rate" rules={[{ required: true, message: "Đánh giá" }]}>
                            <InputFormComponent value={stateProductDetail.rate} onChange={handleOnchangeDetail} name="rate" />
                        </Form.Item>
                        <Form.Item label="inventory" name="inventory" rules={[{ required: true, message: "Hàng còn trong kho" }]}>
                            <InputFormComponent value={stateProductDetail.inventory} onChange={handleOnchangeDetail} name="inventory" />
                        </Form.Item>
                        <Form.Item label="sold" name="sold" rules={[{ required: true, message: "Đã bán" }]}>
                            <InputFormComponent value={stateProductDetail.sold} onChange={handleOnchangeDetail} name="sold" />
                        </Form.Item>
                        <Form.Item label="discount" name="discount" rules={[{ required: true, message: "Ưu đãi" }]}>
                            <InputFormComponent value={stateProductDetail.discount} onChange={handleOnchangeDetail} name="discount" />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent
                forceRender
                title="Xóa sản phẩm"
                open={isModalOpenDelete}
                onOk={handleDeleteProduct}
                onCancel={handleCancelDelete}
            >
                <Loading isLoading={isLoadingDeleted}>
                    <div>Bạn có chắc chắn muốn xóa sản phẩm này không</div>
                </Loading>
            </ModalComponent>
        </div>
    );
};
