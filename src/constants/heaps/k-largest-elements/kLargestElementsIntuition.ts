import type { AlgorithmIntuition } from "@/types/algorithm";

export const kLargestElementsIntuition: AlgorithmIntuition = {
  title: "K Largest Elements using Min-Heap",
  description:
    "An efficient algorithm that uses a min-heap of size K to find the K largest elements from an array. The min-heap maintains the K largest elements seen so far, with the smallest of these K elements at the root.",

  intuition: {
    title: "The Core Intuition",
    content: [
      "Imagine you're a talent scout who can only remember the top K performers from auditions. You need a smart way to keep track of them as you see more candidates.",
      "A min-heap of size K is perfect for this: it always keeps the 'worst of the best' at the top, making it easy to decide if a new candidate should replace someone.",
      "When you encounter a new element: if your heap isn't full (< K elements), just add it. If it's full, compare the new element with the smallest in your heap.",
      "If the new element is larger than the heap's minimum, kick out the minimum and add the new element. This ensures you always keep the K largest elements.",
      "The beauty is that you only need O(K) space instead of sorting the entire array, and each operation takes O(log K) time.",
      "Why min-heap instead of max-heap? Because we want quick access to the smallest element among our K largest - that's what we might need to replace!",
    ],
  },

  whenToUse: {
    title: "When Should You Use This Algorithm?",
    content: [
      "When you need the K largest (or smallest) elements from a large dataset",
      "When K is much smaller than the total number of elements (K << N)",
      "When you want to avoid sorting the entire array for just K elements",
      "For streaming data where you can't store all elements in memory",
      "When you need an online algorithm that processes elements one by one",
      "For problems requiring top-K statistics with optimal space complexity",
    ],
    examples: [
      "Finding top 10 scores from millions of game results",
      "Selecting 5 best candidates from thousands of job applications",
      "Getting the 3 most expensive items from a shopping catalog",
      "Finding top 20 trending hashtags from social media streams",
      "Identifying the K closest points to origin in a coordinate system",
      "Getting K most frequent words from a large text corpus",
      "Finding top K selling products from e-commerce transaction data",
      "Selecting K best performing stocks from market data",
      "Getting K highest priority tasks from a task management system",
    ],
  },

  realWorldAnalogy: {
    title: "Real-World Analogy",
    content:
      "Think of this algorithm like maintaining a 'VIP section' at a concert venue. The VIP section has exactly K seats (your heap size). When people arrive, you check: if there are empty VIP seats, they get in. If VIP is full, you compare the newcomer with the person who paid the least for their VIP ticket (heap minimum). If the newcomer paid more, you upgrade them to VIP and move the lowest payer to general admission. This way, the VIP section always contains the K highest-paying customers, and you can quickly identify who might get bumped next. The 'lowest payer in VIP' is always easy to find because they're sitting in the designated 'first-to-go' seat (heap root).",
  },

  timeComplexity: {
    best: "O(n log k)",
    average: "O(n log k)",
    worst: "O(n log k)",
  },
  spaceComplexity: "O(k) - for the heap storing K elements",
};
