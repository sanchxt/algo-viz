export const minCostCodes = {
  javascript: `function minCostToMakeArraySizeOne(arr) {
  // base case: if array has 1 or fewer elements
  if (arr.length <= 1) {
    return 0;
  }
  
  // find the minimum element in the array
  const minElement = Math.min(...arr);
  
  // greedy approach: use minimum element to remove all others
  // cost = (number of operations) × (minimum element)
  const totalCost = (arr.length - 1) * minElement;
  
  return totalCost;
}

// example usage
const array = [3, 1, 4, 2];
console.log(minCostToMakeArraySizeOne(array)); // output: 3`,

  cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int minCostToMakeArraySizeOne(vector<int>& arr) {
    // base case: if array has 1 or fewer elements
    if (arr.size() <= 1) {
        return 0;
    }
    
    // find the minimum element in the array
    int minElement = *min_element(arr.begin(), arr.end());
    
    // greedy approach: use minimum element to remove all others
    // cost = (number of operations) × (minimum element)
    int totalCost = (arr.size() - 1) * minElement;
    
    return totalCost;
}

int main() {
    vector<int> arr = {3, 1, 4, 2};
    cout << "Minimum cost: " << minCostToMakeArraySizeOne(arr) << endl;
    return 0;
}`,

  python: `def min_cost_to_make_array_size_one(arr):
    # base case: if array has 1 or fewer elements
    if len(arr) <= 1:
        return 0
    
    # find the minimum element in the array
    min_element = min(arr)
    
    # greedy approach: use minimum element to remove all others
    # cost = (number of operations) × (minimum element)
    total_cost = (len(arr) - 1) * min_element
    
    return total_cost

# example usage
if __name__ == "__main__":
    array = [3, 1, 4, 2]
    result = min_cost_to_make_array_size_one(array)
    print(f"Minimum cost: {result}")`,

  java: `import java.util.Arrays;

public class MinCostArray {
    public static int minCostToMakeArraySizeOne(int[] arr) {
        // base case: if array has 1 or fewer elements
        if (arr.length <= 1) {
            return 0;
        }
        
        // find the minimum element in the array
        int minElement = Arrays.stream(arr).min().getAsInt();
        
        // greedy approach: use minimum element to remove all others
        // cost = (number of operations) × (minimum element)
        int totalCost = (arr.length - 1) * minElement;
        
        return totalCost;
    }
    
    public static void main(String[] args) {
        int[] arr = {3, 1, 4, 2};
        int result = minCostToMakeArraySizeOne(arr);
        System.out.println("Minimum cost: " + result);
    }
}`,

  rust: `fn min_cost_to_make_array_size_one(arr: &[i32]) -> i32 {
    // base case: if array has 1 or fewer elements
    if arr.len() <= 1 {
        return 0;
    }
    
    // find the minimum element in the array
    let min_element = *arr.iter().min().unwrap();
    
    // greedy approach: use minimum element to remove all others
    // cost = (number of operations) × (minimum element)
    let total_cost = (arr.len() - 1) as i32 * min_element;
    
    total_cost
}

fn main() {
    let arr = [3, 1, 4, 2];
    let result = min_cost_to_make_array_size_one(&arr);
    println!("Minimum cost: {}", result);
}`,

  typescript: `function minCostToMakeArraySizeOne(arr: number[]): number {
    // base case: if array has 1 or fewer elements
    if (arr.length <= 1) {
        return 0;
    }
    
    // find the minimum element in the array
    const minElement: number = Math.min(...arr);
    
    // greedy approach: use minimum element to remove all others
    // cost = (number of operations) × (minimum element)
    const totalCost: number = (arr.length - 1) * minElement;
    
    return totalCost;
}

// example usage
const array: number[] = [3, 1, 4, 2];
console.log(\`Minimum cost: \${minCostToMakeArraySizeOne(array)}\`);`,

  go: `package main

import (
    "fmt"
    "math"
)

func minCostToMakeArraySizeOne(arr []int) int {
    // base case: if array has 1 or fewer elements
    if len(arr) <= 1 {
        return 0
    }
    
    // find the minimum element in the array
    minElement := math.MaxInt32
    for _, num := range arr {
        if num < minElement {
            minElement = num
        }
    }
    
    // greedy approach: use minimum element to remove all others
    // cost = (number of operations) × (minimum element)
    totalCost := (len(arr) - 1) * minElement
    
    return totalCost
}

func main() {
    arr := []int{3, 1, 4, 2}
    result := minCostToMakeArraySizeOne(arr)
    fmt.Printf("Minimum cost: %d\\n", result)
}`,
};
