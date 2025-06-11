export const factorialCodes = {
  javascript: `function factorial(n) {
  // base case: factorial of 0 or 1 is 1
  if (n <= 1) {
    return 1;
  }
  
  // recursive case: n * factorial(n-1)
  return n * factorial(n - 1);
}

// example usage
console.log(factorial(5)); // output: 120`,

  cpp: `#include <iostream>
using namespace std;

int factorial(int n) {
    // base case: factorial of 0 or 1 is 1
    if (n <= 1) {
        return 1;
    }
    
    // recursive case: n * factorial(n-1)
    return n * factorial(n - 1);
}

int main() {
    int n = 5;
    cout << "factorial(" << n << ") = " << factorial(n) << endl;
    return 0;
}`,

  python: `def factorial(n):
    # base case: factorial of 0 or 1 is 1
    if n <= 1:
        return 1
    
    # recursive case: n * factorial(n-1)
    return n * factorial(n - 1)

# example usage
if __name__ == "__main__":
    n = 5
    print(f"factorial({n}) = {factorial(n)}")`,

  java: `public class Factorial {
    public static int factorial(int n) {
        // base case: factorial of 0 or 1 is 1
        if (n <= 1) {
            return 1;
        }
        
        // recursive case: n * factorial(n-1)
        return n * factorial(n - 1);
    }
    
    public static void main(String[] args) {
        int n = 5;
        System.out.println("factorial(" + n + ") = " + factorial(n));
    }
}`,

  rust: `fn factorial(n: u32) -> u32 {
    // base case: factorial of 0 or 1 is 1
    if n <= 1 {
        return 1;
    }
    
    // recursive case: n * factorial(n-1)
    n * factorial(n - 1)
}

fn main() {
    let n = 5;
    println!("factorial({}) = {}", n, factorial(n));
}`,

  typescript: `function factorial(n: number): number {
    // base case: factorial of 0 or 1 is 1
    if (n <= 1) {
        return 1;
    }
    
    // recursive case: n * factorial(n-1)
    return n * factorial(n - 1);
}

// example usage
const n: number = 5;
console.log(\`factorial(\${n}) = \${factorial(n)}\`);`,

  go: `package main

import "fmt"

func factorial(n int) int {
    // base case: factorial of 0 or 1 is 1
    if n <= 1 {
        return 1
    }
    
    // recursive case: n * factorial(n-1)
    return n * factorial(n-1)
}

func main() {
    n := 5
    fmt.Printf("factorial(%d) = %d\\n", n, factorial(n))
}`,
};
