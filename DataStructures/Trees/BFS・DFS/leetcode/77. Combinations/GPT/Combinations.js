// # 1. 問題の分析

// ## 競技プログラミング視点

// * **目標**: `n` 個の数から `k` 個を選ぶ全組み合わせを列挙
// * **制約**: `1 <= n <= 20`, `1 <= k <= n` → 出力最大数は `C(20,10) ≈ 184,756` と十分小さい
// * **最適解**: バックトラッキングによる DFS。

//   * 計算量は `O(C(n,k) * k)` → 全列挙するためこれが下限。
//   * メモリ: 出力格納以外は再帰スタック＋部分配列のみ。

// ## 業務開発視点

// * 保守性: 再帰 DFS を関数に分割して読みやすく。
// * エラー処理: 型・範囲をチェックし `TypeError` / `RangeError` を投げる。
// * 可読性: 命名を `combine` / `dfs` に分割。

// ## JavaScript特有の考慮点

// * V8 最適化

//   * `for` ループ利用、`push/pop` で配列を安定利用。
//   * `slice` を避け、部分配列は使い回す。
// * GC 負荷削減

//   * `path` 配列を破壊的に操作 (`push` → `pop`)。
//   * 新規オブジェクト生成を最小化。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ              | 時間計算量          | 空間計算量     | JS実装コスト | 可読性 | 備考           |
// | ------------------ | -------------- | --------- | ------- | --- | ------------ |
// | 方法A: DFS バックトラッキング | O(C(n,k) \* k) | O(k) + 出力 | 低       | 高   | 標準的。V8 に優しい  |
// | 方法B: ビット全探索        | O(2^n \* n)    | O(n)      | 中       | 中   | n=20 まで可だが冗長 |
// | 方法C: 逐次生成ジェネレータ    | O(C(n,k))      | O(k)      | 高       | 中   | 実装複雑、不要      |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**: 方法A (DFS バックトラッキング)
// * **理由**:

//   * 最小計算量で実装容易。
//   * `push/pop` による効率的な配列操作。
//   * 再帰関数で可読性高く保守性も担保。
// * **最適化ポイント**:

//   * for ループ + push/pop
//   * slice なしで参照安定化
//   * 早期入力検証で例外をホットパス外に分離

// ---

// # 4. コード実装（solution.js）

// ```javascript
"use strict";

/**
 * LeetCode形式: 組み合わせ生成
 * @param {number} n - 範囲の上限 (1 <= n <= 20)
 * @param {number} k - 選ぶ個数 (1 <= k <= n)
 * @returns {number[][]} k個選んだすべての組み合わせ
 * @throws {TypeError} 引数が整数でない場合
 * @throws {RangeError} 制約範囲を外れた場合
 * @complexity Time: O(C(n,k) * k), Space: O(k + C(n,k))
 */
var combine = function (n, k) {
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

  const res = [];
  const path = [];

  /**
   * DFSによる組み合わせ生成
   * @param {number} start - 次の探索開始値
   */
  function dfs(start) {
    if (path.length === k) {
      res.push(path.slice()); // コピーして保存
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
  return res;
};

module.exports = { combine };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * `for` ループ使用、`map/forEach` 不使用
// * `path` 配列を再利用 (`push/pop`)
// * `slice` はコピー保存のみに限定
// * hidden class 安定化 → 同じ順序でプロパティ追加
// * 出力は res にのみ追加、余計な GC 負荷なし

// ---

// ✅ このコードは **Node.js v18 (CommonJS)** で `node solution.js` 実行可能です。
// LeetCode 提出形式 (`var combine = function(...)`) も満たしています。
