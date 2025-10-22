// 以下は、先ほどのPythonコードと**同じロジック**（DP + 経路復元）で書いた **JavaScript版の解答**です。

// * `fs` を使って標準入力を読み取り、
// * 実行時間・メモリに配慮した設計になっています（辞書ベースの1次元DP）。

// ---

// ### ✅ JavaScriptコード（Node.js 18.16.1 対応）

// ```javascript
const fs = require('fs');

/**
 * 与えられたカードの数列から、合計Sとなる部分集合が存在するか判定し、
 * 存在する場合はカードのインデックスを1つ返す。
 * @returns {void}
 */
function main() {
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split(/\s+/).map(Number);

    const N = input[0]; // カードの枚数
    const S = input[1]; // 目標の合計
    const A = input.slice(2); // 各カードに書かれた値（長さN）

    /**
     * dp[s] = [i, prevSum] : 合計sは、カードi（0-indexed）を使って、prevSumから作った
     * @type {Map<number, [number, number]>}
     */
    const dp = new Map();
    dp.set(0, null); // 合計0は何も使わずに作れる

    for (let i = 0; i < N; i++) {
        const nextDp = new Map(dp); // 現在の状態をコピー

        for (const [s, val] of dp.entries()) {
            const newSum = s + A[i];
            if (newSum <= S && !nextDp.has(newSum)) {
                nextDp.set(newSum, [i, s]); // s+A[i] は カードi で作った
            }
        }

        // 更新
        for (const [key, val] of nextDp.entries()) {
            dp.set(key, val);
        }
    }

    // 合計Sを作れるかチェック
    if (!dp.has(S)) {
        console.log(-1);
        return;
    }

    // 経路復元
    /** @type {number[]} */
    const result = [];
    let currSum = S;

    while (currSum !== 0) {
        const [i, prevSum] = dp.get(currSum);
        result.push(i + 1); // 1-indexed に変換
        currSum = prevSum;
    }

    result.reverse();
    console.log(result.length);
    console.log(result.join(' '));
}

main();

// ### ✅ 使用技術・仕様の要点

// | 項目     | 内容                                 |
// | ------ | ---------------------------------- |
// | 実行環境   | Node.js 18.16.1                    |
// | 入力取得方法 | `fs.readFileSync('/dev/stdin')`    |
// | 時間計算量  | `O(N*S)` （最大60万）                   |
// | 空間計算量  | `O(S)`（Mapに合計値を格納）                 |
// | 出力形式   | 条件を満たすカード枚数、カード番号（1-indexed）       |
// | 経路復元   | Mapに `(カード番号, 前の合計値)` を記録し、正確な復元可能 |

// ---

// ### ✅ 動作例

// #### 入力:

// ```
// 3 7
// 2 2 3
// ```

// #### 出力:

// ```
// 3
// 1 2 3
// ```

// ---
