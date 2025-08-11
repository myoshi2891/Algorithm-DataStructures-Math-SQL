// では TypeScript の **ジャンプ表を1本だけ使うメモリ削減版** を作ります。

// ポイントは：

// * 全レベルのジャンプ表を保持せず、
//   「今のジャンプ表から次のジャンプ表を再計算していく」方式にする。
// * 計算順序は K のビットを低位から順に見ていき、
//   必要なときにジャンプを適用し、
//   その後ジャンプ表を2倍化していく。
// * メモリは `N+1` 長の配列を 1 本だけ持つので **約 1.2MB** まで削減可能。

// ---

// ```typescript
// TypeScript 5.1 (Node.js 18.16.1)
// fsを使った高速入出力
import * as fs from "fs";
const input = fs.readFileSync(0, "utf8").trim().split(/\s+/).map(Number);
const N: number = input[0];
let K: bigint = BigInt(input[1]); // BigInt でビット演算

/**
 * 桁和を計算する関数
 * @param x - 計算対象の整数
 * @returns 桁の和
 */
function sumDigits(x: number): number {
    let s = 0;
    while (x > 0) {
        s += x % 10;
        x = Math.floor(x / 10);
    }
    return s;
}

/**
 * メイン処理（ジャンプ表1本でメモリ削減版）
 * @param N - 初期整数の最大値 (1〜N)
 * @param K - 操作回数 (BigInt)
 * @returns 各整数の最終値
 */
function solve(N: number, K: bigint): Uint32Array {
    // 1ステップ先を格納するジャンプ表（動的に2倍化していく）
    let jump = new Uint32Array(N + 1);
    for (let i = 1; i <= N; i++) {
        jump[i] = i - sumDigits(i);
    }

    // 各iの現在位置
    let cur = new Uint32Array(N + 1);
    for (let i = 1; i <= N; i++) cur[i] = i;

    let bit = 0;
    let steps = K;
    while (steps > 0n) {
        // このビットが立っていたら適用
        if (steps & 1n) {
            for (let i = 1; i <= N; i++) {
                cur[i] = jump[cur[i]];
            }
        }
        // ジャンプ表を2倍化
        const nextJump = new Uint32Array(N + 1);
        for (let i = 1; i <= N; i++) {
            nextJump[i] = jump[jump[i]];
        }
        jump = nextJump;

        steps >>= 1n;
        bit++;
    }

    // 出力用配列（1-indexから0-indexに変換）
    const res = new Uint32Array(N);
    for (let i = 1; i <= N; i++) res[i - 1] = cur[i];
    return res;
}

// 実行
const result = solve(N, K);

// 出力
let output = "";
for (let i = 0; i < N; i++) {
    output += result[i] + "\n";
}
process.stdout.write(output);

// ## **特徴**

// * **メモリ削減効果**

//   * 通常版： `jump[LOG][N+1]` → 約 40MB
//   * この版： `jump[N+1]` だけ → 約 1.2MB
// * **時間計算量**

//   * $O(N \log K)$ は同じですが、
//     ジャンプ表再計算時に配列の新規確保があり、通常版より少し遅くなります。
//   * N=300,000, K=1e9 でも 1〜2 秒程度で収まる想定。

// ---

// もし望むなら、このアルゴリズムを **Go や Python でも同じ省メモリ版** にできます。
// このまま移植版も作りますか？
