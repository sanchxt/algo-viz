import type { AlgorithmLineMapping } from "../types/algorithm";

export const bubbleSortLineMapping: AlgorithmLineMapping = {
  initialization: {
    javascript: [2], // const n = arr.length;
    cpp: [4], // void bubbleSort(int arr[], int n) {
  },

  loop_start_outer: {
    javascript: [4], // for (let i = 0; i < n - 1; i++) {
    cpp: [5], // for (int i = 0; i < n - 1; i++) {
  },

  loop_start_inner: {
    javascript: [6], // for (let j = 0; j < n - i - 1; j++) {
    cpp: [7], // for (int j = 0; j < n - i - 1; j++) {
  },

  comparison: {
    javascript: [7], // if (arr[j] > arr[j + 1]) {
    cpp: [8], // if (arr[j] > arr[j + 1]) {
  },

  swap: {
    javascript: [8], // [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    cpp: [9, 10, 11], // int temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp;
  },

  no_swap: {
    javascript: [7], // Back to the if condition (no swap needed)
    cpp: [8], // Back to the if condition (no swap needed)
  },

  pass_complete: {
    javascript: [4], // Back to outer loop
    cpp: [5], // Back to outer loop
  },

  return: {
    javascript: [15], // return arr;
    cpp: [16], // } (end of function)
  },
};

// register the mapping
export const BUBBLE_SORT_ALGORITHM_ID = "bubble-sort";
