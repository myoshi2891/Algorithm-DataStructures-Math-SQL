> 🎯 **[algo-beginner スキル発火]**
> 言語/カテゴリ: Rust
> 適用ルールセット: 共通5ルール + Rust固有5ルール
> 参照ファイル: references/common.md + references/rust.md

---

# 1. 問題の分析

> 💡 **一言で言うと**：「前順・中順の2種類の探索リストから、`Rc<RefCell<TreeNode>>` という Rust 特有のノード構造で二分木を安全に復元する問題」です。

## Rust で解く際に特に気をつけるべき点

TypeScript 版との最大の違いは、**ノードの型が `Option<Rc<RefCell<TreeNode>>>`** という複合型になっている点です。これは Rust の所有権（＝値を"誰が管理するか"をコンパイル時に決める仕組み）ルールの制約から来ています。木のような「複数の親子関係を持つ構造」は素直に書くと所有権が競合するため、`Rc`（参照カウント＝複数箇所から同じ値を参照できる仕組み）と `RefCell`（実行時の内部可変性＝通常は禁止されている「共有しながら書き換え」を許可する仕組み）を組み合わせてこれを解決しています。また、再帰中に `preorder_idx` という「何番目を処理中か」のカーソルを複数の再帰呼び出しで共有するために `&mut usize`（可変参照）を使う必要があります。

---

### 競技プログラミング視点での分析

- `HashMap<i32, usize>` で inorder の「値→インデックス」を前処理し、根の位置を O(1) で取得
- 配列の実際のコピー（`Vec` のスライシング）は行わず、インデックス境界 `[left, right]` だけを渡すことで余分なヒープアロケーション（＝ヒープ上にメモリを確保する操作）を回避
- `Rc::new(RefCell::new(...))` はノードごとに1回だけのヒープアロケーション

### 業務開発視点での分析

- `Option<Rc<RefCell<TreeNode>>>` の `Option` 部分が「子ノードが存在しない可能性」を型で表現。`null` チェックのし忘れをコンパイル時に防ぐ
- 入力の長さ不一致は `return None` で安全に早期脱出

### Rust 特有の考慮点

- `preorder_idx` を `&mut usize` として渡すことで、再帰関数間でカーソル位置を所有権を移さずに共有
- `HashMap` の `.get()` は `Option<&V>` を返すため、`.copied()` で `Option<usize>` に変換して安全に扱う
- ノードへの書き込みは `.borrow_mut()` 経由で行う（`RefCell` の実行時借用チェック）

> 📖 **このセクションで登場した用語**
>
> - **所有権**: 値を"誰が管理するか"をコンパイル時に決める Rust 独自の仕組み
> - **`Rc<T>`**: 参照カウント（Reference Counted）。複数箇所から同じ値を参照できるスマートポインタ。ただしシングルスレッド専用
> - **`RefCell<T>`**: 通常は禁止されている「共有しながら書き換え」を実行時チェックで許可する仕組み（内部可変性パターン）
> - **`&mut T`**: 可変参照。値の所有権を移さずに書き換える権限を借りる仕組み
> - **ヒープアロケーション**: `Vec` や `Rc` など、動的なメモリ確保操作。スタックより低速

---

# 2. アルゴリズムアプローチ比較

> 💡 同じ問題でも解き方は複数あります。特に Rust では「所有権の移動が発生するか」「余分なアロケーションが起きるか」が重要な選択基準になります。

| アプローチ                         | 時間計算量 | 空間計算量 | Rust実装コスト | 安全性 | 可読性 | 備考                                        |
| ---------------------------------- | ---------- | ---------- | -------------- | ------ | ------ | ------------------------------------------- |
| **A: 再帰 + Vec スライシング**     | O(n²)      | O(n²)      | 低             | 高     | 高     | ループごとに `Vec::from_slice` でコピー発生 |
| **B: 再帰 + HashMap + `&mut idx`** | **O(n)**   | O(n)       | 中             | 高     | 高     | ★最適。コピーなし・O(1)ルックアップ         |
| **C: 反復 + スタック**             | O(n)       | O(n)       | 高             | 高     | 低     | `Rc<RefCell<>>` の操作が複雑化する          |

> 📖 **このセクションで登場した用語**
>
> - **時間計算量**: 処理にかかる手間が入力サイズに対してどう増えるかの目安
> - **スライシング**: 配列・Vec の一部を切り出してコピーを作る操作。O(n) のコストがかかる
> - **ルックアップ**: キーに対応する値をデータ構造から取り出す操作

---

# 3. 選択したアルゴリズムと理由

- **選択したアプローチ**: **B: 再帰 + HashMap + `&mut usize`**

### 理由

- **A を選ばなかった理由**: ループのたびに `preorder[1..]` や `inorder[..mid]` で `Vec` のコピーを生成すると、n 個のノードで合計 O(n²) のメモリアロケーションが発生します。Rust では不要なヒープアロケーションは避けるのが基本設計方針です
- **C を選ばなかった理由**: `Rc<RefCell<TreeNode>>` の `.borrow_mut()` を手動スタックで管理するとコードが複雑になり、実行時パニック（`borrow_mut` の二重借用）のリスクも高まります

### Rust 特有の最適化ポイント

- `preorder_idx` を `&mut usize` で渡すことで、`Rc<Cell<usize>>` のようなヒープアロケーションを避けてスタック上で状態共有ができる
- `HashMap::get().copied()` でゼロコスト（＝手書きの低レベルコードと同等の速さ）な値取得
- `Rc::new(RefCell::new(TreeNode::new(val)))` は1ノードにつき1回のアロケーションのみ

> 📖 **このセクションで登場した用語**
>
> - **ゼロコスト抽象化**: `.copied()` のような便利なメソッドを使っても、手書きの低レベルコードと同等の速さになる Rust の特性
> - **スタックアロケーション**: `usize` のような固定サイズの値が関数フレーム上に置かれる。ヒープより高速
> - **実行時パニック**: コンパイルは通るが、実行中に回復不能なエラーが発生してプログラムが強制終了すること

---

# 4. 実装コード

## コードの骨格（先に全体像を把握する）

```
1. 入力検証: preorder と inorder の長さが一致しなければ None を返す
2. 前処理: inorder の「値 → インデックス」を HashMap に O(n) で登録
3. preorder カーソル preorder_idx を 0 で初期化し、&mut で再帰関数に渡す
4. 再帰関数 build(preorder, &mut idx, &map, left, right):
   a. left > right なら None を返す（部分木なし・再帰の終了条件）
   b. preorder[*idx] をルート値として取得、*idx をインクリメント
   c. HashMap でルートの inorder 位置を O(1) で取得
   d. TreeNode を生成し Rc<RefCell<>> でラップ
   e. .borrow_mut() で左右の子を再帰的に接続
   f. Some(node) を返す
5. build(0, n-1) を呼び出して結果を返す
```

```rust
// Runtime 0 ms
// Beats 100.00%
// Memory 3.00 MB
// Beats 18.00%
use std::rc::Rc;
use std::cell::RefCell;
use std::collections::HashMap;

impl Solution {
    pub fn build_tree(
        preorder: Vec<i32>,
        inorder: Vec<i32>,
    ) -> Option<Rc<RefCell<TreeNode>>> {

        // ① 入力検証：2つの配列の長さが一致しない場合は木を復元できない。
        //    Rust では panic! より None を返すことで呼び出し元が安全に処理できる。
        if preorder.len() != inorder.len() {
            return None;
        }

        // ② 空の入力への対応：ノードがなければ木も存在しないため None を返す。
        if preorder.is_empty() {
            return None;
        }

        let n = inorder.len();

        // ③ 前処理：inorder の「値 → インデックス」を HashMap に登録する。
        //    なぜか：毎回 .iter().position() で O(n) 探索すると全体が O(n²) になる。
        //    HashMap に前もって登録しておけば .get() が O(1) になり全体が O(n) で済む。
        //    日常の例え：図書館の索引カード。タイトル（値）から棚番号（インデックス）を即座に引ける。
        let mut inorder_map: HashMap<i32, usize> = HashMap::with_capacity(n);
        for (i, &val) in inorder.iter().enumerate() {
            // enumerate() で (インデックス, 値への参照) のペアを順に取り出す
            inorder_map.insert(val, i);
        }

        // ④ preorder カーソルを初期化する。
        //    &mut usize として再帰関数に渡すことで、複数の再帰呼び出しが
        //    同じカーソルを「所有権なし」で共有して更新できる。
        //    他言語のように static 変数やクロージャの mutable キャプチャを
        //    使わなくて済むため、Rust の所有権ルールと相性が良い。
        let mut preorder_idx: usize = 0;

        // ⑤ 再帰関数を呼び出して木全体を構築して返す
        Self::build(&preorder, &mut preorder_idx, &inorder_map, 0, n - 1)
    }

    /// inorder の [left, right] 範囲に対応する部分木を再帰的に構築する。
    ///
    /// # Arguments
    /// * `preorder`      - 前順探索の配列（借用・読み取り専用）
    /// * `preorder_idx`  - preorder の現在位置カーソル（可変参照で共有）
    /// * `inorder_map`   - inorder の「値→インデックス」マップ（借用）
    /// * `left`          - 今構築すべき部分木の inorder 上の左端インデックス
    /// * `right`         - 今構築すべき部分木の inorder 上の右端インデックス
    ///
    /// # Returns
    /// `Some(Rc<RefCell<TreeNode>>)` または `None`（部分木なし）
    ///
    /// # Complexity
    /// - Time:  O(n)  ─ 各ノードをちょうど1回だけ処理
    /// - Space: O(n)  ─ HashMap + 再帰スタック（木の高さ h 分）
    fn build(
        preorder: &[i32],
        preorder_idx: &mut usize,          // &mut usize：可変参照で状態を再帰間共有
        inorder_map: &HashMap<i32, usize>, // &HashMap：読み取り専用の借用
        left: usize,
        right: usize,
    ) -> Option<Rc<RefCell<TreeNode>>> {

        // ⑥ 再帰の終了条件：left > right なら部分木は空 → None を返す。
        //    usize は負の数を表せないため、left=0 かつ right=0 のときに
        //    right - 1 を計算するとアンダーフロー（＝0未満へのラップアラウンド）が起きる。
        //    そのため比較は left > right ではなく、呼び出し側で
        //    mid == 0 の場合は左再帰を省略するガードが必要になる（⑩で対応）。
        if left > right {
            return None;
        }

        // ⑦ preorder の現在位置からルート値を取り出す。
        //    preorder は「ルート → 左 → 右」の順なので、
        //    呼ばれた時点の先頭要素が必ずこの部分木のルートになる。
        let root_val = preorder[*preorder_idx];
        *preorder_idx += 1; // 次の再帰のためにカーソルを進める

        // ⑧ HashMap でルート値が inorder のどこにあるかを O(1) で取得する。
        //    .get() は Option<&usize> を返すので .copied() で Option<usize> に変換。
        //    制約「preorder と inorder は同じ木のもの」が保証されているため
        //    .unwrap_or(0) ではなく .expect() でバグを即座に検出するほうが安全。
        //    ただし LeetCode の制約上は必ず存在するため unwrap で問題ない。
        let mid = *inorder_map.get(&root_val).unwrap();

        // ⑨ TreeNode を生成し、Rc<RefCell<>> でラップする。
        //    なぜ Rc か：木の親が子ノードを所有するが、後で左右に接続するときに
        //    「一時的に複数箇所から参照したい」ため、参照カウント型が必要。
        //    なぜ RefCell か：ノードを生成した後に .left / .right を書き換えるため、
        //    共有した状態でも内部を変更できる「内部可変性」が必要。
        let node = Rc::new(RefCell::new(TreeNode::new(root_val)));

        // ⑩ 左部分木を再帰的に構築する。
        //    inorder で「ルートの左側（left 〜 mid-1）」が左部分木のノード群。
        //    ★ mid == left のとき left..mid-1 は空（left > right になる）だが
        //    usize の減算アンダーフローを防ぐため、mid > left のときだけ再帰する。
        //    mid == left のときは左の子なし → None になる。
        node.borrow_mut().left = if mid > left {
            Self::build(preorder, preorder_idx, inorder_map, left, mid - 1)
        } else {
            None // ルートが inorder の左端 → 左の子は存在しない
        };

        // ⑪ 右部分木を再帰的に構築する。
        //    inorder で「ルートの右側（mid+1 〜 right）」が右部分木のノード群。
        //    ★ 左を先に処理する理由：preorder は「ルート→左→右」の順なので
        //    左の再帰が終わるまで右のルート値は preorder に現れない。
        node.borrow_mut().right =
            Self::build(preorder, preorder_idx, inorder_map, mid + 1, right);

        // ⑫ 完成したノード（左右の部分木が接続済み）を Some でラップして返す
        Some(node)
    }
}
```

---

## 動作トレース（具体的な入力例）

```
入力: preorder = [3, 9, 20, 15, 7]
      inorder  = [9, 3, 15, 20, 7]

【前処理】 inorder_map の構築:
  9→0,  3→1,  15→2,  20→3,  7→4

preorder_idx = 0 で build(..., left=0, right=4) を呼び出す

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌱 build(left=0, right=4)
  root_val = preorder[0] = 3,  *preorder_idx → 1
  mid = inorder_map[3] = 1
  node = Rc<RefCell<TreeNode(3)>>

  ┌── left側: mid(1) > left(0) → build(left=0, right=0) を呼ぶ
  │     root_val = preorder[1] = 9,  *preorder_idx → 2
  │     mid = inorder_map[9] = 0
  │     node = Rc<RefCell<TreeNode(9)>>
  │     left側: mid(0) > left(0) は false → None
  │     right側: build(left=1, right=0) → left(1) > right(0) → None
  │     return Some(TreeNode(9, left=None, right=None))
  │
  └── right側: build(left=2, right=4)
        root_val = preorder[2] = 20,  *preorder_idx → 3
        mid = inorder_map[20] = 3
        node = Rc<RefCell<TreeNode(20)>>

        ┌── left側: mid(3) > left(2) → build(left=2, right=2) を呼ぶ
        │     root_val = preorder[3] = 15,  *preorder_idx → 4
        │     mid = inorder_map[15] = 2
        │     left側: mid(2) > left(2) は false → None
        │     right側: build(left=3, right=2) → left > right → None
        │     return Some(TreeNode(15, None, None))
        │
        └── right側: build(left=4, right=4)
              root_val = preorder[4] = 7,  *preorder_idx → 5
              mid = inorder_map[7] = 4
              left側: mid(4) > left(4) は false → None
              right側: build(left=5, right=4) → left > right → None
              return Some(TreeNode(7, None, None))

        return Some(TreeNode(20, left=Some(15), right=Some(7)))

return Some(TreeNode(3, left=Some(9), right=Some(20)))

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
最終結果の木：
        3
       / \
      9  20
         / \
        15   7
✅ Output: [3, 9, 20, null, null, 15, 7]
```

---

## `Rc<RefCell<>>` を使う理由を図で理解する

```
【他言語（TypeScript）では】
  node.left = buildLeft();   // 普通に代入できる

【Rustで素直に書こうとすると】
  let node = TreeNode { val, left: None, right: None };
  node.left = build_left();  // ← エラー！ node はすでに move 済みかもしれない

【なぜか：所有権の問題】
  ┌──────────────────────────────────────┐
  │ node を作る → left を設定 → right を設定 │
  │ この間ずっと node を「変更可能」で保持  │
  │ かつ「複数の再帰から参照可能」にしたい  │
  └──────────────────────────────────────┘
  → 「変更可能」かつ「複数参照可能」は通常 Rust では禁止！

【解決策: Rc<RefCell<T>>】
  Rc    ── 参照カウント：複数箇所から同じ値を参照できる（所有権の共有）
  RefCell ── 内部可変性：実行時の借用チェックで、共有しながら書き換えを許可

  node.borrow_mut().left = Some(child);
  ↑ borrow_mut() で「今だけ書き換えOK」という実行時ロックを取得
    ロックが取れなければ（二重 borrow）パニックになるが、
    この問題では常に一つの場所からしか borrow しないため安全
```

> 📖 **このセクションで登場した用語**
>
> - **`Rc<T>`**: Reference Counted（参照カウント）型。複数の場所から同じデータを参照できるが、スレッド間の共有はできない
> - **`RefCell<T>`**: 通常 Rust が禁止する「共有しながら書き換え」を実行時チェックで許可する型。パフォーマンスより利便性を優先する場面で使う
> - **`.borrow_mut()`**: `RefCell<T>` の内容を書き換えるための「実行時ロック取得」メソッド。二重取得するとパニックが起きる
> - **`usize` アンダーフロー**: `usize` は 0 以上の整数のみ表せるため、0 - 1 を計算するとパニックまたは最大値へのラップアラウンドが起きる危険がある
> - **`&mut T`（可変参照）**: 所有権を渡さずに「書き換える権利だけ」を借りる仕組み。同時に1つしか存在できない（排他的）
