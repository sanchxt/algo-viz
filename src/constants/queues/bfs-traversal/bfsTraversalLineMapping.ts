import type { AlgorithmLineMapping } from "@/types/algorithm";

export const bfsTraversalLineMapping: AlgorithmLineMapping = {
  initialization: {
    javascript: [9, 10, 11, 12], // if (root === null) { return []; } const result = []; const queue = [root];
    cpp: [11, 12, 13, 14, 15, 16, 17], // vector<int> result; if (root == nullptr) { return result; } queue<TreeNode*> q; q.push(root);
    python: [8, 9, 10, 11, 12], // if root is None: return [] result = [] queue = deque([root])
    java: [11, 12, 13, 14, 15, 16, 17], // List<Integer> result = new ArrayList<>(); if (root == null) { return result; } Queue<TreeNode> queue = new LinkedList<>(); queue.offer(root);
    rust: [25, 26, 27, 28, 29, 30, 31], // let mut result = Vec::new(); if root.is_none() { return result; } let mut queue = VecDeque::new(); queue.push_back(root.unwrap());
    typescript: [9, 10, 11, 12, 13, 14], // if (root === null) { return []; } const result: number[] = []; const queue: TreeNode[] = [root];
    go: [10, 11, 12, 13, 14, 15, 16], // var result []int if root == nil { return result } queue := []*TreeNode{root}
  },

  queue_peek: {
    javascript: [15, 16], // while (queue.length > 0) { const node = queue.shift();
    cpp: [20, 21, 22], // while (!q.empty()) { TreeNode* node = q.front(); q.pop();
    python: [15, 16], // while queue: node = queue.popleft()
    java: [20, 21], // while (!queue.isEmpty()) { TreeNode node = queue.poll();
    rust: [34, 35, 36], // while !queue.is_empty() { let node_rc = queue.pop_front().unwrap(); let node = node_rc.borrow();
    typescript: [17, 18], // while (queue.length > 0) { const node: TreeNode = queue.shift()!;
    go: [19, 20, 21], // for len(queue) > 0 { node := queue[0] queue = queue[1:]
  },

  queue_dequeue: {
    javascript: [16, 18], // const node = queue.shift(); result.push(node.val);
    cpp: [21, 22, 24], // TreeNode* node = q.front(); q.pop(); result.push_back(node->val);
    python: [16, 18], // node = queue.popleft() result.append(node.val)
    java: [21, 23], // TreeNode node = queue.poll(); result.add(node.val);
    rust: [35, 36, 38], // let node_rc = queue.pop_front().unwrap(); let node = node_rc.borrow(); result.push(node.val);
    typescript: [18, 20], // const node: TreeNode = queue.shift()!; result.push(node.val);
    go: [20, 21, 23], // node := queue[0] queue = queue[1:] result = append(result, node.Val)
  },

  tree_traversal: {
    javascript: [18], // result.push(node.val);
    cpp: [24], // result.push_back(node->val);
    python: [18], // result.append(node.val)
    java: [23], // result.add(node.val);
    rust: [38], // result.push(node.val);
    typescript: [20], // result.push(node.val);
    go: [23], // result = append(result, node.Val)
  },

  queue_enqueue: {
    javascript: [20, 21, 23, 24], // if (node.left !== null) { queue.push(node.left); } if (node.right !== null) { queue.push(node.right); }
    cpp: [26, 27, 28, 29, 30, 31], // if (node->left != nullptr) { q.push(node->left); } if (node->right != nullptr) { q.push(node->right); }
    python: [20, 21, 22, 23], // if node.left is not None: queue.append(node.left) if node.right is not None: queue.append(node.right)
    java: [25, 26, 27, 28, 29, 30], // if (node.left != null) { queue.offer(node.left); } if (node.right != null) { queue.offer(node.right); }
    rust: [40, 41, 42, 43, 44, 45], // if let Some(left) = &node.left { queue.push_back(Rc::clone(left)); } if let Some(right) = &node.right { queue.push_back(Rc::clone(right)); }
    typescript: [22, 23, 24, 25, 26, 27], // if (node.left !== null) { queue.push(node.left); } if (node.right !== null) { queue.push(node.right); }
    go: [25, 26, 27, 28, 29, 30], // if node.Left != nil { queue = append(queue, node.Left) } if node.Right != nil { queue = append(queue, node.Right) }
  },

  level_complete: {
    javascript: [15], // while (queue.length > 0) { (level completion is implicit in the loop)
    cpp: [20], // while (!q.empty()) { (level completion is implicit in the loop)
    python: [15], // while queue: (level completion is implicit in the loop)
    java: [20], // while (!queue.isEmpty()) { (level completion is implicit in the loop)
    rust: [34], // while !queue.is_empty() { (level completion is implicit in the loop)
    typescript: [17], // while (queue.length > 0) { (level completion is implicit in the loop)
    go: [19], // for len(queue) > 0 { (level completion is implicit in the loop)
  },

  return: {
    javascript: [27], // return result;
    cpp: [34], // return result;
    python: [25], // return result
    java: [33], // return result;
    rust: [49], // result
    typescript: [30], // return result;
    go: [33], // return result
  },
};

// register the mapping
export const BFS_TRAVERSAL_ALGORITHM_ID = "bfs-traversal";
