> 🎯 **[algo-beginner スキル発火]**
> 言語/カテゴリ: TypeScript
> 適用ルールセット: 共通5ルール + TS固有5ルール
> 参照ファイル: references/common.md + references/typescript.md

---

# 1. 問題の分析

> 💡 **一言で言うと**：「2種類の『木の探索順序リスト』を手がかりに、元の二分木を復元する問題」です。

## なぜ単純なアプローチでは解けないのか

2つの配列が何を意味するかを理解しないと解けません。木（ツリー）の探索には複数の「順序」があり、それぞれ異なる情報を持っています。

【二分木（binary tree）の探索順序の種類】

```text
        3
       / \
      9  20
         / \
        15   7

preorder（前順）= [3, 9, 20, 15, 7]
  → ルート → 左 → 右 の順に訪れる
  → ★ 先頭要素が必ず「ルート」になる！

inorder（中順）= [9, 3, 15, 20, 7]
  → 左 → ルート → 右 の順に訪れる
  → ★ ルートの「左右の境界線」が分かる！
```

この2つの特性を組み合わせることで、元の木を一意に復元できます。

---

### 競技プログラミング視点での分析

- **最優先課題**: `inorder` から根の位置を探す処理を O(1) に高速化すること
- 素直に実装すると、毎回 `inorder.indexOf(val)` で O(n) の線形探索（＝先頭から順に比較する探索）が走り、全体 O(n²) になってしまいます
- `HashMap`（ハッシュマップ＝辞書のように「値→インデックス」を瞬時に引けるデータ構造）で前処理することで O(n) に改善できます

### 業務開発視点での分析

- **型安全性**: `TreeNode | null` という戻り値の型で「木がない可能性（null）」をコンパイル時（＝TypeScriptがJavaScriptに変換される段階）に表現
- **エラーハンドリング**: 入力配列が空・長さ不一致などの異常系を事前検証
- **可読性**: 再帰関数（＝自分自身を呼び出す関数）の責務を明確に分ける

### TypeScript特有の考慮点

- `Map<number, number>` で型付きのハッシュマップを定義できる
- `readonly` 修飾子（＝変更禁止の印）で入力配列の誤変更を防止
- `preorderIndex` を参照として管理するために、クロージャ（＝外側の変数を関数内から参照できる仕組み）を活用する

> 📖 **このセクションで登場した用語**
>
> - **二分木（binary tree）**: 各ノードが最大2つの子を持つ木構造データ
> - **preorder（前順）**: ルート → 左 → 右 の順に探索する方法
> - **inorder（中順）**: 左 → ルート → 右 の順に探索する方法
> - **HashMap（ハッシュマップ）**: 値をキーとして直接場所を指定できる辞書のようなデータ構造
> - **コンパイル時**: TypeScriptのコードをJavaScriptに変換する段階

---

# 2. アルゴリズムアプローチ比較

> 💡 同じ問題でも解き方は複数あります。それぞれの「速さ（時間計算量）」と「メモリの使い方（空間計算量）」を比較して、最適なものを選びます。

| アプローチ              | 時間計算量 | 空間計算量 | TS実装コスト | 型安全性 | 可読性 | 備考                     |
| ----------------------- | ---------- | ---------- | ------------ | -------- | ------ | ------------------------ |
| **A: 再帰 + indexOf**   | O(n²)      | O(n)       | 低           | 高       | 高     | 毎回線形探索するため遅い |
| **B: 再帰 + HashMap**   | **O(n)**   | O(n)       | 中           | 高       | 高     | ★最適。前処理で高速化    |
| **C: 反復（スタック）** | O(n)       | O(n)       | 高           | 中       | 低     | 実装が複雑になる         |

> 💡 **Big-O記法の読み方**（初学者向け）
>
> - `O(1)`：入力サイズに関係なく一定時間（最速）
> - `O(n)`：入力が2倍になると処理も約2倍
> - `O(n²)`：入力が2倍になると処理は約4倍（二重ループに多い）
>
> 📖 **このセクションで登場した用語**
>
> - **時間計算量**: 処理にかかる手間が入力サイズに対してどう増えるかの目安
> - **空間計算量**: 処理中に使うメモリ量が入力サイズに対してどう増えるかの目安
> - **再帰（recursion）**: 関数が自分自身を呼び出して問題を解く手法

---

# 3. 選択したアルゴリズムと理由

- **選択したアプローチ**: **B: 再帰 + HashMap（O(n)）**

## 理由

- **Aを選ばなかった理由**: `indexOf` による毎回の線形探索（＝先頭から1つずつ調べる処理）が O(n) かかり、n 個のノードで合計 O(n²) になります。制約 `n=3000` なら9,000,000回の比較が必要になり遅すぎます
- **Cを選ばなかった理由**: スタック（＝後入れ先出しのデータ構造）を使った反復実装は速度は同じですが、コードが複雑になり保守性（＝後から変更しやすい性質）が下がります

### TypeScript特有の最適化ポイント

- `Map<number, number>` で型安全なハッシュマップを作成。`any` 型を使わずに済む
- `preorderIndex` を `{ val: number }` のオブジェクト参照として持つことで、再帰の中から安全に状態を共有できる（これをクロージャと呼ぶ）
- `readonly number[]` で入力配列の不変性（＝変更されないこと）をコンパイル時に保証

> 📖 **このセクションで登場した用語**
>
> - **ジェネリクス**: `Map<number, number>` の `number` 部分のように、型を後から差し込める仕組み
> - **クロージャ**: 外側のスコープにある変数を、内側の関数から参照・更新できる仕組み
> - **保守性**: 将来コードを修正・拡張しやすいかどうかを示す性質

---

# 4. 実装コード

## コードの骨格（先に全体像を把握する）

```text
1. 入力検証（配列長の一致確認・空配列チェック）
2. 前処理：inorder の「値 → インデックス」HashMap を O(n) で構築
3. preorder の現在位置を指す変数を初期化
4. 再帰関数 build(left, right) を定義：
   a. left > right なら null を返す（部分木が空）
   b. preorder[preorderIdx] をルートの値として取得、インデックスを進める
   c. HashMap でルートの inorder 上の位置を O(1) で取得
   d. 左部分木・右部分木を再帰的に構築して接続
5. build(0, n-1) を呼び出して木全体を構築して返す
```

```typescript
/**
 * preorder と inorder から二分木を復元する
 * @param preorder - 前順探索の配列（先頭が常にルート）
 * @param inorder  - 中順探索の配列（ルートの左右を分ける境界線）
 * @returns 復元した二分木のルートノード（空なら null）
 * @complexity Time: O(n), Space: O(n)
 */
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  // ① 入力検証：2つの配列の長さが一致しない場合はエラーを投げる。
  //    長さが違うと木を一意に定まらないため、処理を続けても意味がない。
  if (preorder.length !== inorder.length) {
    throw new RangeError(
      `preorder length (${preorder.length}) must equal inorder length (${inorder.length})`,
    );
  }

  // ② 空の入力への対応：ノードが1つもなければ null（木なし）を返す。
  if (preorder.length === 0) {
    return null;
  }

  const n = preorder.length; // 全ノード数を保持（以降で参照するため）

  // ③ 前処理：inorder の「値 → インデックス」マップを作成する。
  //    なぜか：毎回 indexOf で探すと O(n) かかるが、
  //    HashMap にしておくと O(1) で位置が分かり、全体が O(n) で済む。
  //    日常の例え：図書館の索引カードのように、本の名前（値）から
  //    棚番号（インデックス）を即座に引けるイメージ。
  const inorderIndexMap = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    // inorder[i] の値をキー、位置 i を値として登録
    inorderIndexMap.set(inorder[i], i);
  }

  // ④ preorder を消費していく「現在位置カーソル」を初期化する。
  //    オブジェクトにラップするのは、再帰関数の中から共有して
  //    更新できるようにするため（クロージャで値を共有）。
  let preorderIdx = 0;

  // ⑤ 再帰関数：inorder の [left, right] の範囲に対応する部分木を構築する。
  //    「inorder の left〜right の範囲」＝「今構築すべき部分木のノード群」を意味する。
  function build(left: number, right: number): TreeNode | null {
    // 範囲が空（left > right）なら部分木なし → null を返す
    // これが再帰の「底（終了条件）」。ここに達したら折り返す。
    if (left > right) {
      return null;
    }

    // ⑥ preorder の現在位置の値がこの部分木の「ルート」になる。
    //    preorder は「ルート → 左 → 右」の順なので、
    //    左部分木を処理し終えると次のルート値が現れる。
    const rootVal = preorder[preorderIdx];
    preorderIdx++; // 次の呼び出しのために位置を進める

    // ⑦ HashMap でこのルート値が inorder のどこにあるかを O(1) で取得する。
    //    inorder では「左ノード群 | ルート | 右ノード群」という配置になるため、
    //    この位置を境界として左右の部分木の範囲が決まる。
    const mid = inorderIndexMap.get(rootVal)!;
    // `!` は Non-null assertion（＝「これは必ずnullでないと保証する」宣言）。
    // 制約「preorder と inorder は同じ木のもの」が保証されているため安全に使える。

    // ⑧ TreeNode を生成する。
    //    この時点では left/right は未確定（次の再帰で決まる）。
    const node = new TreeNode(rootVal);

    // ⑨ 左部分木を再帰的に構築する。
    //    inorder で「ルートの左側（left 〜 mid-1）」が左部分木のノード群。
    //    ★ 左を先に処理する理由：preorder は「ルート→左→右」の順なので
    //    左の再帰が終わるまで右のルートは preorder に現れない。
    node.left = build(left, mid - 1);

    // ⑩ 右部分木を再帰的に構築する。
    //    inorder で「ルートの右側（mid+1 〜 right）」が右部分木のノード群。
    node.right = build(mid + 1, right);

    // ⑪ 完成したノード（左右の部分木が接続済み）を返す。
    return node;
  }

  // ⑫ inorder 全体（0 〜 n-1）を対象にして構築開始
  return build(0, n - 1);
}
```

---

## 動作トレース（具体的な入力例）

```text
入力: preorder = [3, 9, 20, 15, 7]
      inorder  = [9, 3, 15, 20, 7]

【前処理】 inorderIndexMap の構築:
  9 → 0,  3 → 1,  15 → 2,  20 → 3,  7 → 4

preorderIdx = 0 で build(0, 4) を呼び出す

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌱 build(left=0, right=4)
  rootVal = preorder[0] = 3,  preorderIdx → 1
  mid = inorderIndexMap.get(3) = 1
  node = TreeNode(3)

  ┌── node.left = build(left=0, right=0)   ← inorder[0..0] = [9]
  │     rootVal = preorder[1] = 9,  preorderIdx → 2
  │     mid = inorderIndexMap.get(9) = 0
  │     node = TreeNode(9)
  │     node.left  = build(0, -1) → null  (left > right なので終了)
  │     node.right = build(1,  0) → null  (left > right なので終了)
  │     return TreeNode(9)  ← 左の子 = 9 が確定
  │
  └── node.right = build(left=2, right=4) ← inorder[2..4] = [15,20,7]
        rootVal = preorder[2] = 20,  preorderIdx → 3
        mid = inorderIndexMap.get(20) = 3
        node = TreeNode(20)

        ┌── node.left = build(left=2, right=2)  ← inorder[2..2] = [15]
        │     rootVal = preorder[3] = 15,  preorderIdx → 4
        │     mid = inorderIndexMap.get(15) = 2
        │     node = TreeNode(15)
        │     node.left  = build(2, 1) → null
        │     node.right = build(3, 2) → null
        │     return TreeNode(15) ← 20 の左の子 = 15 が確定
        │
        └── node.right = build(left=4, right=4) ← inorder[4..4] = [7]
              rootVal = preorder[4] = 7,  preorderIdx → 5
              mid = inorderIndexMap.get(7) = 4
              node = TreeNode(7)
              node.left  = build(4, 3) → null
              node.right = build(5, 4) → null
              return TreeNode(7) ← 20 の右の子 = 7 が確定

        return TreeNode(20, left=15, right=7)

  return TreeNode(3, left=9, right=TreeNode(20))

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
最終結果の木：
        3
       / \
      9  20
         / \
        15   7
✅ Output: [3, 9, 20, null, null, 15, 7]
```

---

## LeetCode 提出フォーマット

```typescript
// Runtime 2 ms
// Beats 93.16%
// Memory 59.97 MB
// Beats 82.11%

function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  if (preorder.length !== inorder.length) {
    throw new RangeError(
      `preorder length (${preorder.length}) must equal inorder length (${inorder.length})`,
    );
  }
  if (preorder.length === 0) return null;

  const n = preorder.length;

  // inorder の「値 → インデックス」を O(1) で引けるよう前処理する
  const inorderIndexMap = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    inorderIndexMap.set(inorder[i], i);
  }

  // preorder を先頭から順に消費するカーソル（再帰内で共有）
  let preorderIdx = 0;

  // inorder の [left, right] 範囲に対応する部分木を再帰的に構築する
  function build(left: number, right: number): TreeNode | null {
    if (left > right) return null; // 範囲が空 → 部分木なし

    const rootVal = preorder[preorderIdx++]; // 現在のルート値を取得して進める
    const mid = inorderIndexMap.get(rootVal)!; // ルートの inorder 上の位置を O(1) で取得

    const node = new TreeNode(rootVal);
    node.left = build(left, mid - 1); // 左部分木（ルートの左側）
    node.right = build(mid + 1, right); // 右部分木（ルートの右側）
    return node;
  }

  return build(0, n - 1);
}
```

> 📖 **このセクションで登場した用語**
>
> - **readonly**: 変数の値を変更できないようにする TypeScript の修飾子。JavaScript にはなく、意図せぬ書き換えをコンパイル時に防げる
> - **Non-null assertion (`!`)**: 「この値は null/undefined ではない」とコンパイラに伝える TypeScript の構文。確信がある場合のみ使う
> - **TypeError / RangeError**: エラーの種類。`TypeError` は型が不正な場合、`RangeError` は値の範囲が不正な場合に使う
> - **再帰（recursion）**: 関数が自分自身を呼び出して、問題を小さな部分問題に分解して解く手法
> - **クロージャ**: 外側の関数のスコープ（変数の有効範囲）にある変数を、内側の関数から参照・更新できる仕組み

---

# TypeScript 固有の最適化観点まとめ

| 観点                          | 今回の実装での対応                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| **型安全性**                  | `Map<number, number>` で型付き HashMap、`TreeNode \| null` で null 可能性を明示             |
| **コンパイル時エラー防止**    | `RangeError` で長さ不一致を弾き、`!` 使用箇所を制約で論理的に保証                           |
| **readonly / イミュータブル** | 入力配列を変更せず、新しいノードを生成して木を構築                                          |
| **型推論の活用**              | `inorderIndexMap.get()` の戻り値が `number \| undefined` であることを TypeScript が自動推論 |
| **Pure function**             | 入力配列を変更せず、`preorderIdx` のみ内部で管理（副作用なし）                              |
