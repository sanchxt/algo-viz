import type { AlgorithmIntuition } from "@/types/algorithm";

export const balancedParenthesesIntuition: AlgorithmIntuition = {
  title: "Balanced Parentheses Checker",
  description:
    "A classic stack algorithm that verifies whether brackets in a string are properly balanced and correctly nested using the Last-In-First-Out (LIFO) principle.",

  intuition: {
    title: "The Core Intuition",
    content: [
      "The stack is perfect for this problem because of its LIFO nature - the last opening bracket we see should be matched by the first closing bracket we encounter.",
      "Think of it like nesting dolls: when you open a doll, you must close that same doll before you can close any outer dolls.",
      "Every opening bracket creates an 'expectation' for its matching closing bracket. The stack remembers these expectations in reverse order.",
      "When we see an opening bracket, we push it onto the stack, saying 'remember, we need to close this later.'",
      "When we see a closing bracket, we check: 'Does this match the most recent opening bracket?' If yes, we've satisfied that expectation and can pop it off.",
      "If the stack is empty at the end, all brackets were properly matched. If not, some opening brackets never found their partners.",
      "The key insight: proper nesting means the most recently opened bracket must be the first to be closed.",
    ],
  },

  whenToUse: {
    title: "When Should You Use This Algorithm?",
    content: [
      "When validating syntax in programming languages and markup",
      "When checking mathematical expressions for proper bracket usage",
      "When parsing nested structures like JSON, XML, or HTML",
      "When implementing code editors with bracket matching features",
      "When validating user input that contains nested elements",
      "When building compilers or interpreters that need syntax validation",
    ],
    examples: [
      "Code editors highlighting matching brackets: VSCode, IntelliJ",
      "Compilers checking syntax: GCC, Clang validating C++ code",
      "Mathematical software: Wolfram Alpha, calculators parsing expressions",
      "JSON validators: ensuring proper object/array nesting",
      "HTML/XML parsers: checking tag matching in web browsers",
      "LaTeX processors: validating mathematical notation brackets",
      "Configuration file parsers: YAML, TOML bracket validation",
    ],
  },

  realWorldAnalogy: {
    title: "Real-World Analogy",
    content:
      "Imagine you're organizing boxes inside other boxes for shipping. Every time you open a box, you put a sticky note on a stack saying 'remember to close this box.' When you're ready to close a box, you check the top sticky note - it should match the box you're about to close. If it matches, you remove that note and close the box. If all goes well, when you're done packing, your stack of sticky notes should be empty, meaning every box was properly closed. If you have leftover notes, some boxes were never closed. If you try to close a box but the top note doesn't match, you're trying to close the wrong box! This is exactly how the stack tracks opening and closing brackets.",
  },

  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
  },
  spaceComplexity: "O(n) - worst case when all characters are opening brackets",
};
