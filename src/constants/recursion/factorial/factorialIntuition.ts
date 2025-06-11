import type { AlgorithmIntuition } from "@/types/algorithm";

export const factorialIntuition: AlgorithmIntuition = {
  title: "Factorial (Recursive)",
  description:
    "A classic recursive algorithm that calculates the factorial of a number (n!) by breaking down the problem into smaller subproblems until reaching the base case.",

  intuition: {
    title: "The Core Intuition",
    content: [
      "Factorial is the perfect introduction to recursion because it naturally breaks down into smaller, identical problems.",
      "The key insight: to find factorial(n), you need n × factorial(n-1). This creates a chain of dependencies.",
      "Think of it like a tower of blocks - to know the total height, you need the height of the current block plus the height of all blocks below it.",
      "The recursion continues until we hit the 'ground floor' - our base case where factorial(1) or factorial(0) equals 1.",
      "Then, like dominoes falling in reverse, each answer cascades back up: 1 → 1×2 → 2×3 → 6×4 → 24×5 = 120.",
      "The call stack acts like a memory system, keeping track of all the 'unfinished business' until the base case provides the first concrete answer.",
    ],
  },

  whenToUse: {
    title: "When Should You Use Recursive Factorial?",
    content: [
      "When learning recursion concepts and call stack behavior",
      "When you need to calculate factorials in mathematical computations",
      "When teaching or demonstrating recursive thinking",
      "When implementing mathematical functions that build on factorial",
      "When prototyping before optimizing with iterative or memoized solutions",
    ],
    examples: [
      "Calculating permutations and combinations in statistics",
      "Computing mathematical series expansions (like e^x = Σ(x^n/n!))",
      "Implementing probability distributions in data science",
      "Educational tools for teaching recursion concepts",
      "Mathematical modeling in physics and engineering",
      "Game development for calculating possible arrangements",
    ],
  },

  realWorldAnalogy: {
    title: "Real-World Analogy",
    content:
      "Imagine you're organizing a company hierarchy report. To find the total number of people under a manager, you ask each manager: 'Count yourself, then ask each of your direct reports to count everyone under them.' This creates a chain where each manager waits for their subordinates to report back before they can give their own total. The process starts at the bottom (employees with no reports give count = 1) and bubbles up until the CEO gets the final company-wide count. That's exactly how factorial recursion works - each level waits for the smaller problem to be solved first!",
  },

  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
  },
  spaceComplexity: "O(n) - due to call stack depth",
};
