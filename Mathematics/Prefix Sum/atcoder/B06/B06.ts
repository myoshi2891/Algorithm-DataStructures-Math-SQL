// ## ✅ TypeScript 解法（`fs`を使って標準入力を読む）
import * as fs from 'fs';

// 標準入力の読み取り
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');

const N = parseInt(input[0]);
const A = input[1].split(' ').map(Number);
const Q = parseInt(input[2]);
const queries: [number, number][] = input.slice(3).map((line) => {
    const [L, R] = line.split(' ').map(Number);
    return [L, R];
});

// 累積和: acc[i] = A[0] ~ A[i-1] までのアタリ(=1)の数
const acc: number[] = new Array(N + 1).fill(0);
for (let i = 0; i < N; i++) {
    acc[i + 1] = acc[i] + A[i];
}

// クエリ処理
const results: string[] = [];
for (const [L, R] of queries) {
    const ones = acc[R] - acc[L - 1];
    const total = R - L + 1;
    const zeros = total - ones;

    if (ones > zeros) {
        results.push('win');
    } else if (ones < zeros) {
        results.push('lose');
    } else {
        results.push('draw');
    }
}

// 出力
console.log(results.join('\n'));

// ## ✅ 補足ポイント

// * `acc[i]` は `A[0]` から `A[i - 1]` までのアタリの数（0ベースのため `acc[i+1] = acc[i] + A[i]`）。
// * 各クエリは 1-indexed なので `acc[R] - acc[L - 1]` で区間 `[L, R]` のアタリ数。
// * 出力は `console.log` 一括。

// ## ✅ 入力例と出力（確認）

// ### 入力

// ```
// 7
// 0 1 1 0 1 0 0
// 3
// 2 5
// 2 7
// 5 7
// ```

// ### 出力

// ```
// win
// draw
// lose
// ```

// ---

// このコードは **最大 10⁵ 件のクエリに対しても高速に処理**できます。
// Node.js で TypeScript を実行するには `ts-node` を使うのが便利です。

// ```bash
// npx ts-node solution.ts < input.txt
// ```
