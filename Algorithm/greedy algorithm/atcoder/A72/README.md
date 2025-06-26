
---

## 💡 問題の要点

* **H×W のグリッド**がある（H行W列）。
* 各マスは **白（`.`）または黒（`#`）**。
* あなたは「**任意の行または列**を黒く塗る」操作を **K回**までできる。
* 目的：**黒マスの総数を最大にする**。

---

## 🧭 処理ステップの図解と説明

### 🧮 入力例（H=4, W=10, K=3）

```
入力:
4 10 3
##...#.##.
.#....#...
##.####..#
#..######.

グリッド（初期状態）:

行↓／列→ 0 1 2 3 4 5 6 7 8 9
        ---------------------
 0      | # # . . . # . # # .
 1      | . # . . . . # . . .
 2      | # # . # # # # . . #
 3      | # . . # # # # # # .

```

---

### 🔄 ステップ1：すべての行の選び方を全探索（2^Hパターン）

最大 `2^10 = 1024` 通りの\*\*「どの行を塗るかの選び方」\*\*を調べる。

#### 例）行\[0, 2]を塗るとする（2行塗る → K残り1回）

```
→ 行0と行2の全マスが強制的に黒になる

（変更後）

行↓／列→ 0 1 2 3 4 5 6 7 8 9
        ---------------------
 0      | # # # # # # # # # #   ← 全部黒
 1      | . # . . . . # . . .
 2      | # # # # # # # # # #   ← 全部黒
 3      | # . . # # # # # # .

```

---

### 📊 ステップ2：各列の黒マス数をカウント

列ごとに**何個の黒マスがあるか数える**（塗った行も含めて）

```
例：列別黒マス数

列： 0 1 2 3 4 5 6 7 8 9
     -------------------
数： 3 3 2 3 3 3 4 3 3 2

（黒マスがH=4に満たない列は、黒く塗ることで増加が見込める）
```

---

### 🧠 ステップ3：残り操作数で「列」を貪欲に選んで塗る

* 今回は **K = 3**、既に **行を2回塗ってる**ので、残り1回の操作で**どの列を塗るか？**
* 列ごとに「塗れば何マス増えるか（= H - 黒マス数）」を計算

```
gain[j] = H - 黒マス数

列ごとの gain：
列： 0 1 2 3 4 5 6 7 8 9
増： 1 1 2 1 1 1 0 1 1 2

→ gain 最大の列2 or 9 を1本だけ塗る
```

#### たとえば列2を選んで塗ると：

```
→ 全行の列2が黒くなる

更新後：

行↓／列→ 0 1 2 3 4 5 6 7 8 9
        ---------------------
 0      | # # # # # # # # # #
 1      | . # # . . . # . . .
 2      | # # # # # # # # # #
 3      | # . # # # # # # # .
```

---

### 🔢 ステップ4：全体の黒マスを数える

最終盤面：

```
黒マス数の合計 = 各マスについて # ならカウント
→ この例では 37
```

---

## 🔁 この手順を全行選択パターン（2^H）について繰り返す

* 毎回、残りの K から「列の塗り方」を**貪欲法**で選ぶ。
* 各パターンの黒マス数を比べ、**最大値を記録**。

---

## ✅ 結果

```
最大の黒マス数 → 37（この例では）
```

---

## ✏️ 補足：なぜ行だけ全探索で良いの？

* H ≤ 10 → 全ての行の選び方は **2^10 = 1024通り**
* W は最大100なので列の全探索は厳しい → **列は貪欲に最適な列だけ選ぶ**

---

## 📌 図と処理の対応まとめ

| ステップ  | 処理            | 図の説明位置 |
| ----- | ------------- | ------ |
| ステップ1 | 行選択の全探索       | 🧭     |
| ステップ2 | 黒マス数カウント      | 📊     |
| ステップ3 | 残りの列を貪欲で塗る    | 🧠     |
| ステップ4 | 最終的な黒マス数をカウント | 🔢     |

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-06-26 23:04:55 | [A72 - Tile Painting](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bt) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 1813 Byte | **AC** | 104 ms | 21632 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67085480) |
| 2025-06-26 23:03:03 | [A72 - Tile Painting](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bt) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 2034 Byte | **AC** | 17 ms | 6564 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67085444) |
| 2025-06-26 23:01:26 | [A72 - Tile Painting](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bt) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 1815 Byte | **AC** | 133 ms | 9144 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67085411) |
| 2025-06-26 22:49:19 | [A72 - Tile Painting](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bt) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 1890 Byte | **AC** | 95 ms | 49472 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67085207) |
| 2025-06-26 22:43:39 | [A72 - Tile Painting](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bt) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 1817 Byte | **AC** | 103 ms | 49120 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67085118) |