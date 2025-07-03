
---

## 🧩 問題概要（図で説明）

太郎くんが引いたくじの結果（`A`）があります：

```
A = [0, 1, 1, 0, 1, 0, 0]
      ↑  ↑  ↑     ↑  ↑  ↑
      1  2  3     6  7
```

これに対して、たとえば次のような\*\*クエリ（質問）\*\*が来ます：

* 「2 回目から 5 回目まで、当たり(1)とハズレ(0)どっちが多い？」
* 「5 回目から 7 回目まででは？」

このような「区間 `[L, R]` における当たりとハズレの数を比較せよ」という問題を **高速に答える必要があります（最大10万件）**。

---

## 🔍 処理の流れと図解

---

### ① 入力の受け取り

```ts
const N = parseInt(input[0]);
const A = input[1].split(' ').map(Number);
```

入力 `A` の例：

```
A = [0, 1, 1, 0, 1, 0, 0]
     ↑  ↑  ↑  ↑  ↑  ↑  ↑
    1  2  3  4  5  6  7 ← index（1-indexed）
```

---

### ② 累積和 `acc` の構築

```ts
const acc: number[] = new Array(N + 1).fill(0);
for (let i = 0; i < N; i++) {
    acc[i + 1] = acc[i] + A[i];
}
```

**目的：`acc[i] = A[0] ~ A[i-1] までのアタリ(=1)の累積和` を持つ**

| i (1-indexed) | A\[i-1] | acc\[i] | 解釈                                |
| ------------- | ------- | ------- | --------------------------------- |
| 0             | -       | 0       | 初期値                               |
| 1             | 0       | 0       | A\[0] = 0                         |
| 2             | 1       | 1       | A\[0]+A\[1] = 0+1                 |
| 3             | 1       | 2       | A\[0]+A\[1]+A\[2] = 0+1+1         |
| 4             | 0       | 2       | A\[0]+A\[1]+A\[2]+A\[3] = 0+1+1+0 |
| 5             | 1       | 3       | …                                 |
| 6             | 0       | 3       | …                                 |
| 7             | 0       | 3       | …                                 |

```txt
acc = [0, 0, 1, 2, 2, 3, 3, 3]
         ↑  ↑  ↑  ↑  ↑  ↑  ↑
        1  2  3  4  5  6  7（1-indexed）
```

---

### ③ クエリ処理（各クエリで何をしているか？）

たとえばクエリが `L=2`, `R=5` のとき：

```ts
const ones = acc[R] - acc[L - 1]; // acc[5] - acc[1] = 3 - 0 = 3
const total = R - L + 1;          // 5 - 2 + 1 = 4
const zeros = total - ones;      // 4 - 3 = 1
```

#### 🎯 区間 `[2,5]` の様子：

```
A = [0, 1, 1, 0, 1, 0, 0]
        ↑  ↑  ↑  ↑        ← index = 2〜5
        1  1  0  1 → アタリ3個、ハズレ1個 → win!
```

同様に、

#### クエリ `[5,7]`

```
A = [0, 1, 1, 0, 1, 0, 0]
                     ↑  ↑  ↑
                     5  6  7 → 1, 0, 0 → アタリ1, ハズレ2 → lose!
```

---

### ④ 結果出力

```ts
if (ones > zeros) results.push('win');
else if (zeros > ones) results.push('lose');
else results.push('draw');
```

---

## ✅ 全体図のまとめ

```txt
入力
└── A = [0, 1, 1, 0, 1, 0, 0]
         ↓ 累積和 acc[i] = A[0]~A[i-1]の1の数
acc = [0, 0, 1, 2, 2, 3, 3, 3]

クエリ処理（例: [2,5]）
  ones  = acc[5] - acc[1] = 3 - 0 = 3
  total = 5 - 2 + 1 = 4
  zeros = 4 - 3 = 1
→ アタリの方が多い → win
```

---

## ⏱ 計算量のイメージ

| 処理       | 回数 | 計算量                      |
| -------- | -- | ------------------------ |
| 累積和の構築   | N回 | O(N)                     |
| クエリごとの処理 | Q回 | O(1) × Q                 |
| 合計       |    | **O(N + Q)**（最大20万でも余裕！） |

---

## 🧠 まとめ

* 累積和（prefix sum）を使って高速に区間の「当たりの数」を数える
* ハズレの数は「区間の長さ − アタリの数」で計算
* クエリごとに「win / lose / draw」を即時判定
* 典型的な **二値配列への累積和適用パターン**

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-07-02 19:26:36 | [B06 - Lottery](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ce) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 1200 Byte |  | 109 ms | 43780 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67238676) |
| 2025-07-02 19:14:56 | [B06 - Lottery](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ce) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 977 Byte |  | 146 ms | 85980 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67238307) |
| 2025-07-02 19:08:01 | [B06 - Lottery](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ce) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 798 Byte |  | 140 ms | 87404 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67238111) |

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-07-03 10:38:43 | [B06 - Lottery](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ce) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 1293 Byte |  | 69 ms | 55452 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67248671) |
| 2025-07-03 10:32:22 | [B06 - Lottery](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ce) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 1351 Byte |  | 17 ms | 5896 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67248581) |
