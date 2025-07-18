// 以下は **TypeScript 5.1** + **Node.js 18.16.1** を用いた解法です。
// エラトステネスの篩で高速に素数列挙を行い、標準入力は `fs.readFileSync` 経由で読み取り、出力は `console.log` で行います。
// コメントにてパラメーター・返却値の説明、処理時間とメモリ使用量の計測も含めています。

// ---

// ### ✅ TypeScriptコード（`main.ts`など）

// ```ts
import * as fs from 'fs';

/**
 * N 以下のすべての素数を小さい順に列挙する（エラトステネスの篩）
 * @param n - 素数を列挙する上限値（2 <= n <= 1_000_000）
 * @returns 素数の数値配列（昇順）
 */
function sieveOfEratosthenes(n: number): number[] {
    const isPrime: boolean[] = new Array(n + 1).fill(true);
    isPrime[0] = false;
    isPrime[1] = false;

    for (let i = 2; i * i <= n; i++) {
        if (isPrime[i]) {
            for (let j = i * i; j <= n; j += i) {
                isPrime[j] = false;
            }
        }
    }

    const primes: number[] = [];
    for (let i = 2; i <= n; i++) {
        if (isPrime[i]) primes.push(i);
    }
    return primes;
}

// === 入力処理 ===
const input: string = fs.readFileSync('/dev/stdin', 'utf8').trim();
const N: number = parseInt(input, 10);

// === 時間・メモリ測定開始 ===
console.time('Execution Time');

const memoryBefore = process.memoryUsage().heapUsed;

// === 素数列挙 ===
const primes: number[] = sieveOfEratosthenes(N);

// === 出力 ===
console.log(primes.join('\n'));

// === 時間・メモリ測定終了 ===
console.timeEnd('Execution Time');
const memoryAfter = process.memoryUsage().heapUsed;
const memoryUsed = (memoryAfter - memoryBefore) / 1024 / 1024;
console.error(`Memory Used: ${memoryUsed.toFixed(2)} MB`);

// ### ✅ 補足

// * **処理時間計測**：`console.time` / `console.timeEnd` を使用。
// * **メモリ使用量**：`process.memoryUsage().heapUsed` を用いMB単位で表示。
// * **出力先**：

//   * 標準出力（`stdout`）には素数を出力。
//   * 標準エラー（`stderr`）には処理時間・メモリを出力。

// ---

// ### 🧪 コンパイルと実行例

// ```bash
// # コンパイル
// tsc main.ts

// # 実行（入力を標準入力から受け取る）
// echo 20 | node main.js
// ```

// ---

// ### ✅ 出力例

// ```txt
// 2
// 3
// 5
// 7
// 11
// 13
// 17
// 19
// ```

// （stderrに表示）

// ```txt
// Execution Time: 5.123ms
// Memory Used: 0.43 MB
// ```

// ---

// ご希望に応じて、引数型を `bigint` 対応や、配列出力ではなく逐次 `console.log` 出力にも変更可能です。
