import type { Algorithm } from "@/types/algorithm";

export interface AlgorithmCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: {
    gradient: string;
    border: string;
    text: string;
  };
  algorithms: Algorithm[];
}

export const algorithmCategories: AlgorithmCategory[] = [
  {
    id: "sorting",
    name: "Sorting",
    description:
      "Algorithms that arrange elements in a specific order, fundamental for organizing data efficiently.",
    icon: "↕️",
    color: {
      gradient: "from-blue-400/20 to-blue-600/20",
      border: "border-blue-400/30",
      text: "text-blue-300",
    },
    algorithms: [
      {
        id: "bubble-sort",
        name: "Bubble Sort",
        category: "sorting",
        difficulty: "Beginner",
        description:
          "A simple comparison-based sorting algorithm that repeatedly steps through the list and swaps adjacent elements.",
      },
    ],
  },
  {
    id: "search",
    name: "Search",
    description: "Linear and Binary search algorithms for data structures.",
    icon: "🔍",
    color: {
      gradient: "from-green-500/20 to-emerald-500/20",
      border: "border-green-400/30",
      text: "text-green-300",
    },
    algorithms: [
      {
        id: "linear-search",
        name: "Linear Search",
        category: "search",
        difficulty: "Beginner",
        description:
          "A simple search algorithm that checks every element sequentially until the target is found or the list ends.",
      },
      {
        id: "binary-search",
        name: "Binary Search",
        category: "search",
        difficulty: "Beginner",
        description:
          "An efficient algorithm for finding a specific value in a sorted array by repeatedly dividing the search interval in half.",
      },
    ],
  },
  {
    id: "sliding-window",
    name: "Sliding Window & Two Pointers",
    description:
      "Techniques for solving problems involving contiguous subarrays or paired elements efficiently.",
    icon: "🪟",
    color: {
      gradient: "from-purple-400/20 to-purple-600/20",
      border: "border-purple-400/30",
      text: "text-purple-300",
    },
    algorithms: [
      {
        id: "two-sum",
        name: "Two Sum (Two Pointers)",
        category: "sliding-window",
        difficulty: "Beginner",
        description:
          "Find two numbers in a sorted array that add up to a specific target using the efficient two pointers technique.",
      },
    ],
  },
  {
    id: "strings",
    name: "String Manipulation",
    description:
      "Algorithms for processing, searching, and manipulating text and character sequences.",
    icon: "📝",
    color: {
      gradient: "from-yellow-400/20 to-yellow-600/20",
      border: "border-yellow-400/30",
      text: "text-yellow-300",
    },
    algorithms: [
      {
        id: "anagram-detection",
        name: "Anagram Detection",
        category: "strings",
        difficulty: "Beginner",
        description:
          "Efficiently determine if two strings are anagrams by counting character frequencies using hash maps.",
        dataStructureType: "mixed",
      },
    ],
  },
  {
    id: "linked-lists",
    name: "Linked Lists",
    description:
      "Linear data structures where elements are stored in nodes connected through pointers.",
    icon: "🔗",
    color: {
      gradient: "from-pink-400/20 to-pink-600/20",
      border: "border-pink-400/30",
      text: "text-pink-300",
    },
    algorithms: [
      {
        id: "reverse-linked-list",
        name: "Reverse Linked List",
        category: "linked-lists",
        difficulty: "Beginner",
        description:
          "Reverse a singly linked list in-place using three pointers to carefully redirect node connections.",
        dataStructureType: "linkedlist",
      },
    ],
  },
  {
    id: "recursion",
    name: "Recursion",
    description:
      "Problem-solving approach where functions call themselves to solve smaller subproblems.",
    icon: "🔄",
    color: {
      gradient: "from-indigo-400/20 to-indigo-600/20",
      border: "border-indigo-400/30",
      text: "text-indigo-300",
    },
    algorithms: [
      {
        id: "factorial",
        name: "Factorial (Recursive)",
        category: "recursion",
        difficulty: "Beginner",
        description:
          "A classic recursive algorithm that calculates the factorial of a number by breaking it down into smaller subproblems.",
      },
    ],
  },
  {
    id: "stacks",
    name: "Stacks",
    description:
      "Linear data structures that follow Last-In-First-Out (LIFO) principle for insertion and deletion.",
    icon: "📚",
    color: {
      gradient: "from-teal-400/20 to-teal-600/20",
      border: "border-teal-400/30",
      text: "text-teal-300",
    },
    algorithms: [
      {
        id: "balanced-parentheses",
        name: "Balanced Parentheses Checker",
        category: "stacks",
        difficulty: "Beginner",
        description:
          "Verify whether brackets in a string are properly balanced and correctly nested using stack's LIFO principle.",
        dataStructureType: "stack",
      },
    ],
  },
  {
    id: "binary-trees",
    name: "Binary Trees",
    description:
      "Hierarchical data structures where each node has at most two children.",
    icon: "🌳",
    color: {
      gradient: "from-emerald-400/20 to-emerald-600/20",
      border: "border-emerald-400/30",
      text: "text-emerald-300",
    },
    algorithms: [
      {
        id: "in-order-traversal",
        name: "In-order Traversal",
        category: "trees",
        difficulty: "Beginner",
        description:
          "Visit all nodes in a binary tree following left → root → right order. Produces sorted sequence for Binary Search Trees.",
        dataStructureType: "tree",
      },
    ],
  },
  {
    id: "queues",
    name: "Queues",
    description:
      "Linear data structures that follow First-In-First-Out (FIFO) principle for insertion and deletion.",
    icon: "🚶‍♂️",
    color: {
      gradient: "from-cyan-400/20 to-cyan-600/20",
      border: "border-cyan-400/30",
      text: "text-cyan-300",
    },
    algorithms: [
      {
        id: "bfs-traversal",
        name: "BFS (Level-Order) Traversal",
        category: "trees",
        difficulty: "Beginner",
        description:
          "Visit all nodes in a binary tree level by level using a queue. Explores breadth-first, processing all nodes at each depth before moving deeper.",
        dataStructureType: "queue",
      },
    ],
  },
  {
    id: "graphs",
    name: "Graphs",
    description:
      "Non-linear data structures consisting of vertices connected by edges.",
    icon: "🕸️",
    color: {
      gradient: "from-orange-400/20 to-orange-600/20",
      border: "border-orange-400/30",
      text: "text-orange-300",
    },
    algorithms: [
      {
        id: "cycle-detection",
        name: "Cycle Detection",
        category: "graphs",
        difficulty: "Beginner",
        description:
          "Detect if an undirected graph contains cycles using depth-first search to identify back edges that form loops.",
        dataStructureType: "graph",
      },
    ],
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    description:
      "Optimization technique that solves complex problems by breaking them into simpler subproblems.",
    icon: "⚡",
    color: {
      gradient: "from-red-400/20 to-red-600/20",
      border: "border-red-400/30",
      text: "text-red-300",
    },
    algorithms: [
      {
        id: "coin-change",
        name: "Coin Change",
        category: "dynamic-programming",
        difficulty: "Intermediate",
        description:
          "Find the minimum number of coins needed to make a given amount using dynamic programming to optimize overlapping subproblems.",
        dataStructureType: "array",
      },
    ],
  },
  {
    id: "greedy",
    name: "Greedy Algorithms",
    description:
      "Problem-solving approach that makes locally optimal choices at each step.",
    icon: "🎯",
    color: {
      gradient: "from-violet-400/20 to-violet-600/20",
      border: "border-violet-400/30",
      text: "text-violet-300",
    },
    algorithms: [
      {
        id: "min-cost-array",
        name: "Minimum Cost to Make Array Size 1",
        category: "greedy",
        difficulty: "Intermediate",
        description:
          "Find the minimum cost to reduce an array to size 1 by removing larger elements from pairs, using greedy strategy to minimize total cost.",
        dataStructureType: "array",
      },
    ],
  },
  {
    id: "heaps",
    name: "Heaps",
    description:
      "Complete binary trees that satisfy the heap property for efficient priority operations.",
    icon: "⛰️",
    color: {
      gradient: "from-slate-400/20 to-slate-600/20",
      border: "border-slate-400/30",
      text: "text-slate-300",
    },
    algorithms: [
      {
        id: "k-largest-elements",
        name: "K Largest Elements",
        category: "heaps",
        difficulty: "Intermediate",
        description:
          "Find the K largest elements from an array using a min-heap of size K. Efficiently maintains top K elements with O(n log k) time complexity.",
        dataStructureType: "heap",
      },
    ],
  },
];

// helper: get a category by ID
export const getCategoryById = (id: string): AlgorithmCategory | undefined => {
  return algorithmCategories.find((category) => category.id === id);
};

// helper: get all categories with available algorithms
export const getCategoriesWithAlgorithms = (): AlgorithmCategory[] => {
  return algorithmCategories.filter(
    (category) => category.algorithms.length > 0
  );
};
