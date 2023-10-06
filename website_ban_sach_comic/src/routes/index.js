import OrderPage from "../pages/OrderPage/OrderPage";
import HomePage from "../pages/HomePages/HomePages";
import ProductPage from "../pages/ProductsPage/ProductsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import { SignInPage } from "../pages/SignInPage/SignInPage";
import { SignUpPage } from "../pages/SignUpPage/SignUpPage";
import { ProductDetailPage } from "../pages/ProductDetailPage/ProductDetailPage";
import { ProfilePage } from "../pages/ProfilePage/ProfilePage";
import { AdminPage } from "../pages/AdminPage/AdminPage";

export const routes = [
    {
        path: "/",
        page: HomePage,
        isShowHeader: true,
    },
    {
        path: "/order",
        page: OrderPage,
        isShowHeader: true,
    },
    {
        path: "/products",
        page: ProductPage,
        isShowHeader: true,
    },
    {
        path: "/product/:type",
        page: TypeProductPage,
        isShowHeader: true,
    },
    {
        path: "/sign-in",
        page: SignInPage,
        isShowHeader: false,
    },
    {
        path: "/sign-up",
        page: SignUpPage,
        isShowHeader: false,
    },
    {
        path: "/product-details/:id",
        page: ProductDetailPage,
        isShowHeader: true,
    },
    {
        path: "/profile-user",
        page: ProfilePage,
        isShowHeader: true,
    },
    {
        path: "/system/admin",
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true,
    },
    {
        path: "*",
        page: NotFoundPage,
    },
];
