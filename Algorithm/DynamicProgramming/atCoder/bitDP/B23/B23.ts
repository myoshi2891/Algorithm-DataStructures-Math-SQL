// 以下は **TypeScript (5.1)** + **Node.js (18.16.1)** を用いた、**巡回セールスマン問題 (TSP)** をビットDPで解く解法です。
// `fs` モジュールを使って標準入力を受け取り、計算量・メモリ制限を考慮した実装になっています。

// ---

// ### ✅ TypeScript 実装（`main.ts`）

// ```ts
import * as fs from 'fs';

/**
 * 都市巡回セールスマン問題を解く関数（ビットDP）
 * @param N - 都市の数（2 <= N <= 15）
 * @param coords - 都市の座標配列 [ [x1, y1], [x2, y2], ..., [xN, yN] ]
 * @returns 最短距離（小数で返却）
 */
function solveTSP(N: number, coords: [number, number][]): number {
    const dist: number[][] = Array.from({ length: N }, () => Array(N).fill(0));

    // 距離を前計算（ユークリッド距離）
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const dx = coords[i][0] - coords[j][0];
            const dy = coords[i][1] - coords[j][1];
            dist[i][j] = Math.hypot(dx, dy);
        }
    }

    const INF = Infinity;
    const dp: number[][] = Array.from({ length: 1 << N }, () => Array(N).fill(INF));
    dp[1][0] = 0; // スタートは都市0（ビット1）

    for (let s = 1; s < 1 << N; s++) {
        for (let u = 0; u < N; u++) {
            if (!(s & (1 << u))) continue;
            for (let v = 0; v < N; v++) {
                if (s & (1 << v)) continue;
                const ns = s | (1 << v);
                dp[ns][v] = Math.min(dp[ns][v], dp[s][u] + dist[u][v]);
            }
        }
    }

    let res = INF;
    for (let u = 1; u < N; u++) {
        res = Math.min(res, dp[(1 << N) - 1][u] + dist[u][0]); // 最後にスタートに戻る
    }

    return res;
}

// --- 入力処理と出力 ---
function main(): void {
    const input: string = fs.readFileSync('/dev/stdin', 'utf8').trim();
    const lines: string[] = input.split('\n');
    const N: number = Number(lines[0]);
    const coords: [number, number][] = lines.slice(1).map((line) => {
        const [x, y] = line.split(' ').map(Number);
        return [x, y];
    });

    const result = solveTSP(N, coords);
    console.log(result.toFixed(12)); // 小数第12位まで出力
}

main();

// ### ✅ 実行方法

// 1. ファイル名を `main.ts` に保存
// 2. TypeScript をコンパイル：

// ```bash
// tsc main.ts
// ```

// 3. 実行：

// ```bash
// node main.js < input.txt
// ```

// ---

// ### ✅ メモリ・処理時間の見積もり

// | 要素     | 値                               |
// | ------ | ------------------------------- |
// | 時間計算量  | `O(N^2 * 2^N)`（N=15で約500,000回）  |
// | メモリ使用量 | 約 `8 * N * 2^N` byte（最大約 4 MiB） |
// | 距離誤差対応 | `toFixed(12)` で出力誤差1e-3以下を保証    |

// ---

// ### ✅ 入出力例

// #### 入力（例1）

// ```
// 4
// 0 0
// 0 1
// 1 0
// 1 1
// ```

// #### 出力

// ```
// 4.000000000000
// ```

// ---

// 何か不明点や経路復元付きの実装などが必要であれば、お知らせください！
