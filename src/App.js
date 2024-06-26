import React, { useState } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Layout from "./component/Layout";
import Login from "../src/containers/Login";
import String from "../src/string/index";
import Dashboard from "../src/containers/Dashboard";
import Purchase from "../src/containers/Purchase";
import Sales from "../src/containers/Sales";
import Invoice from "../src/containers/Invoice";
import Stocks from "./containers/Stocks";
import InvoiceReceipt from "./containers/Invoice/InvoiceReceipt";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("accessToken") ? true : false
  );

  const setLogging = (flag) => {
    setIsLoggedIn(flag);
  };

  const router = createBrowserRouter(
    !isLoggedIn
      ? [
          {
            path: "/",
            element: <Login setLogging={setLogging} />,
          },
        ]
      : [
          {
            path: "/",
            element: <Layout setLogging={setLogging} />,
            children: [
              {
                path: "/" + String.Dashboard,
                element: <Dashboard />,
              },
              {
                path: "/" + String.Purchase,
                element: <Purchase />,
              },
              {
                path: "/" + String.Sales,
                element: <Sales />,
              },
              {
                path: "/" + String.Invoice,
                element: <Invoice />,
              },
              {
                path: "/" + String.Stocks,
                element: <Stocks />,
              },
              {
                path: "/" + String.InvoiceReceipt,
                element: <InvoiceReceipt />,
              },
              {
                path: "/",
                element: <Navigate to={"/" + String.Dashboard} replace />,
              },
            ],
          },
        ]
  );

  return (
    <div className="App">
      <RouterProvider router={router}>
        <Layout />
      </RouterProvider>
    </div>
  );
}

export default App;
