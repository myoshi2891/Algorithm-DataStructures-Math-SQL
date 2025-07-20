// 以下は、TypeScriptで括弧の妥当性を判定する関数実装です。
// LeetCode環境(TypeScript 5.1, Node.js 18.16.1)に対応し、**クラスは使わず関数形式**で記述しています。

// ### 処理時間とメモリ消費:

// * **時間計算量**: O(n)（nは文字列長）
// * **空間計算量**: O(n)（スタック使用）

// ---

// ```typescript
/**
 * 与えられた文字列が括弧として正しいかを判定する関数。
 * 
 * @param s - 入力文字列（'(', ')', '{', '}', '[', ']' からなる）
 * @returns boolean - 正しい括弧列ならtrue、不正ならfalse
 * 
 * 制約: 1 <= s.length <= 10^4
 * 時間計算量: O(n)
 * 空間計算量: O(n)（スタックを使用するため）
 */
function isValid(s: string): boolean {
    const stack: string[] = [];
    
    // 括弧の対応表
    const bracketMap: Record<string, string> = {
        ')': '(',
        '}': '{',
        ']': '[',
    };

    for (const char of s) {
        // 開き括弧ならスタックにpush
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        } else {
            // 閉じ括弧の処理
            if (stack.length === 0) {
                return false; // 対応する開き括弧なし
            }
            const top = stack.pop();
            if (top !== bracketMap[char]) {
                return false; // 対応が間違っている
            }
        }
    }

    // 全ての括弧が閉じられているか
    return stack.length === 0;
}
// ```

// ---

// ## 実行例:

// ```typescript
// console.log(isValid("()"));       // true
// console.log(isValid("()[]{}"));   // true
// console.log(isValid("(]"));       // false
// console.log(isValid("([])"));     // true
// console.log(isValid("([)]"));     // false
// ```

// ---

// ## メモリ使用についての補足：

// * **最悪ケース**（全て開き括弧の場合）でスタックに最大 `n` 個要素を保持するため、O(n) メモリを消費します。
// * LeetCode環境では 10^4程度の文字列長でも十分実行可能です。

// ---

// もし図解や、実行時スタックの動作説明が必要であれば教えてください！
