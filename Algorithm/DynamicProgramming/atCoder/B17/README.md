---

## 🧪 入力例

```
6
30 10 60 10 60 50
```

* 足場の番号（1-indexed）：1 2 3 4 5 6
* 高さ：`[30, 10, 60, 10, 60, 50]`

---

## ✅ ステップ①：DP 配列と prev 配列の定義

```ts
const dp: number[] = new Array(N).fill(Infinity);
const prev: number[] = new Array(N).fill(-1);
dp[0] = 0;
```

| 足場(i) | 高さ h\[i] | dp\[i] (最小コスト) | prev\[i] (直前の足場) |
| ------- | ---------- | ------------------- | --------------------- |
| 1       | 30         | 0                   | -                     |
| 2       | 10         | ∞                   | -1                    |
| 3       | 60         | ∞                   | -1                    |
| 4       | 10         | ∞                   | -1                    |
| 5       | 60         | ∞                   | -1                    |
| 6       | 50         | ∞                   | -1                    |

---

## ✅ ステップ②：遷移計算と更新（for文）

```ts
for (let i = 1; i < N; i++) {
    // i-1 からジャンプ
    const cost1 = dp[i - 1] + Math.abs(h[i] - h[i - 1]);

    // i-2 からジャンプ
    const cost2 = i > 1 ? dp[i - 2] + Math.abs(h[i] - h[i - 2]) : Infinity;

    // 最小コスト更新
    if (cost1 < dp[i]) {
        dp[i] = cost1;
        prev[i] = i - 1;
    }
    if (cost2 < dp[i]) {
        dp[i] = cost2;
        prev[i] = i - 2;
    }
}
```

### 遷移イメージ（i=1〜5）

```
dp[1] = dp[0] + |10 - 30| = 0 + 20 = 20
prev[1] = 0
→ 1 → 2

dp[2] = min(
  dp[1] + |60 - 10| = 20 + 50 = 70,
  dp[0] + |60 - 30| = 0 + 30 = 30 ←
)
prev[2] = 0
→ 1 → 3

dp[3] = min(
  dp[2] + |10 - 60| = 30 + 50 = 80,
  dp[1] + |10 - 10| = 20 + 0 = 20 ←
)
prev[3] = 1
→ 1 → 2 → 4

dp[4] = min(
  dp[3] + |60 - 10| = 20 + 50 = 70,
  dp[2] + |60 - 60| = 30 + 0 = 30 ←
)
prev[4] = 2
→ 1 → 3 → 5

dp[5] = min(
  dp[4] + |50 - 60| = 30 + 10 = 40,
  dp[3] + |50 - 10| = 20 + 40 = 60
)
prev[5] = 4
→ 1 → 3 → 5 → 6
```

---

### ✅ ステップ③：最終的な `dp` / `prev` 配列

| 足場(i) | 高さ h\[i] | dp\[i] | prev\[i] |
| ------- | ---------- | ------ | -------- |
| 1       | 30         | 0      | -        |
| 2       | 10         | 20     | 0        |
| 3       | 60         | 30     | 0        |
| 4       | 10         | 20     | 1        |
| 5       | 60         | 30     | 2        |
| 6       | 50         | 40     | 4        |

---

## ✅ ステップ④：経路復元

```ts
let current = N - 1;
while (current !== -1) {
    path.push(current + 1); // 1-indexed
    current = prev[current];
}
path.reverse();
```

復元過程：

```
current = 5 → path = [6]
prev[5] = 4 → path = [6, 5]
prev[4] = 2 → path = [6, 5, 3]
prev[2] = 0 → path = [6, 5, 3, 1]
prev[0] = -1 → 終了

→ reverse → [1, 3, 5, 6]
```

---

## ✅ 出力結果

```
4
1 3 5 6
```

---

## 🧠 図まとめ（経路図）

```txt
足場:   1    2    3    4    5    6
高さ:  30   10   60   10   60   50

              ↘        ↘       ↘
移動経路:     1 → 3 → 5 → 6
```

---

## ✅ 補足

- `dp[i]` は「その足場に行くまでの最小コスト」
- `prev[i]` は「どの足場から来たか」
- 経路復元は `prev` を後ろからたどって `.reverse()` するだけ

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                                            | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-07-11 17:40:29                                                                           | [B17 - Frog 1 with Restoration](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cp) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1286 Byte                                                                                 |      | 225 ms                                                                                       | 6256 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67487445) |
| 2025-07-11 16:08:52                                                                           | [B17 - Frog 1 with Restoration](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cp) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 1197 Byte                                                                                 |      | 36 ms                                                                                        | 34192 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67485325) |
| 2025-07-11 15:59:55                                                                           | [B17 - Frog 1 with Restoration](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cp) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 932 Byte                                                                                  |      | 72 ms                                                                                        | 37528 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67485128) |
| 2025-07-11 14:00:21                                                                           | [B17 - Frog 1 with Restoration](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cp) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 1018 Byte                                                                                 |      | 78 ms                                                                                        | 66040 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67482770) |
| 2025-07-11 13:28:16                                                                           | [B17 - Frog 1 with Restoration](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cp) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 878 Byte                                                                                  |      | 96 ms                                                                                        | 66528 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67482222) |
