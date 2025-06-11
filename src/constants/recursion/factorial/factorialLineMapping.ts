import type { AlgorithmLineMapping } from "@/types/algorithm";

export const factorialLineMapping: AlgorithmLineMapping = {
  initialization: {
    javascript: [1], // function factorial(n) {
    cpp: [4], // int factorial(int n) {
    python: [1], // def factorial(n):
    java: [2], // public static int factorial(int n) {
    rust: [1], // fn factorial(n: u32) -> u32 {
    typescript: [1], // function factorial(n: number): number {
    go: [5], // func factorial(n int) int {
  },

  base_case_check: {
    javascript: [3], // if (n <= 1) {
    cpp: [6], // if (n <= 1) {
    python: [3], // if n <= 1:
    java: [4], // if (n <= 1) {
    rust: [3], // if n <= 1 {
    typescript: [3], // if (n <= 1) {
    go: [7], // if n <= 1 {
  },

  base_case_reached: {
    javascript: [4], // return 1;
    cpp: [7], // return 1;
    python: [4], // return 1
    java: [5], // return 1;
    rust: [4], // return 1;
    typescript: [4], // return 1;
    go: [8], // return 1
  },

  recursive_call: {
    javascript: [7], // return n * factorial(n - 1);
    cpp: [10], // return n * factorial(n - 1);
    python: [7], // return n * factorial(n - 1)
    java: [8], // return n * factorial(n - 1);
    rust: [7], // n * factorial(n - 1)
    typescript: [7], // return n * factorial(n - 1);
    go: [11], // return n * factorial(n-1)
  },

  recursive_return: {
    javascript: [7], // return n * factorial(n - 1);
    cpp: [10], // return n * factorial(n - 1);
    python: [7], // return n * factorial(n - 1)
    java: [8], // return n * factorial(n - 1);
    rust: [7], // n * factorial(n - 1)
    typescript: [7], // return n * factorial(n - 1);
    go: [11], // return n * factorial(n-1)
  },

  return: {
    javascript: [7], // return n * factorial(n - 1);
    cpp: [10], // return n * factorial(n - 1);
    python: [7], // return n * factorial(n - 1)
    java: [8], // return n * factorial(n - 1);
    rust: [7], // n * factorial(n - 1)
    typescript: [7], // return n * factorial(n - 1);
    go: [11], // return n * factorial(n-1)
  },

  call_stack_push: {
    javascript: [1], // function factorial(n) {
    cpp: [4], // int factorial(int n) {
    python: [1], // def factorial(n):
    java: [2], // public static int factorial(int n) {
    rust: [1], // fn factorial(n: u32) -> u32 {
    typescript: [1], // function factorial(n: number): number {
    go: [5], // func factorial(n int) int {
  },

  call_stack_pop: {
    javascript: [7, 8], // return statement and closing brace
    cpp: [10, 11], // return statement and closing brace
    python: [7], // return statement (python doesn't have explicit closing)
    java: [8, 9], // return statement and closing brace
    rust: [7, 8], // return statement and closing brace
    typescript: [7, 8], // return statement and closing brace
    go: [11, 12], // return statement and closing brace
  },
};

// register the mapping
export const FACTORIAL_ALGORITHM_ID = "factorial";
