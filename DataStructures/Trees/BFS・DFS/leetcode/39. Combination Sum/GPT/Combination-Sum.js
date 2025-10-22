// ```javascript
Runtime;
1;
ms;
Beats;
97.55 % Memory;
59.64;
MB;
Beats;
65.89 %
    /**
     * Function: combinationSum
     * -------------------------
     * Returns all unique combinations of numbers from `candidates` that sum up to `target`.
     * Each number from `candidates` can be used an unlimited number of times.
     *
     * @param {number[]} candidates - Distinct integers available for combination (length ≤ 30, 2 ≤ value ≤ 40)
     * @param {number} target - Target sum to achieve (1 ≤ target ≤ 40)
     * @returns {number[][]} - Array of unique combinations where sum equals target
     *
     * Time Complexity: O(N^(T/M)) in the worst case
     *   - N = number of candidates
     *   - T = target value
     *   - M = smallest candidate value
     *   (Efficient pruning is used to avoid unnecessary recursion)
     * Memory Usage: O(T/M) for recursion stack + O(#combinations) for results
     *   - Given constraints, memory remains low
     */
    function combinationSumJs(candidates, target) {
        const res = [];
        const path = [];

        /**
         * DFS (backtracking) helper function
         * @param {number} start - Current index in candidates to consider
         * @param {number} sum - Current sum of the chosen numbers
         */
        function dfs(start, sum) {
            // If we reach the target, store the current combination
            if (sum === target) {
                res.push([...path]);
                return;
            }

            // Loop through candidates starting from `start` to avoid duplicates
            for (let i = start; i < candidates.length; i++) {
                const nextSum = sum + candidates[i];
                // Prune branches where sum exceeds target
                if (nextSum > target) continue;

                path.push(candidates[i]); // Choose candidate
                dfs(i, nextSum); // Allow reuse of same number
                path.pop(); // Backtrack
            }
        }

        dfs(0, 0);
        return res;
    };
// ```

// この実装は

// * **再帰的DFS（深さ優先探索）＋バックトラッキング** を用いて全探索
// * **ソート不要**（ただし、ソートすれば更に枝刈りが効く場合あり）
// * **メモリ効率**は、`path`と`res`のみ保持し、再帰の深さも`target / min(candidates)`程度

// これならLeetCode制約（最大150通りの組み合わせ）でも十分高速に動作します。
