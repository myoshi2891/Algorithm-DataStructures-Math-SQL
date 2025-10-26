// 以下は **TypeScript (5.1) + Node.js (18.16.1)** 向けに、`fs` モジュールを使用して **各生徒の正解数** を高速に求めるプログラムです。

// ---

// ### ✅ 実装のポイント

// * 時間計算量：`O(M + N)`
// * 空間計算量：`O(N)`
// * 各生徒について「**間違えた回数**」を記録し、正解数は `M - 間違えた回数` で算出。
// * 入力は `/dev/stdin` 経由で `fs.readFileSync()` により受け取る。

// ---

// ### ✅ TypeScript コード（`main.ts`）

// ```ts
import * as fs from 'fs';

/**
 * 各生徒の正解数を計算する
 * @param N - 生徒の人数 (1 <= N <= 200000)
 * @param M - 問題数 (1 <= M <= 200000)
 * @param A - 各問題で間違えた生徒番号の配列（1-indexed）
 * @returns 各生徒の最終正解数の配列（index: 0-based）
 */
function calculateCorrectAnswers(N: number, M: number, A: number[]): number[] {
    const wrongCounts: number[] = new Array(N).fill(0);

    for (let i = 0; i < M; i++) {
        const studentIdx = A[i] - 1; // 1-indexed → 0-indexed
        wrongCounts[studentIdx]++;
    }

    // 各生徒の正解数 = M - 間違えた回数
    return wrongCounts.map((wrong) => M - wrong);
}

/**
 * エントリーポイント：標準入力から読み取り、結果を出力
 */
function main(): void {
    const input: string = fs.readFileSync('/dev/stdin', 'utf-8').trim();
    const tokens: string[] = input.split(/\s+/);

    const N: number = Number(tokens[0]);
    const M: number = Number(tokens[1]);
    const A: number[] = tokens.slice(2).map(Number);

    const results: number[] = calculateCorrectAnswers(N, M, A);

    // 出力
    console.log(results.join('\n'));
}

main();
// ```

// ---

// ### ✅ 実行方法

// TypeScript を使用するため、次の手順で実行できます。

// #### 1. `tsconfig.json` を用意（簡易設定）

// ```json
// {
//   "compilerOptions": {
//     "target": "ES2020",
//     "module": "commonjs",
//     "strict": true,
//     "esModuleInterop": true,
//     "outDir": "./dist"
//   }
// }
// ```

// #### 2. コンパイルして実行

// ```bash
// tsc main.ts
// node dist/main.js < input.txt
// ```

// ---

// ### ✅ テスト例

// #### `input.txt`

// ```
// 4 6
// 1 4 1 4 2 1
// ```

// #### 実行結果

// ```
// 3
// 5
// 6
// 4
// ```

// ---

// ### ✅ 備考（メモリ・速度対策）

// * `fs.readFileSync` で一括読み取り → 高速かつメモリ効率良
// * `Array.fill(0)` + 1-pass のループでカウント
// * 出力は `console.log(results.join('\n'))` により一括

// ---

// ご希望があれば、プロファイル用に `console.time()` や `process.memoryUsage()` の追加も可能です。
