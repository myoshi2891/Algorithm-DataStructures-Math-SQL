// 以下は TypeScript (Node.js 18.16.1, TypeScript 5.1) を用いた **格子経路数の計算**（`H+W-2`C`H-1`）の高速な実装です。
// 処理時間・メモリ効率を重視し、**階乗と逆元の前計算**＋**フェルマーの小定理による逆元計算**を行っています。

// ---

// ### ✅ TypeScript実装コード（fs対応・関数化・BigInt使用）

// ```ts
// 使用環境: TypeScript 5.1, Node.js 18.16.1

import * as fs from 'fs';

const MOD = 1000000007n; // 10^9 + 7 を BigInt で定義
const MAX = 200000; // H + W の最大をカバー（制約: H, W ≤ 100000）

let fact: bigint[] = [];
let invFact: bigint[] = [];

/**
 * base^exp % MOD を返す関数（高速累乗、繰り返し二乗法）
 * @param base 底（BigInt）
 * @param exp 指数（BigInt）
 * @returns 累乗結果 base^exp mod MOD
 */
function modPow(base: bigint, exp: bigint): bigint {
  let result = 1n;
  base %= MOD;
  while (exp > 0n) {
    if (exp % 2n === 1n) result = (result * base) % MOD;
    base = (base * base) % MOD;
    exp >>= 1n;
  }
  return result;
}

/**
 * 階乗と逆元の前計算
 * 計算結果を global な fact[], invFact[] に格納
 */
function precomputeFactorials(): void {
  fact = Array(MAX + 1);
  invFact = Array(MAX + 1);

  fact[0] = 1n;
  for (let i = 1; i <= MAX; i++) {
    fact[i] = (fact[i - 1] * BigInt(i)) % MOD;
  }

  invFact[MAX] = modPow(fact[MAX], MOD - 2n); // フェルマーの小定理による逆元
  for (let i = MAX - 1; i >= 0; i--) {
    invFact[i] = (invFact[i + 1] * BigInt(i + 1)) % MOD;
  }
}

/**
 * 組み合わせ nCr を MOD で計算
 * @param n 全体の数（0 <= r <= n <= MAX）
 * @param r 選ぶ数
 * @returns nCr % MOD の値（BigInt）
 */
function combination(n: number, r: number): bigint {
  if (r < 0 || r > n) return 0n;
  return (fact[n] * invFact[r] % MOD) * invFact[n - r] % MOD;
}

/**
 * 入力に基づき格子経路数を計算する
 * @param input 標準入力から読み込んだ文字列（"H W"）
 * @returns 経路数（BigInt）
 */
function calculateGridPaths(input: string): bigint {
  const [H, W] = input.trim().split(/\s+/).map(Number);
  precomputeFactorials(); // 階乗と逆元の前計算
  const totalSteps = H + W - 2;
  const downSteps = H - 1;
  return combination(totalSteps, downSteps); // C(H+W-2, H-1)
}

// 標準入力から読み込み & 実行
const input = fs.readFileSync('/dev/stdin', 'utf-8');
console.log(calculateGridPaths(input).toString());

// ### 🧠 設計意図とパフォーマンス

// | 項目     | 内容                                                |
// | ------ | ------------------------------------------------- |
// | 時間計算量  | `O(MAX)`（前計算）、`O(1)`（本計算）                         |
// | メモリ使用量 | 約 3MB（`fact[]`, `invFact[]` が 200,000 要素の BigInt） |
// | 利用技術   | BigInt, 高速累乗（modPow）, フェルマーの小定理, 階乗の前計算           |

// ---

// ### ✅ 実行例（標準入力）

// #### 入力:

// ```
// 869 120
// ```

// #### 出力:

// ```
// 223713395
// ```

// ---

// ### 📦 コンパイルと実行（Node.js環境）

// ```bash
// tsc main.ts --target es2020
// node main.js < input.txt
// ```

// ---

// 必要であれば、BigInt を使わず `number` 型 + `modinv` の整数版にも書き換え可能です。ご希望があれば対応します。
