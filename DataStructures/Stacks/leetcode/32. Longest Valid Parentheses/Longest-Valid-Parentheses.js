// 以下は、指定された問題に対して **Node.js (18.16.1)** 向けに書かれた **関数ベースの JavaScript 解法** です。
// この解法は **スタックを使った線形時間アルゴリズム（O(n)）** で、処理時間・メモリ効率ともに良好です。

// ---

// ### ✅ 解法：スタックベース

// * 開き括弧 `'('` のインデックスをスタックに積む。
// * 閉じ括弧 `')'` が出現したら、スタックのトップとペアになるかを判定。
// * スタックに「最後に無効だったインデックス」を入れておき、ペア成立時に長さを更新。

// ---

// ### ✅ 実装コード（コメント付き）

// ```javascript
/**
 * 最長の有効な括弧部分文字列の長さを返す
 * 
 * @param {string} s - '(' と ')' のみからなる文字列
 * @returns {number} - 最長の well-formed な部分文字列の長さ
 */
function longestValidParenthesesJs(s) {
  const stack = [];
  // 初期値として -1 を入れておくことで、長さ計算時に基準になる
  stack.push(-1);

  let maxLength = 0;

  for (let i = 0; i < s.length; i++) {
    const c = s[i];

    if (c === '(') {
      // 開き括弧のインデックスをスタックに積む
      stack.push(i);
    } else {
      // 閉じ括弧が出たので、対応する開き括弧をポップ
      stack.pop();

      if (stack.length === 0) {
        // ペア不成立：現在の閉じ括弧は無効 → 新たな基準位置
        stack.push(i);
      } else {
        // ペア成立：現在位置と直前のインデックスとの差が有効長
        maxLength = Math.max(maxLength, i - stack[stack.length - 1]);
      }
    }
  }

  return maxLength;
}
// ```

// ---

// ### ✅ 使用例と出力確認

// ```javascript
// console.log(longestValidParentheses("(()"));      // 2
// console.log(longestValidParentheses(")()())"));   // 4
// console.log(longestValidParentheses(""));         // 0
// console.log(longestValidParentheses("()(()"));    // 2
// console.log(longestValidParentheses("()()"));     // 4
// ```

// ---

// ### ✅ 時間・空間計算量

// | 指標      | 値                   |
// | ------- | ------------------- |
// | 時間計算量   | O(n) （n は文字列長）      |
// | 空間計算量   | O(n) （スタック用）        |
// | 実行時間目安  | 約 60ms 以下（LeetCode） |
// | メモリ使用目安 | 約 40MB 以下（LeetCode） |

// ---

// ご希望があれば、**DP版の解法**や\*\*両方向スキャン版（O(1) space）\*\*もご紹介可能です。
