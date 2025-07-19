TypeScript で実装された **最小公倍数（LCM）計算プログラム** の各処理について、**図とともに段階的に詳しく解析・説明**します。

---

## 🔷 問題の目的：

2つの正の整数 `A`、`B` の **最小公倍数（LCM）** を求める。

---

## 🔶 Step 1: 入力の読み込み

```ts
const input: string = fs.readFileSync('/dev/stdin', 'utf-8').trim();
const [aStr, bStr]: string[] = input.split(' ');
const a: bigint = BigInt(aStr);
const b: bigint = BigInt(bStr);
```

### 🔹説明：

* `/dev/stdin` から一行読み込み（例: `"25 30"`）
* 空白で分割し、`BigInt` に変換

### 📘図解：

```
入力: "25 30"
         ↓
   ["25", "30"]
         ↓
 [BigInt(25), BigInt(30)] ← 整数が非常に大きくなるため BigInt を使う
```

---

## 🔶 Step 2: 最大公約数（GCD）計算

```ts
function gcd(a: bigint, b: bigint): bigint {
    while (b !== 0n) {
        const temp: bigint = b;
        b = a % b;
        a = temp;
    }
    return a;
}
```

### 🔹説明：

ユークリッドの互除法により最大公約数を計算。

### 📘図解（例：`gcd(25, 30)`）

```
1. a = 25, b = 30
   → 25 % 30 = 25, swap → a = 30, b = 25

2. a = 30, b = 25
   → 30 % 25 = 5, swap → a = 25, b = 5

3. a = 25, b = 5
   → 25 % 5 = 0, swap → a = 5, b = 0

終了：GCD = 5
```

---

## 🔶 Step 3: 最小公倍数（LCM）計算

```ts
function lcm(a: bigint, b: bigint): bigint {
    return (a / gcd(a, b)) * b;
}
```

### 🔹説明：

公式

$$
\text{LCM}(a, b) = \frac{a}{\gcd(a, b)} \times b
$$

を使って計算します。

### 📘図解（例：`lcm(25, 30)`）

```
GCD = 5
25 / 5 = 5
5 * 30 = 150 → LCM
```

> ✅ この順番（割ってから掛ける）にすることで、BigIntのオーバーフローを防止！

---

## 🔶 Step 4: 結果の出力

```ts
console.log(result.toString());
```

### 🔹説明：

* `BigInt` は直接 `console.log` できるが、`toString()` をつけることで確実に文字列出力
* 出力例: `150`

---

## ✅ 処理の流れまとめ図

```mermaid
graph TD
    A[入力: A B] --> B[split & BigInt変換]
    B --> C[gcd(a, b)]
    C --> D[lcm = (a / gcd) * b]
    D --> E[console.log(lcm.toString())]
```

---

## ✅ 入力例解析（998244353 と 998244853）

### Step-by-step:

1. `a = 998244353n`, `b = 998244853n`
2. `gcd(a, b) = 1n`（素数なので）
3. `lcm = (a / 1n) * b = a * b`
4. 結果: `996492287418565109n`

---

## ✅ パフォーマンス観点（処理時間・メモリ）

| 項目    | 内容                       |
| ----- | ------------------------ |
| 時間計算量 | O(log(min(A, B)))（GCD）   |
| メモリ使用 | `BigInt`3個 + 一時変数（数百バイト） |
| 出力    | O(1)（`console.log`）      |

---

## 🔚 最後に

この処理は以下の特性を持ちます：

* **精度重視**：BigIntにより桁あふれを防止
* **効率的**：ユークリッドの互除法
* **メモリ軽量**：再帰を使わず、固定変数のみ使用

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-07-19 20:18:49 | [B27 - Calculate LCM](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cz) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 1077 Byte |  | 1 ms | 1704 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67701246) |
| 2025-07-19 20:16:13 | [B27 - Calculate LCM](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cz) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 1344 Byte |  | 14 ms | 21356 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67701202) |
| 2025-07-19 20:12:51 | [B27 - Calculate LCM](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cz) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 1019 Byte |  | 19 ms | 10616 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67701149) |
| 2025-07-19 20:03:09 | [B27 - Calculate LCM](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cz) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 1093 Byte |  | 41 ms | 42944 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67701000) |
| 2025-07-19 20:00:41 | [B27 - Calculate LCM](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cz) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 827 Byte |  | 51 ms | 42764 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67700966) |