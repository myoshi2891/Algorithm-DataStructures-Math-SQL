TypeScriptコードで使用した**編集距離（Levenshtein距離）**アルゴリズムの各処理を**図とともに具体的に解析・説明**します。

---

## 🎯 問題の本質

**目標**: 文字列 `S` を `T` に変換するための**最小操作回数**を求める
操作は3種類:

1. 削除（delete）
2. 挿入（insert）
3. 変更（replace）

この問題は、文字列の編集距離（Levenshtein距離）を求める典型問題です。

---

## 📐 アルゴリズム概要（DP配列の定義）

### `dp[i][j]` の定義：

`S[0..i-1]` を `T[0..j-1]` に変換するための**最小操作回数**

---

## 🧮 初期化処理

### コード該当箇所：

```ts
for (let j = 0; j <= m; j++) {
    dp[0][j] = j;
}
```

### 📊 状態遷移図（初期化）

| i＼j | 0   | 1   | 2   | 3   | ... | m   |
| ---- | --- | --- | --- | --- | --- | --- |
| 0    | 0   | 1   | 2   | 3   | ... | m   |

意味：`S`が空のとき、`T`の先頭 `j` 文字にするには `j` 回の**挿入**が必要。

---

## 🔁 DPの状態遷移処理

### コード該当箇所：

```ts
for (let i = 1; i <= n; i++) {
    const curr = i % 2;
    const prev = 1 - curr;
    dp[curr][0] = i;
    for (let j = 1; j <= m; j++) {
        if (s[i - 1] === t[j - 1]) {
            dp[curr][j] = dp[prev][j - 1];
        } else {
            dp[curr][j] = Math.min(
                dp[prev][j] + 1, // 削除
                dp[curr][j - 1] + 1, // 挿入
                dp[prev][j - 1] + 1, // 変更
            );
        }
    }
}
```

---

## 🔁 処理の図解：例で理解（S = `tokyo`, T = `kyoto`）

文字列：

```
S = t o k y o
T = k y o t o
```

DPテーブル構築の様子：

| i＼j | 0   | 1   | 2   | 3   | 4   | 5   |
| ---- | --- | --- | --- | --- | --- | --- |
| 0    | 0   | 1   | 2   | 3   | 4   | 5   |
| 1(t) | 1   | ?   |     |     |     |     |
| 2(o) | 2   |     |     |     |     |     |
| 3(k) | 3   |     |     |     |     |     |
| 4(y) | 4   |     |     |     |     |     |
| 5(o) | 5   |     |     |     |     |     |

---

### 🔄 状態遷移の例

たとえば `dp[3][1]`（`tok` vs `k`）を求めるとき：

- `S[2] = k`, `T[0] = k` → **同じ文字**なので **変更不要**
- よって `dp[3][1] = dp[2][0] = 2`

挿入・削除・変更の例も以下のように選ばれます：

- `dp[i-1][j] + 1`: S の文字削除（上の行）
- `dp[i][j-1] + 1`: T に合わせて挿入（左の列）
- `dp[i-1][j-1] + 1`: S の文字を T に置き換え（斜め左上）

---

## 📊 処理例の全体イメージ（簡易版）

`S = abcdef`, `T = bdf`

途中のDP表（部分）:

| i＼j | 0   | 1 (b) | 2 (d) | 3 (f) |
| ---- | --- | ----- | ----- | ----- |
| 0    | 0   | 1     | 2     | 3     |
| 1(a) | 1   | 1     | 2     | 3     |
| 2(b) | 2   | 1     | 2     | 3     |
| 3(c) | 3   | 2     | 2     | 3     |
| 4(d) | 4   | 3     | 2     | 3     |
| 5(e) | 5   | 4     | 3     | 3     |
| 6(f) | 6   | 5     | 4     | 3     |

答え → `dp[6][3] = 3`

---

## ✅ 最終結果の取得

```ts
return dp[n % 2][m]; // 最終操作回数
```

---

## ✅ まとめ：処理の流れ図

```plaintext
          +----------------------+
          |  初期化 dp[0][j] = j |
          +----------------------+
                     ↓
          +----------------------+
          | 外ループ i in [1,n]  |
          | 内ループ j in [1,m]  |
          | 文字一致 → dp = 斜め |
          | 不一致 → min3操作    |
          +----------------------+
                     ↓
          +----------------------+
          | 結果: dp[n%2][m]     |
          +----------------------+
```

---

🔁 DPの状態遷移処理
コード該当箇所のコードは、**編集距離（Levenshtein距離）を求めるDP処理**の中核部分です。
以下に処理の全体像を**詳細に段階分けして解説**します。加えて、**図とともに直感的な理解**も深めます。

---

## 🧠 処理目的

このループは、文字列 `s` を `t` に変換するための**最小操作回数を求める**動的計画法（DP）です。

---

## 🧩 前提：変数の意味

- `s`: 元の文字列
- `t`: 目標の文字列
- `n = s.length`
- `m = t.length`
- `dp`: 2行 (幅 m+1) の配列で、`dp[0][j]`と`dp[1][j]`の2つを交互に使う（**メモリ節約**）

---

## 🔍 各処理の詳細

### ✅ 1. 外側ループ `for (let i = 1; i <= n; i++)`

- `s[0..i-1]` を使って、`t[0..j-1]` に変換する最小操作を求める。
- 1文字ずつ `s` の文字を順に処理していくループ。

---

### ✅ 2. `const curr = i % 2; const prev = 1 - curr;`

- `dp` を2行（0番と1番）だけで交互に使う（**ローリング配列**）
    - `curr`: 現在の行
    - `prev`: 1つ前の行

これにより、**空間計算量を O(m)** に抑えることができます。

#### 🖼️ 図示：

```plaintext
dp[prev] = 前の行（i-1文字目まで）
dp[curr] = 現在処理中の行（i文字目まで）
```

---

### ✅ 3. `dp[curr][0] = i`

- `t` が空文字（`j = 0`）のとき、`s` の `i` 文字をすべて削除して一致させる必要があるため、`i` 回の削除。

---

### ✅ 4. 内側ループ `for (let j = 1; j <= m; j++)`

- `t` の1文字目から `j` 文字目までを使って変換の最小操作を求める。

---

### ✅ 5. `if (s[i - 1] === t[j - 1])`

- `s` の `(i-1)` 文字目と `t` の `(j-1)` 文字目が**一致している**場合：

#### 処理内容：

```ts
dp[curr][j] = dp[prev][j - 1];
```

→ 変換不要なので、斜め左上の状態をそのまま引き継ぎます。

#### 🖼️ 図：

```plaintext
    s[i-1] === t[j-1] のとき

  dp[prev][j-1] → dp[curr][j]
```

---

### ✅ 6. `else` — 3操作のうち最小のものを選ぶ

#### 処理内容：

```ts
dp[curr][j] = Math.min(
    dp[prev][j] + 1, // 削除（delete s[i-1]）
    dp[curr][j - 1] + 1, // 挿入（insert t[j-1]）
    dp[prev][j - 1] + 1, // 変更（replace s[i-1] → t[j-1]）
);
```

#### 🧠 各操作の意味と参照元：

| 操作 | 意味                                                         | 参照先            | 必要な操作      |
| ---- | ------------------------------------------------------------ | ----------------- | --------------- |
| 削除 | `s[i-1]` を削除して `s[0..i-2] → t[0..j-1]` にする           | `dp[prev][j]`     | +1 操作（削除） |
| 挿入 | `t[j-1]` を挿入して `s[0..i-1] → t[0..j-2]` にする           | `dp[curr][j - 1]` | +1 操作（挿入） |
| 変更 | `s[i-1]` を `t[j-1]` に変えて `s[0..i-2] → t[0..j-2]` にする | `dp[prev][j - 1]` | +1 操作（置換） |

---

### 📊 小さい例で視覚的に確認（`s = ab`, `t = ac`）

| i＼j | 0   | a   | c   |                                    |
| ---- | --- | --- | --- | ---------------------------------- |
| 0    | 0   | 1   | 2   |                                    |
| a    | 1   | 0   | 1   |                                    |
| b    | 2   | 1   | 1   | ← `s[1]=b`, `t[1]=c` → replace b→c |

---

## 🔁 全体の構造（図）

```plaintext
for i = 1 to n:
    curr = i % 2
    prev = 1 - curr
    dp[curr][0] = i   ← s[0..i-1] → ""（全削除）

    for j = 1 to m:
        if s[i-1] == t[j-1]:
            dp[curr][j] = dp[prev][j-1]
        else:
            dp[curr][j] = min(
                dp[prev][j] + 1,      ← 削除
                dp[curr][j-1] + 1,    ← 挿入
                dp[prev][j-1] + 1     ← 変更
            )
```

---

## 🏁 最後に

最終的な答えは `dp[n % 2][m]` に格納されており、それが最小の操作回数となります。

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                                  | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-07-14 14:03:46                                                                           | [B20 - Edit Distance](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cs) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1555 Byte                                                                                 |      | 24 ms                                                                                        | 1660 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67594322) |
| 2025-07-14 14:01:07                                                                           | [B20 - Edit Distance](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cs) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 1414 Byte                                                                                 |      | 286 ms                                                                                       | 21664 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67594284) |
| 2025-07-14 13:56:07                                                                           | [B20 - Edit Distance](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cs) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 1367 Byte                                                                                 |      | 705 ms                                                                                       | 9072 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67594180) |
| 2025-07-14 13:25:22                                                                           | [B20 - Edit Distance](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cs) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 1511 Byte                                                                                 |      | 101 ms                                                                                       | 47940 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67593642) |
| 2025-07-14 13:20:27                                                                           | [B20 - Edit Distance](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cs) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 1245 Byte                                                                                 |      | 102 ms                                                                                       | 47852 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67593557) |
