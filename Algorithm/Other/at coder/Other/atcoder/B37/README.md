
---

## 🧭 説明の構成

1. **問題の要点**
2. **中心となるアルゴリズム**
3. **処理の流れを図で解説**
4. **数式と実装対応**
5. **全体のまとめ**

---

## ✅ 1. 問題の要点

> `f(x)` を「xの各桁の和」とし、 `f(1) + f(2) + ... + f(N)` を高速に求めたい。
> ただし、 `N < 10^15` なので全ての数を1つずつ走査することはできない。

---

## ✅ 2. 中心となるアルゴリズム：**各桁の出現回数による寄与の合算**

この問題では「桁DP」ではなく、**各桁位置に現れる数字の出現回数を計算して加算する方法（出現回数 × 数字 × 位の重み）」を使います。**

この手法は以下の流れで進みます：

---

## ✅ 3. 処理の流れを図で説明（例：N = 288）

```
N = 288 を考える（10の位まで）
桁：百位 / 十位 / 一位  => 2   /  8  / 8
```

### 🎯 各位の寄与をそれぞれ求める

### 3-1. 一の位（base = 1）

```
[1-288] までに、1の位に 1〜9 が何回現れるか？

例：
  1 → ..., 1, 11, 21, ..., 281 → 29回
  2 → ..., 2, 12, 22, ..., 282 → 29回
  ...
  8 → ..., 8, 18, 28, ..., 288 → 30回（末尾に含まれるため+1）

計算方法：
- higher = floor(288 / 10) = 28
- current = (288 / 1) % 10 = 8
- lower = 288 % 1 = 0

→ 出現回数は以下の式で計算：
- digit < current: (higher + 1) × base
- digit == current: higher × base + lower + 1
- digit > current: higher × base
```

<table>
<tr><th>digit</th><th>出現回数</th><th>寄与（digit × 出現回数）</th></tr>
<tr><td>1</td><td>29</td><td>29</td></tr>
<tr><td>2</td><td>29</td><td>58</td></tr>
<tr><td>...</td><td>...</td><td>...</td></tr>
<tr><td>8</td><td>30</td><td>240</td></tr>
<tr><td>9</td><td>28</td><td>252</td></tr>
</table>

---

### 3-2. 十の位（base = 10）

```
higher = floor(288 / 100) = 2
current = (288 / 10) % 10 = 8
lower = 288 % 10 = 8

→ digit = 1〜9 に対してそれぞれ上記の式を使って回数を計算

例：
digit = 1〜7:
  → (higher + 1) × base = 3 × 10 = 30

digit = 8:
  → higher × base + lower + 1 = 2 × 10 + 8 + 1 = 29

digit = 9:
  → higher × base = 2 × 10 = 20
```

---

### 3-3. 百の位（base = 100）

```
higher = floor(288 / 1000) = 0
current = (288 / 100) % 10 = 2
lower = 288 % 100 = 88

digit = 1:
  → (higher + 1) × base = 1 × 100 = 100

digit = 2:
  → higher × base + lower + 1 = 0 × 100 + 88 + 1 = 89

digit = 3〜9:
  → higher × base = 0
```

---

## ✅ 4. 数式とコード対応

### 🎯 数式：

```text
count_d = {
  if (d < current):      (higher + 1) * base
  else if (d == current): higher * base + lower + 1
  else:                   higher * base
}
```

### 🎯 コード対応部分：

```ts
for (let digit: bigint = 1n; digit <= 9n; digit++) {
  let count: bigint;

  if (digit < current) {
    count = (higher + 1n) * base;
  } else if (digit === current) {
    count = higher * base + lower + 1n;
  } else {
    count = higher * base;
  }

  total += count * digit;
}
```

---

## ✅ 5. まとめ：なぜこのアルゴリズムが強力か？

| 特徴           | 内容                              |
| ------------ | ------------------------------- |
| **計算量**      | `O(log₁₀N)`（15桁でも 15回ループ）       |
| **メモリ使用量**   | 定数（BigInt数個）                    |
| **正確性**      | 桁ごとの出現回数を理論的に導出しており、誤差がない       |
| **使用アルゴリズム** | 「桁ごとの出現回数の算出」＋「桁重み × 数字 × 出現回数」 |

---

## ✅ 図による全体構造まとめ

```
           N = 288
             │
   ┌─────────┴───────────┐
   ↓                     ↓
一の位 (base=1)     十の位 (base=10) ...
   │                     │
(higher, current, lower) を計算
   │                     │
各 digit(1-9) について出現回数を計算
   │                     │
 digit × 出現回数 → 桁和への寄与
   ↓                     ↓
       合計に加算 → total += ...
```

---

## 📌 参考になりそうな追加資料

* 桁DPや出現回数算出法は競技プログラミングでもよく出る典型。
* 類題：「1～Nまでの数字に含まれる `1` の個数を求めよ」など。

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-07-28 15:03:05 | [B37 - Sum of Digits](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dj) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 1451 Byte |  | 1 ms | 1632 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68007154) |
| 2025-07-28 14:53:23 | [B37 - Sum of Digits](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dj) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 1867 Byte |  | 16 ms | 21284 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68006984) |
| 2025-07-28 14:51:48 | [B37 - Sum of Digits](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dj) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 1062 Byte |  | 20 ms | 10596 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68006953) |
| 2025-07-28 14:40:08 | [B37 - Sum of Digits](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dj) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 1289 Byte |  | 41 ms | 42928 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68006738) |
| 2025-07-28 14:37:40 | [B37 - Sum of Digits](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dj) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 1153 Byte |  | 43 ms | 42784 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68006699) |
| 2025-07-28 14:29:39 | [B37 - Sum of Digits](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dj) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 1629 Byte |  | 15 ms | 9604 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68006571) |