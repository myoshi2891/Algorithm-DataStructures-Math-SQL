---
## 問題の式

もとの合計は次のような **2重和**（二重の合計）で表されます：

$$
\sum_{i=1}^{N} \sum_{j=1}^{M} (A[i] + B + C[j])
$$

この式の意味は、「すべての駅 $i$（1〜N）とすべてのバス停 $j$（1〜M）のペアについて、所要時間 $A[i] + B + C[j]$ を合計する」ということです。
---

## 分解してみる

中身の `(A[i] + B + C[j])` をそれぞれに分けてみましょう：

$$
\sum_{i=1}^{N} \sum_{j=1}^{M} (A[i] + B + C[j]) = \sum_{i=1}^{N} \sum_{j=1}^{M} A[i] + \sum_{i=1}^{N} \sum_{j=1}^{M} B + \sum_{i=1}^{N} \sum_{j=1}^{M} C[j]
$$

このように 3 つに分解できます。それぞれ順番に計算してみましょう。

---

### ① $\sum_{i=1}^{N} \sum_{j=1}^{M} A[i]$

- $A[i]$ は $j$ に関係なく一定なので、$j$ について M 回繰り返される。
- よって：

$$
\sum_{i=1}^{N} \sum_{j=1}^{M} A[i] = \sum_{i=1}^{N} M \cdot A[i] = M \cdot \sum_{i=1}^{N} A[i]
$$

---

### ② $\sum_{i=1}^{N} \sum_{j=1}^{M} B$

- B は定数なので、N × M 回繰り返される：

$$
\sum_{i=1}^{N} \sum_{j=1}^{M} B = N \cdot M \cdot B
$$

---

### ③ $\sum_{i=1}^{N} \sum_{j=1}^{M} C[j]$

- $C[j]$ は $i$ に関係なく一定なので、iについて N 回繰り返される：

$$
\sum_{i=1}^{N} \sum_{j=1}^{M} C[j] = \sum_{j=1}^{M} N \cdot C[j] = N \cdot \sum_{j=1}^{M} C[j]
$$

---

## 結果として

上記 3 つの項をすべて足し合わせると：

$$
\sum_{i=1}^{N} \sum_{j=1}^{M} (A[i] + B + C[j]) = N \cdot M \cdot B + M \cdot \sum_{i=1}^{N} A[i] + N \cdot \sum_{j=1}^{M} C[j]
$$

---

## メリット

- もとの計算は二重ループだと $O(N \cdot M)$ 時間かかる
- この変形により、単純な合計だけで $O(N + M)$ で計算できるので、**非常に高速**になります（最大 $2 \times 10^5$ の制約でも大丈夫）

---

## 🔢 二重和とは？

二重和とは、次のような形で表される **2つのループを使った合計**のことです：

$$
\sum_{i=1}^{N} \sum_{j=1}^{M} f(i, j)
$$

これは、「まず $j$ を 1 から $M$ まで変化させながら $f(i, j)$ を合計し、それを $i$ を 1 から $N$ まで繰り返してまた合計する」という意味です。

---

## 🧠 イメージしやすく言い換えると？

次のような **入れ子の for ループ**をイメージしてください：

```javascript
let total = 0;
for (let i = 1; i <= N; i++) {
    for (let j = 1; j <= M; j++) {
        total += f(i, j);
    }
}
```

このコードとまったく同じ意味を数式で書いたものが：

$$
\sum_{i=1}^{N} \sum_{j=1}^{M} f(i, j)
$$

です。

---

## 🧮 具体例：簡単な関数で考えてみよう

関数を $f(i, j) = i + j$ としてみましょう。これを $N = 2$, $M = 3$ の場合で展開してみます。

$$
\sum_{i=1}^{2} \sum_{j=1}^{3} (i + j)
=
(i=1, j=1) → 2 \\
(i=1, j=2) → 3 \\
(i=1, j=3) → 4 \\
(i=2, j=1) → 3 \\
(i=2, j=2) → 4 \\
(i=2, j=3) → 5
$$

これらをすべて足すと：

$$
2 + 3 + 4 + 3 + 4 + 5 = 21
$$

---

## ✨ 公式的な意味

二重和は以下のように、**行列（表）状に並んだデータの合計**をとるのに使われることが多いです：

```
        j=1   j=2   j=3
i=1     f(1,1) f(1,2) f(1,3)
i=2     f(2,1) f(2,2) f(2,3)
```

全体の合計をとる → 二重和

---

## 📈 応用：分解と高速化

数学ではこの二重和を **うまく分解**して、より速く計算したり、性質を理解するために使います。

たとえば：

$$
\sum_{i=1}^{N} \sum_{j=1}^{M} (A[i] + C[j])
= M \cdot \sum A[i] + N \cdot \sum C[j]
$$

というように、**共通項を引き出して1重和に変形**できます。これによって、二重ループを回さなくても答えが求められるようになります。

---

## ✅ まとめ

| 項目       | 説明                                     |
| ---------- | ---------------------------------------- |
| 二重和とは | 二重の for ループに相当する合計          |
| 記法       | $\sum_{i=1}^{N} \sum_{j=1}^{M} f(i, j)$  |
| 利点       | 大量のデータの処理、表の合計処理ができる |
| 分解の意義 | 計算量を減らす、式の意味を明確にする     |

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                             | ユーザ                                            | 言語                                                                                                    | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果   | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-05-23 13:09:52                                                                           | [A37 - Travel 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ak) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)      | 1000                                                                                    | 360 Byte                                                                                  | **AC** | 59 ms                                                                                        | 38716 KB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66051991) |
| 2025-05-23 13:06:50                                                                           | [A37 - Travel 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ak) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)               | 1000                                                                                    | 952 Byte                                                                                  | **AC** | 7 ms                                                                                         | 5864 KB                                                                                      | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66051967) |
| 2025-05-23 12:53:30                                                                           | [A37 - Travel 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ak) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)              | 1000                                                                                    | 649 Byte                                                                                  | **AC** | 46 ms                                                                                        | 39128 KB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66051820) |
| 2025-05-23 12:42:29                                                                           | [A37 - Travel 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ak) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000                                                                                    | 537 Byte                                                                                  | **AC** | 102 ms                                                                                       | 53236 KB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66051693) |
