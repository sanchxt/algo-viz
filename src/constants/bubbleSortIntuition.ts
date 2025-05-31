import type { AlgorithmIntuition } from "../types/algorithm";

export const bubbleSortIntuition: AlgorithmIntuition = {
  title: "Bubble Sort",
  description:
    "A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",

  intuition: {
    title: "The Core Intuition",
    content: [
      "Imagine you have a line of people of different heights, and you want to arrange them from shortest to tallest.",
      "You walk down the line, and whenever you see a taller person standing in front of a shorter person, you ask them to swap places.",
      "After one complete walk-through, the tallest person will have 'bubbled up' to the end of the line.",
      "You repeat this process, and each time, the next tallest person bubbles up to their correct position.",
      "Eventually, everyone is in the right order - this is exactly how Bubble Sort works!",
    ],
  },

  whenToUse: {
    title: "When Should You Use Bubble Sort?",
    content: [
      "When you're learning sorting algorithms - it's the most intuitive to understand",
      "For very small datasets (less than 10-20 elements) where simplicity matters more than efficiency",
      "When you need a stable sorting algorithm and can't use more complex ones",
      "In educational contexts to demonstrate basic sorting concepts",
    ],
    examples: [
      "Sorting a small list of high scores in a simple game",
      "Organizing a handful of items in a basic application",
      "Teaching sorting concepts to beginners",
      "Quick prototyping where performance isn't critical",
    ],
  },

  realWorldAnalogy: {
    title: "Real-World Analogy",
    content:
      "Think of Bubble Sort like organizing a deck of cards in your hands. You go through the cards from left to right, and whenever you find a card that's out of order, you swap it with its neighbor. You keep doing this until you can go through the entire deck without making any swaps. It's not the fastest way to sort cards, but it's very easy to understand and implement!",
  },
};

export const algorithmIntuitions = {
  "bubble-sort": bubbleSortIntuition,
};
