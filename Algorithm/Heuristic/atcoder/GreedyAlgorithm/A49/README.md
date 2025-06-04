この問題においては：

* 配列 `X` は **固定長20** の整数配列（`Int32Array` などでも良い）
* 操作は **100回固定**（定数T）
* 各ステップで一時的な値の変更しかしておらず、**大規模なデータ構造は使っていない**

そのため、\*\*現状でもメモリ消費は非常に小さい（数KB以下）\*\*ですが、もしさらにメモリ効率を高めたい場合、以下の最適化案があります：

---

### ✅ 改善案1：一時コピーを使わず、差分だけ比較する（より軽量）

現在は `X[p]++` などしてから元に戻していますが、これは不要な変更＆復元操作が入ります。以下のように差分だけでスコアを予測できます：

```js
function simulateScore(X, p, q, r, delta) {
    let score = 0;
    for (let i = 0; i < 20; i++) {
        let val = X[i];
        if (i === p || i === q || i === r) val += delta;
        if (val === 0) score++;
    }
    return score;
}
```

この関数で `delta = 1` と `delta = -1` の両方を比較し、より高い方を選べば復元処理不要です。

---

### ✅ 改善案2：TypedArrayの使用（`Int8Array`）

JavaScript の通常の配列は動的でオーバーヘッドがありますが、`Int8Array` を使えばより省メモリで扱えます：

```js
const X = new Int8Array(20); // 各要素は -128〜127 の整数
```

この配列は固定長・軽量な整数バッファなので、少しメモリが節約されます。

---

### ✅ 改善案3：スコアの増減を差分で管理（再計算しない）

毎回 `X.filter(v => v === 0).length` を使ってスコアを計算するのは、20要素とはいえ無駄です。**0の個数を逐次的に管理する**と効率的です。

```js
let zeroCount = 20;

function apply(X, p, q, r, delta) {
    for (const i of [p, q, r]) {
        if (X[i] === 0) zeroCount--;
        X[i] += delta;
        if (X[i] === 0) zeroCount++;
    }
}
```

---

### ✅ 最小構成まとめ（超省メモリ・効率的）

```js
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = [];

rl.on("line", line => input.push(line.trim())).on("close", () => {
    const T = parseInt(input[0]);
    const ops = input.slice(1).map(l => l.split(" ").map(x => x - 1));
    const X = new Int8Array(20);
    let zeroCount = 20;
    const res = [];

    for (let i = 0; i < T; i++) {
        const [p, q, r] = ops[i];

        let gainA = 0, gainB = 0;
        for (const idx of [p, q, r]) {
            if (X[idx] === 0) gainA--;
            if (X[idx] + 1 === 0) gainA++;
            if (X[idx] === 0) gainB--;
            if (X[idx] - 1 === 0) gainB++;
        }

        if (zeroCount + gainA >= zeroCount + gainB) {
            res.push("A");
            for (const i of [p, q, r]) {
                if (X[i] === 0) zeroCount--;
                X[i]++;
                if (X[i] === 0) zeroCount++;
            }
        } else {
            res.push("B");
            for (const i of [p, q, r]) {
                if (X[i] === 0) zeroCount--;
                X[i]--;
                if (X[i] === 0) zeroCount++;
            }
        }
    }

    console.log(res.join("\n"));
});
```

---

### 🚀 結論

* 元の実装でもメモリ使用量はごくわずか
* ただし上記のように：

  * `TypedArray` 使用
  * `zeroCount` 差分管理
  * シミュレーションの復元削減
* によって **省メモリかつ高速化**が可能です。

TypeScript実装における各処理の仕組みを、**図解とともに順を追って**解説。対象コード👇（省略あり）：

```ts
const X = new Int8Array(20);
let zeroCount = 20;

for (let i = 0; i < T; i++) {
  const [p, q, r] = ops[i];
  const indices = [p, q, r];

  let gainA = 0;
  let gainB = 0;

  for (const idx of indices) {
    if (X[idx] === 0) gainA--;
    if (X[idx] + 1 === 0) gainA++;
    if (X[idx] === 0) gainB--;
    if (X[idx] - 1 === 0) gainB++;
  }

  if (zeroCount + gainA >= zeroCount + gainB) {
    result.push("A");
    for (const idx of indices) {
      if (X[idx] === 0) zeroCount--;
      X[idx]++;
      if (X[idx] === 0) zeroCount++;
    }
  } else {
    result.push("B");
    for (const idx of indices) {
      if (X[idx] === 0) zeroCount--;
      X[idx]--;
      if (X[idx] === 0) zeroCount++;
    }
  }
}
```

---

## 🎯 全体構造イメージ

```
   入力           ↓                ↓              ↓
(P, Q, R) →  操作A or B →  配列X更新 →  スコア増減管理（zeroCount）
```

---

## 🔢 Step 1: 配列の初期化

```
X = new Int8Array(20)
```

### 🔍 図：

```
インデックス:  0   1   2   3   4   ...  19
         X = [0,  0,  0,  0,  0,  ..., 0]   ← 初期状態
```

* 配列 `X` は長さ20。最初は全要素0。
* `zeroCount = 20` として、0の数を数えて保持。

---

## ⚙️ Step 2: 操作の評価

操作（例：操作1 → P=2, Q=5, R=10）に対して、操作A（+1）と操作B（-1）のどちらが有利かを比較します。

### 🔍 図：

```
対象インデックス → 2, 5, 10

A操作シミュレーション:
  X[2] = 0 → 1 （0 → 非0） ⇒ zeroCount -= 1
  X[5] = 0 → 1 ⇒ zeroCount -= 1
  X[10] = 0 → 1 ⇒ zeroCount -= 1
  ⇒ gainA = -3

B操作シミュレーション:
  X[2] = 0 → -1 ⇒ zeroCount -= 1
  X[5] = 0 → -1 ⇒ zeroCount -= 1
  X[10] = 0 → -1 ⇒ zeroCount -= 1
  ⇒ gainB = -3

結果：gainA = gainB → 操作Aを選択（規定によってA優先）
```

※ 実際の配列 `X` を変更せず、「この操作をしたら 0 の数がいくつ増減するか」だけを見ています。

---

## 🔁 Step 3: 実際の配列Xと zeroCount を更新

選んだ操作（AまたはB）に基づいて `X` を変更し、`zeroCount` も差分で更新します。

### 🔍 図（例：操作Aが選ばれた場合）

```
Before:
X[2] = 0, X[5] = 0, X[10] = 0
zeroCount = 20

After:
X[2] = 1, X[5] = 1, X[10] = 1
zeroCount = 17
```

更新の流れ：

```ts
for (const idx of [2, 5, 10]) {
  if (X[idx] === 0) zeroCount--; // 0→非0なら減る
  X[idx]++;                      // 実際に値更新
  if (X[idx] === 0) zeroCount++; // 非0→0なら増える
}
```

---

## 📈 スコアの考え方

スコアは「各手順の終了後に `X[j] === 0` である要素の個数」で加算されます。つまり：

* `zeroCount` をその都度正しく保てばスコアを即座に計算可能
* 逆に `X` 全体を `.filter(x => x === 0).length` のように全走査すると遅い・非効率

---

## 💡 補足：なぜ差分だけでOK？

操作が毎回 **3つの要素のみ変更**されるので、

* 変更対象外の 17要素は影響なし
* 差分を3箇所だけチェック・更新すれば `X` 全体を走査せずに済む

この仕組みが、**高速＆省メモリのポイント**です。

---

## 📌 まとめ図（全体の流れ）

```
┌────────────┐
│入力 (P,Q,R)│
└────┬───────┘
     ▼
┌────────────────────────┐
│操作A/Bのスコア変化を計算（差分3点）│
└────┬──────────────────┘
     ▼
┌───────────────┐
│大きい方の操作を実施       │
│(同点ならA優先)            │
└────┬────────────┘
     ▼
┌───────────────────┐
│配列Xを更新＆zeroCount調整│
└────┬────────────────┘
     ▼
┌────────────┐
│スコアに zeroCount を加算│
└────────────┘
```

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-06-04 12:12:04 | [A49 - Heuristic 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_aw) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 37454 | 1445 Byte | **AC** | 17 ms | 21704 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66438508) |
| 2025-06-04 12:10:10 | [A49 - Heuristic 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_aw) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 37454 | 1540 Byte | **AC** | 1 ms | 1628 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66438489) |
| 2025-06-04 12:08:30 | [A49 - Heuristic 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_aw) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 37454 | 1168 Byte | **AC** | 11 ms | 9080 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66438466) |
| 2025-06-04 11:57:05 | [A49 - Heuristic 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_aw) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 37454 | 1586 Byte | **AC** | 43 ms | 43396 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66438327) |
| 2025-06-04 11:53:07 | [A49 - Heuristic 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_aw) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 37454 | 1282 Byte | **AC** | 41 ms | 43216 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66438265) |
| 2025-06-04 11:51:12 | [A49 - Heuristic 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_aw) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 37454 | 1225 Byte | **AC** | 45 ms | 43156 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66438240) |