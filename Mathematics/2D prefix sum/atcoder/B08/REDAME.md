
---

## 🧩 問題の概要（再確認）

* 2次元座標 `(x, y)` 上に最大 100,000 個の点がある。
* 各クエリで、長方形領域 `[a, c] × [b, d]` に含まれる点の数を答える。
* 各座標は `1 <= x, y <= 1500` の範囲。

---

## 📌 Step 1: グリッドに点を配置

各点を2次元配列 `grid[x][y]` にプロットします。

### 例（入力点）

| 点番号 | x | y |
| --- | - | - |
| 1   | 1 | 3 |
| 2   | 2 | 5 |
| 3   | 3 | 4 |
| 4   | 2 | 6 |
| 5   | 3 | 3 |

### グリッド可視化（`grid[x][y]`）

点のある場所に `1` を立てる（※その他は `0`）：

```
y ↑
6 |       1
5 |     1
4 |       1
3 | 1     1
2 |      
1 |      
    1 2 3 → x
```

---

## 🧩 Step 2: 2次元累積和を構築

`prefixSum[x][y]` は、左上 (1,1) から (x,y) の矩形に含まれる点の数。

### 2次元累積和の定義式：

```ts
prefixSum[x][y] =
  grid[x][y]
+ prefixSum[x-1][y]
+ prefixSum[x][y-1]
- prefixSum[x-1][y-1]
```

### イメージ図（1-originで考える）

```
+-----------------------+
|                       |
|   (1,1) ～ (x,y)の合計|
|                       |
+-----------------------+
```

部分重複（左と上）が含まれるため、左上 `(x-1, y-1)` を1回引く。

---

## 🧩 Step 3: クエリ処理（矩形範囲の合計を求める）

各クエリにおいて、長方形 `[a, c] × [b, d]` の合計を求めるには：

### 式：

```ts
prefixSum[c][d]
- prefixSum[a - 1][d]
- prefixSum[c][b - 1]
+ prefixSum[a - 1][b - 1]
```

### 図で理解する

長方形 `[a, c] × [b, d]` を以下のように分解：

```
      y
      ↑
 d +------+
   |      |
   | A    | ← prefixSum[c][d]
 b +------+
   a      c → x
```

式の解釈：

| 項目                      | 説明            |
| ----------------------- | ------------- |
| `prefixSum[c][d]`       | 全体（A+B+C+D）   |
| `- prefixSum[a-1][d]`   | 左側の領域（A+B）を除去 |
| `- prefixSum[c][b-1]`   | 下側の領域（A+C）を除去 |
| `+ prefixSum[a-1][b-1]` | 2回除いたAを1回分戻す  |

---

## ✅ 入力例に基づく具体的なクエリ処理

入力：

```
クエリ: a=1, b=3, c=3, d=6
範囲: x in [1,3], y in [3,6]
```

図で確認：

```
y ↑
6 |       1 ← (2,6)
5 |     1   ← (2,5)
4 |       1 ← (3,4)
3 | 1     1 ← (1,3), (3,3)
2 |      
1 |      
    1 2 3 → x
```

→ この範囲内に点が5つあるので、答えは `5`

---

## 💡 まとめ

| ステップ       | 処理             | 時間計算量  | メモリ      |
| ---------- | -------------- | ------ | -------- |
| 点のプロット     | `grid[x][y]++` | O(N)   | O(1500²) |
| 累積和の構築     | 2重ループ          | O(W×H) | O(1500²) |
| クエリ処理（各1回） | 定数時間で計算        | O(Q)   |          |

---

## 🧭 補足

2次元累積和の活用は、以下のような用途にも有効です：

* グリッド上の「矩形」単位の高速集計
* 画像処理（積分画像）
* ゲームの範囲スキャン
* ヒートマップなどの高速計算

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-07-04 22:49:34 | [B08 - Counting Points](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cg) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 1327 Byte |  | 90 ms | 51444 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67278257) |
| 2025-07-04 22:48:02 | [B08 - Counting Points](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cg) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 1389 Byte |  | 297 ms | 97100 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67278226) |
| 2025-07-04 22:42:21 | [B08 - Counting Points](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cg) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 1233 Byte |  | 557 ms | 126776 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67278105) |
| 2025-07-04 22:32:29 | [B08 - Counting Points](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cg) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 1178 Byte |  | 341 ms | 134836 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67277921) |
| 2025-07-04 22:26:38 | [B08 - Counting Points](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cg) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 1172 Byte |  | 345 ms | 135308 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67277813) |