// # 1. 問題の分析

// ## 競技プログラミング視点

// * 目標：**O(m + n)**（m = `s.length`, n = `t.length`）の単一パス（スライディングウィンドウ）アルゴリズム。
// * 手法：右ポインタで拡張して必要な文字数を満たしたら左ポインタで縮める。
// * メモリ：文字頻度を固定長配列で管理すれば O(1)（ASCII 前提）にできる。
// * 実装上の注意：ループ内の分岐・配列アクセスを最小化し、GC 発生を抑える。

// ## 業務開発視点

// * 型安全性：TypeScript の型で入力を制約し、実行時には必要最小限の型ガードを実施。
// * 可読性：関数は単一責務・純関数にし、変数名は明確に（`left`/`right`/`need`/`required` 等）。
// * エラーハンドリング：入力型違反は `TypeError`、サイズ制約違反は `RangeError` をスローして早期検出。

// ## TypeScript 特有の考慮点

// * `string` は UTF-16 コードユニット列だが問題は英字（A-Z,a-z）に限定 → `charCodeAt` を直接インデックスに使う方が速い。
// * 型注釈と `readonly` を使って副作用を制限。
// * `strict` モード下でコンパイル時に多くのバグを排除できる。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                               |    時間計算量 |        空間計算量 | TS実装コスト | 型安全性 | 可読性 | 備考             |
// | ----------------------------------- | -------: | -----------: | ------: | ---: | --: | -------------- |
// | 方法A: スライディングウィンドウ（固定配列`charCodeAt`） | O(m + n) |         O(1) |       低 |    高 |   高 | 実運用向け最適解       |
// | 方法B: 頻度Map + スライディングウィンドウ           | O(m + n) | O(k) (k=文字種) |       中 |    中 |   中 | Map のコストと型面で注意 |
// | 方法C: 全区間列挙（2重ループ）                   |    O(m²) |         O(1) |       低 |    高 |   低 | 小サイズのみ許容       |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択:** 方法A（スライディングウィンドウ + 固定長配列）
// * **理由:**

//   * 計算量 O(m+n)、メモリ O(1) を満たすため最適。
//   * 固定長の `number[]` を用いることで V8 に親和性が高く、高速化が期待できる。
//   * TypeScript でも型を厳密に指定でき、純関数として扱いやすい。
// * **TypeScript特有の最適化ポイント:**

//   * `readonly` 引数で副作用抑制（純関数を保証）。
//   * `charCodeAt` を使った配列インデックス化で Map より軽量。
//   * `for` ループで単型（number）アクセスの維持。

// ---

// # 4. 実装（TypeScript, strict 前提）

// * LeetCode 形式の関数 `minWindow(s: string, t: string): string` を提示します。
// * 入力検証で `TypeError` / `RangeError` を投げます（仕様要件）。
// * 副作用なし（pure function）。
// * Node.js v18 + 外部ライブラリ無しで動く TypeScript 実装です。

// ```typescript
/**
 * Minimum Window Substring (TypeScript, strict)
 *
 * LeetCode 提出フォーマットの関数。
 *
 * @param s - ソース文字列（検索対象）
 * @param t - 必要な文字列（含めるべき文字群、重複を含む）
 * @returns 最短ウィンドウ（存在しない場合は空文字列）
 * @throws {TypeError} s または t が string でない場合
 * @throws {RangeError} s または t の長さが制約を超える場合（1 <= len <= 1e5）
 * @complexity Time: O(m + n), Space: O(1)
 */
function minWindow(s: string, t: string): string {
  // ランタイム型チェック（LeetCode 環境でも安全）
  if (typeof s !== "string" || typeof t !== "string") {
    throw new TypeError("Both s and t must be strings");
  }

  const m = s.length;
  const n = t.length;
  const MAX_LEN = 1e5;
  if (m < 0 || n < 0 || m > MAX_LEN || n > MAX_LEN) {
    throw new RangeError(`Input sizes must be within 0..${MAX_LEN}`);
  }

  if (n === 0) return ""; // t が空なら空文字（問題の前提では t.length >=1 だが安全策）
  if (m === 0) return "";

  // ASCII 想定（問題文は英字のみ）: 128 で十分
  const NEED_ARR_SIZE = 128;
  const need: number[] = new Array(NEED_ARR_SIZE).fill(0);

  // t の頻度をセット
  for (let i = 0; i < n; i++) {
    const code = t.charCodeAt(i);
    if (code >= NEED_ARR_SIZE) {
      // 英字以外が来た場合も扱えるように配列拡張ではなく RangeError を投げる選択肢もあるが
      // ここでは安全のため IndexError 回避として modulo はしない。大きい code は配列外となる。
      // ただし LeetCode の本問題は英字のみなので通常通らない。
      throw new RangeError("Character code in t exceeds supported ASCII range");
    }
    need[code]++;
  }

  let required = n; // 残り必要文字数（重複分もカウント）
  let left = 0;
  let minLen = Number.POSITIVE_INFINITY;
  let minStart = 0;

  // 右ポインタを伸ばしつつ、条件を満たしたら左を縮める
  for (let right = 0; right < m; right++) {
    const rCode = s.charCodeAt(right);
    if (rCode >= NEED_ARR_SIZE) {
      throw new RangeError("Character code in s exceeds supported ASCII range");
    }

    // need[code] > 0 ならその文字がまだ必要であることを示す
    if (need[rCode] > 0) {
      required--;
    }
    // 使った分は減らす（余分に来たら負になる）
    need[rCode]--;

    // 現在の window がすべての必要文字を含むなら縮められる
    while (required === 0) {
      const windowLen = right - left + 1;
      if (windowLen < minLen) {
        minLen = windowLen;
        minStart = left;
      }

      const lCode = s.charCodeAt(left);
      // 左を1つ外すので need を回復させる
      need[lCode]++;

      // 回復後 need[lCode] > 0 ならその文字が再び不足になる -> required を増やす
      if (need[lCode] > 0) {
        required++;
      }
      left++;
    }
  }

  return minLen === Number.POSITIVE_INFINITY
    ? ""
    : s.slice(minStart, minStart + minLen);
}

// LeetCode 形式：関数そのものを提出するので export は任意だが、モジュールとして利用する際の互換性のためエクスポートを付ける。
export { minWindow };
// ```

// ---

// # 5. 検証方針（実装上のコメント）

// * **ユニットテスト案（実行は不要）**

//   * `minWindow("ADOBECODEBANC", "ABC") === "BANC"`
//   * `minWindow("a", "a") === "a"`
//   * `minWindow("a", "aa") === ""`
//   * edge: `minWindow("ab", "b") === "b"`, `minWindow("", "") === ""`（仕様に応じて）
// * **境界条件**

//   * 非文字（ASCII 範囲外）に対しては `RangeError` を投げる設計にしている（問題要件が英字限定なので実務上問題なし）。
// * **性能**

//   * 入力長最大 `1e5` を許容（RangeError 境界）。アルゴリズムは O(m + n) で、固定長配列でメモリは小さい。

// ---

// # 6. TypeScript 固有の最適化観点（まとめ）

// * `readonly` (今回は引数が `string` のため不要だが、引数の不変性を前提に実装)
// * 明示的な `number[]` を用いることで V8 が単型配列として最適化しやすい
// * `charCodeAt` を用いて object key（Map）よりも高速な配列インデックスにする
// * 例外は早期に投げ、ホットループ内の余分なチェックを排除
// * `strict` モードでのコンパイルにより、実行前に多くのミスを防げる
