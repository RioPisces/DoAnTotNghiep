import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderItems: [{}],
    shippingAdress: {},
    paymentMethod: "",
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    user: "",
    isPaid: false,
    paidAt: "",
    isDelivered: false,
    deliveredAt: "",
};

export const orderSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        decreaseAmount: (state, action) => {
            const { idProduct } = action.payload;
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct);
            const itemOrderSelected = state?.orderItemsSlected?.find((item) => item?.product === idProduct);
            itemOrder.amount--;
            if (itemOrderSelected) {
                itemOrderSelected.amount--;
            }
        },
        /*  removeOrderProduct: (state, action) => {
            const { idProduct } = action.payload;
            const itemOrder = state?.orderItems?.find((item) => item?.product !== idProduct);
            itemOrder.orderItems = itemOrder;
        }, */
        addOrderProduct: (state, action) => {
            const { orderItems } = action.payload;
            const itemOrder = state?.orderItems?.find((item) => item?.product === orderItems.product);
            if (itemOrder) {
                itemOrder.amount += orderItems.amount;
            } else {
                state.orderItems.push(orderItems);
            }
        },
        increaseAmount: (state, action) => {
            const { idProduct } = action.payload;
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct);
            const itemOrderSelected = state?.orderItemsSlected?.find((item) => item?.product === idProduct);
            itemOrder.amount++;
            if (itemOrderSelected) {
                itemOrderSelected.amount++;
            }
        },
        removeOrderProduct: (state, action) => {
            const { idProduct } = action.payload;

            const itemOrder = state?.orderItems?.filter((item) => item?.product !== idProduct);
            const itemOrderSeleted = state?.orderItemsSlected?.filter((item) => item?.product !== idProduct);

            state.orderItems = itemOrder;
            state.orderItemsSlected = itemOrderSeleted;
        },
        removeAllOrderProduct: (state, action) => {
            const { listChecked } = action.payload;

            const itemOrders = state?.orderItems?.filter((item) => !listChecked.includes(item.product));
            const itemOrdersSelected = state?.orderItems?.filter((item) => !listChecked.includes(item.product));
            state.orderItems = itemOrders;
            state.orderItemsSlected = itemOrdersSelected;
        },
        selectedOrder: (state, action) => {
            const { listChecked } = action.payload;
            const orderSelected = [];
            state.orderItems.forEach((order) => {
                if (listChecked.includes(order.product)) {
                    orderSelected.push(order);
                }
            });
            state.orderItemsSlected = orderSelected;
        },
    },
});

// Action creators are generated for each case reducer function
export const { selectedOrder, removeOrderProduct, increaseAmount, decreaseAmount, removeAllOrderProduct, addOrderProduct, searchProduct } =
    orderSlice.actions;

export default orderSlice.reducer;
