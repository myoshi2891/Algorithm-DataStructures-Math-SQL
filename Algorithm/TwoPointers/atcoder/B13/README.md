
---

## 🔍 問題のおさらい

与えられた配列 `A` に対して、**連続部分列のうち、和が K 以下のものの個数を求める**という問題です。

---

## 🧠 解法の考え方：**しゃくとり法 (Two Pointers)**

### ✔ 概要

* 2つのポインタ `left` と `right` を使って、連続した部分列を動的に管理します。
* 条件を満たす `right` の最大範囲を求めて、一括で個数を数えます。

---

## ▶ 具体例と図解

### 🔢 入力例

```text
N = 7, K = 50  
A = [11, 12, 16, 22, 27, 28, 31]
```

---

## ▶ Step-by-step 図解

### ✅ 初期状態

```text
left = 0, right = 0, sum = 0, count = 0
```

---

### 🔄 1回目ループ：`left = 0`

```text
// A[0] + A[1] + A[2] = 11 + 12 + 16 = 39 <= 50 → OK
// A[3] = 22 を加えると 39 + 22 = 61 > 50 → OUT

[11, 12, 16, 22, 27, 28, 31]
 ↑   ↑    ↑
 l        r = 3 (STOP)

right - left = 3 - 0 = 3 個（[11], [11,12], [11,12,16]）
count = 3
```

---

### 🔄 2回目ループ：`left = 1`

* `sum = 39 - 11 = 28`
* `right = 3` のまま → A\[3] = 22 を追加 → sum = 50 ✅

```text
[11, 12, 16, 22, 27, 28, 31]
     ↑     ↑     ↑
     l           r = 4 (STOP)

部分列: [12], [12,16], [12,16,22]
count += 3 → 合計6
```

---

### 🔄 3回目：`left = 2`

* `sum = 50 - 12 = 38`
* `right = 4` → A\[4] = 27 を追加 → sum = 65 ❌ → right動かず

```text
[11, 12, 16, 22, 27, 28, 31]
         ↑         ↑
         l         r = 4 (STOP)

部分列: [16], [16,22] → 合計2個
count += 2 → 合計8
```

---

### 🔄 4回目：`left = 3`

* `sum = 38 - 16 = 22`
* A\[4] = 27 → sum = 49 ✅ → right = 5

```text
[11, 12, 16, 22, 27, 28, 31]
             ↑     ↑
             l           r = 5

部分列: [22], [22,27]
count += 2 → 合計10
```

---

### 🔄 5回目：`left = 4`

* `sum = 49 - 22 = 27`
* A\[5] = 28 → sum = 55 ❌ → right動かず

```text
[11, 12, 16, 22, 27, 28, 31]
                 ↑     ↑
                 l     r = 5

部分列: [27]
count += 1 → 合計11
```

---

### 🔄 6回目：`left = 5`

* `sum = 27 - 27 = 0`
* A\[5] = 28 → sum = 28 ✅ → right = 6
* A\[6] = 31 → sum = 59 ❌ → right動かず

```text
[11, 12, 16, 22, 27, 28, 31]
                     ↑     ↑
                     l     r = 6

部分列: [28]
count += 1 → 合計12
```

---

### 🔄 7回目：`left = 6`

* `sum = 28 - 28 = 0`
* A\[6] = 31 → sum = 31 ✅ → right = 7（末尾）

```text
[11, 12, 16, 22, 27, 28, 31]
                          ↑  ↑
                          l  r = 7

部分列: [31]
count += 1 → 合計13
```

---

## ✅ 最終結果

```text
count = 13
```

---

## 🔧 各処理の対応表

| 処理名    | 内容                                  | 計算量  |
| ------ | ----------------------------------- | ---- |
| 入力読み取り | `fs.readFileSync()` で全行読み込み         | O(N) |
| ポインタ移動 | `while (sum + A[right] <= K)`       | O(N) |
| カウント更新 | `count += right - left`             | O(1) |
| 合計管理   | `sum += A[right]`, `sum -= A[left]` | O(1) |

---

## 📌 まとめ：しゃくとり法の直感

* ポインタ `left` と `right` で区間を管理
* 条件を満たす最大 `right` を探索
* その区間の全ての部分列は条件を満たすため、一括でカウント

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-07-08 21:13:55 | [B13 - Supermarket 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cl) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 881 Byte |  | 5 ms | 5352 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67431204) |
| 2025-07-08 21:10:06 | [B13 - Supermarket 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cl) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 754 Byte |  | 23 ms | 28004 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67431128) |
| 2025-07-08 21:00:18 | [B13 - Supermarket 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cl) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 802 Byte |  | 42 ms | 20552 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67430949) |
| 2025-07-08 20:50:11 | [B13 - Supermarket 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cl) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 781 Byte |  | 56 ms | 54232 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67430766) |
| 2025-07-08 20:42:04 | [B13 - Supermarket 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cl) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 599 Byte |  | 85 ms | 53820 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67430626) |