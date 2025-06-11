import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface StackElement {
  value: string;
  id: string;
  addedAtStep: number;
}

interface BalancedParenthesesState {
  stack: StackElement[];
  currentIndex: number;
  currentChar: string;
  isValid: boolean;
  hasError: boolean;
  errorMessage?: string;
  processedChars: string[];
  bracketPairs: { opening: string; closing: string; index: number }[];
}

/**
 * generates steps for balanced parentheses checking using a stack.
 * @param {string} input - the string to check for balanced parentheses.
 * @returns {EnhancedAlgorithmStep[]} array of steps representing the checking process.
 */
export const generateBalancedParenthesesSteps = (
  input: string
): EnhancedAlgorithmStep[] => {
  const steps: EnhancedAlgorithmStep[] = [];
  let stepId = 0;
  let elementIdCounter = 0;

  // bracket matching map
  const bracketMap: { [key: string]: string } = {
    "(": ")",
    "[": "]",
    "{": "}",
  };

  const closingBrackets = new Set([")", "]", "}"]);
  const openingBrackets = new Set(["(", "[", "{"]);

  // helper to generate unique element IDs
  const generateElementId = () => `elem_${elementIdCounter++}`;

  // helper to create step data
  const createStepData = (
    state: BalancedParenthesesState
  ): BalancedParenthesesState => ({
    stack: [...state.stack],
    currentIndex: state.currentIndex,
    currentChar: state.currentChar,
    isValid: state.isValid,
    hasError: state.hasError,
    errorMessage: state.errorMessage,
    processedChars: [...state.processedChars],
    bracketPairs: [...state.bracketPairs],
  });

  // initialize state
  const state: BalancedParenthesesState = {
    stack: [],
    currentIndex: -1,
    currentChar: "",
    isValid: true,
    hasError: false,
    processedChars: [],
    bracketPairs: [],
  };

  // step 1: initialization
  steps.push({
    id: stepId++,
    dataStructures: {
      stack: {
        type: "stack",
        data: [],
        metadata: {
          label: "Stack",
          position: { x: 0, y: 0 },
          style: { orientation: "vertical" },
        },
      },
      inputString: {
        type: "string",
        data: input.split(""),
        metadata: {
          label: "Input String",
          position: { x: 1, y: 0 },
        },
      },
    },
    highlights: {},
    stepType: "initialization",
    explanation: `Starting balanced parentheses check for "${input}". We'll use a stack to track opening brackets and match them with closing brackets.`,
    variables: {
      inputLength: input.length,
      currentIndex: -1,
      stackSize: 0,
      isValid: true,
    },
    timing: { duration: 1500 },
  });

  // process each character
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    state.currentIndex = i;
    state.currentChar = char;

    // step: character access
    steps.push({
      id: stepId++,
      dataStructures: {
        stack: {
          type: "stack",
          data: createStepData(state).stack,
          metadata: {
            label: "Stack",
            position: { x: 0, y: 0 },
            style: { orientation: "vertical" },
          },
        },
        inputString: {
          type: "string",
          data: input.split(""),
          metadata: {
            label: "Input String",
            position: { x: 1, y: 0 },
          },
        },
      },
      highlights: {
        inputString: [{ type: "characters", values: [i], style: "current" }],
      },
      stepType: "character_access",
      stepContext: {
        operation: "read",
        dataStructure: "string",
        characterIndex: i,
      },
      explanation: `Reading character at index ${i}: '${char}'`,
      variables: {
        currentChar: char,
        currentIndex: i,
        charType: openingBrackets.has(char)
          ? "opening"
          : closingBrackets.has(char)
          ? "closing"
          : "other",
        stackSize: state.stack.length,
      },
      timing: { duration: 800 },
    });

    // step: character check
    let charType: "opening" | "closing" | "other";
    if (openingBrackets.has(char)) {
      charType = "opening";
    } else if (closingBrackets.has(char)) {
      charType = "closing";
    } else {
      charType = "other";
    }

    steps.push({
      id: stepId++,
      dataStructures: {
        stack: {
          type: "stack",
          data: createStepData(state).stack,
          metadata: {
            label: "Stack",
            position: { x: 0, y: 0 },
            style: { orientation: "vertical" },
          },
        },
        inputString: {
          type: "string",
          data: input.split(""),
          metadata: {
            label: "Input String",
            position: { x: 1, y: 0 },
          },
        },
      },
      highlights: {
        inputString: [
          {
            type: "characters",
            values: [i],
            style: charType === "other" ? "mismatch" : "processing",
          },
        ],
      },
      stepType: "character_check",
      stepContext: {
        operation: "validate",
        dataStructure: "string",
        characterIndex: i,
        bracketType: charType === "other" ? undefined : charType,
      },
      explanation:
        charType === "opening"
          ? `'${char}' is an opening bracket. Will push to stack.`
          : charType === "closing"
          ? `'${char}' is a closing bracket. Need to check if it matches the top of stack.`
          : `'${char}' is not a bracket character. Ignoring and continuing.`,
      variables: {
        currentChar: char,
        characterType: charType,
        stackSize: state.stack.length,
        action:
          charType === "opening"
            ? "push"
            : charType === "closing"
            ? "pop_and_match"
            : "ignore",
      },
      timing: { duration: 1000 },
    });

    if (openingBrackets.has(char)) {
      // push opening bracket to stack
      const element: StackElement = {
        value: char,
        id: generateElementId(),
        addedAtStep: stepId,
      };
      state.stack.push(element);

      steps.push({
        id: stepId++,
        dataStructures: {
          stack: {
            type: "stack",
            data: createStepData(state).stack,
            metadata: {
              label: "Stack",
              position: { x: 0, y: 0 },
              style: { orientation: "vertical" },
            },
          },
          inputString: {
            type: "string",
            data: input.split(""),
            metadata: {
              label: "Input String",
              position: { x: 1, y: 0 },
            },
          },
        },
        highlights: {
          stack: [
            {
              type: "stack_elements",
              values: [element.id],
              style: "highlight",
            },
          ],
          inputString: [{ type: "characters", values: [i], style: "valid" }],
        },
        stepType: "stack_push",
        stepContext: {
          operation: "push",
          dataStructure: "stack",
          stackElement: char,
          characterIndex: i,
        },
        explanation: `Pushed '${char}' onto the stack. Stack size is now ${state.stack.length}.`,
        variables: {
          pushedElement: char,
          stackSize: state.stack.length,
          stackTop: state.stack[state.stack.length - 1]?.value,
          currentIndex: i,
        },
        timing: { duration: 1200 },
      });
    } else if (closingBrackets.has(char)) {
      // check if stack is empty
      if (state.stack.length === 0) {
        state.hasError = true;
        state.isValid = false;
        state.errorMessage = `No matching opening bracket for '${char}'`;

        steps.push({
          id: stepId++,
          dataStructures: {
            stack: {
              type: "stack",
              data: createStepData(state).stack,
              metadata: {
                label: "Stack",
                position: { x: 0, y: 0 },
                style: { orientation: "vertical" },
              },
            },
            inputString: {
              type: "string",
              data: input.split(""),
              metadata: {
                label: "Input String",
                position: { x: 1, y: 0 },
              },
            },
          },
          highlights: {
            inputString: [
              { type: "characters", values: [i], style: "invalid" },
            ],
          },
          stepType: "validation_failure",
          stepContext: {
            operation: "validate",
            dataStructure: "stack",
            characterIndex: i,
            isValid: false,
          },
          explanation: `Error! Found closing bracket '${char}' but stack is empty. No matching opening bracket.`,
          variables: {
            currentChar: char,
            stackSize: 0,
            isValid: false,
            errorType: "no_opening_bracket",
            errorMessage: state.errorMessage,
          },
          timing: { duration: 1500 },
        });
        break; // stop processing on error
      }

      // peek at top of stack
      const topElement = state.stack[state.stack.length - 1];

      steps.push({
        id: stepId++,
        dataStructures: {
          stack: {
            type: "stack",
            data: createStepData(state).stack,
            metadata: {
              label: "Stack",
              position: { x: 0, y: 0 },
              style: { orientation: "vertical" },
            },
          },
          inputString: {
            type: "string",
            data: input.split(""),
            metadata: {
              label: "Input String",
              position: { x: 1, y: 0 },
            },
          },
        },
        highlights: {
          stack: [
            { type: "stack_top", values: [topElement.id], style: "highlight" },
          ],
          inputString: [
            { type: "characters", values: [i], style: "processing" },
          ],
        },
        stepType: "stack_peek",
        stepContext: {
          operation: "peek",
          dataStructure: "stack",
          stackElement: topElement.value,
          characterIndex: i,
        },
        explanation: `Peeking at top of stack: '${topElement.value}'. Checking if it matches with '${char}'.`,
        variables: {
          stackTop: topElement.value,
          currentChar: char,
          expectedClosing: bracketMap[topElement.value],
          willMatch: bracketMap[topElement.value] === char,
        },
        timing: { duration: 1000 },
      });

      // check if brackets match
      if (bracketMap[topElement.value] === char) {
        // matching pair found
        state.stack.pop();
        state.bracketPairs.push({
          opening: topElement.value,
          closing: char,
          index: i,
        });

        steps.push({
          id: stepId++,
          dataStructures: {
            stack: {
              type: "stack",
              data: createStepData(state).stack,
              metadata: {
                label: "Stack",
                position: { x: 0, y: 0 },
                style: { orientation: "vertical" },
              },
            },
            inputString: {
              type: "string",
              data: input.split(""),
              metadata: {
                label: "Input String",
                position: { x: 1, y: 0 },
              },
            },
          },
          highlights: {
            inputString: [{ type: "characters", values: [i], style: "valid" }],
          },
          stepType: "stack_pop",
          stepContext: {
            operation: "pop",
            dataStructure: "stack",
            stackElement: topElement.value,
            matchingBracket: char,
            characterIndex: i,
          },
          explanation: `Match found! '${topElement.value}' matches '${char}'. Popped '${topElement.value}' from stack. Stack size is now ${state.stack.length}.`,
          variables: {
            poppedElement: topElement.value,
            matchingChar: char,
            stackSize: state.stack.length,
            matchingPairs: state.bracketPairs.length,
            currentIndex: i,
          },
          timing: { duration: 1200 },
        });
      } else {
        // mismatched brackets
        state.hasError = true;
        state.isValid = false;
        state.errorMessage = `Mismatched brackets: expected '${
          bracketMap[topElement.value]
        }' but found '${char}'`;

        steps.push({
          id: stepId++,
          dataStructures: {
            stack: {
              type: "stack",
              data: createStepData(state).stack,
              metadata: {
                label: "Stack",
                position: { x: 0, y: 0 },
                style: { orientation: "vertical" },
              },
            },
            inputString: {
              type: "string",
              data: input.split(""),
              metadata: {
                label: "Input String",
                position: { x: 1, y: 0 },
              },
            },
          },
          highlights: {
            stack: [
              { type: "stack_top", values: [topElement.id], style: "invalid" },
            ],
            inputString: [
              { type: "characters", values: [i], style: "invalid" },
            ],
          },
          stepType: "validation_failure",
          stepContext: {
            operation: "validate",
            dataStructure: "stack",
            characterIndex: i,
            isValid: false,
          },
          explanation: `Error! Mismatched brackets: '${
            topElement.value
          }' expects '${bracketMap[topElement.value]}' but found '${char}'.`,
          variables: {
            stackTop: topElement.value,
            currentChar: char,
            expected: bracketMap[topElement.value],
            found: char,
            isValid: false,
            errorType: "mismatched_brackets",
            errorMessage: state.errorMessage,
          },
          timing: { duration: 1500 },
        });
        break; // stop processing on error
      }
    }
    // if char is not a bracket, we simply continue (ignore it)
  }

  // final validation step (only if no error occurred)
  if (!state.hasError) {
    const finalIsValid = state.stack.length === 0;
    state.isValid = finalIsValid;

    steps.push({
      id: stepId++,
      dataStructures: {
        stack: {
          type: "stack",
          data: createStepData(state).stack,
          metadata: {
            label: "Stack",
            position: { x: 0, y: 0 },
            style: { orientation: "vertical" },
          },
        },
        inputString: {
          type: "string",
          data: input.split(""),
          metadata: {
            label: "Input String",
            position: { x: 1, y: 0 },
          },
        },
      },
      highlights: {
        stack:
          state.stack.length > 0
            ? [
                {
                  type: "stack_elements",
                  values: state.stack.map((el) => el.id),
                  style: "invalid",
                },
              ]
            : [],
      },
      stepType: finalIsValid ? "validation_success" : "validation_failure",
      explanation: finalIsValid
        ? `Success! All brackets are balanced. The stack is empty, meaning every opening bracket had a matching closing bracket.`
        : `Failed! The stack is not empty, meaning there are unmatched opening brackets: ${state.stack
            .map((el) => el.value)
            .join(", ")}.`,
      variables: {
        finalResult: finalIsValid,
        stackSize: state.stack.length,
        unmatchedBrackets: state.stack.map((el) => el.value),
        totalPairs: state.bracketPairs.length,
        inputLength: input.length,
      },
      timing: { duration: 2000 },
    });
  }

  return steps;
};

export default generateBalancedParenthesesSteps;
