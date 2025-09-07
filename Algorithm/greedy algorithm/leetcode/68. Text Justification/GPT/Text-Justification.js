// ご指定のテンプレートに従って **解析 → 実装 → 検証** を行います。
// 以下は **LeetCode の回答フォーマット（関数名：`fullJustify`）** に基づきます。
// 実行環境は **Node.js v18 / CommonJS / 外部ライブラリ不可** です。

// ---

// # 1. 問題の分析

// ## 競技プログラミング視点

// * **目的**: 各行をちょうど `maxWidth` 文字に揃える。
// * **手法**: 貪欲法。

//   * 単語を順に追加し、次の単語を入れると `maxWidth` を超える場合、そこで1行を確定。
//   * 各行の空白を均等配分。余りがあれば左側に多く入れる。
//   * 最終行は左寄せで残りは右側にスペースで埋める。
// * **計算量**:

//   * 各単語を1回処理する → **O(n)**
//   * スペース付加は文字列連結ベースだが、各単語は最大1回しか処理されない → 合計 O(n)。
// * **メモリ**: 出力用の配列のみ → **O(n)**

// ## 業務開発視点

// * **関数分割**: 「1行を作る処理」をヘルパー化し、可読性を確保。
// * **命名**: `buildLine`, `fullJustify` など直感的な名前を採用。
// * **入力検証**:

//   * `words` は配列で、要素は文字列のみ。
//   * `maxWidth` は正の整数で、20文字制約を考慮。
// * **例外処理**:

//   * 型エラーは `TypeError`。
//   * 制約違反は `RangeError`。

// ## JavaScript特有の考慮

// * **for ループ利用**: `map`/`forEach` を避け、不要クロージャ削減。
// * **文字列連結**: `+` は V8 で高速。`Array.join` は可変分割時に利用。
// * **GC削減**: 一時オブジェクト生成を最小化（例：余分な配列コピーを避ける）。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ             | 時間計算量      | 空間計算量       | JS実装コスト | 可読性 | 備考           |
// | ----------------- | ---------- | ----------- | ------- | --- | ------------ |
// | 方法A（貪欲法＋均等配分）     | O(n)       | O(1) 補助配列のみ | 低       | 中   | 最適。行単位で構築。   |
// | 方法B（ソート＋割当）       | O(n log n) | O(n)        | 中       | 高   | 不要。ソートの意味なし。 |
// | 方法C（全組合せシミュレーション） | O(n²)      | O(1)        | 低       | 高   | 小規模のみ可。非現実的。 |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**: 方法A（貪欲法＋均等配分）。
// * **理由**: O(n) で実装コスト低、かつ制約（words ≤ 300, maxWidth ≤ 100）に最適。
// * **最適化ポイント**:

//   * forループ走査で1パス。
//   * `Array.join(" ")` を活用しつつ不要コピーを避ける。
//   * 最終行と単語1個行を特殊処理。

// ---

// # 4. コード実装

// ```js
"use strict";

/**
 * LeetCode形式の解答関数
 * @param {string[]} words - 単語配列
 * @param {number} maxWidth - 各行の最大幅
 * @returns {string[]} - 整形済み行の配列
 * @throws {TypeError} 入力が不正な型の場合
 * @throws {RangeError} 制約違反の場合
 * @complexity 時間計算量 O(n), 空間計算量 O(n)
 */
var fullJustify = function (words, maxWidth) {
  // --- 入力検証 ---
  if (!Array.isArray(words)) throw new TypeError("words must be an array");
  if (
    typeof maxWidth !== "number" ||
    !Number.isInteger(maxWidth) ||
    maxWidth <= 0
  ) {
    throw new TypeError("maxWidth must be a positive integer");
  }
  if (maxWidth > 100) throw new RangeError("maxWidth exceeds constraint 100");
  for (let i = 0; i < words.length; i++) {
    if (typeof words[i] !== "string") {
      throw new TypeError("Each word must be a string");
    }
    if (words[i].length > maxWidth) {
      throw new RangeError("A word length exceeds maxWidth");
    }
  }

  const res = [];
  let line = [];
  let lineLen = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // この単語を追加した場合にスペース含め超過するか
    if (lineLen + line.length + word.length > maxWidth) {
      res.push(buildLine(line, lineLen, maxWidth, false));
      line = [];
      lineLen = 0;
    }
    line.push(word);
    lineLen += word.length;
  }
  // 最終行は左寄せ
  res.push(buildLine(line, lineLen, maxWidth, true));
  return res;
};

/**
 * 1行を構築するヘルパー
 * @param {string[]} line - 単語リスト
 * @param {number} lineLen - 単語合計長
 * @param {number} maxWidth - 行幅
 * @param {boolean} isLast - 最終行フラグ
 * @returns {string} - 完成行
 */
function buildLine(line, lineLen, maxWidth, isLast) {
  const n = line.length;
  if (n === 1 || isLast) {
    // 単語間にスペース1個で結合し、右端を埋める
    const joined = line.join(" ");
    return joined + " ".repeat(maxWidth - joined.length);
  }

  // 均等分配
  const totalSpaces = maxWidth - lineLen;
  const spaceEach = Math.floor(totalSpaces / (n - 1));
  let extra = totalSpaces % (n - 1);

  let res = "";
  for (let i = 0; i < n - 1; i++) {
    res += line[i];
    res += " ".repeat(spaceEach + (extra > 0 ? 1 : 0));
    if (extra > 0) extra--;
  }
  res += line[n - 1];
  return res;
}

module.exports = { fullJustify };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ✅ forループ基本、`forEach`/`map`回避。
// * ✅ 文字列結合は `+`、分配スペースは `' '.repeat()` 利用。
// * ✅ hidden class 安定化：`line` は push のみ。
// * ✅ Pure関数、外部副作用なし。
// * ✅ 例外は早期に投げ、ホットパス外。

// ---

// ✅ このまま `node solution.js` でテスト可能（`module.exports` によりCI互換）。

// ---
