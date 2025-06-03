
---

## 🔷 全体構成と概要

```plaintext
1. 入力の読み込み
2. 距離計算関数の定義
3. 貪欲法（最近傍法）で初期経路作成
4. 2-opt 法で経路を改善
5. 出力（都市番号を 1-indexed で表示）
```

---

## 🔸 1. 入力の読み込み

```javascript
const fs = require('fs');

function readInput() {
  const input = fs.readFileSync(0, 'utf8').trim().split('\n');
  const N = parseInt(input[0], 10);
  const cities = input.slice(1).map(line => {
    const [x, y] = line.split(' ').map(Number);
    return { x, y };
  });
  return { N, cities };
}
```

### ✅ 解説

* `fs.readFileSync(0, 'utf8')` は Node.js で標準入力（`/dev/stdin`）から全文を読み取る方法です。
* 最初の1行目は都市の数 `N`。
* 2行目以降は各都市の `(X, Y)` 座標。
* 各都市を `{ x, y }` のオブジェクトとして配列に格納します。

---

## 🔸 2. 距離計算

```javascript
function dist2(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}
```

### ✅ 解説

* ユークリッド距離の **平方距離** を返します（√を取らない）。
* **比較目的**では平方根は不要なので、パフォーマンス向上のためにそのまま使用。
* 実際の距離が必要な場合は `Math.sqrt(dist2(...))` で使います。

---

## 🔸 3. 貪欲法（最近傍法）

```javascript
function nearestNeighbor(N, cities) {
  const visited = Array(N).fill(false);
  const route = [0];
  visited[0] = true;

  for (let i = 1; i < N; i++) {
    const last = route[route.length - 1];
    let nearest = -1;
    let minDist = Infinity;

    for (let j = 0; j < N; j++) {
      if (!visited[j]) {
        const d = dist2(cities[last], cities[j]);
        if (d < minDist) {
          minDist = d;
          nearest = j;
        }
      }
    }
    visited[nearest] = true;
    route.push(nearest);
  }

  return route;
}
```

### ✅ 解説

* 都市0（＝都市1）からスタートし、まだ訪れていない中で最も近い都市を選んでいく。
* 訪問した都市は `visited` 配列で記録。
* 時間計算量は `O(N^2)`。

---

## 🔸 4. 経路の総距離を計算

```javascript
function totalDist(route, cities) {
  let dist = 0;
  for (let i = 0; i < route.length; i++) {
    const a = cities[route[i]];
    const b = cities[(i + 1) % route.length];
    dist += Math.sqrt(dist2(a, b));
  }
  return dist;
}
```

### ✅ 解説

* 総距離を `√(dx²+dy²)` で計算します。
* `i+1 % route.length` により **最後は最初に戻る距離**も含めます。

---

## 🔸 5. 2-opt 法による改善

```javascript
function twoOpt(route, cities) {
  const N = route.length;
  let improved = true;

  while (improved) {
    improved = false;
    for (let i = 1; i < N - 2; i++) {
      for (let j = i + 1; j < N - 1; j++) {
        const a = cities[route[i - 1]];
        const b = cities[route[i]];
        const c = cities[route[j]];
        const d = cities[route[j + 1]];

        const current = Math.sqrt(dist2(a, b)) + Math.sqrt(dist2(c, d));
        const swapped = Math.sqrt(dist2(a, c)) + Math.sqrt(dist2(b, d));

        if (swapped < current) {
          while (i < j) {
            [route[i], route[j]] = [route[j], route[i]];
            i++;
            j--;
          }
          improved = true;
        }
      }
    }
  }

  return route;
}
```

### ✅ 解説

* 2-opt とは：

  * 経路中の2辺 `(a-b, c-d)` を選び、`(a-c, b-d)` に置き換えて短縮する手法。
* 条件：交換後の距離が元より短ければ、`route[i..j]` を反転。
* すべての改善が完了するまで `while (improved)` を繰り返します。

---

## 🔸 6. 結果の出力

```javascript
function main() {
  const { N, cities } = readInput();

  let route = nearestNeighbor(N, cities);
  route = twoOpt(route, cities);

  for (let i = 0; i < N; i++) {
    console.log(route[i] + 1);
  }
  console.log(route[0] + 1);
}

main();
```

### ✅ 解説

* JavaScriptは 0-indexed ですが、出力は 1-indexed にする必要があるため `+1`。
* 最後に「出発点に戻る」ため、`route[0] + 1` を最後にもう一度出力。

---

## ✅ 補足情報

* **時間制限**内に収めるため：

  * 距離の平方根計算は必要最小限にする
  * 貪欲法＋2-opt は近似的でも非常に高速
* **解の最適性**を保証するものではありませんが、良好なスコアを期待できます

---

## 🔷 2-opt法とは？

**巡回セールスマン問題（TSP）**の解の改善（局所探索）でよく使われる**ヒューリスティック手法**です。

> 経路中の「2本の辺（経路）」を選んで、それらを**逆順に接続し直す**ことで、経路全体を短くする改善手法。

---

## 🔸 直感的な説明（図解イメージ）

現在の経路が以下のようになっているとします：

```
... A -- B ... C -- D ...
```

この場合、辺 `(A-B)` と `(C-D)` の2本を取り除いて、次のように接続し直します：

```
... A -- C (逆順) B -- D ...
```

これにより経路がクロスしていた場合（交差していた場合）などに、全体の距離が短くなる可能性があります。

---

## 🔸 手順まとめ

1. 経路内の任意の2点 `i, j`（ただし、`i+1 < j`）を選ぶ。
2. その間の部分経路 `route[i+1 .. j]` を**逆順**にする。
3. 新しい経路の距離が**元より短くなれば採用**する。
4. これを繰り返し、**これ以上改善できない**まで実行する。

---

## 🔸 JavaScriptの処理と対応

以下の処理が2-optの実体です：

```javascript
while (improved) {
  improved = false;
  for (let i = 1; i < N - 2; i++) {
    for (let j = i + 1; j < N - 1; j++) {
      const a = cities[route[i - 1]];
      const b = cities[route[i]];
      const c = cities[route[j]];
      const d = cities[route[j + 1]];

      const current = Math.sqrt(dist2(a, b)) + Math.sqrt(dist2(c, d));
      const swapped = Math.sqrt(dist2(a, c)) + Math.sqrt(dist2(b, d));

      if (swapped < current) {
        while (i < j) {
          [route[i], route[j]] = [route[j], route[i]];
          i++;
          j--;
        }
        improved = true;
      }
    }
  }
}
```

### ✅ ポイントごとの説明

| 処理                       | 説明                                 |
| ------------------------ | ---------------------------------- |
| `for i, j`               | 2つの辺 `(a-b)` と `(c-d)` を選ぶために2重ループ |
| `current`                | 現在の2辺 `(a-b)` ＋ `(c-d)` の合計距離      |
| `swapped`                | 新しい2辺 `(a-c)` ＋ `(b-d)` の距離        |
| `if (swapped < current)` | 距離が短くなるなら改善を採用                     |
| `while (i < j)`          | `route[i..j]` を逆順に反転               |

---

## 🔸 例（数値付き）

都市の順番：

```
... → 2 → 3 → ... → 7 → 8 → ...
```

ここで `(2-3)` と `(7-8)` を取り除き、次のように逆順接続：

```
... → 2 → 7 → 6 → 5 → 4 → 3 → 8 → ...
```

これにより、2つの交差していた経路がなくなり、距離が短縮されることがよくあります。

---

## 🔸 メリット・デメリット

| 項目     | 説明                      |
| ------ | ----------------------- |
| ✅ 簡単   | 実装が非常に簡単（ループと反転だけ）      |
| ✅ 高速   | 150都市程度なら数秒で収束          |
| ✅ 効果的  | クロスした経路を除去するだけでも大幅に改善可能 |
| ❌ 局所最適 | グローバル最適解にはならないことが多い     |

---

## 🔸 視覚化したい？

以下のような図で2-optの効果がよくわかります：

```
Before 2-opt:               After 2-opt:
    A        C                 A        C
     \      /                   \      /
      B----D     →               B    D
                                   \  /
                                    --
```

クロスしているのを、2-optで逆順につなぎ直すことで交差を除去＝距離短縮！

---

## ✅ まとめ

* 2-optはTSPの代表的な「近似解法」。
* 局所改善で経路を良くする。
* 「交差した経路」があるときに特に効果が大。
* 距離が確実に縮むような反転だけを行うので、安全で効果的。
* 計算時間も少なく、精度も高いのでTSPにおいて非常に実用的。

---

## 🔷 1. ユークリッド距離とは？

ユークリッド距離は、2点間の「直線距離」です。中学校で習う「三平方の定理（ピタゴラスの定理）」に基づいています。

2点 A(x₁, y₁)、B(x₂, y₂) の距離 D は次の式で求められます：

$$
D = \sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}
$$

---

## 🔶 2. ユークリッド距離の **2乗** とは？

単に √ を取らないバージョンのことです：

$$
D^2 = (x_1 - x_2)^2 + (y_1 - y_2)^2
$$

これは以下のようなときに使います：

* 比較だけが目的（どっちが近いか）なら **平方根を取らなくても同じ結果** になるため、計算を高速化できる。
* √ を取るのは遅いので、ゲームやTSPのような大量計算では **ユークリッド距離の2乗** が有利。

---

## 🖼️ 3. 図解

以下は 2点間の距離とその2乗を示す図です：

```plaintext
        y ↑
          |
      B * |             (x2, y2)
         /|
        / |
       /  |
      /   |
     /    | dy = y2 - y1
    /     |
A *-------+→ x
(x1, y1)   dx = x2 - x1
```

この図からわかるように：

* 横の距離（dx） = x₂ - x₁
* 縦の距離（dy） = y₂ - y₁
* 直線距離² = dx² + dy²

---

## 🧠 4. JavaScript実装

以下はユークリッド距離と2乗の比較関数です：

```javascript
function euclideanSquared(x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return dx * dx + dy * dy;
}

function euclideanDistance(x1, y1, x2, y2) {
  return Math.sqrt(euclideanSquared(x1, y1, x2, y2));
}

// 例：点 A(1,2), 点 B(4,6)
const d2 = euclideanSquared(1, 2, 4, 6);  // => 25
const d  = euclideanDistance(1, 2, 4, 6); // => 5

console.log("距離の2乗:", d2);
console.log("距離:", d);
```

---

## ✅ まとめ

| 指標   | 通常距離 `√(dx² + dy²)` | 距離の2乗 `dx² + dy²`    |
| ---- | ------------------- | -------------------- |
| 計算速度 | 遅い（平方根計算あり）         | 速い（加算と乗算のみ）          |
| 使用場面 | 正確な距離が必要なとき         | 比較や最適化のみ必要なとき（TSPなど） |

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-06-03 15:44:38 | [A46 - Heuristic 1](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_at) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 4832 | 2036 Byte | **AC** | 35 ms | 21980 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66420019) |
| 2025-06-03 15:40:01 | [A46 - Heuristic 1](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_at) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 4832 | 1845 Byte | **AC** | 1 ms | 1632 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66419856) |
| 2025-06-03 15:38:00 | [A46 - Heuristic 1](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_at) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 4672 | 1839 Byte | **AC** | 78 ms | 9248 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66419815) |
| 2025-06-03 15:35:32 | [A46 - Heuristic 1](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_at) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 4672 | 2316 Byte | **AC** | 60 ms | 49400 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66419742) |
| 2025-06-03 15:23:36 | [A46 - Heuristic 1](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_at) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 4751 | 2328 Byte | **AC** | 84 ms | 48760 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66419453) |