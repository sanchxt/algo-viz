import type { EnhancedAlgorithmStep } from "@/types/algorithm";

/**
 * generates steps for a two sum algorithm using two pointers approach.
 * @param {number[]} array - array to search in.
 * @param {number} target - target sum to find.
 * @returns {EnhancedAlgorithmStep[]} array of steps representing the two sum process.
 */
export const generateTwoSumSteps = (
  array: number[],
  target: number
): EnhancedAlgorithmStep[] => {
  const steps: EnhancedAlgorithmStep[] = [];
  const sortedArray = [...array].sort((a, b) => a - b);
  let stepId = 0;
  let left = 0;
  let right = sortedArray.length - 1;

  // initial step
  steps.push({
    id: stepId++,
    dataStructures: {
      searchArray: {
        type: "array",
        data: [...sortedArray],
        metadata: { label: "Search Array" },
      },
    },
    highlights: {
      searchArray: [],
    },
    stepType: "initialization",
    stepContext: {
      loopType: "while",
      operation: "read",
      dataStructure: "array",
    },
    explanation: `Starting two sum search for target ${target} using two pointers approach`,
    variables: { left, right, target, currentSum: null },
    timing: {
      duration: 800,
      delay: 0,
    },
  });

  // set initial pointers
  steps.push({
    id: stepId++,
    dataStructures: {
      searchArray: {
        type: "array",
        data: [...sortedArray],
        metadata: { label: "Search Array" },
      },
    },
    highlights: {
      searchArray: [
        {
          type: "indices" as const,
          values: [left],
          style: "highlight" as const,
          color: "#3b82f6",
          intensity: "high" as const,
        },
        {
          type: "indices" as const,
          values: [right],
          style: "visited" as const,
          color: "#8b5cf6",
          intensity: "high" as const,
        },
      ],
    },
    stepType: "pointer_initialization",
    stepContext: {
      loopType: "while",
      operation: "read",
      dataStructure: "array",
    },
    explanation: `Set left pointer at index ${left} (value: ${sortedArray[left]}) and right pointer at index ${right} (value: ${sortedArray[right]})`,
    variables: {
      left,
      right,
      target,
      leftValue: sortedArray[left],
      rightValue: sortedArray[right],
    },
    timing: {
      duration: 800,
      delay: 100,
    },
  });

  while (left < right) {
    const currentSum = sortedArray[left] + sortedArray[right];

    // calculate and show current sum
    steps.push({
      id: stepId++,
      dataStructures: {
        searchArray: {
          type: "array",
          data: [...sortedArray],
          metadata: { label: "Search Array" },
        },
      },
      highlights: {
        searchArray: [
          {
            type: "indices" as const,
            values: [left],
            style: "highlight" as const,
            color: "#3b82f6",
            intensity: "high" as const,
          },
          {
            type: "indices" as const,
            values: [right],
            style: "visited" as const,
            color: "#8b5cf6",
            intensity: "high" as const,
          },
          {
            type: "indices" as const,
            values: [left, right],
            style: "current" as const,
            color: "#ef4444",
            intensity: "high" as const,
          },
        ],
      },
      stepType: "comparison",
      stepContext: {
        loopType: "while",
        operation: "compare",
        dataStructure: "array",
      },
      explanation: `Current sum: ${sortedArray[left]} + ${sortedArray[right]} = ${currentSum}. Comparing with target ${target}`,
      variables: {
        left,
        right,
        target,
        currentSum,
        leftValue: sortedArray[left],
        rightValue: sortedArray[right],
      },
      timing: {
        duration: 1000,
        delay: 200,
      },
    });

    if (currentSum === target) {
      // found the target sum
      steps.push({
        id: stepId++,
        dataStructures: {
          searchArray: {
            type: "array",
            data: [...sortedArray],
            metadata: { label: "Search Array" },
          },
        },
        highlights: {
          searchArray: [
            {
              type: "indices" as const,
              values: [left, right],
              style: "match" as const,
              color: "#10b981",
              intensity: "high" as const,
            },
          ],
        },
        stepType: "return",
        stepContext: {
          loopType: "while",
          operation: "read",
          dataStructure: "array",
        },
        explanation: `Found target sum! Indices [${left}, ${right}] with values [${sortedArray[left]}, ${sortedArray[right]}]`,
        variables: {
          left,
          right,
          target,
          currentSum,
          found: true,
          solution: [left, right],
          solutionValues: [sortedArray[left], sortedArray[right]],
        },
        timing: {
          duration: 1200,
          delay: 300,
        },
      });
      return steps;
    } else if (currentSum < target) {
      // sum too small, move left pointer right
      const oldLeft = left;
      left++;

      const newHighlights = [];

      // new pointer positions
      if (left < right) {
        newHighlights.push(
          {
            type: "indices" as const,
            values: [left],
            style: "highlight" as const,
            color: "#3b82f6",
            intensity: "high" as const,
          },
          {
            type: "indices" as const,
            values: [right],
            style: "visited" as const,
            color: "#8b5cf6",
            intensity: "high" as const,
          }
        );
      }

      steps.push({
        id: stepId++,
        dataStructures: {
          searchArray: {
            type: "array",
            data: [...sortedArray],
            metadata: { label: "Search Array" },
          },
        },
        highlights: {
          searchArray: newHighlights,
        },
        stepType: "pointer_move_left",
        stepContext: {
          loopType: "while",
          operation: "write",
          dataStructure: "array",
        },
        explanation: `Sum ${currentSum} < target ${target}. Moving left pointer right from index ${oldLeft} to ${left}`,
        variables: {
          left,
          right,
          target,
          currentSum,
          previousLeft: oldLeft,
          reason: "sum too small",
        },
        timing: {
          duration: 800,
          delay: 100,
        },
      });
    } else {
      // sum too large, move right pointer left
      const oldRight = right;
      right--;

      const newHighlights = [];

      // new pointer positions
      if (left < right) {
        newHighlights.push(
          {
            type: "indices" as const,
            values: [left],
            style: "highlight" as const,
            color: "#3b82f6",
            intensity: "high" as const,
          },
          {
            type: "indices" as const,
            values: [right],
            style: "visited" as const,
            color: "#8b5cf6",
            intensity: "high" as const,
          }
        );
      }

      steps.push({
        id: stepId++,
        dataStructures: {
          searchArray: {
            type: "array",
            data: [...sortedArray],
            metadata: { label: "Search Array" },
          },
        },
        highlights: {
          searchArray: newHighlights,
        },
        stepType: "pointer_move_right",
        stepContext: {
          loopType: "while",
          operation: "write",
          dataStructure: "array",
        },
        explanation: `Sum ${currentSum} > target ${target}. Moving right pointer left from index ${oldRight} to ${right}`,
        variables: {
          left,
          right,
          target,
          currentSum,
          previousRight: oldRight,
          reason: "sum too large",
        },
        timing: {
          duration: 800,
          delay: 100,
        },
      });
    }
  }

  // no solution found
  steps.push({
    id: stepId++,
    dataStructures: {
      searchArray: {
        type: "array",
        data: [...sortedArray],
        metadata: { label: "Search Array" },
      },
    },
    highlights: {
      searchArray: [],
    },
    stepType: "return",
    stepContext: {
      loopType: "while",
      operation: "read",
      dataStructure: "array",
    },
    explanation: `Pointers have crossed (left >= right). No two numbers sum to ${target}`,
    variables: { left, right, target, found: false },
    timing: {
      duration: 1000,
      delay: 200,
    },
  });

  return steps;
};
