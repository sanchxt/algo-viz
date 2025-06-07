import type { EnhancedAlgorithmStep } from "@/types/algorithm";

/**
 * generates steps for a binary search algorithm.
 * @param {number[]} array - the array to search in.
 * @param {number} target - the value to search for.
 * @returns {EnhancedAlgorithmStep[]} array of steps representing the binary search process.
 */
export const generateBinarySearchSteps = (
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
    explanation: `Starting binary search for target value ${target} in sorted array`,
    variables: { left, right, target, found: false },
    timing: {
      duration: 800,
      delay: 0,
    },
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    // highlight the current search range
    const searchRangeHighlights = [];
    const boundaryHighlights = [];

    // add search range highlighting
    if (left <= right) {
      const rangeIndices = [];
      for (let i = left; i <= right; i++) {
        rangeIndices.push(i);
      }
      searchRangeHighlights.push({
        type: "indices" as const,
        values: rangeIndices,
        style: "active" as const,
        color: "#fbbf24",
        intensity: "medium" as const,
      });
    }

    if (left === right) {
      // single element case
      boundaryHighlights.push({
        type: "indices" as const,
        values: [left],
        style: "highlight" as const,
        color: "#8b5cf6",
        intensity: "high" as const,
      });
    } else {
      // left boundary (blue)
      boundaryHighlights.push({
        type: "indices" as const,
        values: [left],
        style: "highlight" as const,
        color: "#3b82f6",
        intensity: "high" as const,
      });
      // right boundary (purple)
      boundaryHighlights.push({
        type: "indices" as const,
        values: [right],
        style: "visited" as const,
        color: "#8b5cf6",
        intensity: "high" as const,
      });
    }

    // add middle element highlighting
    const middleHighlight = {
      type: "indices" as const,
      values: [mid],
      style: "current" as const,
      color: "#ef4444",
      intensity: "high" as const,
    };

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
          ...searchRangeHighlights,
          ...boundaryHighlights,
          middleHighlight,
        ],
      },
      stepType: "comparison",
      stepContext: {
        loopType: "while",
        operation: "compare",
        dataStructure: "array",
      },
      explanation: `Comparing middle element ${sortedArray[mid]} at index ${mid} with target ${target}`,
      variables: { left, right, mid, target, current: sortedArray[mid] },
      timing: {
        duration: 1000,
        delay: 200,
      },
    });

    if (sortedArray[mid] === target) {
      // found the target
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
              values: [mid],
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
        explanation: `Target ${target} found at index ${mid}!`,
        variables: { left, right, mid, target, found: true, foundIndex: mid },
        timing: {
          duration: 1200,
          delay: 300,
        },
      });
      return steps;
    } else if (sortedArray[mid] < target) {
      // search right half
      left = mid + 1;

      const newRangeHighlights = [];
      const newBoundaryHighlights = [];

      if (left <= right) {
        const rangeIndices = [];
        for (let i = left; i <= right; i++) {
          rangeIndices.push(i);
        }
        newRangeHighlights.push({
          type: "indices" as const,
          values: rangeIndices,
          style: "active" as const,
          color: "#fbbf24",
          intensity: "medium" as const,
        });

        // add boundary markers for the new range
        if (left === right) {
          // single element case
          newBoundaryHighlights.push({
            type: "indices" as const,
            values: [left],
            style: "highlight" as const,
            color: "#8b5cf6",
            intensity: "high" as const,
          });
        } else {
          // left boundary (blue)
          newBoundaryHighlights.push({
            type: "indices" as const,
            values: [left],
            style: "highlight" as const,
            color: "#3b82f6",
            intensity: "high" as const,
          });
          // right boundary (purple)
          newBoundaryHighlights.push({
            type: "indices" as const,
            values: [right],
            style: "visited" as const,
            color: "#8b5cf6",
            intensity: "high" as const,
          });
        }
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
          searchArray: [...newRangeHighlights, ...newBoundaryHighlights],
        },
        stepType: "assignment",
        stepContext: {
          loopType: "while",
          operation: "write",
          dataStructure: "array",
        },
        explanation: `${sortedArray[mid]} < ${target}, searching right half. New left: ${left}`,
        variables: { left, right, target, searchDirection: "right" },
        timing: {
          duration: 800,
          delay: 100,
        },
      });
    } else {
      // search left half
      right = mid - 1;

      const newRangeHighlights = [];
      const newBoundaryHighlights = [];

      if (left <= right) {
        const rangeIndices = [];
        for (let i = left; i <= right; i++) {
          rangeIndices.push(i);
        }
        newRangeHighlights.push({
          type: "indices" as const,
          values: rangeIndices,
          style: "active" as const,
          color: "#fbbf24",
          intensity: "medium" as const,
        });

        // add boundary markers for the new range
        if (left === right) {
          // single element case
          newBoundaryHighlights.push({
            type: "indices" as const,
            values: [left],
            style: "highlight" as const,
            color: "#8b5cf6",
            intensity: "high" as const,
          });
        } else {
          // left boundary (blue)
          newBoundaryHighlights.push({
            type: "indices" as const,
            values: [left],
            style: "highlight" as const,
            color: "#3b82f6",
            intensity: "high" as const,
          });
          // right boundary (purple)
          newBoundaryHighlights.push({
            type: "indices" as const,
            values: [right],
            style: "visited" as const,
            color: "#8b5cf6",
            intensity: "high" as const,
          });
        }
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
          searchArray: [...newRangeHighlights, ...newBoundaryHighlights],
        },
        stepType: "assignment",
        stepContext: {
          loopType: "while",
          operation: "write",
          dataStructure: "array",
        },
        explanation: `${sortedArray[mid]} > ${target}, searching left half. New right: ${right}`,
        variables: { left, right, target, searchDirection: "left" },
        timing: {
          duration: 800,
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
    explanation: `Target ${target} not found in the array`,
    variables: { left, right, target, found: false },
    timing: {
      duration: 1000,
      delay: 200,
    },
  });

  return steps;
};
