import type { EnhancedAlgorithmStep } from "@/types/algorithm";

/**
 * generates steps for anagram detection using frequency counting approach.
 * @param {string} string1 - first string to compare.
 * @param {string} string2 - second string to compare.
 * @returns {EnhancedAlgorithmStep[]} array of steps representing the anagram detection process.
 */
export const generateAnagramDetectionSteps = (
  string1: string,
  string2: string
): EnhancedAlgorithmStep[] => {
  const steps: EnhancedAlgorithmStep[] = [];
  let stepId = 0;

  // normalize strings (convert to lowercase and remove spaces)
  const normalizedString1 = string1.toLowerCase().replace(/\s+/g, "");
  const normalizedString2 = string2.toLowerCase().replace(/\s+/g, "");

  // initialize frequency maps
  const frequencyMap1: Record<string, number> = {};
  const frequencyMap2: Record<string, number> = {};

  // step 1: initialization
  steps.push({
    id: stepId++,
    dataStructures: {
      string1: {
        type: "string",
        data: normalizedString1.split(""),
        metadata: { label: "String 1", position: { x: 0, y: 0 } },
      },
      string2: {
        type: "string",
        data: normalizedString2.split(""),
        metadata: { label: "String 2", position: { x: 0, y: 1 } },
      },
      frequencyMap1: {
        type: "hashmap",
        data: {},
        metadata: { label: "Frequency Map 1", position: { x: 1, y: 0 } },
      },
      frequencyMap2: {
        type: "hashmap",
        data: {},
        metadata: { label: "Frequency Map 2", position: { x: 1, y: 1 } },
      },
    },
    highlights: {},
    stepType: "initialization",
    explanation: `Starting anagram detection for "${string1}" and "${string2}". First, we'll count character frequencies in each string.`,
    variables: {
      string1: normalizedString1,
      string2: normalizedString2,
      string1Length: normalizedString1.length,
      string2Length: normalizedString2.length,
      isAnagram: null,
    },
    timing: { duration: 1000 },
  });

  // step 2: early length check
  if (normalizedString1.length !== normalizedString2.length) {
    steps.push({
      id: stepId++,
      dataStructures: {
        string1: {
          type: "string",
          data: normalizedString1.split(""),
          metadata: { label: "String 1", position: { x: 0, y: 0 } },
        },
        string2: {
          type: "string",
          data: normalizedString2.split(""),
          metadata: { label: "String 2", position: { x: 0, y: 1 } },
        },
        frequencyMap1: {
          type: "hashmap",
          data: {},
          metadata: { label: "Frequency Map 1", position: { x: 1, y: 0 } },
        },
        frequencyMap2: {
          type: "hashmap",
          data: {},
          metadata: { label: "Frequency Map 2", position: { x: 1, y: 1 } },
        },
      },
      highlights: {
        string1: [
          { type: "characters", values: ["length"], style: "mismatch" },
        ],
        string2: [
          { type: "characters", values: ["length"], style: "mismatch" },
        ],
      },
      stepType: "string_comparison",
      explanation: `Strings have different lengths (${normalizedString1.length} vs ${normalizedString2.length}). They cannot be anagrams!`,
      variables: {
        string1: normalizedString1,
        string2: normalizedString2,
        string1Length: normalizedString1.length,
        string2Length: normalizedString2.length,
        isAnagram: false,
        reason: "Different lengths",
      },
      timing: { duration: 1500 },
    });
    return steps;
  }

  // step 3: process String 1 - char by char
  for (let i = 0; i < normalizedString1.length; i++) {
    const char = normalizedString1[i];

    // show character access
    steps.push({
      id: stepId++,
      dataStructures: {
        string1: {
          type: "string",
          data: normalizedString1.split(""),
          metadata: { label: "String 1", position: { x: 0, y: 0 } },
        },
        string2: {
          type: "string",
          data: normalizedString2.split(""),
          metadata: { label: "String 2", position: { x: 0, y: 1 } },
        },
        frequencyMap1: {
          type: "hashmap",
          data: { ...frequencyMap1 },
          metadata: { label: "Frequency Map 1", position: { x: 1, y: 0 } },
        },
        frequencyMap2: {
          type: "hashmap",
          data: { ...frequencyMap2 },
          metadata: { label: "Frequency Map 2", position: { x: 1, y: 1 } },
        },
      },
      highlights: {
        string1: [{ type: "characters", values: [i], style: "current" }],
      },
      stepType: "character_access",
      stepContext: {
        operation: "read",
        dataStructure: "string",
        characterIndex: i,
        stringIndex: 1,
      },
      explanation: `Processing String 1: Reading character '${char}' at position ${i}`,
      variables: {
        currentChar: char,
        currentIndex: i,
        processingString: 1,
        string1Length: normalizedString1.length,
        string2Length: normalizedString2.length,
      },
      timing: { duration: 800 },
    });

    // update frequency
    frequencyMap1[char] = (frequencyMap1[char] || 0) + 1;

    steps.push({
      id: stepId++,
      dataStructures: {
        string1: {
          type: "string",
          data: normalizedString1.split(""),
          metadata: { label: "String 1", position: { x: 0, y: 0 } },
        },
        string2: {
          type: "string",
          data: normalizedString2.split(""),
          metadata: { label: "String 2", position: { x: 0, y: 1 } },
        },
        frequencyMap1: {
          type: "hashmap",
          data: { ...frequencyMap1 },
          metadata: { label: "Frequency Map 1", position: { x: 1, y: 0 } },
        },
        frequencyMap2: {
          type: "hashmap",
          data: { ...frequencyMap2 },
          metadata: { label: "Frequency Map 2", position: { x: 1, y: 1 } },
        },
      },
      highlights: {
        string1: [{ type: "characters", values: [i], style: "active" }],
        frequencyMap1: [{ type: "keys", values: [char], style: "highlight" }],
      },
      stepType: "frequency_count",
      stepContext: {
        operation: "write",
        dataStructure: "hashmap",
        characterIndex: i,
        stringIndex: 1,
      },
      explanation: `Updated frequency map: '${char}' count is now ${frequencyMap1[char]}`,
      variables: {
        currentChar: char,
        currentIndex: i,
        charCount: frequencyMap1[char],
        processingString: 1,
        frequencyMap1: { ...frequencyMap1 },
      },
      timing: { duration: 800 },
    });
  }

  // step 4: process String 2 - char by char
  for (let i = 0; i < normalizedString2.length; i++) {
    const char = normalizedString2[i];

    // show character access
    steps.push({
      id: stepId++,
      dataStructures: {
        string1: {
          type: "string",
          data: normalizedString1.split(""),
          metadata: { label: "String 1", position: { x: 0, y: 0 } },
        },
        string2: {
          type: "string",
          data: normalizedString2.split(""),
          metadata: { label: "String 2", position: { x: 0, y: 1 } },
        },
        frequencyMap1: {
          type: "hashmap",
          data: { ...frequencyMap1 },
          metadata: { label: "Frequency Map 1", position: { x: 1, y: 0 } },
        },
        frequencyMap2: {
          type: "hashmap",
          data: { ...frequencyMap2 },
          metadata: { label: "Frequency Map 2", position: { x: 1, y: 1 } },
        },
      },
      highlights: {
        string2: [{ type: "characters", values: [i], style: "current" }],
      },
      stepType: "character_access",
      stepContext: {
        operation: "read",
        dataStructure: "string",
        characterIndex: i,
        stringIndex: 2,
      },
      explanation: `Processing String 2: Reading character '${char}' at position ${i}`,
      variables: {
        currentChar: char,
        currentIndex: i,
        processingString: 2,
        string1Length: normalizedString1.length,
        string2Length: normalizedString2.length,
      },
      timing: { duration: 800 },
    });

    // update frequency
    frequencyMap2[char] = (frequencyMap2[char] || 0) + 1;

    steps.push({
      id: stepId++,
      dataStructures: {
        string1: {
          type: "string",
          data: normalizedString1.split(""),
          metadata: { label: "String 1", position: { x: 0, y: 0 } },
        },
        string2: {
          type: "string",
          data: normalizedString2.split(""),
          metadata: { label: "String 2", position: { x: 0, y: 1 } },
        },
        frequencyMap1: {
          type: "hashmap",
          data: { ...frequencyMap1 },
          metadata: { label: "Frequency Map 1", position: { x: 1, y: 0 } },
        },
        frequencyMap2: {
          type: "hashmap",
          data: { ...frequencyMap2 },
          metadata: { label: "Frequency Map 2", position: { x: 1, y: 1 } },
        },
      },
      highlights: {
        string2: [{ type: "characters", values: [i], style: "active" }],
        frequencyMap2: [{ type: "keys", values: [char], style: "highlight" }],
      },
      stepType: "frequency_count",
      stepContext: {
        operation: "write",
        dataStructure: "hashmap",
        characterIndex: i,
        stringIndex: 2,
      },
      explanation: `Updated frequency map: '${char}' count is now ${frequencyMap2[char]}`,
      variables: {
        currentChar: char,
        currentIndex: i,
        charCount: frequencyMap2[char],
        processingString: 2,
        frequencyMap2: { ...frequencyMap2 },
      },
      timing: { duration: 800 },
    });
  }

  // step 5: compare frequency maps
  const allKeys = new Set([
    ...Object.keys(frequencyMap1),
    ...Object.keys(frequencyMap2),
  ]);
  let isAnagram = true;
  let comparedKeys: string[] = [];

  for (const key of allKeys) {
    comparedKeys.push(key);
    const count1 = frequencyMap1[key] || 0;
    const count2 = frequencyMap2[key] || 0;
    const keyMatches = count1 === count2;

    if (!keyMatches) {
      isAnagram = false;
    }

    steps.push({
      id: stepId++,
      dataStructures: {
        string1: {
          type: "string",
          data: normalizedString1.split(""),
          metadata: { label: "String 1", position: { x: 0, y: 0 } },
        },
        string2: {
          type: "string",
          data: normalizedString2.split(""),
          metadata: { label: "String 2", position: { x: 0, y: 1 } },
        },
        frequencyMap1: {
          type: "hashmap",
          data: { ...frequencyMap1 },
          metadata: { label: "Frequency Map 1", position: { x: 1, y: 0 } },
        },
        frequencyMap2: {
          type: "hashmap",
          data: { ...frequencyMap2 },
          metadata: { label: "Frequency Map 2", position: { x: 1, y: 1 } },
        },
      },
      highlights: {
        frequencyMap1: [
          {
            type: "keys",
            values: [key],
            style: keyMatches ? "match" : "mismatch",
          },
        ],
        frequencyMap2: [
          {
            type: "keys",
            values: [key],
            style: keyMatches ? "match" : "mismatch",
          },
        ],
      },
      stepType: "hash_map_comparison",
      stepContext: {
        operation: "compare",
        dataStructure: "hashmap",
      },
      explanation: `Comparing '${key}': String1 has ${count1}, String2 has ${count2}. ${
        keyMatches ? "✓ Match!" : "✗ Mismatch!"
      }`,
      variables: {
        currentKey: key,
        count1,
        count2,
        keyMatches,
        comparedKeys: [...comparedKeys],
        remainingKeys: allKeys.size - comparedKeys.length,
        isAnagramSoFar: isAnagram,
      },
      timing: { duration: 1200 },
    });

    if (!keyMatches && isAnagram === false) {
      // early exit if we found a mismatch
      break;
    }
  }

  // step 6: final result
  steps.push({
    id: stepId++,
    dataStructures: {
      string1: {
        type: "string",
        data: normalizedString1.split(""),
        metadata: { label: "String 1", position: { x: 0, y: 0 } },
      },
      string2: {
        type: "string",
        data: normalizedString2.split(""),
        metadata: { label: "String 2", position: { x: 0, y: 1 } },
      },
      frequencyMap1: {
        type: "hashmap",
        data: { ...frequencyMap1 },
        metadata: { label: "Frequency Map 1", position: { x: 1, y: 0 } },
      },
      frequencyMap2: {
        type: "hashmap",
        data: { ...frequencyMap2 },
        metadata: { label: "Frequency Map 2", position: { x: 1, y: 1 } },
      },
    },
    highlights: {
      string1: [
        {
          type: "characters",
          values: Array.from({ length: normalizedString1.length }, (_, i) => i),
          style: isAnagram ? "match" : "mismatch",
        },
      ],
      string2: [
        {
          type: "characters",
          values: Array.from({ length: normalizedString2.length }, (_, i) => i),
          style: isAnagram ? "match" : "mismatch",
        },
      ],
    },
    stepType: isAnagram ? "return_found" : "return_not_found",
    explanation: `Result: "${string1}" and "${string2}" ${
      isAnagram ? "ARE" : "are NOT"
    } anagrams! ${
      isAnagram
        ? "All character frequencies match."
        : "Character frequencies differ."
    }`,
    variables: {
      isAnagram,
      string1: normalizedString1,
      string2: normalizedString2,
      frequencyMap1: { ...frequencyMap1 },
      frequencyMap2: { ...frequencyMap2 },
      conclusion: isAnagram ? "Anagrams detected" : "Not anagrams",
    },
    timing: { duration: 2000 },
  });

  return steps;
};
