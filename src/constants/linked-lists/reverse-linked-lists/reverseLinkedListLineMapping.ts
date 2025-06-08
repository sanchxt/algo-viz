import type { AlgorithmLineMapping } from "@/types/algorithm";

export const reverseLinkedListLineMapping: AlgorithmLineMapping = {
  pointer_initialization: {
    javascript: [9, 10, 11], // let prev = null; let current = head; let next = null;
    cpp: [13, 14, 15], // ListNode* prev = nullptr; ListNode* current = head; ListNode* next = nullptr;
    python: [8, 9, 10], // prev = None; current = head; next_node = None
    java: [11, 12, 13], // ListNode prev = null; ListNode current = head; ListNode next = null;
    rust: [19, 20], // let mut prev = None; let mut current = head;
    typescript: [11, 12, 13], // let prev: ListNode | null = null; let current: ListNode | null = head; let next: ListNode | null = null;
    go: [11, 12, 13], // var prev *ListNode = nil; current := head; var next *ListNode = nil
  },

  loop_condition: {
    javascript: [14], // while (current !== null) {
    cpp: [17], // while (current != nullptr) {
    python: [12], // while current is not None:
    java: [15], // while (current != null) {
    rust: [22], // while let Some(mut node) = current {
    typescript: [15], // while (current !== null) {
    go: [15], // for current != nil {
  },

  pointer_update: {
    javascript: [16], // next = current.next;
    cpp: [19], // next = current->next;
    python: [14], // next_node = current.next
    java: [17], // next = current.next;
    rust: [24], // let next = node.next.take();
    typescript: [17], // next = current.next;
    go: [17], // next = current.Next
  },

  link_reversal: {
    javascript: [18], // current.next = prev;
    cpp: [21], // current->next = prev;
    python: [16], // current.next = prev
    java: [19], // current.next = prev;
    rust: [26], // node.next = prev;
    typescript: [19], // current.next = prev;
    go: [19], // current.Next = prev
  },

  node_traversal: {
    javascript: [20, 21], // prev = current; current = next;
    cpp: [23, 24], // prev = current; current = next;
    python: [18, 19], // prev = current; current = next_node
    java: [21, 22], // prev = current; current = next;
    rust: [28, 29], // prev = Some(node); current = next;
    typescript: [21, 22], // prev = current; current = next;
    go: [21, 22], // prev = current; current = next
  },

  return: {
    javascript: [25], // return prev;
    cpp: [27], // return prev;
    python: [22], // return prev
    java: [25], // return prev;
    rust: [32], // prev
    typescript: [25], // return prev;
    go: [25], // return prev
  },
};

// register the mapping
export const REVERSE_LINKED_LIST_ALGORITHM_ID = "reverse-linked-list";
