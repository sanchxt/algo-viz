export const linearSearchCodes = {
  javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`,

  cpp: `#include <iostream>
using namespace std;

int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`,

  python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,

  java: `public class LinearSearch {
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }
}`,

  rust: `fn linear_search(arr: &[i32], target: i32) -> Option<usize> {
    for (i, &element) in arr.iter().enumerate() {
        if element == target {
            return Some(i);
        }
    }
    None
}`,

  typescript: `function linearSearch(arr: number[], target: number): number {
    for (let i: number = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;
        }
    }
    return -1;
}`,

  go: `package main

func linearSearch(arr []int, target int) int {
    for i := 0; i < len(arr); i++ {
        if arr[i] == target {
            return i
        }
    }
    return -1
}`,
};
