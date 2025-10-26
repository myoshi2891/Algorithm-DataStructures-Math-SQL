---

## ✅ 問題の要点まとめ

* 配列 `A`（長さ N）がある。初期状態は全て 0。
* 2 種類のクエリ：

  1. `1 pos x` → `A[pos] = x` に更新
  2. `2 l r` → 区間 `[l, r-1]` の合計を出力
* 制約が大きい（N, Q ≤ 100,000）ので、単純なループでは間に合わない。

---

## ✅ Fenwick Tree（Binary Indexed Tree）とは？

Fenwick Tree とは、**配列の区間和クエリ**と**要素の更新操作**を高速（`O(log N)`）で処理するためのデータ構造です。

### Fenwick Tree の構成（例：N=8）

```
配列 A:        1  2  3  4  5  6  7  8
FT 配列 tree:  t1 t2 t3 t4 t5 t6 t7 t8  （1-indexed）
```

各 `tree[i]` には、特定の区間の合計が入っています。

| index i | tree\[i]がカバーする範囲 | 範囲の長さ = i & -i |
| ------- | ------------------------ | ------------------- |
| 1       | A\[1]                    | 1                   |
| 2       | A\[1..2]                 | 2                   |
| 3       | A\[3]                    | 1                   |
| 4       | A\[1..4]                 | 4                   |
| 5       | A\[5]                    | 1                   |
| 6       | A\[5..6]                 | 2                   |
| 7       | A\[7]                    | 1                   |
| 8       | A\[1..8]                 | 8                   |

---

## ✅ 処理の図解（入力例ベース）

```
入力:
8 4
1 3 16
1 6 24
2 4 8
2 1 7
```

### 初期状態

```
A: [0, 0, 0, 0, 0, 0, 0, 0]
BIT（tree）: [0, 0, 0, 0, 0, 0, 0, 0, 0] （1-indexed、長さ N+1）
```

---

### ▶ クエリ1： `1 3 16`（A\[3] = 16 にする）

#### Step 1: 差分計算（旧値0 → 新値16）

```ts
diff = 16 - A[3] = 16
```

#### Step 2: BITの更新（index = 3 に 16 加算）

BITの更新では、以下のように右方向に進みながら値を加算します：

```
index = 3:
    tree[3] += 16
    index += index & -index = 3 + 1 = 4

index = 4:
    tree[4] += 16
    index += 4 & -4 = 4 + 4 = 8

index = 8:
    tree[8] += 16
    index += 8 & -8 = 8 + 8 = 16 > N → 終了
```

#### 結果:

```
tree = [ , 0, 0, 16, 16, 0, 0, 0, 16]
```

---

### ▶ クエリ2： `1 6 24`（A\[6] = 24 にする）

差分: `24 - A[6] = 24`

BIT更新（index=6）：

```
tree[6] += 24
→ index=8 → tree[8] += 24
```

#### 結果:

```
tree = [ , 0, 0, 16, 16, 0, 24, 0, 40]
```

---

### ▶ クエリ3： `2 4 8`（A\[4] + A\[5] + A\[6] + A\[7]）

これは `sum(7) - sum(3)` に相当します（区間は \[4, 7]）

#### `sum(7)` を計算（合計 A\[1..7]）

- index = 7 → + tree\[7] = 0
- index = 6 → + tree\[6] = 24
- index = 4 → + tree\[4] = 16
  → 合計：`0 + 24 + 16 = 40`

#### `sum(3)` を計算（合計 A\[1..3]）

- index = 3 → + tree\[3] = 16
- index = 2 → + tree\[2] = 0
  → 合計：16

➡ `40 - 16 = 24`

---

### ▶ クエリ4： `2 1 7`（A\[1] + A\[2] + ... + A\[6]）

これは `sum(6)`

- index = 6 → +24
- index = 4 → +16 → 合計：40

---

## ✅ 最終出力

```
24
40
```

---

## ✅ まとめ図

```
更新操作（1 pos x）:
1. 差分計算: diff = x - A[pos]
2. BITの index=pos に diff を加算しながら上位ノードにも反映

区間和クエリ（2 l r）:
1. sum(r-1) - sum(l-1)
2. sum(k): index=k から parent ノードへ上がりながら合計取得
```

---

## ✅ 補足：index & -index の意味

これは「2の補数」で、**最も下位の1ビット**だけを残した値。

例：

- 6 (0110) → `6 & -6 = 2` → 2 だけ残る
- 4 (0100) → `4 & -4 = 4`

この操作で「BITの親子関係」を高速にたどれる。

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                                            | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果   | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-06-13 18:18:42                                                                           | [A59 - RSQ (Range Sum Queries)](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bg) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 1512 Byte                                                                                 | **AC** | 75 ms                                                                                        | 36992 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66697910) |
| 2025-06-13 18:11:23                                                                           | [A59 - RSQ (Range Sum Queries)](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bg) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1473 Byte                                                                                 | **AC** | 28 ms                                                                                        | 6308 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66697804) |
| 2025-06-13 18:08:06                                                                           | [A59 - RSQ (Range Sum Queries)](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bg) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 1242 Byte                                                                                 | **AC** | 241 ms                                                                                       | 33556 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66697752) |
| 2025-06-13 17:53:16                                                                           | [A59 - RSQ (Range Sum Queries)](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bg) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 1579 Byte                                                                                 | **AC** | 137 ms                                                                                       | 79008 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66697551) |
| 2025-06-13 17:48:36                                                                           | [A59 - RSQ (Range Sum Queries)](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bg) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 1573 Byte                                                                                 | **AC** | 214 ms                                                                                       | 93588 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66697508) |
