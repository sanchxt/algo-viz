import type { EnhancedAlgorithmStep } from "@/types/algorithm";

export function generateBubbleSortSteps(
  initialArray: number[]
): EnhancedAlgorithmStep[] {
  const steps: EnhancedAlgorithmStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let stepId = 0;

  // initialization step
  steps.push({
    id: stepId++,
    dataStructures: {
      sortArray: {
        type: "array",
        data: [...arr],
        metadata: { label: "Sort Array" },
      },
    },
    highlights: {
      sortArray: [],
    },
    stepType: "initialization",
    stepContext: {
      loopType: "outer",
      operation: "read",
      dataStructure: "array",
    },
    explanation: "Starting Bubble Sort - initializing array length",
    variables: { n, outerLoop: 0, innerLoop: 0, swaps: 0 },
    timing: {
      duration: 800,
      delay: 0,
    },
  });

  for (let i = 0; i < n - 1; i++) {
    // outer loop start
    steps.push({
      id: stepId++,
      dataStructures: {
        sortArray: {
          type: "array",
          data: [...arr],
          metadata: { label: "Sort Array" },
        },
      },
      highlights: {
        sortArray: [],
      },
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
      timing: {
        duration: 600,
        delay: 100,
      },
    });

    let swapsInThisPass = 0;

    for (let j = 0; j < n - i - 1; j++) {
      // inner loop start
      steps.push({
        id: stepId++,
        dataStructures: {
          sortArray: {
            type: "array",
            data: [...arr],
            metadata: { label: "Sort Array" },
          },
        },
        highlights: {
          sortArray: [
            {
              type: "indices",
              values: [j, j + 1],
              style: "highlight",
              color: "#3b82f6",
              intensity: "medium",
            },
          ],
        },
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
        timing: {
          duration: 800,
          delay: 150,
        },
      });

      // comparison step
      steps.push({
        id: stepId++,
        dataStructures: {
          sortArray: {
            type: "array",
            data: [...arr],
            metadata: { label: "Sort Array" },
          },
        },
        highlights: {
          sortArray: [
            {
              type: "indices",
              values: [j, j + 1],
              style: "compare",
              color: "#f59e0b",
              intensity: "high",
            },
          ],
        },
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
          comparing: [arr[j], arr[j + 1]],
        },
        timing: {
          duration: 1000,
          delay: 200,
        },
      });

      if (arr[j] > arr[j + 1]) {
        // swap operation
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapsInThisPass++;

        steps.push({
          id: stepId++,
          dataStructures: {
            sortArray: {
              type: "array",
              data: [...arr],
              metadata: { label: "Sort Array" },
            },
          },
          highlights: {
            sortArray: [
              {
                type: "indices",
                values: [j, j + 1],
                style: "swap",
                color: "#ef4444",
                intensity: "high",
              },
            ],
          },
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
            swapped: [arr[j], arr[j + 1]],
          },
          timing: {
            duration: 1200,
            delay: 300,
          },
        });
      } else {
        // no swap needed
        steps.push({
          id: stepId++,
          dataStructures: {
            sortArray: {
              type: "array",
              data: [...arr],
              metadata: { label: "Sort Array" },
            },
          },
          highlights: {
            sortArray: [
              {
                type: "indices",
                values: [j, j + 1],
                style: "compare",
                color: "#f59e0b",
                intensity: "medium",
              },
            ],
          },
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
            comparing: [arr[j], arr[j + 1]],
          },
          timing: {
            duration: 800,
            delay: 100,
          },
        });
      }
    }

    // pass complete - highlight the sorted element
    steps.push({
      id: stepId++,
      dataStructures: {
        sortArray: {
          type: "array",
          data: [...arr],
          metadata: { label: "Sort Array" },
        },
      },
      highlights: {
        sortArray: [
          {
            type: "indices",
            values: [n - i - 1],
            style: "match",
            color: "#10b981",
            intensity: "high",
          },
        ],
      },
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
        sortedPosition: n - i - 1,
      },
      timing: {
        duration: 1000,
        delay: 200,
      },
    });
  }

  // algorithm completion - highlight all sorted elements
  steps.push({
    id: stepId++,
    dataStructures: {
      sortArray: {
        type: "array",
        data: [...arr],
        metadata: { label: "Sort Array" },
      },
    },
    highlights: {
      sortArray: [
        {
          type: "indices",
          values: Array.from({ length: n }, (_, i) => i),
          style: "match",
          color: "#10b981",
          intensity: "high",
        },
      ],
    },
    stepType: "return",
    stepContext: {
      dataStructure: "array",
    },
    explanation: "Bubble Sort completed! Array is now fully sorted.",
    variables: {
      n,
      outerLoop: n - 1,
      innerLoop: 0,
      swaps: steps[steps.length - 1].variables?.swaps || 0,
      swapsInPass: 0,
      status: "completed",
    },
    timing: {
      duration: 1500,
      delay: 500,
    },
  });

  return steps;
}
