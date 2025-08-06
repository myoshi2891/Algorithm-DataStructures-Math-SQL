// 以下は、**対応の取れたカッコ列**に対して、全ての対応する括弧の位置を出力する **JavaScript（Node.js）** の実装です。

// * `fs` モジュールを用いて高速に標準入力を読み取り、
// * **スタックを使って対応関係を O(N)** で求め、
// * 出力条件（`max(li, ri)` 昇順）を満たすようにソートして出力します。

// ---

// ### ✅ 解法の概要（重要ポイント）:

// * `(` が来たら位置をスタックに積む。
// * `)` が来たらスタックから `(` の位置を取り出して対応関係として保存。
// * 最後に `max(l, r)` 昇順でソートして出力。

// ---

// ### ✅ 実装コード（Node.js 18.16.1, fs使用）

// ```javascript
// 標準入力の取得
const fs = require('fs');

/**
 * 入力文字列 S に対して、すべての括弧の対応を出力する
 * @param {string} S - 括弧列（対応の取れたカッコ列）
 * @returns {Array<[number, number]>} - 対応している括弧の位置ペア（1-indexed）
 */
function findMatchingBrackets(S) {
    const stack = [];
    const pairs = [];

    for (let i = 0; i < S.length; i++) {
        const ch = S[i];
        if (ch === '(') {
            stack.push(i + 1); // 1-indexed
        } else {
            const left = stack.pop();
            pairs.push([left, i + 1]);
        }
    }

    // 条件：max(l, r) 昇順でソート
    pairs.sort((a, b) => Math.max(a[0], a[1]) - Math.max(b[0], b[1]));

    return pairs;
}

// メイン処理
function main() {
    const S = fs.readFileSync('/dev/stdin', 'utf8').trim();
    const result = findMatchingBrackets(S);
    const output = result.map(pair => `${pair[0]} ${pair[1]}`).join('\n');
    console.log(output);
}

main();
// ```

// ---

// ### ✅ 処理時間・メモリ効率

// * **時間計算量:** O(N)（スタック操作 + ソート）
// * **空間計算量:** O(N)（スタック + 結果ペア）
// * **最大入力長 200,000 でも 2 秒 / 1024 MiB 制限内に収まります**

// ---

// 何か追加要件があれば教えてください（例えばペアを辞書順に並べたい、など）。
