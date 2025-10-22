// テンプレートに従い、「逆ポーランド記法（RPN）評価問題」の **解析～実装～検証** をまとめました。
// 以下は **CommonJS モジュール形式** での `solution.js` 実装です。

// ---

// # 1. 問題の分析

// ## 1.1 競技プログラミング視点

// * **速度最優先**:

//   * RPN は左から順にトークンを読み、スタックで処理できるため **O(N)** で解ける。
//   * push/pop のみを使うので定数時間処理。
// * **メモリ効率**:

//   * スタックサイズは最大で `N`。
//   * 破壊的更新（push/pop）を使えば追加メモリは **O(1)**。

// ## 1.2 業務開発視点

// * **保守性**:

//   * 関数を分割し、責務を明確にする（入力検証・演算処理・出力）。
//   * 命名は `evaluateRPN` のようにわかりやすく。
// * **例外方針**:

//   * 不正入力は `TypeError` / `RangeError` を即座に投げる。
//   * 問題条件的には不正入力は来ないが、安全性担保のため実装する。

// ## 1.3 JavaScript特有の考慮点

// * **V8最適化**:

//   * 配列をスタックとして利用 → push/pop が高速。
//   * 数値は単型保持し、型崩れを防ぐ。
// * **GC対策**:

//   * 新しいオブジェクトは作らず、スタック配列を再利用。
//   * ループ内クロージャ・高階関数（map, reduce）は避ける。
// * **パフォーマンス**:

//   * ループは `for` で回す。
//   * `Number.isNaN` や `Number.isFinite` で数値判定。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ            | 時間計算量 | 空間計算量 | JS実装コスト | 可読性 | 備考                     |
// | ---------------- | ----- | ----- | ------- | --- | ---------------------- |
// | 方法A: スタックで処理     | O(N)  | O(N)  | 低       | 中   | 標準的・最速                 |
// | 方法B: 再帰で処理       | O(N)  | O(N)  | 中       | 高   | 深いネストでStackOverflowの危険 |
// | 方法C: 中置に変換してeval | O(N²) | O(N)  | 低       | 高   | 非効率・安全性低               |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択したアプローチ**: 方法A（スタック利用）
// * **理由**:

//   * 時間計算量 O(N)、空間計算量 O(N) で最適。
//   * Node.js でも push/pop が定数時間で動作。
// * **最適化ポイント**:

//   * for ループによる逐次処理。
//   * 配列は数値のみ格納 → hidden class が安定。
//   * 不正入力チェックは先頭で一度のみ行う。

// ---

// # 4. コード実装（solution.js）

// ```js
'use strict';

/**
 * 逆ポーランド記法を評価する関数（Pure Function）
 * @param {string[]} tokens - 逆ポーランド記法のトークン配列（数値文字列または演算子）
 * @returns {number} 評価結果
 * @throws {TypeError} 入力が配列でない場合
 * @throws {RangeError} 入力サイズ制約を超える場合
 */
function evaluateRPN(tokens) {
    if (!Array.isArray(tokens)) throw new TypeError('Input must be an array');
    const n = tokens.length;
    if (n < 1 || n >= 10000) throw new RangeError('Input size out of range');

    const stack = [];

    for (let i = 0; i < n; i++) {
        const t = tokens[i];

        if (t === '+' || t === '-') {
            if (stack.length < 2) {
                throw new RangeError('Invalid RPN expression: insufficient operands');
            }
            const b = stack.pop();
            const a = stack.pop();
            stack.push(t === '+' ? a + b : a - b);
        } else {
            const num = Number(t);
            if (!Number.isFinite(num)) throw new TypeError('Invalid token: ' + t);
            stack.push(num);
        }
    }

    if (stack.length !== 1) {
        throw new RangeError('Invalid RPN expression: stack not reduced to one result');
    }

    return stack[0];
}

/**
 * エントリーポイント
 * 標準入力から値を読み込み、結果を出力する
 */
function main() {
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf8').trim().split(/\s+/);
    const N = Number(input[0]);
    if (!Number.isInteger(N)) throw new TypeError('First input must be integer N');

    const tokens = input.slice(1);
    if (tokens.length !== N) {
        throw new RangeError('Token count does not match N');
    }

    const result = evaluateRPN(tokens);
    console.log(result);
}

if (require.main === module) {
    main();
}

module.exports = { evaluateRPN };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ✅ for ループを利用（map/reduce/forEachは不使用）
// * ✅ 配列は数値専用（hidden class 崩壊を防ぐ）
// * ✅ push/pop のみ利用（shift/unshiftは使用禁止）
// * ✅ 一時オブジェクトの生成を抑制
// * ✅ 入力検証を先頭で一度だけ実施
// * ✅ 出力は console.log のみ

// ---

// 例:

// ```
// 入力:
// 3
// 1 2 +

// 出力:
// 3
// ```

// ```
// 入力:
// 7
// 1 2 + 3 4 + -

// 出力:
// -4
// ```

// ---
