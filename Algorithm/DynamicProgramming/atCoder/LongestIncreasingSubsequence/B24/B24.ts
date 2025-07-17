// 以下は TypeScript 5.1（Node.js 18.16.1）で書かれた、**箱の最大ネスト数を求める実装**です。
// `fs` を用いて入力を読み込み、処理時間・メモリ効率を重視した **O(N log N)** の解法を使用しています。

// ---

// ## ✅ TypeScript 実装

// ```ts
import * as fs from 'fs';

/**
 * 与えられた箱の配列に対して最大で何重にネストできるかを求める関数
 * @param boxes - 各箱の [縦, 横] の2次元配列
 * @returns 最大ネスト数（整数）
 */
function maxNestingDepth(boxes: [number, number][]): number {
  // 1. X昇順、Xが同じならY降順でソート
  boxes.sort((a, b) => {
    if (a[0] === b[0]) return b[1] - a[1]; // Y降順
    return a[0] - b[0]; // X昇順
  });

  // 2. Yの配列でLIS（Longest Increasing Subsequence）を求める
  const lis: number[] = [];

  for (const [, y] of boxes) {
    let left = 0, right = lis.length;
    while (left < right) {
      const mid = (left + right) >> 1;
      if (lis[mid] < y) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    if (left === lis.length) {
      lis.push(y);
    } else {
      lis[left] = y;
    }
  }

  return lis.length;
}

/**
 * 標準入力からデータを読み込み、最大ネスト数を出力する関数
 */
function main(): void {
  const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\n');
  const N: number = Number(input[0]);
  const boxes: [number, number][] = input.slice(1).map(line => {
    const [x, y] = line.split(' ').map(Number);
    return [x, y];
  });

  const result = maxNestingDepth(boxes);
  console.log(result);
}

main();

// ## ✅ 実行性能

// | 要素      | 内容                      |
// | ------- | ----------------------- |
// | 時間計算量   | `O(N log N)`（ソート + LIS） |
// | 空間計算量   | `O(N)`（LIS配列）           |
// | メモリ効率   | 高い（最大でも `N` 分の配列）       |
// | 最大対応サイズ | `N ≦ 100,000` で十分対応可能   |

// ---

// ## ✅ テスト例

// ### 入力:

// ```
// 5
// 30 50
// 10 30
// 40 10
// 50 20
// 40 60
// ```

// ### 出力:

// ```
// 3
// ```

// ---

// ## 🔎 解法補足

// * `X` が同じとき `Y` を**降順**に並べる理由：

//   * LIS において `X` が同じで `Y` が昇順だと、誤って同じ `X` によるネストを許してしまう。
//   * 降順にすることで、同じ `X` の箱は先に処理されて除外される（＝正しいネスト条件が維持される）。
