// 了解しました。それでは **N-Queens の解の個数を求める関数** を JavaScript (Node.js 18.16.1) で実装します。
// 要求通り **クラスは使わず関数のみ** で記述し、処理時間・メモリ効率を考慮して **ビット演算による高速化** を行います。

// ```javascript
/**
 * n-queens puzzle の解の総数を返す関数
 * @param {number} n - チェス盤のサイズ (1 <= n <= 9)
 * @returns {number} - n-queens の異なる解の数
 */
function totalNQueens(n) {
    // 解の数を格納する変数
    let count = 0;

    // 再帰DFS関数
    /**
     * @param {number} row - 現在の行
     * @param {number} cols - 既に使用中の列 (bitmask)
     * @param {number} diag1 - 既に使用中の対角線 (↘方向)
     * @param {number} diag2 - 既に使用中の対角線 (↙方向)
     */
    function dfs(row, cols, diag1, diag2) {
        if (row === n) {
            count++;
            return;
        }

        // n ビットの範囲で「まだ置ける場所」を計算
        let available = ((1 << n) - 1) & ~(cols | diag1 | diag2);

        while (available) {
            // 最右の1ビットを取り出す
            let bit = available & -available;
            available -= bit;
            // 次の行へ進む（列・対角線を更新）
            dfs(row + 1, cols | bit, (diag1 | bit) << 1, (diag2 | bit) >> 1);
        }
    }

    dfs(0, 0, 0, 0);
    return count;
}
// ```

// ---

// ### 処理時間・メモリについて

// * **時間計算量**:
//   n が最大 9 なので、バックトラッキングでも十分高速です。
//   ただし列・対角線の衝突判定をビットマスクで管理することで
//   `O(n!)` から実質的に大幅削減されています。
// * **メモリ消費量**:
//   再帰の深さは最大 n (≤ 9) で、各ステップの局所変数のみを保持するため
//   **スタック消費は軽微** です。

// ---

// この関数をそのまま LeetCode に提出する場合は：

// ```javascript
// var totalNQueens = function(n) {
//     let count = 0;

//     function dfs(row, cols, diag1, diag2) {
//         if (row === n) {
//             count++;
//             return;
//         }
//         let available = ((1 << n) - 1) & ~(cols | diag1 | diag2);
//         while (available) {
//             let bit = available & -available;
//             available -= bit;
//             dfs(row + 1, cols | bit, (diag1 | bit) << 1, (diag2 | bit) >> 1);
//         }
//     }

//     dfs(0, 0, 0, 0);
//     return count;
// };
