import styled from "styled-components";
import { Upload } from "antd";

export const WrapperHeader = styled.h1`
    color: #000,
    font-size: 14px,
`
export const WrapperUploadFile = styled(Upload)`
    & .ant-upload-list-item-name {
        display: none;
    }
    & .ant-upload-list-item-info {
        display: none
    }
    & .ant-upload-list-item {
        display: none;
    }
`;
