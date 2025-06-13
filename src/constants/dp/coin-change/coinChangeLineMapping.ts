import type { AlgorithmLineMapping } from "@/types/algorithm";

export const coinChangeLineMapping: AlgorithmLineMapping = {
  dp_table_initialization: {
    javascript: [2, 3], // const dp = new Array...; dp[0] = 0;
    cpp: [7, 8], // vector<int> dp...; dp[0] = 0;
    python: [2, 3], // dp = [float('inf')]...; dp[0] = 0
    java: [4, 5], // Arrays.fill(dp, Integer.MAX_VALUE); dp[0] = 0;
    rust: [4, 5], // let mut dp = vec![i32::MAX...]; dp[0] = 0;
    typescript: [2, 3], // const dp: number[] = ...; dp[0] = 0;
    go: [7, 9], // dp := make([]int, ...); dp[0] = 0
  },

  dp_amount_processing: {
    javascript: [5], // for (let currentAmount = 1; currentAmount <= amount; currentAmount++)
    cpp: [10], // for (int currentAmount = 1; currentAmount <= amount; currentAmount++)
    python: [5], // for current_amount in range(1, amount + 1):
    java: [7], // for (int currentAmount = 1; currentAmount <= amount; currentAmount++)
    rust: [7], // for current_amount in 1..=amount {
    typescript: [5], // for (let currentAmount = 1; currentAmount <= amount; currentAmount++)
    go: [11], // for currentAmount := 1; currentAmount <= amount; currentAmount++
  },

  dp_coin_consideration: {
    javascript: [6], // for (const coin of coins) {
    cpp: [11], // for (int coin : coins) {
    python: [6], // for coin in coins:
    java: [8], // for (int coin : coins) {
    rust: [8], // for &coin in &coins {
    typescript: [6], // for (const coin of coins) {
    go: [12], // for _, coin := range coins {
  },

  dp_subproblem_lookup: {
    javascript: [7, 8], // if (coin <= currentAmount) check
    cpp: [12], // if (coin <= currentAmount && dp[currentAmount - coin] != INT_MAX)
    python: [7, 8], // if coin <= current_amount: check
    java: [9], // if (coin <= currentAmount && dp[currentAmount - coin] != Integer.MAX_VALUE)
    rust: [10], // if coin <= current_amount && dp[current_amount - coin] != i32::MAX
    typescript: [7, 8], // if (coin <= currentAmount) check
    go: [13], // if coin <= currentAmount && dp[currentAmount-coin] != math.MaxInt32
  },

  dp_comparison: {
    javascript: [9, 10, 11, 12], // Math.min comparison block
    cpp: [13, 14, 15, 16], // min comparison block
    python: [9, 10, 11], // min comparison block
    java: [10, 11, 12, 13], // Math.min comparison block
    rust: [11, 12, 13], // .min comparison block
    typescript: [9, 10, 11, 12], // Math.min comparison block
    go: [14, 15, 16], // manual min comparison
  },

  dp_table_update: {
    javascript: [9, 10, 11, 12], // dp[currentAmount] = Math.min(...)
    cpp: [13, 14, 15, 16], // dp[currentAmount] = min(...)
    python: [9, 10, 11], // dp[current_amount] = min(...)
    java: [10, 11, 12, 13], // dp[currentAmount] = Math.min(...)
    rust: [11, 12, 13], // dp[current_amount] = dp[current_amount].min(...)
    typescript: [9, 10, 11, 12], // dp[currentAmount] = Math.min(...)
    go: [14, 15, 16], // dp[currentAmount] = dp[currentAmount-coin] + 1
  },

  dp_optimal_solution_found: {
    javascript: [17], // return dp[amount] === Infinity ? -1 : dp[amount];
    cpp: [20], // return dp[amount] == INT_MAX ? -1 : dp[amount];
    python: [13], // return dp[amount] if dp[amount] != float('inf') else -1
    java: [17], // return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
    rust: [17], // if dp[amount] == i32::MAX { -1 } else { dp[amount] }
    typescript: [17], // return dp[amount] === Infinity ? -1 : dp[amount];
    go: [20, 21, 22], // if dp[amount] == math.MaxInt32 return statements
  },

  dp_no_solution: {
    javascript: [17], // return dp[amount] === Infinity ? -1 : dp[amount];
    cpp: [20], // return dp[amount] == INT_MAX ? -1 : dp[amount];
    python: [13], // return dp[amount] if dp[amount] != float('inf') else -1
    java: [17], // return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
    rust: [17], // if dp[amount] == i32::MAX { -1 } else { dp[amount] }
    typescript: [17], // return dp[amount] === Infinity ? -1 : dp[amount];
    go: [20, 21], // if dp[amount] == math.MaxInt32 { return -1 }
  },

  return: {
    javascript: [17], // return dp[amount] === Infinity ? -1 : dp[amount];
    cpp: [20], // return dp[amount] == INT_MAX ? -1 : dp[amount];
    python: [13], // return dp[amount] if dp[amount] != float('inf') else -1
    java: [17], // return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
    rust: [17], // if dp[amount] == i32::MAX { -1 } else { dp[amount] }
    typescript: [17], // return dp[amount] === Infinity ? -1 : dp[amount];
    go: [22], // return dp[amount]
  },

  initialization: {
    javascript: [1], // function coinChange(coins, amount) {
    cpp: [6], // int coinChange(vector<int>& coins, int amount) {
    python: [1], // def coin_change(coins, amount):
    java: [3], // public static int coinChange(int[] coins, int amount) {
    rust: [1], // fn coin_change(coins: Vec<i32>, amount: i32) -> i32 {
    typescript: [1], // function coinChange(coins: number[], amount: number): number {
    go: [6], // func coinChange(coins []int, amount int) int {
  },
};

// register the mapping
export const COIN_CHANGE_ALGORITHM_ID = "coin-change";
