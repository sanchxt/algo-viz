import type { AlgorithmLineMapping } from "@/types/algorithm";

export const linearSearchLineMapping: AlgorithmLineMapping = {
  initialization: {
    javascript: [2], // for (let i = 0; i < arr.length; i++) {
    cpp: [5], // for (int i = 0; i < n; i++) {
    python: [2], // for i in range(len(arr)):
    java: [3], // for (int i = 0; i < arr.length; i++) {
    rust: [2], // for (i, &element) in arr.iter().enumerate() {
    typescript: [2], // for (let i: number = 0; i < arr.length; i++) {
    go: [4], // for i := 0; i < len(arr); i++ {
  },

  loop_start: {
    javascript: [2], // for (let i = 0; i < arr.length; i++) {
    cpp: [5], // for (int i = 0; i < n; i++) {
    python: [2], // for i in range(len(arr)):
    java: [3], // for (int i = 0; i < arr.length; i++) {
    rust: [2], // for (i, &element) in arr.iter().enumerate() {
    typescript: [2], // for (let i: number = 0; i < arr.length; i++) {
    go: [4], // for i := 0; i < len(arr); i++ {
  },

  comparison: {
    javascript: [3], // if (arr[i] === target) {
    cpp: [6], // if (arr[i] == target) {
    python: [3], // if arr[i] == target:
    java: [4], // if (arr[i] == target) {
    rust: [3], // if element == target {
    typescript: [3], // if (arr[i] === target) {
    go: [5], // if arr[i] == target {
  },

  assignment: {
    javascript: [2], // Back to loop condition (continue iteration)
    cpp: [5], // Back to loop condition (continue iteration)
    python: [2], // Back to loop condition (continue iteration)
    java: [3], // Back to loop condition (continue iteration)
    rust: [2], // Back to loop condition (continue iteration)
    typescript: [2], // Back to loop condition (continue iteration)
    go: [4], // Back to loop condition (continue iteration)
  },

  return_found: {
    javascript: [4], // return i;
    cpp: [7], // return i;
    python: [4], // return i
    java: [5], // return i;
    rust: [4], // return Some(i);
    typescript: [4], // return i;
    go: [6], // return i
  },

  return_not_found: {
    javascript: [7], // return -1;
    cpp: [10], // return -1;
    python: [5], // return -1
    java: [8], // return -1;
    rust: [7], // None
    typescript: [7], // return -1;
    go: [9], // return -1
  },

  return: {
    javascript: [4, 7], // return i; return -1; (covers both cases)
    cpp: [7, 10], // return i; return -1; (covers both cases)
    python: [4, 6], // return i; return -1 (covers both cases)
    java: [5, 8], // return i; return -1; (covers both cases)
    rust: [4, 7], // return Some(i); None (covers both cases)
    typescript: [4, 7], // return i; return -1; (covers both cases)
    go: [6, 9], // return i; return -1 (covers both cases)
  },
};

// register the mapping
export const LINEAR_SEARCH_ALGORITHM_ID = "linear-search";
