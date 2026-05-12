> 🎯 **[algo-beginner スキル発火]**
> 言語/カテゴリ: TypeScript
> 適用ルールセット: 共通5ルール + TS固有5ルール
> 参照ファイル: references/common.md + references/typescript.md

---

# Path Sum（パスの合計）— LeetCode 112

---

## 1. 問題の分析

> 💡 **この問題は一言で言うと：**
> 「木の根（てっぺん）から葉（末端）まで下りる道の数値の合計が、目標値と一致するルートが存在するか？」を調べる問題です。

### 競技プログラミング視点での分析

木（ツリー）構造の問題では、**全ノード（節点）を一度ずつ訪れるだけで答えが出る**ため、最低でも O(n) の時間が必要です。各ノードで「今の合計が targetSum に達したか」をチェックしながら下に進めばよく、余計なメモリを使わずに解けます。

- 実行速度最優先 → **再帰DFS（深さ優先探索）**。関数呼び出しスタックのみを利用し、追加の配列不要
- メモリ最小化 → 木の高さ分のスタックしか使わない。最悪 O(n)（一直線の木）、均衡木なら O(log n)

### 業務開発視点での分析

- `TreeNode | null` という**Union型（複数の型を `|` でつなげた型）** を正確に扱う必要がある
- `null` チェックを忘れると実行時にクラッシュするため、型ガードで防御する
- 再帰関数はテストしやすく、ロジックが短く読みやすい → 保守性◎

### TypeScript特有の考慮点

- `root: TreeNode | null` を受け取る関数では、最初に `null` チェック（型ガード）を入れることで TypeScript コンパイラが以降の処理で `TreeNode` 型として扱えるようになる
- 今回は LeetCode 提供の `TreeNode` クラスを使うため、ジェネリクスは不要（型が固定されているため）
- `boolean` の戻り値型を明示することで、誤って数値や `undefined` を返すミスをコンパイル時に防げる

> 📖 **このセクションで登場した用語**
>
> - **DFS（深さ優先探索）**：木を「できるだけ深く」潜ってから引き返す探索方法。迷路を一本道ずつ試すイメージ
> - **Union型**：`A | B` のように「AまたはB」を表す型。`TreeNode | null` は「ノードかnullのどちらか」を意味する
> - **型ガード**：`if (root === null)` のように実行時に型を絞り込む仕組み。以降のコードで型を安全に使えるようにする
> - **コンパイル時**：TypeScriptのコードをJavaScriptに変換する段階。ここでエラーを検出できると実行前にバグを防げる

---

## 2. アルゴリズムアプローチ比較

> 💡 同じ問題でも複数の解き方があります。それぞれの「速さ（時間計算量）」と「メモリの使いやすさ（空間計算量）」を比べて最適なものを選びます。「O(n)」は「ノードを全部一度ずつ見る」という意味です。

| アプローチ                        | 時間計算量 | 空間計算量 | TS実装コスト | 型安全性 | 可読性 | 備考                                    |
| --------------------------------- | ---------- | ---------- | ------------ | -------- | ------ | --------------------------------------- |
| ① 再帰DFS（残りの合計を減らす）   | O(n)       | O(h)       | 低           | 高       | 高     | hは木の高さ。均衡木でO(log n)、最悪O(n) |
| ② 反復DFS（スタックを自前で管理） | O(n)       | O(h)       | 中           | 高       | 中     | スタックオーバーフローの心配なし        |
| ③ BFS（幅優先探索、キューを使う） | O(n)       | O(w)       | 中           | 高       | 低     | wは木の最大幅。パスの復元には不向き     |

> 💡 **Big-O記法の読み方**（初学者向け）
>
> - `O(n)`：ノード数が2倍になると処理も約2倍（全ノードを一度見る）
> - `O(h)`：木の高さ分のメモリだけ使う（hはheightの略）
> - `O(log n)`：均衡した木では高さ ≈ log₂(n) なので、1000ノードでも高さは約10

> 📖 **このセクションで登場した用語**
>
> - **再帰（Recursion）**：関数が自分自身を呼び出す仕組み。「根→左の子→さらに左…」と自動的に深く潜れる
> - **スタック（Stack）**：後から積んだものを先に取り出す構造（皿の積み重ねイメージ）。再帰の内部実装でも使われている
> - **BFS（幅優先探索）**：木を「同じ深さ」の階層ごとに横向きに探索する方法

---

## 3. 選択したアルゴリズムと理由

- **選択したアプローチ**: ① 再帰DFS（`targetSum` を減らしながら下に進む方法）

- **理由**:
    - BFS（方法③）を選ばない理由 → パスの「合計」を追跡するのに、幅広く横に探索するBFSより、根から葉まで縦に深く追うDFSの方が直感的で合う
    - 反復DFS（方法②）を選ばない理由 → 制約がノード数5000以下のため、再帰の深さ上限に引っかかるリスクが極めて低い。実装もシンプルな再帰の方が読みやすい
    - **再帰DFS（方法①）を選ぶ理由** → コードが最も短く、「左右それぞれの子を同じルールで調べる」という木の性質（再帰的構造）を自然に表現できる

- **TypeScript特有の最適化ポイント**:
    - `root === null` の null チェックで型ガードを使い、コンパイラに「この行以降は `TreeNode` 型が確定」と教える
    - 戻り値 `boolean` を明示することで、誤って `void` や `undefined` を返すコードをコンパイル時にブロック

> 📖 **このセクションで登場した用語**
>
> - **再帰的構造**：木が「根＋左の小さな木＋右の小さな木」という同じ形の組み合わせでできていること。再帰関数と相性が良い
> - **null チェック（null guard）**：`null` の可能性がある値を使う前に `=== null` で確認する処理

---

## 4. 実装コード

> 💡 **コード全体の骨格（構造の概要）**
>
> 1. `root` が `null` なら木が空（または葉を超えた）→ `false` を返す
> 2. 今いるノードが **葉（子が両方 null）** なら、残り合計が0かどうかを確認して答えを返す
> 3. 葉でなければ、左の子・右の子のどちらかで条件を満たすパスがあるか再帰的に確認する

```typescript
// Runtime 0 ms
// Beats 100.00%
// Memory 59.53 MB
// Beats 41.61%
/**
 * 二分木の根から葉までのパスの合計が targetSum と等しいパスが存在するか判定する
 * @param root   - 二分木の根ノード（null の場合は空の木）
 * @param targetSum - 目標とする合計値
 * @returns パスが存在すれば true、存在しなければ false
 * @complexity Time: O(n), Space: O(h)  n=ノード数, h=木の高さ
 */
function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
    // --- ベースケース①：root が null の場合 ---
    // 木が空、または葉を超えて「存在しないノード」に来た場合。
    // このルートにはパスが存在しないので false を返す。
    if (root === null) {
        return false;
        // ↑ TypeScriptの型ガード：この行以降 root は TreeNode 型として確定する
    }

    // --- ベースケース②：現在のノードが「葉（leaf）」かどうかを確認 ---
    // 葉とは「左の子も右の子も存在しないノード」のこと。
    // 根から葉まで来たということは、パスの終点に到達したことを意味する。
    const isLeaf: boolean = root.left === null && root.right === null;

    if (isLeaf) {
        // 葉に到達したとき、残りの目標値（targetSum）がちょうど現在のノードの値と等しければ
        // 「このパスの合計 = 最初の targetSum」が成立する。
        // ＊ここで root.val を引いた結果が 0 になるか、直接比較するかは好みだが
        //   「今のノードの値で最後の差し引きが済む」と考えると分かりやすい。
        return root.val === targetSum;
    }

    // --- 再帰ステップ：左の子・右の子へ潜る ---
    // 現在のノードの値 (root.val) を targetSum から引くことで
    // 「残りあとどれだけ合計が必要か」を次の階層に渡す。
    // 例：targetSum=22, root.val=5 → 次の階層では targetSum=17 を目指す
    const remaining: number = targetSum - root.val;

    // 左の子ツリーか、右の子ツリーのどちらか一方でも条件を満たすパスがあれば true。
    // || （論理和）なので、どちらかが true なら即座に true を返す（短絡評価）。
    return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
}
```

---

### 💡 動作トレース（Example 1 での変数変化）

```
入力: root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22

木の形（図解）:
          5
         / \
        4   8
       /   / \
      11  13   4
     /  \       \
    7    2        1

─────────────────────────────────────────────────────
Step 1: hasPathSum(5, 22)
        → root=5, isLeaf=false
        → remaining = 22 - 5 = 17
        → 左(4, 17) と 右(8, 17) を調べる

Step 2: hasPathSum(4, 17)  ← 左の子を先に調べる
        → root=4, isLeaf=false
        → remaining = 17 - 4 = 13
        → 左(11, 13) と 右(null, 13) を調べる

Step 3: hasPathSum(11, 13)
        → root=11, isLeaf=false
        → remaining = 13 - 11 = 2
        → 左(7, 2) と 右(2, 2) を調べる

Step 4: hasPathSum(7, 2)
        → root=7, isLeaf=true（子が両方null）
        → 7 === 2 ? → false ❌

Step 5: hasPathSum(2, 2)
        → root=2, isLeaf=true（子が両方null）
        → 2 === 2 ? → true ✅  ← ここで条件達成！

Step 6: Step 5 の true が || で Step 3 に伝わる → true
Step 7: Step 3 の true が || で Step 2 に伝わる → true
Step 8: Step 2 の true が || で Step 1 に伝わる → true
─────────────────────────────────────────────────────
出力: true
パス: 5 → 4 → 11 → 2  合計 = 22 ✅
```

```
入力: root = [1,2,3], targetSum = 5

木の形:
    1
   / \
  2   3

Step 1: hasPathSum(1, 5)
        → remaining = 5 - 1 = 4
        → 左(2, 4) と 右(3, 4) を調べる

Step 2: hasPathSum(2, 4)
        → root=2, isLeaf=true → 2 === 4 ? → false ❌

Step 3: hasPathSum(3, 4)
        → root=3, isLeaf=true → 3 === 4 ? → false ❌

Step 4: false || false → false
─────────────────────────────────────────────────────
出力: false  ✅
```

```
入力: root = [], targetSum = 0  （空の木）

Step 1: hasPathSum(null, 0)
        → root === null → 即 false を返す
─────────────────────────────────────────────────────
出力: false  ✅
```

> 📖 **このセクションで登場した用語**
>
> - **ベースケース（Base Case）**：再帰関数が「これ以上潜らなくていい」と判断して結果を返す条件。ここでは「null に到達」と「葉に到達」の2つ
> - **葉（Leaf Node）**：子ノードが1つも存在しない末端のノード。パスの終点となる
> - **短絡評価（Short-circuit Evaluation）**：`A || B` で A が true なら B を評価せず即 true を返す仕組み。無駄な処理を省ける
> - **再帰ステップ（Recursive Step）**：関数が自分自身を呼び出す部分。今回は左右の子ノードに対して同じ処理を繰り返す
> - **remaining**：「残り目標合計」。現在のノードの値を差し引いた後、次の階層に渡す値

---

## TypeScript固有の最適化観点まとめ

### 型安全性の活用

```typescript
// ❌ JavaScriptだと null チェックを忘れても実行時まで気づけない
function hasPathSumJS(root, targetSum) {
    return root.val === targetSum; // null.val → クラッシュ！
}

// ✅ TypeScriptなら root: TreeNode | null と宣言するだけで
//    コンパイラが「null かもしれないのに使っている」と警告してくれる
function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
    if (root === null) return false; // ← 型ガードでここ以降は TreeNode 確定
    // この行では root.val に安全にアクセスできる
    return root.val === targetSum;
}
```

**JavaScriptにはない理由**: JavaScriptは実行するまで型のミスに気づけません。TypeScriptの `TreeNode | null` という型宣言により、コンパイル時（コードをJavaScriptに変換する段階）に「null の可能性があるのに使っている」とエラーを出してくれます。

### readonly 修飾子について

今回は LeetCode が `TreeNode` クラスを提供するため自分で定義しませんが、業務コードとして自分で定義するなら以下のように `readonly` をつけることで意図しない書き換えを防げます：

```typescript
// 業務開発版：ノードの値が外から書き換えられないように readonly で守る
class SafeTreeNode {
    readonly val: number; // val を書き換え不可にする（JavaScriptにはない保護）
    readonly left: SafeTreeNode | null;
    readonly right: SafeTreeNode | null;

    constructor(val = 0, left: SafeTreeNode | null = null, right: SafeTreeNode | null = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}
```

> 📖 **このセクションで登場した用語**
>
> - **readonly**：変数の値を変更できないようにする修飾子。JavaScriptにはなく、TypeScript独自の機能。意図せぬ書き換えをコンパイル時（実行前）に防げる
> - **型ガード（Type Guard）**：`if (root === null)` のように実行時に型を絞り込む処理。TypeScriptコンパイラはこれを認識し、以降のブロックで型を自動的に絞り込んでくれる（型推論の一種）
> - **コンパイル時エラー**：TypeScriptをJavaScriptに変換する段階で検出するエラー。実行前に気づけるため、実行時クラッシュより安全
