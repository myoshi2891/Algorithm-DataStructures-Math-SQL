// 以下は、**TypeScript 5.1** に対応した実装です。
// 先ほどの Python / JavaScript のロジックを保ちつつ、

// * **型を明示**
// * **`fs` による入力**
// * **計算量とメモリ効率を考慮**

// した堅牢な解法です。

// ---

// ## ✅ TypeScript 解法（Node.js 18.16.1 / TypeScript 5.1）

// ```ts
import * as fs from 'fs';

/**
 * 合計Sとなる部分集合が存在するかを判定し、
 * 存在する場合はそのカードのインデックスを1つ出力する。
 * 存在しない場合は -1 を出力する。
 *
 * @returns {void}
 */
function main(): void {
    const input: string[] = fs.readFileSync('/dev/stdin', 'utf8').trim().split(/\s+/);
    const N: number = parseInt(input[0], 10);
    const S: number = parseInt(input[1], 10);
    const A: number[] = input.slice(2).map(Number);

    /**
     * dp[s] = [i, prevSum] : 合計sは、カードiを使ってprevSumから作った
     * dp[0] = null : 合計0は何も使わずに作れる
     */
    const dp: Map<number, [number, number] | null> = new Map();
    dp.set(0, null); // 合計0は何も使わずに作れる

    for (let i = 0; i < N; i++) {
        const nextDp: Map<number, [number, number] | null> = new Map(dp); // 現在の状態を複製

        for (const [s, val] of dp.entries()) {
            const newSum: number = s + A[i];
            if (newSum <= S && !nextDp.has(newSum)) {
                nextDp.set(newSum, [i, s]); // s + A[i] はカードiを使って構成可能
            }
        }

        // 状態を更新
        for (const [key, val] of nextDp.entries()) {
            dp.set(key, val);
        }
    }

    if (!dp.has(S)) {
        console.log(-1);
        return;
    }

    // 経路復元
    const result: number[] = [];
    let currSum: number = S;

    while (currSum !== 0) {
        const val = dp.get(currSum);
        if (!val) break;
        const [i, prevSum] = val;
        result.push(i + 1); // 1-indexed
        currSum = prevSum;
    }

    result.reverse();
    console.log(result.length);
    console.log(result.join(' '));
}

main();

// ## ✅ 特徴・注意点

// | 項目      | 内容                                        |
// | ------- | ----------------------------------------- |
// | 実行環境    | TypeScript 5.1 + Node.js 18.16.1          |
// | 入力方法    | `fs.readFileSync('/dev/stdin')`           |
// | 時間計算量   | `O(N * S)`（最大60×10000 = 60万）              |
// | 空間計算量   | `O(S)`（合計値をキーとしたMap）                      |
// | 経路復元    | `Map<number, [index, prevSum]>` で正確な復元が可能 |
// | メモリ制限考慮 | スパースなDPで節約（配列でなくMapを使用）                   |

// ---

// ## ✅ 動作例

// ### 入力

// ```
// 3 7
// 2 2 3
// ```

// ### 出力

// ```
// 3
// 1 2 3
// ```

// ---

// ## ✅ 補足

// TypeScriptでの使用時は、`tsconfig.json` にて `"target": "es2020"` 以上に設定しておくと、最新のJS機能やMap操作が安心して使えます。
