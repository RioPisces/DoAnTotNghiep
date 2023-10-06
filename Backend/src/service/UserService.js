const User = require("../models/User");
/* const bcrypt = require("bcrypt"); */
const { generalAccessToken, generalRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone_number } = newUser;
        try {
            const checkUser = await User.findOne({
                email: email,
            });
            if (checkUser !== null) {
                resolve({
                    status: "ERR",
                    message: "The email is already exists.",
                });
            }
            /* const hash = bcrypt.hashSync(password, 10); */

            const createdUser = await User.create({
                name,
                email,
                password,
                phone_number,
            });
            if (createdUser) {
                resolve({
                    status: "success",
                    message: "User created successfully",
                    data: createdUser,
                });
            }
            resolve({});
        } catch (e) {
            reject(e);
        }
    });
};

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;
        try {
            const checkUser = await User.findOne({
                email: email,
            });

            if (checkUser === null) {
                resolve({
                    status: "ERR",
                    message: "The user is not defined",
                });
            }
            const comparePassword = password === checkUser.password;

            if (!comparePassword) {
                resolve({
                    status: "ERR",
                    message: "The password or user is incorrect",
                });
            }
            const access_token = await generalAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            });
            const refresh_token = await generalRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            });

            resolve({
                status: "success",
                message: "successful",
                access_token,
                /* refresh_token */
            });
        } catch (e) {
            reject(e);
        }
    });
};

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id, //nếu ko có _ thì bị lỗi trong lệnh truy vấn
            });
            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: "The user is not defined",
                });
            }

            const updateUser = await User.findByIdAndUpdate(id, data, { new: true });
            resolve({
                status: "success",
                message: "successful",
                data: updateUser,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id, //nếu ko có _ thì bị lỗi trong lệnh truy vấn
            });
            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: "The user is not defined",
                });
            }

            await User.findByIdAndDelete(id);
            resolve({
                status: "success",
                message: "delete user is successful",
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            

            await User.deleteMany({_id: ids});
            resolve({
                status: "success",
                message: "delete user is successful",
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find();
            resolve({
                status: "success",
                message: "get all user is successful",
                data: allUser,
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getDetailUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id, //nếu ko có _ thì bị lỗi trong lệnh truy vấn
            });
            if (user === null) {
                resolve({
                    status: "ERR",
                    message: "The user is not defined",
                });
            }

            resolve({
                status: "success",
                message: "get detail user is successful",
                data: user,
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    deleteManyUser
};
