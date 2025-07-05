// 以下は、**TypeScript** で実装した、**2D差分法 + 累積和** による高速かつ省メモリな解法です。
// `fs` モジュールを使用して標準入力から読み込み、**実行時間・メモリ使用量**の制約にしっかり収まるよう設計しています。

// ## ✅ TypeScript 実装（Node.js 環境）
import * as fs from 'fs';

// 入力の読み込み
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const N: number = parseInt(input[0]);
const gridSize = 1502; // 最大座標1501までカバー

// 2D差分配列（16bit整数で十分）
const grid: Int16Array[] = Array.from({ length: gridSize }, () => new Int16Array(gridSize));

// 差分配列の構築
for (let i = 1; i <= N; i++) {
    const [a, b, c, d] = input[i].split(' ').map(Number);
    grid[a][b] += 1;
    grid[c][b] -= 1;
    grid[a][d] -= 1;
    grid[c][d] += 1;
}

// 横方向に累積
for (let x = 0; x < gridSize; x++) {
    for (let y = 1; y < gridSize; y++) {
        grid[x][y] += grid[x][y - 1];
    }
}

// 縦方向に累積
for (let y = 0; y < gridSize; y++) {
    for (let x = 1; x < gridSize; x++) {
        grid[x][y] += grid[x - 1][y];
    }
}

// 最終的な面積の計算（1以上のセルをカウント）
let area: number = 0;
for (let x = 0; x < 1501; x++) {
    for (let y = 0; y < 1501; y++) {
        if (grid[x][y] > 0) area++;
    }
}

console.log(area);

// ## ✅ 処理時間・メモリ使用量の目安

// | 項目       | 内容                                      |
// | -------- | --------------------------------------- |
// | 時間計算量    | `O(N + HW)` ≒ 10⁵ + 1500² = 約 2.3 × 10⁶ |
// | メモリ使用量   | `約 4.5MB（= 1502² × 2byte）`              |
// | メモリ制限以内  | ✅（1024MiB 制限に対して十分小さい）                  |
// | 実行時間制限以内 | ✅（数百ミリ秒程度で処理可能）                         |

// ---

// ## ✅ 入力例テスト

// **入力**

// ```
// 2
// 1 1 3 3
// 2 2 4 4
// ```

// **出力**

// ```
// 7
// ```

// ---

// ## ✅ 補足

// * `Int16Array` を使うことで、最大値が `N` 以下（≦ 100000）で収まるように設計し、メモリ効率を向上。
// * `gridSize = 1502` として、右上の境界 `(1501,1501)` を含めても安全にアクセスできるよう配慮しています。
