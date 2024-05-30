import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Home from "./Home.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { taskSlice } from "./api/ApiSlice.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // if you have implmented redux store then you can pass api={} as a second prop to the provider
      <ApiProvider api={taskSlice}>
        <App />
      </ApiProvider>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/contact",
        element: <p>Contact Us</p>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
