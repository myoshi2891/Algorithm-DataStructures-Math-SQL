// 以下は、**JavaScript (Node.js v18.16.1)** での `countAndSay(n)` を **イテレーティブ（反復）に実装**した解答です。

// Runtime
// 7
// ms
// Beats
// 35.24%
// Memory
// 54.95
// MB
// Beats
// 94.18%

// ---

// ## ✅ ポイント整理

// * `countAndSay(1)` = `"1"` がベースケース。
// * `countAndSay(n)` は `countAndSay(n - 1)` の **ランレングス符号化（RLE）** を返す。
// * RLE: 連続する同じ文字を「個数+文字」で置換する。

// ---

// ### ✅ 実装コード（関数ベース）

// ```javascript
/**
 * countAndSay 関数は、与えられた整数 n に対する Count-and-Say シーケンスの n 番目の要素を返す
 * 
 * @param {number} n - 1以上30以下の正の整数
 * @returns {string} - Count-and-Say シーケンスの n 番目の要素（文字列）
 * 
 * 時間計算量: O(n * m) ただし m は文字列長（最悪で指数増加）
 * 空間計算量: O(m)
 */
function countAndSay(n) {
  if (n === 1) return "1";

  let result = "1";

  for (let i = 2; i <= n; i++) {
    let temp = "";
    let count = 1;
    for (let j = 1; j <= result.length; j++) {
      if (result[j] === result[j - 1]) {
        count++;
      } else {
        temp += count.toString() + result[j - 1];
        count = 1;
      }
    }
    result = temp;
  }

  return result;
}
// ```

// ---

// ### ✅ 処理時間とメモリ使用量

// * **時間計算量**:
//   各ステップで文字列を走査（最大で指数的に成長）。よって
//   `O(n * m)`（ただし `m` は result の文字列長、指数的増加）。

// * **空間計算量**:
//   各ステップで新しい文字列（`temp`）を作成。
//   最悪で `O(m)` のメモリが必要。

// ---

// ### ✅ 処理例（図解）

// #### countAndSay(4)

// ```
// n = 1: "1"
// → RLE: "11"
// → RLE: "21"
// → RLE: "1211"
// ```

// * "21" →
//   "one 2, one 1" → "1211"

// ---

// ### ✅ 注意点

// * **文字列連結**によりパフォーマンスが落ちやすいので、大量に使う場合は `Array.push` + `join('')` も検討可能です。
// * ただし `n <= 30` の制約内では問題なし。

// ---
