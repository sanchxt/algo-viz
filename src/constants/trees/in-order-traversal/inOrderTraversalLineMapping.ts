import type { AlgorithmLineMapping } from "@/types/algorithm";

export const inOrderTraversalLineMapping: AlgorithmLineMapping = {
  initialization: {
    javascript: [9, 10], // const result = []; function inorder(node) {
    cpp: [13, 16], // vector<int> result; void inorder(TreeNode* node, vector<int>& result) {
    python: [8, 10], // result = []; def inorder(node):
    java: [16, 19], // List<Integer> result = new ArrayList<>(); private void inorder(TreeNode node, List<Integer> result) {
    rust: [22, 25], // let mut result = Vec::new(); fn inorder(node: &Option<Rc<RefCell<TreeNode>>>, result: &mut Vec<i32>) {
    typescript: [9, 11], // const result: number[] = []; function inorder(node: TreeNode | null): void {
    go: [9, 14], // var result []int; func inorder(node *TreeNode, result *[]int) {
  },

  recursive_call: {
    javascript: [9], // function inorder(node) {
    cpp: [16], // void inorder(TreeNode* node, vector<int>& result) {
    python: [10], // def inorder(node):
    java: [19], // private void inorder(TreeNode node, List<Integer> result) {
    rust: [25], // fn inorder(node: &Option<Rc<RefCell<TreeNode>>>, result: &mut Vec<i32>) {
    typescript: [11], // function inorder(node: TreeNode | null): void {
    go: [14], // func inorder(node *TreeNode, result *[]int) {
  },

  base_case_check: {
    javascript: [11, 12, 13], // if (node === null) { return; }
    cpp: [17, 18, 19], // if (node == nullptr) { return; }
    python: [11, 12], // if node is None: return
    java: [20, 21, 22], // if (node == null) { return; }
    rust: [26], // if let Some(n) = node {
    typescript: [12, 13, 14], // if (node === null) { return; }
    go: [15, 16, 17], // if node == nil { return }
  },

  base_case_reached: {
    javascript: [12], // return;
    cpp: [18], // return;
    python: [12], // return
    java: [21], // return;
    rust: [26], // implicit return for None case
    typescript: [13], // return;
    go: [16], // return
  },

  tree_traversal: {
    javascript: [15, 17, 20], // inorder(node.left); result.push(node.val); inorder(node.right);
    cpp: [21, 24, 27], // inorder(node->left, result); result.push_back(node->val); inorder(node->right, result);
    python: [14, 17, 20], // inorder(node.left); result.append(node.val); inorder(node.right)
    java: [24, 27, 30], // inorder(node.left, result); result.add(node.val); inorder(node.right, result);
    rust: [29, 32, 35], // Self::inorder(&n.left, result); result.push(n.val); Self::inorder(&n.right, result);
    typescript: [16, 19, 22], // inorder(node.left); result.push(node.val); inorder(node.right);
    go: [19, 22, 25], // inorder(node.Left, result); *result = append(*result, node.Val); inorder(node.Right, result)
  },

  recursive_return: {
    javascript: [25], // return result;
    cpp: [13], // return result;
    python: [23], // return result
    java: [15], // return result;
    rust: [23], // result
    typescript: [26], // return result;
    go: [11], // return result
  },

  return: {
    javascript: [25], // return result;
    cpp: [13], // return result;
    python: [23], // return result
    java: [15], // return result;
    rust: [23], // result
    typescript: [26], // return result;
    go: [11], // return result
  },
};

// register the mapping
export const IN_ORDER_TRAVERSAL_ALGORITHM_ID = "in-order-traversal";
