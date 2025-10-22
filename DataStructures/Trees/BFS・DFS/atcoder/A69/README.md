---

## 🔢 入力例（N=4）

```
4
##..
.#..
..#.
...#
```

### 意味：

* 生徒1（0-indexedで0）は席1,2を希望
* 生徒2は席2のみを希望
* 生徒3は席3のみを希望
* 生徒4は席4のみを希望

---

## 🎯 目標

最大何人の希望をかなえられるか（＝最大マッチング数）

---

## 🧠 ステップ解説

### ステップ1：グラフ構築（隣接リスト）

```ts
adj = [
    [0, 1], // 生徒0が希望する席
    [1], // 生徒1
    [2], // 生徒2
    [3], // 生徒3
];
```

---

## 🚀 ステップ2：マッチング処理の流れ

### 初期状態

```
matchTo = [-1, -1, -1, -1] // 各席は未割り当て
```

---

### 👣 DFSで生徒0（席0,1希望）を試す

- visited: `[false, false, false, false]`
- 生徒0→席0 → 空いてる → マッチング成功！

```
matchTo = [0, -1, -1, -1]
```

---

### 👣 DFSで生徒1（席1希望）を試す

- visited: `[false, false, false, false]`
- 生徒1→席1 → 空いてる → マッチング成功！

```
matchTo = [0, 1, -1, -1]
```

---

### 👣 DFSで生徒2（席2希望）を試す

- visited: `[false, false, false, false]`
- 生徒2→席2 → 空いてる → マッチング成功！

```
matchTo = [0, 1, 2, -1]
```

---

### 👣 DFSで生徒3（席3希望）を試す

- visited: `[false, false, false, false]`
- 生徒3→席3 → 空いてる → マッチング成功！

```
matchTo = [0, 1, 2, 3]
```

---

## ✅ 最終結果

すべての生徒が希望の席に座れた！

- マッチング数 `= 4`
- 出力：

```
4
```

---

## 🔍 DFSの処理図（生徒0～3）

```
生徒0 ──> 席0 ✔
生徒1 ──> 席1 ✔
生徒2 ──> 席2 ✔
生徒3 ──> 席3 ✔
```

---

## ⛓ DFSの「入れ替え処理」について補足

今回は不要でしたが、もし以下のような状況だった場合：

- 生徒0 → 席0,1希望
- 生徒1 → 席0希望
- 先に生徒0→席0 がマッチ → 生徒1は DFS で「席0は埋まっているが、生徒0を他の席（席1）に動かせるか？」を再帰的に探す

このように、**すでに埋まっている席の生徒をDFSで再配置する**のが**DFSによる最大マッチングの核心**です。

---

## ✅ 複雑な入力例

```
6
#.#...
.#.#..
..#.#.
...#.#
....##
......
```

### 💡 内容（6人の生徒、6個の席）

各 `#` は「その生徒がその席を希望している」ことを意味します。

---

## 📊 入力のマトリクス構造

```
     席 →   0   1   2   3   4   5
生徒 ↓
0         #   .   #   .   .   .
1         .   #   .   #   .   .
2         .   .   #   .   #   .
3         .   .   .   #   .   #
4         .   .   .   .   #   #
5         .   .   .   .   .   .
```

---

## 🧠 グラフ構築：隣接リスト

```ts
adj = [
    [0, 2], // 生徒0
    [1, 3], // 生徒1
    [2, 4], // 生徒2
    [3, 5], // 生徒3
    [4, 5], // 生徒4
    [], // 生徒5（希望なし）
];
```

---

## 🧩 matchTo の初期状態

```
matchTo = [-1, -1, -1, -1, -1, -1]
```

---

## 🔄 各生徒に対するDFSとマッチングの推移

---

### 👣 生徒0 → 席0 or 席2

- `visited = [false, false, false, false, false, false]`
- 席0空いてる → マッチ成功！

```
matchTo = [0, -1, -1, -1, -1, -1]
```

---

### 👣 生徒1 → 席1 or 席3

- 席1空いてる → マッチ成功！

```
matchTo = [0, 1, -1, -1, -1, -1]
```

---

### 👣 生徒2 → 席2 or 席4

- 席2空いてる → マッチ成功！

```
matchTo = [0, 1, 2, -1, -1, -1]
```

---

### 👣 生徒3 → 席3 or 席5

- 席3空いてる → マッチ成功！

```
matchTo = [0, 1, 2, 3, -1, -1]
```

---

### 👣 生徒4 → 席4 or 席5

- 席4空いてる → マッチ成功！

```
matchTo = [0, 1, 2, 3, 4, -1]
```

---

### 👣 生徒5 → 希望なし

→ スキップ

---

## ✅ 最終結果

```
matchTo = [0, 1, 2, 3, 4, -1]
→ 5人が希望の席に座れた
```

---

## 🧭 全体処理図（DFSの進行とマッチ）

```
生徒0 → 席0 ✔
生徒1 → 席1 ✔
生徒2 → 席2 ✔
生徒3 → 席3 ✔
生徒4 → 席4 ✔
生徒5 → 希望なし ✘
```

---

## 🧠 DFSで「再割り当て」が必要なパターン（今回は不要）

例えば、もし生徒4が「席4,5」を希望し、**席4が既に生徒2に割り当て済み**だったら？

- 生徒4→席4（埋まっている）→席4の持ち主（生徒2）にDFSを再帰して「席2に動けるか？」を調べる
- 生徒2→席2に移動できたら → 生徒4→席4 も可能に！

これが「増加パス（augmenting path）」による割り当ての再編成です。

---

## ✅ 出力

```
5
```

---

## ✅ 可視化図（グラフ）

```plaintext
  生徒        席
   0 ─────▶ 0
   0 ─────▶ 2
   1 ─────▶ 1
   1 ─────▶ 3
   2 ─────▶ 2
   2 ─────▶ 4
   3 ─────▶ 3
   3 ─────▶ 5
   4 ─────▶ 4
   4 ─────▶ 5
```

---

## ✅ TypeScriptコード（再掲）

```ts
import * as fs from 'fs';

const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const N = Number(input[0]);
const C = input.slice(1);

const adj: number[][] = Array.from({ length: N }, () => []);
for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
        if (C[i][j] === '#') adj[i].push(j);
    }
}

const matchTo: number[] = Array(N).fill(-1);
const visited: boolean[] = Array(N).fill(false);

function dfs(u: number): boolean {
    for (const v of adj[u]) {
        if (visited[v]) continue;
        visited[v] = true;
        if (matchTo[v] === -1 || dfs(matchTo[v])) {
            matchTo[v] = u;
            return true;
        }
    }
    return false;
}

let result = 0;
for (let i = 0; i < N; i++) {
    visited.fill(false);
    if (dfs(i)) result++;
}

console.log(result);
```

---

Goのコンパイルエラーは非常に明確で、「**`imported and not used`（使っていないimportがあります）**」というエラーです。

---

## 🧨 エラー内容（再掲）

```
./main.go:7:2: "strings" imported and not used
```

これは Go の仕様で、**import したパッケージを使わない場合はコンパイルエラーになります**。

---

## ✅ 修正方法

不要な `strings` パッケージを削除してください。

---

## ✅ 解説

- `import "strings"` はこのコードでは使っていないため、削除することでエラーが解消されます。
- Go は「使っていない import は無効」と判断するため、自動的に削除しない限り手動で直す必要があります。

---

## ✅ アドバイス

- 将来このようなミスを避けるために、Go公式ツールで整形しておくと便利です：

```bash
go fmt main.go
```

また、`gopls` や `gofmt` 対応のエディタ（VSCodeなど）を使うと自動で消してくれます。

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                                       | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果   | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-06-23 13:06:29                                                                           | [A69 - Bipartite Matching](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bq) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1018 Byte                                                                                 | **AC** | 2 ms                                                                                         | 2460 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67017579) |
| 2025-06-23 13:03:52                                                                           | [A69 - Bipartite Matching](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bq) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 975 Byte                                                                                  | **AC** | 17 ms                                                                                        | 22304 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67017528) |
| 2025-06-23 12:57:36                                                                           | [A69 - Bipartite Matching](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bq) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 964 Byte                                                                                  | **AC** | 20 ms                                                                                        | 9196 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67017433) |
| 2025-06-23 12:53:58                                                                           | [A69 - Bipartite Matching](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bq) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 852 Byte                                                                                  | **AC** | 49 ms                                                                                        | 48660 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67017380) |
| 2025-06-23 12:45:43                                                                           | [A69 - Bipartite Matching](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bq) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 1212 Byte                                                                                 | **AC** | 73 ms                                                                                        | 48740 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67017289) |
| 2025-06-23 12:42:11                                                                           | [A69 - Bipartite Matching](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bq) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 865 Byte                                                                                  | **AC** | 82 ms                                                                                        | 48648 KiB                                                                                    |                                                                       |
