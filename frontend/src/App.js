import React, { useState } from "react";
import Header from "./components/Header";
import Body from "./components/Body";
import BidPage from "./components/BidPage";
import EscrowPage from "./components/EscrowPage";
import { createBrowserRouter, RouterProvider,Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
    <div className="">
        <Header/>
        <Outlet />
    </div>
    );
};

const router = createBrowserRouter([{
    path: "/",
    element: <AppLayout />,
    children: [
        {
            path: "/",
            element: <BidPage />
        },
        {
            path: "/body",
            element: <Body />
        },
        {
            path: "/escrow",
            element: <EscrowPage />
        }
    ]
}])

const App = () => {
    return (
        <RouterProvider router={router} />
    );
};

export default App;