export const balancedParenthesesCodes = {
  javascript: `function isBalanced(s) {
  const stack = [];
  const brackets = { '(': ')', '[': ']', '{': '}' };
  
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    
    // if opening bracket, push to stack
    if (brackets[char]) {
      stack.push(char);
    }
    // if closing bracket, check match
    else if (char === ')' || char === ']' || char === '}') {
      if (stack.length === 0) return false;
      
      const top = stack.pop();
      if (brackets[top] !== char) return false;
    }
  }
  
  // balanced if stack is empty
  return stack.length === 0;
}

// example usage
console.log(isBalanced("()[]{}"));  // true
console.log(isBalanced("([{}])"));  // true
console.log(isBalanced("([)]"));    // false`,

  cpp: `#include <iostream>
#include <stack>
#include <string>
#include <unordered_map>
using namespace std;

bool isBalanced(string s) {
    stack<char> st;
    unordered_map<char, char> brackets = {{'(', ')'}, {'[', ']'}, {'{', '}'}};
    
    for (int i = 0; i < s.length(); i++) {
        char ch = s[i];
        
        // if opening bracket, push to stack
        if (brackets.find(ch) != brackets.end()) {
            st.push(ch);
        }
        // if closing bracket, check match
        else if (ch == ')' || ch == ']' || ch == '}') {
            if (st.empty()) return false;
            
            char top = st.top();
            st.pop();
            if (brackets[top] != ch) return false;
        }
    }
    
    // balanced if stack is empty
    return st.empty();
}

int main() {
    cout << boolalpha;
    cout << isBalanced("()[]{}") << endl;  // true
    cout << isBalanced("([{}])") << endl;  // true
    cout << isBalanced("([)]") << endl;    // false
    return 0;
}`,

  python: `def is_balanced(s):
    stack = []
    brackets = {'(': ')', '[': ']', '{': '}'}
    
    for i in range(len(s)):
        char = s[i]
        
        # if opening bracket, push to stack
        if char in brackets:
            stack.append(char)
        # if closing bracket, check match
        elif char in ')]}':
            if len(stack) == 0:
                return False
            
            top = stack.pop()
            if brackets[top] != char:
                return False
    
    # balanced if stack is empty
    return len(stack) == 0

# example usage
if __name__ == "__main__":
    print(is_balanced("()[]{}"))  # True
    print(is_balanced("([{}])"))  # True
    print(is_balanced("([)]"))    # False`,

  java: `import java.util.*;

public class BalancedParentheses {
    public static boolean isBalanced(String s) {
        Stack<Character> stack = new Stack<>();
        Map<Character, Character> brackets = new HashMap<>();
        brackets.put('(', ')');
        brackets.put('[', ']');
        brackets.put('{', '}');
        
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            
            // if opening bracket, push to stack
            if (brackets.containsKey(ch)) {
                stack.push(ch);
            }
            // if closing bracket, check match
            else if (ch == ')' || ch == ']' || ch == '}') {
                if (stack.isEmpty()) return false;
                
                char top = stack.pop();
                if (!brackets.get(top).equals(ch)) return false;
            }
        }
        
        // balanced if stack is empty
        return stack.isEmpty();
    }
    
    public static void main(String[] args) {
        System.out.println(isBalanced("()[]{}"));  // true
        System.out.println(isBalanced("([{}])"));  // true
        System.out.println(isBalanced("([)]"));    // false
    }
}`,

  rust: `use std::collections::HashMap;

fn is_balanced(s: &str) -> bool {
    let mut stack = Vec::new();
    let mut brackets = HashMap::new();
    brackets.insert('(', ')');
    brackets.insert('[', ']');
    brackets.insert('{', '}');
    
    for ch in s.chars() {
        // if opening bracket, push to stack
        if brackets.contains_key(&ch) {
            stack.push(ch);
        }
        // if closing bracket, check match
        else if ch == ')' || ch == ']' || ch == '}' {
            if stack.is_empty() {
                return false;
            }
            
            let top = stack.pop().unwrap();
            if brackets[&top] != ch {
                return false;
            }
        }
    }
    
    // balanced if stack is empty
    stack.is_empty()
}

fn main() {
    println!("{}", is_balanced("()[]{}"));  // true
    println!("{}", is_balanced("([{}])"));  // true
    println!("{}", is_balanced("([)]"));    // false
}`,

  typescript: `function isBalanced(s: string): boolean {
    const stack: string[] = [];
    const brackets: { [key: string]: string } = { '(': ')', '[': ']', '{': '}' };
    
    for (let i = 0; i < s.length; i++) {
        const char: string = s[i];
        
        // if opening bracket, push to stack
        if (brackets[char]) {
            stack.push(char);
        }
        // if closing bracket, check match
        else if (char === ')' || char === ']' || char === '}') {
            if (stack.length === 0) return false;
            
            const top: string = stack.pop()!;
            if (brackets[top] !== char) return false;
        }
    }
    
    // balanced if stack is empty
    return stack.length === 0;
}

// example usage
console.log(isBalanced("()[]{}"));  // true
console.log(isBalanced("([{}])"));  // true
console.log(isBalanced("([)]"));    // false`,

  go: `package main

import "fmt"

func isBalanced(s string) bool {
    stack := []rune{}
    brackets := map[rune]rune{'(': ')', '[': ']', '{': '}'}
    
    for _, char := range s {
        // if opening bracket, push to stack
        if closing, exists := brackets[char]; exists {
            stack = append(stack, char)
            _ = closing // use the variable to avoid unused warning
        }
        // if closing bracket, check match
        if char == ')' || char == ']' || char == '}' {
            if len(stack) == 0 {
                return false
            }
            
            top := stack[len(stack)-1]
            stack = stack[:len(stack)-1]
            if brackets[top] != char {
                return false
            }
        }
    }
    
    // balanced if stack is empty
    return len(stack) == 0
}

func main() {
    fmt.Println(isBalanced("()[]{}"))  // true
    fmt.Println(isBalanced("([{}])"))  // true
    fmt.Println(isBalanced("([)]"))    // false
}`,
};
