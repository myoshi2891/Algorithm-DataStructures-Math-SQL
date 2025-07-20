TypeScriptによるフィボナッチ数列の漸化式 `a₁ = 1, a₂ = 1, aₙ = aₙ₋₁ + aₙ₋₂` を **`O(N)` 時間でメモリ効率よく計算する処理**について、**各ステップを図を交えて詳細に解析**します。

---

## 🔢 問題再掲：フィボナッチ数列

### 定義：

* $a_1 = 1$
* $a_2 = 1$
* $a_n = a_{n-1} + a_{n-2} \quad (n \geq 3)$

---

## 💻 実装コード（再掲・簡略）

```ts
function fibonacciMod(n: number): number {
    const MOD = 1_000_000_007;
    if (n === 1 || n === 2) return 1;

    let prev = 1; // a(n-2)
    let curr = 1; // a(n-1)

    for (let i = 3; i <= n; i++) {
        const next = (prev + curr) % MOD;
        prev = curr;
        curr = next;
    }

    return curr;
}
```

---

## 🧠 アルゴリズム解析（図解付き）

---

### 🧾 初期状態（n = 1 または 2）

```text
if (n === 1 || n === 2) return 1;
```

この条件により、不要なループ処理を省略できます。

```text
n = 1 → return 1
n = 2 → return 1
```

---

### 📥 変数初期化

```ts
let prev = 1; // a(n-2)
let curr = 1; // a(n-1)
```

### 🔁 ループ処理：i = 3 〜 N

```text
ループは以下の状態遷移を繰り返します：

prev   curr    next
-----------------------
 a₁      a₂     a₃ = a₁ + a₂
 a₂      a₃     a₄ = a₂ + a₃
 a₃      a₄     a₅ = a₃ + a₄
 ...
 aₙ₋₂    aₙ₋₁   aₙ = aₙ₋₂ + aₙ₋₁
```

#### 🧮 例：N = 6 の場合

```text
初期:
prev = 1   curr = 1

i = 3:
next = (1 + 1) % MOD = 2
prev = 1   curr = 2

i = 4:
next = (1 + 2) % MOD = 3
prev = 2   curr = 3

i = 5:
next = (2 + 3) % MOD = 5
prev = 3   curr = 5

i = 6:
next = (3 + 5) % MOD = 8
prev = 5   curr = 8 ← ✅ 答え
```

---

### 📊 図によるステップ遷移（N=6）

```
        i        prev       curr       next
      -----    --------    -------    --------
       3         1           1          2
       4         1           2          3
       5         2           3          5
       6         3           5          8 ←★最終結果
```

変数を **3つだけ** 使って、前回の2つの値から新しい値を計算して更新しています。

---

## 📉 空間効率の工夫点

配列に全ての項を保存しないことで、**O(1) のメモリ**で済みます：

```ts
// メモリ効率が悪い例（NG）
let fib = Array(N+1).fill(0);
fib[1] = fib[2] = 1;
for (let i = 3; i <= N; i++) {
  fib[i] = (fib[i-1] + fib[i-2]) % MOD;
}
return fib[N]; // O(N)メモリ使用
```

このコードは **最大1千万要素の配列確保**が必要ですが、提案コードは変数3つで同じ結果を出します。

---

## ⚙️ MOD演算の理由と効果

```ts
const MOD = 1_000_000_007;
...
const next = (prev + curr) % MOD;
```

* JavaScriptの数値は64bit浮動小数点ですが、整数の加算を繰り返すと **オーバーフローが発生**します。
* よって、**各ステップで `% MOD` を取ることで安全に整数値を維持**します。

---

## 🧪 実行例と確認

### 入力例: `6`

```text
出力: 8
→ フィボナッチ列: 1, 1, 2, 3, 5, 8
```

### 入力例: `8691200`

```text
出力: 922041576
→ 高速で計算（1秒以内）
```

---

## 🧠 補足：なぜ O(log N) にしないのか？

* 行列累乗法（O(log N)）は理論上速いが、実装・定数時間がやや重く、**最大 N = 10^7 なら O(N) の方が高速・安定**。
* メモリ制限1GB、時間10秒なら **今回の手法で十分高性能かつ安定**。

---

## ✅ 結論：提案手法の利点まとめ

| 項目    | 内容                |
| ----- | ----------------- |
| 時間計算量 | `O(N)` でループ一回     |
| 空間計算量 | `O(1)`（配列使用せず）    |
| 安定性   | 非常に高く、ミスの少ない実装    |
| 実用性   | AtCoder等ジャッジでも即通る |

---

ご希望あれば、**O(log N) の高速版（行列累乗法）** の図解付き解説も可能です。

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-07-20 15:23:05 | [B28 - Fibonacci Easy (mod 1000000007)](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_ap) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 700 Byte |  | 36 ms | 1704 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67777171) |
| 2025-07-20 15:20:03 | [B28 - Fibonacci Easy (mod 1000000007)](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_ap) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 718 Byte |  | 146 ms | 21268 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67777124) |
| 2025-07-20 15:17:08 | [B28 - Fibonacci Easy (mod 1000000007)](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_ap) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 803 Byte |  | 551 ms | 8556 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67777069) |
| 2025-07-20 15:10:51 | [B28 - Fibonacci Easy (mod 1000000007)](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_ap) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 839 Byte |  | 90 ms | 46136 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67776939) |
| 2025-07-20 15:06:17 | [B28 - Fibonacci Easy (mod 1000000007)](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_ap) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 693 Byte |  | 113 ms | 46036 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67776819) |