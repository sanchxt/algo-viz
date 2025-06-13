import type { AlgorithmIntuition } from "@/types/algorithm";

export const bfsTraversalIntuition: AlgorithmIntuition = {
  title: "Breadth-First Search (BFS) Tree Traversal",
  description:
    "A fundamental tree traversal algorithm that visits nodes level by level using a queue. It explores all nodes at the current depth before moving to nodes at the next depth level.",

  intuition: {
    title: "The Core Intuition",
    content: [
      "Think of BFS like exploring a building floor by floor - you visit every room on the first floor before going to the second floor, every room on the second floor before the third, and so on.",
      "The queue is the secret weapon: it naturally maintains the 'first-come, first-served' order that gives us level-by-level traversal.",
      "Unlike DFS (which goes deep first), BFS goes wide first - exploring all neighbors before moving further away from the starting point.",
      "The FIFO (First In, First Out) nature of queues ensures that nodes are processed in the exact order they were discovered, maintaining level order.",
      "Start with the root in the queue, then for each node you process: visit it, and add its children to the back of the queue.",
      "This creates a natural 'wave' effect - level 0 nodes are processed first, then level 1, then level 2, creating perfect level-order traversal.",
      "The beauty is in its simplicity: the queue automatically handles the complex coordination of when to visit each node.",
    ],
  },

  whenToUse: {
    title: "When Should You Use This Algorithm?",
    content: [
      "When you need to process tree/graph nodes level by level",
      "Finding the shortest path in unweighted graphs (BFS guarantees shortest path)",
      "Level-order tree serialization and deserialization",
      "Finding all nodes at a specific distance from a starting node",
      "Web crawling where you want to explore pages by their distance from the start page",
      "Social network analysis (friends, friends-of-friends, etc.)",
      "Game AI for exploring possible moves at each depth level",
      "Finding connected components in graphs",
    ],
    examples: [
      "GPS navigation systems finding shortest routes (unweighted roads)",
      "Social media 'People You May Know' suggestions (2-3 degrees of separation)",
      "File system directory listing tools that show folder contents level by level",
      "Network topology discovery tools that map devices by network hops",
      "Game AI in chess/checkers exploring moves by depth (1-move, 2-move ahead)",
      "Web crawlers like Google's indexing bots exploring websites systematically",
      "Flood fill algorithms in image editing software (paint bucket tool)",
      "Recommendation systems finding items through collaborative filtering",
    ],
  },

  realWorldAnalogy: {
    title: "Real-World Analogy",
    content:
      "Imagine you're organizing an emergency evacuation of a tall building. You start at the ground floor (root) and your goal is to count all people floor by floor. You use a clipboard (queue) to track which floors to visit next. You write down 'Floor 1' on your clipboard and start there. On Floor 1, you count everyone, then write 'Floor 2' and 'Floor 3' (if they exist) on your clipboard. You always visit floors in the order you wrote them down (FIFO). When you finish Floor 1, you cross it off and move to Floor 2 (next on your list). On Floor 2, you count everyone and add any new floors you discover to your clipboard. This systematic approach guarantees you'll count people floor by floor, never missing a level - exactly like BFS explores trees level by level using a queue!",
  },

  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
  },
  spaceComplexity:
    "O(w) where w is the maximum width of the tree (maximum number of nodes at any level). In the worst case, this is O(n) for a completely balanced tree.",
};
