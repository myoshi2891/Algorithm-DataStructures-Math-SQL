`C(n, 3) = n(n - 1)(n - 2) / 6` という式は、**「n個の中から3つを選ぶ組み合わせの数」**を求める公式です。これは**組み合わせの数学的な基本公式**です。

---

## ✅ 1. 組み合わせとは？

> 順番を考慮せずに「n個の中からr個を選ぶ」方法の数

* 記号：`C(n, r)` や `nCr` と書きます
* 「コンビネーション（combination）」とも呼ばれます
* 例：`C(5, 2)` は「5個の中から2個を選ぶ」組み合わせ → 答えは10通り

---

## ✅ 2. C(n, 3) の一般公式

一般に、

$$
C(n, r) = \frac{n!}{r!(n - r)!}
$$

なので、

$$
C(n, 3) = \frac{n!}{3!(n - 3)!}
$$

これを簡単にすると：

$$
C(n, 3) = \frac{n(n - 1)(n - 2)}{6}
$$

（※3! = 6）

---

## ✅ 3. なぜこの式になるのか？（直感的な理解）

### 例：4人の中から3人を選ぶ場合

* 人A, B, C, D がいたとします。
* まず3人を**順番を考慮して並べる方法**は：

$$
4 \times 3 \times 2 = 24 通り
$$

でも、「ABC」「CAB」「BCA」などは**同じ3人の組み合わせ**ですよね？

* 順番を無視するために、**重複する並びの数**（3人の並び：3! = 6通り）で割ります：

$$
24 ÷ 6 = 4 通り
$$

実際に `C(4, 3) = 4`。

---

## ✅ 4. なぜこの問題で使うのか？

この問題では「同じ長さの棒が `c` 本あったら、その中から**3本選んで**正三角形を作る」わけです。

だから、単純に：

```text
正三角形を作る方法の数 = C(c, 3) = c * (c - 1) * (c - 2) / 6
```

---

## ✅ 5. 計算例

### 例：長さ1の棒が4本あるとき

* c = 4

$$
C(4, 3) = \frac{4 × 3 × 2}{6} = 4
$$

つまり、長さ1の棒を3本選ぶ方法は4通りあります。

---

## ✅ まとめ

| 用語        | 意味                                |
| --------- | --------------------------------- |
| `C(n, 3)` | n個のものから3つ選ぶ組み合わせの数                |
| 公式        | `n(n-1)(n-2)/6`                   |
| この問題での役割  | 同じ長さの棒が3本以上あるとき、正三角形を作る方法の数を数えるため |

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-05-28 13:28:00 | [A40 - Triangle](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_an) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Java (OpenJDK 17)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5005) | 1000 | 816 Byte | **AC** | 367 ms | 62132 KB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66219190) |
| 2025-05-28 13:26:41 | [A40 - Triangle](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_an) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 440 Byte | **AC** | 35 ms | 21620 KB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66219166) |
| 2025-05-28 13:25:10 | [A40 - Triangle](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_an) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 1266 Byte | **AC** | 4 ms | 5160 KB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66219134) |
| 2025-05-28 13:20:15 | [A40 - Triangle](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_an) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 468 Byte | **AC** | 24 ms | 29224 KB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66219012) |
| 2025-05-28 13:17:05 | [A40 - Triangle](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_an) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 717 Byte | **AC** | 78 ms | 50100 KB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66218942) |