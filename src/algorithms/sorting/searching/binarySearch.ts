import type { AlgorithmStep } from "@/types/algorithm";

/**
 * generates steps for a binary search algorithm.
 * @param {number[]} array - the array to search in.
 * @param {number} target - the value to search for.
 * @returns {AlgorithmStep[]} an array of steps representing the binary search process.
 */
export const generateBinarySearchSteps = (
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
    explanation: `Starting binary search for target value ${target} in sorted array`,
    variables: { left, right, target, found: false },
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    // highlight the current search range
    steps.push({
      id: stepId++,
      arrayState: [...sortedArray],
      highlightedIndices: [left, mid, right],
      compareIndices: [mid],
      stepType: "comparison",
      explanation: `Comparing middle element ${sortedArray[mid]} at index ${mid} with target ${target}`,
      variables: { left, right, mid, target, current: sortedArray[mid] },
    });

    if (sortedArray[mid] === target) {
      // found the target
      steps.push({
        id: stepId++,
        arrayState: [...sortedArray],
        highlightedIndices: [mid],
        stepType: "return",
        explanation: `Target ${target} found at index ${mid}!`,
        variables: { left, right, mid, target, found: true, foundIndex: mid },
      });
      return steps;
    } else if (sortedArray[mid] < target) {
      // search right half
      left = mid + 1;
      steps.push({
        id: stepId++,
        arrayState: [...sortedArray],
        highlightedIndices: [left, right],
        stepType: "assignment",
        explanation: `${sortedArray[mid]} < ${target}, searching right half. New left: ${left}`,
        variables: { left, right, target, searchDirection: "right" },
      });
    } else {
      // search left half
      right = mid - 1;
      steps.push({
        id: stepId++,
        arrayState: [...sortedArray],
        highlightedIndices: [left, right],
        stepType: "assignment",
        explanation: `${sortedArray[mid]} > ${target}, searching left half. New right: ${right}`,
        variables: { left, right, target, searchDirection: "left" },
      });
    }
  }

  // target not found
  steps.push({
    id: stepId++,
    arrayState: [...sortedArray],
    highlightedIndices: [],
    stepType: "return",
    explanation: `Target ${target} not found in the array`,
    variables: { left, right, target, found: false },
  });

  return steps;
};
