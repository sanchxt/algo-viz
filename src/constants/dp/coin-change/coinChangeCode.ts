export const coinChangeCodes = {
  javascript: `function coinChange(coins, amount) {
  // initialize DP table: dp[i] = min coins for amount i
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // base case: 0 coins for amount 0
  
  // for each amount from 1 to target
  for (let currentAmount = 1; currentAmount <= amount; currentAmount++) {
    // try each coin denomination
    for (const coin of coins) {
      // check if coin can be used
      if (coin <= currentAmount) {
        // update if this coin gives better solution
        dp[currentAmount] = Math.min(
          dp[currentAmount], 
          dp[currentAmount - coin] + 1
        );
      }
    }
  }
  
  // return result (Infinity means no solution)
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// example usage
console.log(coinChange([1, 3, 4], 6)); // output: 2 (3+3)`,

  cpp: `#include <vector>
#include <algorithm>
#include <climits>
#include <iostream>
using namespace std;

int coinChange(vector<int>& coins, int amount) {
    // initialize DP table: dp[i] = min coins for amount i
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0; // base case: 0 coins for amount 0
    
    // for each amount from 1 to target
    for (int currentAmount = 1; currentAmount <= amount; currentAmount++) {
        // try each coin denomination
        for (int coin : coins) {
            // check if coin can be used and subproblem has solution
            if (coin <= currentAmount && dp[currentAmount - coin] != INT_MAX) {
                // update if this coin gives better solution
                dp[currentAmount] = min(
                    dp[currentAmount], 
                    dp[currentAmount - coin] + 1
                );
            }
        }
    }
    
    // return result (INT_MAX means no solution)
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}

int main() {
    vector<int> coins = {1, 3, 4};
    cout << coinChange(coins, 6) << endl; // output: 2
    return 0;
}`,

  python: `def coin_change(coins, amount):
    # initialize DP table: dp[i] = min coins for amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # base case: 0 coins for amount 0
    
    # for each amount from 1 to target
    for current_amount in range(1, amount + 1):
        # try each coin denomination
        for coin in coins:
            # check if coin can be used
            if coin <= current_amount:
                # update if this coin gives better solution
                dp[current_amount] = min(
                    dp[current_amount],
                    dp[current_amount - coin] + 1
                )
    
    # return result (inf means no solution)
    return dp[amount] if dp[amount] != float('inf') else -1

# example usage
if __name__ == "__main__":
    coins = [1, 3, 4]
    amount = 6
    print(f"coin_change({coins}, {amount}) = {coin_change(coins, amount)}")`,

  java: `import java.util.Arrays;

public class CoinChange {
    public static int coinChange(int[] coins, int amount) {
        // initialize DP table: dp[i] = min coins for amount i
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0; // base case: 0 coins for amount 0
        
        // for each amount from 1 to target
        for (int currentAmount = 1; currentAmount <= amount; currentAmount++) {
            // try each coin denomination
            for (int coin : coins) {
                // check if coin can be used and subproblem has solution
                if (coin <= currentAmount && dp[currentAmount - coin] != Integer.MAX_VALUE) {
                    // update if this coin gives better solution
                    dp[currentAmount] = Math.min(
                        dp[currentAmount],
                        dp[currentAmount - coin] + 1
                    );
                }
            }
        }
        
        // return result (MAX_VALUE means no solution)
        return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
    }
    
    public static void main(String[] args) {
        int[] coins = {1, 3, 4};
        int amount = 6;
        System.out.println("coinChange([1,3,4], 6) = " + coinChange(coins, amount));
    }
}`,

  rust: `fn coin_change(coins: Vec<i32>, amount: i32) -> i32 {
    let amount = amount as usize;
    
    // initialize DP table: dp[i] = min coins for amount i
    let mut dp = vec![i32::MAX; amount + 1];
    dp[0] = 0; // base case: 0 coins for amount 0
    
    // for each amount from 1 to target
    for current_amount in 1..=amount {
        // try each coin denomination
        for &coin in &coins {
            let coin = coin as usize;
            // check if coin can be used and subproblem has solution
            if coin <= current_amount && dp[current_amount - coin] != i32::MAX {
                // update if this coin gives better solution
                dp[current_amount] = dp[current_amount].min(
                    dp[current_amount - coin] + 1
                );
            }
        }
    }
    
    // return result (MAX means no solution)
    if dp[amount] == i32::MAX { -1 } else { dp[amount] }
}

fn main() {
    let coins = vec![1, 3, 4];
    let amount = 6;
    println!("coin_change([1,3,4], 6) = {}", coin_change(coins, amount));
}`,

  typescript: `function coinChange(coins: number[], amount: number): number {
    // initialize DP table: dp[i] = min coins for amount i
    const dp: number[] = new Array(amount + 1).fill(Infinity);
    dp[0] = 0; // base case: 0 coins for amount 0
    
    // for each amount from 1 to target
    for (let currentAmount = 1; currentAmount <= amount; currentAmount++) {
        // try each coin denomination
        for (const coin of coins) {
            // check if coin can be used
            if (coin <= currentAmount) {
                // update if this coin gives better solution
                dp[currentAmount] = Math.min(
                    dp[currentAmount],
                    dp[currentAmount - coin] + 1
                );
            }
        }
    }
    
    // return result (Infinity means no solution)
    return dp[amount] === Infinity ? -1 : dp[amount];
}

// example usage
const coins: number[] = [1, 3, 4];
const amount: number = 6;
console.log(\`coinChange([1,3,4], 6) = \${coinChange(coins, amount)}\`);`,

  go: `package main

import (
    "fmt"
    "math"
)

func coinChange(coins []int, amount int) int {
    // initialize DP table: dp[i] = min coins for amount i
    dp := make([]int, amount+1)
    for i := 1; i <= amount; i++ {
        dp[i] = math.MaxInt32
    }
    dp[0] = 0 // base case: 0 coins for amount 0
    
    // for each amount from 1 to target
    for currentAmount := 1; currentAmount <= amount; currentAmount++ {
        // try each coin denomination
        for _, coin := range coins {
            // check if coin can be used and subproblem has solution
            if coin <= currentAmount && dp[currentAmount-coin] != math.MaxInt32 {
                // update if this coin gives better solution
                if dp[currentAmount-coin]+1 < dp[currentAmount] {
                    dp[currentAmount] = dp[currentAmount-coin] + 1
                }
            }
        }
    }
    
    // return result (MaxInt32 means no solution)
    if dp[amount] == math.MaxInt32 {
        return -1
    }
    return dp[amount]
}

func main() {
    coins := []int{1, 3, 4}
    amount := 6
    fmt.Printf("coinChange([1,3,4], 6) = %d\\n", coinChange(coins, amount))
}`,
};
