import type {
  AlgorithmLineMapping,
  StepType,
  StepContext,
  Language,
  LineRange,
} from "../types/algorithm";

export class AlgorithmLineResolver {
  private lineMappings: Map<string, AlgorithmLineMapping> = new Map();

  registerAlgorithm(algorithmId: string, mapping: AlgorithmLineMapping): void {
    this.lineMappings.set(algorithmId, mapping);
  }

  getHighlightedLines(
    algorithmId: string,
    stepType: StepType,
    language: Language,
    context?: StepContext
  ): number[] {
    const mapping = this.lineMappings.get(algorithmId);
    if (!mapping) {
      console.warn(`No line mapping found for algorithm: ${algorithmId}`);
      return [];
    }

    // try context-specific mapping first
    let stepKey = stepType as any;
    if (context) {
      // different context combinations
      const contextualKeys = [
        `${stepType}_${context.loopType}`,
        `${stepType}_${context.operation}`,
        `${stepType}_${context.dataStructure}`,
      ].filter((key) => mapping[key]);

      if (contextualKeys.length > 0) {
        stepKey = contextualKeys[0];
      }
    }

    const lineMapping = mapping[stepKey];
    if (!lineMapping || !lineMapping[language]) {
      console.warn(
        `No line mapping found for step: ${stepKey}, language: ${language}`
      );
      return [];
    }

    const languageMapping = lineMapping[language];

    // handle different mapping types
    if (Array.isArray(languageMapping)) {
      return languageMapping as number[];
    } else {
      const range = languageMapping as LineRange;
      const lines: number[] = [];
      for (let i = range.start; i <= range.end; i++) {
        lines.push(i);
      }
      return lines;
    }
  }

  getPrimaryLine(
    algorithmId: string,
    stepType: StepType,
    language: Language,
    context?: StepContext
  ): number | null {
    const mapping = this.lineMappings.get(algorithmId);
    if (!mapping) return null;

    let stepKey = stepType as any;
    if (context) {
      const contextualKeys = [
        `${stepType}_${context.loopType}`,
        `${stepType}_${context.operation}`,
        `${stepType}_${context.dataStructure}`,
      ].filter((key) => mapping[key]);

      if (contextualKeys.length > 0) {
        stepKey = contextualKeys[0];
      }
    }

    const lineMapping = mapping[stepKey];
    if (!lineMapping || !lineMapping[language]) return null;

    const languageMapping = lineMapping[language];

    if (Array.isArray(languageMapping)) {
      return languageMapping[0]; // first line as primary
    } else {
      const range = languageMapping as LineRange;
      return range.primary || range.start;
    }
  }

  getAllRegisteredAlgorithms(): string[] {
    return Array.from(this.lineMappings.keys());
  }
}

// create singleton instance
export const algorithmLineResolver = new AlgorithmLineResolver();
