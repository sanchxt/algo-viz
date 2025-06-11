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
  | "validation_failure";

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
    | "validate";
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
    | "recursion_tree";
  passNumber?: number;
  iterationNumber?: number;
  characterIndex?: number;
  stringIndex?: number;
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
    | "recursion_tree";
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
    | "stack_top";
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
    | "processing";
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
    | "queues";
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
    | "mixed";
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
