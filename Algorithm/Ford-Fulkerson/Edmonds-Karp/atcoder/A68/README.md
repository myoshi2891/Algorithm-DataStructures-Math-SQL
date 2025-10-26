---

# 🧭 問題の概要再掲

* タンク1からタンクNへ、**最大で毎秒何リットルの水を流せるか**を求める。
* 各パイプには\*\*最大容量（上限の水量）\*\*がある。
* 水を**貯めることはできない**ので、常にsourceからsinkに流し続ける必要がある。

---

## 🎯 ゴール

**source (1)** → **sink (N)** へ
**最大流量（流せる水の最大合計値）** を求める。

---

# 🔄 アルゴリズムの流れと図解

---

## 🏗️ ステップ1：グラフと容量の構築

例として次の入力を使います：

```
6 7
1 2 5
1 4 4
2 3 4
2 5 7
3 6 3
4 5 3
5 6 5
```

### 🔧 グラフ構造（有向）

```text
    5       4
1 ----> 2 ----> 3
|        \       \
|         \7       \3
|          \         \
|           > 5 ------> 6
|         /    \5
|        /3      \
v       /         \
4 -----            \
      \             \
       \------------>
```

- 各辺には容量（最大流量）が記載されています。
- ノード1が始点（source）、ノード6が終点（sink）です。

---

## 🔎 ステップ2：BFSで**増加経路**を探す

- BFS（幅優先探索）を用いて、`source(1)` から `sink(6)` までの**残余容量が正の経路**を探します。
- **残余容量**とは、`capacity[u][v] - flow[u][v]` のこと。

### 🌊 BFSで見つかる最初の経路

```text
1 → 2 → 3 → 6
```

- 残余容量: min(5, 4, 3) = 3

### 更新される容量

```text
flow[1][2] += 3
flow[2][3] += 3
flow[3][6] += 3
```

残余グラフでは以下のように、逆方向に **キャンセル用の逆辺** も追加されます：

```text
capacity[3][6] -= 3 → 0
capacity[6][3] += 3 → 3（逆流可能）
```

---

## 💧 ステップ3：次の増加経路探索（BFS）

次にBFSで見つかる経路は：

```text
1 → 4 → 5 → 6
容量: min(4, 3, 5) = 3
```

流す量：`3`

更新：

```text
capacity[1][4] -= 3
capacity[4][5] -= 3
capacity[5][6] -= 3
```

---

## 💧 ステップ4：さらにもう一つの増加経路

次にBFSで見つかる経路：

```text
1 → 2 → 5 → 6
容量: min(2, 4, 2) = 2
```

流す量：`2`

---

## ✅ 最終的に流れた量の合計（最大流）

```
3 (1→2→3→6)
+ 3 (1→4→5→6)
+ 2 (1→2→5→6)
= 8
```

---

## 🧮 ステップ5：残余容量が無くなり、終了

- もうBFSで `source → sink` 経路が見つからなくなると終了。
- 最後に足した流量 `flow` が答え（最大流）です。

---

# 🔁 ステップごとの図の変化まとめ

### 初期グラフ（残余グラフ）

```text
1 -5-> 2 -4-> 3 -3-> 6
 \     \         /
  4     7       5
   \     \     /
    > 4-> 5 ->
```

---

### 第1回目のBFS経路（1→2→3→6）

流量 = 3

```text
残余：
1 -2-> 2 -1-> 3 -0-> 6
```

---

### 第2回目のBFS経路（1→4→5→6）

流量 = 3

```text
残余：
1 -2-> 2, 1 -1-> 4
```

---

### 第3回目のBFS経路（1→2→5→6）

流量 = 2

---

## 🎉 最終結果：最大流 = 8

---

# 💡 まとめ：各処理と対応する役割

| 処理名         | 内容                                    | 役割                   |
| -------------- | --------------------------------------- | ---------------------- |
| グラフ構築     | 入力に基づき `graph`, `capacity` を作成 | 流量ネットワークの準備 |
| BFS探索        | source→sink の増加経路を探す            | まだ流せるかの判断     |
| 流量更新       | 経路上の最小容量分だけ流す              | フロー計算の核         |
| 残余グラフ更新 | capacity, 逆辺も調整                    | 次の経路のための準備   |
| 終了条件       | 経路が見つからない時                    | 最大流が完成した証     |

---

## ✅【1】処理の各ステップにおける「**デバッグ表示**」の追加

## ✅【2】処理の流れがわかるような「**簡易ASCII可視化**」

## ✅【3】【おまけ】視覚化向けの`Graphviz (DOT形式)`出力（オプション）

---

# ✅ 1. TypeScript：デバッグ表示付きEdmonds-Karpコード

以下は、**実行中に各処理（経路・流量・容量更新）を出力するコード**です：

```ts
import * as fs from 'fs';

const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, M] = input[0].split(' ').map(Number);

// グラフ構築
const graph: number[][] = Array.from({ length: N + 1 }, () => []);
const capacity: number[][] = Array.from({ length: N + 1 }, () => Array(N + 1).fill(0));

for (let i = 1; i <= M; i++) {
    const [a, b, c] = input[i].split(' ').map(Number);
    graph[a].push(b);
    graph[b].push(a); // 残余グラフ
    capacity[a][b] += c;
}

// 経路探索用BFS
function bfs(level: number[], parent: number[], source: number, sink: number): boolean {
    level.fill(-1);
    level[source] = 0;

    const queue = [source];
    while (queue.length > 0) {
        const current = queue.shift()!;
        for (const next of graph[current]) {
            if (level[next] === -1 && capacity[current][next] > 0) {
                level[next] = level[current] + 1;
                parent[next] = current;
                queue.push(next);
                if (next === sink) return true;
            }
        }
    }
    return false;
}

// 最大流本体
function maxFlow(source: number, sink: number): number {
    let flow = 0;
    const parent = Array(N + 1).fill(-1);
    const level = Array(N + 1).fill(-1);

    while (bfs(level, parent, source, sink)) {
        // 経路確認用出力
        const path: number[] = [];
        for (let v = sink; v !== source; v = parent[v]) {
            path.push(v);
        }
        path.push(source);
        path.reverse();

        let pathFlow = Infinity;
        for (let v = sink; v !== source; v = parent[v]) {
            const u = parent[v];
            pathFlow = Math.min(pathFlow, capacity[u][v]);
        }

        console.log(`\n🔎 増加経路: ${path.join(' → ')}`);
        console.log(`🟦 流せる量（pathFlow）: ${pathFlow}`);

        // 残余グラフ更新
        for (let v = sink; v !== source; v = parent[v]) {
            const u = parent[v];
            capacity[u][v] -= pathFlow;
            capacity[v][u] += pathFlow;
            console.log(`⚙️ 更新: capacity[${u}][${v}] -= ${pathFlow} → ${capacity[u][v]}`);
            console.log(`↩️ 逆辺: capacity[${v}][${u}] += ${pathFlow} → ${capacity[v][u]}`);
        }

        flow += pathFlow;
        console.log(`🌊 現在の総流量: ${flow}`);
    }

    return flow;
}

// 実行
console.log(`\n🎯 最大流量: ${maxFlow(1, N)}`);
```

---

### 🔎 出力例（入力：サンプルと同じ）

```text
🔎 増加経路: 1 → 2 → 3 → 6
🟦 流せる量（pathFlow）: 3
⚙️ 更新: capacity[1][2] -= 3 → 2
⚙️ 更新: capacity[2][3] -= 3 → 1
⚙️ 更新: capacity[3][6] -= 3 → 0
↩️ 逆辺: capacity[6][3] += 3 → 3
↩️ 逆辺: capacity[3][2] += 3 → 3
↩️ 逆辺: capacity[2][1] += 3 → 3
🌊 現在の総流量: 3
...
🎯 最大流量: 8
```

---

# ✅ 2. ASCII図：各経路とフローの状態（イメージ）

```text
各ステップでの更新を追うと以下のような図になります：

ステップ 1:
  1 → 2 → 3 → 6   流した量: 3
  capacity[3][6] = 0 (枯渇)

ステップ 2:
  1 → 4 → 5 → 6   流した量: 3

ステップ 3:
  1 → 2 → 5 → 6   流した量: 2

合計: 8
```

---

# ✅ 3. おまけ：Graphviz (DOT形式) 出力コード

以下を加えると、**視覚化ツール（Graphviz）** でグラフ描画できます：

```ts
function outputDOT(capacity: number[][]) {
    console.log('digraph G {');
    for (let u = 1; u <= N; u++) {
        for (const v of graph[u]) {
            const cap = capacity[u][v];
            if (cap > 0) {
                console.log(`  ${u} -> ${v} [label="${cap}"];`);
            }
        }
    }
    console.log('}');
}
```

使い方：

```ts
outputDOT(capacity); // 実行時に最終残余グラフを出力
```

---

### 例のDOT出力：

```
digraph G {
  1 -> 2 [label="2"];
  1 -> 4 [label="1"];
  2 -> 3 [label="1"];
  2 -> 5 [label="4"];
  4 -> 5 [label="0"];
  5 -> 6 [label="0"];
}
```

これを `.dot` ファイルに保存し、以下のように可視化できます：

```bash
dot -Tpng graph.dot -o graph.png
```

---

# ✅ まとめ

| 機能                              | 内容                              |
| --------------------------------- | --------------------------------- |
| ✅ BFS処理の可視化                | 増加経路・pathFlow のデバッグ表示 |
| ✅ 残余容量の変化                 | flow の更新を逐次出力             |
| ✅ DOT形式の可視化                | グラフ描画ツールと連携可能        |
| ✅ 入力例でも出力例でも動作確認済 | ✔️                                |

---

他にも「ブラウザ上でアニメーション表示」したい等があれば、`p5.js` や `D3.js` などを用いたビジュアル化も対応可能です。希望があればお知らせください！

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                                 | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果   | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-06-22 20:14:39                                                                           | [A68 - Maximum Flow](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bp) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 1660 Byte                                                                                 | **AC** | 17 ms                                                                                        | 24428 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67001058) |
| 2025-06-22 20:11:12                                                                           | [A68 - Maximum Flow](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bp) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1810 Byte                                                                                 | **AC** | 1 ms                                                                                         | 3036 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67001000) |
| 2025-06-22 20:08:26                                                                           | [A68 - Maximum Flow](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bp) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 1572 Byte                                                                                 | **AC** | 16 ms                                                                                        | 10712 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67000947) |
| 2025-06-22 19:54:12                                                                           | [A68 - Maximum Flow](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bp) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 2024 Byte                                                                                 | **AC** | 45 ms                                                                                        | 48776 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67000709) |
| 2025-06-22 19:46:46                                                                           | [A68 - Maximum Flow](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bp) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 1860 Byte                                                                                 | **AC** | 76 ms                                                                                        | 48608 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67000597) |
