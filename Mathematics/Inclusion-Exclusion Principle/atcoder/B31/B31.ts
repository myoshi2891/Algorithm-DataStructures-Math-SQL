// 以下は、**TypeScript 5.1 + Node.js 18.16.1** で `1 以上 N 以下の整数のうち、3, 5, 7 のいずれかで割り切れる数` の個数を求めるプログラムです。

// ---

// ### ✅ 解法：**包除原理（Inclusion-Exclusion Principle）**

// * N 以下の数で 3, 5, 7 のいずれかで割り切れる数を数えるには：

//   * `N / 3 + N / 5 + N / 7`
//   * `- N / 15 - N / 21 - N / 35`（二重カウント除外）
//   * `+ N / 105`（三重カウントを再加算）

// ---

// ### ✅ TypeScript コード（`fs` + `BigInt` 使用）

// ```ts
import * as fs from 'fs';

/**
 * N以下の整数のうち、3,5,7のいずれかで割り切れる整数の個数を返す
 * @param {bigint} N - 1以上10^12以下の整数
 * @returns {bigint} - 条件を満たす整数の個数
 */
function countMultiples(N: bigint): bigint {
  const div = (x: bigint): bigint => N / x;

  // Inclusion-Exclusion Principle
  const count =
    div(3n) + div(5n) + div(7n)
    - div(3n * 5n) - div(3n * 7n) - div(5n * 7n)
    + div(3n * 5n * 7n);

  return count;
}

/**
 * メイン処理（標準入力から読み込み、結果を出力）
 */
function main(): void {
  const input: string = fs.readFileSync('/dev/stdin', 'utf8').trim();
  const N: bigint = BigInt(input);

  const result: bigint = countMultiples(N);
  console.log(result.toString()); // BigInt型を文字列で出力
}

main();

// ### ✅ 処理時間・メモリ使用量

// | 要素      | 内容                     |
// | ------- | ---------------------- |
// | **計算量** | `O(1)`（定数回の除算のみ）       |
// | **メモリ** | `~100バイト`（BigInt変数数個）  |
// | **速度**  | 約 0.1ms 以下（I/O 除く）     |
// | **安全性** | `BigInt`使用により10^12まで対応 |

// ---

// ### ✅ 実行方法

// #### コマンド：

// ```bash
// tsc main.ts
// node main.js < input.txt
// ```

// または `ts-node` を使う場合：

// ```bash
// ts-node main.ts < input.txt
// ```

// ---

// ### ✅ 入力例と出力例の確認

// #### 入力：

// ```
// 210
// ```

// #### 出力：

// ```
// 114
// ```

// ---

// 必要であれば、ナイーブな `for` ループ実装（O(N)）や、追加のデバッグ出力付きのバージョンも提供できます。
