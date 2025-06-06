import type { AlgorithmLineMapping } from "@/types/algorithm";

export const twoSumLineMapping: AlgorithmLineMapping = {
  initialization: {
    javascript: [3, 4], // const sortedWithIndices = nums.map((num, idx) => [num, idx]).sort((a, b) => a[0] - b[0]);
    cpp: [6, 7, 8, 9], // vector<pair<int, int>> sortedWithIndices; for loop; sort
    python: [2, 3], // sorted_with_indices = sorted((num, idx) for idx, num in enumerate(nums))
    java: [4, 5, 6, 7, 8], // int[][] sortedWithIndices declaration, for loop, Arrays.sort
    rust: [2, 3, 4, 5], // let mut sorted_with_indices creation and sorting
    typescript: [3, 4], // const sortedWithIndices creation and sorting
    go: [8, 9, 10, 11, 12, 13, 14, 15], // sortedWithIndices creation, for loop, and sorting
  },

  pointer_initialization: {
    javascript: [6, 7], // let left = 0; let right = sortedWithIndices.length - 1;
    cpp: [12, 13], // int left = 0; int right = sortedWithIndices.size() - 1;
    python: [5, 6], // left = 0; right = len(sorted_with_indices) - 1
    java: [12, 13], // int left = 0; int right = sortedWithIndices.length - 1;
    rust: [9, 10], // let mut left = 0; let mut right = sorted_with_indices.len() - 1;
    typescript: [7, 8], // let left: number = 0; let right: number = sortedWithIndices.length - 1;
    go: [18, 19], // left := 0; right := len(sortedWithIndices) - 1
  },

  loop_condition: {
    javascript: [9], // while (left < right) {
    cpp: [14], // while (left < right) {
    python: [8], // while left < right:
    java: [13], // while (left < right) {
    rust: [10], // while left < right {
    typescript: [9], // while (left < right) {
    go: [20], // for left < right {
  },

  comparison: {
    javascript: [10, 12], // const currentSum = ...; if (currentSum === target)
    cpp: [16, 18], // int currentSum = ...; if (currentSum == target)
    python: [9, 11], // current_sum = ...; if current_sum == target
    java: [16, 18], // int currentSum = ...; if (currentSum == target)
    rust: [13, 15], // let current_sum = ...; if current_sum == target
    typescript: [11, 13], // const currentSum: number = ...; if (currentSum === target)
    go: [22, 24], // currentSum := ...; if currentSum == target
  },

  pointer_move_left: {
    javascript: [15], // left++;
    cpp: [21], // left++;
    python: [14], // left += 1
    java: [21], // left++;
    rust: [18], // left += 1;
    typescript: [16], // left++;
    go: [27], // left++
  },

  pointer_move_right: {
    javascript: [17], // right--;
    cpp: [23], // right--;
    python: [16], // right -= 1
    java: [23], // right--;
    rust: [20], // right -= 1;
    typescript: [18], // right--;
    go: [29], // right--
  },

  return_found: {
    javascript: [13], // return [sortedWithIndices[left][1], sortedWithIndices[right][1]];
    cpp: [19], // return {sortedWithIndices[left].second, sortedWithIndices[right].second};
    python: [12], // return [sorted_with_indices[left][1], sorted_with_indices[right][1]]
    java: [19], // return new int[]{sortedWithIndices[left][1], sortedWithIndices[right][1]};
    rust: [16], // return vec![sorted_with_indices[left].1 as i32, sorted_with_indices[right].1 as i32];
    typescript: [14], // return [sortedWithIndices[left][1], sortedWithIndices[right][1]];
    go: [25], // return []int{sortedWithIndices[left].index, sortedWithIndices[right].index}
  },

  return_not_found: {
    javascript: [21], // return [];
    cpp: [27], // return {};
    python: [18], // return []
    java: [27], // return new int[]{};
    rust: [24], // vec![]
    typescript: [22], // return [];
    go: [33], // return []int{}
  },
};

// register the mapping
export const TWO_SUM_ALGORITHM_ID = "two-sum";
