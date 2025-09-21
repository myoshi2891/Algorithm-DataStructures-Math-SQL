// ## 1. 問題の分析

// ### 競技プログラミング視点

// * 盤面の大きさは `m, n <= 6` と小さいため、DFS バックトラッキングが現実的。
// * 単純 DFS だと最大探索は `O(m*n*4^L)`（L は単語長 ≤ 15）
//   → 制約的に十分高速。
// * **探索 pruning**:

//   * 最初の文字が一致するセルからのみ探索開始。
//   * 単語の途中で不一致なら即終了。

// ### 業務開発視点

// * **保守性**: `exist` 本体と `dfs` 補助関数を分離。
// * **可読性**: 変数名は `row, col, idx` など短く明瞭に。
// * **例外処理**: 型チェック・範囲チェックを行い、`TypeError` / `RangeError` を投げる。

// ### JavaScript特有の考慮点

// * **V8最適化**:

//   * forループで走査。
//   * 配列アクセスを安定させる（hidden class 変化を避ける）。
// * **GC対策**:

//   * visited 配列は作らず、盤面を一時的に `'#'` で上書きして再帰終了後に復元（オブジェクト生成を減らす）。

// ---

// ## 2. アルゴリズムアプローチ比較

// | アプローチ                        | 時間計算量      | 空間計算量   | JS実装コスト | 可読性 | 備考           |
// | ---------------------------- | ---------- | ------- | ------- | --- | ------------ |
// | 方法A: DFS バックトラッキング（破壊的マーキング） | O(m*n*4^L) | O(1)追加  | 低       | 中   | 制約下で高速       |
// | 方法B: visited配列を別管理           | O(m*n*4^L) | O(m\*n) | 中       | 高   | 可読性高いがメモリ増   |
// | 方法C: Trie 構築 + DFS           | O(N\*L)    | O(N\*L) | 高       | 中   | 複数word探索時は有効 |

// ---

// ## 3. 選択したアルゴリズムと理由

// * **選択**: 方法A（DFS + 盤面直接マーキング）
// * **理由**:

//   * 制約が小さく O(m*n*4^L) で十分。
//   * visited配列不要で GC 負担減。
//   * 保守性は JSDoc と分割で担保。
// * **JS最適化ポイント**:

//   * `for` インデックス走査。
//   * 盤面を直接破壊的に書き換え、復元。
//   * 一時配列・クロージャを避ける。

// ---

// ## 4. コード実装（solution.js）

// ```js
"use strict";

/**
 * Word Search - 判断関数
 * @param {string[][]} board - m x n の文字グリッド
 * @param {string} word - 探索対象の単語
 * @returns {boolean} - 存在すれば true
 * @throws {TypeError} - 入力型が不正な場合
 * @throws {RangeError} - 制約違反の場合
 * @complexity 時間計算量: O(m * n * 4^L), 空間計算量: O(1) (再帰スタック除く)
 */
function exist(board, word) {
  // --- 入力検証 ---
  if (!Array.isArray(board) || board.length === 0) {
    throw new TypeError("board must be a non-empty 2D array");
  }
  const m = board.length;
  const n = board[0].length;
  if (!Number.isInteger(m) || !Number.isInteger(n)) {
    throw new TypeError("board must be a 2D array of strings");
  }
  if (m < 1 || m > 6 || n < 1 || n > 6) {
    throw new RangeError("board size out of range (1 <= m,n <= 6)");
  }
  for (let i = 0; i < m; i++) {
    if (!Array.isArray(board[i]) || board[i].length !== n) {
      throw new TypeError("board must be rectangular 2D array");
    }
    for (let j = 0; j < n; j++) {
      if (typeof board[i][j] !== "string" || board[i][j].length !== 1) {
        throw new TypeError("board cells must be single characters");
      }
    }
  }
  if (typeof word !== "string" || word.length < 1 || word.length > 15) {
    throw new RangeError("word length must be 1 <= len <= 15");
  }

  // --- DFS 本体 ---
  function dfs(row, col, idx) {
    if (idx === word.length) return true; // 完成
    if (row < 0 || col < 0 || row >= m || col >= n) return false;
    if (board[row][col] !== word[idx]) return false;

    // 使用済みにマーキング
    const tmp = board[row][col];
    board[row][col] = "#";

    // 上下左右探索
    const found =
      dfs(row + 1, col, idx + 1) ||
      dfs(row - 1, col, idx + 1) ||
      dfs(row, col + 1, idx + 1) ||
      dfs(row, col - 1, idx + 1);

    // 復元
    board[row][col] = tmp;

    return found;
  }

  // 全セルから開始
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (dfs(i, j, 0)) return true;
    }
  }

  return false;
}

module.exports = { exist };
// ```

// ---

// ## 5. 追加メモ（JS最適化チェックリスト）

// * **for ループ使用** → hidden class 崩壊防止。
// * **盤面直接マーキング** → visited配列不要、GC削減。
// * **入力検証は早期** → ホットパスに入らない。
// * **クロージャ削減** → `dfs` は内部関数だが引数固定。

// ---

// ✅ これで Node.js v18 で `node solution.js` 実行可能、LeetCode 形式の関数 `exist(board, word)` が提供されます。
