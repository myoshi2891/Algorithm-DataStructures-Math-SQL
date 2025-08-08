// ```typescript
// Runtime
// 2
// ms
// Beats
// 87.18%
// Memory
// 61.01
// MB
// Beats
// 51.17%

/**
 * Function: combinationSum
 * -------------------------
 * Returns all unique combinations of numbers from `candidates` that sum up to `target`.
 * Each number from `candidates` can be used an unlimited number of times.
 * 
 * @param candidates - Distinct integers available for combination (length ≤ 30, 2 ≤ value ≤ 40)
 * @param target - Target sum to achieve (1 ≤ target ≤ 40)
 * @returns number[][] - Array of unique combinations where sum equals target
 * 
 * Time Complexity: O(N^(T/M)) in the worst case  
 *   - N = number of candidates  
 *   - T = target value  
 *   - M = smallest candidate value  
 *   (Efficient pruning is used to avoid unnecessary recursion)
 * Memory Usage: O(T/M) for recursion stack + O(#combinations) for results
 *   - Given constraints, memory remains low
 */
function combinationSumGpt(candidates: number[], target: number): number[][] {
    const res: number[][] = [];
    const path: number[] = [];

    /**
     * DFS (backtracking) helper function
     * @param start - Current index in candidates to consider
     * @param sum - Current sum of the chosen numbers
     */
    function dfs(start: number, sum: number): void {
        if (sum === target) {
            res.push([...path]);
            return;
        }

        for (let i = start; i < candidates.length; i++) {
            const nextSum = sum + candidates[i];
            if (nextSum > target) continue; // Pruning

            path.push(candidates[i]);
            dfs(i, nextSum); // Allow reuse of same candidate
            path.pop(); // Backtrack
        }
    }

    dfs(0, 0);
    return res;
}
// ```

// このTypeScript版は、先ほどのJavaScript版と同じく

// * **バックトラッキング**で組み合わせ探索
// * **インデックス制御**で重複防止
// * **枝刈り**で不要な探索を削減

// LeetCode制約（最大150組み合わせ）なら、実行時間・メモリ使用量ともに十分高速です。
