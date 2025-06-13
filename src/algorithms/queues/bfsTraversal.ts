import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface TreeNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
  position?: { x: number; y: number };
}

interface QueueElement {
  nodeId: string;
  level: number;
  id: string;
  addedAtStep: number;
}

interface BfsTraversalState {
  nodes: TreeNode[];
  queue: QueueElement[];
  traversalResult: number[];
  visitedNodes: string[];
  currentNodeId: string | null;
  currentLevel: number;
  nodesInCurrentLevel: number;
  processedInCurrentLevel: number;
  levelNodes: { [level: number]: string[] };
}

export const EXAMPLE_TREES = {
  small: {
    name: "Small Tree (3 nodes)",
    nodes: [
      { id: "node1", value: 2, left: "node2", right: "node3" },
      { id: "node2", value: 1, left: null, right: null },
      { id: "node3", value: 3, left: null, right: null },
    ],
    root: "node1",
  },
  medium: {
    name: "Medium Tree (7 nodes)",
    nodes: [
      { id: "node1", value: 4, left: "node2", right: "node3" },
      { id: "node2", value: 2, left: "node4", right: "node5" },
      { id: "node3", value: 6, left: "node6", right: "node7" },
      { id: "node4", value: 1, left: null, right: null },
      { id: "node5", value: 3, left: null, right: null },
      { id: "node6", value: 5, left: null, right: null },
      { id: "node7", value: 7, left: null, right: null },
    ],
    root: "node1",
  },
  unbalanced: {
    name: "Unbalanced Tree",
    nodes: [
      { id: "node1", value: 1, left: null, right: "node2" },
      { id: "node2", value: 2, left: null, right: "node3" },
      { id: "node3", value: 3, left: "node4", right: null },
      { id: "node4", value: 2.5, left: null, right: null },
    ],
    root: "node1",
  },
};

/**
 * generates steps for breadth-first (level-order) binary tree traversal using a queue.
 * @param {TreeNode[]} nodes - array of tree nodes
 * @param {string | null} rootId - id of the root node
 * @returns {EnhancedAlgorithmStep[]} array of steps representing the traversal process
 */
export const generateBfsTraversalSteps = (
  nodes: TreeNode[],
  rootId: string | null
): EnhancedAlgorithmStep[] => {
  const steps: EnhancedAlgorithmStep[] = [];
  let stepId = 0;
  let queueElementIdCounter = 0;

  // helper to generate unique queue element IDs
  const generateQueueElementId = () => `queue_elem_${queueElementIdCounter++}`;

  // helper to create step data
  const createStepData = (state: BfsTraversalState): BfsTraversalState => ({
    nodes: state.nodes,
    queue: [...state.queue],
    traversalResult: [...state.traversalResult],
    visitedNodes: [...state.visitedNodes],
    currentNodeId: state.currentNodeId,
    currentLevel: state.currentLevel,
    nodesInCurrentLevel: state.nodesInCurrentLevel,
    processedInCurrentLevel: state.processedInCurrentLevel,
    levelNodes: { ...state.levelNodes },
  });

  // initialize state
  const state: BfsTraversalState = {
    nodes: nodes,
    queue: [],
    traversalResult: [],
    visitedNodes: [],
    currentNodeId: null,
    currentLevel: 0,
    nodesInCurrentLevel: rootId ? 1 : 0,
    processedInCurrentLevel: 0,
    levelNodes: {},
  };

  // step 1: initialization
  steps.push({
    id: stepId++,
    dataStructures: {
      tree: {
        type: "tree",
        data: {
          nodes: createStepData(state).nodes,
          root: rootId,
        },
        metadata: {
          label: "Binary Tree",
          position: { x: 0, y: 0 },
        },
      },
      queue: {
        type: "queue",
        data: createStepData(state).queue,
        metadata: {
          label: "Queue (FIFO)",
          position: { x: 1, y: 0 },
          style: { orientation: "horizontal" },
        },
      },
      result: {
        type: "array",
        data: createStepData(state).traversalResult,
        metadata: {
          label: "Level-Order Result",
          position: { x: 0, y: 1 },
        },
      },
    },
    highlights: {},
    stepType: "initialization",
    explanation: `Starting breadth-first (level-order) traversal${
      rootId ? ` from root node ${rootId}` : " of empty tree"
    }. BFS uses a queue to visit nodes level by level.`,
    variables: {
      treeSize: nodes.length,
      rootId: rootId,
      expectedResult: getExpectedBfsTraversal(nodes, rootId),
      queueSize: 0,
      currentLevel: 0,
    },
    timing: { duration: 1500 },
  });

  // early return if tree is empty
  if (!rootId || nodes.length === 0) {
    steps.push({
      id: stepId++,
      dataStructures: {
        tree: {
          type: "tree",
          data: {
            nodes: createStepData(state).nodes,
            root: rootId,
          },
          metadata: {
            label: "Binary Tree",
            position: { x: 0, y: 0 },
          },
        },
        queue: {
          type: "queue",
          data: createStepData(state).queue,
          metadata: {
            label: "Queue (FIFO)",
            position: { x: 1, y: 0 },
            style: { orientation: "horizontal" },
          },
        },
        result: {
          type: "array",
          data: createStepData(state).traversalResult,
          metadata: {
            label: "Level-Order Result",
            position: { x: 0, y: 1 },
          },
        },
      },
      highlights: {},
      stepType: "return",
      explanation: "Tree is empty. Traversal complete with empty result.",
      variables: {
        finalResult: [],
        isComplete: true,
      },
      timing: { duration: 1000 },
    });
    return steps;
  }

  // step 2: enqueue root node
  const rootElement: QueueElement = {
    nodeId: rootId,
    level: 0,
    id: generateQueueElementId(),
    addedAtStep: stepId,
  };
  state.queue.push(rootElement);
  state.levelNodes[0] = [rootId];

  steps.push({
    id: stepId++,
    dataStructures: {
      tree: {
        type: "tree",
        data: {
          nodes: createStepData(state).nodes,
          root: rootId,
        },
        metadata: {
          label: "Binary Tree",
          position: { x: 0, y: 0 },
        },
      },
      queue: {
        type: "queue",
        data: createStepData(state).queue,
        metadata: {
          label: "Queue (FIFO)",
          position: { x: 1, y: 0 },
          style: { orientation: "horizontal" },
        },
      },
      result: {
        type: "array",
        data: createStepData(state).traversalResult,
        metadata: {
          label: "Level-Order Result",
          position: { x: 0, y: 1 },
        },
      },
    },
    highlights: {
      tree: [{ type: "nodes", values: [rootId], style: "highlight" }],
      queue: [
        {
          type: "queue_elements",
          values: [rootElement.id],
          style: "highlight",
        },
      ],
    },
    stepType: "queue_enqueue",
    stepContext: {
      operation: "enqueue",
      dataStructure: "queue",
      queueElement: rootId,
      queueSize: 1,
      currentLevel: 0,
      nodeId: rootId,
    },
    explanation: `Enqueued root node ${rootId} (value: ${
      nodes.find((n) => n.id === rootId)?.value
    }) to start BFS. Queue size: ${state.queue.length}`,
    variables: {
      enqueuedNode: rootId,
      queueSize: state.queue.length,
      currentLevel: 0,
      action: "enqueue",
    },
    timing: { duration: 1200 },
  });

  // main bfs loop
  while (state.queue.length > 0) {
    // peek at front of queue
    const frontElement = state.queue[0];
    state.currentNodeId = frontElement.nodeId;

    // check if we're starting a new level
    if (frontElement.level > state.currentLevel) {
      // mark previous level as complete
      steps.push({
        id: stepId++,
        dataStructures: {
          tree: {
            type: "tree",
            data: {
              nodes: createStepData(state).nodes,
              root: rootId,
            },
            metadata: {
              label: "Binary Tree",
              position: { x: 0, y: 0 },
            },
          },
          queue: {
            type: "queue",
            data: createStepData(state).queue,
            metadata: {
              label: "Queue (FIFO)",
              position: { x: 1, y: 0 },
              style: { orientation: "horizontal" },
            },
          },
          result: {
            type: "array",
            data: createStepData(state).traversalResult,
            metadata: {
              label: "Level-Order Result",
              position: { x: 0, y: 1 },
            },
          },
        },
        highlights: {
          tree: state.levelNodes[state.currentLevel]
            ? [
                {
                  type: "nodes",
                  values: state.levelNodes[state.currentLevel],
                  style: "level_complete",
                },
              ]
            : [],
        },
        stepType: "level_complete",
        stepContext: {
          operation: "read",
          dataStructure: "tree",
          currentLevel: state.currentLevel,
          nodesInCurrentLevel: state.nodesInCurrentLevel,
          processedInLevel: state.processedInCurrentLevel,
        },
        explanation: `Level ${state.currentLevel} complete! Processed ${state.processedInCurrentLevel} nodes. Moving to level ${frontElement.level}.`,
        variables: {
          completedLevel: state.currentLevel,
          nodesInLevel: state.nodesInCurrentLevel,
          nextLevel: frontElement.level,
          totalProcessed: state.visitedNodes.length,
        },
        timing: { duration: 1000 },
      });

      // update level tracking
      state.currentLevel = frontElement.level;
      state.processedInCurrentLevel = 0;
      state.nodesInCurrentLevel = state.queue.filter(
        (elem) => elem.level === state.currentLevel
      ).length;
    }

    // step: peek at queue front
    steps.push({
      id: stepId++,
      dataStructures: {
        tree: {
          type: "tree",
          data: {
            nodes: createStepData(state).nodes,
            root: rootId,
          },
          metadata: {
            label: "Binary Tree",
            position: { x: 0, y: 0 },
          },
        },
        queue: {
          type: "queue",
          data: createStepData(state).queue,
          metadata: {
            label: "Queue (FIFO)",
            position: { x: 1, y: 0 },
            style: { orientation: "horizontal" },
          },
        },
        result: {
          type: "array",
          data: createStepData(state).traversalResult,
          metadata: {
            label: "Level-Order Result",
            position: { x: 0, y: 1 },
          },
        },
      },
      highlights: {
        tree: [
          { type: "nodes", values: [frontElement.nodeId], style: "current" },
        ],
        queue: [
          {
            type: "queue_front",
            values: [frontElement.id],
            style: "highlight",
          },
        ],
      },
      stepType: "queue_peek",
      stepContext: {
        operation: "peek",
        dataStructure: "queue",
        queueElement: frontElement.nodeId,
        queueSize: state.queue.length,
        currentLevel: frontElement.level,
        nodeId: frontElement.nodeId,
      },
      explanation: `Peeking at queue front: node ${frontElement.nodeId} (level ${frontElement.level}). Next to be processed.`,
      variables: {
        frontNode: frontElement.nodeId,
        nodeLevel: frontElement.level,
        queueSize: state.queue.length,
        action: "peek",
      },
      timing: { duration: 800 },
    });

    // step: dequeue and visit node
    const dequeuedElement = state.queue.shift()!;
    const currentNode = nodes.find((n) => n.id === dequeuedElement.nodeId);
    if (!currentNode) continue;

    state.visitedNodes.push(dequeuedElement.nodeId);
    state.traversalResult.push(currentNode.value);
    state.processedInCurrentLevel++;

    steps.push({
      id: stepId++,
      dataStructures: {
        tree: {
          type: "tree",
          data: {
            nodes: createStepData(state).nodes,
            root: rootId,
          },
          metadata: {
            label: "Binary Tree",
            position: { x: 0, y: 0 },
          },
        },
        queue: {
          type: "queue",
          data: createStepData(state).queue,
          metadata: {
            label: "Queue (FIFO)",
            position: { x: 1, y: 0 },
            style: { orientation: "horizontal" },
          },
        },
        result: {
          type: "array",
          data: createStepData(state).traversalResult,
          metadata: {
            label: "Level-Order Result",
            position: { x: 0, y: 1 },
          },
        },
      },
      highlights: {
        tree: [
          { type: "nodes", values: [dequeuedElement.nodeId], style: "visited" },
        ],
        result: [
          {
            type: "indices",
            values: [state.traversalResult.length - 1],
            style: "highlight",
          },
        ],
      },
      stepType: "queue_dequeue",
      stepContext: {
        operation: "dequeue",
        dataStructure: "queue",
        queueElement: dequeuedElement.nodeId,
        queueSize: state.queue.length,
        currentLevel: dequeuedElement.level,
        nodeId: dequeuedElement.nodeId,
      },
      explanation: `Dequeued and visited node ${dequeuedElement.nodeId} (value: ${currentNode.value}). Added to result. Queue size: ${state.queue.length}`,
      variables: {
        dequeuedNode: dequeuedElement.nodeId,
        visitedValue: currentNode.value,
        queueSize: state.queue.length,
        resultLength: state.traversalResult.length,
        currentLevel: dequeuedElement.level,
        levelProgress: `${state.processedInCurrentLevel}/${state.nodesInCurrentLevel}`,
      },
      timing: { duration: 1200 },
    });

    // enqueue children (left first, then right)
    const childrenToEnqueue: { nodeId: string; side: "left" | "right" }[] = [];

    if (currentNode.left) {
      childrenToEnqueue.push({ nodeId: currentNode.left, side: "left" });
    }
    if (currentNode.right) {
      childrenToEnqueue.push({ nodeId: currentNode.right, side: "right" });
    }

    if (childrenToEnqueue.length > 0) {
      const nextLevel = dequeuedElement.level + 1;

      // initialize level tracking if needed
      if (!state.levelNodes[nextLevel]) {
        state.levelNodes[nextLevel] = [];
      }

      for (const child of childrenToEnqueue) {
        const childElement: QueueElement = {
          nodeId: child.nodeId,
          level: nextLevel,
          id: generateQueueElementId(),
          addedAtStep: stepId,
        };

        state.queue.push(childElement);
        state.levelNodes[nextLevel].push(child.nodeId);

        steps.push({
          id: stepId++,
          dataStructures: {
            tree: {
              type: "tree",
              data: {
                nodes: createStepData(state).nodes,
                root: rootId,
              },
              metadata: {
                label: "Binary Tree",
                position: { x: 0, y: 0 },
              },
            },
            queue: {
              type: "queue",
              data: createStepData(state).queue,
              metadata: {
                label: "Queue (FIFO)",
                position: { x: 1, y: 0 },
                style: { orientation: "horizontal" },
              },
            },
            result: {
              type: "array",
              data: createStepData(state).traversalResult,
              metadata: {
                label: "Level-Order Result",
                position: { x: 0, y: 1 },
              },
            },
          },
          highlights: {
            tree: [
              {
                type: "nodes",
                values: [dequeuedElement.nodeId],
                style: "visited",
              },
              { type: "nodes", values: [child.nodeId], style: "highlight" },
            ],
            queue: [
              {
                type: "queue_elements",
                values: [childElement.id],
                style: "highlight",
              },
            ],
          },
          stepType: "queue_enqueue",
          stepContext: {
            operation: "enqueue",
            dataStructure: "queue",
            queueElement: child.nodeId,
            queueSize: state.queue.length,
            currentLevel: nextLevel,
            nodeId: child.nodeId,
          },
          explanation: `Enqueued ${child.side} child ${child.nodeId} (value: ${
            nodes.find((n) => n.id === child.nodeId)?.value
          }) at level ${nextLevel}. Queue size: ${state.queue.length}`,
          variables: {
            enqueuedNode: child.nodeId,
            childSide: child.side,
            parentNode: dequeuedElement.nodeId,
            nodeLevel: nextLevel,
            queueSize: state.queue.length,
            nodeValue: nodes.find((n) => n.id === child.nodeId)?.value,
          },
          timing: { duration: 1000 },
        });
      }
    }
  }

  // final step: traversal complete
  steps.push({
    id: stepId++,
    dataStructures: {
      tree: {
        type: "tree",
        data: {
          nodes: createStepData(state).nodes,
          root: rootId,
        },
        metadata: {
          label: "Binary Tree",
          position: { x: 0, y: 0 },
        },
      },
      queue: {
        type: "queue",
        data: createStepData(state).queue,
        metadata: {
          label: "Queue (FIFO)",
          position: { x: 1, y: 0 },
          style: { orientation: "horizontal" },
        },
      },
      result: {
        type: "array",
        data: createStepData(state).traversalResult,
        metadata: {
          label: "Level-Order Result",
          position: { x: 0, y: 1 },
        },
      },
    },
    highlights: {
      tree: [{ type: "nodes", values: state.visitedNodes, style: "match" }],
      result: [
        {
          type: "indices",
          values: Array.from(
            { length: state.traversalResult.length },
            (_, i) => i
          ),
          style: "match",
        },
      ],
    },
    stepType: "return",
    explanation: `BFS traversal complete! Result: [${state.traversalResult.join(
      ", "
    )}]. Nodes visited level by level using queue's FIFO principle.`,
    variables: {
      finalResult: state.traversalResult,
      totalNodes: state.visitedNodes.length,
      traversalOrder: "level by level (BFS)",
      isComplete: true,
      totalLevels: state.currentLevel + 1,
    },
    timing: { duration: 2000 },
  });

  return steps;
};

const getExpectedBfsTraversal = (
  nodes: TreeNode[],
  rootId: string | null
): number[] => {
  if (!rootId || nodes.length === 0) return [];

  const result: number[] = [];
  const queue: string[] = [rootId];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) continue;

    result.push(node.value);

    // enqueue children (left first, then right)
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  return result;
};

export default generateBfsTraversalSteps;
