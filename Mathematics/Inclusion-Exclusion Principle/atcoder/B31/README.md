以下では、\*\*TypeScriptによる「3,5,7のいずれかで割り切れる整数の個数を数える処理」\*\*について、**図・表・数式を交えて詳しく解析・説明**していきます。

---

## ✅ 問題の要点

---

> **1 以上 N 以下の整数のうち、3・5・7 のいずれかで割り切れる整数の個数を数えよ。**

例：`N = 10`

該当する数：`3, 5, 6, 7, 9, 10` → **6個**

---

## ✅ アルゴリズム：包除原理（Inclusion-Exclusion Principle）

---

重複を避けてカウントするために、\*\*集合の和集合の要素数を求める「包除原理」\*\*を使用します。

---

### ▼ 対象集合のイメージ

下図は、N = 30 のときの 3, 5, 7 で割り切れる集合のベン図です：

```
              +-----------+
              |  A : /3   |
              | {3,6,...} |
          +--------+   +--------+
          |        |   |        |
   +-----------+   |   |   +-----------+
   |  B : /5   |---+---+---|  C : /7   |
   | {5,10,...}|           |{7,14,...}|
   +-----------+           +-----------+
```

---

### ▼ 包除原理の式

集合の和集合の要素数：

```text
|A ∪ B ∪ C| = |A| + |B| + |C| - |A ∩ B| - |A ∩ C| - |B ∩ C| + |A ∩ B ∩ C|
```

---

## ✅ 処理の流れ（TypeScriptコードと図で対応）

---

### 🟢 1. 基本個数を求める

| 除数 | 対象集合 | 計算式         | N=30 の場合 |
| ---- | -------- | -------------- | ----------- |
| 3    | A        | `floor(N / 3)` | 10個        |
| 5    | B        | `floor(N / 5)` | 6個         |
| 7    | C        | `floor(N / 7)` | 4個         |

**図式化**（3つの円の大きさ）：

```
   A(3): 10個    B(5): 6個     C(7): 4個
```

コード対応（関数）：

```ts
div(3n) + div(5n) + div(7n);
```

---

### 🔴 2. 重複部分を引く（二重カウント）

| 共通集合 | 対象集合 | 計算式          | N=30 の場合 |
| -------- | -------- | --------------- | ----------- |
| A ∩ B    | /15      | `floor(N / 15)` | 2個         |
| A ∩ C    | /21      | `floor(N / 21)` | 1個         |
| B ∩ C    | /35      | `floor(N / 35)` | 0個         |

**図式化**：

```
  A ∩ B → {15,30}
  A ∩ C → {21}
  B ∩ C → {35}（該当なし）
```

コード対応：

```ts
-div(3n * 5n) - div(3n * 7n) - div(5n * 7n);
```

---

### 🔵 3. 三重重複を戻す（3つに含まれる数）

| 共通集合  | 対象集合 | 計算式           | N=30 の場合 |
| --------- | -------- | ---------------- | ----------- |
| A ∩ B ∩ C | /105     | `floor(N / 105)` | 0個         |

**図式化**：

```
A ∩ B ∩ C → {105, 210, 315, ...}
N=30 では該当なし
```

コード対応：

```ts
+div(3n * 5n * 7n);
```

---

## ✅ 全体図解（数直線とベン図）

---

### 例：N = 30 の場合（数直線で可視化）

```
 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30
    *     *     *     *     *     *     *     *     *     *     *     *     *     *
   (/3) (/5) (/3) (/7) (/3) (/5,3,7) (/3) (/5) (/3) (/7) (/3) (/5) (/3) (/7) (/3) (/5,3)
```

- `/3`: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30
- `/5`: 5, 10, 15, 20, 25, 30
- `/7`: 7, 14, 21, 28

重複含めた数：3,5,6,7,9,10,12,14,15,18,20,21,24,25,27,28,30 → **17個**

---

## ✅ BigInt使用理由

- 入力 `N ≤ 10^12` なので、JavaScriptの `Number` では **精度が壊れる**。
- よって、`BigInt` による処理が必須です。

---

## ✅ 最終式まとめ

```ts
div(3n) + div(5n) + div(7n) - div(15n) - div(21n) - div(35n) + div(105n);
```

---

## ✅ 実行例：N = 100000000000

```
N / 3   = 33333333333
N / 5   = 20000000000
N / 7   = 14285714285
N / 15  = 6666666666
N / 21  = 4761904761
N / 35  = 2857142857
N / 105 = 952380952

合計：
= 33333333333 + 20000000000 + 14285714285
- 6666666666 - 4761904761 - 2857142857
+ 952380952
= 54285714286
```

---

## ✅ 結論

- 処理は **O(1)** で極めて高速（定数回のBigInt除算のみ）
- メモリ使用もごく少量（`BigInt` 7個程度）
- **N が 10^12 でも 1ms 未満で完了**

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                                  | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-07-23 16:41:06                                                                           | [B31 - Divisors Hard](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dd) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1204 Byte                                                                                 |      | 1 ms                                                                                         | 1632 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67847012) |
| 2025-07-23 16:37:22                                                                           | [B31 - Divisors Hard](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dd) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 1121 Byte                                                                                 |      | 14 ms                                                                                        | 21556 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67846918) |
| 2025-07-23 16:34:38                                                                           | [B31 - Divisors Hard](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dd) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 848 Byte                                                                                  |      | 10 ms                                                                                        | 8648 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67846843) |
| 2025-07-23 16:23:22                                                                           | [B31 - Divisors Hard](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dd) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 869 Byte                                                                                  |      | 41 ms                                                                                        | 42856 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67846549) |
| 2025-07-23 16:17:55                                                                           | [B31 - Divisors Hard](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dd) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 866 Byte                                                                                  |      | 41 ms                                                                                        | 42784 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67846392) |
