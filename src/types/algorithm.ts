export type StepType =
  | "initialization"
  | "loop_start"
  | "loop_condition"
  | "comparison"
  | "swap"
  | "assignment"
  | "function_call"
  | "return"
  | "return_found"
  | "return_not_found"
  | "tree_traversal"
  | "graph_visit"
  | "no_swap"
  | "pass_complete"
  | "pointer_initialization"
  | "pointer_move_left"
  | "pointer_move_right"
  // string manipulation step types
  | "string_iteration"
  | "character_access"
  | "frequency_count"
  | "hash_map_comparison"
  | "hash_map_creation"
  | "string_comparison"
  // linked list step types
  | "node_traversal"
  | "link_reversal"
  | "pointer_update"
  // recursion step types
  | "recursive_call"
  | "base_case_check"
  | "base_case_reached"
  | "recursive_return"
  | "call_stack_push"
  | "call_stack_pop"
  // stack step types
  | "stack_push"
  | "stack_pop"
  | "stack_peek"
  | "character_check"
  | "validation_success"
  | "validation_failure"
  // queue step types
  | "queue_enqueue"
  | "queue_dequeue"
  | "queue_peek"
  | "level_complete"
  // graph step types
  | "graph_node_visit"
  | "graph_edge_explore"
  | "graph_cycle_detected"
  | "graph_backtrack"
  | "graph_component_complete"
  // dp step types
  | "dp_table_initialization"
  | "dp_amount_processing"
  | "dp_coin_consideration"
  | "dp_subproblem_lookup"
  | "dp_comparison"
  | "dp_table_update"
  | "dp_path_reconstruction"
  | "dp_optimal_solution_found"
  | "dp_no_solution"
  // greedy step types
  | "greedy_insight"
  | "formula_derivation"
  | "decision_tree"
  | "cost_calculation"
  | "element_removal"
  | "optimality_proof"
  | "greedy_selection"
  | "pair_comparison"
  // heap step types
  | "heap_initialization"
  | "heap_push"
  | "heap_pop"
  | "heap_peek"
  | "heap_size_check"
  | "heap_compare"
  | "heap_maintain_size"
  | "heap_result_found";

export interface StepContext {
  loopType?: "outer" | "inner" | "while" | "recursive" | "string_iteration";
  operation?:
    | "read"
    | "write"
    | "compare"
    | "count"
    | "access"
    | "reverse"
    | "store"
    | "call"
    | "return_value"
    | "push"
    | "pop"
    | "peek"
    | "validate"
    | "enqueue"
    | "dequeue"
    | "initialize"
    | "skip"
    | "visit"
    | "explore"
    | "detect_cycle"
    | "backtrack"
    | "calculate"
    | "select"
    | "optimize";
  dataStructure?:
    | "array"
    | "tree"
    | "graph"
    | "stack"
    | "queue"
    | "string"
    | "hashmap"
    | "linkedlist"
    | "call_stack"
    | "recursion_tree"
    | "heap"
    | "min_heap"
    | "max_heap";
  passNumber?: number;
  iterationNumber?: number;
  characterIndex?: number;
  stringIndex?: string;
  nodeId?: string;
  pointerType?: "prev" | "current" | "next" | "head";
  recursionLevel?: number;
  callId?: string;
  parentCallId?: string;
  // stack-specific context
  stackElement?: string;
  bracketType?: "opening" | "closing";
  matchingBracket?: string;
  isValid?: boolean;
  // queue-specific context
  queueElement?: any;
  queueSize?: number;
  currentLevel?: number;
  nodesInCurrentLevel?: number;
  processedInLevel?: number;
  // graph-specific context
  fromNodeId?: string;
  toNodeId?: string;
  edgeId?: string;
  parentNodeId?: string;
  cycleDetected?: boolean;
  componentNumber?: number;
  // dp-specific context
  coinValue?: number;
  currentAmount?: number;
  targetAmount?: number;
  subproblemAmount?: number;
  comparisonValues?: number[];
  pathCoin?: number;
  solutionFound?: boolean;
  dpTableIndex?: number;
  // greedy-specific context
  greedyChoice?: any;
  localOptimal?: any;
  globalOptimal?: any;
  costValue?: number;
  selectedPair?: [any, any];
  optimizationCriteria?: string;
  // heap-specific context
  heapSize?: number;
  heapCapacity?: number;
  heapElement?: number;
  currentInputElement?: number;
  inputIndex?: number;
  heapOperation?: "push" | "pop" | "peek" | "compare";
  heapMaintained?: boolean;
  kValue?: number;
}

export interface DataStructureState {
  type:
    | "array"
    | "string"
    | "hashmap"
    | "tree"
    | "graph"
    | "linkedlist"
    | "stack"
    | "queue"
    | "call_stack"
    | "recursion_tree"
    | "heap";
  data: any;
  metadata?: {
    label?: string;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
    style?: Record<string, any>;
  };
}

export interface HighlightInfo {
  type:
    | "indices"
    | "keys"
    | "nodes"
    | "edges"
    | "positions"
    | "characters"
    | "cells"
    | "links"
    | "pointers"
    | "call_frames"
    | "tree_nodes"
    | "stack_elements"
    | "stack_top"
    | "queue_elements"
    | "queue_front"
    | "queue_rear"
    | "graph_nodes"
    | "graph_edges"
    | "heap_elements"
    | "heap_top"
    | "heap_parent"
    | "heap_children"
    | "input_element";
  values: any[];
  style?:
    | "highlight"
    | "compare"
    | "swap"
    | "active"
    | "visited"
    | "current"
    | "match"
    | "mismatch"
    | "reversed"
    | "pointer"
    | "base_case"
    | "recursive_call"
    | "returning"
    | "valid"
    | "invalid"
    | "processing"
    | "queued"
    | "dequeued"
    | "level_complete"
    | "exploring"
    | "cycle"
    | "path"
    | "backtrack"
    | "selected"
    | "optimal"
    | "cost"
    | "heap_highlight"
    | "heap_top"
    | "heap_parent"
    | "heap_child"
    | "heap_result"
    | "input_current"
    | "heap_compare"
    | "heap_maintain";
  color?: string;
  intensity?: "low" | "medium" | "high";
}

export interface EnhancedAlgorithmStep {
  id: number;
  dataStructures: {
    [key: string]: DataStructureState;
  };
  highlights: {
    [dataStructureKey: string]: HighlightInfo[];
  };
  stepType: StepType;
  stepContext?: StepContext;
  explanation: string;
  variables?: Record<string, any>;
  timing?: {
    duration?: number; // animation duration in ms
    delay?: number; // delay before step in ms
  };
}

export interface Algorithm {
  id: string;
  name: string;
  category:
    | "sorting"
    | "search"
    | "trees"
    | "sliding-window"
    | "strings"
    | "linked-lists"
    | "recursion"
    | "stacks"
    | "queues"
    | "dynamic-programming"
    | "graphs"
    | "greedy"
    | "heaps";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  dataStructureType?:
    | "array"
    | "string"
    | "hashmap"
    | "tree"
    | "graph"
    | "linkedlist"
    | "stack"
    | "queue"
    | "mixed"
    | "heap";
}

export type Language =
  | "javascript"
  | "cpp"
  | "python"
  | "java"
  | "rust"
  | "typescript"
  | "go";

export interface LineRange {
  start: number;
  end: number;
  primary?: number; // "main" line (when highlighting multiple)
}

export interface AlgorithmLineMapping {
  [stepType: string]: {
    [language: string]: number[] | LineRange;
  };
}

export interface AlgorithmIntuition {
  title: string;
  description: string;
  intuition: {
    title: string;
    content: string[];
  };
  whenToUse: {
    title: string;
    content: string[];
    examples: string[];
  };
  realWorldAnalogy: {
    title: string;
    content: string;
  };
  timeComplexity?: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity?: string;
}
