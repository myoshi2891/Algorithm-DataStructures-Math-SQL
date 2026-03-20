# 🌳 Symmetric Tree — TypeScript 完全解説

---

## 1. 問題の分析

> 💡 **初学者向け補足**：この問題は一言で言うと、「**二分木が左右対称（鏡写し）になっているかを確認する問題**」です。木の中心を軸にして、左サブツリーと右サブツリーが完全に対称かどうかを調べます。

---

### 🖼️ まず「対称」とは何かを視覚的に理解する

```
【対称な木 ✅】             【非対称な木 ❌】

       1                          1
      / \                        / \
     2   2                      2   2
    / \ / \                      \   \
   3  4 4  3                      3   3

左サブツリーを                 右の2にleftがないので
鏡に映すと右サブツリーと        左右が一致しない
完全に一致する！
```

「鏡写し」の条件を分解すると：

1. 左の子の値 ＝ 右の子の値
2. 左の子の「左」 ↔ 右の子の「右」　が鏡写し
3. 左の子の「右」 ↔ 右の子の「左」　が鏡写し

---

### 競技プログラミング視点での分析

- **ノード数は最大1000**と小さいため、最悪計算量 O(n) で全ノードを1回ずつ訪問すれば十分
- 再帰・反復どちらもO(n)時間 / O(n)空間（スタック/キューのため）
- 早期終了（値が違えばすぐfalse返却）で定数倍の高速化が可能

### 業務開発視点での分析

- `TreeNode | null` という **Union型**（＝複数の型を `|` でつなげた型）を正しく扱うためのnullチェックが必須
- 再帰版は「意図が読みやすい」、反復版は「スタックオーバーフローに強い」というトレードオフがある
- LeetCodeのクラス定義をそのまま使うため、型の追加定義は最小限

### TypeScript特有の考慮点

- `TreeNode | null` に対するアクセス前に **型ガード**（＝実行時に型を絞り込むチェック）が必須
- `null` と `undefined` を厳密に区別する `strictNullChecks` が前提
- 再帰ヘルパー関数を内部に閉じ込めることで、外部APIをシンプルに保てる

> 📖 **このセクションで登場した用語**
>
> - **Union型**：`A | B` のように複数の型を`|`でつなげた型。「AまたはB」を表す
> - **型ガード**：`if (node !== null)` のように実行時に型を絞り込むチェック処理
> - **strictNullChecks**：`null`と`undefined`を他の型と混在させないようにするTypeScriptの設定

---

## 2. アルゴリズムアプローチ比較

> 💡 **初学者向け補足**：同じ問題でも解き方は複数あります。それぞれの「速さ（時間計算量）」と「メモリの使いやすさ（空間計算量）」を比べて最適なものを選びます。問題文のフォローアップが「再帰・反復の両方を実装せよ」なので、両方解説します。

| アプローチ                | 時間計算量 | 空間計算量 | TS実装コスト | 型安全性 | 可読性 | 備考                                     |
| ------------------------- | ---------- | ---------- | ------------ | -------- | ------ | ---------------------------------------- |
| **A: 再帰（DFS）**        | O(n)       | O(h)※      | 低           | 高       | 最高   | コードが「定義そのもの」に近く読みやすい |
| **B: 反復（BFS/キュー）** | O(n)       | O(w)※※     | 中           | 高       | 高     | スタックオーバーフローのリスクなし       |
| **C: 配列シリアライズ**   | O(n)       | O(n)       | 高           | 中       | 低     | 一度配列化して比較。実装コスト高でNG     |

> ※ **h = 木の高さ**。最悪ケース（一直線の木）でO(n)、平均的なバランス木でO(log n)
> ※※ **w = 木の最大幅**。最悪ケースでO(n)（最下段に全ノードが集中する場合）

---

> 💡 **Big-O記法の読み方**（初学者向け）
>
> - `O(n)`：ノード数nが2倍になると処理も約2倍（全ノードを1回ずつ訪問）
> - `O(h)`：木の「深さ」に比例したメモリ。再帰呼び出しがスタックに積まれる分

---

> 📖 **このセクションで登場した用語**
>
> - **DFS（深さ優先探索）**：根から葉へ向かって深く潜っていく探索方法。再帰と相性が良い
> - **BFS（幅優先探索）**：同じ深さのノードを左から右へ横断する探索方法。キューと相性が良い
> - **時間計算量**：入力の大きさに対して処理にかかる手間がどう増えるかの目安
> - **空間計算量**：処理中に使うメモリ量がどう増えるかの目安

---

## 3. 選択したアルゴリズムと理由

> 💡 **初学者向け補足**：「なぜこれを選んだか」を「他の方法のどこが惜しかったか」と対比して説明します。

- **選択したアプローチ**: **A（再帰）をメイン、B（反復）をフォローアップ** として両方実装
- **理由**：
    - **方法C（シリアライズ）は選ばない**：実装コストが高く、null位置のエンコードが複雑になるため
    - **方法A（再帰）を選ぶ**：「鏡写しの定義」がそのままコードになる直感的な構造。ノード数1000以下なのでスタックオーバーフローの心配なし（Nodeのデフォルトスタック深度は通常10,000以上）
    - **方法B（反復）もフォローアップで実装**：深さが極端に大きいケースへの対応として有用

- **TypeScript特有の最適化ポイント**：
    - `TreeNode | null` を受け取るヘルパーに **型ガード** を入れてnull安全性を担保
    - ヘルパー関数を `const` のアロー関数として内側に閉じることで、外部から呼び出せない設計にする（**クロージャ**＝関数が自分の外側の変数を「覚えている」仕組み）

> 📖 **このセクションで登場した用語**
>
> - **クロージャ**：関数が自分が定義されたスコープの変数を「閉じ込めて」使える仕組み
> - **スタックオーバーフロー**：再帰が深くなりすぎてプログラムがクラッシュする現象
> - **null安全性**：`null`や`undefined`へのアクセスによる予期しないクラッシュを防ぐ仕組み

---

## 4. 実装コード

> 💡 **初学者向け補足**：コード全体の骨格を先に示します。
>
> 1. `isSymmetric`：エントリーポイント（入口）。rootを受け取りヘルパーに渡す
> 2. `isMirror`（再帰版）：2つのノードが「鏡写し」かを再帰で確認する
> 3. `isSymmetricIterative`（反復版）：キューを使って対称ペアを順番に確認する

---

### ✅ 解法① 再帰（Recursive DFS）

```typescript
// Runtime 0 ms
// Beats 100.00%
// Memory 57.96 MB
// Beats 79.32%

function isSymmetric(root: TreeNode | null): boolean {
    // 木が空（nullの木）は定義上「対称」とする
    // （LeetCodeの制約では最低1ノードあるが、型上nullがあり得るため）
    if (root === null) return true;

    /**
     * 2つのノードが「鏡写し」の関係かどうかを再帰的に確認するヘルパー関数
     * ── なぜ内部関数にするか：外部から呼ばれる必要がなく、isSymmetricの
     *    ロジックに強く依存しているため、スコープを閉じ込める
     *
     * @param left  - 左側のノード（TreeNode または null）
     * @param right - 右側のノード（TreeNode または null）
     * @returns 鏡写しならtrue、そうでなければfalse
     * @complexity Time: O(n), Space: O(h) ─ h=木の高さ
     */
    const isMirror = (left: TreeNode | null, right: TreeNode | null): boolean => {
        // ─── ケース①：両方nullなら「空同士で対称」→ true
        // 例：葉ノードの子（存在しない位置）同士を比較した場合
        if (left === null && right === null) return true;

        // ─── ケース②：片方だけnullなら「片方だけ枝がある」→ 非対称でfalse
        // 例：左の子はあるのに右の子がない場合
        if (left === null || right === null) return false;

        // ─── ケース③：両方存在する場合は以下の3条件を全て満たすか確認
        return (
            left.val === right.val && // 条件1: 値が同じか？
            isMirror(left.left, right.right) && // 条件2: 左の「左子」と右の「右子」が鏡か？
            isMirror(left.right, right.left) // 条件3: 左の「右子」と右の「左子」が鏡か？
        );
        // ↑ &&（AND）で繋ぐことで、1つでも条件が外れたら即falseを返す（短絡評価）
    };

    // rootの左サブツリーと右サブツリーが鏡写しかをチェックする
    return isMirror(root.left, root.right);
}
```

---

> 💡 **再帰版のトレース** ─ Example 1: `[1,2,2,3,4,4,3]`

```
       1
      / \
     2   2
    / \ / \
   3  4 4  3

isSymmetric(root=1)
  └─ isMirror(left=2, right=2)
       ├─ 2.val === 2.val ✅
       ├─ isMirror(left=3, right=3)   ← 左の左子 vs 右の右子
       │    ├─ 3.val === 3.val ✅
       │    ├─ isMirror(null, null) → true ✅
       │    └─ isMirror(null, null) → true ✅
       │    → true ✅
       └─ isMirror(left=4, right=4)   ← 左の右子 vs 右の左子
            ├─ 4.val === 4.val ✅
            ├─ isMirror(null, null) → true ✅
            └─ isMirror(null, null) → true ✅
            → true ✅
  → true ✅ 最終結果: true
```

```
Example 2: [1,2,2,null,3,null,3]

       1
      / \
     2   2
      \   \
       3   3

isMirror(left=2, right=2)
  ├─ 2.val === 2.val ✅
  ├─ isMirror(null, 3)  ← 左の左子(null) vs 右の右子(3)
  │    → 片方がnull、もう片方が3 → false ❌ ← ここで即終了！
  → false ❌ 最終結果: false
```

---

### ✅ 解法② 反復（Iterative BFS with Queue）

> 💡 **なぜキューを使うのか**：「鏡対称ペア」を順番に取り出して比較するためです。キューはFIFO（先入れ先出し）なので、同じ深さのペアを順番に処理できます。

```typescript
function isSymmetricIterative(root: TreeNode | null): boolean {
    // 空の木は対称
    if (root === null) return true;

    // キュー（比較すべき「ノードのペア」を順番に格納する列）
    // ─ タプル型 [TreeNode|null, TreeNode|null] でペアを型安全に管理
    const queue: Array<[TreeNode | null, TreeNode | null]> = [];

    // 最初のペア：rootの左子と右子を比較対象として追加
    queue.push([root.left, root.right]);

    // 先頭インデックス（shift()のO(n)を避けるためのO(1)ポインタ）
    let head = 0;

    // キューが空になるまで（= 全ペアの比較が終わるまで）ループ
    while (head < queue.length) {
        // キューの先頭からペアを取り出す（分割代入で左・右に分ける）
        const [left, right] = queue[head];
        head++;
        // ↑ [head]で先頭要素をO(1)で読み取り、headを進める

        // ケース①：両方nullならこのペアはOK → 次のペアへ
        if (left === null && right === null) continue;

        // ケース②：片方だけnullか、値が異なる → 非対称確定でfalse
        if (left === null || right === null) return false;
        if (left.val !== right.val) return false;

        // ケース③：次に比較すべき「鏡ペア」をキューに追加
        // ─ 外側ペア：左の「左子」と右の「右子」
        queue.push([left.left, right.right]);
        // ─ 内側ペア：左の「右子」と右の「左子」
        queue.push([left.right, right.left]);
    }

    // 全ペアがOKだったので対称
    return true;
}
```

---

> 💡 **反復版のトレース** ─ Example 1: `[1,2,2,3,4,4,3]`

```
初期状態: queue = [(2, 2)]   ← rootの左子・右子ペア

─── ループ1回目 ───
取り出し: (left=2, right=2)
  2.val === 2.val ✅
  追加: (2.left=3, 2.right=3) → 外側ペア
  追加: (2.right=4, 2.left=4) → 内側ペア
queue = [(3,3), (4,4)]

─── ループ2回目 ───
取り出し: (left=3, right=3)
  3.val === 3.val ✅
  追加: (null, null) → 外側ペア
  追加: (null, null) → 内側ペア
queue = [(4,4), (null,null), (null,null)]

─── ループ3回目 ───
取り出し: (left=4, right=4)
  4.val === 4.val ✅
  追加: (null,null), (null,null)
queue = [(null,null), (null,null), (null,null), (null,null)]

─── ループ4〜7回目 ───
(null,null) → continue（両方nullなのでスキップ）× 4回

queue = [] → ループ終了 → return true ✅
```

---

### 📦 LeetCode提出用コード（再帰版）

```typescript
function isSymmetric(root: TreeNode | null): boolean {
    if (root === null) return true;

    const isMirror = (left: TreeNode | null, right: TreeNode | null): boolean => {
        if (left === null && right === null) return true;
        if (left === null || right === null) return false;
        return (
            left.val === right.val &&
            isMirror(left.left, right.right) &&
            isMirror(left.right, right.left)
        );
    };

    return isMirror(root.left, root.right);
}
```

> 📖 **このセクションで登場した用語**
>
> - **短絡評価（Short-circuit evaluation）**：`A && B` でAがfalseなら、Bを評価せず即falseを返す仕組み。無駄な計算を省ける
> - **タプル型**：`[number, string]` のように要素数と各位置の型が決まった固定長配列の型
> - **分割代入（Destructuring）**：`const [a, b] = array` のように配列/オブジェクトから値を取り出す構文
> - **non-null assertion（!）**：TypeScriptに「この値はnullでない」と伝える演算子。乱用すると危険だが、直前のチェックで安全が保証されている場合に使う
> - **FIFO**：First In First Out（先入れ先出し）。キューの動作原則

---

## TypeScript固有の最適化観点

### 型安全性の活用

1. **コンパイル時エラー防止**
    - `TreeNode | null` というUnion型を使うことで、「nodeにアクセスする前にnullチェックが必要」とコンパイラが教えてくれる。実行前にバグを発見できる
    - `isMirror` の引数型を明示することで、呼び出し時の型ミスを防止

2. **タプル型によるペア管理**
    - `Array<[TreeNode|null, TreeNode|null]>` という型で「必ず2要素のペア」を保証。3要素を誤って追加しようとするとコンパイルエラーになる

3. **const アロー関数でのヘルパー閉じ込め**
    - `const isMirror = (...) => ...` とすることで再代入不可。意図せず上書きされるバグを防ぐ

### コンパイル時最適化

1. **型推論の活用**：`queue.shift()` の戻り値型は `[TreeNode|null, TreeNode|null] | undefined` とTypeScriptが自動推論するため、明示的な型注釈が不要
2. **readonly修飾子**：今回はLeetCodeの既存クラス定義を使うため追加はしないが、自前のデータ構造では `readonly` を付けてイミュータブルにするのが理想

### 計算量まとめ

| 解法        | 時間計算量 | 空間計算量           |
| ----------- | ---------- | -------------------- |
| 再帰（DFS） | O(n)       | O(h) ─ hは木の高さ   |
| 反復（BFS） | O(n)       | O(w) ─ wは木の最大幅 |

どちらも全ノードを1回ずつ訪問するため **O(n)** です。空間計算量は木の形状によって異なりますが、最悪ケースはどちらも **O(n)** です（一直線の木 / 完全二分木の最下段にノードが集中する場合）。
