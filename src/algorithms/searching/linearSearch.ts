import type { AlgorithmStep } from "@/types/algorithm";

/**
 * generates steps for a linear search algorithm.
 * @param {number[]} array - the array to search in
 * @param {number} target - the value to search for
 * @returns {AlgorithmStep[]} array of steps representing the linear search process.
 */
export const generateLinearSearchSteps = (
  array: number[],
  target: number
): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const searchArray = [...array];
  let stepId = 0;

  // initialization step
  steps.push({
    id: stepId++,
    arrayState: [...searchArray],
    highlightedIndices: [],
    stepType: "initialization",
    explanation: `Starting linear search for target value ${target} in array`,
    variables: {
      target,
      length: searchArray.length,
      currentIndex: -1,
      found: false,
    },
  });

  // search through each element
  for (let i = 0; i < searchArray.length; i++) {
    // highlight current element being examined
    steps.push({
      id: stepId++,
      arrayState: [...searchArray],
      highlightedIndices: [i],
      stepType: "loop_start",
      stepContext: {
        loopType: "while",
        iterationNumber: i,
        dataStructure: "array",
      },
      explanation: `Examining element at index ${i}`,
      variables: {
        target,
        length: searchArray.length,
        currentIndex: i,
        currentElement: searchArray[i],
        found: false,
      },
    });

    // comparison step
    steps.push({
      id: stepId++,
      arrayState: [...searchArray],
      highlightedIndices: [i],
      compareIndices: [i],
      stepType: "comparison",
      stepContext: {
        operation: "compare",
        dataStructure: "array",
      },
      explanation: `Comparing: ${searchArray[i]} = ${target} ?`,
      variables: {
        target,
        length: searchArray.length,
        currentIndex: i,
        currentElement: searchArray[i],
        found: false,
      },
    });

    if (searchArray[i] === target) {
      // found the target
      steps.push({
        id: stepId++,
        arrayState: [...searchArray],
        highlightedIndices: [i],
        stepType: "return_found",
        stepContext: {
          operation: "read",
          dataStructure: "array",
        },
        explanation: `Target ${target} found at index ${i}!`,
        variables: {
          target,
          length: searchArray.length,
          currentIndex: i,
          currentElement: searchArray[i],
          found: true,
          foundIndex: i,
        },
      });
      return steps;
    } else {
      // continue searching
      steps.push({
        id: stepId++,
        arrayState: [...searchArray],
        highlightedIndices: [],
        stepType: "assignment",
        stepContext: {
          operation: "read",
          dataStructure: "array",
        },
        explanation: `${searchArray[i]} ≠ ${target}, continue searching...`,
        variables: {
          target,
          length: searchArray.length,
          currentIndex: i,
          currentElement: searchArray[i],
          found: false,
        },
      });
    }
  }

  // target not found
  steps.push({
    id: stepId++,
    arrayState: [...searchArray],
    highlightedIndices: [],
    stepType: "return_not_found",
    explanation: `Target ${target} not found in the array`,
    variables: {
      target,
      length: searchArray.length,
      currentIndex: searchArray.length,
      found: false,
    },
  });

  return steps;
};
