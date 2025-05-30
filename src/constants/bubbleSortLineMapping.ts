import type { AlgorithmLineMapping } from "../types/algorithm";

export const bubbleSortLineMapping: AlgorithmLineMapping = {
  initialization: {
    javascript: [2], // const n = arr.length;
    cpp: [4], // void bubbleSort(int arr[], int n) {
    python: [2], // n = len(arr)
    java: [3], // int n = arr.length;
    rust: [2], // let n = arr.len();
    typescript: [2], // const n: number = arr.length;
    go: [4], // n := len(arr)
  },

  loop_start_outer: {
    javascript: [4], // for (let i = 0; i < n - 1; i++) {
    cpp: [5], // for (int i = 0; i < n - 1; i++) {
    python: [4], // for i in range(n - 1):
    java: [5], // for (int i = 0; i < n - 1; i++) {
    rust: [4], // for i in 0..n-1 {
    typescript: [4], // for (let i: number = 0; i < n - 1; i++) {
    go: [6], // for i := 0; i < n-1; i++ {
  },

  loop_start_inner: {
    javascript: [6], // for (let j = 0; j < n - i - 1; j++) {
    cpp: [7], // for (int j = 0; j < n - i - 1; j++) {
    python: [6], // for j in range(n - i - 1):
    java: [7], // for (int j = 0; j < n - i - 1; j++) {
    rust: [6], // for j in 0..n-i-1 {
    typescript: [6], // for (let j: number = 0; j < n - i - 1; j++) {
    go: [8], // for j := 0; j < n-i-1; j++ {
  },

  comparison: {
    javascript: [7], // if (arr[j] > arr[j + 1]) {
    cpp: [8], // if (arr[j] > arr[j + 1]) {
    python: [7], // if arr[j] > arr[j + 1]:
    java: [8], // if (arr[j] > arr[j + 1]) {
    rust: [7], // if arr[j] > arr[j + 1] {
    typescript: [7], // if (arr[j] > arr[j + 1]) {
    go: [9], // if arr[j] > arr[j+1] {
  },

  swap: {
    javascript: [8], // [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    cpp: [9, 10, 11], // int temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp;
    python: [8], // arr[j], arr[j + 1] = arr[j + 1], arr[j]
    java: [9, 10, 11], // int temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp;
    rust: [8], // arr.swap(j, j + 1);
    typescript: [8], // [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    go: [10], // arr[j], arr[j+1] = arr[j+1], arr[j]
  },

  no_swap: {
    javascript: [7], // Back to the if condition (no swap needed)
    cpp: [8], // Back to the if condition (no swap needed)
    python: [7], // Back to the if condition (no swap needed)
    java: [8], // Back to the if condition (no swap needed)
    rust: [7], // Back to the if condition (no swap needed)
    typescript: [7], // Back to the if condition (no swap needed)
    go: [9], // Back to the if condition (no swap needed)
  },

  pass_complete: {
    javascript: [4], // Back to outer loop
    cpp: [5], // Back to outer loop
    python: [4], // Back to outer loop
    java: [5], // Back to outer loop
    rust: [4], // Back to outer loop
    typescript: [4], // Back to outer loop
    go: [6], // Back to outer loop
  },

  return: {
    javascript: [15], // return arr;
    cpp: [16], // } (end of function)
    python: [13], // return arr
    java: [16], // } (end of method)
    rust: [15], // } (end of function)
    typescript: [15], // return arr;
    go: [16], // } (end of function)
  },
};

// register the mapping
export const BUBBLE_SORT_ALGORITHM_ID = "bubble-sort";
