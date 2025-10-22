以下では、TypeScript で用いた **2D差分法 + 累積和による重なり面積の計算処理** を、**図解つきで丁寧に解説**します。

---

## 🎯 問題の本質

「複数の長方形が2D平面上に配置されているとき、\*\*重なりを考慮して全体として何マス塗られるか（面積）」を求めます。

---

## ✅ 例：2つの長方形

```
2
1 1 3 3
2 2 4 4
```

### グリッド（0-indexed）上での長方形

```
1枚目: 左下 (1,1) ～ 右上 (3,3)
2枚目: 左下 (2,2) ～ 右上 (4,4)
```

以下のように2つの長方形が重なって配置されます：

```
y↑
4 ──────
3 ─────■■
2 ───■■■■
1 ─■■■■
0 ──────
   0 1 2 3 4 → x
```

「■」部分が少なくとも1枚の紙に覆われたマス（面積としてカウント対象）

---

## 🔧 ステップ①：2D差分の基本アイデア

**目的：複数回塗られても重複しないよう、長方形の「開始」「終了」位置だけで管理する。**

### 🧠 1枚目 (1,1)-(3,3) を入れるとこうなる

差分配列 `grid[x][y]` に以下の操作を行う：

```
grid[1][1] += 1      ← 左下
grid[3][1] -= 1      ← 右下
grid[1][3] -= 1      ← 左上
grid[3][3] += 1      ← 右上
```

> これは、後で「累積和（積み上げ）」することによって、長方形の内部のみが +1 になるように設計された操作です。

2つ目も同様に差分追加。

---

## 🧮 ステップ②：横方向の累積

横方向に値を累積すると、こうなります：

```
for x in 0..1501:
    for y in 1..1501:
        grid[x][y] += grid[x][y-1];
```

この処理で、横方向の重なりを反映させます。

---

## 🧮 ステップ③：縦方向の累積

次に縦方向に累積して、すべての領域に正確な塗り重ね回数を反映します：

```
for y in 0..1501:
    for x in 1..1501:
        grid[x][y] += grid[x-1][y];
```

---

## 📏 ステップ④：1以上のセルをカウント

最終的な2次元の grid には、各セルに「何回塗られたか」が入っており、
これが1以上のマスをカウントすることで、**少なくとも1枚の紙に覆われた面積**を得ます。

---

## 📊 具体的なセルイメージ

例えば上記の入力で `grid[x][y] > 0` になるマスは次の7個です：

| x   | y   |
| --- | --- |
| 1   | 1   |
| 1   | 2   |
| 2   | 1   |
| 2   | 2   |
| 2   | 3   |
| 3   | 2   |
| 3   | 3   |

面積 `= 7`

---

## 🎯 図まとめ（簡易）

```
2つの長方形:
1. (1,1)-(3,3)
2. (2,2)-(4,4)

重なりセル:
x,yのマスに「少なくとも1回塗られた」数 = 面積

グリッド図（塗られたマスのみ表示）:

    y
    ↑
  4 │     ■■
  3 │   ■■■■
  2 │ ■■■■
  1 │ ■■
    └────────→ x

計7マスが塗られている。
```

---

## ✅ なぜ高速で省メモリ？

| 方法             | 説明                                           |
| ---------------- | ---------------------------------------------- |
| 2D差分法         | 塗り操作を4箇所だけで完了、`O(1)` 操作で塗れる |
| 累積和（前計算） | 1回ずつのループで塗り状態を求められる          |
| Int16Array使用   | 2バイトの整数型でメモリ節約                    |
| 計算量           | `O(N + H×W)`、実用的な範囲で非常に高速         |

---

## 🔚 結論

- 長方形の重なり面積を求めるには「差分 → 累積和 → カウント」が高速かつ正確。
- 特に **グリッドサイズが小さい & クエリ数が多い** 時に有効。
- 本問題では「最大1500×1500のグリッド」という制約をフル活用した解法です。

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                           | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-07-05 17:46:06                                                                           | [B09 - Papers](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ch) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1266 Byte                                                                                 |      | 37 ms                                                                                        | 13100 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67289273) |
| 2025-07-05 17:40:59                                                                           | [B09 - Papers](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ch) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 1324 Byte                                                                                 |      | 253 ms                                                                                       | 64156 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67289166) |
| 2025-07-05 17:40:17                                                                           | [B09 - Papers](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ch) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 1268 Byte                                                                                 |      | 880 ms                                                                                       | 43208 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67289159) |
| 2025-07-05 17:14:08                                                                           | [B09 - Papers](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ch) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 1120 Byte                                                                                 |      | 162 ms                                                                                       | 67952 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67288676) |
| 2025-07-05 17:07:28                                                                           | [B09 - Papers](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ch) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 1010 Byte                                                                                 |      | 204 ms                                                                                       | 67776 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67288538) |
