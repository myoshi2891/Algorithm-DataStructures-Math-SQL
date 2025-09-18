// # 1. 問題の分析

// ## 競技プログラミング視点

// * **速度**: `n=20` までなので `C(20,10)=184,756` が最大 → DFS バックトラッキングで十分高速。
// * **メモリ**: 出力以外の補助メモリは `O(k)` のみ。`path` を push/pop で再利用することで GC を削減。

// ## 業務開発視点

// * **型安全性**: `n` と `k` を `number` 型で制約し、範囲外は `RangeError`。
// * **可読性・保守性**: DFS 部分を関数化。JSDoc コメントで契約を明示。
// * **エラーハンドリング**:

//   * `TypeError`: 引数が整数でない場合
//   * `RangeError`: 制約違反 (`n < 1` など)

// ## TypeScript特有の考慮点

// * **型推論**: 出力型は `number[][]`。
// * **strict mode**: `undefined` や `null` を避ける設計。
// * **readonly**: 外部に返す出力はイミュータブル。
// * **ジェネリクス不要**: 本問題は数値範囲に限定されるため `number` 固定が最適。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ              | 時間計算量          | 空間計算量     | TS実装コスト | 型安全性 | 可読性 | 備考         |
// | ------------------ | -------------- | --------- | ------- | ---- | --- | ---------- |
// | 方法A: DFS バックトラッキング | O(C(n,k) \* k) | O(k) + 出力 | 低       | 高    | 高   | 標準的で最適     |
// | 方法B: ビット全探索        | O(2^n \* n)    | O(n)      | 中       | 中    | 中   | n=20 までなら可 |
// | 方法C: 逐次生成イテレータ     | O(C(n,k))      | O(k)      | 高       | 高    | 中   | 実装複雑       |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択したアプローチ**: 方法A (DFS バックトラッキング)
// * **理由**:

//   * 最適計算量 (全列挙問題なので不可避)。
//   * `push/pop` による効率的な配列再利用。
//   * TypeScript での型定義がシンプル (`number[][]`)。
// * **TypeScript特有の最適化ポイント**:

//   * 厳格な入力検証 (`Number.isInteger`)
//   * `readonly` 配列型を返却 (外部から変更できない)
//   * JSDoc で型・計算量を明示

// ---

// # 4. 実装コード (solution.ts)

// ```typescript
/**
 * LeetCode形式: Combinations
 * @param n - 範囲の上限 (1 <= n <= 20)
 * @param k - 選ぶ個数 (1 <= k <= n)
 * @returns k個選んだ全ての組み合わせ (読み取り専用配列)
 * @throws {TypeError} n, k が整数でない場合
 * @throws {RangeError} 制約を外れた場合
 * @complexity Time: O(C(n,k) \* k), Space: O(k + C(n,k))
 */
export function combine(n: number, k: number): readonly number[][] {
  // --- 入力検証 ---
  if (!Number.isInteger(n) || !Number.isInteger(k)) {
    throw new TypeError("Arguments n and k must be integers");
  }
  if (n < 1 || n > 20) {
    throw new RangeError("n must be in range [1,20]");
  }
  if (k < 1 || k > n) {
    throw new RangeError("k must be in range [1,n]");
  }

  const result: number[][] = [];
  const path: number[] = [];

  function dfs(start: number): void {
    if (path.length === k) {
      result.push([...path]); // コピーして保存
      return;
    }
    // 残り数が足りない場合は枝刈り
    for (let i = start; i <= n - (k - path.length) + 1; i++) {
      path.push(i);
      dfs(i + 1);
      path.pop();
    }
  }

  dfs(1);
  return result;
}
// ```
// ---

// # 5. TypeScript固有の最適化観点

// * **型安全性**

//   * `number` 型に限定、範囲外は即 `RangeError`。
//   * 出力は `readonly number[][]` で外部改変を防止。

// * **コンパイル時最適化**

//   * `strict` モードにより `null` / `undefined` の混入を防ぐ。
//   * `const` と `readonly` を活用。

// * **開発効率と保守性**

//   * JSDoc で計算量と例外仕様を明示。
//   * DFS を内部関数に分割し可読性を確保。
