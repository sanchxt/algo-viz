import type { AlgorithmLineMapping } from "@/types/algorithm";

export const balancedParenthesesLineMapping: AlgorithmLineMapping = {
  initialization: {
    javascript: [1, 2, 3], // function isBalanced(s) { const stack = []; const brackets = ...
    cpp: [7, 8, 9], // bool isBalanced(string s) { stack<char> st; unordered_map<char, char> brackets = ...
    python: [1, 2, 3], // def is_balanced(s): stack = [] brackets = ...
    java: [3, 4, 5, 6, 7, 8], // public static boolean isBalanced(String s) { Stack<Character> stack = ...; Map<Character, Character> brackets = ...
    rust: [4, 5, 6, 7, 8, 9], // fn is_balanced(s: &str) -> bool { let mut stack = Vec::new(); let mut brackets = HashMap::new(); ...
    typescript: [1, 2, 3], // function isBalanced(s: string): boolean { const stack: string[] = []; const brackets: ...
    go: [5, 6, 7], // func isBalanced(s string) bool { stack := []rune{} brackets := map[rune]rune{...}
  },

  character_access: {
    javascript: [5, 6], // for (let i = 0; i < s.length; i++) { const char = s[i];
    cpp: [11, 12], // for (int i = 0; i < s.length(); i++) { char ch = s[i];
    python: [5, 6], // for i in range(len(s)): char = s[i]
    java: [10, 11], // for (int i = 0; i < s.length(); i++) { char ch = s.charAt(i);
    rust: [11], // for ch in s.chars() {
    typescript: [5, 6], // for (let i = 0; i < s.length; i++) { const char: string = s[i];
    go: [9], // for _, char := range s {
  },

  character_check: {
    javascript: [8, 12], // if (brackets[char]) { ... else if (char === ')' || char === ']' || char === '}') {
    cpp: [14, 18], // if (brackets.find(ch) != brackets.end()) { ... else if (ch == ')' || ch == ']' || ch == '}') {
    python: [8, 12], // if char in brackets: ... elif char in ')]}':
    java: [13, 17], // if (brackets.containsKey(ch)) { ... else if (ch == ')' || ch == ']' || ch == '}') {
    rust: [13, 19], // if brackets.contains_key(&ch) { ... else if ch == ')' || ch == ']' || ch == '}' {
    typescript: [8, 12], // if (brackets[char]) { ... else if (char === ')' || char === ']' || char === '}') {
    go: [11, 15], // if closing, exists := brackets[char]; exists { ... if char == ')' || char == ']' || char == '}' {
  },

  stack_push: {
    javascript: [9], // stack.push(char);
    cpp: [15], // st.push(ch);
    python: [9], // stack.append(char)
    java: [14], // stack.push(ch);
    rust: [14], // stack.push(ch);
    typescript: [9], // stack.push(char);
    go: [12], // stack = append(stack, char)
  },

  stack_peek: {
    javascript: [15], // const top = stack.pop(); (this line also includes the pop, but peek happens conceptually first)
    cpp: [21, 22], // char top = st.top(); st.pop();
    python: [16], // top = stack.pop(); (again, peek is conceptual)
    java: [20], // char top = stack.pop(); (peek then pop combined)
    rust: [24], // let top = stack.pop().unwrap(); (peek then pop combined)
    typescript: [15], // const top: string = stack.pop()!; (peek then pop combined)
    go: [19, 20], // top := stack[len(stack)-1] stack = stack[:len(stack)-1]
  },

  stack_pop: {
    javascript: [15, 16], // const top = stack.pop(); if (brackets[top] !== char) return false;
    cpp: [21, 22, 23], // char top = st.top(); st.pop(); if (brackets[top] != ch) return false;
    python: [16, 17], // top = stack.pop() if brackets[top] != char: return False
    java: [20, 21], // char top = stack.pop(); if (!brackets.get(top).equals(ch)) return false;
    rust: [24, 25, 26, 27, 28], // let top = stack.pop().unwrap(); if brackets[&top] != ch { return false; }
    typescript: [15, 16], // const top: string = stack.pop()!; if (brackets[top] !== char) return false;
    go: [19, 20, 21, 22, 23], // top := stack[len(stack)-1] stack = stack[:len(stack)-1] if brackets[top] != char { return false }
  },

  validation_success: {
    javascript: [21], // return stack.length === 0;
    cpp: [26], // return st.empty();
    python: [20], // return len(stack) == 0
    java: [25], // return stack.isEmpty();
    rust: [33], // stack.is_empty()
    typescript: [21], // return stack.length === 0;
    go: [27], // return len(stack) == 0
  },

  validation_failure: {
    javascript: [13, 16], // if (stack.length === 0) return false; ... if (brackets[top] !== char) return false;
    cpp: [19, 23], // if (st.empty()) return false; ... if (brackets[top] != ch) return false;
    python: [13, 14, 17, 18], // if len(stack) == 0: return False ... if brackets[top] != char: return False
    java: [18, 21], // if (stack.isEmpty()) return false; ... if (!brackets.get(top).equals(ch)) return false;
    rust: [20, 21, 22, 25, 26, 27, 28], // if stack.is_empty() { return false; } ... if brackets[&top] != ch { return false; }
    typescript: [13, 16], // if (stack.length === 0) return false; ... if (brackets[top] !== char) return false;
    go: [16, 17, 18, 21, 22, 23], // if len(stack) == 0 { return false } ... if brackets[top] != char { return false }
  },
};

// register the mapping
export const BALANCED_PARENTHESES_ALGORITHM_ID = "balanced-parentheses";
