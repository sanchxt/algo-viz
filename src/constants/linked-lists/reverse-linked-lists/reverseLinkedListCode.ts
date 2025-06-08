export const reverseLinkedListCodes = {
  javascript: `// Definition for singly-linked list node
class ListNode {
  constructor(val, next) {
    this.val = (val === undefined ? 0 : val);
    this.next = (next === undefined ? null : next);
  }
}

function reverseList(head) {
  // Initialize three pointers
  let prev = null;
  let current = head;
  let next = null;
  
  // Traverse the list and reverse links
  while (current !== null) {
    // Store the next node before breaking the link
    next = current.next;
    
    // Reverse the current node's link
    current.next = prev;
    
    // Move pointers one step forward
    prev = current;
    current = next;
  }
  
  // prev is now the new head of the reversed list
  return prev;
}`,

  cpp: `#include <iostream>
using namespace std;

// Definition for singly-linked list node
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Initialize three pointers
        ListNode* prev = nullptr;
        ListNode* current = head;
        ListNode* next = nullptr;
        
        // Traverse the list and reverse links
        while (current != nullptr) {
            // Store the next node before breaking the link
            next = current->next;
            
            // Reverse the current node's link
            current->next = prev;
            
            // Move pointers one step forward
            prev = current;
            current = next;
        }
        
        // prev is now the new head of the reversed list
        return prev;
    }
};`,

  python: `# Definition for singly-linked list node
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    # Initialize three pointers
    prev = None
    current = head
    next_node = None
    
    # Traverse the list and reverse links
    while current is not None:
        # Store the next node before breaking the link
        next_node = current.next
        
        # Reverse the current node's link
        current.next = prev
        
        # Move pointers one step forward
        prev = current
        current = next_node
    
    # prev is now the new head of the reversed list
    return prev`,

  java: `// Definition for singly-linked list node
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class Solution {
    public ListNode reverseList(ListNode head) {
        // Initialize three pointers
        ListNode prev = null;
        ListNode current = head;
        ListNode next = null;
        
        // Traverse the list and reverse links
        while (current != null) {
            // Store the next node before breaking the link
            next = current.next;
            
            // Reverse the current node's link
            current.next = prev;
            
            // Move pointers one step forward
            prev = current;
            current = next;
        }
        
        // prev is now the new head of the reversed list
        return prev;
    }
}`,

  rust: `// Definition for singly-linked list node
#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
}

impl ListNode {
    #[inline]
    fn new(val: i32) -> Self {
        ListNode {
            next: None,
            val,
        }
    }
}

impl Solution {
    pub fn reverse_list(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        // Initialize pointers
        let mut prev = None;
        let mut current = head;
        
        // Traverse the list and reverse links
        while let Some(mut node) = current {
            // Store the next node before breaking the link
            let next = node.next.take();
            
            // Reverse the current node's link
            node.next = prev;
            
            // Move pointers one step forward
            prev = Some(node);
            current = next;
        }
        
        // prev is now the new head of the reversed list
        prev
    }
}`,

  typescript: `// Definition for singly-linked list node
class ListNode {
    val: number;
    next: ListNode | null;
    
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
}

function reverseList(head: ListNode | null): ListNode | null {
    // Initialize three pointers
    let prev: ListNode | null = null;
    let current: ListNode | null = head;
    let next: ListNode | null = null;
    
    // Traverse the list and reverse links
    while (current !== null) {
        // Store the next node before breaking the link
        next = current.next;
        
        // Reverse the current node's link
        current.next = prev;
        
        // Move pointers one step forward
        prev = current;
        current = next;
    }
    
    // prev is now the new head of the reversed list
    return prev;
}`,

  go: `package main

// Definition for singly-linked list node
type ListNode struct {
    Val  int
    Next *ListNode
}

func reverseList(head *ListNode) *ListNode {
    // Initialize three pointers
    var prev *ListNode = nil
    current := head
    var next *ListNode = nil
    
    // Traverse the list and reverse links
    for current != nil {
        // Store the next node before breaking the link
        next = current.Next
        
        // Reverse the current node's link
        current.Next = prev
        
        // Move pointers one step forward
        prev = current
        current = next
    }
    
    // prev is now the new head of the reversed list
    return prev
}`,
};
