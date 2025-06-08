import type { AlgorithmIntuition } from "@/types/algorithm";

export const reverseLinkedListIntuition: AlgorithmIntuition = {
  title: "Reverse Linked List",
  description:
    "An efficient algorithm that reverses a singly linked list in-place using three pointers to carefully redirect the connections between nodes.",

  intuition: {
    title: "The Core Intuition",
    content: [
      "Imagine you're holding a chain of people where each person has their hand on the shoulder of the person in front of them.",
      "To reverse this chain, you need to make each person turn around and put their hand on the shoulder of the person who was behind them.",
      "But you can't do this all at once - if everyone lets go simultaneously, the chain breaks and you lose track of people.",
      "Instead, you use three helpers: one to remember who was behind (prev), one to work with the current person, and one to remember who's ahead (next).",
      "You work through the chain one person at a time, carefully turning each person around while keeping track of the connections.",
      "This same principle applies to linked lists - we reverse the direction of each node's 'next' pointer one by one.",
    ],
  },

  whenToUse: {
    title: "When Should You Use This Algorithm?",
    content: [
      "When you need to reverse the order of elements in a linked list",
      "When implementing undo functionality in applications",
      "When solving problems that require processing lists in reverse order",
      "When building palindrome checkers for linked lists",
      "When implementing stack-like behavior using linked lists",
      "As a building block for more complex linked list algorithms",
    ],
    examples: [
      "Browser history navigation (back button functionality)",
      "Undo/Redo systems in text editors or graphic design software",
      "Music playlist reversal in streaming applications",
      "Reversing transaction logs in financial systems",
      "Implementing reverse iterators for custom data structures",
      "Processing DNA sequences in reverse for bioinformatics applications",
    ],
  },

  realWorldAnalogy: {
    title: "Real-World Analogy",
    content:
      "Think of reversing a linked list like reversing a train on a single track. You can't just pick up the entire train and flip it around. Instead, you need to carefully disconnect each car, turn it around, and reconnect it to face the opposite direction. You use three workers: one keeping track of the cars you've already reversed (prev), one working on the current car, and one noting which car comes next (next). By the time you're done, the caboose has become the engine, and the engine has become the caboose!",
  },

  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
  },
  spaceComplexity: "O(1) - constant space, in-place reversal",
};
