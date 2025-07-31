// 以下は、指定された LeetCode 問題「Find All Starting Indices of Substring」への **Node.js (v18.16.1)** に対応した **関数ベースの JavaScript 解法**です。効率を重視した **スライディングウィンドウ + ハッシュマップ** による実装です。

// ---

// ### ✅ 解法概要

// * `words` の各単語は同じ長さ `wordLen`。
// * 総長 `totalLen = wordLen × words.length` のウィンドウを `s` 上でスライド。
// * ウィンドウ内を `wordLen` ごとに分割して `words` の出現頻度と照合。
// * 一致すればその開始インデックスを記録。

// ---

// ### ✅ 実装コード（Node.js v18）

// ```javascript
/**
 * 与えられた文字列 s において、配列 words のすべての単語を順不同で連結した部分文字列の開始インデックスをすべて返す。
 * @param {string} s - 入力文字列（長さは最大 10^4）
 * @param {string[]} words - 単語の配列（各単語の長さは等しく、最大 5000 要素）
 * @return {number[]} - 該当する部分文字列の開始インデックス配列（順不同でよい）
 */
function findSubstringJs(s, words) {
  if (!s || !words || words.length === 0) return [];

  const wordLen = words[0].length;
  const wordCount = words.length;
  const totalLen = wordLen * wordCount;
  const n = s.length;
  const result = [];

  if (n < totalLen) return [];

  // 単語の頻度マップを構築
  const wordMap = new Map();
  for (const word of words) {
    wordMap.set(word, (wordMap.get(word) || 0) + 1);
  }

  // wordLen の位置ずれに対応するためのループ
  for (let i = 0; i < wordLen; i++) {
    let left = i;
    let right = i;
    let windowMap = new Map();
    let count = 0;

    while (right + wordLen <= n) {
      const word = s.slice(right, right + wordLen);
      right += wordLen;

      if (wordMap.has(word)) {
        windowMap.set(word, (windowMap.get(word) || 0) + 1);
        count++;

        while (windowMap.get(word) > wordMap.get(word)) {
          const leftWord = s.slice(left, left + wordLen);
          windowMap.set(leftWord, windowMap.get(leftWord) - 1);
          left += wordLen;
          count--;
        }

        if (count === wordCount) {
          result.push(left);
        }
      } else {
        windowMap.clear();
        count = 0;
        left = right;
      }
    }
  }

  return result;
}
// ```

// ---

// ### ✅ 時間・メモリ計算量

// * **時間計算量**: `O(N * W)`

//   * `N = s.length`, `W = wordLen`。文字列全体を最大 `wordLen` 回スキャンし、各ウィンドウで O(1) 単語チェック。
// * **空間計算量**: `O(U)`

//   * `U = ユニークな単語数（最大5000）` に対する Map を保持。

// ---

// ### ✅ 使用例

// ```javascript
// console.log(findSubstring("barfoothefoobarman", ["foo", "bar"])); // [0, 9]
// console.log(findSubstring("wordgoodgoodgoodbestword", ["word", "good", "best", "word"])); // []
// console.log(findSubstring("barfoofoobarthefoobarman", ["bar", "foo", "the"])); // [6, 9, 12]
// ```

// ---

// ### ✅ 最適化ポイント

// * 無駄な再構築を避けるため **Map 再利用 + 巻き戻し処理**。
// * 単語長ごとの分割により `wordLen` ずらしの全ケースをカバー。

// ---

// 必要であれば、このアルゴリズムの図解（スライディングウィンドウの動き）も作成できます。ご希望ですか？
