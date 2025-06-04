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
  | "pass_complete";

export interface StepContext {
  loopType?: "outer" | "inner" | "while" | "recursive";
  operation?: "read" | "write" | "compare";
  dataStructure?: "array" | "tree" | "graph" | "stack" | "queue";
  passNumber?: number;
  iterationNumber?: number;
}

export interface AlgorithmStep {
  id: number;
  arrayState: number[];
  highlightedIndices: number[];
  compareIndices?: number[];
  swapIndices?: number[];
  stepType: StepType;
  stepContext?: StepContext;
  explanation: string;
  variables?: Record<string, any>;
}

export interface Algorithm {
  id: string;
  name: string;
  category: "sorting" | "search" | "trees";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
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
}
