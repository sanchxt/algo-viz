import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.tsx";
import HomePage from "./pages/HomePage.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import BubbleSortPage from "./pages/BubbleSortPage.tsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "categories/:categoryId",
        Component: CategoryPage,
      },
      {
        path: "categories/:categoryId/:algorithmId",
        Component: BubbleSortPage,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
