const Product = require("../models/ProductModel");
const bcrypt = require("bcrypt");

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { title, images, type, author, cost, rate, inventory, description, discount, sold } = newProduct;
        try {
            const checkProduct = await Product.findOne({
                title: title,
            });
            if (checkProduct !== null) {
                resolve({
                    status: "OK",
                    message: "The title of product is already exists.",
                });
            } else {
                const newProduct = await Product.create({
                    title,
                    images,
                    type,
                    author,
                    cost,
                    rate,
                    inventory,
                    description,
                    discount,
                    sold,
                });
                if (newProduct) {
                    resolve({
                        status: "success",
                        message: "new product created successfully",
                        data: newProduct,
                    });
                }
            }
            resolve({});
        } catch (e) {
            reject(e);
        }
    });
};

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id, //nếu ko có _ thì bị lỗi trong lệnh truy vấn
            });
            if (checkProduct === null) {
                resolve({
                    status: "OK",
                    message: "The product is not defined",
                });
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
            resolve({
                status: "success",
                message: "update successful",
                data: updatedProduct,
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getDetailProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id, //nếu ko có _ thì bị lỗi trong lệnh truy vấn
            });
            if (product === null) {
                resolve({
                    status: "ERR",
                    message: "The product is not defined",
                });
            }

            resolve({
                status: "success",
                message: "get detail product is successful",
                data: product,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.count();
            if (filter) {
                const label = filter[0];
                const allProductFilter = await Product.find({
                    [label]: { $regex: filter[1] },
                })
                    .limit(limit)
                    .skip(page * limit);
                /* .limit(limit)
                    .skip(page * limit)
                    .sort(objectSort); */
                resolve({
                    status: "success",
                    message: "get all filter product is successful",
                    data: allProductFilter,
                    total: totalProduct,
                    pageCurrent: page + 1,
                    totalPage: Math.ceil(totalProduct / limit),
                });
            }
            if (sort) {
                const objectSort = {};
                objectSort[sort[1]] = sort[0];
                const allProductSoft = await Product.find()
                    .limit(limit)
                    .skip(page * limit)
                    .sort(objectSort);
                resolve({
                    status: "success",
                    message: "get all sort product is successful",
                    data: allProductSoft,
                    total: totalProduct,
                    pageCurrent: page + 1,
                    totalPage: Math.ceil(totalProduct / limit),
                });
            }
            const allProduct = await Product.find()
                .limit(limit)
                .skip(page * limit);

            resolve({
                status: "success",
                message: "get all  product is successful",
                data: allProduct,
                total: totalProduct,
                pageCurrent: page + 1,
                totalPage: Math.ceil(totalProduct / limit),
            });
        } catch (e) {
            reject(e);
        }
    });
};
const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id, //nếu ko có _ thì bị lỗi trong lệnh truy vấn
            });
            if (checkProduct === null) {
                resolve({
                    status: "OK",
                    message: "The product is not defined",
                });
            }
            await Product.findByIdAndDelete(id);
            resolve({
                status: "success",
                message: "delete product is successful",
            });
        } catch (e) {
            reject(e);
        }
    });
};
const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({ _id: ids });
            resolve({
                status: "success",
                message: "delete product is successful",
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct("type");
            resolve({
                status: "success",
                message: "get all  type is successful",
                data: allType,
            });
        } catch (e) {
            reject(e);
        }
    });
};
getDetailProduct;
module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllType,
};
