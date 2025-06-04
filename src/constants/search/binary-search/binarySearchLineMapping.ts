import type { AlgorithmLineMapping } from "@/types/algorithm";

export const binarySearchLineMapping: AlgorithmLineMapping = {
  initialization: {
    javascript: [2, 3], // let left = 0; let right = arr.length - 1;
    cpp: [5, 6], // int left = 0; int right = n - 1;
    python: [2, 3], // left = 0; right = len(arr) - 1
    java: [3, 4], // int left = 0; int right = arr.length - 1;
    rust: [2, 3], // let mut left = 0; let mut right = arr.len() - 1;
    typescript: [2, 3], // let left: number = 0; let right: number = arr.length - 1;
    go: [4, 5], // left := 0; right := len(arr) - 1
  },

  loop_condition: {
    javascript: [5], // while (left <= right) {
    cpp: [8], // while (left <= right) {
    python: [5], // while left <= right:
    java: [6], // while (left <= right) {
    rust: [5], // while left <= right {
    typescript: [5], // while (left <= right) {
    go: [7], // for left <= right {
  },

  comparison: {
    javascript: [6, 8, 10], // const mid = Math.floor((left + right) / 2); if (arr[mid] === target); else if (arr[mid] < target)
    cpp: [9, 11, 13], // int mid = left + (right - left) / 2; if (arr[mid] == target); else if (arr[mid] < target)
    python: [6, 8, 10], // mid = (left + right) // 2; if arr[mid] == target; elif arr[mid] < target
    java: [7, 9, 11], // int mid = left + (right - left) / 2; if (arr[mid] == target); else if (arr[mid] < target)
    rust: [6, 8, 10], // let mid = left + (right - left) / 2; if arr[mid] == target; else if arr[mid] < target
    typescript: [6, 8, 10], // const mid: number = Math.floor((left + right) / 2); if (arr[mid] === target); else if (arr[mid] < target)
    go: [8, 10, 12], // mid := left + (right-left)/2; if arr[mid] == target; else if arr[mid] < target
  },

  assignment: {
    javascript: [9, 11], // left = mid + 1; right = mid - 1;
    cpp: [14, 16], // left = mid + 1; right = mid - 1;
    python: [11, 13], // left = mid + 1; right = mid - 1
    java: [12, 14], // left = mid + 1; right = mid - 1;
    rust: [11, 14], // left = mid + 1; right = mid - 1;
    typescript: [9, 11], // left = mid + 1; right = mid - 1;
    go: [13, 15], // left = mid + 1; right = mid - 1
  },

  return: {
    javascript: [9, 15], // return mid; return -1; (fallback for both)
    cpp: [12, 19], // return mid; return -1; (fallback for both)
    python: [9, 15], // return mid; return -1 (fallback for both)
    java: [10, 17], // return mid; return -1; (fallback for both)
    rust: [9, 18], // return Some(mid); None (fallback for both)
    typescript: [9, 15], // return mid; return -1; (fallback for both)
    go: [11, 18], // return mid; return -1 (fallback for both)
  },

  // specific return cases based on found/not found
  return_found: {
    javascript: [9], // return mid;
    cpp: [12], // return mid;
    python: [9], // return mid
    java: [10], // return mid;
    rust: [9], // return Some(mid);
    typescript: [9], // return mid;
    go: [11], // return mid
  },

  return_not_found: {
    javascript: [15], // return -1;
    cpp: [19], // return -1;
    python: [15], // return -1
    java: [17], // return -1;
    rust: [18], // None
    typescript: [15], // return -1;
    go: [18], // return -1
  },
};

// register the mapping
export const BINARY_SEARCH_ALGORITHM_ID = "binary-search";
