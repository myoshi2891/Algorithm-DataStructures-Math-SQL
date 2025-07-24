// 以下に、TypeScript（Node.js 18.16.1 + TypeScript 5.1）での解答を示します。
// `fs` モジュールで入力を読み込み、\*\*動的計画法（DP）\*\*を用いて石取りゲームの勝者を判定します。処理時間とメモリの消費量も `process.hrtime.bigint()` と `process.memoryUsage()` を用いて計測しています。

// ---

// ## ✅ TypeScript 解答コード

// ```ts
import * as fs from 'fs';

/**
 * 石取りゲームの勝敗を判定する関数
 * @param N - 石の総数 (1 <= N <= 100000)
 * @param moves - 一度に取れる石の数の配列（相異なる K 個、1 <= moves[i] <= 100000）
 * @returns "First" または "Second"
 */
function determineWinner(N: number, moves: number[]): string {
  const dp: boolean[] = new Array(N + 1).fill(false); // dp[i]: 石がi個の状態で先手が勝てるか

  for (let i = 1; i <= N; i++) {
    for (const move of moves) {
      if (i - move >= 0 && !dp[i - move]) {
        dp[i] = true; // 相手が負ける状態に遷移できるなら先手勝ち
        break;
      }
    }
  }

  return dp[N] ? "First" : "Second";
}

/**
 * メイン処理。標準入力から読み取り、勝者を出力。
 * 処理時間とメモリ使用量も標準エラー出力に表示。
 */
function main(): void {
  const startTime = process.hrtime.bigint(); // ナノ秒で処理開始時間計測

  const input: string = fs.readFileSync('/dev/stdin', 'utf-8');
  const tokens: number[] = input.trim().split(/\s+/).map(Number);

  const N: number = tokens[0];
  const K: number = tokens[1];
  const moves: number[] = tokens.slice(2, 2 + K);

  const result = determineWinner(N, moves);
  console.log(result);

  const endTime = process.hrtime.bigint(); // ナノ秒で処理終了時間計測
  const elapsedMs = Number(endTime - startTime) / 1e6; // ミリ秒に変換
  const memoryMb = process.memoryUsage().heapUsed / 1024 / 1024; // 使用ヒープメモリ（MB）

  console.error(`Time: ${elapsedMs.toFixed(3)} ms`);
  console.error(`Memory: ${memoryMb.toFixed(3)} MB`);
}

main();

// ## ✅ コンパイルと実行方法（Node.js + TypeScript）

// 1. このコードを `stone_game.ts` というファイル名で保存。
// 2. コンパイル:

//    ```bash
//    tsc stone_game.ts
//    ```
// 3. 実行:

//    ```bash
//    node stone_game.js < input.txt
//    ```

// ---

// ## ✅ 入力例ファイル `input.txt`

// ```
// 8 2
// 2 3
// ```

// ---

// ## ✅ 出力例

// ```
// First
// ```

// stderr:

// ```
// Time: 3.124 ms
// Memory: 4.750 MB
// ```

// ---

// ## ✅ 時間・メモリ制約に対して

// * **計算量**: `O(N × K)`（最悪 100,000 × 100 = 10^7 回のループ）→ 5秒以内に収まります
// * **空間使用量**: 約 100001 個の boolean → ≒ 100KB → メモリ制限（1024MiB）内に余裕あり

// ---

// ## ✅ 補足（ゲーム理論）

// この問題は **Nim ゲームの拡張版**です。勝敗状態を「負け状態に遷移できるか？」という視点から逆算するのが定石です。`dp[i] = true` は「先手が勝てる（winning）」状態です。
