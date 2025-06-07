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
  // New string manipulation step types
  | "string_iteration"
  | "character_access"
  | "frequency_count"
  | "hash_map_comparison"
  | "hash_map_creation"
  | "string_comparison";

export interface StepContext {
  loopType?: "outer" | "inner" | "while" | "recursive" | "string_iteration";
  operation?: "read" | "write" | "compare" | "count" | "access";
  dataStructure?:
    | "array"
    | "tree"
    | "graph"
    | "stack"
    | "queue"
    | "string"
    | "hashmap";
  passNumber?: number;
  iterationNumber?: number;
  characterIndex?: number;
  stringIndex?: number;
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
    | "queue";
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
    | "cells";
  values: any[];
  style?:
    | "highlight"
    | "compare"
    | "swap"
    | "active"
    | "visited"
    | "current"
    | "match"
    | "mismatch";
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
  category: "sorting" | "search" | "trees" | "sliding-window" | "strings";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  dataStructureType?:
    | "array"
    | "string"
    | "hashmap"
    | "tree"
    | "graph"
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
