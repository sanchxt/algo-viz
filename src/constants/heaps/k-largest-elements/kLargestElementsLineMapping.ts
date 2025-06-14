import type { AlgorithmLineMapping } from "@/types/algorithm";

export const kLargestElementsLineMapping: AlgorithmLineMapping = {
  heap_initialization: {
    javascript: [3], // const minHeap = new MinHeap();
    cpp: [5], // priority_queue<int, vector<int>, greater<int>> minHeap;
    python: [5], // min_heap = []
    java: [5], // PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    rust: [4], // let mut min_heap: BinaryHeap<Reverse<i32>> = BinaryHeap::new();
    typescript: [3], // const minHeap = new MinHeap<number>();
    go: [30, 31], // minHeap := &MinHeap{} heap.Init(minHeap)
  },

  loop_start: {
    javascript: [5], // for (let i = 0; i < nums.length; i++) {
    cpp: [7], // for (int i = 0; i < nums.size(); i++) {
    python: [7], // for i in range(len(nums)):
    java: [7], // for (int i = 0; i < nums.length; i++) {
    rust: [6], // for &current in nums {
    typescript: [5], // for (let i = 0; i < nums.length; i++) {
    go: [33], // for i := 0; i < len(nums); i++ {
  },

  comparison: {
    javascript: [6], // const current = nums[i];
    cpp: [8], // int current = nums[i];
    python: [8], // current = nums[i]
    java: [8], // int current = nums[i];
    rust: [6], // for &current in nums {
    typescript: [6], // const current = nums[i];
    go: [34], // current := nums[i]
  },

  heap_size_check: {
    javascript: [9], // if (minHeap.size() < k) {
    cpp: [11], // if (minHeap.size() < k) {
    python: [11], // if len(min_heap) < k:
    java: [11], // if (minHeap.size() < k) {
    rust: [8], // if min_heap.len() < k {
    typescript: [9], // if (minHeap.size() < k) {
    go: [37], // if minHeap.Len() < k {
  },

  heap_push: {
    javascript: [10], // minHeap.push(current);
    cpp: [12], // minHeap.push(current);
    python: [12], // heapq.heappush(min_heap, current)
    java: [12], // minHeap.offer(current);
    rust: [9], // min_heap.push(Reverse(current));
    typescript: [10], // minHeap.push(current);
    go: [38], // heap.Push(minHeap, current)
  },

  heap_compare: {
    javascript: [13], // else if (current > minHeap.peek()) {
    cpp: [15], // else if (current > minHeap.top()) {
    python: [15], // elif current > min_heap[0]:
    java: [15], // else if (current > minHeap.peek()) {
    rust: [12], // if current > min_val {
    typescript: [13], // else if (current > minHeap.peek()!) {
    go: [41], // else if current > minHeap.Peek() {
  },

  heap_pop: {
    javascript: [14], // minHeap.pop();
    cpp: [16], // minHeap.pop();
    python: [16], // heapq.heapreplace(min_heap, current)
    java: [16], // minHeap.poll();
    rust: [13], // min_heap.pop();
    typescript: [14], // minHeap.pop();
    go: [42], // heap.Pop(minHeap)
  },

  heap_maintain_size: {
    javascript: [14, 15], // minHeap.pop(); minHeap.push(current);
    cpp: [16, 17], // minHeap.pop(); minHeap.push(current);
    python: [16], // heapq.heapreplace(min_heap, current)
    java: [16, 17], // minHeap.poll(); minHeap.offer(current);
    rust: [13, 14], // min_heap.pop(); min_heap.push(Reverse(current));
    typescript: [14, 15], // minHeap.pop(); minHeap.push(current);
    go: [42, 43], // heap.Pop(minHeap) heap.Push(minHeap, current)
  },

  heap_peek: {
    javascript: [46], // return this.heap.length > 0 ? this.heap[0] : null;
    cpp: [16], // minHeap.top()
    python: [15], // min_heap[0]
    java: [15], // minHeap.peek()
    rust: [12], // min_heap.peek()
    typescript: [82], // return this.heap.length > 0 ? this.heap[0] : undefined;
    go: [24], // return h[0]
  },

  return: {
    javascript: [20], // return minHeap.toArray().sort((a, b) => b - a);
    cpp: [27], // return result;
    python: [19], // return sorted(min_heap, reverse=True)
    java: [23], // return result;
    rust: [26], // result
    typescript: [20], // return minHeap.toArray().sort((a, b) => b - a);
    go: [55], // return result
  },

  heap_result_found: {
    javascript: [20], // return minHeap.toArray().sort((a, b) => b - a);
    cpp: [21, 27], // extract elements and return result
    python: [19], // return sorted(min_heap, reverse=True)
    java: [21, 23], // convert to list and return
    rust: [21, 26], // extract and sort, return result
    typescript: [20], // return minHeap.toArray().sort((a, b) => b - a);
    go: [48, 55], // extract elements and return
  },
};

// register the mapping
export const K_LARGEST_ELEMENTS_ALGORITHM_ID = "k-largest-elements";
