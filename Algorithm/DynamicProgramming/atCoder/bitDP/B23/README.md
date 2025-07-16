以下では、**ビットDPによる巡回セールスマン問題（TSP）の解法**について、図を交えながら**各処理の具体的な役割・仕組み**を丁寧に説明します。

---

## 🧭 問題概要（図解）

与えられた複数の都市を **一度ずつ訪れて出発点に戻る** 最短ルートを求める。

```
例: 4都市の場合（座標省略）

        (1)
        / \
      /     \
    (0)     (3)
      \     /
        \ /
        (2)

最短経路の一例: 0 → 1 → 3 → 2 → 0
```

距離はすべて **ユークリッド距離**（直線距離）です。

---

## ✅ 解法全体の構造（ビットDP）

TSPを **bitDP (状態:訪問済み集合 × 現在地)** で解きます。

### 状態定義：

```ts
dp[S][u] := 訪問済み都市集合 S にいて、現在地が u のときの最短距離
```

* `S`: 訪問した都市のビットマスク（0〜(1<\<N)-1）
* `u`: 現在いる都市のインデックス（0〜N-1）

---

## 🧩 ステップごとの詳細解説（図付き）

---

### 🥇 ステップ1：距離の前計算

```ts
dist[i][j] = √((xi - xj)^2 + (yi - yj)^2)
```

#### 図：

```
都市間の距離（例: 4都市）

        0       1       2       3
      +----------------------------+
    0 |   0   d01    d02    d03
    1 | d10     0    d12    d13
    2 | d20   d21      0    d23
    3 | d30   d31   d32      0
```

これを `N^2` 個、前もって計算します。

---

### 🥈 ステップ2：初期化

```ts
dp[1][0] = 0
```

#### 意味：

* まだ都市 `0` しか訪れていない（= `0001`）
* 現在地も都市 `0` → 距離は `0`

---

### 🥉 ステップ3：遷移（状態更新）

```ts
for (s = 1; s < 1<<N; s++) {
  for (u = 0; u < N; u++) {
    if (!(s & (1 << u))) continue;
    for (v = 0; v < N; v++) {
      if (s & (1 << v)) continue;
      dp[s | (1 << v)][v] = min(dp[s | (1 << v)][v], dp[s][u] + dist[u][v]);
    }
  }
}
```

---

#### 図：状態遷移例（N = 3）

* 状態: `dp[0b001][0] = 0`（都市0にいる）
* 遷移:

```
           +---+ d[0][1] +---+ d[1][2] +---+
Start(0) →| 1 |-------->| 1 |-------->| 2 |
         [001][0]     [011][1]     [111][2]

dp[011][1] = dp[001][0] + dist[0][1]
dp[111][2] = dp[011][1] + dist[1][2]
```

* 全都市訪問後（状態: `111`）、`→ 0` に戻って最短経路を完成させる。

---

### 🏁 ステップ4：最終的な答え

```ts
let res = Infinity;
for (let u = 1; u < N; u++) {
  res = Math.min(res, dp[(1 << N) - 1][u] + dist[u][0]);
}
```

#### 図：

```
各都市で最後に止まり、出発地0へ戻る経路を考慮：

dp[111][1] + dist[1][0]
dp[111][2] + dist[2][0]
dp[111][3] + dist[3][0]
           ︙
→ その最小値が答え
```

---

## 🧠 実際の DP 表の例（N=3）

```
dp[bit][city] = 最短距離

bit = 訪問済み都市集合（例: 011 = 都市0と1を訪問）

初期: dp[001][0] = 0

更新例:

dp[011][1] = dp[001][0] + dist[0][1]
dp[111][2] = dp[011][1] + dist[1][2]
dp[111][1] = dp[101][2] + dist[2][1]
...
```

---

## ⚙ 処理量と制約内での対応

| 項目     | 値                    |
| ------ | -------------------- |
| 状態数    | `N * 2^N`            |
| 遷移数    | `N^2 * 2^N`          |
| 時間計算量  | 約 `7.5 * 10^5`（N=15） |
| メモリ使用量 | 約 4 MiB              |
| 計算精度   | `toFixed(12)` 使用     |

---

## ✅ 結論：この解法の強み

* 精度良く計算可能（誤差1e-3未満）
* 時間・メモリ制約を満たす（N=15まで余裕）
* 経路復元も拡張可能

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-07-16 15:51:43 | [B23 - Traveling Salesman Problem](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cv) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 2318 Byte |  | 23 ms | 6844 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67638699) |
| 2025-07-16 15:41:19 | [B23 - Traveling Salesman Problem](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cv) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 2158 Byte |  | 101 ms | 34160 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67638408) |
| 2025-07-16 15:34:31 | [B23 - Traveling Salesman Problem](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cv) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 2332 Byte |  | 553 ms | 20796 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67638210) |
| 2025-07-16 15:14:45 | [B23 - Traveling Salesman Problem](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cv) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 1835 Byte |  | 87 ms | 59288 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67637678) |
| 2025-07-16 15:08:08 | [B23 - Traveling Salesman Problem](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cv) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 1854 Byte |  | 89 ms | 59600 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67637515) |