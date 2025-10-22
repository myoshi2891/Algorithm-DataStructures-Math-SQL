---

## 🔰 問題概要（再掲）

* 高さが `h[0] ~ h[N-1]` の足場がある。
* カエルは足場 `1`（インデックス `0`）からスタート。
* 一度に `+1` か `+2` のジャンプができ、ジャンプのコストは `|hi - hj|`。
* 足場 `N` に到達する最小コストを求める。

---

## 🧠 アルゴリズム概要：動的計画法（DP）

- 定義：`dp[i]` = 足場 `i`（インデックス `i`）まで来る最小コスト
- 遷移：

    ```
    dp[i] = min(
      dp[i-1] + |h[i] - h[i-1]|,
      dp[i-2] + |h[i] - h[i-2]|
    )
    ```

- 最終出力：`dp[N-1]`

---

## 📘 例題

```
N = 6
h = [30, 10, 60, 10, 60, 50]
```

---

## 🔁 処理の流れと図解

### 🔹 ステップ 1: 初期化

```ts
let prev2 = 0; // dp[0] = 0
let prev1 = Math.abs(h[1] - h[0]); // dp[1] = |10 - 30| = 20
```

```
足場:     1    2    3    4    5    6
Index:    0    1    2    3    4    5
高さh:   30   10   60   10   60   50
          ▲    ▲
        dp[0]=0
        dp[1]=|10-30|=20
```

---

### 🔹 ステップ 2: i = 2

```ts
cost1 = prev1 + |h[2] - h[1]| = 20 + |60 - 10| = 70
cost2 = prev2 + |h[2] - h[0]| = 0 + |60 - 30| = 30
dp[2] = min(70, 30) = 30
```

```
足場:     1    2    3
Index:    0    1    2
高さh:   30   10   60
dp:       0   20   30
                      ▲
        ←―― dp[0]→  dp[2]
```

---

### 🔹 ステップ 3: i = 3

```ts
cost1 = dp[2] + |10 - 60| = 30 + 50 = 80
cost2 = dp[1] + |10 - 10| = 20 + 0 = 20
dp[3] = min(80, 20) = 20
```

```
足場:     1    2    3    4
Index:    0    1    2    3
高さh:   30   10   60   10
dp:       0   20   30   20
                           ▲
              ←―― dp[1]→  dp[3]
```

---

### 🔹 ステップ 4: i = 4

```ts
cost1 = dp[3] + |60 - 10| = 20 + 50 = 70
cost2 = dp[2] + |60 - 60| = 30 + 0 = 30
dp[4] = min(70, 30) = 30
```

```
足場:     1    2    3    4    5
Index:    0    1    2    3    4
高さh:   30   10   60   10   60
dp:       0   20   30   20   30
                                 ▲
                    ←―― dp[2]→  dp[4]
```

---

### 🔹 ステップ 5: i = 5

```ts
cost1 = dp[4] + |50 - 60| = 30 + 10 = 40
cost2 = dp[3] + |50 - 10| = 20 + 40 = 60
dp[5] = min(40, 60) = 40
```

```
足場:     1    2    3    4    5    6
Index:    0    1    2    3    4    5
高さh:   30   10   60   10   60   50
dp:       0   20   30   20   30   40
                                       ▲
                          ←―― dp[4]→  dp[5]
```

---

## ✅ 結果

```ts
console.log(prev1); // 最終的に dp[5] = 40
```

---

## ✅ 最小経路の例（最小コスト経路）

```
足場1 → 足場3 → 足場5 → 足場6
 30     60       60       50

|30-60| + |60-60| + |60-50| = 30 + 0 + 10 = 40 ✅
```

---

## 🔚 結論

- 各足場で、「1歩ジャンプ」と「2歩ジャンプ」の両方を考え、最小コストで更新。
- 最後に到達した `dp[N-1]` が答え。

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-07-10 12:27:12                                                                           | [B16 - Frog 1](https://atcoder.jp/contests/tessoku-book/tasks/dp_a) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 100                                                                                     | 946 Byte                                                                                  |      | 4 ms                                                                                         | 4952 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67462298) |
| 2025-07-10 12:22:28                                                                           | [B16 - Frog 1](https://atcoder.jp/contests/tessoku-book/tasks/dp_a) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 100                                                                                     | 1030 Byte                                                                                 |      | 32 ms                                                                                        | 28356 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67462225) |
| 2025-07-10 12:18:51                                                                           | [B16 - Frog 1](https://atcoder.jp/contests/tessoku-book/tasks/dp_a) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 100                                                                                     | 617 Byte                                                                                  |      | 51 ms                                                                                        | 21064 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67462180) |
| 2025-07-10 11:46:04                                                                           | [B16 - Frog 1](https://atcoder.jp/contests/tessoku-book/tasks/dp_a) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 100                                                                                     | 723 Byte                                                                                  |      | 57 ms                                                                                        | 52860 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67461638) |
| 2025-07-10 11:41:15                                                                           | [B16 - Frog 1](https://atcoder.jp/contests/tessoku-book/tasks/dp_a) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 100                                                                                     | 535 Byte                                                                                  |      | 81 ms                                                                                        | 52832 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67461530) |
