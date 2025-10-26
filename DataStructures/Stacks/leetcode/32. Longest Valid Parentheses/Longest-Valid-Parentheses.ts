// 以下に **TypeScript 5.1 (Node.js 18.16.1)** 向け、LeetCode 用の **O(n) スタック法** 実装を示します。
// クラスは使わず、関数で処理し、パラメータ・返却値の型を明示しています。
// スタックを用いるため、**時間計算量 O(n)**、**空間計算量 O(n)** です。

// ---

// ### 実装例（TypeScript, O(n) スタック法）

// ```typescript
/**
 * 与えられた括弧文字列に対して、最長の有効な括弧部分文字列の長さを返します
 *
 * @param s - '(' と ')' のみからなる文字列
 * @returns number - 最長有効括弧部分文字列の長さ
 *
 * 時間計算量: O(n) - 文字列を1回走査し、スタック操作はO(1)
 * 空間計算量: O(n) - スタックに最大n個のインデックスを保持
 */
function longestValidParentheses(s: string): number {
    const stack: number[] = [-1]; // インデックスを保持するスタック、初期値は基準位置
    let maxLen: number = 0;

    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') {
            stack.push(i); // '(' の位置を push
        } else {
            stack.pop(); // ')' に対応する '(' を pop
            if (stack.length === 0) {
                // スタックが空なら現在位置を基準にする
                stack.push(i);
            } else {
                // 有効な長さを更新
                maxLen = Math.max(maxLen, i - stack[stack.length - 1]);
            }
        }
    }

    return maxLen;
}

// 動作確認
const testCases: string[] = ['(()', ')()())', '', '()(())', '())((())'];
for (const s of testCases) {
    console.log(`Input: '${s}', Output: ${longestValidParentheses(s)}`);
}

// ### 実行結果例

// ```
// Input: '(()', Output: 2
// Input: ')()())', Output: 4
// Input: '', Output: 0
// Input: '()(())', Output: 6
// Input: '())((())', Output: 4
// ```

// ---

// ### 処理時間・メモリ消費量

// * **時間計算量**: O(n)

//   * スタック操作は O(1) なので全体で線形

// * **空間計算量**: O(n)

//   * インデックス用のスタックが最大で文字列長 n

// * **メモリ使用量の目安**:

//   * n = 30,000 の場合

//     * number\[] で 30,000 要素 ≒ 約 240KB 程度 (Node.js の number 8byte換算)

// ---

// もし **O(1) メモリの最適版**を TypeScript で書く場合も提示できますが、
// まずこの **O(n) スタック法**を LeetCode に提出するのが一番安全です。

// ---

// 質問です。
// あなたは次に、**TypeScript で O(1) メモリの最適版**も知りたいですか？
