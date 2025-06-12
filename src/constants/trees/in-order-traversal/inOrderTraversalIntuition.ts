import type { AlgorithmIntuition } from "@/types/algorithm";

export const inOrderTraversalIntuition: AlgorithmIntuition = {
  title: "In-order Tree Traversal",
  description:
    "A fundamental tree traversal algorithm that visits nodes in the order: left subtree, current node, right subtree. For binary search trees, this produces values in sorted order.",

  intuition: {
    title: "The Core Intuition",
    content: [
      "Think of a binary tree like a family tree where each person has at most two children (left and right).",
      "In-order traversal follows a specific visiting pattern: always visit the left family branch first, then the current person, then the right family branch.",
      "It's like reading a book from left to right - you process everything on the left page, then the center binding, then everything on the right page.",
      "This recursive pattern applies at every level: for each subtree, follow the same left → root → right rule.",
      "The beauty is that this simple pattern, when applied to a Binary Search Tree, magically produces all values in sorted order!",
      "The recursion naturally handles the tree structure - each subtree is just a smaller version of the same problem.",
    ],
  },

  whenToUse: {
    title: "When Should You Use This Algorithm?",
    content: [
      "When you need to retrieve all values from a Binary Search Tree in sorted order",
      "When implementing tree-to-array conversion maintaining sort order",
      "When validating if a binary tree is actually a valid Binary Search Tree",
      "When you need to process tree nodes in ascending value order",
      "As a foundation for more complex tree algorithms like tree serialization",
      "When implementing range queries or finding specific value ranges in BSTs",
      "When building iterators for tree-based data structures",
    ],
    examples: [
      "Database indexing systems that need to return sorted results from B-tree indexes",
      "Expression tree evaluation in compilers (processing operators in correct precedence order)",
      "File system directory traversal where you want alphabetically sorted listing",
      "Auto-complete systems that suggest words in alphabetical order from a trie",
      "Syntax tree traversal in code editors for features like 'go to definition'",
      "Game AI decision trees where choices need to be evaluated in priority order",
      "Music playlist organization where songs are stored in a BST by title or rating",
    ],
  },

  realWorldAnalogy: {
    title: "Real-World Analogy",
    content:
      "Imagine you're organizing a large library. The books are arranged in a tree structure where each shelf can point to two sub-sections (left and right). To read all book titles in alphabetical order, you'd follow the in-order rule: first read all titles in the left section, then the current shelf, then all titles in the right section. You'd apply this same pattern to every sub-section. Even though the physical layout is a tree, following this systematic approach guarantees you'll encounter every book title in perfect alphabetical order - just like in-order traversal gives you BST values in sorted order!",
  },

  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
  },
  spaceComplexity:
    "O(h) where h is the height of the tree (recursion stack space). O(log n) for balanced trees, O(n) for skewed trees.",
};
