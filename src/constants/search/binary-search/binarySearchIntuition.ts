import type { AlgorithmIntuition } from "@/types/algorithm";

export const binarySearchIntuition: AlgorithmIntuition = {
  title: "Binary Search",
  description:
    "An efficient search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.",

  intuition: {
    title: "The Core Intuition",
    content: [
      "Imagine you're looking for a word in a physical dictionary. You don't start from page 1 and flip through every page!",
      "Instead, you open the dictionary roughly in the middle. If the word you're looking for comes alphabetically before the words on that page, you know it must be in the left half.",
      "If it comes after, it must be in the right half. Either way, you've just eliminated half of the dictionary!",
      "You repeat this process on the remaining half, then the remaining quarter, and so on.",
      "Each step cuts your search space in half, which is why binary search is so incredibly fast - even for huge datasets!",
    ],
  },

  whenToUse: {
    title: "When Should You Use Binary Search?",
    content: [
      "When you have a sorted array or list and need to find a specific element quickly",
      "When you're working with large datasets where linear search would be too slow",
      "When you need to find insertion points for maintaining sorted order",
      "When implementing other algorithms that require efficient searching",
      "When you need guaranteed O(log n) search performance",
    ],
    examples: [
      "Searching for a user in a sorted database of millions of records",
      "Finding a specific value in a sorted array of stock prices",
      "Implementing autocomplete features with sorted suggestions",
      "Finding the closest match in sorted scientific data",
      "Locating files in a sorted directory listing",
    ],
  },

  realWorldAnalogy: {
    title: "Real-World Analogy",
    content:
      "Binary search is like playing the number guessing game where someone thinks of a number between 1 and 100, and you have to guess it. The optimal strategy is always to guess the middle number (50). If they say 'higher', you guess 75 (middle of 51-100). If they say 'lower', you guess 25 (middle of 1-49). This way, you eliminate half the possibilities with each guess and can find any number in at most 7 tries!",
  },
};

export const algorithmIntuitions = {
  "binary-search": binarySearchIntuition,
};
