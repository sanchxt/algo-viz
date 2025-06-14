import type { AlgorithmIntuition } from "@/types/algorithm";

export const minCostIntuition: AlgorithmIntuition = {
  title: "Minimum Cost to Make Array Size 1 (Greedy)",
  description:
    "A greedy algorithm that finds the minimum cost to reduce an array to size 1 by repeatedly removing the larger element from pairs, where the cost equals the smaller element value.",

  intuition: {
    title: "The Greedy Insight",
    content: [
      "The key insight is that we want to minimize the total cost, and cost equals the smaller element in each pair operation.",
      "Instead of randomly pairing elements, we should strategically use the smallest element in the array as our 'cost anchor'.",
      "Since we can choose any pair, we can always pair the minimum element with any other element and remove the larger one.",
      "This way, every operation costs exactly the minimum element value - we can't do better than this!",
      "The total cost becomes: (number of operations) × (minimum element) = (array_length - 1) × min_element.",
      "This greedy choice is optimal because using any larger element as the 'anchor' would only increase our total cost.",
      "The beauty of this approach is that we don't need to actually simulate the removals - we can calculate the answer directly!",
    ],
  },

  whenToUse: {
    title: "When Should You Use This Greedy Approach?",
    content: [
      "When you need to find optimal solutions involving repeated operations with costs",
      "When the problem allows flexible pairing or selection strategies",
      "When you can identify a 'greedy choice' that's provably optimal at each step",
      "When minimizing cumulative costs across multiple operations",
      "When the problem structure allows you to avoid expensive simulations",
    ],
    examples: [
      "Resource allocation problems where you want to minimize total expenditure",
      "Game optimization where you need to minimize penalty points",
      "Network optimization problems involving edge removal costs",
      "Manufacturing processes where you want to minimize waste or material costs",
      "Financial algorithms for minimizing transaction fees or operational costs",
      "Scheduling problems where you want to minimize total waiting time or delays",
    ],
  },

  realWorldAnalogy: {
    title: "Real-World Analogy",
    content:
      "Imagine you're a manager trying to downsize a team from n people to 1 person through paired eliminations. In each round, you pick two people and let go of one, but you have to pay a severance equal to the remaining person's salary. The greedy insight is brilliant: always keep your lowest-paid employee and use them to eliminate everyone else! This way, every severance payment is minimal. It's like having a 'budget champion' who helps you minimize costs at every step. You don't even need to plan the exact elimination order - just knowing your strategy gives you the total cost immediately!",
  },

  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
  },
  spaceComplexity: "O(1) - only need to find minimum element",
};
