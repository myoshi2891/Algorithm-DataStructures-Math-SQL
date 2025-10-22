// # 1. 問題の分析

// ### 競技プログラミング視点

// * **本質**: `word1` を `word2` に変換する最小操作回数 → 動的計画法（DP）で解く典型問題。
// * **制約**: 長さ最大 500 → O(n\*m) = 250,000 ステート。十分高速。
// * **最適化**: DP 行列をそのまま持つと 500×500=25万要素（約1MB程度）。問題なし。ただし O(min(n,m)) 行のみに縮小も可能。

// ### 業務開発視点

// * 可読性のために「DPテーブル方式」を採用。
// * 名前を分かりやすく (`dp` = current row, `prev` = previous row)。
// * 入力検証を明示。空文字ケースもカバー。

// ### JavaScript特有の考慮点

// * V8向け最適化: `for` ループを使用し、配列サイズ固定で再利用。
// * `Array.fill` による初期化は許容、内部で高速。
// * `Math.min` の呼び出しはホットパスなので、3値比較を直接書く方が速い場合もある。
// * GC削減のため `prev` と `curr` の配列を再利用し、スワップで回す。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ         | 時間計算量 | 空間計算量       | JS実装コスト | 可読性 | 備考            |
// | ------------- | ----- | ----------- | ------- | --- | ------------- |
// | 方法A: フルDPテーブル | O(nm) | O(nm)       | 低       | 高   | 可視化しやすいがメモリ増  |
// | 方法B: 2行DP最適化  | O(nm) | O(min(n,m)) | 中       | 高   | メモリ削減。業務でも十分  |
// | 方法C: 再帰+メモ化   | O(nm) | O(nm)       | 高       | 中   | 実装複雑化、スタックリスク |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**: 方法B（2行DP最適化）。
// * **理由**:

//   * O(nm) 時間で十分。
//   * メモリは O(min(n,m)) に抑えられるため拡張性も良い。
//   * 実装の見通しも悪くない。
// * **JS特有の最適化ポイント**:

//   * ループは `for`。
//   * `curr` 配列を初期化時に `fill` で全長確保。
//   * `prev`/`curr` をスワップし再利用。

// ---

// # 4. コード実装（solution.js）

// ```javascript
'use strict';
// CommonJS モジュール形式

/**
 * 編集距離 (Levenshtein Distance)
 * @param {string} word1 - 入力文字列1（小文字英字のみ）
 * @param {string} word2 - 入力文字列2（小文字英字のみ）
 * @returns {number} word1 を word2 に変換する最小操作回数
 * @throws {TypeError} 入力が文字列でない場合
 * @throws {RangeError} 文字列長が制約(0〜500)を超える場合
 * @complexity Time O(n*m), Space O(min(n,m))
 */
var minDistance = function (word1, word2) {
    if (typeof word1 !== 'string' || typeof word2 !== 'string') {
        throw new TypeError('Inputs must be strings');
    }
    const n = word1.length;
    const m = word2.length;
    if (n > 500 || m > 500) {
        throw new RangeError('Input length exceeds limit');
    }

    // 短い方を基準にして空間 O(min(n,m)) にする
    if (n < m) {
        return minDistance(word2, word1);
    }

    // m <= n
    const prev = new Array(m + 1);
    const curr = new Array(m + 1);

    // 初期化: word1 が空の場合
    for (let j = 0; j <= m; j++) prev[j] = j;

    for (let i = 1; i <= n; i++) {
        curr[0] = i; // word2 が空なら i 回削除
        for (let j = 1; j <= m; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                curr[j] = prev[j - 1];
            } else {
                let del = prev[j] + 1; // 削除
                let ins = curr[j - 1] + 1; // 挿入
                let rep = prev[j - 1] + 1; // 置換
                // Math.min を避け 3値比較で高速化
                let min = del < ins ? del : ins;
                if (rep < min) min = rep;
                curr[j] = min;
            }
        }
        // スワップ
        for (let j = 0; j <= m; j++) prev[j] = curr[j];
    }
    return prev[m];
};

module.exports = { minDistance };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * `for` ループ採用 → JIT 最適化有利。
// * `prev`/`curr` を再利用 → GC削減。
// * 3値比較を if で展開し `Math.min` 呼び出し回避。
// * 入力長制約を守りエラーハンドリングを明示。

// ---

// ✅ これで **LeetCode フォーマット（`var minDistance = function(...)`）準拠**,
// ✅ **Node.js v18 + CommonJS で単体実行可能** なコードになっています。
