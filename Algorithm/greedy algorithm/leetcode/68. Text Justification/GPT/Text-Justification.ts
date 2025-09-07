// TypeScript 版として、指定されたテンプレートに従い **問題分析 → アルゴリズム比較 → 実装方針 → 実装コード** を整理して回答します。

// ---

// # 1. 問題の分析

// ### 競技プログラミング視点

// * **速度**: 各単語を 1 度だけ処理して行に詰める → `O(n)` 時間で十分。
// * **メモリ効率**: 出力用配列以外の追加データ構造は不要 → `O(1)` 補助空間で可。

// ### 業務開発視点

// * **型安全性**: `words` は `string[]` 固定。`maxWidth` は `number`。`readonly` 型を利用し、入力を不変と扱う。
// * **可読性/保守性**: 行構築ロジック（`buildLine`）とメインループを分離し、責務を明確化。
// * **エラーハンドリング**: 入力が不正（空配列、幅が 1 未満等）の場合は `RangeError` / `TypeError` を明示的に投げる。

// ### TypeScript特有の考慮点

// * **型推論**: `string[]` を `readonly string[]` とし、破壊的変更を防止。
// * **ジェネリクス**: この問題は `string` 固定なので不要。むしろ型制約を明示して安全性を確保。
// * **コンパイル最適化**: `const` + `readonly` により副作用を防ぎ、型システムで安全性を担保。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                  | 時間計算量      | 空間計算量 | TS実装コスト | 型安全性 | 可読性 | 備考       |
// | ---------------------- | ---------- | ----- | ------- | ---- | --- | -------- |
// | 方法A: Greedyで逐次構築       | O(n)       | O(1)  | 低       | 高    | 高   | 最適。標準解法  |
// | 方法B: 事前に全単語長を集計し調整     | O(n log n) | O(n)  | 中       | 中    | 中   | 不要なソートあり |
// | 方法C: Brute-forceで全行を試す | O(n²)      | O(1)  | 低       | 高    | 中   | 小入力のみ妥当  |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**: 方法A（Greedy）
// * **理由**:

//   * **時間計算量**: `O(n)` で最速。
//   * **空間効率**: 出力以外は定数領域。
//   * **TypeScript適合性**: 入力を `readonly` 扱いできる。
//   * **保守性**: 行生成ロジックを関数に切り出すことで分かりやすい。

// ### TypeScript特有の最適化ポイント

// * 入力を `readonly string[]` と定義して破壊的操作を防止。
// * `const` による定数化で型システムにヒントを与え、実行時最適化に寄与。
// * `RangeError` / `TypeError` を明示的に投げて、呼び出し側で型安全なハンドリングが可能。

// ---

// # 4. 実装コード（leetcodeフォーマット）

// ```typescript
// Runtime: Node.js v18+
// Module: CommonJS

/**
 * Fully justifies the given words according to maxWidth.
 * @param words - Array of words (non-empty strings)
 * @param maxWidth - Maximum line width
 * @returns Justified text as array of lines
 * @throws {TypeError} If words is not an array of strings
 * @throws {RangeError} If maxWidth < 1 or exceeds constraints
 * @complexity Time: O(n), Space: O(1) (excluding output)
 */
function fullJustify(words: readonly string[], maxWidth: number): string[] {
  // ---- 入力検証 ----
  if (!Array.isArray(words) || !words.every((w) => typeof w === "string")) {
    throw new TypeError("words must be an array of strings");
  }
  if (!Number.isInteger(maxWidth) || maxWidth < 1 || maxWidth > 100) {
    throw new RangeError("maxWidth must be integer between 1 and 100");
  }
  if (words.length < 1 || words.length > 300) {
    throw new RangeError("words.length must be between 1 and 300");
  }

  const res: string[] = [];
  let line: string[] = [];
  let lineLen = 0;

  // ---- 行ごとに構築 ----
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // 今の行に追加できるか判定（スペース含む）
    if (lineLen + line.length + word.length > maxWidth) {
      res.push(buildLine(line, lineLen, maxWidth, false));
      line = [];
      lineLen = 0;
    }
    line.push(word);
    lineLen += word.length;
  }

  // ---- 最終行は左寄せ ----
  res.push(buildLine(line, lineLen, maxWidth, true));
  return res;
}

/**
 * Builds a justified line from given words.
 * @param words - Words in the line
 * @param lineLen - Total length of words (no spaces)
 * @param maxWidth - Target width
 * @param isLast - Whether this is the last line
 * @returns Justified line as string
 */
function buildLine(
  words: readonly string[],
  lineLen: number,
  maxWidth: number,
  isLast: boolean
): string {
  const gaps = words.length - 1;
  if (isLast || gaps === 0) {
    // 左寄せ
    const line = words.join(" ");
    return line + " ".repeat(maxWidth - line.length);
  }

  const totalSpaces = maxWidth - lineLen;
  const spaceEach = Math.floor(totalSpaces / gaps);
  const extra = totalSpaces % gaps;

  let line = "";
  for (let i = 0; i < gaps; i++) {
    line += words[i];
    line += " ".repeat(spaceEach + (i < extra ? 1 : 0));
  }
  line += words[words.length - 1];
  return line;
}

export { fullJustify };
// ```

// ---

// # 5. TypeScript固有の最適化観点

// 1. **型安全性の活用**

//    * `readonly string[]` で破壊的変更を禁止。
//    * `TypeError` / `RangeError` を明示的に投げて、入力の型不一致を早期検出。
// 2. **コンパイル時最適化**

//    * `const` と `readonly` によりコンパイラが不変性を保証。
//    * 不要なオブジェクト生成を避けることで GC 負荷削減。
// 3. **開発効率と保守性**

//    * 関数を小さく分割し、`buildLine` で責務を明確化。
//    * IntelliSense による補完支援 → チーム開発での理解が容易。

// ---

// ✅ 以上で、解析～実装～検証までを TypeScript（LeetCode 解答形式）でまとめました。

// このコードを `solution.ts` として保存すれば、LeetCode 上でも Node.js v18 環境でもそのまま実行可能です。

// ---
