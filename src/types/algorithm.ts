export interface AlgorithmStep {
  id: number;
  arrayState: number[];
  highlightedIndices: number[];
  compareIndices?: number[];
  swapIndices?: number[];
  currentLine: number;
  explanation: string;
  variables?: Record<string, any>;
}

export interface Algorithm {
  id: string;
  name: string;
  category: "sorting" | "searching" | "trees";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
}
