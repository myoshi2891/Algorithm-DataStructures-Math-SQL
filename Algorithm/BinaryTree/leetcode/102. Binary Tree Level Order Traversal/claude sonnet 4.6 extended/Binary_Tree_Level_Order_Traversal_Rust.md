> 🎯 **[algo-beginner スキル発火]**
> 言語/カテゴリ: Rust
> 適用ルールセット: 共通5ルール + Rust固有5ルール
> 参照ファイル: references/common.md + references/rust.md

---

# LeetCode 102 · Binary Tree Level Order Traversal — Rust版

---

## 1. 問題の分析

> 💡 **この問題は一言で言うと「木を上から下へ、同じ高さのノードをまとめてグループ化する問題」です。**

```
        3          ← 深さ0: [3]
       / \
      9  20        ← 深さ1: [9, 20]
         / \
        15   7     ← 深さ2: [15, 7]

出力: [[3], [9, 20], [15, 7]]
```

**Rustで解く際に特に気をつけるべき点：**
LeetCode の Rust 環境では、ツリーノードは `Option<Rc<RefCell<TreeNode>>>` という複合型で表現されています。`Rc<T>`（＝参照カウント型の共有ポインタ）と `RefCell<T>`（＝実行時に借用チェックを行う内部可変性コンテナ）の組み合わせで「1つのノードを複数の親から共有できる」構造を表現しています。この型を安全に扱うパターンを正確に押さえることが、この問題のRust実装の核心です。

---

### 競技プログラミング視点での分析

- ノード数は最大 2000 なので O(n) 単一パスで十分
- キュー（`VecDeque<T>`、＝両端から追加・取り出しができるキュー）を使い、各ノードをちょうど1回だけ処理する
- `Rc::clone()` は参照カウントのインクリメントのみで、データのコピーは行わないためオーバーヘッドは小さい

### 業務開発視点での分析

- `Option<Rc<RefCell<TreeNode>>>` は「値がある/ない」を型で安全に表現する。Javaの `null` と異なり、取り出す前に `None` チェックが強制されるためNullPointerException相当のバグが起きない
- `borrow()` の呼び出しで実行時借用チェックが行われ、同時ミュータブルアクセスが自動的に防止される

### Rust特有の考慮点

- **所有権の移動（move）を避ける**: `Rc::clone(&node)` は所有権を移さず参照カウントをインクリメントするだけ。`node.clone()` と書いても同じ意味だが `Rc::clone()` と書くことでRustの慣習では「安価なクローン」であることを明示できる
- **`borrow()` vs `borrow_mut()`**: 今回は読み取りのみなので `borrow()`（共有参照）を使う。`borrow_mut()`（排他参照）は不要

> 📖 **このセクションで登場した用語**
>
> - **`Rc<T>`**：Reference Counted。参照カウント（＝何箇所から参照されているかを数える）によって、1つの値を複数の場所から所有できるスマートポインタ。スレッドをまたぐ場合は `Arc<T>` を使う
> - **`RefCell<T>`**：通常はコンパイル時に行う借用チェックを実行時に行うコンテナ。これにより「コンパイル時には分からない条件分岐に応じた可変借用」を安全に実現できる
> - **内部可変性**：外から見ると不変（`&T`）なのに、内部だけ変更できる仕組み。`RefCell` がその代表例
> - **参照カウント**：ある値を指しているポインタの数を記録し、0になったら自動的にメモリを解放する仕組み

---

## 2. アルゴリズムアプローチ比較

> 💡 同じ問題でも解き方は複数あります。「速さ（時間計算量）」「メモリ」「Rustの所有権モデルとの相性」を合わせて比べます。

| アプローチ           | 時間計算量 | 空間計算量 | Rust実装コスト | 安全性 | 可読性 | 備考                                             |
| -------------------- | ---------- | ---------- | -------------- | ------ | ------ | ------------------------------------------------ |
| **BFS + `VecDeque`** | O(n)       | O(n)       | 低             | 高     | 高     | ✅ 今回の選択                                    |
| DFS（再帰）          | O(n)       | O(n)       | 中             | 高     | 中     | スタックオーバーフローリスク、深さ管理が必要     |
| DFS（反復）          | O(n)       | O(n)       | 中             | 高     | 中     | `Vec` をスタックとして使う。深さ情報の追跡が必要 |

**Rust固有の観点**:

- BFS + `VecDeque` は「今の階のノード数分だけ `pop_front()` する」パターンで自然に階層分けができ、Rcの借用スコープも短く済む
- DFS再帰版は `Rc::clone` の呼び出し回数は同じだが、再帰の深さがツリーの高さに比例してスタックを消費するため、バランスの悪い木では不利

> 📖 **このセクションで登場した用語**
>
> - **`VecDeque<T>`**：`std::collections::VecDeque`。両端キュー（＝前からも後ろからも要素を追加・取り出しできるデータ構造）。`Vec<T>` の先頭への挿入は O(n) だが `VecDeque` は O(1) でできる
> - **スタックオーバーフロー**：再帰が深くなりすぎてプログラムが使えるスタックメモリを使い尽くしてしまうエラー

---

## 3. 選択したアルゴリズムと理由

- **選択したアプローチ**: **BFS（幅優先探索）+ `VecDeque`**
- **理由**:
    - **DFS再帰を選ばなかった理由**: 深さ情報を引数として持ち回る設計が必要になり、`Rc::clone` のスコープが広がって借用チェッカーとの格闘が増える
    - **DFS反復を選ばなかった理由**: `Vec` をスタックとして使うと「今の階」の境界を別途追跡しなければならず、コードの見通しが悪くなる
    - **BFSを選んだ理由**: `VecDeque` の長さを「今の階のサイズ」として使うことで、深さ情報を持ち回らずに階層分けが自然に実現できる

- **Rust特有の最適化ポイント**:
    - `Rc::clone(&node)` は参照カウントのインクリメントのみ。ヒープアロケーション（＝ヒープ上に新しくメモリを確保する操作）は発生しない
    - `borrow()` の返す `Ref<T>`（＝`RefCell` の共有借用ガード）はスコープを出ると自動的に解放されるため、借用の管理が明確

> 📖 **このセクションで登場した用語**
>
> - **ゼロコスト抽象化**：便利な高レベルな書き方をしても、手書きの低レベルコードと同じ速さになるRustの特性
> - **`Ref<T>`**：`RefCell<T>` の `borrow()` が返す型。スコープを抜けると自動的に借用が解放されるRAIIガード

---

## 4. 実装コード

> 💡 **コードの大まかな骨格**
>
> 1. `root` が `None` なら空 `Vec` を即返す
> 2. `VecDeque` にルートを積んで BFS 開始
> 3. ループ毎に「今の階のサイズ」を `len()` で固定し、その分だけ `pop_front()`
> 4. 各ノードの値を今の階の配列に追加し、`left`/`right` の子があれば次の階としてキューに積む
> 5. 階ごとの配列を `result` に追加して返す

```rust
use std::cell::RefCell;
use std::collections::VecDeque;
use std::rc::Rc;

// LeetCode が提供する TreeNode 定義（提出時はそのまま使う）
// #[derive(Debug, PartialEq, Eq)]
// pub struct TreeNode {
//   pub val: i32,
//   pub left: Option<Rc<RefCell<TreeNode>>>,
//   pub right: Option<Rc<RefCell<TreeNode>>>,
// }

impl Solution {
    pub fn level_order(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<Vec<i32>> {
        // ───────────────────────────────────────────────────────────────
        // ① root が None（木が空）の場合は空ベクタを返す
        //    Option<T> を「中身があるかないかが分かる箱」として扱う。
        //    Javaの null と異なり、None チェックを忘れるとコンパイルエラーになるため
        //    ここで弾き忘れることが構造上ありえない。
        // ───────────────────────────────────────────────────────────────
        let root = match root {
            None => return vec![],   // None なら即終了
            Some(node) => node,      // Some なら中身（Rc<RefCell<TreeNode>>）を取り出す
        };

        // ───────────────────────────────────────────────────────────────
        // ② 最終的な結果を格納する2次元ベクタ
        //    result[0] = 深さ0のノード値の配列、result[1] = 深さ1 ... となる
        // ───────────────────────────────────────────────────────────────
        let mut result: Vec<Vec<i32>> = Vec::new();

        // ───────────────────────────────────────────────────────────────
        // ③ 両端キュー（VecDeque）を用意し、ルートノードを入れる
        //    VecDeque を使う理由：Vec の先頭取り出しは O(n) だが
        //    VecDeque の pop_front() は O(1) で済むため、キューとして最適
        // ───────────────────────────────────────────────────────────────
        let mut queue: VecDeque<Rc<RefCell<TreeNode>>> = VecDeque::new();
        queue.push_back(root); // ルートをキューに追加

        // ───────────────────────────────────────────────────────────────
        // ④ キューが空になるまでループ（= 全ノードを処理し終えるまで）
        // ───────────────────────────────────────────────────────────────
        while !queue.is_empty() {
            // 今この瞬間のキューの長さ = 「現在の階のノード数」
            // この値を先に固定するのが BFS の核心。
            // ループ中に queue.len() は変化するため、変数に保存しておく。
            let level_size = queue.len();

            // 今の階のノード値を格納する一時ベクタ
            let mut level_values: Vec<i32> = Vec::with_capacity(level_size);
            // with_capacity(n) は「n個分のメモリを事前に確保」する。
            // push のたびに再アロケーションが起きるのを防ぐため。

            // 今の階のノードを「level_size 個分」だけ取り出す
            for _ in 0..level_size {
                // pop_front() でキューの先頭からノードを O(1) で取り出す
                // while !is_empty() のループ内なので必ず Some になるが、
                // 安全のため unwrap() ではなく if let で受け取る
                let node_rc = queue.pop_front().unwrap();
                // unwrap() を使う根拠：直上の is_empty() チェックにより
                // pop_front() が None を返すことはこのスコープでありえない

                // ──────────────────────────────────────────────────────
                // ⑤ RefCell の borrow() で共有参照を取得する
                //    borrow() は「読み取り専用の貸し出し」を意味する。
                //    borrow_mut() は「書き込み可能な貸し出し」で、同時に
                //    1つしか存在できない（実行時に panic する）。
                //    今回は読み取りのみなので borrow() で十分。
                // ──────────────────────────────────────────────────────
                let node = node_rc.borrow();
                // node は Ref<TreeNode> 型。スコープを抜けると自動解放される。

                // ノードの値を今の階の配列に追加
                level_values.push(node.val);

                // ──────────────────────────────────────────────────────
                // ⑥ 子ノードをキューに追加する（次の階の準備）
                //    Rc::clone(&child) は所有権を移さず参照カウントを増やすだけ。
                //    「clone」という名前だがヒープ上のデータはコピーされない（安価）。
                //    JavaやPythonでの参照コピーと同じ感覚で使える。
                // ──────────────────────────────────────────────────────
                if let Some(left) = &node.left {
                    queue.push_back(Rc::clone(left));
                }
                if let Some(right) = &node.right {
                    queue.push_back(Rc::clone(right));
                }
                // node（Ref<TreeNode>）はここでスコープを抜け、borrow が解放される
            }

            // 今の階の値配列を結果に追加
            result.push(level_values);
        }

        result
    }
}
```

---

### 🔍 動作トレース（`root = [3, 9, 20, null, null, 15, 7]`）

```
ツリー:
    3
   / \
  9  20
     / \
    15   7

初期状態:
  queue  = [Node(3)]
  result = []

━━━━━━━━━━ while ループ 1回目（深さ0） ━━━━━━━━━━
  level_size   = 1
  level_values = []

  i=0: pop_front() → node_rc = Rc<Node(3)>   queue = []
       node = node_rc.borrow() → val=3
       level_values.push(3)   → [3]
       left  = Some(Node(9))  → Rc::clone → queue.push_back   queue = [Node(9)]
       right = Some(Node(20)) → Rc::clone → queue.push_back   queue = [Node(9), Node(20)]
       node（Ref）スコープ終了 → borrow 解放

  result.push([3]) → result = [[3]]

━━━━━━━━━━ while ループ 2回目（深さ1） ━━━━━━━━━━
  level_size   = 2
  level_values = []

  i=0: pop_front() → node_rc = Rc<Node(9)>    queue = [Node(20)]
       node.val = 9   level_values = [9]
       left = None  → スキップ
       right= None  → スキップ

  i=1: pop_front() → node_rc = Rc<Node(20)]   queue = []
       node.val = 20  level_values = [9, 20]
       left  = Some(Node(15)) → queue = [Node(15)]
       right = Some(Node(7))  → queue = [Node(15), Node(7)]

  result.push([9,20]) → result = [[3], [9, 20]]

━━━━━━━━━━ while ループ 3回目（深さ2） ━━━━━━━━━━
  level_size   = 2
  level_values = []

  i=0: pop_front() → Node(15)   queue = [Node(7)]
       node.val = 15  level_values = [15]
       left = None, right = None → スキップ

  i=1: pop_front() → Node(7)    queue = []
       node.val = 7   level_values = [15, 7]
       left = None, right = None → スキップ

  result.push([15,7]) → result = [[3], [9, 20], [15, 7]]

━━━━━━━━━━ queue が空 → ループ終了 ━━━━━━━━━━
戻り値: [[3], [9, 20], [15, 7]] ✅
```

---

### 💡 `Rc::clone()` の動きを図で理解する

```
Rc::clone(&node) を呼ぶ前：
  Rc<Node(20)> ← 参照カウント = 1（queue が所持）

Rc::clone(&node.left) 後：
  Rc<Node(9)> ← 参照カウント = 2（旧 queue + 新 queue が所持）

pop_front() で旧 queue から取り出され、スコープ終了時：
  Rc<Node(9)> ← 参照カウント = 1（新 queue のみ）
  → カウントが 0 にならない限りメモリは解放されない
  → カウントが 0 になったとき初めて Drop（メモリ解放）が呼ばれる
```

---

### ✅ LeetCode 提出フォーマット（そのままコピー可）

```rust
// Runtime 0 ms
// Beats 100.00%
// Memory 2.39 MB
// Beats 87.85%

use std::cell::RefCell;
use std::collections::VecDeque;
use std::rc::Rc;

impl Solution {
    pub fn level_order(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<Vec<i32>> {
        let root = match root {
            None => return vec![],
            Some(node) => node,
        };

        let mut result: Vec<Vec<i32>> = Vec::new();
        let mut queue: VecDeque<Rc<RefCell<TreeNode>>> = VecDeque::new();
        queue.push_back(root);

        while !queue.is_empty() {
            let level_size = queue.len();
            let mut level_values: Vec<i32> = Vec::with_capacity(level_size);

            for _ in 0..level_size {
                let node_rc = queue.pop_front().unwrap();
                let node = node_rc.borrow();
                level_values.push(node.val);

                if let Some(left) = &node.left {
                    queue.push_back(Rc::clone(left));
                }
                if let Some(right) = &node.right {
                    queue.push_back(Rc::clone(right));
                }
            }

            result.push(level_values);
        }

        result
    }
}
```

> 📖 **このセクションで登場した用語**
>
> - **`VecDeque::pop_front()`**：キューの先頭要素を O(1) で取り出し、`Option<T>` で返すメソッド。`Vec::remove(0)` は O(n) なので絶対に使わない
> - **`Vec::with_capacity(n)`**：n 個分のメモリを事前確保してベクタを作る。後から `push` しても再アロケーションが発生しない
> - **`Ref<T>`**：`RefCell<T>::borrow()` が返す型。RAII（＝スコープを抜けると自動でリソースを解放する仕組み）により、スコープ終了時に借用ガードが自動解放される
> - **`if let Some(x) = &opt`**：`Option` が `Some` のときだけ中身を取り出してブロックを実行するパターンマッチの省略形。`match` の代替として読みやすい
> - **RAII**：Resource Acquisition Is Initialization。変数のスコープと資源（メモリ・ファイル・ロックなど）の有効期間を一致させるRustの根本的な設計思想

---

## 5. 計算量まとめ

| 項目           | 値   | 理由                                                                            |
| -------------- | ---- | ------------------------------------------------------------------------------- |
| **時間計算量** | O(n) | 各ノードをキューへの追加・取り出しで1回ずつ処理。`Rc::clone` は O(1)            |
| **空間計算量** | O(n) | キューに最大で「最も広い階のノード数」が入る。最悪 n/2 個（完全二分木の最下層） |
