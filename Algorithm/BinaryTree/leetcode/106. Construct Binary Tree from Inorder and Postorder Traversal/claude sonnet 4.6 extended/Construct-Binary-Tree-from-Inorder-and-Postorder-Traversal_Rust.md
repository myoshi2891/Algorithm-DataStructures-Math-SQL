> 🎯 **[algo-beginner スキル発火]**
> 言語/カテゴリ: Rust
> 適用ルールセット: 共通5ルール + Rust固有ルール
> 参照ファイル: references/common.md + references/rust.md

---

# LeetCode 106 · Construct Binary Tree from Inorder and Postorder Traversal（Rust版）

---

## 1. 問題の分析

> 💡 **この問題を一言で言うと？**
> 「2種類の巡回記録（Inorder・Postorder）から、元の二分木を安全に復元する問題」です。

### 🦀 Rustで解く際の特有の難しさ

TypeScriptやPythonと違い、**Rustの二分木は所有権（＝値を"誰が管理するか"を決めるRust独自の仕組み）の壁**があります。木のノードは「複数の場所から参照されうる」ため、単純な `Box<T>` ではなく **`Rc<RefCell<TreeNode>>`** という特殊なラッパーを使います。これはLeetCodeが指定するフォーマットであり、「参照カウント（複数の所有者を許可する仕組み）＋内部可変性（借用規則を実行時に守る仕組み）」の組み合わせです。

### 競技プログラミング視点での分析

- **最重要ポイント**: `postorder` の末尾 = 現在の部分木のルート（根）
- **ボトルネック**: `inorder` からルートを毎回 `.iter().position()` で探すと O(n) × n回 = **O(n²)** になる
- **解決策**: `HashMap`（＝「値 → Inorderでの位置番号」を瞬時に引ける辞書）を1回構築してO(1)検索
- **Rustのメモリ特性**: `Rc::clone()` は参照カウントをインクリメントするだけで、実データのコピーは発生しない

### 業務開発視点での分析

- **型安全性**: `Option<Rc<RefCell<TreeNode>>>` で「ノードが存在しない（葉の末端）」を型レベルで表現
- **エラーハンドリング**: `HashMap::get()` は `Option<&V>` を返すが、問題の制約（全値はinorderに存在する）により `.unwrap()` を意図を明示した上で使用可能
- **借用設計**: `inorder` と `postorder` は `Vec<i32>` で受け取るが、HashMap構築後は内部のインデックスだけ使い回すのでコピーコストは最小限

### Rust特有の考慮点

- **`Rc<RefCell<T>>`**: ノードを木構造として組み立てる際、左右の子を設定するタイミングで借用が複雑になるため `RefCell` の動的借用（実行時に借用チェックを行う仕組み）が必要
- **`borrow_mut()`**: `RefCell` に包まれた値を書き換えるためのメソッド。コンパイル時ではなく実行時に排他チェックが行われる
- **`postIdx` の管理**: 再帰のたびに「どこまで消費したか」を共有する必要があり、Rustの借用規則上 `&mut usize` で渡すのが最もシンプルで安全

> 📖 **このセクションで登場した用語**
> - **所有権**: 値を"誰が管理するか"をコンパイル時に決めるRust独自の仕組み
> - **`Rc<T>`（Reference Counted）**: 複数の場所から同じ値を共有所有できるスマートポインタ。参照カウントが0になると自動解放
> - **`RefCell<T>`**: 通常は禁止されている「共有しながら書き換える」を実行時チェックで許可する内部可変性パターン
> - **`borrow_mut()`**: `RefCell<T>` の中身を書き換える権限を取得するメソッド
> - **ライフタイム**: 参照（`&T`）が有効な期間をコンパイラに伝えるアノテーション

---

## 2. アルゴリズムアプローチ比較

> 💡 **なぜ複数のアプローチを比較するのか？**
> Rustでは「速さ」だけでなく「所有権の移動が発生するか」「ヒープアロケーション（＝動的なメモリ確保）が何回起きるか」もコストに直結します。選択を誤ると Rust らしいパフォーマンスが出せません。

| アプローチ | 時間計算量 | 空間計算量 | Rust実装コスト | 安全性 | 可読性 | 備考 |
|---|---|---|---|---|---|---|
| **A: 毎回linear scan** | O(n²) | O(n) | 低 | 高 | 高 | `.position()` を再帰毎に呼ぶ |
| **B: HashMap事前構築（採用）** | O(n) | O(n) | 中 | 高 | 高 | 最もバランスが良い |
| **C: Vecのsplit/clone渡し** | O(n²) | O(n²) | 低 | 高 | 中 | `clone()`のアロケーションが重い |

> 💡 **Rust固有の観点**
> - アプローチCで `vec.clone()` を再帰のたびに呼ぶと、n段の再帰で合計O(n²)のヒープアロケーションが発生し現実的ではない
> - アプローチBは HashMap を1回だけ構築し（O(n) アロケーション）、後はインデックス（スタック上のusize）だけ渡すので追加アロケーションがほぼゼロ
> 📖 **このセクションで登場した用語**
> - **アロケーション**: ヒープ上にメモリを確保する操作。OSへのシステムコールを伴うため頻繁に行うと遅くなる
> - **スタック**: 関数の呼び出しに使われる高速なメモリ領域。`usize` などの固定サイズ値は自動で置かれる
> - **ヒープ**: `Vec` や `HashMap` などの動的サイズのデータが置かれる領域

---

## 3. 選択したアルゴリズムと理由

- **選択したアプローチ**: **B: HashMap事前構築 + 再帰分割（インデックスのみ渡す方式）**

- **理由**:
  - **アプローチAを選ばない理由**: `postorder` の末尾から値を取り出し `inorder.iter().position()` で探索すると、最悪ケースでn回×n回=O(n²)になる。入力上限3000で最大900万回の操作になりTLEの危険がある
  - **アプローチCを選ばない理由**: Rustでは `Vec::clone()` は O(n) のヒープアロケーションを伴う。再帰n段で O(n²) の空間が消費されメモリ上限を超える恐れがある
  - **Bを選ぶ理由**: HashMap構築はO(n)の一回限り。その後の全検索がO(1)になり、渡すデータは `usize`（インデックス）のみなのでスタックに載りヒープアロケーションが増えない

- **Rust特有の最適化ポイント**:
  - `postIdx` を `&mut usize` で再帰関数に渡すことで、所有権を移さずに「現在の消費位置」を全再帰呼び出し間で共有できる（借用規則に従いつつ可変アクセスを実現）
  - `HashMap::get()` は `&i32` への参照を返すが `i32` は `Copy` トレイト実装済みのため `copied()` で所有権の移動なくスタックコピーできる

> 📖 **このセクションで登場した用語**
> - **`Copy` トレイト**: `i32` など小さい値が持つ性質。代入・関数渡しで所有権が移らず自動でコピーされる
> - **`&mut T`（可変参照）**: 所有権を移さずに値の書き換えを許可する参照。同時に1つしか存在できない
> - **ゼロコスト抽象化**: 高レベルな書き方（イテレータ等）をしても手書きループと同等の速さになるRustの特性

---

## 4. アルゴリズムの核心を図解で理解する

### 🔑 発想のカギ：Postorderの末尾 = 現在のルート

```
inorder   = [9,  3, 15, 20, 7]
postorder = [9, 15,  7, 20, 3]
                              ↑
                     末尾要素 = ルートは 3
```

### Step 1: ルートを特定してInorderを左右に分割

```
inorder = [9, | 3 | , 15, 20, 7]
               ↑
    rootIdxInInorder = 1（HashMap で O(1) 検索）

左部分木の要素数 leftSize = 1（インデックス 0〜0）
右部分木の要素数 rightSize= 3（インデックス 2〜4）
```

### Step 2: 要素数からPostorderを分割（コピーなし！）

```
postorder = [9, | 15, 7, 20, | 3]
             ↑    ↑            ↑
           左(1)  右(3)      ルート（消費済み）

postIdx の動き:  末尾から逆順に消費していく
  最初: postIdx = 4 → ルート 3
  次:   postIdx = 3 → 右部分木ルート 20（右を先に再帰するため）
  ...
```

### Step 3: 再帰の全体像

```
helper(inLeft=0, inRight=4, postIdx=4)
  rootVal=3, node(3)作成
  ├─ 右: helper(2, 4, postIdx=3)
  │    rootVal=20, node(20)作成
  │    ├─ 右: helper(4, 4, postIdx=2)
  │    │    rootVal=7, node(7) ← 葉ノード
  │    └─ 左: helper(2, 2, postIdx=1)
  │         rootVal=15, node(15) ← 葉ノード
  └─ 左: helper(0, 0, postIdx=0)
       rootVal=9, node(9) ← 葉ノード

最終結果:
        3
       / \
      9   20
         /  \
        15    7
```

---

## 5. 実装コード

> 💡 **コードの骨格（先に全体像を把握）**
> 1. `HashMap` を1回だけ構築して `値 → inorder上の位置` を記録する
> 2. `postIdx: &mut usize` で「次に取り出すルートの位置」を再帰間で共有する
> 3. ヘルパー関数が `inLeft > inRight` になったら `None` を返して終了する
> 4. `Rc::new(RefCell::new(node))` でノードを作り、`borrow_mut()` で子を設定する

```rust
// Runtime 0 ms
// Beats 100.00%
// Memory 2.88 MB
// Beats 34.78%
use std::rc::Rc;
use std::cell::RefCell;
use std::collections::HashMap;

impl Solution {
    pub fn build_tree(inorder: Vec<i32>, postorder: Vec<i32>) -> Option<Rc<RefCell<TreeNode>>> {
        // ─────────────────────────────────────────────────────────────────
        // 【HashMap の事前構築】
        // 「inorderの値 → そのインデックス（位置番号）」を辞書に記録する。
        // 再帰のたびに .iter().position() で線形探索するとO(n²)になるため、
        // 1回だけO(n)で構築してすべての検索をO(1)に短縮するのが目的。
        // ─────────────────────────────────────────────────────────────────
        let inorder_map: HashMap<i32, usize> = inorder
            .iter()                    // 各要素への参照(&i32)を順に生成するイテレータ
            .enumerate()               // (インデックス, &i32) のペアに変換
            .map(|(i, &val)| (val, i)) // キー=値(i32)、バリュー=インデックス(usize) に並び替え
            .collect();                // HashMap<i32, usize> として収集

        // ─────────────────────────────────────────────────────────────────
        // 【postorder のポインタ】
        // postorder の末尾から順にルートを取り出すためのカーソル。
        // 再帰の中で「右部分木 → 左部分木」の順に消費するため、
        // 複数の再帰呼び出し間で共有する必要がある。
        // Rustでは &mut usize で渡すことで所有権を移さずに共有アクセスできる。
        // ─────────────────────────────────────────────────────────────────
        let mut post_idx = postorder.len() - 1;

        // ヘルパー関数を呼び出してinorder全体（0〜len-1）を対象に木を構築する
        Self::helper(
            &postorder,     // postorderは借用(&)で渡す。所有権を移すと後で使えなくなるため
            &inorder_map,   // HashMapも借用で渡す
            &mut post_idx,  // 可変参照で渡し、再帰のたびに値を更新できるようにする
            0,
            inorder.len().saturating_sub(1), // len()が0のとき0-1でオーバーフローするのを防ぐ
        )
    }

    fn helper(
        postorder: &[i32],               // postorder配列をスライス借用で受け取る
        inorder_map: &HashMap<i32, usize>, // HashMap の共有参照（読み取り専用）
        post_idx: &mut usize,            // 現在消費中のpostorderの位置（可変参照）
        in_left: usize,                  // 処理対象のinorder左端インデックス
        in_right: usize,                 // 処理対象のinorder右端インデックス
    ) -> Option<Rc<RefCell<TreeNode>>> {
        // ─────────────────────────────────────────────────────────────────
        // 【終了条件】
        // in_left > in_right は「この範囲に要素が存在しない」ことを意味する。
        // ただし usize は負数になれないため、in_right=0のとき in_left=1 に
        // なる前に in_right.wrapping_sub(1) でアンダーフローする危険がある。
        // そのため in_right が usize::MAX になる（=ラップアラウンド）を
        // 終了条件として同時にチェックする。
        // ─────────────────────────────────────────────────────────────────
        if in_left > in_right || in_right == usize::MAX {
            return None;
        }

        // ─────────────────────────────────────────────────────────────────
        // 【現在のルートを取り出す】
        // postorderは「左→右→ルート」の順なので末尾が必ず現在の部分木のルート。
        // *post_idx で「可変参照が指している値」を読み取り、
        // post_idx.saturating_sub(1) でカーソルを1つ前に進める。
        // saturating_sub は 0-1 がアンダーフローするのを防ぐ（0のまま止まる）。
        // ─────────────────────────────────────────────────────────────────
        let root_val = postorder[*post_idx];

        // post_idx を1つ前に進める（次の再帰呼び出しで次のルートを取れるように）
        // saturating_sub: 0の場合は0のまま（usize のアンダーフロー防止）
        *post_idx = post_idx.saturating_sub(1);

        // ─────────────────────────────────────────────────────────────────
        // 【新しいノードの作成】
        // Rc::new(RefCell::new(...)) はLeetCodeが指定するノードの作り方。
        // - Rc<T>: 複数の場所から同じノードを参照できるようにする（参照カウント）
        // - RefCell<T>: 左右の子を後から設定できるようにする（内部可変性）
        // ─────────────────────────────────────────────────────────────────
        let node = Rc::new(RefCell::new(TreeNode::new(root_val)));

        // ─────────────────────────────────────────────────────────────────
        // 【inorder上でのルートの位置を取得】
        // HashMap::get() は Option<&usize> を返す。
        // 問題の制約「全ての値はinorderに存在する」が保証されているため
        // .copied().unwrap() で取り出す。
        // .copied() は &usize → usize へのコピー（usize は Copy トレイト実装済み）
        // ─────────────────────────────────────────────────────────────────
        let root_idx_in_inorder = *inorder_map.get(&root_val).unwrap();

        // ─────────────────────────────────────────────────────────────────
        // 【重要】右部分木を先に再帰する理由：
        // postorder は「左→右→ルート」の順なので、末尾から逆に消費すると
        // 「ルート→右→左」の順になる。
        // つまり postIdx を1つ進めた直後に来るのは「右部分木のルート」。
        // 右を先に再帰しないと postIdx がずれて誤ったノードをルートにしてしまう。
        // ─────────────────────────────────────────────────────────────────

        // 右部分木を再帰構築（inorderのルート位置+1 〜 右端）
        let right_child = if root_idx_in_inorder < in_right {
            // root_idx_in_inorder + 1 が in_right 以下の場合のみ右部分木が存在する
            Self::helper(postorder, inorder_map, post_idx, root_idx_in_inorder + 1, in_right)
        } else {
            None // 右端にルートがある場合は右部分木なし
        };

        // 左部分木を再帰構築（inorderの左端 〜 ルート位置-1）
        // root_idx_in_inorder が 0 のとき -1 はusize でアンダーフローするため
        // wrapping_sub で実質的に usize::MAX にし、終了条件で捕捉する
        let left_child = Self::helper(
            postorder,
            inorder_map,
            post_idx,
            in_left,
            root_idx_in_inorder.wrapping_sub(1), // 0の場合 usize::MAX → 終了条件で None 返却
        );

        // ─────────────────────────────────────────────────────────────────
        // 【子ノードの設定】
        // borrow_mut() で RefCell の中の TreeNode を可変借用する。
        // この借用はブロック内でのみ有効で、スコープを抜けると自動解放される。
        // ─────────────────────────────────────────────────────────────────
        {
            let mut node_ref = node.borrow_mut(); // RefCell への可変借用を取得
            node_ref.right = right_child;         // 先に構築した右部分木を設定
            node_ref.left  = left_child;          // 後から構築した左部分木を設定
        } // ここで node_ref の借用が解放される（スコープを抜けると自動でドロップ）

        Some(node) // Option<Rc<RefCell<TreeNode>>> として返す
    }
}
```

---

## 6. 動作トレース（入力例での変数変化）

**入力:** `inorder = [9,3,15,20,7]`, `postorder = [9,15,7,20,3]`

```
事前準備: HashMap構築
  inorder_map = { 9→0, 3→1, 15→2, 20→3, 7→4 }
  post_idx = 4（末尾から開始）

──────────────────────────────────────────────────────────────────
Call 1: helper(in_left=0, in_right=4, post_idx=4)
  終了条件: 0 ≤ 4 かつ 4≠usize::MAX → 続行
  root_val = postorder[4] = 3        post_idx: 4 → 3
  root_idx_in_inorder = map[3] = 1
  → node(3) 作成: Rc::new(RefCell::new(TreeNode::new(3)))

  root_idx(1) < in_right(4) → 右部分木が存在する
  ┌─ 右を先に再帰 ──────────────────────────┐
  │ Call 2: helper(2, 4, post_idx=3)        │
  └──────────────────────────────────────────┘

──────────────────────────────────────────────────────────────────
Call 2: helper(in_left=2, in_right=4, post_idx=3)
  root_val = postorder[3] = 20       post_idx: 3 → 2
  root_idx_in_inorder = map[20] = 3
  → node(20) 作成

  root_idx(3) < in_right(4) → 右部分木あり
  ┌─ 右を先に再帰 ──────────────────────────┐
  │ Call 3: helper(4, 4, post_idx=2)        │
  └──────────────────────────────────────────┘

──────────────────────────────────────────────────────────────────
Call 3: helper(in_left=4, in_right=4, post_idx=2)
  root_val = postorder[2] = 7        post_idx: 2 → 1
  root_idx_in_inorder = map[7] = 4
  → node(7) 作成

  root_idx(4) == in_right(4) → 右部分木なし → right = None
  左: helper(4, wrapping_sub(1)=3, ...)
    → in_left(4) > in_right(3) → None ← 終了条件に合致

  node(7) は葉ノード（左右ともNone）
  return Some(node(7)) ✅

──────────────────────────────────────────────────────────────────
Call 2 に戻る: node(20).right = Some(node(7))
  左: helper(2, wrapping_sub(1)のroot_idx=2, post_idx=1)
  → Call 4: helper(in_left=2, in_right=2, post_idx=1)

Call 4:
  root_val = postorder[1] = 15       post_idx: 1 → 0
  → node(15) 作成（葉ノード）
  return Some(node(15)) ✅

Call 2 に戻る: node(20).left = Some(node(15))
  return Some(node(20)) ✅

──────────────────────────────────────────────────────────────────
Call 1 に戻る: node(3).right = Some(node(20))
  左: helper(0, wrapping_sub(1)=0のroot_idx-1=0, post_idx=0)
  → Call 5: helper(in_left=0, in_right=0, post_idx=0)

Call 5:
  root_val = postorder[0] = 9        post_idx: 0 → 0(saturating_sub)
  → node(9) 作成（葉ノード）
  return Some(node(9)) ✅

Call 1 に戻る: node(3).left = Some(node(9))

最終結果:
        3
       / \
      9   20
         /  \
        15    7

return Some(node(3)) ✅
```

---

## 7. 計算量まとめ

| 指標 | 値 | 理由 |
|---|---|---|
| **時間計算量** | O(n) | HashMap構築O(n) + 各ノードを1回だけ処理O(n) |
| **空間計算量** | O(n) | HashMapO(n) + 再帰スタックO(h)（h=木の高さ、最悪O(n)） |

---

## 8. Rust固有の設計観点

### `usize` のアンダーフロー問題と対策

```rust
// Rustでは usize（= 符号なし整数）は負数になれない。
// 0_usize - 1 はデバッグビルドでpanicし、リリースビルドでは
// usize::MAX（≒ 1.8×10¹⁹）にラップアラウンド（循環）する。
// これを意図的に利用して「左境界-1」を終了条件にマッピングする：

root_idx_in_inorder.wrapping_sub(1)
// root_idx が 0 のとき → usize::MAX（ラップアラウンド）
// 終了条件: in_right == usize::MAX で None を返す

// 安全な代替：saturating_sub は 0の場合に0で止まるが、
// 終了条件と区別がつかなくなるためこの問題ではwrapping_subが適切
```

### `Rc<RefCell<T>>` のRust的な意味

```rust
// JavaやPythonでは参照型はデフォルトで複数箇所から共有・書き換え可能。
// Rustでは通常「共有参照(&T)は書き換え不可」というルールがある。
//
// 木を組み立てる際は「複数の場所から参照 かつ 書き換えが必要」なため
// 通常のRustのルールが適用できない。そこで：
//
// Rc<T>       → 複数の所有者を参照カウントで管理（共有を許可）
// RefCell<T>  → 実行時に借用チェックを行い書き換えを許可（内部可変性）
//
// これらを組み合わせることで「複数箇所から共有しつつ書き換え可能な」
// ノードを実現している。LeetCodeのTreeNodeはこの形式が標準。

node.borrow_mut().left = left_child;
// ↑ borrow_mut() は実行時に「今誰かが借用中か」をチェックする
//   もし既に借用中なら panic! する（しかし通常の木操作では起きない）
```

> 📖 **このセクションで登場した用語**
> - **`wrapping_sub`**: 符号なし整数の引き算でアンダーフローが起きてもpanicせず、最大値からラップする演算
> - **`saturating_sub`**: アンダーフローが起きそうになったら0で止める（飽和演算）
> - **ラップアラウンド**: 最大値を超えると0に戻る、最小値を下回ると最大値になる整数演算の性質
> - **内部可変性（Interior Mutability）**: `RefCell<T>` などで、外からは不変に見える値を内部で書き換える設計パターン
> - **`borrow_mut()`**: `RefCell<T>` の中身への可変参照を取得する。実行時に排他チェックが行われる
> - **ゼロコスト抽象化**: イテレータチェーン（`.iter().enumerate().map().collect()`）が手書きforループと同等の機械語に最適化されるRustの特性
