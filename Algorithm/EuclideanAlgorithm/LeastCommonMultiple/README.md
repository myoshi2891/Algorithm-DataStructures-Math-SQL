---

## ✅ TypeScriptでの最小公倍数（LCM）計算コード

```ts
import * as fs from 'fs';

// 標準入力の読み込み
const input = fs.readFileSync(0, 'utf8').trim().split('\n');

const N: number = parseInt(input[0]);
const A: number[] = input.slice(1).map(Number);

// 最大公約数（GCD）を求める関数（ユークリッドの互除法）
function gcd(a: number, b: number): number {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// 最小公倍数（LCM）を求める関数
function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
}

// 配列全体に対してLCMを求める
let result: number = A[0];
for (let i = 1; i < N; i++) {
    result = lcm(result, A[i]);
}

console.log(result);
```

---

## 🔍 各処理の詳細説明

### ① 入力の読み込み

```ts
const input = fs.readFileSync(0, 'utf8').trim().split('\n');
```

- 標準入力（`fs.readFileSync(0)`）から入力を読み込みます。
- 改行で分割し、配列として処理します。

例: `["4", "2", "3", "5", "7"]`

---

### ② 入力値の変換

```ts
const N: number = parseInt(input[0]);
const A: number[] = input.slice(1).map(Number);
```

- `N` は入力の最初の行にある数値（整数の個数）。
- `A` はそれ以降の行をすべて数値に変換した配列です。

---

### ③ GCD（最大公約数）の計算

```ts
function gcd(a: number, b: number): number {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}
```

- **ユークリッドの互除法**を用いたGCD計算。
- 例: `gcd(25, 10)` → `gcd(10, 5)` → `gcd(5, 0)` → 結果は 5。

---

### ④ LCM（最小公倍数）の計算

```ts
function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
}
```

- LCMの公式: `LCM(a, b) = a * b / GCD(a, b)`
- 例えば `lcm(10, 25)` → `10 * 25 / 5 = 50`

---

### ⑤ 配列全体のLCMを求める

```ts
let result: number = A[0];
for (let i = 1; i < N; i++) {
    result = lcm(result, A[i]);
}
```

- `A[0]` を初期値にして、次の数とLCMを取りながら順に処理。
- 例: `lcm(A[0], A[1])` → `lcm(その結果, A[2])` → ...

---

### ⑥ 出力

```ts
console.log(result);
```

- 最終的に求まった最小公倍数を1行で出力します。

---

## 🧠 注意点と利点

- **数値制限に注意**（JSのNumber型は最大安全整数 `2^53 - 1` ≒ `9e15`。本問題は10^13までなのでOK）
- 入力数が最大100個でも、1個ずつLCMを取ることで効率よく処理できます。
- GCD計算は非常に高速なので、全体でも実行速度に問題はありません。

---

## ✅ 実行例

入力:

```
4
2
3
5
7
```

出力:

```
210
```

（2, 3, 5, 7 は互いに素なので LCM = 2 × 3 × 5 × 7 = 210）

---
