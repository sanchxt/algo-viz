import { useParams, Navigate } from "react-router-dom";

import BubbleSortPage from "@pages/sorting/BubbleSortPage";
import BinarySearchPage from "@pages/searching/BinarySearchPage";
import LinearSearchPage from "@pages/searching/LinearSearchPage";
import TwoPointersPage from "@pages/two-pointers/TwoPointersPage";
import AnagramDetectionPage from "@pages/strings/AnagramDetectionPage";
import ReverseLinkedListPage from "@pages/linked-lists/ReverseLinkedListPage";
import FactorialPage from "@pages/recursion/FactorialPage";
import BalancedParenthesesPage from "@pages/stacks/BalancedParenthesesPage";
import InOrderTraversalPage from "@pages/trees/InOrderTraversalPage";
import BfsTraversalPage from "@pages/queues/BfsTraversalPage";
import CycleDetectionPage from "@pages/graphs/CycleDetectionPage";
import CoinChangePage from "./dp/CoinChangePage";
import MinCostArrayPage from "./greedy/MinCostArrayPage";
import KLargestElementsPage from "./heaps/KLargestElementsPage";

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
    case "factorial":
      return <FactorialPage />;
    case "balanced-parentheses":
      return <BalancedParenthesesPage />;
    case "in-order-traversal":
      return <InOrderTraversalPage />;
    case "bfs-traversal":
      return <BfsTraversalPage />;
    case "cycle-detection":
      return <CycleDetectionPage />;
    case "coin-change":
      return <CoinChangePage />;
    case "min-cost-array":
      return <MinCostArrayPage />;
    case "k-largest-elements":
      return <KLargestElementsPage />;
    default:
      // for unknown algorithms, redirect to category page
      return <Navigate to={`/categories/${categoryId}`} replace />;
  }
};

export default AlgorithmPage;
