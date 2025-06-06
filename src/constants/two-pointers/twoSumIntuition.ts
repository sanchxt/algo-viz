import type { AlgorithmIntuition } from "@/types/algorithm";

export const twoSumIntuition: AlgorithmIntuition = {
  title: "Two Sum (Two Pointers)",
  description:
    "An efficient algorithm that finds two numbers in a sorted array that add up to a specific target sum using the two pointers technique.",

  intuition: {
    title: "The Core Intuition",
    content: [
      "Imagine you have a sorted array of numbers and need to find two that add up to a target sum.",
      "Instead of checking every possible pair (which would be slow), you can use two pointers - one at the beginning and one at the end.",
      "If the current sum is too small, you need a larger number, so move the left pointer right.",
      "If the current sum is too large, you need a smaller number, so move the right pointer left.",
      "This way, you systematically eliminate possibilities and converge toward the solution.",
      "The key insight is that in a sorted array, moving pointers inward allows you to adjust the sum in a predictable direction.",
    ],
  },

  whenToUse: {
    title: "When Should You Use Two Pointers for Two Sum?",
    content: [
      "When you have a sorted array and need to find pairs that meet certain criteria",
      "When you want to avoid the O(n²) brute force approach of checking all pairs",
      "When you need to find complementary elements efficiently",
      "When working with problems involving pairs, triplets, or subarrays",
      "When you want guaranteed O(n) time complexity after sorting",
    ],
    examples: [
      "Finding two numbers that sum to a target value",
      "Finding pairs with a specific difference",
      "Checking if a sorted array contains a pair that satisfies a condition",
      "Three Sum problem (extension of Two Sum)",
      "Finding the closest pair to a target sum",
    ],
  },

  realWorldAnalogy: {
    title: "Real-World Analogy",
    content:
      "Think of two people standing at opposite ends of a number line, trying to meet at a specific sum. If their current position gives a sum that's too small, the person on the left (smaller numbers) steps forward. If the sum is too large, the person on the right (larger numbers) steps back. They keep adjusting their positions until they meet at exactly the right sum, or determine it's impossible when they cross paths.",
  },
};

export const algorithmIntuitions = {
  "two-sum": twoSumIntuition,
};
