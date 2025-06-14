import type { AlgorithmLineMapping } from "@/types/algorithm";

export const minCostLineMapping: AlgorithmLineMapping = {
  initialization: {
    javascript: [1], // function minCostToMakeArraySizeOne(arr) {
    cpp: [4], // int minCostToMakeArraySizeOne(vector<int>& arr) {
    python: [1], // def min_cost_to_make_array_size_one(arr):
    java: [4], // public static int minCostToMakeArraySizeOne(int[] arr) {
    rust: [1], // fn min_cost_to_make_array_size_one(arr: &[i32]) -> i32 {
    typescript: [1], // function minCostToMakeArraySizeOne(arr: number[]): number {
    go: [7], // func minCostToMakeArraySizeOne(arr []int) int {
  },

  base_case_check: {
    javascript: [2, 3, 4], // if (arr.length <= 1) { return 0; }
    cpp: [5, 6, 7], // if (arr.size() <= 1) { return 0; }
    python: [2, 3], // if len(arr) <= 1: return 0
    java: [5, 6, 7], // if (arr.length <= 1) { return 0; }
    rust: [2, 3, 4], // if arr.len() <= 1 { return 0; }
    typescript: [2, 3, 4], // if (arr.length <= 1) { return 0; }
    go: [8, 9, 10], // if len(arr) <= 1 { return 0 }
  },

  greedy_insight: {
    javascript: [7], // const minElement = Math.min(...arr);
    cpp: [10], // int minElement = *min_element(arr.begin(), arr.end());
    python: [6], // min_element = min(arr)
    java: [10], // int minElement = Arrays.stream(arr).min().getAsInt();
    rust: [7], // let min_element = *arr.iter().min().unwrap();
    typescript: [7], // const minElement: number = Math.min(...arr);
    go: [13, 14, 15, 16, 17, 18], // minElement calculation loop
  },

  formula_derivation: {
    javascript: [11], // const totalCost = (arr.length - 1) * minElement;
    cpp: [13], // int totalCost = (arr.size() - 1) * minElement;
    python: [9], // total_cost = (len(arr) - 1) * min_element
    java: [13], // int totalCost = (arr.length - 1) * minElement;
    rust: [10], // let total_cost = (arr.len() - 1) as i32 * min_element;
    typescript: [10], // const totalCost: number = (arr.length - 1) * minElement;
    go: [21], // totalCost := (len(arr) - 1) * minElement
  },

  decision_tree: {
    javascript: [7, 11], // decision making lines - min element identification and cost calculation
    cpp: [10, 13], // decision making lines
    python: [6, 9], // decision making lines
    java: [10, 13], // decision making lines
    rust: [7, 10], // decision making lines
    typescript: [7, 10], // decision making lines
    go: [13, 14, 15, 16, 17, 18, 21], // decision making lines
  },

  greedy_selection: {
    javascript: [7], // const minElement = Math.min(...arr);
    cpp: [10], // int minElement = *min_element(arr.begin(), arr.end());
    python: [6], // min_element = min(arr)
    java: [10], // int minElement = Arrays.stream(arr).min().getAsInt();
    rust: [7], // let min_element = *arr.iter().min().unwrap();
    typescript: [7], // const minElement: number = Math.min(...arr);
    go: [13, 14, 15, 16, 17, 18], // minElement calculation loop
  },

  cost_calculation: {
    javascript: [11], // const totalCost = (arr.length - 1) * minElement;
    cpp: [13], // int totalCost = (arr.size() - 1) * minElement;
    python: [9], // total_cost = (len(arr) - 1) * min_element
    java: [13], // int totalCost = (arr.length - 1) * minElement;
    rust: [10], // let total_cost = (arr.len() - 1) as i32 * min_element;
    typescript: [10], // const totalCost: number = (arr.length - 1) * minElement;
    go: [21], // totalCost := (len(arr) - 1) * minElement
  },

  pair_comparison: {
    javascript: [7, 11], // conceptually where we would compare pairs
    cpp: [10, 13], // conceptually where we would compare pairs
    python: [6, 9], // conceptually where we would compare pairs
    java: [10, 13], // conceptually where we would compare pairs
    rust: [7, 10], // conceptually where we would compare pairs
    typescript: [7, 10], // conceptually where we would compare pairs
    go: [13, 14, 15, 16, 17, 18, 21], // conceptually where we would compare pairs
  },

  element_removal: {
    javascript: [11], // conceptually where removal happens
    cpp: [13], // conceptually where removal happens
    python: [9], // conceptually where removal happens
    java: [13], // conceptually where removal happens
    rust: [10], // conceptually where removal happens
    typescript: [10], // conceptually where removal happens
    go: [21], // conceptually where removal happens
  },

  optimality_proof: {
    javascript: [13], // return totalCost;
    cpp: [15], // return totalCost;
    python: [11], // return total_cost
    java: [15], // return totalCost;
    rust: [12], // total_cost
    typescript: [12], // return totalCost;
    go: [23], // return totalCost
  },

  return: {
    javascript: [13], // return totalCost;
    cpp: [15], // return totalCost;
    python: [11], // return total_cost
    java: [15], // return totalCost;
    rust: [12], // total_cost
    typescript: [12], // return totalCost;
    go: [23], // return totalCost
  },
};

// register the mapping
export const MIN_COST_ALGORITHM_ID = "min-cost-array";
