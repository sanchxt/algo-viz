import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface CoinChangeState {
  dpTable: number[]; // dp[i] = minimum coins needed for amount i
  pathTable: number[]; // pathTable[i] = coin used to achieve amount i
  coins: number[]; // available coin denominations
  targetAmount: number; // target amount to make
  currentAmount?: number; // amount currently being processed
  currentCoin?: number; // coin currently being considered
  isProcessingComplete: boolean;
}

/**
 * generates steps for coin change problem using dynamic programming.
 * finds minimum number of coins needed to make target amount.
 * @param {number[]} coins - array of available coin denominations
 * @param {number} amount - target amount to make
 * @returns {EnhancedAlgorithmStep[]} array of steps representing the DP solution
 */
export const generateCoinChangeSteps = (
  coins: number[],
  amount: number
): EnhancedAlgorithmStep[] => {
  const steps: EnhancedAlgorithmStep[] = [];
  let stepId = 0;

  // input validation
  if (amount < 0 || coins.length === 0) {
    steps.push({
      id: stepId++,
      dataStructures: {
        dpTable: {
          type: "array",
          data: [],
          metadata: { label: "DP Table", position: { x: 0, y: 0 } },
        },
        coins: {
          type: "array",
          data: coins,
          metadata: { label: "Available Coins", position: { x: 1, y: 0 } },
        },
      },
      highlights: {},
      stepType: "dp_no_solution",
      explanation:
        "Invalid input: amount must be non-negative and coins array must not be empty.",
      variables: { targetAmount: amount, coins: coins.join(", ") },
      timing: { duration: 2000 },
    });
    return steps;
  }

  // sort coins for better visualization (largest to smallest)
  const sortedCoins = [...coins].sort((a, b) => a - b);

  // initialize state
  const state: CoinChangeState = {
    dpTable: new Array(amount + 1).fill(Infinity),
    pathTable: new Array(amount + 1).fill(-1),
    coins: sortedCoins,
    targetAmount: amount,
    isProcessingComplete: false,
  };

  // step 1: initialization
  state.dpTable[0] = 0; // base case: 0 coins needed for amount 0

  steps.push({
    id: stepId++,
    dataStructures: {
      dpTable: {
        type: "array",
        data: [...state.dpTable],
        metadata: {
          label: "DP Table (min coins needed)",
          position: { x: 0, y: 0 },
        },
      },
      coins: {
        type: "array",
        data: state.coins,
        metadata: { label: "Available Coins", position: { x: 1, y: 0 } },
      },
      pathTable: {
        type: "array",
        data: [...state.pathTable],
        metadata: { label: "Path Reconstruction", position: { x: 0, y: 1 } },
      },
    },
    highlights: {
      dpTable: [{ type: "indices", values: [0], style: "highlight" }],
    },
    stepType: "dp_table_initialization",
    explanation: `Initializing DP table: dp[0] = 0 (base case), all other values = ∞. We'll find minimum coins needed for each amount from 0 to ${amount}.`,
    variables: {
      targetAmount: amount,
      coins: sortedCoins.join(", "),
      tableSize: amount + 1,
      baseCase: "dp[0] = 0",
    },
    timing: { duration: 2000 },
  });

  // main DP loop: for each amount from 1 to target
  for (let currentAmount = 1; currentAmount <= amount; currentAmount++) {
    state.currentAmount = currentAmount;

    // step: start processing current amount
    steps.push({
      id: stepId++,
      dataStructures: {
        dpTable: {
          type: "array",
          data: [...state.dpTable],
          metadata: {
            label: "DP Table (min coins needed)",
            position: { x: 0, y: 0 },
          },
        },
        coins: {
          type: "array",
          data: state.coins,
          metadata: { label: "Available Coins", position: { x: 1, y: 0 } },
        },
        pathTable: {
          type: "array",
          data: [...state.pathTable],
          metadata: { label: "Path Reconstruction", position: { x: 0, y: 1 } },
        },
      },
      highlights: {
        dpTable: [
          { type: "indices", values: [currentAmount], style: "active" },
        ],
      },
      stepType: "dp_amount_processing",
      stepContext: {
        operation: "read",
        dataStructure: "array",
        currentAmount,
        targetAmount: amount,
      },
      explanation: `Processing amount ${currentAmount}. Finding minimum coins needed by trying each available coin denomination.`,
      variables: {
        currentAmount,
        targetAmount: amount,
        currentValue:
          state.dpTable[currentAmount] === Infinity
            ? "∞"
            : state.dpTable[currentAmount],
      },
      timing: { duration: 1000 },
    });

    // try each coin denomination
    for (const coin of sortedCoins) {
      state.currentCoin = coin;

      // step: consider current coin
      steps.push({
        id: stepId++,
        dataStructures: {
          dpTable: {
            type: "array",
            data: [...state.dpTable],
            metadata: {
              label: "DP Table (min coins needed)",
              position: { x: 0, y: 0 },
            },
          },
          coins: {
            type: "array",
            data: state.coins,
            metadata: { label: "Available Coins", position: { x: 1, y: 0 } },
          },
          pathTable: {
            type: "array",
            data: [...state.pathTable],
            metadata: {
              label: "Path Reconstruction",
              position: { x: 0, y: 1 },
            },
          },
        },
        highlights: {
          dpTable: [
            { type: "indices", values: [currentAmount], style: "active" },
          ],
          coins: [
            {
              type: "indices",
              values: [sortedCoins.indexOf(coin)],
              style: "highlight",
            },
          ],
        },
        stepType: "dp_coin_consideration",
        stepContext: {
          operation: "compare",
          dataStructure: "array",
          currentAmount,
          coinValue: coin,
        },
        explanation: `Considering coin ${coin} for amount ${currentAmount}. ${
          coin > currentAmount
            ? `Cannot use coin ${coin} as it's larger than amount ${currentAmount}.`
            : `Can we use coin ${coin}? Need to check dp[${
                currentAmount - coin
              }].`
        }`,
        variables: {
          currentAmount,
          currentCoin: coin,
          canUseCoin: coin <= currentAmount,
        },
        timing: { duration: 1200 },
      });

      // check if coin can be used
      if (coin <= currentAmount) {
        const subproblemAmount = currentAmount - coin;
        const subproblemValue = state.dpTable[subproblemAmount];

        // step: lookup subproblem
        steps.push({
          id: stepId++,
          dataStructures: {
            dpTable: {
              type: "array",
              data: [...state.dpTable],
              metadata: {
                label: "DP Table (min coins needed)",
                position: { x: 0, y: 0 },
              },
            },
            coins: {
              type: "array",
              data: state.coins,
              metadata: { label: "Available Coins", position: { x: 1, y: 0 } },
            },
            pathTable: {
              type: "array",
              data: [...state.pathTable],
              metadata: {
                label: "Path Reconstruction",
                position: { x: 0, y: 1 },
              },
            },
          },
          highlights: {
            dpTable: [
              { type: "indices", values: [currentAmount], style: "active" },
              {
                type: "indices",
                values: [subproblemAmount],
                style: "highlight",
              },
            ],
            coins: [
              {
                type: "indices",
                values: [sortedCoins.indexOf(coin)],
                style: "highlight",
              },
            ],
          },
          stepType: "dp_subproblem_lookup",
          stepContext: {
            operation: "read",
            dataStructure: "array",
            currentAmount,
            coinValue: coin,
            subproblemAmount,
          },
          explanation: `Looking up subproblem: dp[${subproblemAmount}] = ${
            subproblemValue === Infinity ? "∞" : subproblemValue
          }. ${
            subproblemValue === Infinity
              ? `Cannot make amount ${subproblemAmount}, so cannot use coin ${coin}.`
              : `If we use coin ${coin}, we need ${subproblemValue} + 1 = ${
                  subproblemValue + 1
                } total coins.`
          }`,
          variables: {
            currentAmount,
            currentCoin: coin,
            subproblemAmount,
            subproblemValue:
              subproblemValue === Infinity ? "∞" : subproblemValue,
          },
          timing: { duration: 1500 },
        });

        // if subproblem has solution, consider this option
        if (subproblemValue !== Infinity) {
          const newValue = subproblemValue + 1;
          const currentValue = state.dpTable[currentAmount];

          // step: comparison
          steps.push({
            id: stepId++,
            dataStructures: {
              dpTable: {
                type: "array",
                data: [...state.dpTable],
                metadata: {
                  label: "DP Table (min coins needed)",
                  position: { x: 0, y: 0 },
                },
              },
              coins: {
                type: "array",
                data: state.coins,
                metadata: {
                  label: "Available Coins",
                  position: { x: 1, y: 0 },
                },
              },
              pathTable: {
                type: "array",
                data: [...state.pathTable],
                metadata: {
                  label: "Path Reconstruction",
                  position: { x: 0, y: 1 },
                },
              },
            },
            highlights: {
              dpTable: [
                { type: "indices", values: [currentAmount], style: "compare" },
              ],
              coins: [
                {
                  type: "indices",
                  values: [sortedCoins.indexOf(coin)],
                  style: "highlight",
                },
              ],
            },
            stepType: "dp_comparison",
            stepContext: {
              operation: "compare",
              dataStructure: "array",
              currentAmount,
              coinValue: coin,
              comparisonValues: [currentValue, newValue],
            },
            explanation: `Comparing options: current minimum = ${
              currentValue === Infinity ? "∞" : currentValue
            }, using coin ${coin} = ${newValue}. ${
              newValue < currentValue
                ? `New option is better! Update dp[${currentAmount}] = ${newValue}`
                : `Current option is better, no update needed.`
            }`,
            variables: {
              currentAmount,
              currentCoin: coin,
              currentMin: currentValue === Infinity ? "∞" : currentValue,
              newOption: newValue,
              willUpdate: newValue < currentValue,
            },
            timing: { duration: 1500 },
          });

          // update if better
          if (newValue < currentValue) {
            state.dpTable[currentAmount] = newValue;
            state.pathTable[currentAmount] = coin;

            steps.push({
              id: stepId++,
              dataStructures: {
                dpTable: {
                  type: "array",
                  data: [...state.dpTable],
                  metadata: {
                    label: "DP Table (min coins needed)",
                    position: { x: 0, y: 0 },
                  },
                },
                coins: {
                  type: "array",
                  data: state.coins,
                  metadata: {
                    label: "Available Coins",
                    position: { x: 1, y: 0 },
                  },
                },
                pathTable: {
                  type: "array",
                  data: [...state.pathTable],
                  metadata: {
                    label: "Path Reconstruction",
                    position: { x: 0, y: 1 },
                  },
                },
              },
              highlights: {
                dpTable: [
                  { type: "indices", values: [currentAmount], style: "swap" },
                ],
                pathTable: [
                  { type: "indices", values: [currentAmount], style: "swap" },
                ],
                coins: [
                  {
                    type: "indices",
                    values: [sortedCoins.indexOf(coin)],
                    style: "match",
                  },
                ],
              },
              stepType: "dp_table_update",
              stepContext: {
                operation: "write",
                dataStructure: "array",
                currentAmount,
                coinValue: coin,
                pathCoin: coin,
              },
              explanation: `Updated! dp[${currentAmount}] = ${newValue}, path[${currentAmount}] = ${coin}. Found better solution using coin ${coin}.`,
              variables: {
                currentAmount,
                newValue,
                coinUsed: coin,
                improvement:
                  currentValue === Infinity ? "∞" : currentValue - newValue,
              },
              timing: { duration: 1200 },
            });
          }
        }
      }
    }
  }

  // processing complete
  state.isProcessingComplete = true;
  const finalResult = state.dpTable[amount];

  if (finalResult === Infinity) {
    // no solution exists
    steps.push({
      id: stepId++,
      dataStructures: {
        dpTable: {
          type: "array",
          data: [...state.dpTable],
          metadata: {
            label: "DP Table (min coins needed)",
            position: { x: 0, y: 0 },
          },
        },
        coins: {
          type: "array",
          data: state.coins,
          metadata: { label: "Available Coins", position: { x: 1, y: 0 } },
        },
        pathTable: {
          type: "array",
          data: [...state.pathTable],
          metadata: { label: "Path Reconstruction", position: { x: 0, y: 1 } },
        },
      },
      highlights: {
        dpTable: [{ type: "indices", values: [amount], style: "mismatch" }],
      },
      stepType: "dp_no_solution",
      explanation: `No solution exists! Cannot make amount ${amount} with the given coins [${sortedCoins.join(
        ", "
      )}].`,
      variables: {
        targetAmount: amount,
        finalResult: "No solution",
        canMakeAmount: false,
      },
      timing: { duration: 2000 },
    });
  } else {
    // solution found, reconstruct path
    const path: number[] = [];
    let currentAmount = amount;

    steps.push({
      id: stepId++,
      dataStructures: {
        dpTable: {
          type: "array",
          data: [...state.dpTable],
          metadata: {
            label: "DP Table (min coins needed)",
            position: { x: 0, y: 0 },
          },
        },
        coins: {
          type: "array",
          data: state.coins,
          metadata: { label: "Available Coins", position: { x: 1, y: 0 } },
        },
        pathTable: {
          type: "array",
          data: [...state.pathTable],
          metadata: { label: "Path Reconstruction", position: { x: 0, y: 1 } },
        },
      },
      highlights: {
        dpTable: [{ type: "indices", values: [amount], style: "match" }],
      },
      stepType: "dp_optimal_solution_found",
      explanation: `Optimal solution found! Minimum ${finalResult} coins needed for amount ${amount}. Now reconstructing the path...`,
      variables: {
        targetAmount: amount,
        minCoinsNeeded: finalResult,
        canMakeAmount: true,
      },
      timing: { duration: 1500 },
    });

    // reconstruct path
    while (currentAmount > 0) {
      const coinUsed = state.pathTable[currentAmount];
      path.push(coinUsed);

      steps.push({
        id: stepId++,
        dataStructures: {
          dpTable: {
            type: "array",
            data: [...state.dpTable],
            metadata: {
              label: "DP Table (min coins needed)",
              position: { x: 0, y: 0 },
            },
          },
          coins: {
            type: "array",
            data: state.coins,
            metadata: { label: "Available Coins", position: { x: 1, y: 0 } },
          },
          pathTable: {
            type: "array",
            data: [...state.pathTable],
            metadata: {
              label: "Path Reconstruction",
              position: { x: 0, y: 1 },
            },
          },
        },
        highlights: {
          dpTable: [
            { type: "indices", values: [currentAmount], style: "active" },
          ],
          pathTable: [
            { type: "indices", values: [currentAmount], style: "highlight" },
          ],
          coins: [
            {
              type: "indices",
              values: [sortedCoins.indexOf(coinUsed)],
              style: "match",
            },
          ],
        },
        stepType: "dp_path_reconstruction",
        stepContext: {
          operation: "read",
          dataStructure: "array",
          currentAmount,
          pathCoin: coinUsed,
        },
        explanation: `Path reconstruction: For amount ${currentAmount}, we used coin ${coinUsed}. Next, check amount ${
          currentAmount - coinUsed
        }.`,
        variables: {
          currentAmount,
          coinUsed,
          nextAmount: currentAmount - coinUsed,
          pathSoFar: path.join(", "),
        },
        timing: { duration: 1200 },
      });

      currentAmount -= coinUsed;
    }

    // final result
    steps.push({
      id: stepId++,
      dataStructures: {
        dpTable: {
          type: "array",
          data: [...state.dpTable],
          metadata: {
            label: "DP Table (min coins needed)",
            position: { x: 0, y: 0 },
          },
        },
        coins: {
          type: "array",
          data: state.coins,
          metadata: { label: "Available Coins", position: { x: 1, y: 0 } },
        },
        pathTable: {
          type: "array",
          data: [...state.pathTable],
          metadata: { label: "Path Reconstruction", position: { x: 0, y: 1 } },
        },
      },
      highlights: {
        dpTable: [{ type: "indices", values: [amount], style: "match" }],
        coins: [
          {
            type: "indices",
            values: path.map((coin) => sortedCoins.indexOf(coin)),
            style: "match",
          },
        ],
      },
      stepType: "return",
      explanation: `Complete! Minimum ${finalResult} coins needed: [${path.join(
        ", "
      )}]. Total value: ${path.reduce(
        (sum, coin) => sum + coin,
        0
      )} = ${amount}.`,
      variables: {
        targetAmount: amount,
        minCoinsNeeded: finalResult,
        optimalCoins: path.join(", "),
        totalValue: path.reduce((sum, coin) => sum + coin, 0),
        solutionFound: true,
      },
      timing: { duration: 2500 },
    });
  }

  return steps;
};

export default generateCoinChangeSteps;
