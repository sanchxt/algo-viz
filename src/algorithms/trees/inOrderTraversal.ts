import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface TreeNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
  position?: { x: number; y: number };
}

interface CallStackFrame {
  id: string;
  nodeId: string | null;
  phase: "entering" | "left_done" | "visiting" | "right_done" | "returning";
  parentCallId?: string;
  depth: number;
}

interface TreeTraversalState {
  nodes: TreeNode[];
  callStack: CallStackFrame[];
  traversalResult: number[];
  visitedNodes: string[];
  currentNodeId: string | null;
  currentCallId: string | null;
}

// predefined example trees
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
 * generates steps for in-order binary tree traversal using recursion.
 * @param {TreeNode[]} nodes - array of tree nodes
 * @param {string | null} rootId - id of the root node
 * @returns {EnhancedAlgorithmStep[]} array of steps representing the traversal process
 */
export const generateInOrderTraversalSteps = (
  nodes: TreeNode[],
  rootId: string | null
): EnhancedAlgorithmStep[] => {
  const steps: EnhancedAlgorithmStep[] = [];
  let stepId = 0;
  let callIdCounter = 0;

  // helper to generate unique call IDs
  const generateCallId = () => `call_${callIdCounter++}`;

  // helper to create step data
  const createStepData = (state: TreeTraversalState): TreeTraversalState => ({
    nodes: state.nodes,
    callStack: [...state.callStack],
    traversalResult: [...state.traversalResult],
    visitedNodes: [...state.visitedNodes],
    currentNodeId: state.currentNodeId,
    currentCallId: state.currentCallId,
  });

  // initialize state
  const state: TreeTraversalState = {
    nodes: nodes,
    callStack: [],
    traversalResult: [],
    visitedNodes: [],
    currentNodeId: null,
    currentCallId: null,
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
      callStack: {
        type: "call_stack",
        data: createStepData(state).callStack,
        metadata: {
          label: "Call Stack",
          position: { x: 1, y: 0 },
        },
      },
      result: {
        type: "array",
        data: createStepData(state).traversalResult,
        metadata: {
          label: "Traversal Result",
          position: { x: 0, y: 1 },
        },
      },
    },
    highlights: {},
    stepType: "initialization",
    explanation: `Starting in-order traversal${
      rootId ? ` from root node ${rootId}` : " of empty tree"
    }. In-order traversal visits nodes in order: Left → Root → Right.`,
    variables: {
      treeSize: nodes.length,
      rootId: rootId,
      expectedResult: getExpectedTraversal(nodes, rootId),
    },
    timing: { duration: 1500 },
  });

  // recursive traversal function
  const traverse = (
    nodeId: string | null,
    parentCallId?: string,
    depth: number = 0
  ) => {
    const callId = generateCallId();
    state.currentCallId = callId;
    state.currentNodeId = nodeId;

    // push call frame to stack
    const callFrame: CallStackFrame = {
      id: callId,
      nodeId: nodeId,
      phase: "entering",
      parentCallId: parentCallId,
      depth: depth,
    };
    state.callStack.push(callFrame);

    // step: function call
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
        callStack: {
          type: "call_stack",
          data: createStepData(state).callStack,
          metadata: {
            label: "Call Stack",
            position: { x: 1, y: 0 },
          },
        },
        result: {
          type: "array",
          data: createStepData(state).traversalResult,
          metadata: {
            label: "Traversal Result",
            position: { x: 0, y: 1 },
          },
        },
      },
      highlights: {
        tree: nodeId
          ? [{ type: "nodes", values: [nodeId], style: "current" }]
          : [],
        callStack: [
          { type: "call_frames", values: [callId], style: "highlight" },
        ],
      },
      stepType: "recursive_call",
      stepContext: {
        operation: "call",
        dataStructure: "call_stack",
        recursionLevel: depth,
        callId: callId,
        parentCallId: parentCallId,
        nodeId: nodeId || undefined,
      },
      explanation: `Calling inOrder(${nodeId || "null"}) - ${
        nodeId
          ? `visiting node with value ${
              nodes.find((n) => n.id === nodeId)?.value
            }`
          : "reached null node"
      }`,
      variables: {
        currentNode: nodeId,
        callStackSize: state.callStack.length,
        recursionDepth: depth,
        currentPhase: "entering",
      },
      timing: { duration: 1000 },
    });

    // step: base case check
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
        callStack: {
          type: "call_stack",
          data: createStepData(state).callStack,
          metadata: {
            label: "Call Stack",
            position: { x: 1, y: 0 },
          },
        },
        result: {
          type: "array",
          data: createStepData(state).traversalResult,
          metadata: {
            label: "Traversal Result",
            position: { x: 0, y: 1 },
          },
        },
      },
      highlights: {
        tree: nodeId
          ? [{ type: "nodes", values: [nodeId], style: "processing" }]
          : [],
        callStack: [{ type: "call_frames", values: [callId], style: "active" }],
      },
      stepType: "base_case_check",
      stepContext: {
        operation: "validate",
        dataStructure: "tree",
        recursionLevel: depth,
        callId: callId,
        nodeId: nodeId || undefined,
      },
      explanation: `Checking base case: is current node null? ${
        nodeId ? "No, continue with traversal." : "Yes, return immediately."
      }`,
      variables: {
        isBaseCase: !nodeId,
        currentNode: nodeId,
        recursionDepth: depth,
      },
      timing: { duration: 800 },
    });

    // base case: null node
    if (!nodeId) {
      // step: base case reached
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
          callStack: {
            type: "call_stack",
            data: createStepData(state).callStack,
            metadata: {
              label: "Call Stack",
              position: { x: 1, y: 0 },
            },
          },
          result: {
            type: "array",
            data: createStepData(state).traversalResult,
            metadata: {
              label: "Traversal Result",
              position: { x: 0, y: 1 },
            },
          },
        },
        highlights: {
          callStack: [
            { type: "call_frames", values: [callId], style: "base_case" },
          ],
        },
        stepType: "base_case_reached",
        stepContext: {
          operation: "return_value",
          dataStructure: "call_stack",
          recursionLevel: depth,
          callId: callId,
        },
        explanation:
          "Base case reached: null node, nothing to process. Returning to caller.",
        variables: {
          returnValue: null,
          recursionDepth: depth,
        },
        timing: { duration: 1000 },
      });

      // pop call from stack
      state.callStack.pop();

      // step: recursive return
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
          callStack: {
            type: "call_stack",
            data: createStepData(state).callStack,
            metadata: {
              label: "Call Stack",
              position: { x: 1, y: 0 },
            },
          },
          result: {
            type: "array",
            data: createStepData(state).traversalResult,
            metadata: {
              label: "Traversal Result",
              position: { x: 0, y: 1 },
            },
          },
        },
        highlights: {
          callStack:
            state.callStack.length > 0
              ? [
                  {
                    type: "call_frames",
                    values: [state.callStack[state.callStack.length - 1].id],
                    style: "returning",
                  },
                ]
              : [],
        },
        stepType: "call_stack_pop",
        stepContext: {
          operation: "return_value",
          dataStructure: "call_stack",
          recursionLevel: depth - 1,
          callId: parentCallId || "",
        },
        explanation: "Returned from null node call, resuming parent call.",
        variables: {
          callStackSize: state.callStack.length,
          returnedFrom: callId,
        },
        timing: { duration: 800 },
      });

      return;
    }

    // get current node
    const currentNode = nodes.find((n) => n.id === nodeId);
    if (!currentNode) return;

    // traverse left subtree
    if (currentNode.left) {
      // update phase
      callFrame.phase = "entering";

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
          callStack: {
            type: "call_stack",
            data: createStepData(state).callStack,
            metadata: {
              label: "Call Stack",
              position: { x: 1, y: 0 },
            },
          },
          result: {
            type: "array",
            data: createStepData(state).traversalResult,
            metadata: {
              label: "Traversal Result",
              position: { x: 0, y: 1 },
            },
          },
        },
        highlights: {
          tree: [
            { type: "nodes", values: [nodeId], style: "current" },
            { type: "nodes", values: [currentNode.left], style: "highlight" },
          ],
          callStack: [
            { type: "call_frames", values: [callId], style: "active" },
          ],
        },
        stepType: "tree_traversal",
        stepContext: {
          operation: "access",
          dataStructure: "tree",
          recursionLevel: depth,
          callId: callId,
          nodeId: nodeId,
        },
        explanation: `Processing node ${nodeId} (value: ${currentNode.value}). First, traverse left subtree (node ${currentNode.left}).`,
        variables: {
          currentNode: nodeId,
          leftChild: currentNode.left,
          phase: "traversing_left",
        },
        timing: { duration: 1000 },
      });

      traverse(currentNode.left, callId, depth + 1);
    }

    // update phase to visiting
    const currentCallFrame = state.callStack.find(
      (frame) => frame.id === callId
    );
    if (currentCallFrame) {
      currentCallFrame.phase = "visiting";
    }

    // visit current node
    state.visitedNodes.push(nodeId);
    state.traversalResult.push(currentNode.value);

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
        callStack: {
          type: "call_stack",
          data: createStepData(state).callStack,
          metadata: {
            label: "Call Stack",
            position: { x: 1, y: 0 },
          },
        },
        result: {
          type: "array",
          data: createStepData(state).traversalResult,
          metadata: {
            label: "Traversal Result",
            position: { x: 0, y: 1 },
          },
        },
      },
      highlights: {
        tree: [{ type: "nodes", values: [nodeId], style: "visited" }],
        callStack: [{ type: "call_frames", values: [callId], style: "active" }],
        result: [
          {
            type: "indices",
            values: [state.traversalResult.length - 1],
            style: "highlight",
          },
        ],
      },
      stepType: "tree_traversal",
      stepContext: {
        operation: "write",
        dataStructure: "tree",
        recursionLevel: depth,
        callId: callId,
        nodeId: nodeId,
      },
      explanation: `Visiting node ${nodeId}: adding value ${currentNode.value} to result. Left subtree done, now processing current node.`,
      variables: {
        visitedValue: currentNode.value,
        resultLength: state.traversalResult.length,
        currentPhase: "visiting_node",
        traversalProgress: `${state.visitedNodes.length}/${nodes.length}`,
      },
      timing: { duration: 1200 },
    });

    // traverse right subtree
    if (currentNode.right) {
      // update phase
      if (currentCallFrame) {
        currentCallFrame.phase = "right_done";
      }

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
          callStack: {
            type: "call_stack",
            data: createStepData(state).callStack,
            metadata: {
              label: "Call Stack",
              position: { x: 1, y: 0 },
            },
          },
          result: {
            type: "array",
            data: createStepData(state).traversalResult,
            metadata: {
              label: "Traversal Result",
              position: { x: 0, y: 1 },
            },
          },
        },
        highlights: {
          tree: [
            { type: "nodes", values: [nodeId], style: "visited" },
            { type: "nodes", values: [currentNode.right], style: "highlight" },
          ],
          callStack: [
            { type: "call_frames", values: [callId], style: "active" },
          ],
        },
        stepType: "tree_traversal",
        stepContext: {
          operation: "access",
          dataStructure: "tree",
          recursionLevel: depth,
          callId: callId,
          nodeId: nodeId,
        },
        explanation: `Current node ${nodeId} processed. Now traverse right subtree (node ${currentNode.right}).`,
        variables: {
          currentNode: nodeId,
          rightChild: currentNode.right,
          phase: "traversing_right",
        },
        timing: { duration: 1000 },
      });

      traverse(currentNode.right, callId, depth + 1);
    }

    // function complete, pop from stack
    state.callStack.pop();

    // step: recursive return (only if not root call)
    if (parentCallId) {
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
          callStack: {
            type: "call_stack",
            data: createStepData(state).callStack,
            metadata: {
              label: "Call Stack",
              position: { x: 1, y: 0 },
            },
          },
          result: {
            type: "array",
            data: createStepData(state).traversalResult,
            metadata: {
              label: "Traversal Result",
              position: { x: 0, y: 1 },
            },
          },
        },
        highlights: {
          tree: [{ type: "nodes", values: [nodeId], style: "match" }],
          callStack:
            state.callStack.length > 0
              ? [
                  {
                    type: "call_frames",
                    values: [state.callStack[state.callStack.length - 1].id],
                    style: "returning",
                  },
                ]
              : [],
        },
        stepType: "recursive_return",
        stepContext: {
          operation: "return_value",
          dataStructure: "call_stack",
          recursionLevel: depth - 1,
          callId: parentCallId,
        },
        explanation: `Completed processing node ${nodeId} and its subtrees. Returning to parent call.`,
        variables: {
          completedNode: nodeId,
          callStackSize: state.callStack.length,
          returnedFrom: callId,
        },
        timing: { duration: 800 },
      });
    }
  };

  // start traversal if tree is not empty
  if (rootId && nodes.length > 0) {
    traverse(rootId);
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
      callStack: {
        type: "call_stack",
        data: createStepData(state).callStack,
        metadata: {
          label: "Call Stack",
          position: { x: 1, y: 0 },
        },
      },
      result: {
        type: "array",
        data: createStepData(state).traversalResult,
        metadata: {
          label: "Traversal Result",
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
    explanation: `In-order traversal complete! Result: [${state.traversalResult.join(
      ", "
    )}]. All nodes visited in sorted order (for BST).`,
    variables: {
      finalResult: state.traversalResult,
      totalNodes: state.visitedNodes.length,
      traversalOrder: "left → root → right",
      isComplete: true,
    },
    timing: { duration: 2000 },
  });

  return steps;
};

// helper function to get expected traversal result (for preview)
const getExpectedTraversal = (
  nodes: TreeNode[],
  rootId: string | null
): number[] => {
  if (!rootId || nodes.length === 0) return [];

  const result: number[] = [];

  const traverse = (nodeId: string | null) => {
    if (!nodeId) return;

    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    // in-order: left → root → right
    traverse(node.left);
    result.push(node.value);
    traverse(node.right);
  };

  traverse(rootId);
  return result;
};

export default generateInOrderTraversalSteps;
