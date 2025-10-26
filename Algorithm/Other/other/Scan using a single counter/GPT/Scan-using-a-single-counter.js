// # 1. 問題の分析

// ## 競技プログラミング視点

// * **速度最優先**: 入力サイズ N < 50,000 なので O(N) 解法で十分。
// * **手法**: 開き括弧を +1、閉じ括弧を -1 としてカウンタを走査。

//   * 途中で負になったら即座に `No`。
//   * 最後に 0 なら `Yes`、そうでなければ `No`。
// * **メモリ**: スタックを実際に使わず、整数カウンタだけで O(1)。

// ## 業務開発視点

// * **保守性/可読性**:

//   * 判定処理を関数化 (`isValidParentheses`)
//   * I/O 部分を分離 (`main`)
//   * JSDoc コメントで仕様を明示。
// * **エラーハンドリング**:

//   * 入力が文字列でなければ `TypeError`。
//   * 長さが範囲外なら `RangeError`。

// ## JavaScript特有の考慮

// * **V8最適化**:

//   * `for` ループで index-based 走査。
//   * ループ中は整数加算のみで hidden class 安定化。
// * **GC負荷低減**:

//   * 配列やスタックを生成しない。
//   * クロージャ回避、再利用不要。
// * **配列操作**: `push/pop` を使わず整数カウンタ。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ               | 時間計算量 | 空間計算量 | JS実装コスト | 可読性 | 備考        |
// | ------------------- | ----- | ----- | ------- | --- | --------- |
// | 方法A: カウンタ1つで走査      | O(N)  | O(1)  | 低       | 中   | 最速・最小メモリ  |
// | 方法B: スタックで push/pop | O(N)  | O(N)  | 中       | 高   | 教科書的だが冗長  |
// | 方法C: 部分列展開・再帰       | O(N²) | O(1)  | 低       | 高   | 小規模限定で非効率 |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択したアプローチ**: 方法A（カウンタ1つ）
// * **理由**:

//   * O(N) 時間、O(1) 空間で最も効率的。
//   * N が最大 50,000 なので十分高速。
//   * GC・最適化負荷が最小。
// * **JavaScript最適化ポイント**:

//   * `for (let i=0; i<n; i++)` を採用。
//   * カウンタは整数単型を維持。
//   * I/O 部分以外は Pure Function。

// ---

// # 4. コード実装（solution.js）

// ```js
'use strict';

/**
 * 正しい括弧列かを判定する Pure Function
 * @param {string} s - 入力括弧列
 * @returns {boolean} 正しい括弧列なら true, そうでなければ false
 * @throws {TypeError} 入力が文字列でない場合
 * @throws {RangeError} 長さが 1 <= N < 50000 を満たさない場合
 * @complexity 時間 O(N), 空間 O(1)
 */
function isValidParentheses(s) {
    if (typeof s !== 'string') throw new TypeError('Input must be string');
    const n = s.length;
    if (n < 1 || n >= 50000) throw new RangeError('String length out of range');

    let balance = 0;
    for (let i = 0; i < n; i++) {
        const ch = s[i];
        if (ch === '(') {
            balance++;
        } else if (ch === ')') {
            balance--;
        } else {
            throw new TypeError('Invalid character in input');
        }
        if (balance < 0) return false; // 閉じすぎ
    }
    return balance === 0;
}

/**
 * メイン処理 (標準入力/標準出力)
 */
function main() {
    const input = require('fs').readFileSync(0, 'utf8').trim().split('\n');
    const n = parseInt(input[0], 10);
    const s = input[1];
    if (s.length !== n) {
        throw new RangeError('Input length does not match N');
    }

    const result = isValidParentheses(s);
    console.log(result ? 'Yes' : 'No');
}

if (require.main === module) {
    main();
}

module.exports = { isValidParentheses };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ✅ ループは `for`、`forEach/map` 不使用
// * ✅ 一時配列やオブジェクト生成なし
// * ✅ hidden class の安定化を維持
// * ✅ 配列操作なし（カウンタのみ）
// * ✅ 例外は I/O と入力検証時のみ
