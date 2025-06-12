export const inOrderTraversalCodes = {
  javascript: `// Definition for binary tree node
class TreeNode {
  constructor(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
  }
}

function inorderTraversal(root) {
  const result = [];
  
  function inorder(node) {
    // Base case: if node is null, return
    if (node === null) {
      return;
    }
    
    // Traverse left subtree
    inorder(node.left);
    
    // Visit current node (add to result)
    result.push(node.val);
    
    // Traverse right subtree
    inorder(node.right);
  }
  
  // Start traversal from root
  inorder(root);
  return result;
}`,

  cpp: `#include <vector>
using namespace std;

// Definition for binary tree node
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> result;
        inorder(root, result);
        return result;
    }
    
private:
    void inorder(TreeNode* node, vector<int>& result) {
        // Base case: if node is null, return
        if (node == nullptr) {
            return;
        }
        
        // Traverse left subtree
        inorder(node->left, result);
        
        // Visit current node (add to result)
        result.push_back(node->val);
        
        // Traverse right subtree
        inorder(node->right, result);
    }
};`,

  python: `# Definition for binary tree node
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root):
    result = []
    
    def inorder(node):
        # Base case: if node is None, return
        if node is None:
            return
        
        # Traverse left subtree
        inorder(node.left)
        
        # Visit current node (add to result)
        result.append(node.val)
        
        # Traverse right subtree
        inorder(node.right)
    
    # Start traversal from root
    inorder(root)
    return result`,

  java: `import java.util.*;

// Definition for binary tree node
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        inorder(root, result);
        return result;
    }
    
    private void inorder(TreeNode node, List<Integer> result) {
        // Base case: if node is null, return
        if (node == null) {
            return;
        }
        
        // Traverse left subtree
        inorder(node.left, result);
        
        // Visit current node (add to result)
        result.add(node.val);
        
        // Traverse right subtree
        inorder(node.right, result);
    }
}`,

  rust: `// Definition for binary tree node
use std::rc::Rc;
use std::cell::RefCell;

#[derive(Debug, PartialEq, Eq)]
pub struct TreeNode {
    pub val: i32,
    pub left: Option<Rc<RefCell<TreeNode>>>,
    pub right: Option<Rc<RefCell<TreeNode>>>,
}

impl TreeNode {
    #[inline]
    pub fn new(val: i32) -> Self {
        TreeNode {
            val,
            left: None,
            right: None,
        }
    }
}

impl Solution {
    pub fn inorder_traversal(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<i32> {
        let mut result = Vec::new();
        Self::inorder(&root, &mut result);
        result
    }
    
    fn inorder(node: &Option<Rc<RefCell<TreeNode>>>, result: &mut Vec<i32>) {
        // Base case: if node is None, return
        if let Some(n) = node {
            let n = n.borrow();
            
            // Traverse left subtree
            Self::inorder(&n.left, result);
            
            // Visit current node (add to result)
            result.push(n.val);
            
            // Traverse right subtree
            Self::inorder(&n.right, result);
        }
    }
}`,

  typescript: `// Definition for binary tree node
class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.left = (left === undefined ? null : left);
        this.right = (right === undefined ? null : right);
    }
}

function inorderTraversal(root: TreeNode | null): number[] {
    const result: number[] = [];
    
    function inorder(node: TreeNode | null): void {
        // Base case: if node is null, return
        if (node === null) {
            return;
        }
        
        // Traverse left subtree
        inorder(node.left);
        
        // Visit current node (add to result)
        result.push(node.val);
        
        // Traverse right subtree
        inorder(node.right);
    }
    
    // Start traversal from root
    inorder(root);
    return result;
}`,

  go: `package main

// Definition for binary tree node
type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

func inorderTraversal(root *TreeNode) []int {
    var result []int
    inorder(root, &result)
    return result
}

func inorder(node *TreeNode, result *[]int) {
    // Base case: if node is nil, return
    if node == nil {
        return
    }
    
    // Traverse left subtree
    inorder(node.Left, result)
    
    // Visit current node (add to result)
    *result = append(*result, node.Val)
    
    // Traverse right subtree
    inorder(node.Right, result)
}`,
};
