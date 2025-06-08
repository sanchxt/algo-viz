import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface LinkedListNode {
  id: string;
  value: number;
  next: string | null;
}

interface LinkedListData {
  nodes: LinkedListNode[];
  head: string | null;
  reversedLinks: string[];
  reversingMeta?: {
    from: string;
    to: string | null;
    originalNext: string | null;
  };
}

// step generation
export const generateReverseLinkedListSteps = (
  values: number[]
): EnhancedAlgorithmStep[] => {
  const originalNodes: LinkedListNode[] = values.map((value, index) => ({
    id: `node${index}`,
    value,
    next: index < values.length - 1 ? `node${index + 1}` : null,
  }));

  const steps: EnhancedAlgorithmStep[] = [];
  const baseData: LinkedListData = {
    nodes: originalNodes, // shared reference, no copying
    head: originalNodes.length > 0 ? originalNodes[0].id : null,
    reversedLinks: [], // will be replaced with specific arrays per step
  };

  // track state without copying
  let stepId = 0;
  let reversedLinks: string[] = [];
  let prevPointer: string | null = null;
  let currentPointer: string | null = baseData.head;
  let nextPointer: string | null = null;

  // helper to create step data
  const createStepData = (
    additionalReversedLinks: string[] = [],
    reversingMeta?: LinkedListData["reversingMeta"]
  ): LinkedListData => ({
    ...baseData, // shallow copy with shared nodes reference
    reversedLinks:
      additionalReversedLinks.length > 0
        ? additionalReversedLinks
        : reversedLinks,
    ...(reversingMeta && { reversingMeta }),
  });

  // step 1: initial state
  steps.push({
    id: stepId++,
    dataStructures: {
      linkedList: {
        type: "linkedlist",
        data: createStepData([]), // empty reversed links
        metadata: { label: "Linked List", position: { x: 0, y: 0 } },
      },
    },
    highlights: {},
    stepType: "initialization",
    explanation: `Starting with linked list: ${values.join(
      " -> "
    )}. We'll reverse it using three pointers: prev, current, and next.`,
    variables: {
      originalList: values, // shared reference
      listLength: values.length,
      head: baseData.head,
    },
    timing: { duration: 1500 },
  });

  // step 2: pointer initialization
  steps.push({
    id: stepId++,
    dataStructures: {
      linkedList: {
        type: "linkedlist",
        data: createStepData([]),
        metadata: { label: "Linked List", position: { x: 0, y: 0 } },
      },
    },
    highlights: {
      linkedList: [
        { type: "nodes", values: [currentPointer], style: "current" },
      ],
    },
    stepType: "pointer_initialization",
    stepContext: {
      operation: "store",
      dataStructure: "linkedlist",
      pointerType: "prev",
    },
    explanation: `Initialize three pointers: prev = null, current = ${currentPointer} (head), next = null. These will help us safely reverse the links.`,
    variables: {
      prev: prevPointer,
      current: currentPointer,
      next: nextPointer,
      iteration: 0,
    },
    timing: { duration: 1200 },
  });

  let iteration = 1;

  // main reversal loop
  while (currentPointer !== null) {
    const currentNode = originalNodes.find(
      (node) => node.id === currentPointer
    );
    if (!currentNode) break;

    nextPointer = currentNode.next;

    // step: store next pointer
    steps.push({
      id: stepId++,
      dataStructures: {
        linkedList: {
          type: "linkedlist",
          data: createStepData(),
          metadata: { label: "Linked List", position: { x: 0, y: 0 } },
        },
      },
      highlights: {
        linkedList: [
          { type: "nodes", values: [currentPointer], style: "current" },
          {
            type: "nodes",
            values: nextPointer ? [nextPointer] : [],
            style: "highlight",
          },
        ],
      },
      stepType: "pointer_update",
      stepContext: {
        operation: "store",
        dataStructure: "linkedlist",
        pointerType: "next",
        nodeId: currentPointer || undefined,
      },
      explanation: `Iteration ${iteration}: Current is not null, so continue. Store next = ${
        nextPointer || "null"
      } before breaking the link.`,
      variables: {
        prev: prevPointer,
        current: currentPointer,
        next: nextPointer,
        iteration,
        currentValue: currentNode.value,
      },
      timing: { duration: 1000 },
    });

    // step: link reversal with animation metadata
    const reversingMeta = {
      from: currentPointer,
      to: prevPointer,
      originalNext: nextPointer,
    };

    steps.push({
      id: stepId++,
      dataStructures: {
        linkedList: {
          type: "linkedlist",
          data: createStepData(reversedLinks, reversingMeta),
          metadata: { label: "Linked List", position: { x: 0, y: 0 } },
        },
      },
      highlights: {
        linkedList: [
          { type: "nodes", values: [currentPointer], style: "active" },
          {
            type: "nodes",
            values: prevPointer ? [prevPointer] : [],
            style: "visited",
          },
        ],
      },
      stepType: "link_reversal",
      stepContext: {
        operation: "reverse",
        dataStructure: "linkedlist",
        nodeId: currentPointer || undefined,
      },
      explanation: `Reverse the link: Make ${currentPointer} point to ${
        prevPointer || "null"
      } instead of ${nextPointer || "null"}.`,
      variables: {
        prev: prevPointer,
        current: currentPointer,
        next: nextPointer,
        iteration,
        currentValue: currentNode.value,
        linkReversed: `${currentPointer} -> ${prevPointer || "null"}`,
      },
      timing: { duration: 1500 },
    });

    // update state
    const reversalKey = prevPointer
      ? `${currentPointer}-${prevPointer}`
      : `${currentPointer}-null`;
    reversedLinks = [...reversedLinks, reversalKey];

    // move pointers
    prevPointer = currentPointer;
    currentPointer = nextPointer;

    steps.push({
      id: stepId++,
      dataStructures: {
        linkedList: {
          type: "linkedlist",
          data: createStepData(),
          metadata: { label: "Linked List", position: { x: 0, y: 0 } },
        },
      },
      highlights: {
        linkedList: [
          { type: "nodes", values: [prevPointer], style: "visited" },
          {
            type: "nodes",
            values: currentPointer ? [currentPointer] : [],
            style: "current",
          },
        ],
      },
      stepType: "node_traversal",
      stepContext: {
        operation: "access",
        dataStructure: "linkedlist",
        nodeId: currentPointer || undefined,
      },
      explanation: `Move pointers forward: prev = ${prevPointer}, current = ${
        currentPointer || "null"
      }. Ready for next iteration.`,
      variables: {
        prev: prevPointer,
        current: currentPointer,
        next: null,
        iteration,
        nodesProcessed: iteration,
        remainingNodes: values.length - iteration,
      },
      timing: { duration: 1000 },
    });

    iteration++;
  }

  // final result
  const reversedValues: number[] = [];
  let temp = prevPointer;
  while (temp && reversedValues.length < values.length) {
    // safety check
    const node = originalNodes.find((n) => n.id === temp);
    if (node) {
      reversedValues.push(node.value);
      const reversedLink = reversedLinks.find((link) =>
        link.startsWith(`${temp}-`)
      );
      if (reversedLink) {
        const targetId = reversedLink.split("-")[1];
        temp = targetId === "null" ? null : targetId;
      } else {
        temp = null;
      }
    } else {
      break;
    }
  }

  // final step
  steps.push({
    id: stepId++,
    dataStructures: {
      linkedList: {
        type: "linkedlist",
        data: {
          ...baseData,
          reversedLinks, // final state
          head: prevPointer,
        },
        metadata: { label: "Reversed Linked List", position: { x: 0, y: 0 } },
      },
    },
    highlights: {
      linkedList: [
        {
          type: "nodes",
          values: originalNodes.map((n) => n.id),
          style: "match",
        },
        {
          type: "links",
          values: reversedLinks,
          style: "reversed",
        },
      ],
    },
    stepType: "return",
    explanation: `Reversal complete! The linked list is now: ${reversedValues.join(
      " -> "
    )}. The new head is ${prevPointer}.`,
    variables: {
      prev: prevPointer,
      current: currentPointer,
      next: nextPointer,
      newHead: prevPointer,
      originalList: values,
      reversedList: reversedValues,
      totalIterations: iteration - 1,
    },
    timing: { duration: 2000 },
  });

  return steps;
};

export default generateReverseLinkedListSteps;
