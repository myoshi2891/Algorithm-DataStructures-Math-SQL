// # 回答

// ## 1. 問題の分析

// ### 競技プログラミング視点

// * **探索範囲**: 盤面は最大 6x6、word の長さは最大 15
// * **アルゴリズム**: DFS + バックトラッキングで十分高速
// * **計算量**: `O(m * n * 4^L)`（L = word.length）
// * **メモリ効率**: visited配列を使わず盤面を一時的に上書きして復元する方式で O(1) 追加メモリ

// ### 業務開発視点

// * **型安全性**: `string[][]` や `string` を明確に型定義
// * **可読性**: DFS をヘルパー関数に分離
// * **エラーハンドリング**: 型不正なら `TypeError`、制約超過なら `RangeError` を投げる

// ### TypeScript特有の考慮点

// * **readonly型**: 入力を変更しない契約を型で表現
// * **null安全性**: 境界条件を明示的にチェック
// * **ジェネリクスは不要**: word と board は固定型なのでシンプルな型で十分
// * **strict mode**: 厳格な型チェックで潜在バグを防止

// ---

// ## 2. アルゴリズムアプローチ比較

// | アプローチ                 | 時間計算量            | 空間計算量     | TS実装コスト | 型安全性 | 可読性 | 備考            |
// | --------------------- | ---------------- | --------- | ------- | ---- | --- | ------------- |
// | 方法A: DFS + 盤面破壊的マーキング | O(m \* n \* 4^L) | O(1)      | 低       | 高    | 中   | 高速・省メモリ       |
// | 方法B: DFS + visited配列  | O(m \* n \* 4^L) | O(m \* n) | 中       | 高    | 高   | 分かりやすいがメモリ使用増 |
// | 方法C: Trie構築 + DFS     | O(N \* L)        | O(N \* L) | 高       | 中    | 中   | 複数単語探索向け      |

// ---

// ## 3. 選択したアルゴリズムと理由

// * **選択**: 方法A（DFS + 盤面破壊的マーキング）
// * **理由**:

//   * 制約が小さいため DFS で十分
//   * visited配列不要でメモリ効率良好
//   * TypeScriptでの型定義もシンプルで安全
// * **TypeScript最適化**:

//   * `readonly string[][]` 型で不変性を表現
//   * DFS の引数を `number` と `number` で明示し、境界条件で null を排除

// ---

// ## 4. コード実装（solution.ts）

// ```typescript
/**
 * Word Search - 指定した単語が盤面に存在するか判定する
 * @param board - 盤面（文字グリッド）
 * @param word - 探索対象の単語
 * @returns true: 存在する / false: 存在しない
 * @throws {TypeError} 入力型が不正な場合
 * @throws {RangeError} 制約を超える場合
 * @complexity Time: O(m * n * 4^L), Space: O(1) (再帰スタック除く)
 */
export function exist(board: readonly string[][], word: string): boolean {
  // --- 入力検証 ---
  if (!Array.isArray(board) || board.length === 0) {
    throw new TypeError("board must be a non-empty 2D array");
  }
  const m = board.length;
  const n = board[0].length;

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

  // --- DFS ヘルパー ---
  const dfs = (row: number, col: number, idx: number): boolean => {
    if (idx === word.length) return true;
    if (row < 0 || col < 0 || row >= m || col >= n) return false;
    if (board[row][col] !== word[idx]) return false;

    // 使用済みマーキング
    const tmp = board[row][col];
    (board as string[][])[row][col] = "#"; // 一時的に書き換え

    // 上下左右へ探索
    const found =
      dfs(row + 1, col, idx + 1) ||
      dfs(row - 1, col, idx + 1) ||
      dfs(row, col + 1, idx + 1) ||
      dfs(row, col - 1, idx + 1);

    // 復元
    (board as string[][])[row][col] = tmp;
    return found;
  };

  // 全セルから探索開始
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (dfs(i, j, 0)) return true;
    }
  }
  return false;
}
// ```

// ---

// ## 5. TypeScript固有の最適化観点

// * **型安全性**

//   * `readonly string[][]` で参照先は不変を保証
//   * 破壊的変更は `(board as string[][])` に限定し、型安全と効率を両立

// * **null安全性**

//   * 境界条件を先にチェック → undefinedアクセスを防止

// * **開発効率**

//   * 型チェックによりバグを事前に防止
//   * JSDoc により IDE 補完とドキュメント性を確保

// ---

// ✅ これで Node.js v18 + TypeScript strict mode (ESM) 環境で `tsc` → `node` 実行可能、LeetCode に提出できる `exist(board, word)` 実装になっています。
