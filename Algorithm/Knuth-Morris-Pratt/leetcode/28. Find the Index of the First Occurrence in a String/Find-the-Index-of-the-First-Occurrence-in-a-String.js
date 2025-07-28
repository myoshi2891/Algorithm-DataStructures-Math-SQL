// 以下に、`Node.js 18.16.1` 環境で実行可能な `.indexOf()` を使ったシンプルで効率的な **JavaScript（関数形式）** の実装を提示します。

// ---

// ## ✅ 実装コード（JavaScript + `.indexOf()`）

// ```javascript
/**
 * haystack から needle を検索し、最初に一致するインデックスを返す。
 * 一致しない場合は -1 を返す。
 *
 * @param {string} haystack - 探索対象の文字列（最大長 10^4）
 * @param {string} needle - 探索する部分文字列（最大長 10^4）
 * @returns {number} - needle の最初の出現インデックス、存在しない場合は -1
 *
 * 時間計算量: O(n * m) 最悪ケース（平均は高速）
 * 空間計算量: O(1)
 */
function strStrJs(haystack, needle) {
  return haystack.indexOf(needle);
}

// ## 🧪 テストケース例

// ```javascript
// console.log(strStr("sadbutsad", "sad"));       // => 0
// console.log(strStr("leetcode", "leeto"));      // => -1
// console.log(strStr("mississippi", "issip"));   // => 4
// console.log(strStr("abc", ""));                // => 0
// ```

// ---

// ## 🔍 計算量と実行パフォーマンスの評価

// | 項目              | 値                           |
// | --------------- | --------------------------- |
// | **時間計算量**       | 平均: `O(n)` ／ 最悪: `O(n * m)` |
// | **空間計算量**       | `O(1)`（追加メモリなし）             |
// | **Node.js実行環境** | `v18.16.1`（ECMAScript仕様準拠）  |
// | **最大長制約**       | 10⁴（LeetCode制限内）            |

// ---

// ## ✅ なぜ `.indexOf()` は便利か？

// * ネイティブ実装のため **高速な最適化** がされている。
// * 内部的には **Boyer-Moore** や **KMPのような手法**を使うこともあり、**平均ケースで高速**。
// * コードが非常に短く保守性が高い。

// ---

// ## ❗️注意点

// * 最悪ケースでは `O(n * m)` の比較が発生することがあります。

//   * 例: `haystack = "aaaaaaaab"`, `needle = "aaaab"` のようなケース

// ---

// ご希望があれば、`.indexOf()` の内部アルゴリズムや他手法（Rabin-Karp など）との速度比較も可能です。どうぞお申し付けください。
