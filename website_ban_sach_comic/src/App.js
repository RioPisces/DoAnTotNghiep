import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { routes } from "./routes/index";
import jwt_decode from "jwt-decode";
import * as UserService from "./service/UserService";
import { isJsonString } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "./redux/slices/userSlice";
import { Loading } from "./components/LoadingComponent/Loading";

function App() {
    const user = useSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(false);

    const handleDecoded = () => {
        let storageData = localStorage.getItem("access_token");
        let decoded = {};
        if (storageData && isJsonString(storageData)) {
            storageData = JSON.parse(storageData);
            decoded = jwt_decode(storageData);
        }
        return { decoded, storageData };
    };

    useEffect(() => {
        setIsLoading(true);
        const { storageData, decoded } = handleDecoded();
        if (decoded?.id) {
            handleGetDetailsUser(decoded?.id, storageData);
        }
        setIsLoading(false);
    },[]);

    UserService.axiosJWT.interceptors.request.use(
        async (config) => {
            const currentTime = new Date();
            const { decoded } = handleDecoded();
            if (decoded?.exp < currentTime.getTime() / 1000) {
                const data = await UserService.refreshToken();
                config.headers["token"] = `Bearer ${data?.access_token}`;
            }
            return config;
        },
        function (error) {
            return Promise.reject(error);
        }
    );

    const dispatch = useDispatch();

    const handleGetDetailsUser = async (id, token) => {
       /*  if (user?.email === "" && user?.password === "") { */
            const res = await UserService.getDetailsUser(id, token);
            dispatch(updateUser({ ...res?.data, access_token: token }));
        /* } */
    };

    return (
        <div>
            <Loading isLoading={isLoading}>
                <Router>
                    <Routes>
                        const
                        {routes.map((route) => {
                            const Page = route.page;
                            const LayOut = route.isShowHeader ? DefaultComponent : Fragment;
                            return (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={
                                        <LayOut>
                                            <Page />
                                        </LayOut>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </Router>
            </Loading>
        </div>
    );
}

export default App;
