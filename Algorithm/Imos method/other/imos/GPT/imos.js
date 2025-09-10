// # 1. 問題の分析

// ### 競技プログラミング視点

// * **速度**:

//   * Q, N ≤ 1000 なので O(NQ) でも実行可能だが、より効率的に O(N+Q) の「いもす法」を用いる。
// * **メモリ**:

//   * 配列長 N+2 の差分配列を使うだけ。N=1000 程度なので軽量。
// * **破壊的更新**:

//   * 累積和で1パス。特別なストリーム化不要。

// ### 業務開発視点

// * **保守性/可読性**:

//   * 入力検証を行い、範囲外や不正値は例外を投げる。
//   * 関数に分離（pure function）＋JSDocで意図を明示。
// * **エラーハンドリング**:

//   * 型不一致は `TypeError`
//   * 制約違反は `RangeError`

// ### JavaScript特有の考慮

// * **V8最適化**:

//   * `for` ループを利用して hidden class 安定化。
//   * `Array.fill(0)` で単型配列を確保。
// * **GC対策**:

//   * 一時オブジェクトやクロージャを作らず、再利用可能な変数を利用。
// * **配列操作**:

//   * `shift/unshift` は避ける。
//   * 差分配列は固定長で作成。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ             | 時間計算量          | 空間計算量 | JS実装コスト | 可読性 | 備考            |
// | ----------------- | -------------- | ----- | ------- | --- | ------------- |
// | 方法A: いもす法         | O(N+Q)         | O(N)  | 低       | 高   | 差分配列＋累積和      |
// | 方法B: 各区間を都度加算     | O(NQ)          | O(N)  | 低       | 中   | N, Q が大きいと非効率 |
// | 方法C: 区間ソート＋イベント処理 | O(Q log Q + N) | O(Q)  | 中       | 中   | 区間数が大きい場合に有効  |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**: 方法A（いもす法）
// * **理由**:

//   * O(N+Q) で最も効率的。
//   * 実装が簡単かつ可読性が高い。
//   * N, Q が 1000 なので余裕を持って実行可能。
// * **JS特有の最適化ポイント**:

//   * `for (let i=1; i<=N; i++)` の単純ループ。
//   * 配列は `new Array(N+2).fill(0)` で確保し単型保持。
//   * 入力チェックは早期に実施しホットパスから分離。

// ---

// # 4. コード実装（solution.js）

// ```js
"use strict";

/**
 * いもす法により範囲加算後の最大値を求める
 *
 * @param {string} input - 標準入力から読み取った文字列
 * @returns {number} N 個のマスのうち最大値
 * @throws {TypeError} 入力が不正な場合
 * @throws {RangeError} 制約違反の場合
 *
 * 計算量: O(N+Q)
 * 空間計算量: O(N)
 */
function imosMethod(input) {
  if (typeof input !== "string") {
    throw new TypeError("input must be a string");
  }

  const lines = input.trim().split("\n");
  if (lines.length < 1) {
    throw new TypeError("input must contain at least one line");
  }

  const [Nstr, Qstr] = lines[0].trim().split(/\s+/);
  const N = Number(Nstr);
  const Q = Number(Qstr);

  if (!Number.isInteger(N) || !Number.isInteger(Q)) {
    throw new TypeError("N and Q must be integers");
  }
  if (!(1 <= N && N <= 1000)) {
    throw new RangeError("N out of range");
  }
  if (!(1 <= Q && Q <= 1000)) {
    throw new RangeError("Q out of range");
  }

  const diff = new Array(N + 2).fill(0);

  for (let i = 1; i <= Q; i++) {
    if (i >= lines.length) {
      throw new TypeError("Insufficient query lines");
    }
    const [Lstr, Rstr] = lines[i].trim().split(/\s+/);
    const L = Number(Lstr);
    const R = Number(Rstr);

    if (!Number.isInteger(L) || !Number.isInteger(R)) {
      throw new TypeError("L and R must be integers");
    }
    if (!(1 <= L && L <= R && R <= N)) {
      throw new RangeError(`Invalid range: [${L},${R}]`);
    }

    diff[L] += 1;
    diff[R + 1] -= 1;
  }

  let maxVal = -Infinity;
  let current = 0;
  for (let i = 1; i <= N; i++) {
    current += diff[i];
    if (current > maxVal) {
      maxVal = current;
    }
  }

  return maxVal;
}

// ===== 実行部 =====
if (require.main === module) {
  const fs = require("fs");
  const input = fs.readFileSync("/dev/stdin", "utf8");
  const result = imosMethod(input);
  console.log(result);
}

module.exports = { imosMethod };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ループは `for` 使用、`forEach`/`map` は避ける。
// * 配列は単型（Number のみ）を維持。
// * Hidden class を固定するため、`diff` を最初に `.fill(0)`。
// * クロージャや一時オブジェクトを作らず GC 負荷を抑制。
// * 入力検証は最初にまとめて行い、ホットパスには影響を与えない。

// ---
