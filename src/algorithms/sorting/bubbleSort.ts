import type { AlgorithmStep } from "@/types/algorithm";

export function generateBubbleSortSteps(
  initialArray: number[]
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let stepId = 0;

  // Initialization step
  steps.push({
    id: stepId++,
    arrayState: [...arr],
    highlightedIndices: [],
    stepType: "initialization",
    explanation: "Starting Bubble Sort - initializing array length",
    variables: { n, outerLoop: 0, innerLoop: 0, swaps: 0 },
  });

  for (let i = 0; i < n - 1; i++) {
    // outer loop start
    steps.push({
      id: stepId++,
      arrayState: [...arr],
      highlightedIndices: [],
      stepType: "loop_start",
      stepContext: {
        loopType: "outer",
        passNumber: i + 1,
        dataStructure: "array",
      },
      explanation: `Pass ${i + 1}: Starting outer loop iteration (i = ${i})`,
      variables: {
        n,
        outerLoop: i,
        innerLoop: 0,
        swaps: steps[steps.length - 1].variables?.swaps || 0,
      },
    });

    let swapsInThisPass = 0;

    for (let j = 0; j < n - i - 1; j++) {
      // inner loop start
      steps.push({
        id: stepId++,
        arrayState: [...arr],
        highlightedIndices: [],
        compareIndices: [j, j + 1],
        stepType: "loop_start",
        stepContext: {
          loopType: "inner",
          iterationNumber: j,
          dataStructure: "array",
        },
        explanation: `Inner loop iteration ${
          j + 1
        }: Preparing to compare positions ${j} and ${j + 1}`,
        variables: {
          n,
          outerLoop: i,
          innerLoop: j,
          swaps: steps[steps.length - 1].variables?.swaps || 0,
          swapsInPass: swapsInThisPass,
        },
      });

      // comparison step
      steps.push({
        id: stepId++,
        arrayState: [...arr],
        highlightedIndices: [],
        compareIndices: [j, j + 1],
        stepType: "comparison",
        stepContext: {
          operation: "compare",
          dataStructure: "array",
        },
        explanation: `Comparing elements: ${arr[j]} > ${arr[j + 1]} ?`,
        variables: {
          n,
          outerLoop: i,
          innerLoop: j,
          swaps: steps[steps.length - 1].variables?.swaps || 0,
          swapsInPass: swapsInThisPass,
        },
      });

      if (arr[j] > arr[j + 1]) {
        // swap operation
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapsInThisPass++;

        steps.push({
          id: stepId++,
          arrayState: [...arr],
          highlightedIndices: [],
          swapIndices: [j, j + 1],
          stepType: "swap",
          stepContext: {
            operation: "write",
            dataStructure: "array",
          },
          explanation: `Swapping: ${arr[j + 1]} and ${arr[j]} (${
            arr[j + 1]
          } > ${arr[j]})`,
          variables: {
            n,
            outerLoop: i,
            innerLoop: j,
            swaps: (steps[steps.length - 1].variables?.swaps || 0) + 1,
            swapsInPass: swapsInThisPass,
          },
        });
      } else {
        // no swap needed
        steps.push({
          id: stepId++,
          arrayState: [...arr],
          highlightedIndices: [],
          compareIndices: [j, j + 1],
          stepType: "no_swap",
          stepContext: {
            operation: "read",
            dataStructure: "array",
          },
          explanation: `No swap needed: ${arr[j]} ≤ ${arr[j + 1]}`,
          variables: {
            n,
            outerLoop: i,
            innerLoop: j,
            swaps: steps[steps.length - 1].variables?.swaps || 0,
            swapsInPass: swapsInThisPass,
          },
        });
      }
    }

    // pass complete - highlight the sorted element
    steps.push({
      id: stepId++,
      arrayState: [...arr],
      highlightedIndices: [n - i - 1],
      stepType: "pass_complete",
      stepContext: {
        passNumber: i + 1,
        dataStructure: "array",
      },
      explanation: `Pass ${i + 1} complete! Element ${
        arr[n - i - 1]
      } is now in its correct position`,
      variables: {
        n,
        outerLoop: i,
        innerLoop: n - i - 1,
        swaps: steps[steps.length - 1].variables?.swaps || 0,
        swapsInPass: swapsInThisPass,
      },
    });
  }

  // algorithm completion
  steps.push({
    id: stepId++,
    arrayState: [...arr],
    highlightedIndices: Array.from({ length: n }, (_, i) => i),
    stepType: "return",
    explanation: "Bubble Sort completed! Array is now fully sorted.",
    variables: {
      n,
      outerLoop: n - 1,
      innerLoop: 0,
      swaps: steps[steps.length - 1].variables?.swaps || 0,
      swapsInPass: 0,
    },
  });

  return steps;
}
