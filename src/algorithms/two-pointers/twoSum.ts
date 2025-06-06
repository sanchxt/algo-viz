import type { AlgorithmStep } from "@/types/algorithm";

/**
 * generates steps for a two sum algorithm using two pointers approach.
 * @param {number[]} array - the array to search in.
 * @param {number} target - the target sum to find.
 * @returns {AlgorithmStep[]} an array of steps representing the two sum process.
 */
export const generateTwoSumSteps = (
  array: number[],
  target: number
): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const sortedArray = [...array].sort((a, b) => a - b);
  let stepId = 0;
  let left = 0;
  let right = sortedArray.length - 1;

  // initial step
  steps.push({
    id: stepId++,
    arrayState: [...sortedArray],
    highlightedIndices: [],
    stepType: "initialization",
    explanation: `Starting two sum search for target ${target} using two pointers approach`,
    variables: { left, right, target, currentSum: null },
  });

  // set initial pointers
  steps.push({
    id: stepId++,
    arrayState: [...sortedArray],
    highlightedIndices: [left, right],
    stepType: "pointer_initialization",
    explanation: `Set left pointer at index ${left} (value: ${sortedArray[left]}) and right pointer at index ${right} (value: ${sortedArray[right]})`,
    variables: {
      left,
      right,
      target,
      leftValue: sortedArray[left],
      rightValue: sortedArray[right],
    },
  });

  while (left < right) {
    const currentSum = sortedArray[left] + sortedArray[right];

    // calculate and show current sum
    steps.push({
      id: stepId++,
      arrayState: [...sortedArray],
      highlightedIndices: [left, right],
      compareIndices: [left, right],
      stepType: "comparison",
      explanation: `Current sum: ${sortedArray[left]} + ${sortedArray[right]} = ${currentSum}. Comparing with target ${target}`,
      variables: {
        left,
        right,
        target,
        currentSum,
        leftValue: sortedArray[left],
        rightValue: sortedArray[right],
      },
    });

    if (currentSum === target) {
      // found the target sum
      steps.push({
        id: stepId++,
        arrayState: [...sortedArray],
        highlightedIndices: [left, right],
        stepType: "return_found",
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
      });
      return steps;
    } else if (currentSum < target) {
      // sum too small, move left pointer right
      const oldLeft = left;
      left++;
      steps.push({
        id: stepId++,
        arrayState: [...sortedArray],
        highlightedIndices: [left, right],
        stepType: "pointer_move_left",
        explanation: `Sum ${currentSum} < target ${target}. Moving left pointer right from index ${oldLeft} to ${left}`,
        variables: {
          left,
          right,
          target,
          currentSum,
          previousLeft: oldLeft,
          reason: "sum too small",
        },
      });
    } else {
      // sum too large, move right pointer left
      const oldRight = right;
      right--;
      steps.push({
        id: stepId++,
        arrayState: [...sortedArray],
        highlightedIndices: [left, right],
        stepType: "pointer_move_right",
        explanation: `Sum ${currentSum} > target ${target}. Moving right pointer left from index ${oldRight} to ${right}`,
        variables: {
          left,
          right,
          target,
          currentSum,
          previousRight: oldRight,
          reason: "sum too large",
        },
      });
    }
  }

  // no solution found
  steps.push({
    id: stepId++,
    arrayState: [...sortedArray],
    highlightedIndices: [],
    stepType: "return_not_found",
    explanation: `Pointers have crossed (left >= right). No two numbers sum to ${target}`,
    variables: { left, right, target, found: false },
  });

  return steps;
};
