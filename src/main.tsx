import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  useParams,
} from "react-router-dom";

import App from "@/App.tsx";
import HomePage from "@pages/HomePage.tsx";
import CategoryPage from "@pages/CategoryPage.tsx";
import BubbleSortPage from "@pages/BubbleSortPage.tsx";
import BinarySearchPage from "@pages/BinarySearchPage.tsx";

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
        Component: () => {
          const { algorithmId } = useParams<{ algorithmId: string }>();

          switch (algorithmId) {
            case "bubble-sort":
              return <BubbleSortPage />;
            case "binary-search":
              return <BinarySearchPage />;
            default:
              return <CategoryPage />;
          }
        },
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
