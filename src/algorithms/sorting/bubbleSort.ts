import type { AlgorithmStep } from "../../types/algorithm";

export function generateBubbleSortSteps(
  initialArray: number[]
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let stepId = 0;

  // initial state
  steps.push({
    id: stepId++,
    arrayState: [...arr],
    highlightedIndices: [],
    currentLine: 1,
    explanation: "Starting Bubble Sort with the given array",
    variables: { outerLoop: 0, innerLoop: 0, swaps: 0 },
  });

  for (let i = 0; i < n - 1; i++) {
    steps.push({
      id: stepId++,
      arrayState: [...arr],
      highlightedIndices: [],
      currentLine: 2,
      explanation: `Pass ${i + 1}: Looking for the largest unsorted element`,
      variables: {
        outerLoop: i,
        innerLoop: 0,
        swaps: steps[steps.length - 1].variables?.swaps || 0,
      },
    });

    for (let j = 0; j < n - i - 1; j++) {
      // compare adjacent elements
      steps.push({
        id: stepId++,
        arrayState: [...arr],
        highlightedIndices: [],
        compareIndices: [j, j + 1],
        currentLine: 3,
        explanation: `Comparing ${arr[j]} and ${arr[j + 1]}`,
        variables: {
          outerLoop: i,
          innerLoop: j,
          swaps: steps[steps.length - 1].variables?.swaps || 0,
        },
      });

      if (arr[j] > arr[j + 1]) {
        // swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

        steps.push({
          id: stepId++,
          arrayState: [...arr],
          highlightedIndices: [],
          swapIndices: [j, j + 1],
          currentLine: 4,
          explanation: `Swapping ${arr[j + 1]} and ${arr[j]} because ${
            arr[j + 1]
          } > ${arr[j]}`,
          variables: {
            outerLoop: i,
            innerLoop: j,
            swaps: (steps[steps.length - 1].variables?.swaps || 0) + 1,
          },
        });
      } else {
        // no swap needed
        steps.push({
          id: stepId++,
          arrayState: [...arr],
          highlightedIndices: [],
          compareIndices: [j, j + 1],
          currentLine: 3,
          explanation: `No swap needed: ${arr[j]} ≤ ${arr[j + 1]}`,
          variables: {
            outerLoop: i,
            innerLoop: j,
            swaps: steps[steps.length - 1].variables?.swaps || 0,
          },
        });
      }
    }

    // end of pass - highlight the sorted element
    steps.push({
      id: stepId++,
      arrayState: [...arr],
      highlightedIndices: [n - i - 1],
      currentLine: 5,
      explanation: `Pass ${i + 1} complete. Element ${
        arr[n - i - 1]
      } is now in its correct position`,
      variables: {
        outerLoop: i,
        innerLoop: n - i - 1,
        swaps: steps[steps.length - 1].variables?.swaps || 0,
      },
    });
  }

  // final state
  steps.push({
    id: stepId++,
    arrayState: [...arr],
    highlightedIndices: Array.from({ length: n }, (_, i) => i),
    currentLine: 6,
    explanation: "Bubble Sort completed! Array is now sorted.",
    variables: {
      outerLoop: n - 1,
      innerLoop: 0,
      swaps: steps[steps.length - 1].variables?.swaps || 0,
    },
  });

  return steps;
}
