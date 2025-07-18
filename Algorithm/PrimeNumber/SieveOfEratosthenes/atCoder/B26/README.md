TypeScript で実装したエラトステネスの篩の各処理を **図解付きでステップごとに解析**して解説します。
対象は以下の入力です：

---

### 🔢 **入力例**

```
N = 20
```

---

## 🧠 全体の流れ

```text
入力値 N を読み取り
↓
配列 isPrime を true で初期化
↓
エラトステネスの篩で素数をふるい落とす
↓
素数だけを primes[] に格納
↓
出力（1行ずつ）
```

---

## 🧩 ステップごとの図解と処理内容

---

### ① 入力の読み取り

```ts
const input: string = fs.readFileSync('/dev/stdin', 'utf8').trim();
const N: number = parseInt(input, 10);
```

📘 **説明**：
標準入力から数値 `N = 20` を読み取り、文字列から整数に変換します。

---

### ② isPrime 配列の初期化

```ts
const isPrime: boolean[] = new Array(n + 1).fill(true);
isPrime[0] = false;
isPrime[1] = false;
```

📘 **説明**：
`isPrime[i] === true` なら `i` は素数と仮定。

📊 **図：配列の初期化後**

| i | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
| - | - | - | - | - | - | - | - | - | - | - | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
| 値 | F | F | T | T | T | T | T | T | T | T | T  | T  | T  | T  | T  | T  | T  | T  | T  | T  | T  |

---

### ③ エラトステネスの篩処理

```ts
for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
        for (let j = i * i; j <= n; j += i) {
            isPrime[j] = false;
        }
    }
}
```

📘 **説明**：
素数 `i` の倍数をすべて `false` にしていきます。

---

#### ✅ i = 2 のとき

倍数 4, 6, 8, …, 20 を `false`

```text
消す → 4 6 8 10 12 14 16 18 20
```

| i | … | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
| - | - | - | - | - | - | - | - | - | - | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
| 値 | … | T | T | ❌ | T | ❌ | T | ❌ | T | ❌  | T  | ❌  | T  | ❌  | T  | ❌  | T  | ❌  | T  | ❌  |

---

#### ✅ i = 3 のとき

倍数 9, 12, 15, 18 を `false`
（12と18はすでに `false`）

```text
消す → 9 15
```

---

#### ✅ i = 4 のとき

4は既に `false` → スキップ

---

#### ✅ i = 5 以降

`i * i = 25 > 20` → ループ終了

---

### 🔎 篩後の isPrime 配列

| i | 2  | 3  | 4 | 5  | 6 | 7  | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
| - | -- | -- | - | -- | - | -- | - | - | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
| 値 | ✔️ | ✔️ | × | ✔️ | × | ✔️ | × | × | ×  | ✔️ | ×  | ✔️ | ×  | ×  | ×  | ✔️ | ×  | ✔️ | ×  |

---

### ④ primes配列の作成

```ts
const primes: number[] = [];
for (let i = 2; i <= n; i++) {
    if (isPrime[i]) primes.push(i);
}
```

📘 **説明**：
`true` となっているインデックスだけ `primes[]` に格納

📦 `primes = [2, 3, 5, 7, 11, 13, 17, 19]`

---

### ⑤ 出力処理

```ts
console.log(primes.join('\n'));
```

📘 **説明**：
素数を1行ずつ出力形式に変換して表示。

🖨️ 出力：

```
2
3
5
7
11
13
17
19
```

---

### ⏱️ 計測処理の図解

```ts
console.time('Execution Time');
const memoryBefore = process.memoryUsage().heapUsed;
// 処理...
console.timeEnd('Execution Time');
const memoryAfter = process.memoryUsage().heapUsed;
```

📘 **説明**：

* `console.time` 〜 `console.timeEnd`: 実行時間測定
* `process.memoryUsage()`: メモリ使用量を計測（before / after）

---

## 📌 最終まとめ図

```text
        [ 標準入力 N ]
                 ↓
        +-----------------+
        | isPrime配列初期化 |
        +-----------------+
                 ↓
        +---------------------+
        | エラトステネスの篩   |
        | i=2〜√N, 倍数を除去 |
        +---------------------+
                 ↓
        +---------------------+
        | isPrime → primes抽出 |
        +---------------------+
                 ↓
        +---------------------+
        | 1行ずつ出力         |
        +---------------------+
```

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-07-18 15:38:06 | [B26 - Output Prime Numbers](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cy) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 1093 Byte |  | 11 ms | 5532 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67678439) |
| 2025-07-18 15:34:54 | [B26 - Output Prime Numbers](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cy) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 957 Byte |  | 59 ms | 38428 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67678386) |
| 2025-07-18 15:32:16 | [B26 - Output Prime Numbers](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cy) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 1138 Byte |  | 98 ms | 21440 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67678340) |
| 2025-07-18 15:16:03 | [B26 - Output Prime Numbers](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cy) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 1152 Byte |  | 66 ms | 62340 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67678054) |
| 2025-07-18 15:13:12 | [B26 - Output Prime Numbers](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cy) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 1047 Byte |  | 67 ms | 62276 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67678009) |