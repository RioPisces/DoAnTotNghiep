import { Dropdown, Table, Space } from "antd";
import React, { useState } from "react";
import { Loading } from "../LoadingComponent/Loading";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";

export const TableComponent = (props) => {
    const { selectionType = "checkbox", data = [], isLoading = false, columns = [], handleDeleteMany } = props;
    const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys);
        },
    };
    const handleDeleteManyTableComponent = () => {
        handleDeleteMany(rowSelectedKeys);
    };
    const onClick = ({ key }) => {
        handleDeleteManyTableComponent();
    };
    const items = [
        {
            key: "4",
            danger: true,
            label: "Xóa tất cả",
        },
    ];
    return (
        <Loading isLoading={isLoading}>
            {rowSelectedKeys.length > 0 && (
                <Dropdown menu={{ items, onClick }}>
                    <a>
                        <Space>
                            Xóa các mục đã chọn
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            )}

            <Table
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={data}
                {...props}
            />
        </Loading>
    );
};
