import { useParams, Navigate } from "react-router-dom";

import BubbleSortPage from "@pages/BubbleSortPage";
import BinarySearchPage from "@pages/BinarySearchPage";
import LinearSearchPage from "@pages/LinearSearchPage";

const AlgorithmPage = () => {
  const { categoryId, algorithmId } = useParams<{
    categoryId: string;
    algorithmId: string;
  }>();

  // if no algorithmId, we shouldn't be here
  if (!algorithmId) {
    return <Navigate to={`/categories/${categoryId}`} replace />;
  }

  // route to the appropriate algorithm page
  switch (algorithmId) {
    case "bubble-sort":
      return <BubbleSortPage />;
    case "binary-search":
      return <BinarySearchPage />;
    case "linear-search":
      return <LinearSearchPage />;
    default:
      // for unknown algorithms, redirect to category page
      return <Navigate to={`/categories/${categoryId}`} replace />;
  }
};

export default AlgorithmPage;
