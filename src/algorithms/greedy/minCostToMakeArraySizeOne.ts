import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface GreedyState {
  array: number[];
  minElement: number;
  minIndex: number;
  totalCost: number;
  currentDecision?: {
    availableElements: number[];
    selectedPair: [number, number];
    pairCost: number;
    elementToRemove: number;
  };
  operationCount: number;
  formulaComponents?: {
    arrayLength: number;
    minElement: number;
    operationsNeeded: number;
    predictedCost: number;
  };
}

/**
 * generates enhanced steps for minimum cost greedy algorithm with better visualization
 * focuses on decision-making process and why greedy choice is optimal
 */
export const generateMinCostSteps = (
  inputArray: number[]
): EnhancedAlgorithmStep[] => {
  const steps: EnhancedAlgorithmStep[] = [];
  let stepId = 0;

  // validate input
  if (inputArray.length <= 1) {
    steps.push({
      id: stepId++,
      dataStructures: {
        array: {
          type: "array",
          data: [...inputArray],
          metadata: { label: "Input Array", position: { x: 0, y: 0 } },
        },
      },
      highlights: {},
      stepType: "initialization",
      explanation:
        inputArray.length === 0
          ? "Empty array - no operations needed."
          : "Array has only one element - already at target size.",
      variables: {
        arraySize: inputArray.length,
        totalCost: 0,
        operationsNeeded: 0,
      },
      timing: { duration: 1500 },
    });
    return steps;
  }

  // create working copy and initialize state
  const state: GreedyState = {
    array: [...inputArray],
    minElement: Math.min(...inputArray),
    minIndex: inputArray.indexOf(Math.min(...inputArray)),
    totalCost: 0,
    operationCount: 0,
  };

  // step 1: problem introduction
  steps.push({
    id: stepId++,
    dataStructures: {
      array: {
        type: "array",
        data: [...state.array],
        metadata: { label: "Problem Setup", position: { x: 0, y: 0 } },
      },
    },
    highlights: {},
    stepType: "initialization",
    explanation: `Problem: Reduce array to size 1 using minimum total cost. Rules: Pick any two elements, remove the larger one, pay cost equal to the smaller element.`,
    variables: {
      problemType: "Cost Minimization",
      rules: "Remove larger, pay smaller",
      goal: "Minimize total cost",
      initialSize: state.array.length,
      targetSize: 1,
    },
    timing: { duration: 2000 },
  });

  // step 2: key insight discovery
  steps.push({
    id: stepId++,
    dataStructures: {
      array: {
        type: "array",
        data: [...state.array],
        metadata: { label: "Key Insight Discovery", position: { x: 0, y: 0 } },
      },
    },
    highlights: {
      array: [
        {
          type: "indices",
          values: [state.minIndex],
          style: "highlight",
          color: "green",
        },
      ],
    },
    stepType: "greedy_insight",
    stepContext: {
      operation: "read",
      dataStructure: "array",
    },
    explanation: `🔑 KEY INSIGHT: We can always choose which elements to pair! Since we want to minimize cost, we should always use the smallest element (${state.minElement}) as our "cost anchor" - pair it with every other element.`,
    variables: {
      keyInsight: "Always use minimum element",
      minElement: state.minElement,
      minIndex: state.minIndex,
      strategy: "Greedy Choice: Use min element for all operations",
      whyOptimal: "Any other choice would cost more",
    },
    timing: { duration: 3000 },
  });

  // step 3: formula derivation
  state.formulaComponents = {
    arrayLength: state.array.length,
    minElement: state.minElement,
    operationsNeeded: state.array.length - 1,
    predictedCost: (state.array.length - 1) * state.minElement,
  };

  steps.push({
    id: stepId++,
    dataStructures: {
      array: {
        type: "array",
        data: [...state.array],
        metadata: { label: "Formula Derivation", position: { x: 0, y: 0 } },
      },
    },
    highlights: {
      array: [
        {
          type: "indices",
          values: [state.minIndex],
          style: "highlight",
          color: "green",
        },
      ],
    },
    stepType: "formula_derivation",
    stepContext: {
      operation: "calculate",
      dataStructure: "array",
    },
    explanation: `📐 FORMULA DERIVATION: We need ${state.formulaComponents.operationsNeeded} operations to go from ${state.formulaComponents.arrayLength} elements to 1. Each operation costs ${state.minElement}. Total = ${state.formulaComponents.operationsNeeded} × ${state.minElement} = ${state.formulaComponents.predictedCost}`,
    variables: {
      ...state.formulaComponents,
      formula: `(n-1) × min_element`,
      calculation: `${state.formulaComponents.operationsNeeded} × ${state.minElement} = ${state.formulaComponents.predictedCost}`,
    },
    timing: { duration: 2500 },
  });

  // now demonstrate the strategy with actual operations
  while (state.array.length > 1) {
    // find elements available for pairing
    const availableElements = state.array.filter(
      (_, i) => i !== state.minIndex
    );
    const targetElement = availableElements[0];
    const targetIndex = state.array.findIndex(
      (val, i) => val === targetElement && i !== state.minIndex
    );

    // show decision tree
    state.currentDecision = {
      availableElements: [...availableElements],
      selectedPair: [state.minElement, targetElement],
      pairCost: state.minElement, // always the minimum
      elementToRemove: Math.max(state.minElement, targetElement),
    };

    steps.push({
      id: stepId++,
      dataStructures: {
        array: {
          type: "array",
          data: [...state.array],
          metadata: { label: "Decision Tree", position: { x: 0, y: 0 } },
        },
      },
      highlights: {
        array: [
          {
            type: "indices",
            values: [state.minIndex],
            style: "highlight",
            color: "green",
          },
          {
            type: "indices",
            values: [targetIndex],
            style: "compare",
            color: "blue",
          },
        ],
      },
      stepType: "decision_tree",
      stepContext: {
        operation: "compare",
        dataStructure: "array",
      },
      explanation: `🌳 DECISION: Pair min element ${state.minElement} with ${targetElement}. We could pair ${targetElement} with other elements, but that would cost more! This pairing costs ${state.currentDecision.pairCost} (the minimum possible).`,
      variables: {
        currentPair: state.currentDecision.selectedPair,
        availableChoices: state.currentDecision.availableElements.length,
        chosenCost: state.currentDecision.pairCost,
        alternativeCosts: availableElements.map((el) =>
          Math.min(el, ...availableElements.filter((x) => x !== el))
        ),
        whyThisChoice: "Minimizes operation cost",
        elementToRemove: state.currentDecision.elementToRemove,
        // persist total cost
        totalCost: state.totalCost,
        minElement: state.minElement,
        operationNumber: state.operationCount,
      },
      timing: { duration: 2000 },
    });

    // show cost calculation for this operation
    state.operationCount++;
    const operationCost = state.minElement;
    state.totalCost += operationCost;

    steps.push({
      id: stepId++,
      dataStructures: {
        array: {
          type: "array",
          data: [...state.array],
          metadata: { label: "Cost Calculation", position: { x: 0, y: 0 } },
        },
      },
      highlights: {
        array: [
          {
            type: "indices",
            values: [targetIndex],
            style: "active",
            color: "red",
          },
          {
            type: "indices",
            values: [state.minIndex],
            style: "highlight",
            color: "green",
          },
        ],
      },
      stepType: "cost_calculation",
      stepContext: {
        operation: "calculate",
        dataStructure: "array",
      },
      explanation: `💰 COST CALCULATION: Remove ${state.currentDecision.elementToRemove}, pay cost of smaller element = ${operationCost}. Running total: ${state.totalCost}. Progress: ${state.operationCount}/${state.formulaComponents?.operationsNeeded} operations.`,
      variables: {
        operationNumber: state.operationCount,
        operationCost,
        runningTotal: state.totalCost,
        elementsRemaining: state.array.length - 1,
        progressPercentage: Math.round(
          (state.operationCount /
            (state.formulaComponents?.operationsNeeded || 1)) *
            100
        ),
        remainingCost:
          (state.formulaComponents?.predictedCost || 0) - state.totalCost,
      },
      timing: { duration: 1800 },
    });

    // perform the removal
    if (targetIndex === state.minIndex) {
      // edge case: if we somehow selected the minimum for removal
      state.array.splice(targetIndex, 1);
      state.minIndex = state.array.indexOf(state.minElement);
    } else {
      // remove the target element and adjust minIndex if needed
      state.array.splice(targetIndex, 1);
      if (targetIndex < state.minIndex) {
        state.minIndex--;
      }
    }

    steps.push({
      id: stepId++,
      dataStructures: {
        array: {
          type: "array",
          data: [...state.array],
          metadata: { label: "After Operation", position: { x: 0, y: 0 } },
        },
      },
      highlights: {
        array:
          state.array.length > 1
            ? [
                {
                  type: "indices",
                  values: [state.minIndex],
                  style: "highlight",
                  color: "green",
                },
              ]
            : [
                {
                  type: "indices",
                  values: [0],
                  style: "match",
                  color: "gold",
                },
              ],
      },
      stepType: "element_removal",
      stepContext: {
        operation: "write",
        dataStructure: "array",
      },
      explanation:
        state.array.length > 1
          ? `✅ Removed ${state.currentDecision.elementToRemove}. Array size: ${state.array.length}. Our greedy anchor (${state.minElement}) remains for next operations.`
          : `🎯 COMPLETE! Final element: ${state.array[0]}. Total cost: ${state.totalCost}`,
      variables: {
        removedElement: state.currentDecision.elementToRemove,
        newArraySize: state.array.length,
        remainingElements: [...state.array],
        isComplete: state.array.length === 1,
        greedyAnchor: state.minElement,
        operationsLeft: Math.max(0, state.array.length - 1),
        // keep total cost visible throughout
        totalCost: state.totalCost,
        minElement: state.minElement,
        operationNumber: state.operationCount,
      },
      timing: { duration: 1500 },
    });
  }

  // final optimality explanation
  steps.push({
    id: stepId++,
    dataStructures: {
      array: {
        type: "array",
        data: [...state.array],
        metadata: { label: "Optimality Proof", position: { x: 0, y: 0 } },
      },
    },
    highlights: {
      array: [
        {
          type: "indices",
          values: [0],
          style: "match",
          color: "gold",
        },
      ],
    },
    stepType: "optimality_proof",
    explanation: `🏆 PROOF OF OPTIMALITY: Our greedy choice was optimal! Any other strategy would use larger elements as costs, increasing the total. Formula verified: ${
      state.operationCount
    } operations × ${
      inputArray.indexOf(Math.min(...inputArray)) !== -1
        ? Math.min(...inputArray)
        : "N/A"
    } = ${state.totalCost}`,
    variables: {
      finalElement: state.array[0],
      totalOperations: state.operationCount,
      totalCost: state.totalCost,
      originalSize: inputArray.length,
      minElementUsed: Math.min(...inputArray),
      formulaVerification: `${state.operationCount} × ${Math.min(
        ...inputArray
      )} = ${state.totalCost}`,
      optimalityReason: "Minimum possible cost achieved",
      greedyPrinciple: "Local optimal choice → Global optimal solution",
    },
    timing: { duration: 3000 },
  });

  return steps;
};
