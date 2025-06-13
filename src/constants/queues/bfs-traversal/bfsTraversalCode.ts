export const bfsTraversalCodes = {
  javascript: `// Definition for binary tree node
class TreeNode {
  constructor(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
  }
}

function levelOrder(root) {
  // handle empty tree
  if (root === null) {
    return [];
  }
  
  const result = [];
  const queue = [root];
  
  // process nodes level by level
  while (queue.length > 0) {
    // get front node from queue
    const node = queue.shift();
    
    // visit current node
    result.push(node.val);
    
    // enqueue children (left first, then right)
    if (node.left !== null) {
      queue.push(node.left);
    }
    if (node.right !== null) {
      queue.push(node.right);
    }
  }
  
  return result;
}`,

  cpp: `#include <vector>
#include <queue>
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
    vector<int> levelOrder(TreeNode* root) {
        vector<int> result;
        
        // handle empty tree
        if (root == nullptr) {
            return result;
        }
        
        queue<TreeNode*> q;
        q.push(root);
        
        // process nodes level by level
        while (!q.empty()) {
            // get front node from queue
            TreeNode* node = q.front();
            q.pop();
            
            // visit current node
            result.push_back(node->val);
            
            // enqueue children (left first, then right)
            if (node->left != nullptr) {
                q.push(node->left);
            }
            if (node->right != nullptr) {
                q.push(node->right);
            }
        }
        
        return result;
    }
};`,

  python: `from collections import deque

# Definition for binary tree node
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def level_order(root):
    # handle empty tree
    if root is None:
        return []
    
    result = []
    queue = deque([root])
    
    # process nodes level by level
    while queue:
        # get front node from queue
        node = queue.popleft()
        
        # visit current node
        result.append(node.val)
        
        # enqueue children (left first, then right)
        if node.left is not None:
            queue.append(node.left)
        if node.right is not None:
            queue.append(node.right)
    
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
    public List<Integer> levelOrder(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        
        // handle empty tree
        if (root == null) {
            return result;
        }
        
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        
        // process nodes level by level
        while (!queue.isEmpty()) {
            // get front node from queue
            TreeNode node = queue.poll();
            
            // visit current node
            result.add(node.val);
            
            // enqueue children (left first, then right)
            if (node.left != null) {
                queue.offer(node.left);
            }
            if (node.right != null) {
                queue.offer(node.right);
            }
        }
        
        return result;
    }
}`,

  rust: `use std::collections::VecDeque;
use std::rc::Rc;
use std::cell::RefCell;

// Definition for binary tree node
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
    pub fn level_order(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<i32> {
        let mut result = Vec::new();
        
        // handle empty tree
        if root.is_none() {
            return result;
        }
        
        let mut queue = VecDeque::new();
        queue.push_back(root.unwrap());
        
        // process nodes level by level
        while !queue.is_empty() {
            // get front node from queue
            let node_rc = queue.pop_front().unwrap();
            let node = node_rc.borrow();
            
            // visit current node
            result.push(node.val);
            
            // enqueue children (left first, then right)
            if let Some(left) = &node.left {
                queue.push_back(Rc::clone(left));
            }
            if let Some(right) = &node.right {
                queue.push_back(Rc::clone(right));
            }
        }
        
        result
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

function levelOrder(root: TreeNode | null): number[] {
    // handle empty tree
    if (root === null) {
        return [];
    }
    
    const result: number[] = [];
    const queue: TreeNode[] = [root];
    
    // process nodes level by level
    while (queue.length > 0) {
        // get front node from queue
        const node: TreeNode = queue.shift()!;
        
        // visit current node
        result.push(node.val);
        
        // enqueue children (left first, then right)
        if (node.left !== null) {
            queue.push(node.left);
        }
        if (node.right !== null) {
            queue.push(node.right);
        }
    }
    
    return result;
}`,

  go: `package main

import "fmt"

// Definition for binary tree node
type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

func levelOrder(root *TreeNode) []int {
    var result []int
    
    // handle empty tree
    if root == nil {
        return result
    }
    
    queue := []*TreeNode{root}
    
    // process nodes level by level
    for len(queue) > 0 {
        // get front node from queue
        node := queue[0]
        queue = queue[1:]
        
        // visit current node
        result = append(result, node.Val)
        
        // enqueue children (left first, then right)
        if node.Left != nil {
            queue = append(queue, node.Left)
        }
        if node.Right != nil {
            queue = append(queue, node.Right)
        }
    }
    
    return result
}`,
};
