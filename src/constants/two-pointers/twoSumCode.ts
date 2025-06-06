export const twoSumCodes = {
  javascript: `function twoSum(nums, target) {
  // Sort array while keeping track of original indices
  const sortedWithIndices = nums.map((num, idx) => [num, idx])
                               .sort((a, b) => a[0] - b[0]);
  
  let left = 0;
  let right = sortedWithIndices.length - 1;
  
  while (left < right) {
    const currentSum = sortedWithIndices[left][0] + sortedWithIndices[right][0];
    
    if (currentSum === target) {
      return [sortedWithIndices[left][1], sortedWithIndices[right][1]];
    } else if (currentSum < target) {
      left++;
    } else {
      right--;
    }
  }
  
  return [];
}`,

  cpp: `#include <vector>
#include <algorithm>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    vector<pair<int, int>> sortedWithIndices;
    for (int i = 0; i < nums.size(); i++) {
        sortedWithIndices.push_back({nums[i], i});
    }
    sort(sortedWithIndices.begin(), sortedWithIndices.end());
    
    int left = 0;
    int right = sortedWithIndices.size() - 1;
    
    while (left < right) {
        int currentSum = sortedWithIndices[left].first + sortedWithIndices[right].first;
        
        if (currentSum == target) {
            return {sortedWithIndices[left].second, sortedWithIndices[right].second};
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return {};
}`,

  python: `def two_sum(nums, target):
    # Create list of (value, original_index) pairs and sort by value
    sorted_with_indices = sorted((num, idx) for idx, num in enumerate(nums))
    
    left = 0
    right = len(sorted_with_indices) - 1
    
    while left < right:
        current_sum = sorted_with_indices[left][0] + sorted_with_indices[right][0]
        
        if current_sum == target:
            return [sorted_with_indices[left][1], sorted_with_indices[right][1]]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return []`,

  java: `import java.util.*;

public class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        int[][] sortedWithIndices = new int[nums.length][2];
        for (int i = 0; i < nums.length; i++) {
            sortedWithIndices[i][0] = nums[i];
            sortedWithIndices[i][1] = i;
        }
        Arrays.sort(sortedWithIndices, (a, b) -> a[0] - b[0]);
        
        int left = 0;
        int right = sortedWithIndices.length - 1;
        
        while (left < right) {
            int currentSum = sortedWithIndices[left][0] + sortedWithIndices[right][0];
            
            if (currentSum == target) {
                return new int[]{sortedWithIndices[left][1], sortedWithIndices[right][1]};
            } else if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }
        
        return new int[]{};
    }
}`,

  rust: `fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
    let mut sorted_with_indices: Vec<(i32, usize)> = nums
        .iter()
        .enumerate()
        .map(|(idx, &num)| (num, idx))
        .collect();
    sorted_with_indices.sort_by_key(|&(num, _)| num);
    
    let mut left = 0;
    let mut right = sorted_with_indices.len() - 1;
    
    while left < right {
        let current_sum = sorted_with_indices[left].0 + sorted_with_indices[right].0;
        
        if current_sum == target {
            return vec![sorted_with_indices[left].1 as i32, sorted_with_indices[right].1 as i32];
        } else if current_sum < target {
            left += 1;
        } else {
            right -= 1;
        }
    }
    
    vec![]
}`,

  typescript: `function twoSum(nums: number[], target: number): number[] {
    // Sort array while keeping track of original indices
    const sortedWithIndices: [number, number][] = nums
        .map((num, idx) => [num, idx] as [number, number])
        .sort((a, b) => a[0] - b[0]);
    
    let left: number = 0;
    let right: number = sortedWithIndices.length - 1;
    
    while (left < right) {
        const currentSum: number = sortedWithIndices[left][0] + sortedWithIndices[right][0];
        
        if (currentSum === target) {
            return [sortedWithIndices[left][1], sortedWithIndices[right][1]];
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return [];
}`,

  go: `package main

func twoSum(nums []int, target int) []int {
    type Pair struct {
        value int
        index int
    }
    
    sortedWithIndices := make([]Pair, len(nums))
    for i, num := range nums {
        sortedWithIndices[i] = Pair{num, i}
    }
    
    sort.Slice(sortedWithIndices, func(i, j int) bool {
        return sortedWithIndices[i].value < sortedWithIndices[j].value
    })
    
    left := 0
    right := len(sortedWithIndices) - 1
    
    for left < right {
        currentSum := sortedWithIndices[left].value + sortedWithIndices[right].value
        
        if currentSum == target {
            return []int{sortedWithIndices[left].index, sortedWithIndices[right].index}
        } else if currentSum < target {
            left++
        } else {
            right--
        }
    }
    
    return []int{}
}`,
};
