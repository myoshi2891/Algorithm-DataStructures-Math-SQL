// この問題は、「**格子上の経路数の組み合わせ問題**」です。
// マス (1,1) から (H,W) まで、**右（→）と下（↓）のみ**で移動する方法の総数は、
// **組み合わせ H+W−2 C H−1（または W−1）** によって求まります。

// ---

// ### 🔢 アプローチ概要

// * 必要な計算：`C(H + W - 2, H - 1)` を `1000000007` で割った余り
// * 実装ポイント：

//   * **階乗とその逆元を事前に前計算**
//   * **フェルマーの小定理**により逆元を `a^(MOD-2) mod MOD` で求める
//   * **高速な累乗関数**と**組み合わせ計算関数**を分離

// ---

// ### ✅ JavaScript (Node.js) 実装コード

// ```javascript
// Node.jsでの標準入力処理 + 組み合わせ計算（mod 1e9+7対応）
const fs = require('fs');

const MOD = 1000000007n; // ModuloをBigIntで定義
const MAX = 200000; // 最大 (H+W-2) まで対応

// BigInt階乗・逆元の配列
const fact = Array(MAX + 1);
const invFact = Array(MAX + 1);

/**
 * 累乗計算（a^b % MOD）
 * @param {bigint} base 底
 * @param {bigint} exp 指数
 * @returns {bigint} base^exp % MOD
 */
function modPow(base, exp) {
  let result = 1n;
  base %= MOD;
  while (exp > 0) {
    if (exp % 2n === 1n) result = result * base % MOD;
    base = base * base % MOD;
    exp >>= 1n;
  }
  return result;
}

/**
 * 前計算: fact[], invFact[] を埋める
 */
function precomputeFactorials() {
  fact[0] = 1n;
  for (let i = 1; i <= MAX; i++) {
    fact[i] = fact[i - 1] * BigInt(i) % MOD;
  }
  invFact[MAX] = modPow(fact[MAX], MOD - 2n);
  for (let i = MAX - 1; i >= 0; i--) {
    invFact[i] = invFact[i + 1] * BigInt(i + 1) % MOD;
  }
}

/**
 * nCr % MOD を計算する
 * @param {number} n
 * @param {number} r
 * @returns {bigint}
 */
function comb(n, r) {
  if (r < 0 || r > n) return 0n;
  return fact[n] * invFact[r] % MOD * invFact[n - r] % MOD;
}

// 入力読み取りと出力処理
function main(input) {
  const [H, W] = input.trim().split(' ').map(Number);
  precomputeFactorials(); // 階乗と逆元の前計算
  const totalSteps = H + W - 2;
  const downSteps = H - 1;
  const answer = comb(totalSteps, downSteps);
  console.log(answer.toString()); // bigint を string にして出力
}

// 標準入力から読み込んで実行
main(fs.readFileSync('/dev/stdin', 'utf8'));

// ### 📊 パフォーマンス見積

// * **時間計算量**：

//   * `O(MAX)` = 最大 200,000 回の前計算
//   * `O(1)` で `C(n, r)` 計算可能
// * **メモリ消費**：

//   * `fact[]`, `invFact[]` に最大で約 200,000 要素 → 約 3MB 未満

// ---

// ### ✅ 出力例確認

// * `1 2` → `1`
// * `5 10` → `715`
// * `869 120` → `223713395`

// ---

// 必要であれば、`BigInt` を使わずに高速Mod演算で処理する整数版も提供可能です。
