import type { EnhancedAlgorithmStep } from "@/types/algorithm";

/**
 * generates steps for a linear search algorithm.
 * @param {number[]} array - the array to search in
 * @param {number} target - the value to search for
 * @returns {EnhancedAlgorithmStep[]} array of steps representing the linear search process.
 */
export const generateLinearSearchSteps = (
  array: number[],
  target: number
): EnhancedAlgorithmStep[] => {
  const steps: EnhancedAlgorithmStep[] = [];
  const searchArray = [...array];
  let stepId = 0;

  // initialization step
  steps.push({
    id: stepId++,
    dataStructures: {
      searchArray: {
        type: "array",
        data: [...searchArray],
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
    explanation: `Starting linear search for target value ${target} in array`,
    variables: {
      target,
      length: searchArray.length,
      currentIndex: -1,
      found: false,
    },
    timing: {
      duration: 800,
      delay: 0,
    },
  });

  // search through each element
  for (let i = 0; i < searchArray.length; i++) {
    // highlight current element being examined
    steps.push({
      id: stepId++,
      dataStructures: {
        searchArray: {
          type: "array",
          data: [...searchArray],
          metadata: { label: "Search Array" },
        },
      },
      highlights: {
        searchArray: [
          {
            type: "indices" as const,
            values: [i],
            style: "current" as const,
            color: "#ef4444",
            intensity: "high" as const,
          },
          // visited elements highlight
          ...(i > 0
            ? [
                {
                  type: "indices" as const,
                  values: Array.from({ length: i }, (_, idx) => idx),
                  style: "visited" as const,
                  color: "#6b7280",
                  intensity: "medium" as const,
                },
              ]
            : []),
        ],
      },
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
      timing: {
        duration: 600,
        delay: 100,
      },
    });

    // comparison step
    steps.push({
      id: stepId++,
      dataStructures: {
        searchArray: {
          type: "array",
          data: [...searchArray],
          metadata: { label: "Search Array" },
        },
      },
      highlights: {
        searchArray: [
          {
            type: "indices" as const,
            values: [i],
            style: "compare" as const,
            color: "#f59e0b",
            intensity: "high" as const,
          },
          // visited elements highlight
          ...(i > 0
            ? [
                {
                  type: "indices" as const,
                  values: Array.from({ length: i }, (_, idx) => idx),
                  style: "visited" as const,
                  color: "#6b7280",
                  intensity: "medium" as const,
                },
              ]
            : []),
        ],
      },
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
      timing: {
        duration: 800,
        delay: 200,
      },
    });

    if (searchArray[i] === target) {
      // found the target
      steps.push({
        id: stepId++,
        dataStructures: {
          searchArray: {
            type: "array",
            data: [...searchArray],
            metadata: { label: "Search Array" },
          },
        },
        highlights: {
          searchArray: [
            {
              type: "indices" as const,
              values: [i],
              style: "match" as const,
              color: "#10b981",
              intensity: "high" as const,
            },
            // visited elements highlight
            ...(i > 0
              ? [
                  {
                    type: "indices" as const,
                    values: Array.from({ length: i }, (_, idx) => idx),
                    style: "visited" as const,
                    color: "#6b7280",
                    intensity: "low" as const,
                  },
                ]
              : []),
          ],
        },
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
        timing: {
          duration: 1200,
          delay: 300,
        },
      });
      return steps;
    } else {
      // continue searching
      steps.push({
        id: stepId++,
        dataStructures: {
          searchArray: {
            type: "array",
            data: [...searchArray],
            metadata: { label: "Search Array" },
          },
        },
        highlights: {
          searchArray: [
            // mark current element as visited
            {
              type: "indices" as const,
              values: Array.from({ length: i + 1 }, (_, idx) => idx),
              style: "visited" as const,
              color: "#6b7280",
              intensity: "medium" as const,
            },
          ],
        },
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
        timing: {
          duration: 500,
          delay: 100,
        },
      });
    }
  }

  // target not found
  steps.push({
    id: stepId++,
    dataStructures: {
      searchArray: {
        type: "array",
        data: [...searchArray],
        metadata: { label: "Search Array" },
      },
    },
    highlights: {
      searchArray: [
        // all elements visited
        {
          type: "indices" as const,
          values: Array.from({ length: searchArray.length }, (_, idx) => idx),
          style: "visited" as const,
          color: "#6b7280",
          intensity: "medium" as const,
        },
      ],
    },
    stepType: "return_not_found",
    explanation: `Target ${target} not found in the array`,
    variables: {
      target,
      length: searchArray.length,
      currentIndex: searchArray.length,
      found: false,
    },
    timing: {
      duration: 1000,
      delay: 200,
    },
  });

  return steps;
};
