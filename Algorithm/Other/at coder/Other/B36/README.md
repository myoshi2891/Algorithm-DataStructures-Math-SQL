以下では、先ほどの TypeScript 版のコードに対して、**各処理を図とともに詳細に解析・説明**します。

---

## 🔧 **問題の要約**

- 長さ `N` の電球列 `S` が与えられ、各電球は `0` (OFF), `1` (ON)。
- 操作：**異なる2個の電球を選んで両方反転**（ON⇄OFF）。
- ゴール：**ちょうど `K` 個の電球を ON にすることが可能か？**

---

## 💡 アルゴリズム概要

- `count1 = S に含まれる '1' の個数`
- 操作で変化するのは **ON の個数 ±2** → 偶数単位の変化しかできない。
- よって

    ```
    abs(count1 - K) % 2 === 0
    ```

    を満たせば到達可能。

---

## ✅ コード全体（TypeScript）

```ts
import * as fs from 'fs';

/**
 * 指定の状態にできるかどうかを判定する関数
 * @param n - 電球の個数
 * @param k - 最終的にONにしたい数
 * @param s - 初期状態文字列（'0'/'1' のみ）
 * @returns 'Yes' または 'No'
 */
function canMakeKOn(n: number, k: number, s: string): string {
    let count1 = 0;

    // ON の数をカウント
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '1') count1++;
    }

    const diff = Math.abs(count1 - k);
    return diff % 2 === 0 ? 'Yes' : 'No';
}

// 標準入力読み取り（AtCoder向け）
const input = fs.readFileSync(0, 'utf8').trim().split('\n');
const [nStr, kStr] = input[0].split(' ');
const n = parseInt(nStr);
const k = parseInt(kStr);
const s = input[1];

// 出力
console.log(canMakeKOn(n, k, s));
```

---

## 🔍 各処理の詳細と図解

---

### ① 入力読み取り部分

```ts
const input = fs.readFileSync(0, 'utf8').trim().split('\n');
const [nStr, kStr] = input[0].split(' ');
const n = parseInt(nStr);
const k = parseInt(kStr);
const s = input[1];
```

#### 🧩 入力例

```
input = [
  "7 3",       // 電球数 7個, ONにしたい数 3個
  "1010111"    // 初期状態 S
]
```

#### 📘 解釈

```
      文字列       |  説明
------------------|-----------------------
input[0] = "7 3"  | 電球の数と目標ON個数
input[1] = "1010111" | 初期状態文字列
```

#### ✅ 変数変換

```
n = 7
k = 3
s = "1010111"
```

---

### ② ON の数（'1'）を数える部分

```ts
let count1 = 0;

for (let i = 0; i < s.length; i++) {
    if (s[i] === '1') count1++;
}
```

#### 🔍 ループ処理の図：

```
S = 1 0 1 0 1 1 1
      ↑ ↑ ↑ ↑ ↑      → '1' は 5個
```

#### 📘 結果

```
count1 = 5
```

---

### ③ 達成可能性の判定

```ts
const diff = Math.abs(count1 - k);
return diff % 2 === 0 ? 'Yes' : 'No';
```

#### 📘 解釈：

```
count1 = 5
k = 3

diff = |5 - 3| = 2
```

```
diff % 2 = 0 → ✅ 達成可能
```

#### 🎯 図：操作の例

```
初期状態   ： 1 0 1 0 1 1 1  → ON = 5
操作1： (index 0, 5) を反転 → 0 0 1 0 1 0 1 → ON = 3 ✅
```

---

### ④ 出力

```ts
console.log(canMakeKOn(n, k, s));
```

結果：

```
Yes
```

---

## 📈 計算量分析

| 処理               | 計算量   | メモリ量          |
| ------------------ | -------- | ----------------- |
| 入力読み込み       | O(N)     | O(N)              |
| '1' のカウント処理 | O(N)     | O(1)              |
| 差の計算と出力     | O(1)     | O(1)              |
| **全体合計**       | **O(N)** | **O(N)**（Sのみ） |

---

## ✅ まとめ図

```
入力:
  "7 3"
  "1010111"

処理の流れ:

┌────────────┐
│ read input │
└────┬───────┘
     ↓
┌───────────────┐
│ count '1' in s│ → count1 = 5
└────┬──────────┘
     ↓
┌──────────────────────────────┐
│ diff = abs(count1 - k) = 2   │
│ diff % 2 === 0 → Yes         │
└──────────────────────────────┘
     ↓
  print("Yes")
```

---

## ✅ 補足：文字列を `reduce` で書くことも可能

```ts
const count1 = [...s].reduce((acc, c) => acc + (c === '1' ? 1 : 0), 0);
```

が、ループの方が低レベル・高速でメモリ効率もよいため競技ではベターです。

---

ご希望があれば：

- 操作の復元例
- ユーザー入力を試すCLIモード
- 複数ケース対応
  も追加可能です。

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                                     | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-07-27 13:17:59                                                                           | [B36 - Switching Lights](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_di) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055&page=2)   | 1000                                                                                    | 800 Byte                                                                                  |      | 11 ms                                                                                        | 9256 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67986125) |
| 2025-07-27 18:37:34                                                                           | [B36 - Switching Lights](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_di) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 1089 Byte                                                                                 |      | 18 ms                                                                                        | 21944 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67992653) |
| 2025-07-27 18:29:49                                                                           | [B36 - Switching Lights](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_di) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 960 Byte                                                                                  |      | 74 ms                                                                                        | 46788 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67992463) |
| 2025-07-27 13:29:31                                                                           | [B36 - Switching Lights](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_di) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 959 Byte                                                                                  |      | 52 ms                                                                                        | 47112 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67986309) |
