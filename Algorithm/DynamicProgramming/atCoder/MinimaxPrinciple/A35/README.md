---
## 1. 🎲 ゲームの本質：二人零和ゲーム（Zero-Sum Game）

この問題は、以下のような**二人対戦ゲーム**の典型例です：

* プレイヤーは **交互に操作**（Taro → Jiro → Taro → ...）。
* 一方がスコアを **最大化（Taro）**、もう一方がスコアを **最小化（Jiro）**。
* **終了時のスコア**は固定（最下段の整数）。
* 両者ともに「最善手」を選ぶ前提。

こうした状況で用いられるのが「**ミニマックス戦略**」です。
---

## 2. ♟ ミニマックス戦略とは？

### 基本概念

- 「**最大化プレイヤー（Taro）**」は自分の手番では **スコアを最大にする選択肢**を選ぶ。
- 「**最小化プレイヤー（Jiro）**」は自分の手番では **相手のスコアを最小にする選択肢**を選ぶ。
- これは再帰的に行われます。

### 木構造でのイメージ

```
            Start
           /     \
        20         30     ← Taroが選択（最大化）
       /  \       /  \
     10   20    30   40 ← Jiroが選択（最小化）
```

- Taroは「20, 30」の選択肢があり、それぞれJiroに選ばれることで「10 or 20」「30 or 40」に分岐。
- Jiroはそれぞれの選択で最小の値を選ぶ → Taroはそれを見越して最大のものを選ぶ。

---

## 3. 💡 この問題にどう当てはめるか？

ピラミッドを下りる過程を「配列 `A` の両端から1つずつ取り除くゲーム」に言い換えると、より扱いやすくなります。

### ゲームの等価変換

- 各移動で「左下」または「右下」＝「左端または右端の要素を選択する」に変換できます。
- すると状態は「配列 A の区間 `[l, r]` にいる」と表現できます。

---

## 4. 🧠 DP（動的計画法）による実装

### 状態定義

- `dp[l][r]`：現在 `A[l..r]` の範囲にあり、**この区間からの最善なスコア**。
- 遷移は次の2通り：
    - 左端 `l` を選んで → 次は `dp[l+1][r]`
    - 右端 `r` を選んで → 次は `dp[l][r-1]`

### 手番の判定

- 現在の区間長さ： `r - l + 1`
- 初期状態の長さは `N`
- `(r - l + 1) % 2 === N % 2` であれば Taro の手番（最大化）、そうでなければ Jiro の手番（最小化）

---

### 再帰 + メモ化実装例

```javascript
function solveGame(A) {
    const N = A.length;
    const memo = Array.from({ length: N }, () => Array(N).fill(undefined));

    function dfs(l, r) {
        if (l === r) return A[l];
        if (memo[l][r] !== undefined) return memo[l][r];

        const taroTurn = (r - l + 1) % 2 === N % 2;
        if (taroTurn) {
            memo[l][r] = Math.max(dfs(l + 1, r), dfs(l, r - 1));
        } else {
            memo[l][r] = Math.min(dfs(l + 1, r), dfs(l, r - 1));
        }
        return memo[l][r];
    }

    return dfs(0, N - 1);
}
```

---

## 5. 🧮 なぜこれが正しく、効率的なのか？

- `dp[l][r]` は `O(1)` 時間で計算できる（再利用される）。
- `l <= r` の範囲は `O(N^2)` 個 → 全体計算量は **`O(N^2)`**。
- 制約 `N ≤ 2000` に対して十分間に合います。

---

## ✅ まとめ

| 要素       | 内容                                                    |
| ---------- | ------------------------------------------------------- |
| 問題タイプ | 二人零和ゲーム、区間DP                                  |
| 戦略       | ミニマックス（最大化 vs 最小化）                        |
| 状態       | 残っている数列の範囲 `[l, r]`                           |
| 遷移       | 左または右を選び、その後相手が動く状態に遷移            |
| 最適性確保 | 両者が最善を尽くす → 再帰で全選択肢を辿る（DPでメモ化） |
| 実行時間   | `O(N^2)`（2000 × 2000 = 400万程度でOK）                 |

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                           | ユーザ                                            | 言語                                                                                                    | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果   | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-05-21 12:09:04                                                                           | [A35 - Game 4](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ai) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Java (OpenJDK 17)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5005)            | 1000                                                                                    | 919 Byte                                                                                  | **AC** | 183 ms                                                                                       | 69388 KB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66012246) |
| 2025-05-21 12:07:01                                                                           | [A35 - Game 4](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ai) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)      | 1000                                                                                    | 714 Byte                                                                                  | **AC** | 865 ms                                                                                       | 40884 KB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66012200) |
| 2025-05-21 12:04:53                                                                           | [A35 - Game 4](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ai) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)               | 1000                                                                                    | 1234 Byte                                                                                 | **AC** | 47 ms                                                                                        | 35404 KB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66012156) |
| 2025-05-21 12:02:53                                                                           | [A35 - Game 4](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ai) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)              | 1000                                                                                    | 917 Byte                                                                                  | **AC** | 250 ms                                                                                       | 125916 KB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66012096) |
| 2025-05-21 11:51:44                                                                           | [A35 - Game 4](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ai) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000                                                                                    | 914 Byte                                                                                  | **AC** | 148 ms                                                                                       | 110428 KB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66011905) |
