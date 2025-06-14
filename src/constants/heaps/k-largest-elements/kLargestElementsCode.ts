export const kLargestElementsCodes = {
  javascript: `// find k largest elements using min-heap
function findKLargest(nums, k) {
  // use min-heap to maintain k largest elements
  const minHeap = new MinHeap();
  
  for (let i = 0; i < nums.length; i++) {
    const current = nums[i];
    
    // if heap size < k, add element
    if (minHeap.size() < k) {
      minHeap.push(current);
    } 
    // if current > heap min, replace min with current
    else if (current > minHeap.peek()) {
      minHeap.pop();
      minHeap.push(current);
    }
  }
  
  // return k largest elements
  return minHeap.toArray().sort((a, b) => b - a);
}

class MinHeap {
  constructor() {
    this.heap = [];
  }
  
  push(val) {
    this.heap.push(val);
    this.heapifyUp(this.heap.length - 1);
  }
  
  pop() {
    if (this.heap.length === 0) return null;
    
    const min = this.heap[0];
    const last = this.heap.pop();
    
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown(0);
    }
    
    return min;
  }
  
  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }
  
  size() {
    return this.heap.length;
  }
  
  toArray() {
    return [...this.heap];
  }
  
  heapifyUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index] >= this.heap[parentIndex]) break;
      
      [this.heap[index], this.heap[parentIndex]] = 
        [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    }
  }
  
  heapifyDown(index) {
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let smallest = index;
      
      if (leftChild < this.heap.length && 
          this.heap[leftChild] < this.heap[smallest]) {
        smallest = leftChild;
      }
      
      if (rightChild < this.heap.length && 
          this.heap[rightChild] < this.heap[smallest]) {
        smallest = rightChild;
      }
      
      if (smallest === index) break;
      
      [this.heap[index], this.heap[smallest]] = 
        [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}`,

  cpp: `#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

vector<int> findKLargest(vector<int>& nums, int k) {
    // min-heap to maintain k largest elements
    priority_queue<int, vector<int>, greater<int>> minHeap;
    
    for (int i = 0; i < nums.size(); i++) {
        int current = nums[i];
        
        // if heap size < k, add element
        if (minHeap.size() < k) {
            minHeap.push(current);
        }
        // if current > heap min, replace min with current  
        else if (current > minHeap.top()) {
            minHeap.pop();
            minHeap.push(current);
        }
    }
    
    // extract k largest elements
    vector<int> result;
    while (!minHeap.empty()) {
        result.push_back(minHeap.top());
        minHeap.pop();
    }
    
    // sort in descending order
    sort(result.begin(), result.end(), greater<int>());
    return result;
}`,

  python: `import heapq

def find_k_largest(nums, k):
    """Find k largest elements using min-heap"""
    # min-heap to maintain k largest elements
    min_heap = []
    
    for i in range(len(nums)):
        current = nums[i]
        
        # if heap size < k, add element
        if len(min_heap) < k:
            heapq.heappush(min_heap, current)
        # if current > heap min, replace min with current
        elif current > min_heap[0]:
            heapq.heapreplace(min_heap, current)
    
    # return k largest elements in descending order
    return sorted(min_heap, reverse=True)

# alternative implementation with explicit pop/push
def find_k_largest_explicit(nums, k):
    min_heap = []
    
    for current in nums:
        if len(min_heap) < k:
            heapq.heappush(min_heap, current)
        elif current > min_heap[0]:
            heapq.heappop(min_heap)
            heapq.heappush(min_heap, current)
    
    return sorted(min_heap, reverse=True)`,

  java: `import java.util.*;

public class KLargestElements {
    public static List<Integer> findKLargest(int[] nums, int k) {
        // min-heap to maintain k largest elements
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        
        for (int i = 0; i < nums.length; i++) {
            int current = nums[i];
            
            // if heap size < k, add element
            if (minHeap.size() < k) {
                minHeap.offer(current);
            }
            // if current > heap min, replace min with current
            else if (current > minHeap.peek()) {
                minHeap.poll();
                minHeap.offer(current);
            }
        }
        
        // convert to list and sort in descending order
        List<Integer> result = new ArrayList<>(minHeap);
        Collections.sort(result, Collections.reverseOrder());
        return result;
    }
    
    // alternative with explicit size check
    public static List<Integer> findKLargestExplicit(int[] nums, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        
        for (int current : nums) {
            if (minHeap.size() < k) {
                minHeap.offer(current);
            } else if (current > minHeap.peek()) {
                minHeap.poll();
                minHeap.offer(current);
            }
        }
        
        List<Integer> result = new ArrayList<>(minHeap);
        Collections.sort(result, (a, b) -> b - a);
        return result;
    }
}`,

  rust: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn find_k_largest(nums: &[i32], k: usize) -> Vec<i32> {
    // min-heap using BinaryHeap with Reverse
    let mut min_heap: BinaryHeap<Reverse<i32>> = BinaryHeap::new();
    
    for &current in nums {
        // if heap size < k, add element
        if min_heap.len() < k {
            min_heap.push(Reverse(current));
        }
        // if current > heap min, replace min with current
        else if let Some(&Reverse(min_val)) = min_heap.peek() {
            if current > min_val {
                min_heap.pop();
                min_heap.push(Reverse(current));
            }
        }
    }
    
    // extract and sort in descending order
    let mut result: Vec<i32> = min_heap
        .into_iter()
        .map(|Reverse(val)| val)
        .collect();
    result.sort_by(|a, b| b.cmp(a));
    result
}

// alternative implementation with explicit checks
fn find_k_largest_explicit(nums: &[i32], k: usize) -> Vec<i32> {
    let mut min_heap = BinaryHeap::new();
    
    for (i, &current) in nums.iter().enumerate() {
        if min_heap.len() < k {
            min_heap.push(Reverse(current));
        } else if let Some(&Reverse(min_val)) = min_heap.peek() {
            if current > min_val {
                min_heap.pop();
                min_heap.push(Reverse(current));
            }
        }
    }
    
    let mut result: Vec<i32> = min_heap
        .into_iter()
        .map(|Reverse(val)| val)
        .collect();
    result.sort_unstable_by(|a, b| b.cmp(a));
    result
}`,

  typescript: `// find k largest elements using min-heap
function findKLargest(nums: number[], k: number): number[] {
  // use min-heap to maintain k largest elements
  const minHeap = new MinHeap<number>();
  
  for (let i = 0; i < nums.length; i++) {
    const current = nums[i];
    
    // if heap size < k, add element
    if (minHeap.size() < k) {
      minHeap.push(current);
    } 
    // if current > heap min, replace min with current
    else if (current > minHeap.peek()!) {
      minHeap.pop();
      minHeap.push(current);
    }
  }
  
  // return k largest elements
  return minHeap.toArray().sort((a, b) => b - a);
}

class MinHeap<T> {
  private heap: T[] = [];
  private compare: (a: T, b: T) => number;
  
  constructor(compareFunction?: (a: T, b: T) => number) {
    this.compare = compareFunction || ((a, b) => (a as any) - (b as any));
  }
  
  push(val: T): void {
    this.heap.push(val);
    this.heapifyUp(this.heap.length - 1);
  }
  
  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    
    const min = this.heap[0];
    const last = this.heap.pop()!;
    
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown(0);
    }
    
    return min;
  }
  
  peek(): T | undefined {
    return this.heap.length > 0 ? this.heap[0] : undefined;
  }
  
  size(): number {
    return this.heap.length;
  }
  
  toArray(): T[] {
    return [...this.heap];
  }
  
  private heapifyUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.compare(this.heap[index], this.heap[parentIndex]) >= 0) break;
      
      [this.heap[index], this.heap[parentIndex]] = 
        [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    }
  }
  
  private heapifyDown(index: number): void {
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let smallest = index;
      
      if (leftChild < this.heap.length && 
          this.compare(this.heap[leftChild], this.heap[smallest]) < 0) {
        smallest = leftChild;
      }
      
      if (rightChild < this.heap.length && 
          this.compare(this.heap[rightChild], this.heap[smallest]) < 0) {
        smallest = rightChild;
      }
      
      if (smallest === index) break;
      
      [this.heap[index], this.heap[smallest]] = 
        [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}`,

  go: `package main

import (
    "container/heap"
    "sort"
)

// MinHeap implements heap.Interface for integers
type MinHeap []int

func (h MinHeap) Len() int           { return len(h) }
func (h MinHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *MinHeap) Push(x interface{}) {
    *h = append(*h, x.(int))
}

func (h *MinHeap) Pop() interface{} {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[0 : n-1]
    return x
}

func (h MinHeap) Peek() int {
    if len(h) == 0 {
        return 0 // or handle error appropriately
    }
    return h[0]
}

// findKLargest finds k largest elements using min-heap
func findKLargest(nums []int, k int) []int {
    // min-heap to maintain k largest elements
    minHeap := &MinHeap{}
    heap.Init(minHeap)
    
    for i := 0; i < len(nums); i++ {
        current := nums[i]
        
        // if heap size < k, add element
        if minHeap.Len() < k {
            heap.Push(minHeap, current)
        } 
        // if current > heap min, replace min with current
        else if current > minHeap.Peek() {
            heap.Pop(minHeap)
            heap.Push(minHeap, current)
        }
    }
    
    // extract k largest elements
    result := make([]int, minHeap.Len())
    for i := 0; i < len(result); i++ {
        result[i] = heap.Pop(minHeap).(int)
    }
    
    // sort in descending order
    sort.Sort(sort.Reverse(sort.IntSlice(result)))
    return result
}

// alternative implementation
func findKLargestAlternative(nums []int, k int) []int {
    minHeap := &MinHeap{}
    heap.Init(minHeap)
    
    for _, current := range nums {
        if minHeap.Len() < k {
            heap.Push(minHeap, current)
        } else if current > minHeap.Peek() {
            heap.Pop(minHeap)
            heap.Push(minHeap, current)
        }
    }
    
    result := make([]int, 0, k)
    for minHeap.Len() > 0 {
        result = append(result, heap.Pop(minHeap).(int))
    }
    
    // reverse to get descending order
    for i, j := 0, len(result)-1; i < j; i, j = i+1, j-1 {
        result[i], result[j] = result[j], result[i]
    }
    
    return result
}`,
};
