import type { AlgorithmIntuition } from "@/types/algorithm";

export const anagramDetectionIntuition: AlgorithmIntuition = {
  title: "Anagram Detection",
  description:
    "An efficient algorithm that determines if two strings are anagrams by counting the frequency of each character and comparing the frequency maps.",

  intuition: {
    title: "The Core Intuition",
    content: [
      "Imagine you have two bags of Scrabble tiles, and you want to know if they contain exactly the same letters.",
      "The most efficient way isn't to match tiles one by one - instead, you count how many of each letter you have in the first bag.",
      "Then you go through the second bag, and for each letter you find, you subtract one from your count.",
      "If at the end all your counts are zero, the bags contained exactly the same letters - they're anagrams!",
      "This approach works because anagrams are just rearrangements of the same characters with the same frequencies.",
    ],
  },

  whenToUse: {
    title: "When Should You Use This Algorithm?",
    content: [
      "When you need to detect if two words or phrases are anagrams",
      "When building word games or puzzles that involve letter rearrangement",
      "When implementing spell checkers that suggest anagram alternatives",
      "When you need to group words by their character composition",
      "When analyzing text for linguistic patterns or word relationships",
    ],
    examples: [
      "Word games like Scrabble or Words with Friends for finding valid words",
      "Crossword puzzle solvers that find anagram clues",
      "Educational apps that teach vocabulary through anagram exercises",
      "Text analysis tools that group words with similar letter patterns",
      "Social media features that detect anagram usernames or hashtags",
    ],
  },

  realWorldAnalogy: {
    title: "Real-World Analogy",
    content:
      "Think of anagram detection like checking if two recipes use exactly the same ingredients. You don't need to compare them step by step - you can make an inventory list from the first recipe (2 eggs, 1 cup flour, etc.), then go through the second recipe and check off each ingredient. If you can check off everything perfectly with nothing left over, the recipes use identical ingredients, just like anagrams use identical letters!",
  },

  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
  },
  spaceComplexity: "O(k) where k is the number of unique characters",
};
