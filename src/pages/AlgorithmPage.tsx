import { useParams, Navigate } from "react-router-dom";

import BubbleSortPage from "@pages/sorting/BubbleSortPage";
import BinarySearchPage from "@pages/searching/BinarySearchPage";
import LinearSearchPage from "@pages/searching/LinearSearchPage";
import TwoPointersPage from "@pages/two-pointers/TwoPointersPage";
import AnagramDetectionPage from "@pages/strings/AnagramDetectionPage";
import ReverseLinkedListPage from "@pages/linked-lists/ReverseLinkedListPage";

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
    case "two-sum":
      return <TwoPointersPage />;
    case "anagram-detection":
      return <AnagramDetectionPage />;
    case "reverse-linked-list":
      return <ReverseLinkedListPage />;
    default:
      // for unknown algorithms, redirect to category page
      return <Navigate to={`/categories/${categoryId}`} replace />;
  }
};

export default AlgorithmPage;
