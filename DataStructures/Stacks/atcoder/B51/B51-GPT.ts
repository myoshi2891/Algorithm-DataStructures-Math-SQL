// 以下は、TypeScript (Node.js 18.16.1) による対応括弧位置出力の解答です。

// ---

// ## ✅ 要件に対する対応

// | 要件                   | 対応内容                                       |
// | -------------------- | ------------------------------------------ |
// | TypeScript 5.1       | `tsconfig` に準拠した型付きで記述                     |
// | `fs` を使用             | `readFileSync('/dev/stdin', 'utf8')` により対応 |
// | 実行時間・メモリ考慮           | O(N) 時間 + O(N) 空間で高速に対応可能                  |
// | 関数化                  | 入出力処理・括弧ペア処理を関数に分離                         |
// | 出力条件 (`max(l,r)` 昇順) | ソート関数にて適切に処理                               |

// ---

// ## ✅ 実装（TypeScript）

// ```ts
import * as fs from 'fs';

/**
 * 括弧列 S のすべての対応括弧の位置ペアを返す。
 * @param S - 対応の取れた括弧列（例: "(())()"）
 * @returns 対応する括弧の位置ペア（1-indexed, max(l,r)昇順）
 */
function findMatchingParentheses(S: string): [number, number][] {
    const stack: number[] = [];
    const pairs: [number, number][] = [];

    for (let i = 0; i < S.length; i++) {
        if (S[i] === '(') {
            stack.push(i + 1); // 1-indexed
        } else {
            const left = stack.pop();
            if (left !== undefined) {
                pairs.push([left, i + 1]);
            }
        }
    }

    // 出力条件：max(l, r) 昇順にソート
    pairs.sort((a, b) => Math.max(a[0], a[1]) - Math.max(b[0], b[1]));
    return pairs;
}

/**
 * 標準入力を読み込み、括弧の対応関係を出力するメイン処理。
 */
function main(): void {
    const input: string = fs.readFileSync('/dev/stdin', 'utf8').trim();
    const result: [number, number][] = findMatchingParentheses(input);
    const output: string = result.map(([l, r]) => `${l} ${r}`).join('\n');
    console.log(output);
}

main();
// ```

// ---

// ## ✅ 処理時間・メモリ使用量の目安

// * **時間計算量:** `O(N)` （スタック + ソート：最大でも `N/2` 個のペア）
// * **空間計算量:** `O(N)`（スタック + ペア保存）

// ---

// 必要に応じて、入力が巨大なケースでの `readFileSync` の代替や、`readline` に切り替えることも可能ですが、**本問題の仕様では `readFileSync` が最速です。**

// ご希望があれば、`readline` を用いたバージョンも提示できます。
