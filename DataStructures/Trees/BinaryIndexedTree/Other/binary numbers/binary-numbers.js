// 以下に Node.js (v18.16.1) での実装例を示します。
// 標準入力から fs を用いてデータを読み込み、大規模入力でも高速に処理できるようにしています。
// 各処理は関数化し、パラメータや返却値はコメントにて明記しています。

// ```javascript
'use strict';

const fs = require('fs');

/**
 * 10進数整数を2進数文字列に変換する関数
 * @param {bigint} num - 10進数の整数（最大10^15なのでBigInt対応）
 * @returns {string} 2進数文字列（先頭0なし）
 */
function decimalToBinary(num) {
    return num.toString(2);
}

/**
 * 標準入力から複数の整数を読み込み、2進数に変換して出力するメイン処理
 * @param {string} input - 標準入力の文字列
 * @returns {string} 出力文字列（改行区切り）
 */
function solve(input) {
    const lines = input.trim().split('\n');
    const T = Number(lines[0]);
    const results = new Array(T);

    for (let i = 0; i < T; i++) {
        // 10^15までなのでBigIntで読み込み
        const num = BigInt(lines[i + 1]);
        results[i] = decimalToBinary(num);
    }

    return results.join('\n');
}

// 標準入力から読み込み、処理結果を出力
const input = fs.readFileSync(0, 'utf8');
console.log(solve(input));

// ### 実装ポイント

// 1. **大規模入力対応**

//    * `fs.readFileSync(0, "utf8")` を用いて一括で標準入力を読み取り、
//      `split("\n")` で分割する方法を採用しています。
//    * `T` 最大 200,000 件でも十分高速に動作します。

// 2. **`BigInt` の使用**

//    * 入力は最大で $10^{15}$ なので、JavaScript の `Number` でも表現可能ですが、
//      型安全のため `BigInt` で受け取り、`toString(2)` で2進数に変換します。

// 3. **メモリ消費抑制**

//    * 結果は `results` 配列に格納し、最後に `join("\n")` でまとめて出力。
//      逐次 `console.log` するより高速でメモリ効率も良好です。

// ---

// このコードは Node.js 18.16.1 環境で動作し、
// 入力例を与えると以下のように出力されます。

// #### 入力例

// ```
// 5
// 6
// 7
// 10
// 1
// 15
// ```

// #### 出力例

// ```
// 110
// 111
// 1010
// 1
// 1111
// ```

// ---

// 次に、このコードを元に **BITの構築・更新・累積和計算** の処理を組み込んだ問題に発展させることが可能です。

// ---

// 💡質問です：
// 次はこのBITクラスの **構築部分(問題3)** をJavaScriptで実装するところから進めますか？
