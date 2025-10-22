この問題 `a^b % 1000000007` を高速に計算するための **繰り返し二乗法（binary exponentiation）** の仕組みを **図付きで詳しく解析・説明**します。

---

## 🎯 問題：

`a` と `b` が与えられたとき、`a^b % 1000000007` を **高速に正確に**求める。

- `a` は整数（最大 `10^9`）→ `BigInt`で表現
- `b` は整数（最大 `10^18`）→ `BigInt`が**必須**
- 単純な `for` ループだと `10^18` 回の繰り返しは**間に合わない**
  ⟶ よって **`O(log b)` の繰り返し二乗法** を使う

---

## 🔧 アルゴリズム概要：繰り返し二乗法

```
a^b を次のように分解できる：

bが偶数のとき: a^b = (a^(b/2))^2
bが奇数のとき: a^b = a * a^(b-1)
```

この再帰的な性質を **ループで効率的に計算**していきます。

---

## 🧮 処理の流れ（図付き）

### 例：`a = 3`, `b = 13`（=1101₂）とする

→ `3^13 % 1000000007` を計算したい

まず `b` を2進数に変換：

```
b = 13 = 1101₂
        ↑ ↑ ↑ ↑
        8 4 0 1  ←（2^3, 2^2, 2^1, 2^0 の位置）
```

このことから：

```
3^13 = 3^(8 + 4 + 0 + 1)
     = 3^8 * 3^4 * 3^1
```

つまり、**2進数のビットが1のところだけ掛け算する**イメージです。

---

### ⛓️ ステップ実行と図解

| ループ | b（二進数） | bのLSB | base   | result    | 操作                                         |
| ------ | ----------- | ------ | ------ | --------- | -------------------------------------------- |
| 0      | 1101₂ = 13  | 1      | `3`    | `1`       | b奇数なので result ← result × base = 1×3 = 3 |
|        |             |        |        | `3`       | base ← base² = 3² = 9                        |
| 1      | 110₂ = 6    | 0      | `9`    | `3`       | b偶数なので resultは更新せず                 |
|        |             |        |        |           | base ← 9² = 81                               |
| 2      | 11₂ = 3     | 1      | `81`   | `3`       | result ← result × base = 3×81 = 243          |
|        |             |        |        | `243`     | base ← 81² = 6561                            |
| 3      | 1₂ = 1      | 1      | `6561` | `243`     | result ← result × base = 243×6561 = 1594323  |
|        |             |        |        | `1594323` | base ← 6561²                                 |

---

## ✅ 最終結果：`3^13 = 1594323`

---

## 📦 実装中の処理と図の対応

```ts
while (b > 0n) {
    if (b % 2n === 1n) {
        result = (result * a) % mod;
    }
    a = (a * a) % mod;
    b >>= 1n;
}
```

| 処理                          | 説明                                          |
| ----------------------------- | --------------------------------------------- |
| `b % 2n === 1n`               | 最下位ビット（LSB）が1なら result に掛ける    |
| `result = (result * a) % mod` | その時点の base を result に掛け、MODを取る   |
| `a = (a * a) % mod`           | 次の2^iに備えて base を二乗（指数の倍に対応） |
| `b >>= 1n`                    | 指数 b を1ビット右シフト → `b = floor(b / 2)` |

---

## 🔄 イメージ図（簡略）

```
b = 13 = 1101₂
    ↓
[1] b LSB=1 → result *= a        → a = a²
[2] b >>=1 → b=6 (LSB=0)         → a = a²
[3] b >>=1 → b=3 (LSB=1) → *= a  → a = a²
[4] b >>=1 → b=1 (LSB=1) → *= a  → a = a²
終了（b=0）
```

---

## ✅ 計算量

| 項目       | 値                             |
| ---------- | ------------------------------ |
| 時間計算量 | `O(log b)` ≒ 60 回以下（最大） |
| 空間計算量 | `O(1)`（BigInt数個のみ）       |

---

## 💡 補足：なぜ `BigInt` が必要か？

- `b = 123456789012345678` は `10^18` オーバーの巨大整数
- JavaScriptの `number` は **53bit 精度**まで
  ⟶ `BigInt` で安全な演算が可能

---

## 🧪 確認：例の出力

入力：

```
123456789 123456789012345678
```

出力（正解）：

```
3599437
```

---

## 📌 結論

- 繰り返し二乗法は `b` を 2進数で分解し、**必要なべきだけを掛け合わせる**
- `O(log b)` で非常に高速
- `BigInt` により超巨大指数にも対応できる
- メモリ使用も極小で、**時間・メモリ制約の両方を余裕で満たす**

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                               | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-07-21 14:41:38                                                                           | [B29 - Power Hard](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_db) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1185 Byte                                                                                 |      | 1 ms                                                                                         | 1720 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67801608) |
| 2025-07-21 14:37:11                                                                           | [B29 - Power Hard](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_db) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 1196 Byte                                                                                 |      | 14 ms                                                                                        | 21356 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67801522) |
| 2025-07-21 14:34:10                                                                           | [B29 - Power Hard](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_db) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 1211 Byte                                                                                 |      | 20 ms                                                                                        | 10640 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67801464) |
| 2025-07-21 13:49:35                                                                           | [B29 - Power Hard](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_db) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 890 Byte                                                                                  |      | 45 ms                                                                                        | 42916 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67800804) |
| 2025-07-21 13:46:56                                                                           | [B29 - Power Hard](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_db) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 888 Byte                                                                                  |      | 42 ms                                                                                        | 42764 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67800777) |
