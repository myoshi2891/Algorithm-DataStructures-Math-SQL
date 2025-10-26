---
## ✅ 問題のポイント

以下のクエリを高速に処理したい：

> `S[a,b] === S[c,d]` か判定せよ（Sは長さNの文字列、Q個のクエリ）

制約：

* N, Q ≤ 200,000
* → 部分文字列を毎回切り出して比較すると **TLE（時間超過）**。
---

## 💡 解決法：ローリングハッシュ + 前計算

文字列 `S` の「任意の区間のハッシュ値」を O(1) で求めるようにすれば、高速に比較できます。

---

## 📘 ローリングハッシュの基本アイデア

### ハッシュ関数（例）

```ts
H(S[0..i]) = S[0]*Bⁱ + S[1]*Bⁱ⁻¹ + ... + S[i]*B⁰
```

文字を数値化し、**基数Bの多項式**として扱う。

- `S[i]` は `a=1, b=2, ..., z=26` などに数値化
- `B=31` や `B=10007` などがよく使われる
- `MOD` を取ってオーバーフロー防止（今回は BigInt 使用）

---

## 🖼️ 図で理解する

### 例：`S = "abcbabc"`

| index (1-based) | 1   | 2   | 3   | 4   | 5   | 6   | 7   |
| --------------- | --- | --- | --- | --- | --- | --- | --- |
| char            | a   | b   | c   | b   | a   | b   | c   |

各文字を数値に変換：

```ts
a=1, b=2, c=3 → [1,2,3,2,1,2,3]
```

### プレフィックスハッシュ `hash[i]` の定義：

```
hash[i] = ハッシュ値(S[0..i-1])
power[i] = B^i
```

---

## ✨ 実装（TypeScript）

```ts
import * as fs from 'fs';

const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, Q] = input[0].split(' ').map(Number);
const S = input[1];
const queries = input.slice(2).map((line) => line.split(' ').map(Number));

// 定数
const MOD = 10n ** 9n + 7n;
const BASE = 31n;

// 1文字ずつ数値化してハッシュ計算
const hash: bigint[] = Array(N + 1).fill(0n);
const power: bigint[] = Array(N + 1).fill(1n);

// 前計算: prefix hash & power
for (let i = 0; i < N; i++) {
    const code = BigInt(S.charCodeAt(i) - 97 + 1); // 'a'→1, 'b'→2, ...
    hash[i + 1] = (hash[i] * BASE + code) % MOD;
    power[i + 1] = (power[i] * BASE) % MOD;
}

// 区間[l, r]のハッシュを取得（1-indexed）
function getHash(l: number, r: number): bigint {
    const raw = hash[r] - ((hash[l - 1] * power[r - l + 1]) % MOD);
    return (raw + MOD) % MOD; // 負にならないように調整
}

const result: string[] = [];
for (const [a, b, c, d] of queries) {
    result.push(getHash(a, b) === getHash(c, d) ? 'Yes' : 'No');
}

console.log(result.join('\n'));
```

---

## 🔍 getHash 関数の図解（例：S="abcbabc"）

求めたい区間 `S[2,4]`（= "bcb"）のハッシュ値：

### 全体のプレフィックスハッシュ:

```
hash = [
  0,                   // ""
  h1 = 'a' = 1
  h2 = 1*B + 'b'
  h3 = h2*B + 'c'
  h4 = h3*B + 'b'
  ...
]
```

### 部分文字列のハッシュを求める公式：

```
hash[r] - hash[l-1] * B^(r-l+1) mod MOD
```

これは、全体の多項式から前半を除去することで求める。

---

## 🧪 入力例の解説

### 入力：

```
7 3
abcbabc
1 3 5 7
1 5 2 6
1 2 6 7
```

### クエリ1：S\[1,3] vs S\[5,7]

- S\[1,3] = "abc"
- S\[5,7] = "abc"
- ハッシュ一致 → Yes

### クエリ2：S\[1,5] = "abcba", S\[2,6] = "bcbab"

- ハッシュ不一致 → No

---

## ✅ この解法の計算量

- 前処理：O(N)
- 各クエリ：O(1)
- 合計：**O(N + Q)**（最大でも40万）

→ **十分高速で、2秒以内に通る！**

---

## 💭 補足：衝突対策

厳密には、ハッシュの衝突が起こる可能性があるので、以下で安全性を上げられます：

- 2つの異なるMOD・BASEを用いた **二重ハッシュ**
- あるいは `crypto` モジュールを使ったハッシュ（遅い）

が、今回の問題では衝突の確率が非常に低いので、単一で十分です。

---

## ✅ まとめ

| 処理        | 内容                   | 時間     |
| ----------- | ---------------------- | -------- |
| 数値変換    | 文字を a→1, b→2 に変換 | O(N)     |
| prefix hash | ハッシュ・累乗を前計算 | O(N)     |
| クエリ処理  | 区間ハッシュ比較       | O(1) × Q |

---

## 🧱 全体構造と目的

```ts
const MOD = 10n ** 9n + 7n;
const BASE = 31n;
```

### 目的：

- 文字列 `S` の区間 `[l, r]` の部分文字列を**ハッシュ値で一意に表現**する。
- **計算時間 O(1)** で `S[l,r] === S[c,d]` を判定できるようにする。

---

## 🖼️ 例で説明：「abcba」

```
index:  1   2   3   4   5
char :  a   b   c   b   a
code :  1   2   3   2   1
```

---

## 🔁 ステップ①：プレフィックスハッシュと累乗の前計算

### 対象コード

```ts
const hash: bigint[] = Array(N + 1).fill(0n);
const power: bigint[] = Array(N + 1).fill(1n);

for (let i = 0; i < N; i++) {
    const code = BigInt(S.charCodeAt(i) - 97 + 1);
    hash[i + 1] = (hash[i] * BASE + code) % MOD;
    power[i + 1] = (power[i] * BASE) % MOD;
}
```

### 🤔 何をやっているか？

- `hash[i]` は「先頭から `i` 文字目までの**ハッシュ値**」
- `power[i]` は「`BASE^i` の値」→ 後で部分文字列の除去に使う

---

### 🧠 ハッシュ式（多項式風）：

先頭から `i` 文字までを `S[0]S[1]...S[i-1]` とすると、

```
hash[i] = S[0]*B^(i-1) + S[1]*B^(i-2) + ... + S[i-1]*B^0
```

---

### 🧮 具体的な配列の中身（例：S = "abcba"）

| i   | char | code | hash\[i]                   | power\[i]   |
| --- | ---- | ---- | -------------------------- | ----------- |
| 0   |      |      | 0                          | 1           |
| 1   | a    | 1    | (0 \* 31 + 1) % MOD = 1    | 31          |
| 2   | b    | 2    | (1 \* 31 + 2) = 33         | 31² = 961   |
| 3   | c    | 3    | (33 \* 31 + 3) = 1026      | 31³ = 29791 |
| 4   | b    | 2    | (1026 \* 31 + 2) = 31808   | 31⁴         |
| 5   | a    | 1    | (31808 \* 31 + 1) = 986049 | 31⁵         |

---

## 📦 ステップ②：部分文字列のハッシュを O(1) で取得

### 対象コード

```ts
function getHash(l: number, r: number): bigint {
    const raw = hash[r] - ((hash[l - 1] * power[r - l + 1]) % MOD);
    return (raw + MOD) % MOD;
}
```

---

### 🎯 何をやってるか？

- `hash[r]` = `S[1..r]` のハッシュ
- `hash[l-1] * power[r-l+1]` = `S[1..l-1]` の影響部分を「位置に合わせて」引く
- → **ちょうど `S[l..r]` のハッシュが残る**

---

### 📘 例：S = "abcba", getHash(2, 4)

部分列 = `"bcb"`（2～4）

```
hash[4] = ハッシュ("abcb")
hash[1] = ハッシュ("a")
power[3] = 31^3 = 29791
```

```
getHash(2,4) = hash[4] - hash[1] * power[3]
```

- `hash[4] = H("abcb")`
- `hash[1] = H("a")`
- 引いて残るのは H("bcb")

---

### 🧠 図で示す

```
hash[0] = H("")         = 0
hash[1] = H("a")        = a
hash[2] = H("ab")       = a*B + b
hash[3] = H("abc")      = a*B² + b*B + c
hash[4] = H("abcb")     = a*B³ + b*B² + c*B + b
hash[5] = H("abcba")    = a*B⁴ + b*B³ + c*B² + b*B + a
```

部分列 `"bcb"` = 文字2～4：

```
hash[4] - hash[1] * B³  → 部分列のハッシュだけが残る
```

---

## ✅ なぜ `% MOD` と `( + MOD ) % MOD` が必要？

### 理由1：

- `BigInt` でもマイナス値になることがある
- `raw = a - b` のとき、`a < b` だと負になる

### 理由2：

- 負の値を MOD で正に戻すために `(raw + MOD) % MOD`

---

## ✅ まとめ表

| 項目        | 内容                                         |
| ----------- | -------------------------------------------- |
| `MOD`       | ハッシュの衝突・オーバーフロー防止用の素数   |
| `BASE`      | 多項式ベース。アルファベットなら31などが良い |
| `hash[i]`   | S\[0..i-1] までの接頭辞のハッシュ            |
| `power[i]`  | BASE^i（文字位置の調整用）                   |
| `getHash()` | 区間 `[l,r]` のハッシュを O(1) で取得        |

---

## 🔚 最後に

この技法を使うことで、最大 20 万件の部分文字列比較を高速に O(1) で処理できるようになります。

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                                | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果   | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-06-10 13:55:44                                                                           | [A56 - String Hash](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bd) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Ruby (ruby 3.2.2)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5018)                | 1000                                                                                    | 713 Byte                                                                                  | **AC** | 440 ms                                                                                       | 21244 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66638547) |
| 2025-06-10 13:52:53                                                                           | [A56 - String Hash](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bd) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 905 Byte                                                                                  | **AC** | 350 ms                                                                                       | 28020 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66638461) |
| 2025-06-10 13:49:37                                                                           | [A56 - String Hash](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bd) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1515 Byte                                                                                 | **AC** | 59 ms                                                                                        | 8060 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66638371) |
| 2025-06-10 13:47:40                                                                           | [A56 - String Hash](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bd) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 1025 Byte                                                                                 | **AC** | 482 ms                                                                                       | 84100 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66638314) |
| 2025-06-10 13:38:15                                                                           | [A56 - String Hash](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bd) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 1107 Byte                                                                                 | **AC** | 512 ms                                                                                       | 145372 KiB                                                                                   | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66638040) |
| 2025-06-10 13:33:22                                                                           | [A56 - String Hash](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bd) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 1013 Byte                                                                                 | **AC** | 513 ms                                                                                       | 145224 KiB                                                                                   | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66637911) |
