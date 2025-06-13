import type { AlgorithmIntuition } from "@/types/algorithm";

export const cycleDetectionIntuition: AlgorithmIntuition = {
  title: "Cycle Detection in Undirected Graphs",
  description:
    "A depth-first search (DFS) based algorithm that efficiently detects whether an undirected graph contains any cycles by tracking visited nodes and their parent relationships.",

  intuition: {
    title: "The Core Intuition",
    content: [
      "Imagine you're exploring a network of rooms connected by doors, and you want to know if there's a circular path that brings you back to a room you've already visited.",
      "You start from any room and explore deeper into connected rooms, always remembering which room you came from (the parent).",
      "As you explore, you mark each room as 'visited' to avoid infinite exploration.",
      "The key insight: if you encounter a room you've already visited AND it's not the room you just came from, you've found a cycle!",
      "This works because in an undirected graph, the only way to reach a visited node (other than going back to your parent) is through an alternative path - which means there's a loop.",
      "The algorithm handles disconnected graphs by starting fresh DFS from any unvisited component.",
    ],
  },

  whenToUse: {
    title: "When Should You Use This Algorithm?",
    content: [
      "When you need to detect cycles in undirected graphs (networks, connections, relationships)",
      "For validating that a graph structure is a tree (trees have no cycles)",
      "When checking if adding an edge would create a cycle in graph construction",
      "For detecting deadlocks in resource allocation graphs",
      "When ensuring acyclic properties in dependency graphs",
      "For validating forest structures in data organization",
    ],
    examples: [
      "Social network analysis: detecting circular friend relationships",
      "Network topology validation: ensuring no routing loops exist",
      "Project dependency management: avoiding circular dependencies",
      "Database foreign key constraint validation",
      "Game map design: detecting invalid circular paths in mazes",
      "Circuit design: identifying short circuits or feedback loops",
      "Family tree validation: ensuring no impossible relationships",
      "Supply chain analysis: detecting circular supplier dependencies",
    ],
  },

  realWorldAnalogy: {
    title: "Real-World Analogy",
    content:
      "Think of cycle detection like exploring a cave system with a friend. You start at the entrance and explore each tunnel, always remembering which tunnel you came from. You mark each cave room with chalk so you know you've been there. If you ever find yourself in a room you've already marked (but didn't just come from), you know there's a circular path in the cave system! This is exactly how the algorithm works: it explores the graph like cave tunnels, remembers the parent (where it came from), marks visited nodes, and detects when it encounters a 'back edge' that creates a cycle.",
  },

  timeComplexity: {
    best: "O(V + E)",
    average: "O(V + E)",
    worst: "O(V + E)",
  },
  spaceComplexity:
    "O(V) - for the visited set and recursion stack in worst case",
};
