import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface HeapData {
  elements: number[];
  size: number;
  capacity: number;
  inputArray: number[];
  currentInputIndex: number;
  kValue: number;
  result: number[];
}

// min-heap implementation for k largest elements
class MinHeap {
  private heap: number[] = [];
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  private getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  private heapifyUp(index: number): void {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.heap[index] >= this.heap[parentIndex]) break;
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  private heapifyDown(index: number): void {
    while (this.getLeftChildIndex(index) < this.heap.length) {
      const leftChild = this.getLeftChildIndex(index);
      const rightChild = this.getRightChildIndex(index);
      let minIndex = leftChild;

      if (
        rightChild < this.heap.length &&
        this.heap[rightChild] < this.heap[leftChild]
      ) {
        minIndex = rightChild;
      }

      if (this.heap[index] <= this.heap[minIndex]) break;
      this.swap(index, minIndex);
      index = minIndex;
    }
  }

  push(value: number): void {
    if (this.heap.length >= this.maxSize) {
      throw new Error("Heap is at max capacity");
    }
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  pop(): number | undefined {
    if (this.heap.length === 0) return undefined;

    const min = this.heap[0];
    const last = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown(0);
    }

    return min;
  }

  peek(): number | undefined {
    return this.heap.length > 0 ? this.heap[0] : undefined;
  }

  size(): number {
    return this.heap.length;
  }

  isFull(): boolean {
    return this.heap.length >= this.maxSize;
  }

  toArray(): number[] {
    return [...this.heap];
  }
}

// default input for demonstration
const DEFAULT_INPUT = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
const DEFAULT_K = 4;

// generate steps for k largest elements algorithm
export const generateKLargestElementsSteps = (
  inputArray: number[] = DEFAULT_INPUT,
  k: number = DEFAULT_K
): EnhancedAlgorithmStep[] => {
  const steps: EnhancedAlgorithmStep[] = [];
  let stepId = 0;

  // validation
  if (k <= 0 || k > inputArray.length) {
    throw new Error("Invalid k value");
  }

  const heap = new MinHeap(k);

  // create base data structure state
  const createStepData = (
    currentIndex: number = -1,
    operation?: string
  ): HeapData => ({
    elements: heap.toArray(),
    size: heap.size(),
    capacity: k,
    inputArray: [...inputArray],
    currentInputIndex: currentIndex,
    kValue: k,
    result: [],
  });

  // initial step
  steps.push({
    id: stepId++,
    dataStructures: {
      heap: {
        type: "heap",
        data: createStepData(),
        metadata: {
          label: `Min-Heap (capacity: ${k})`,
          position: { x: 0, y: 0 },
        },
      },
      inputArray: {
        type: "array",
        data: [...inputArray],
        metadata: {
          label: "Input Array",
          position: { x: 0, y: 100 },
        },
      },
    },
    highlights: {
      inputArray: [
        {
          type: "indices",
          values: Array.from({ length: inputArray.length }, (_, i) => i),
          style: "highlight",
        },
      ],
    },
    stepType: "heap_initialization",
    stepContext: {
      operation: "initialize",
      dataStructure: "min_heap",
      kValue: k,
      heapSize: 0,
      heapCapacity: k,
    },
    explanation: `Initialize a min-heap with capacity ${k} to find the ${k} largest elements. Min-heap ensures the smallest element is always at the root.`,
    variables: {
      k,
      inputLength: inputArray.length,
      heapSize: 0,
      heapCapacity: k,
    },
    timing: { duration: 1500 },
  });

  // process each element in input array
  for (let i = 0; i < inputArray.length; i++) {
    const currentElement = inputArray[i];

    // step: examine current element
    steps.push({
      id: stepId++,
      dataStructures: {
        heap: {
          type: "heap",
          data: createStepData(i),
          metadata: {
            label: `Min-Heap (size: ${heap.size()}/${k})`,
            position: { x: 0, y: 0 },
          },
        },
        inputArray: {
          type: "array",
          data: [...inputArray],
          metadata: {
            label: "Input Array",
            position: { x: 0, y: 100 },
          },
        },
      },
      highlights: {
        inputArray: [{ type: "indices", values: [i], style: "input_current" }],
        heap:
          heap.size() > 0
            ? [{ type: "heap_elements", values: [0], style: "heap_top" }]
            : [],
      },
      stepType: "comparison",
      stepContext: {
        operation: "read",
        dataStructure: "array",
        inputIndex: i,
        currentInputElement: currentElement,
        heapSize: heap.size(),
        kValue: k,
      },
      explanation: `Processing element ${currentElement} at index ${i}. Current heap size: ${heap.size()}/${k}.`,
      variables: {
        currentElement,
        currentIndex: i,
        heapSize: heap.size(),
        heapCapacity: k,
        heapIsFull: heap.isFull(),
      },
      timing: { duration: 800 },
    });

    if (!heap.isFull()) {
      // heap has space, add element
      heap.push(currentElement);

      steps.push({
        id: stepId++,
        dataStructures: {
          heap: {
            type: "heap",
            data: createStepData(i),
            metadata: {
              label: `Min-Heap (size: ${heap.size()}/${k})`,
              position: { x: 0, y: 0 },
            },
          },
          inputArray: {
            type: "array",
            data: [...inputArray],
            metadata: {
              label: "Input Array",
              position: { x: 0, y: 100 },
            },
          },
        },
        highlights: {
          inputArray: [{ type: "indices", values: [i], style: "processing" }],
          heap: [
            {
              type: "heap_elements",
              values: [heap.size() - 1],
              style: "heap_highlight",
            },
          ],
        },
        stepType: "heap_push",
        stepContext: {
          operation: "push",
          dataStructure: "min_heap",
          heapElement: currentElement,
          currentInputElement: currentElement,
          inputIndex: i,
          heapOperation: "push",
          heapSize: heap.size(),
          kValue: k,
        },
        explanation: `Heap has space (${heap.size()}/${k}). Add ${currentElement} to the min-heap and maintain heap property.`,
        variables: {
          currentElement,
          heapSize: heap.size(),
          operation: "push",
          heapElements: heap.toArray(),
        },
        timing: { duration: 1200 },
      });
    } else {
      // heap is full, compare with minimum
      const minElement = heap.peek()!;

      steps.push({
        id: stepId++,
        dataStructures: {
          heap: {
            type: "heap",
            data: createStepData(i),
            metadata: {
              label: `Min-Heap (size: ${heap.size()}/${k})`,
              position: { x: 0, y: 0 },
            },
          },
          inputArray: {
            type: "array",
            data: [...inputArray],
            metadata: {
              label: "Input Array",
              position: { x: 0, y: 100 },
            },
          },
        },
        highlights: {
          inputArray: [
            { type: "indices", values: [i], style: "input_current" },
          ],
          heap: [{ type: "heap_elements", values: [0], style: "heap_compare" }],
        },
        stepType: "heap_compare",
        stepContext: {
          operation: "compare",
          dataStructure: "min_heap",
          currentInputElement: currentElement,
          heapElement: minElement,
          inputIndex: i,
          heapOperation: "compare",
          heapSize: heap.size(),
          kValue: k,
        },
        explanation: `Heap is full (${k}/${k}). Compare current element ${currentElement} with heap minimum ${minElement}.`,
        variables: {
          currentElement,
          heapMin: minElement,
          comparison:
            currentElement > minElement ? "greater" : "smaller_or_equal",
          heapSize: heap.size(),
        },
        timing: { duration: 1000 },
      });

      if (currentElement > minElement) {
        // remove minimum and add current element
        const removedMin = heap.pop()!;
        heap.push(currentElement);

        steps.push({
          id: stepId++,
          dataStructures: {
            heap: {
              type: "heap",
              data: createStepData(i),
              metadata: {
                label: `Min-Heap (size: ${heap.size()}/${k})`,
                position: { x: 0, y: 0 },
              },
            },
            inputArray: {
              type: "array",
              data: [...inputArray],
              metadata: {
                label: "Input Array",
                position: { x: 0, y: 100 },
              },
            },
          },
          highlights: {
            inputArray: [{ type: "indices", values: [i], style: "processing" }],
            heap: [{ type: "heap_elements", values: [0], style: "heap_top" }],
          },
          stepType: "heap_maintain_size",
          stepContext: {
            operation: "optimize",
            dataStructure: "min_heap",
            currentInputElement: currentElement,
            heapElement: removedMin,
            inputIndex: i,
            heapOperation: "pop",
            heapMaintained: true,
            heapSize: heap.size(),
            kValue: k,
          },
          explanation: `${currentElement} > ${removedMin} (heap min). Remove ${removedMin} and add ${currentElement}. Heap maintains size ${k} with larger elements.`,
          variables: {
            currentElement,
            removedElement: removedMin,
            newHeapMin: heap.peek(),
            operation: "replace_min",
            heapElements: heap.toArray(),
          },
          timing: { duration: 1400 },
        });
      } else {
        // current element is not larger, skip it
        steps.push({
          id: stepId++,
          dataStructures: {
            heap: {
              type: "heap",
              data: createStepData(i),
              metadata: {
                label: `Min-Heap (size: ${heap.size()}/${k})`,
                position: { x: 0, y: 0 },
              },
            },
            inputArray: {
              type: "array",
              data: [...inputArray],
              metadata: {
                label: "Input Array",
                position: { x: 0, y: 100 },
              },
            },
          },
          highlights: {
            inputArray: [{ type: "indices", values: [i], style: "mismatch" }],
          },
          stepType: "no_swap",
          stepContext: {
            operation: "skip",
            dataStructure: "min_heap",
            currentInputElement: currentElement,
            heapElement: minElement,
            inputIndex: i,
            heapMaintained: true,
            heapSize: heap.size(),
            kValue: k,
          },
          explanation: `${currentElement} ≤ ${minElement} (heap min). Skip ${currentElement} as it's not among the ${k} largest elements.`,
          variables: {
            currentElement,
            heapMin: minElement,
            operation: "skip",
            reason: "not_larger_than_min",
          },
          timing: { duration: 800 },
        });
      }
    }
  }

  // final result
  const result = heap.toArray().sort((a, b) => b - a); // sort in descending order for display

  steps.push({
    id: stepId++,
    dataStructures: {
      heap: {
        type: "heap",
        data: { ...createStepData(-1), result },
        metadata: {
          label: `Result: ${k} Largest Elements`,
          position: { x: 0, y: 0 },
        },
      },
      inputArray: {
        type: "array",
        data: [...inputArray],
        metadata: {
          label: "Input Array",
          position: { x: 0, y: 100 },
        },
      },
    },
    highlights: {
      heap: [
        {
          type: "heap_elements",
          values: Array.from({ length: heap.size() }, (_, i) => i),
          style: "heap_result",
        },
      ],
    },
    stepType: "heap_result_found",
    stepContext: {
      operation: "return_value",
      dataStructure: "min_heap",
      heapSize: heap.size(),
      kValue: k,
    },
    explanation: `✅ Algorithm Complete! Found the ${k} largest elements: [${result.join(
      ", "
    )}]. Min-heap efficiently maintained the top ${k} elements.`,
    variables: {
      result,
      kValue: k,
      totalProcessed: inputArray.length,
      heapFinalSize: heap.size(),
      efficiency: `O(n log k)`,
    },
    timing: { duration: 2000 },
  });

  return steps;
};

export default generateKLargestElementsSteps;
