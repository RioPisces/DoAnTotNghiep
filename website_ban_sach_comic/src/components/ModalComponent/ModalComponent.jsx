import { Modal } from "antd";
import React from "react";

export const ModalComponent = ({ title = "Modal", isOpen = false, children, ...rests }) => {
    return (
        <div>
            <Modal title={title} open={isOpen} {...rests}>
                {children}
            </Modal>
        </div>
    );
};
