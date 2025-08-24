// では **TypeScript 5.1 (Node.js 18.16.1)** で、LeetCode 仕様に合わせて **N-Queens の解の個数を返す関数** を実装します。

// 処理効率を考慮し、前回と同様に **ビットマスクを用いたバックトラッキング** を採用します。
// これにより「列・対角線の衝突判定」が `O(1)` で行え、探索を効率化できます。

// ---

// ```typescript
/**
 * n-queens puzzle の解の総数を返す関数
 * @param n - チェス盤のサイズ (1 <= n <= 9)
 * @returns number - n-queens の異なる解の数
 */
function totalNQueensGPT(n: number): number {
    let count = 0;

    /**
     * 深さ優先探索 (バックトラッキング)
     * @param row - 現在の行
     * @param cols - 既に使用中の列 (bitmask)
     * @param diag1 - 既に使用中の対角線 (↘方向, bitmask)
     * @param diag2 - 既に使用中の対角線 (↙方向, bitmask)
     * @returns void
     */
    function dfs(row: number, cols: number, diag1: number, diag2: number): void {
        if (row === n) {
            count++;
            return;
        }

        // 置ける場所 (n ビット分だけ残す)
        let available = ((1 << n) - 1) & ~(cols | diag1 | diag2);

        while (available) {
            // 最右ビットを抽出
            const bit = available & -available;
            available -= bit;
            dfs(row + 1, cols | bit, (diag1 | bit) << 1, (diag2 | bit) >> 1);
        }
    }

    dfs(0, 0, 0, 0);
    return count;
}
// ```

// ---

// ### 🔎 処理時間・メモリの評価

// * **時間計算量**
//   最大で n=9。バックトラッキングは指数的ですが、ビットマスクを利用することで
//   盤面チェックを `O(1)` に短縮でき、LeetCode 制限下でも高速に動作します。
// * **メモリ消費量**

//   * 再帰の深さは最大 n (≤ 9)
//   * 各再帰ステップで利用する整数 (cols, diag1, diag2) は 32bit 数値
//     よってスタック消費も軽微で **O(n)** に収まります。

// ---

// ✅ このまま `function totalNQueens(n: number): number` を LeetCode に提出すれば動作します。
