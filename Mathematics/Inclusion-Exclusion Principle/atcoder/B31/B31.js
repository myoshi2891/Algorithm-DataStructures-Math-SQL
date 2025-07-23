// 以下は **JavaScript（Node.js 18.16.1）** を使って、`1 以上 N 以下の整数のうち、3, 5, 7 のいずれかで割り切れる数の個数` を求める解法です。

// ---

// ### ✅ 解法の方針（包除原理）

// 以下の値を求めて、包除原理を使って合計を算出します。

// * `floor(N / 3) + floor(N / 5) + floor(N / 7)`
// * `- floor(N / 15) - floor(N / 21) - floor(N / 35)`（重複除外）
// * `+ floor(N / 105)`（三重重複を再度加算）

// ---

// ### ✅ コード（Node.js + fs）

// ```javascript
// 処理に必要なモジュールの読み込み
const fs = require('fs');

/**
 * N以下の整数のうち、3,5,7のいずれかで割り切れる数の個数を返す
 * @param {bigint} N - 上限の整数 (1 <= N <= 10^12)
 * @returns {bigint} - 条件を満たす整数の個数
 */
function countDivisibleBy3or5or7(N) {
  const div = (x) => N / BigInt(x);

  return div(3n) + div(5n) + div(7n)
       - div(3n * 5n) - div(3n * 7n) - div(5n * 7n)
       + div(3n * 5n * 7n);
}

// 入力の読み込み（標準入力またはファイル経由）
function main() {
  const input = fs.readFileSync('/dev/stdin', 'utf8').trim();
  const N = BigInt(input); // 10^12まであるためBigIntで処理

  const result = countDivisibleBy3or5or7(N);
  console.log(result.toString()); // BigIntなので文字列として出力
}

main();

// ### ✅ 実行方法

// 以下のようにして、Node.js で実行できます：

// ```bash
// node script.js < input.txt
// ```

// ---

// ### ✅ 処理時間とメモリ消費

// * **時間計算量**：O(1)（割り算数回のみ）
// * **メモリ使用量**：極小（BigInt 7 個程度）

// ---

// ### ✅ 入力例と出力例の確認

// #### 入力：

// ```
// 10
// ```

// #### 出力：

// ```
// 6
// ```

// ---

// 必要であれば、ループで `1` から `N` まで回すナイーブ解法（O(N)) も可能ですが、この問題では非現実的な制約（10^12）により、**包除原理を使った定数時間解法が必須**です。
