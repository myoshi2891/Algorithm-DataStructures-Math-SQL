ビット全探索（bit全探索）は、**ビット（0/1）の組み合わせをすべて列挙して調べる方法**です。特に状態数が少ない（例：10個程度のスイッチやランプ）場合に有効で、**各状態を整数で管理し、ビット演算で高速に操作**できます。

---

## 🎯 目的

ランプ N 個の **ON/OFF 状態の全パターン（2ⁿ通り）を試す**。

例えば N = 4 のとき、状態は次のように **ビット列（0,1）** で表せます：

| 状態番号 | ランプ状態（ビット列） | 意味                |
| -------- | ---------------------- | ------------------- |
| 0        | 0000                   | 全部OFF             |
| 1        | 0001                   | 1番だけON           |
| 2        | 0010                   | 2番だけON           |
| 3        | 0011                   | 1番2番ON            |
| ...      | ...                    | ...                 |
| 15       | 1111                   | 全部ON ✅ゴール状態 |

---

## 🧠 なぜビットを使うの？

- 状態管理が **1つの整数で完結**する。
- 反転操作も `XOR` ですぐできる（後述）。
- 状態遷移も `O(1)` でできるため、探索が速い。

---

## 🔧 操作の表現（反転操作）

操作は「特定の3つのランプを反転（ON↔OFF）」というもの。これを **ビットマスク**として表現できます。

### 例：N = 4、操作 = ランプ1, 2, 3を反転（1-indexed）

| ランプ | 4   | 3   | 2   | 1   |
| ------ | --- | --- | --- | --- |
| 操作   | 0   | 1   | 1   | 1   |

→ **ビットマスク = 0111 (2進数) = 7 (10進数)**

### 状態に操作を適用

```txt
状態 S = 0110 （ランプ2,3 ON）
操作M = 0111 （ランプ1,2,3 反転）

S ⊕ M = 0001 → ランプ1だけON
```

✅ `XOR（^）` は **対応ビットが異なると1、同じなら0**

| ビットS | 0   | 1   | 1   | 0   |
| ------- | --- | --- | --- | --- |
| ビットM | 0   | 1   | 1   | 1   |
| XOR     | 0   | 0   | 0   | 1   |

---

## 🔍 全状態をBFSで探索

### 状態遷移グラフのイメージ（N=3, 操作1つ）

```
ノード = 状態（000〜111）
エッジ = 操作（3つのランプ反転）

例）操作: ランプ1,2,3反転 = マスク111（7）

0 (000) --[op]--> 7 (111)
7 (111) --[op]--> 0 (000)  ←反転の再適用で戻る
```

---

## 🧭 図で全体像まとめ（N=3の例）

```
状態番号（10進）   ビット列（ランプ状態）
       0                 000
      / \               /   \
  op1/   \op2        op1     op2
    ↓     ↓            ↓       ↓
     7   → ？        111     ？← 他の操作による遷移

（操作を通じて111へ到達できるか探索）
```

---

## ✅ まとめ：ビット全探索の強み

| 特徴                     | メリット                     |                      |
| ------------------------ | ---------------------------- | -------------------- |
| 状態 = 整数              | メモリ節約・比較が速い       |                      |
| ビット演算 (`^`, `&`, \` | \`)                          | 状態変更・反転が高速 |
| 状態数が小さい場合       | 全探索でも実用的（N≤20程度） |                      |

---

## 📌 応用が効く典型問題

- ランプ、スイッチ、ドアの開閉
- 集合（部分集合）の列挙
- 制約付きのビット操作問題（e.g. DP with bitmask）

---

## ✅ 入力例（N = 5, M = 3）

```
5 3
0 1 0 1 0
1 2 3
2 4 5
1 3 5
```

- ランプ初期状態: `[0, 1, 0, 1, 0]`
- 操作1: ランプ1,2,3 を同時に反転
- 操作2: ランプ2,4,5 を同時に反転
- 操作3: ランプ1,3,5 を同時に反転

---

## 📘 1. 初期状態をビットで表現

```ts
let startState = 0;
for (let i = 0; i < N; i++) {
    if (A[i] === 1) startState |= 1 << i;
}
```

### 🎯 処理の意味：

- 各ランプを **0/1** で表し、右から左（最下位ビットから）に順に配置。
- `1 << i` は「i番目のランプのビット位置に `1` を立てる」。
- `|=` はビットOR。状態を積み重ねる。

### 🧮 図：初期状態の構築

\| ランプ番号（1-indexed） | ランプ状態 A\[i] | ビット位置 | `startState |= (1 << i)` | 状態（二進） |
\|--------------------------|------------------|-------------|--------------------------|----------------|
\| 1 | 0 | 0 | × | 00000 |
\| 2 | 1 | 1 | `startState |= 0010` | 00010 |
\| 3 | 0 | 2 | × | 00010 |
\| 4 | 1 | 3 | `startState |= 1000` | 10010 |
\| 5 | 0 | 4 | × | 10010 |

🔚 結果 → `startState = 0b10010 = 18`

---

## 📘 2. 目標状態（すべてON）

```ts
const goalState = (1 << N) - 1;
```

- `1 << 5 = 0b100000 = 32`
- `32 - 1 = 31 = 0b11111`

🎯 意味：すべてのビットが1（ON）になっている状態を整数で表現。

---

## 📘 3. 操作をビットマスクで表現

```ts
const ops: number[] = [];
for (let i = 0; i < M; i++) {
    const [x, y, z] = lines[2 + i].split(' ').map((n) => parseInt(n, 10) - 1); // 0-indexed
    const mask = (1 << x) | (1 << y) | (1 << z);
    ops.push(mask);
}
```

### 🎯 処理の意味：

- 各操作は「特定の3つのランプを反転」→ それらのビットを立てたマスク。
- XOR (`^`) に使う。

### 🧮 図：操作マスク一覧（0-indexed）

| 操作番号 | 対象ランプ | x, y, z (0-indexed) | ビットマスク | 2進表示 |
| -------- | ---------- | ------------------- | ------------ | ------- |
| 1        | 1,2,3      | 0,1,2               | 0b000111     | 0x07    |
| 2        | 2,4,5      | 1,3,4               | 0b11010      | 0x1A    |
| 3        | 1,3,5      | 0,2,4               | 0b10101      | 0x15    |

---

## 📘 4. BFS探索準備

```ts
const visited = new Array(1 << N).fill(false);
const queue: [number, number][] = [[startState, 0]];
visited[startState] = true;
```

- 状態数は `2^N = 32` なので、`visited[0..31]` の配列を作成。
- `queue` は `[現在の状態, かかった操作回数]`

---

## 📘 5. BFS本体：状態遷移

```ts
while (queue.length > 0) {
    const [state, steps] = queue.shift()!;

    if (state === goalState) {
        console.log(steps);
        return;
    }

    for (const op of ops) {
        const nextState = state ^ op;
        if (!visited[nextState]) {
            visited[nextState] = true;
            queue.push([nextState, steps + 1]);
        }
    }
}
```

### 🎯 ポイント解説：

- `state ^ op`：3つのランプを同時に反転する操作
- `visited[nextState]`：同じ状態を重複して探索しないためのチェック
- `queue.push([nextState, steps + 1])`：次の状態とステップ数を記録

---

## 🧭 状態遷移のイメージ図（start = 10010）

```
Start: 10010 (18)
  ├─ [op1: 000111] → 10010 ^ 000111 = 10101 (21)
  ├─ [op2: 11010] → 10010 ^ 11010 = 01000 (8)
  ├─ [op3: 10101] → 10010 ^ 10101 = 00111 (7)
           ↓
     （さらに各状態から次の操作を適用）
```

状態が `0b11111`（=31）に到達すれば終了。

---

## ✅ まとめ

| ステップ | 内容                                     | 結果（状態）                  |
| -------- | ---------------------------------------- | ----------------------------- |
| 初期化   | startState 構築                          | 10010（18）                   |
| 目標     | goalState                                | 11111（31）                   |
| 操作変換 | 各opをビットマスク化                     | op1=7, op2=26, op3=21         |
| BFS探索  | 状態をキューで管理しながら反転操作を適用 | 最短ステップで `11111` に到達 |

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                             | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果   | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-06-24 11:55:00                                                                           | [A70 - Lanterns](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_br) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 1200 Byte                                                                                 | **AC** | 15 ms                                                                                        | 21740 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67034069) |
| 2025-06-24 11:52:38                                                                           | [A70 - Lanterns](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_br) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1454 Byte                                                                                 | **AC** | 1 ms                                                                                         | 1652 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67034038) |
| 2025-06-24 11:48:46                                                                           | [A70 - Lanterns](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_br) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 1350 Byte                                                                                 | **AC** | 12 ms                                                                                        | 9420 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67033984) |
| 2025-06-24 11:25:59                                                                           | [A70 - Lanterns](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_br) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 1535 Byte                                                                                 | **AC** | 40 ms                                                                                        | 44496 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67033636) |
| 2025-06-24 11:16:40                                                                           | [A70 - Lanterns](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_br) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 1411 Byte                                                                                 | **AC** | 42 ms                                                                                        | 44324 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67033513) |
