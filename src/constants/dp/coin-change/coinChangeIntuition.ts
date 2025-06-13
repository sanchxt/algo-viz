import type { AlgorithmIntuition } from "@/types/algorithm";

export const coinChangeIntuition: AlgorithmIntuition = {
  title: "Coin Change (Dynamic Programming)",
  description:
    "A classic dynamic programming problem that finds the minimum number of coins needed to make a given amount using available coin denominations.",

  intuition: {
    title: "The Core Intuition",
    content: [
      "The coin change problem embodies the essence of dynamic programming: breaking down a complex problem into simpler, overlapping subproblems.",
      "Key insight: To make amount X with minimum coins, we try each coin C and check the minimum coins needed for amount (X-C), then add 1 for the current coin.",
      "This creates the recurrence: dp[amount] = min(dp[amount - coin] + 1) for all valid coins.",
      "We build our solution bottom-up, starting from amount 0 (which needs 0 coins) and working our way up to the target amount.",
      "Each cell in our DP table represents the optimal solution for that specific amount, which we use to solve larger amounts.",
      "The 'optimal substructure' property ensures that if we know the minimum coins for amount (X-C), we can find the minimum for amount X.",
    ],
  },

  whenToUse: {
    title: "When Should You Use Coin Change DP?",
    content: [
      "When you need to find the minimum/maximum number of items to achieve a target",
      "When the problem has overlapping subproblems that can be cached and reused",
      "When you need to make optimal decisions at each step based on previous optimal decisions",
      "When greedy algorithms fail to give optimal solutions (like with coin systems [1,3,4])",
      "When you need to count the number of ways to achieve a target (variant problems)",
    ],
    examples: [
      "Making change with minimum coins in different currency systems",
      "Minimum number of bills to make a payment amount",
      "Fewest jumps to reach the end of an array (jump game)",
      "Minimum number of perfect squares that sum to n",
      "Minimum steps to reduce a number to 1 using specific operations",
      "Unbounded knapsack problems (unlimited items of each type)",
    ],
  },

  realWorldAnalogy: {
    title: "Real-World Analogy",
    content:
      "Imagine you're a cashier trying to give the customer change using the fewest possible coins. You have coins of different denominations, and for each amount, you remember the best way you've found so far. When a new customer needs change, you check: 'If I use this coin, how many coins did I need for the remaining amount?' You try all possible coins and pick the option that uses the fewest total coins. It's like building a reference book where each page tells you the minimum coins needed for that exact amount, and you use previous pages to fill in new ones. Once you've figured out the best way for all amounts up to the target, you have your answer!",
  },

  timeComplexity: {
    best: "O(amount × coins)",
    average: "O(amount × coins)",
    worst: "O(amount × coins)",
  },
  spaceComplexity: "O(amount) - for the DP table",
};
