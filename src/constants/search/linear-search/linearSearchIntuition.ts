import type { AlgorithmIntuition } from "@/types/algorithm";

export const linearSearchIntuition: AlgorithmIntuition = {
  title: "Linear Search",
  description:
    "A simple search algorithm that checks every element in a list sequentially until the target element is found or the entire list has been searched.",

  intuition: {
    title: "The Core Intuition",
    content: [
      "Imagine you're looking for a specific book in a stack of books on your desk, but they're not organized in any particular order.",
      "The most straightforward approach is to pick up the first book, check if it's the one you want, and if not, move to the next book.",
      "You continue this process, checking each book one by one, from the first to the last, until you either find your book or reach the end of the stack.",
      "This is exactly how linear search works - it examines each element in the array sequentially, from start to finish.",
      "It's simple, reliable, and works on any kind of data, whether sorted or unsorted!",
    ],
  },

  whenToUse: {
    title: "When Should You Use Linear Search?",
    content: [
      "When you have an unsorted array or list and need to find a specific element",
      "When working with small datasets where the simplicity outweighs efficiency concerns",
      "When you need to find all occurrences of an element, not just the first one",
      "When the data structure doesn't support more efficient search methods",
      "When you're implementing a quick prototype and simplicity is key",
    ],
    examples: [
      "Searching for a name in an unsorted contact list",
      "Finding a specific item in a shopping cart",
      "Locating a particular record in a small database",
      "Checking if an element exists in an unsorted array",
      "Finding the first occurrence of a character in a string",
    ],
  },

  realWorldAnalogy: {
    title: "Real-World Analogy",
    content:
      "Linear search is like looking for your keys when you've misplaced them. You start searching room by room, checking every possible location systematically. You look under the couch cushions, on the kitchen counter, in your jacket pockets, and so on. You don't skip any location because your keys could be anywhere, and you continue until you either find them or have checked everywhere. It might not be the fastest method, but it's thorough and guaranteed to work!",
  },
};

export const algorithmIntuitions = {
  "linear-search": linearSearchIntuition,
};
