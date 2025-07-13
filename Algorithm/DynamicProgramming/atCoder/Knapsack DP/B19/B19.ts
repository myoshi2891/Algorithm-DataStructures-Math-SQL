// はい、TypeScript で関数を分割し、それぞれに明確な役割と返却値のコメントを付けた形で整理可能です。
// 以下に、処理を **3つの関数** に分けた構造化された解法を示します：

// ### ✅ 関数構成

// | 関数名             | 役割             | 返却値               |
// | --------------- | -------------- | ----------------- |
// | `parseInput`    | 入力文字列からデータをパース | `{ N, W, items }` |
// | `solveKnapsack` | DPで最大価値を計算     | `number`（最大価値）    |
// | `main`          | 入出力処理および全体制御   | `void`（出力のみ）      |

// ### ✅ TypeScript コード（構造化 + コメント付き）

// ```ts
import * as fs from 'fs';

// 品物の型定義
type Item = { w: number; v: number };

/**
 * 標準入力からのデータをパースする
 * @param input 入力文字列（複数行）
 * @returns 品物数N、容量W、品物配列items
 */
function parseInput(input: string): { N: number; W: number; items: Item[] } {
  const lines = input.trim().split('\n');
  const [N, W] = lines[0].split(' ').map(Number);
  const items: Item[] = lines.slice(1).map(line => {
    const [w, v] = line.split(' ').map(Number);
    return { w, v };
  });
  return { N, W, items };
}

/**
 * ナップザック問題を価値軸DPで解く
 * @param N 品物数
 * @param W ナップサックの容量
 * @param items 品物の配列
 * @returns 価値の合計としてあり得る最大の値
 */
function solveKnapsack(N: number, W: number, items: Item[]): number {
  const maxValue = items.reduce((sum, item) => sum + item.v, 0);
  const dp: number[] = Array(maxValue + 1).fill(Infinity);
  dp[0] = 0;

  for (const { w, v } of items) {
    for (let val = maxValue; val >= v; val--) {
      if (dp[val - v] + w <= W) {
        dp[val] = Math.min(dp[val], dp[val - v] + w);
      }
    }
  }

  // dp[v] <= W となる最大の v を返す
  for (let v = maxValue; v >= 0; v--) {
    if (dp[v] <= W) return v;
  }
  return 0;
}

/**
 * メイン関数：標準入力から読み取り、最大価値を出力する
 * @returns void（標準出力）
 */
function main(): void {
  const input = fs.readFileSync('/dev/stdin', 'utf8');
  const { N, W, items } = parseInput(input);
  const result = solveKnapsack(N, W, items);
  console.log(result);
}

// エントリーポイント
main();

// ### ✅ 実行方法（同様）

// ```bash
// tsc main.ts
// node main.js < input.txt
// ```

// ### ✅ 構造化のメリット
// * **`parseInput`** でテスト可能な構造
// * **`solveKnapsack`** 単体でアルゴリズム検証可能
// * `main()` でI/Oを完結させており、**ユニットテストとの分離が容易**

// ✅ 解法のポイント（復習）
// 制約：W ≤ 1e9 → 重さ軸のDP不可
// 価値軸でDP：dp[v] = 重さの最小値
// 配列長：最大で 100 * 1000 = 100,000（安全）
// 品物ごとに逆順で更新（1個ずつ選ぶため）

// ✅ 実行時パフォーマンスの見積もり
// 項目	内容
// 時間計算量	O(N × maxValue) ≈ 1e7
// メモリ使用量	約 100,000 × 4 byte ≒ 400KB
// 実行時間制限	10 秒（十分に高速）
// メモリ制限	1024 MiB（余裕あり）