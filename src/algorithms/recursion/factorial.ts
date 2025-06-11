import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface CallFrame {
  id: string;
  n: number;
  returnValue?: number;
  isActive: boolean;
  level: number;
  parentId?: string;
}

interface RecursionTreeNode {
  id: string;
  n: number;
  returnValue?: number;
  level: number;
  parentId?: string;
  children: string[];
  position: { x: number; y: number };
  status: "pending" | "active" | "completed";
}

interface FactorialState {
  callStack: CallFrame[];
  recursionTree: { [id: string]: RecursionTreeNode };
  activeCallId?: string;
  treeRootId?: string;
}

/**
 * generates steps for factorial calculation using recursion.
 * @param {number} n - the number to calculate factorial for.
 * @returns {EnhancedAlgorithmStep[]} array of steps representing the factorial calculation process.
 */
export const generateFactorialSteps = (n: number): EnhancedAlgorithmStep[] => {
  const steps: EnhancedAlgorithmStep[] = [];
  let stepId = 0;
  let callIdCounter = 0;

  // initialize state
  const initialState: FactorialState = {
    callStack: [],
    recursionTree: {},
    activeCallId: undefined,
    treeRootId: undefined,
  };

  // helper to generate unique call IDs
  const generateCallId = () => `call_${callIdCounter++}`;

  // helper to calculate tree positions (simple horizontal layout)
  const calculateTreePosition = (
    level: number,
    index: number
  ): { x: number; y: number } => {
    return {
      x: index * 120 + 60, // horizontal spacing
      y: level * 80 + 40, // vertical spacing by level
    };
  };

  // helper to create step data
  const createStepData = (state: FactorialState): FactorialState => ({
    callStack: [...state.callStack],
    recursionTree: { ...state.recursionTree },
    activeCallId: state.activeCallId,
    treeRootId: state.treeRootId,
  });

  // step 1: initialization
  steps.push({
    id: stepId++,
    dataStructures: {
      callStack: {
        type: "call_stack",
        data: [],
        metadata: { label: "Call Stack", position: { x: 0, y: 0 } },
      },
      recursionTree: {
        type: "recursion_tree",
        data: {},
        metadata: { label: "Recursion Tree", position: { x: 1, y: 0 } },
      },
    },
    highlights: {},
    stepType: "initialization",
    explanation: `Starting factorial calculation for n = ${n}. We'll track both the call stack and recursion tree to show how recursive calls work.`,
    variables: {
      inputN: n,
      totalCalls: 0,
      maxDepth: n + 1,
    },
    timing: { duration: 1500 },
  });

  // recursive function simulation
  const simulateFactorial = (
    currentN: number,
    level: number,
    parentId?: string
  ): number => {
    const callId = generateCallId();
    const treePosition = calculateTreePosition(
      level,
      Object.keys(initialState.recursionTree).filter(
        (id) => initialState.recursionTree[id].level === level
      ).length
    );

    // create call frame
    const callFrame: CallFrame = {
      id: callId,
      n: currentN,
      isActive: true,
      level,
      parentId,
    };

    // create tree node
    const treeNode: RecursionTreeNode = {
      id: callId,
      n: currentN,
      level,
      parentId,
      children: [],
      position: treePosition,
      status: "active",
    };

    // update parent's children if exists
    if (parentId && initialState.recursionTree[parentId]) {
      initialState.recursionTree[parentId].children.push(callId);
    }

    // set root if first call
    if (level === 0) {
      initialState.treeRootId = callId;
    }

    // add to state
    initialState.callStack.push(callFrame);
    initialState.recursionTree[callId] = treeNode;
    initialState.activeCallId = callId;

    // step: function call made
    steps.push({
      id: stepId++,
      dataStructures: {
        callStack: {
          type: "call_stack",
          data: createStepData(initialState).callStack,
          metadata: { label: "Call Stack", position: { x: 0, y: 0 } },
        },
        recursionTree: {
          type: "recursion_tree",
          data: createStepData(initialState).recursionTree,
          metadata: { label: "Recursion Tree", position: { x: 1, y: 0 } },
        },
      },
      highlights: {
        callStack: [{ type: "call_frames", values: [callId], style: "active" }],
        recursionTree: [
          { type: "tree_nodes", values: [callId], style: "active" },
        ],
      },
      stepType: "recursive_call",
      stepContext: {
        operation: "call",
        dataStructure: "call_stack",
        recursionLevel: level,
        callId,
        parentCallId: parentId,
      },
      explanation: `${
        level === 0 ? "Initial call" : "Recursive call"
      }: factorial(${currentN}). Added to call stack at level ${level}.`,
      variables: {
        currentN,
        recursionLevel: level,
        callStackSize: initialState.callStack.length,
        activeCall: callId,
      },
      timing: { duration: 1200 },
    });

    // step: base case check
    steps.push({
      id: stepId++,
      dataStructures: {
        callStack: {
          type: "call_stack",
          data: createStepData(initialState).callStack,
          metadata: { label: "Call Stack", position: { x: 0, y: 0 } },
        },
        recursionTree: {
          type: "recursion_tree",
          data: createStepData(initialState).recursionTree,
          metadata: { label: "Recursion Tree", position: { x: 1, y: 0 } },
        },
      },
      highlights: {
        callStack: [
          { type: "call_frames", values: [callId], style: "highlight" },
        ],
        recursionTree: [
          { type: "tree_nodes", values: [callId], style: "highlight" },
        ],
      },
      stepType: "base_case_check",
      stepContext: {
        operation: "compare",
        dataStructure: "call_stack",
        recursionLevel: level,
        callId,
      },
      explanation: `Checking base case: Is ${currentN} <= 1? ${
        currentN <= 1 ? "Yes - base case reached!" : "No - need recursive call."
      }`,
      variables: {
        currentN,
        baseCaseReached: currentN <= 1,
        recursionLevel: level,
        condition: `${currentN} <= 1`,
      },
      timing: { duration: 1000 },
    });

    let result: number;

    if (currentN <= 1) {
      // base case reached
      result = 1;
      initialState.recursionTree[callId].returnValue = result;
      initialState.recursionTree[callId].status = "completed";

      // find call frame and update it
      const frameIndex = initialState.callStack.findIndex(
        (frame) => frame.id === callId
      );
      if (frameIndex !== -1) {
        initialState.callStack[frameIndex].returnValue = result;
        initialState.callStack[frameIndex].isActive = false;
      }

      steps.push({
        id: stepId++,
        dataStructures: {
          callStack: {
            type: "call_stack",
            data: createStepData(initialState).callStack,
            metadata: { label: "Call Stack", position: { x: 0, y: 0 } },
          },
          recursionTree: {
            type: "recursion_tree",
            data: createStepData(initialState).recursionTree,
            metadata: { label: "Recursion Tree", position: { x: 1, y: 0 } },
          },
        },
        highlights: {
          callStack: [
            { type: "call_frames", values: [callId], style: "base_case" },
          ],
          recursionTree: [
            { type: "tree_nodes", values: [callId], style: "base_case" },
          ],
        },
        stepType: "base_case_reached",
        stepContext: {
          operation: "return_value",
          dataStructure: "call_stack",
          recursionLevel: level,
          callId,
        },
        explanation: `Base case reached! factorial(${currentN}) = 1. Ready to return value and unwind the call stack.`,
        variables: {
          currentN,
          returnValue: result,
          recursionLevel: level,
          isBaseCase: true,
        },
        timing: { duration: 1500 },
      });
    } else {
      // recursive case
      const recursiveResult = simulateFactorial(
        currentN - 1,
        level + 1,
        callId
      );
      result = currentN * recursiveResult;

      // update call frame and tree node with result
      initialState.recursionTree[callId].returnValue = result;
      initialState.recursionTree[callId].status = "completed";

      const frameIndex = initialState.callStack.findIndex(
        (frame) => frame.id === callId
      );
      if (frameIndex !== -1) {
        initialState.callStack[frameIndex].returnValue = result;
        initialState.callStack[frameIndex].isActive = false;
      }

      steps.push({
        id: stepId++,
        dataStructures: {
          callStack: {
            type: "call_stack",
            data: createStepData(initialState).callStack,
            metadata: { label: "Call Stack", position: { x: 0, y: 0 } },
          },
          recursionTree: {
            type: "recursion_tree",
            data: createStepData(initialState).recursionTree,
            metadata: { label: "Recursion Tree", position: { x: 1, y: 0 } },
          },
        },
        highlights: {
          callStack: [
            { type: "call_frames", values: [callId], style: "returning" },
          ],
          recursionTree: [
            { type: "tree_nodes", values: [callId], style: "returning" },
          ],
        },
        stepType: "recursive_return",
        stepContext: {
          operation: "return_value",
          dataStructure: "call_stack",
          recursionLevel: level,
          callId,
        },
        explanation: `Returning from factorial(${currentN}): ${currentN} × factorial(${
          currentN - 1
        }) = ${currentN} × ${recursiveResult} = ${result}`,
        variables: {
          currentN,
          recursiveResult,
          returnValue: result,
          calculation: `${currentN} × ${recursiveResult} = ${result}`,
          recursionLevel: level,
        },
        timing: { duration: 1200 },
      });
    }

    // pop from call stack
    initialState.callStack.pop();

    steps.push({
      id: stepId++,
      dataStructures: {
        callStack: {
          type: "call_stack",
          data: createStepData(initialState).callStack,
          metadata: { label: "Call Stack", position: { x: 0, y: 0 } },
        },
        recursionTree: {
          type: "recursion_tree",
          data: createStepData(initialState).recursionTree,
          metadata: { label: "Recursion Tree", position: { x: 1, y: 0 } },
        },
      },
      highlights: {
        callStack: [{ type: "call_frames", values: [], style: "highlight" }],
        recursionTree: [
          { type: "tree_nodes", values: [callId], style: "returning" },
        ],
      },
      stepType: "call_stack_pop",
      stepContext: {
        operation: "return_value",
        dataStructure: "call_stack",
        recursionLevel: level,
        callId,
      },
      explanation: `Call stack unwinding: factorial(${currentN}) completed, removed from stack. ${
        initialState.callStack.length > 0
          ? "Returning to caller."
          : "All calls completed!"
      }`,
      variables: {
        currentN,
        returnValue: result,
        callStackSize: initialState.callStack.length,
        recursionLevel: level,
      },
      timing: { duration: 1000 },
    });

    return result;
  };

  // start the recursive simulation
  const finalResult = simulateFactorial(n, 0);

  // final result step
  steps.push({
    id: stepId++,
    dataStructures: {
      callStack: {
        type: "call_stack",
        data: [],
        metadata: { label: "Call Stack", position: { x: 0, y: 0 } },
      },
      recursionTree: {
        type: "recursion_tree",
        data: createStepData(initialState).recursionTree,
        metadata: { label: "Recursion Tree", position: { x: 1, y: 0 } },
      },
    },
    highlights: {
      recursionTree: [
        {
          type: "tree_nodes",
          values: Object.keys(initialState.recursionTree),
          style: "match",
        },
      ],
    },
    stepType: "return",
    explanation: `Factorial calculation complete! factorial(${n}) = ${finalResult}. All recursive calls have been resolved and the call stack is empty.`,
    variables: {
      inputN: n,
      finalResult,
      totalCalls: Object.keys(initialState.recursionTree).length,
      maxDepth:
        Math.max(
          ...Object.values(initialState.recursionTree).map((node) => node.level)
        ) + 1,
    },
    timing: { duration: 2000 },
  });

  return steps;
};

export default generateFactorialSteps;
