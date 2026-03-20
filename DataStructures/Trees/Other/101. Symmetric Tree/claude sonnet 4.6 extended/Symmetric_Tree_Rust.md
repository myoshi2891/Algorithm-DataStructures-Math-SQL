# 🌳 Symmetric Tree — Rust 完全解説

---

## 1. 問題の分析

> 💡 **初学者向け補足**：この問題は一言で言うと「**二分木が中心軸に対して鏡写しになっているかを確認する問題**」です。
> Rustで解く際の最大の特徴は、LeetCodeのノード型が `Option<Rc<RefCell<TreeNode>>>` という**複合型**になっている点です。「値があるかもしれない（Option）」「複数箇所から参照できる（Rc）」「中身を後から変更できる（RefCell）」という3層構造を正しく理解することが鍵になります。

---

### 🖼️ まず「対称」を視覚的に理解する

```
【対称な木 ✅】              【非対称な木 ❌】

       1                           1
      / \                         / \
     2   2                       2   2
    / \ / \                       \   \
   3  4 4  3                       3   3

中心軸を境に                    右の2に left がなく
左右が完全に鏡写し              right しかないので非対称
```

---

### 競技プログラミング視点での分析

- ノード数は最大1000と小さいため、全ノードを1回訪問する **O(n)** で十分
- `Rc::clone()` は参照カウントを増やすだけで**ヒープコピーは発生しない**（O(1)）
- 再帰深度は最大1000なのでスタックオーバーフローの心配はほぼなし

### 業務開発視点での分析

- `Option<T>` で「ノードが存在しない（null）」を型レベルで表現できる
- `Rc<RefCell<T>>` の扱いで「いつ `borrow()` するか」「いつ `clone()` するか」を意識する必要がある
- LeetCodeの型定義はそのまま使うため、独自エラー型は定義しない（`bool` を直接返す）

### Rust特有の考慮点

```
Option<Rc<RefCell<TreeNode>>> を分解すると…

Option<...>         → ノードが「ある」か「ない」か（nullの代わり）
     Rc<...>        → 複数の変数から同じノードを「共有参照」できる
         RefCell<...> → コンパイル時ではなく実行時に借用チェックを行う
                TreeNode → 実際のノードデータ（val, left, right）
```

> 📖 **このセクションで登場した用語**
>
> - **所有権**：値を"誰が管理するか"をコンパイル時に決めるRust独自の仕組み
> - **`Rc<T>`（Reference Counted）**：参照カウント式の共有所有権。木構造のように複数箇所から同じノードを参照する場面で使う。Javaの参照変数に近いが、カウントが0になった瞬間に自動でメモリ解放される
> - **`RefCell<T>`**：通常Rustは「借用は1つの`&mut T`か複数の`&T`」というルールをコンパイル時に強制するが、`RefCell`はそのチェックを**実行時**に行う仕組み。木構造の再帰操作で必要になる
> - **`Option<T>`**：値が「ある（`Some(T)`）」か「ない（`None`）」かを型で表現。他言語の`null`と違い、チェックを忘れるとコンパイルエラーになる

---

## 2. アルゴリズムアプローチ比較

> 💡 **初学者向け補足**：同じ問題でも解き方は複数あります。Rustでは特に「所有権の移動が発生するか」「ヒープアロケーションが必要か」がパフォーマンスに影響します。

| アプローチ              | 時間計算量 | 空間計算量 | Rust実装コスト | 安全性 | 可読性 | 備考                                  |
| ----------------------- | ---------- | ---------- | -------------- | ------ | ------ | ------------------------------------- |
| **A: 再帰（DFS）**      | O(n)       | O(h)       | 低             | 高     | 最高   | `Rc::clone()`で所有権を移さず参照共有 |
| **B: 反復（VecDeque）** | O(n)       | O(w)       | 中             | 高     | 高     | スタックオーバーフロー耐性あり        |
| **C: 配列シリアライズ** | O(n)       | O(n)       | 高             | 中     | 低     | `Vec`アロケーションが多発、非推奨     |

> ※ **h = 木の高さ**、**w = 木の最大幅**。最悪ケースはどちらもO(n)

---

> 💡 **Rust固有の観点**
>
> - **方法A**：`Rc::clone()` は参照カウントをインクリメントするだけ（ヒープコピーなし）。`borrow()` でスコープを限定して借用し、スコープを抜けると自動で解放される
> - **方法B**：`VecDeque` はヒープアロケーションが発生するが、深い木でもスタックを消費しない
> - **方法C**：`Vec<Option<i32>>` を作るために多くのアロケーションが発生し非効率

---

> 📖 **このセクションで登場した用語**
>
> - **`Rc::clone()`**：`Rc` の参照カウントを1増やすだけの軽量操作。値の実体をコピーするわけではない
> - **`borrow()`**：`RefCell` の中身を読み取り専用で借用するメソッド。借用スコープを抜けると自動解放
> - **`VecDeque`**：両端キュー（先頭・末尾どちらにも追加・削除できるコレクション）

---

## 3. 選択したアルゴリズムと理由

> 💡 **初学者向け補足**：「なぜこれを選ばなかったか」を対比で説明します。

- **選択したアプローチ**：**A（再帰）をメイン、B（反復）をフォローアップ**で両方実装
- **理由**：
    - **方法C（シリアライズ）は選ばない**：`Vec` のアロケーションが多発し、null位置のエンコードも複雑になるため
    - **方法A（再帰）を選ぶ**：「鏡写しの定義」がコードにそのまま現れる直感的な構造。`Rc::clone()` の軽量コピーと `borrow()` の自動解放でメモリ安全に記述できる
    - **方法B（反復）もフォローアップで実装**：深さ1000の一直線の木では再帰深度が1000になりうるため、万全を期す

- **Rust特有の最適化ポイント**：
    - `Rc::clone()` はポインタコピーのみ（ゼロコスト抽象化）
    - `borrow()` が返す `Ref<T>` はスコープを抜けた瞬間に借用が自動解放される（RAII）
    - `Option` のパターンマッチングはコンパイル時に全ケースの網羅チェックが行われる

> 📖 **このセクションで登場した用語**
>
> - **ゼロコスト抽象化**：便利な高レベルな書き方をしても、手書きの低レベルコードと同等の速さになるRustの特性
> - **RAII（Resource Acquisition Is Initialization）**：変数がスコープを抜けると自動でリソース（メモリ・ロックなど）が解放される仕組み。`drop()` が自動で呼ばれる
> - **パターンマッチング**：`match` や `if let` を使って、値の「形（パターン）」に応じて処理を分岐させる仕組み

---

## 4. 実装コード

> 💡 **初学者向け補足**：コードの骨格を先に示します。
>
> 1. `is_symmetric`：エントリーポイント。`root` を受け取り `is_mirror` に渡す
> 2. `is_mirror`（再帰版）：2つのノードが鏡写しかを再帰で確認
> 3. `is_symmetric_iterative`（反復版）：`VecDeque` で対称ペアを順番に確認

---

### ✅ 解法① 再帰（Recursive DFS）

Runtime 0 ms
Beats 100.00%
Memory 2.25 MB
Beats 60.71%

```rust
use std::rc::Rc;
use std::cell::RefCell;

impl Solution {
    pub fn is_symmetric(root: Option<Rc<RefCell<TreeNode>>>) -> bool {
        // rootがNone（空の木）は定義上「対称」
        // LeetCodeの制約では最低1ノードあるが、型上Noneがあり得るため処理する
        match root {
            None => true,
            // Someの場合はrootの左子・右子を鏡判定ヘルパーに渡す
            Some(node) => {
                // node.borrow() でRefCell<TreeNode>の中身を読み取り専用借用する
                // .left / .right はそれぞれ Option<Rc<RefCell<TreeNode>>> 型
                let borrowed = node.borrow();
                Self::is_mirror(
                    borrowed.left.clone(),  // Rc::clone()：参照カウント+1のみ（値コピーなし）
                    borrowed.right.clone(), // 同上
                )
            }
        }
    }

    /// 2つのノードが「鏡写し」の関係かどうかを再帰的に確認するヘルパー関数
    ///
    /// # Rustの型上の設計ポイント
    /// - 引数は `Option<Rc<RefCell<TreeNode>>>` を所有権ごと受け取る
    /// - `Rc::clone()` で渡しているため呼び出し元のデータは消えない
    ///
    /// # Complexity
    /// - Time: O(n) — 全ノードを1回ずつ訪問
    /// - Space: O(h) — 再帰呼び出しのスタック深度（h=木の高さ）
    fn is_mirror(
        left: Option<Rc<RefCell<TreeNode>>>,
        right: Option<Rc<RefCell<TreeNode>>>,
    ) -> bool {
        match (left, right) {
            // ケース①：両方None → 「空同士」は対称 → true
            // 例：葉ノードの子（存在しない位置）同士を比較した場合
            (None, None) => true,

            // ケース②：片方だけNone → 「一方だけ枝がある」→ 非対称 → false
            // (Some(_), None) と (None, Some(_)) の両方をまとめて捕捉
            (None, Some(_)) | (Some(_), None) => false,

            // ケース③：両方Some → 値を比較して、さらに再帰で内側・外側を確認
            (Some(l_node), Some(r_node)) => {
                // borrow() でRefCellの中身を一時的に読み取り専用借用する
                // この借用はブロックを抜けると自動で解放される（RAII）
                let l = l_node.borrow();
                let r = r_node.borrow();

                // 条件1: 左右の値が同じか？
                l.val == r.val
                // 条件2: 左の「左子」と右の「右子」が鏡写しか？（外側ペア）
                && Self::is_mirror(l.left.clone(), r.right.clone())
                // 条件3: 左の「右子」と右の「左子」が鏡写しか？（内側ペア）
                && Self::is_mirror(l.right.clone(), r.left.clone())
                // ↑ && の短絡評価（Short-circuit）：条件1がfalseの時点で
                //   条件2・3の再帰呼び出しは行われない → 無駄な処理を省く
            }
        }
    }
}
```

---

> 💡 **再帰版のトレース** — Example 1: `[1,2,2,3,4,4,3]`

```
       1
      / \
     2   2
    / \ / \
   3  4 4  3

is_symmetric(root=1)
└─ is_mirror(left=Some(2), right=Some(2))
     ├─ borrow: l.val=2, r.val=2 → 2==2 ✅
     ├─ is_mirror(l.left=Some(3), r.right=Some(3))  ← 外側ペア
     │    ├─ l.val=3, r.val=3 → 3==3 ✅
     │    ├─ is_mirror(None, None) → true ✅
     │    └─ is_mirror(None, None) → true ✅
     │    → true ✅
     └─ is_mirror(l.right=Some(4), r.left=Some(4))  ← 内側ペア
          ├─ l.val=4, r.val=4 → 4==4 ✅
          ├─ is_mirror(None, None) → true ✅
          └─ is_mirror(None, None) → true ✅
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

is_mirror(left=Some(2), right=Some(2))
  ├─ 2==2 ✅
  ├─ is_mirror(l.left=None, r.right=Some(3)) ← 外側ペア
  │    → (None, Some(_)) にマッチ → false ❌ ← 短絡評価で即終了！
  → false ❌ 最終結果: false
```

---

### ✅ 解法② 反復（Iterative BFS with VecDeque）

> 💡 **なぜ `VecDeque` を使うのか**：比較すべき「鏡ペア」を順番に取り出すために**キュー（FIFO）**が必要です。Rustの標準ライブラリには両端キューの `VecDeque` があり、`push_back()` で追加・`pop_front()` で先頭から取り出せます。

Runtime 0 ms
Beats 100.00%
Memory 2.28 MB
Beats 60.71%

```rust

use std::collections::VecDeque;
use std::rc::Rc;
use std::cell::RefCell;

impl Solution {
    pub fn is_symmetric_iterative(root: Option<Rc<RefCell<TreeNode>>>) -> bool {
        // rootがNoneの場合は対称
        let root = match root {
            None => return true,
            Some(n) => n,
        };

        // キュー：比較すべき「鏡ペア」を格納する
        // タプル (左ノード, 右ノード) を並べていく
        // VecDeque はヒープ上に確保される両端キュー
        let mut queue: VecDeque<(
            Option<Rc<RefCell<TreeNode>>>,
            Option<Rc<RefCell<TreeNode>>>,
        )> = VecDeque::new();

        // 最初のペア：rootの左子と右子を追加
        {
            // borrow() のスコープをブロックで限定する
            // → このブロックを抜けると借用が解放され、後続の処理で再借用できる
            let borrowed = root.borrow();
            queue.push_back((borrowed.left.clone(), borrowed.right.clone()));
        }

        // キューが空になるまで（= 全ペアの確認が終わるまで）ループ
        while let Some((left, right)) = queue.pop_front() {
            // while let：Option が Some の間だけループを続ける構文
            // pop_front() は Option<T> を返す（空のキューなら None）

            match (left, right) {
                // 両方None → このペアはOK、次のペアへ
                (None, None) => continue,

                // 片方だけNone → 非対称確定
                (None, Some(_)) | (Some(_), None) => return false,

                // 両方存在する → 値を確認して次のペアをキューに積む
                (Some(l_node), Some(r_node)) => {
                    // 借用スコープをブロックで限定して
                    // clone()した後に借用が解放されるようにする
                    let (l_val, l_left, l_right, r_left, r_right) = {
                        let l = l_node.borrow();
                        let r = r_node.borrow();
                        (
                            l.val,
                            l.left.clone(),   // 外側ペア用：左の左子
                            l.right.clone(),  // 内側ペア用：左の右子
                            r.left.clone(),   // 内側ペア用：右の左子
                            r.right.clone(),  // 外側ペア用：右の右子
                        )
                        // ← このブロックを抜けると l と r の借用が自動解放（RAII）
                    };

                    // 値が異なれば即false
                    if l_val != r_node.borrow().val {
                        return false;
                    }

                    // 次に確認すべき鏡ペアをキューに追加
                    queue.push_back((l_left, r_right));  // 外側ペア
                    queue.push_back((l_right, r_left));  // 内側ペア
                }
            }
        }

        // 全ペアの確認をパスしたので対称
        true
    }
}
```

> ⚠️ **LeetCode提出はシングル `impl Solution` ブロックのみ可**。上記の `is_symmetric_iterative` は学習用です。LeetCode提出コードは下記の最終版をご利用ください。

---

> 💡 **反復版のトレース** — Example 1: `[1,2,2,3,4,4,3]`

```
初期状態: queue = [(Some(2), Some(2))]

─── ループ1回目 ───
取り出し: (Some(2), Some(2))
  l.val=2, r.val=2 → 2==2 ✅
  外側ペア追加: (Some(3), Some(3))
  内側ペア追加: (Some(4), Some(4))
queue = [(Some(3),Some(3)), (Some(4),Some(4))]

─── ループ2回目 ───
取り出し: (Some(3), Some(3))
  3==3 ✅
  外側: (None, None) 追加
  内側: (None, None) 追加
queue = [(Some(4),Some(4)), (None,None), (None,None)]

─── ループ3回目 ───
取り出し: (Some(4), Some(4))
  4==4 ✅
  → (None,None) × 2 追加
queue = [(None,None) × 4]

─── ループ4〜7回目 ───
(None, None) → continue（両方Noneなのでスキップ）× 4回

queue = [] → while let が None → ループ終了
→ return true ✅
```

---

### 📦 LeetCode提出用コード（再帰版・最終版）

```rust
// Runtime 0 ms
// Beats 100.00%
// Memory 2.19 MB
// Beats 91.96%

use std::rc::Rc;
use std::cell::RefCell;

impl Solution {
    pub fn is_symmetric(root: Option<Rc<RefCell<TreeNode>>>) -> bool {
        // rootがNoneなら対称（空の木）
        match root {
            None => true,
            Some(node) => {
                let borrowed = node.borrow();
                // rootの左子と右子が鏡写しかを確認
                Self::is_mirror(borrowed.left.clone(), borrowed.right.clone())
            }
        }
    }

    fn is_mirror(
        left: Option<Rc<RefCell<TreeNode>>>,
        right: Option<Rc<RefCell<TreeNode>>>,
    ) -> bool {
        match (left, right) {
            // 両方Noneなら対称
            (None, None) => true,
            // 片方だけNoneなら非対称
            (None, Some(_)) | (Some(_), None) => false,
            // 両方Someなら値を比較し、外側・内側ペアを再帰確認
            (Some(l), Some(r)) => {
                let l = l.borrow();
                let r = r.borrow();
                l.val == r.val
                    && Self::is_mirror(l.left.clone(), r.right.clone())
                    && Self::is_mirror(l.right.clone(), r.left.clone())
            }
        }
    }
}
```

---

> 📖 **このセクションで登場した用語**
>
> - **`Rc::clone()`**：`Rc<T>` の参照カウントを1増やすだけ。値の実体をコピーするわけではないため O(1) の軽量操作
> - **`borrow()`**：`RefCell<T>` の中身を読み取り専用で借用するメソッド。`Ref<T>` という一時的な借用ガードを返し、スコープを抜けると自動解放（RAII）
> - **`while let`**：`Option` や `Result` が `Some`/`Ok` の間だけループを続ける構文。`loop` + `match` の糖衣構文
> - **短絡評価（Short-circuit evaluation）**：`A && B` でAが `false` なら B を評価せず即 `false` を返す。Rustでも同様に動作し、不要な再帰呼び出しを省ける
> - **`VecDeque`**：標準ライブラリの両端キュー。`push_back` で末尾追加、`pop_front` で先頭取り出し（FIFO）
> - **`continue`**：ループの現在のイテレーションをスキップして次へ進む制御フロー

---

## Rust固有の最適化観点

### `Rc<RefCell<T>>` パターンの理解

```
┌─────────────────────────────────────────────────────┐
│  なぜ Rc<RefCell<TreeNode>> が必要なのか？           │
│                                                      │
│  通常のRust（所有権モデル）:                          │
│    ある値を持てるのは "1人の所有者" だけ              │
│    → 木構造で親・子・隣接ノードが互いを参照できない  │
│                                                      │
│  Rc<T>（参照カウント）:                              │
│    複数の変数が同じデータを共有所有できる             │
│    → 木のノードを複数箇所から参照可能に              │
│                                                      │
│  RefCell<T>（実行時借用チェック）:                   │
│    通常の &mut T は "1つだけ" という制約がある        │
│    → RefCell で実行時チェックに緩和して柔軟に操作    │
└─────────────────────────────────────────────────────┘
```

### 計算量まとめ

| 解法        | 時間計算量 | 空間計算量           |
| ----------- | ---------- | -------------------- |
| 再帰（DFS） | O(n)       | O(h) — hは木の高さ   |
| 反復（BFS） | O(n)       | O(w) — wは木の最大幅 |

どちらも全ノードを1回ずつ訪問するため **O(n)** です。`Rc::clone()` はO(1)なので比較回数に影響しません。空間計算量は木の形状によりますが、最悪ケースはどちらも **O(n)** です（一直線の木 / 完全二分木の最下段にノードが集中する場合）。
