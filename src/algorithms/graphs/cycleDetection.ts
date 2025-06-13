import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface GraphNode {
  id: string;
  label: string;
  position: { x: number; y: number };
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  visited: string[];
  currentPath: string[];
  cycleEdges: string[];
  currentNode: string | null;
  parentMap: { [nodeId: string]: string | null };
  currentComponent: number;
  adjacencyList: { [nodeId: string]: string[] };
}

// default graph structure for visualization
const DEFAULT_GRAPH = {
  nodes: [
    { id: "A", label: "A", position: { x: 100, y: 100 } },
    { id: "B", label: "B", position: { x: 300, y: 100 } },
    { id: "C", label: "C", position: { x: 500, y: 100 } },
    { id: "D", label: "D", position: { x: 200, y: 250 } },
    { id: "E", label: "E", position: { x: 400, y: 250 } },
  ],
  edges: [
    { id: "AB", from: "A", to: "B" },
    { id: "BC", from: "B", to: "C" },
    { id: "BD", from: "B", to: "D" },
    { id: "DE", from: "D", to: "E" },
    { id: "CE", from: "C", to: "E" }, // this creates a cycle: B-C-E-D-B
  ],
};

// build adjacency list from edges
const buildAdjacencyList = (
  nodes: GraphNode[],
  edges: GraphEdge[]
): { [nodeId: string]: string[] } => {
  const adjacencyList: { [nodeId: string]: string[] } = {};

  // initialize empty adjacency lists
  nodes.forEach((node) => {
    adjacencyList[node.id] = [];
  });

  // add edges (undirected graph - add both directions)
  edges.forEach((edge) => {
    adjacencyList[edge.from].push(edge.to);
    adjacencyList[edge.to].push(edge.from);
  });

  return adjacencyList;
};

// step generation for cycle detection using DFS
export const generateCycleDetectionSteps = (
  customNodes?: GraphNode[],
  customEdges?: GraphEdge[]
): EnhancedAlgorithmStep[] => {
  const nodes = customNodes || DEFAULT_GRAPH.nodes;
  const edges = customEdges || DEFAULT_GRAPH.edges;
  const adjacencyList = buildAdjacencyList(nodes, edges);

  const steps: EnhancedAlgorithmStep[] = [];
  let stepId = 0;

  // initialize tracking state
  const visited = new Set<string>();
  const currentPath: string[] = [];
  let cycleEdges: string[] = [];
  let currentComponent = 0;
  let hasCycle = false;
  let cycleNodes: string[] = [];

  // create base graph data
  const createStepData = (
    currentNode: string | null = null,
    parentMap: { [nodeId: string]: string | null } = {},
    additionalCycleEdges: string[] = []
  ): GraphData => ({
    nodes,
    edges,
    visited: Array.from(visited),
    currentPath: [...currentPath],
    cycleEdges:
      additionalCycleEdges.length > 0 ? additionalCycleEdges : cycleEdges,
    currentNode,
    parentMap: { ...parentMap },
    currentComponent,
    adjacencyList,
  });

  // helper function for DFS
  const dfs = (
    nodeId: string,
    parentId: string | null,
    parentMap: { [nodeId: string]: string | null }
  ): boolean => {
    // mark current node as visited
    visited.add(nodeId);
    currentPath.push(nodeId);
    parentMap[nodeId] = parentId;

    // step: visit current node
    steps.push({
      id: stepId++,
      dataStructures: {
        graph: {
          type: "graph",
          data: createStepData(nodeId, parentMap),
          metadata: { label: "Graph", position: { x: 0, y: 0 } },
        },
      },
      highlights: {
        graph: [
          { type: "graph_nodes", values: [nodeId], style: "current" },
          {
            type: "graph_nodes",
            values: Array.from(visited),
            style: "visited",
          },
          { type: "graph_nodes", values: currentPath, style: "path" },
        ],
      },
      stepType: "graph_node_visit",
      stepContext: {
        operation: "visit",
        dataStructure: "graph",
        nodeId,
        parentNodeId: parentId || undefined,
        componentNumber: currentComponent,
      },
      explanation: `Visiting node ${nodeId}${
        parentId ? ` (parent: ${parentId})` : ""
      } in component ${
        currentComponent + 1
      }. Mark as visited and add to current path.`,
      variables: {
        currentNode: nodeId,
        parent: parentId,
        visited: Array.from(visited),
        pathLength: currentPath.length,
        component: currentComponent + 1,
      },
      timing: { duration: 1200 },
    });

    // explore all neighbors
    const neighbors = adjacencyList[nodeId] || [];
    for (const neighborId of neighbors) {
      const edgeId = edges.find(
        (e) =>
          (e.from === nodeId && e.to === neighborId) ||
          (e.from === neighborId && e.to === nodeId)
      )?.id;

      // step: explore edge
      steps.push({
        id: stepId++,
        dataStructures: {
          graph: {
            type: "graph",
            data: createStepData(nodeId, parentMap),
            metadata: { label: "Graph", position: { x: 0, y: 0 } },
          },
        },
        highlights: {
          graph: [
            { type: "graph_nodes", values: [nodeId], style: "current" },
            { type: "graph_nodes", values: [neighborId], style: "exploring" },
            {
              type: "graph_edges",
              values: edgeId ? [edgeId] : [],
              style: "exploring",
            },
            {
              type: "graph_nodes",
              values: Array.from(visited),
              style: "visited",
            },
          ],
        },
        stepType: "graph_edge_explore",
        stepContext: {
          operation: "explore",
          dataStructure: "graph",
          fromNodeId: nodeId,
          toNodeId: neighborId,
          edgeId,
        },
        explanation: `Exploring edge from ${nodeId} to ${neighborId}. Checking if ${neighborId} is already visited.`,
        variables: {
          currentNode: nodeId,
          neighbor: neighborId,
          visited: Array.from(visited),
          isNeighborVisited: visited.has(neighborId),
          isParent: neighborId === parentId,
        },
        timing: { duration: 1000 },
      });

      if (!visited.has(neighborId)) {
        // recurse to unvisited neighbor
        const foundCycle = dfs(neighborId, nodeId, parentMap);
        if (foundCycle) {
          return true;
        }
      } else if (neighborId !== parentId) {
        // found a cycle!
        hasCycle = true;
        cycleNodes = [...currentPath];

        // find cycle edges
        const cycleStartIndex = currentPath.indexOf(neighborId);
        const cycleNodesList = currentPath.slice(cycleStartIndex);
        cycleNodesList.push(neighborId); // close the cycle

        cycleEdges = [];
        for (let i = 0; i < cycleNodesList.length - 1; i++) {
          const from = cycleNodesList[i];
          const to = cycleNodesList[i + 1];
          const edge = edges.find(
            (e) =>
              (e.from === from && e.to === to) ||
              (e.from === to && e.to === from)
          );
          if (edge) {
            cycleEdges.push(edge.id);
          }
        }

        // step: cycle detected
        steps.push({
          id: stepId++,
          dataStructures: {
            graph: {
              type: "graph",
              data: createStepData(nodeId, parentMap, cycleEdges),
              metadata: { label: "Graph", position: { x: 0, y: 0 } },
            },
          },
          highlights: {
            graph: [
              { type: "graph_nodes", values: cycleNodesList, style: "cycle" },
              { type: "graph_edges", values: cycleEdges, style: "cycle" },
              { type: "graph_nodes", values: [nodeId], style: "current" },
              { type: "graph_nodes", values: [neighborId], style: "cycle" },
            ],
          },
          stepType: "graph_cycle_detected",
          stepContext: {
            operation: "detect_cycle",
            dataStructure: "graph",
            fromNodeId: nodeId,
            toNodeId: neighborId,
            cycleDetected: true,
          },
          explanation: `🎯 Cycle detected! Found back edge from ${nodeId} to ${neighborId}. The cycle involves nodes: ${cycleNodesList
            .slice(0, -1)
            .join(" → ")} → ${neighborId}.`,
          variables: {
            cycleDetected: true,
            cycleNodes: cycleNodesList.slice(0, -1),
            cycleLength: cycleNodesList.length - 1,
            backEdge: `${nodeId} → ${neighborId}`,
          },
          timing: { duration: 2000 },
        });

        return true;
      }
    }

    // step: backtrack from current node
    currentPath.pop();
    steps.push({
      id: stepId++,
      dataStructures: {
        graph: {
          type: "graph",
          data: createStepData(null, parentMap),
          metadata: { label: "Graph", position: { x: 0, y: 0 } },
        },
      },
      highlights: {
        graph: [
          { type: "graph_nodes", values: [nodeId], style: "backtrack" },
          {
            type: "graph_nodes",
            values: Array.from(visited),
            style: "visited",
          },
          { type: "graph_nodes", values: currentPath, style: "path" },
        ],
      },
      stepType: "graph_backtrack",
      stepContext: {
        operation: "backtrack",
        dataStructure: "graph",
        nodeId,
      },
      explanation: `Backtracking from ${nodeId}. All neighbors explored, removing from current path.`,
      variables: {
        backtrackFrom: nodeId,
        pathLength: currentPath.length,
        remainingUnvisited: nodes.filter((n) => !visited.has(n.id)).length,
      },
      timing: { duration: 800 },
    });

    return false;
  };

  // initial step
  steps.push({
    id: stepId++,
    dataStructures: {
      graph: {
        type: "graph",
        data: createStepData(),
        metadata: { label: "Graph", position: { x: 0, y: 0 } },
      },
    },
    highlights: {
      graph: [
        {
          type: "graph_nodes",
          values: nodes.map((n) => n.id),
          style: "highlight",
        },
      ],
    },
    stepType: "initialization",
    explanation: `Starting cycle detection on graph with ${nodes.length} nodes and ${edges.length} edges. We'll use DFS to detect cycles.`,
    variables: {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      visitedCount: 0,
      components: 0,
    },
    timing: { duration: 1500 },
  });

  // main algorithm: iterate through all nodes to handle disconnected components
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      // start new component
      const parentMap: { [nodeId: string]: string | null } = {};

      steps.push({
        id: stepId++,
        dataStructures: {
          graph: {
            type: "graph",
            data: createStepData(),
            metadata: { label: "Graph", position: { x: 0, y: 0 } },
          },
        },
        highlights: {
          graph: [
            { type: "graph_nodes", values: [node.id], style: "highlight" },
            {
              type: "graph_nodes",
              values: Array.from(visited),
              style: "visited",
            },
          ],
        },
        stepType: "graph_component_complete",
        stepContext: {
          operation: "visit",
          dataStructure: "graph",
          nodeId: node.id,
          componentNumber: currentComponent,
        },
        explanation: `Starting DFS from ${node.id} to explore component ${
          currentComponent + 1
        }.`,
        variables: {
          startNode: node.id,
          component: currentComponent + 1,
          visitedInPreviousComponents: visited.size,
        },
        timing: { duration: 1000 },
      });

      const foundCycle = dfs(node.id, null, parentMap);

      if (foundCycle) {
        break; // exit early if cycle found
      }

      currentComponent++;
    }
  }

  // final result step
  steps.push({
    id: stepId++,
    dataStructures: {
      graph: {
        type: "graph",
        data: createStepData(null, {}, cycleEdges),
        metadata: { label: "Graph", position: { x: 0, y: 0 } },
      },
    },
    highlights: {
      graph: hasCycle
        ? [
            { type: "graph_nodes", values: cycleNodes, style: "cycle" },
            { type: "graph_edges", values: cycleEdges, style: "cycle" },
          ]
        : [
            {
              type: "graph_nodes",
              values: Array.from(visited),
              style: "visited",
            },
          ],
    },
    stepType: "return",
    explanation: hasCycle
      ? `✅ Cycle Detection Complete: CYCLE FOUND! The graph contains at least one cycle with ${cycleEdges.length} edges.`
      : `✅ Cycle Detection Complete: NO CYCLE FOUND. The graph is acyclic (a forest of trees).`,
    variables: {
      result: hasCycle ? "CYCLE_FOUND" : "NO_CYCLE",
      totalNodesVisited: visited.size,
      totalComponents: currentComponent,
      cycleEdgesCount: cycleEdges.length,
      hasCycle,
    },
    timing: { duration: 2000 },
  });

  return steps;
};

export default generateCycleDetectionSteps;
