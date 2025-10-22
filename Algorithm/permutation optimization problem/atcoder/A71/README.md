順列最適化問題（Permutation Optimization Problem）とは、「**ある集合の要素の並べ方（順列）を変えることで、特定の目的関数の値（コストや報酬など）を最小（または最大）にするような並び順を見つける問題**」のことです。

---

## 🎯 順列最適化問題の基本構造

- **入力：**
    - ある集合（配列、リストなど）に属する要素 `n` 個。
    - 各要素の特性、または要素間の関係（距離・重みなど）。

- **目的：**
    - 並べ方（順列）を変えて、コストやスコアが最小／最大になるようにする。

---

## ✅ 代表的な例

### ① 今回の問題（宿題と気温のマッチング）

- 要素：宿題の難易度配列 `A` と気温配列 `B`
- 並び方：`A`の順序を変更して `B` に割り当てる
- コスト：`Σ A[i] × B[i]`
- 目的：このコストを**最小化**

> この問題は「**加重積最小化問題**」の一種で、\*\*難易度と気温をどう組み合わせるか（順列）\*\*がカギ。

---

### ② 旅行セールスマン問題（TSP）

- 都市の集合を訪れる順番（=順列）を決める
- コスト：移動距離の合計
- 目的：距離の合計を**最小にする巡回路を求める**

---

### ③ ジョブスケジューリング問題

- 複数のタスクを並べる順序を決める
- タスク時間、納期、優先度などを考慮し、**遅延ペナルティなどの総和を最小化**する順序を求める

---

## 📌 今回の問題の特徴と最適性の直感

`労力 = 難易度 × 気温`
→ 労力最小 = **大きな数と小さな数の掛け合わせを避ける**こと！

そのための戦略は：

- **難易度が高い宿題は、気温が低い日（労力の乗数が小さい日）にやる**
- **難易度が低い宿題は、気温が高くても気にせず割り当ててOK**

これにより「大きい数同士の掛け合わせ」を回避でき、労力を抑えられます。

### 📘 数学的補足：シュワルツの不等式（交換法則）

並び順によって「重いタスクが重い日に当たる」ような場合は、入れ替えによって**全体の積和を下げることができる**。
この考えは「シュワルツの不等式」や「交換法」などに基づきます。

---

## 🔁 全探索（順列全列挙）ではダメ？

- 全ての順列を調べる方法もある（`O(N!)`通り）
- ただし **N ≧ 10** くらいで現実的でなくなる
- 今回は `N ≤ 60` だが、最適戦略（ソート）で `O(N log N)` で解けるので、効率的な方法を使うべき

---

## ✨ まとめ：順列最適化問題とは？

| 観点         | 内容                                                                       |
| ------------ | -------------------------------------------------------------------------- |
| 問題概要     | 並べ方を変えて目的関数を最適化（最小化・最大化）する問題                   |
| 応用分野     | 経路探索、ジョブスケジューリング、リソース割当て、UI要素配置など           |
| 解法の代表例 | ソート、貪欲法、動的計画法、全探索、枝刈り付き探索、ヒューリスティックなど |
| 本問題の戦略 | `A`降順 × `B`昇順 にソートして対応付け（加重積最小）                       |

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                             | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果   | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-06-25 18:06:47                                                                           | [A71 - Homework](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bs) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 450 Byte                                                                                  | **AC** | 17 ms                                                                                        | 21576 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67060852) |
| 2025-06-25 18:04:10                                                                           | [A71 - Homework](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bs) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 842 Byte                                                                                  | **AC** | 1 ms                                                                                         | 1636 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67060794) |
| 2025-06-25 18:01:44                                                                           | [A71 - Homework](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bs) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 409 Byte                                                                                  | **AC** | 12 ms                                                                                        | 8612 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67060734) |
| 2025-06-25 17:55:06                                                                           | [A71 - Homework](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bs) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 672 Byte                                                                                  | **AC** | 40 ms                                                                                        | 42900 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67060577) |
| 2025-06-25 17:48:22                                                                           | [A71 - Homework](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bs) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 636 Byte                                                                                  | **AC** | 39 ms                                                                                        | 42804 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67060446) |
