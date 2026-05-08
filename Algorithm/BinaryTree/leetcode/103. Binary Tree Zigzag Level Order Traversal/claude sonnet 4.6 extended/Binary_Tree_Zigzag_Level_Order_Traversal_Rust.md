> 🎯 **[algo-beginner スキル発火]**
> 言語/カテゴリ: Rust
> 適用ルールセット: 共通5ルール + Rust固有5ルール
> 参照ファイル: references/common.md + references/rust.md

---

# 1. 問題の分析

> 💡 **この問題は一言で言うと**「`Rc<RefCell<TreeNode>>` という複雑な所有権構造を持つ二分木を、階層ごとにジグザグ（左→右、右→左と交互）に読み取る問題」です。

## Rustで解く際に特に気をつけるべき点

LeetCodeのRust版では木のノードが `Option<Rc<RefCell<TreeNode>>>` という型で定義されています。これはTypeScript版の `TreeNode | null` と比べてかなり複雑に見えますが、**Rustの所有権ルールを守りながら「複数の箇所から同じノードを参照できる」ことを安全に実現するための仕組み**です。この型の読み解き方が実装の鍵になります。

## 競技プログラミング視点での分析

- `VecDeque`（＝両端から追加・取り出しができる効率的なキュー）を使ったBFSで全ノードを一度だけ訪問する → 時間計算量 **O(n)**
- 追加のヒープアロケーション（＝動的にメモリを確保する操作）は各階層の結果格納用 `Vec` のみ → 空間計算量 **O(n)**
- `Rc::clone()` は参照カウント（＝何箇所から参照されているかの数）をインクリメントするだけなので、データのコピーは発生しない

## 業務開発視点での分析

- `root` が `None`（空ツリー）のケースは最初にガード節で早期リターン
- `borrow()` で `RefCell` の中身を安全に読み取り、パニックのリスクを最小限に抑える
- 各階層の反転判定は `result.len() % 2 == 1` という明示的な条件で可読性を確保

## Rust特有の考慮点

| 概念         | この問題での使われ方                                                                   |
| ------------ | -------------------------------------------------------------------------------------- |
| `Option<T>`  | ノードの子が存在するかどうかを `None` / `Some(...)` で安全に表現                       |
| `Rc<T>`      | キューへのノード格納時に所有権を複製せず参照カウントを増やすだけ                       |
| `RefCell<T>` | 実行時に `borrow()` して中身を読み取る（コンパイル時に読み取り専用を保証できないため） |
| `VecDeque`   | `push_back` / `pop_front` が O(1) の効率的キュー                                       |

> 📖 **このセクションで登場した用語**
>
> - **所有権**：値を「誰が管理するか」をコンパイル時に決めるRust独自の仕組み。メモリを自動で安全に管理できる
> - **`Rc<T>`**：Reference Counted（参照カウント）の略。複数の場所から同じ値を「共同所有」できる仕組み。本の「図書館への登録」で何人が参照しているか管理するイメージ
> - **`RefCell<T>`**：通常Rustは「借用はコンパイル時にチェック」するが、`RefCell` は実行時にチェックする特殊な箱。ツリーのように再帰構造で内部を変更する際に必要
> - **`VecDeque`**：配列の先頭・末尾どちらにも O(1) で追加・取り出しできるキュー構造

---

# 2. アルゴリズムアプローチ比較

> 💡 同じ問題でも解き方は複数あります。Rustでは「**ヒープアロケーションの回数**」と「**所有権の移動が発生するか**」が実装難易度に直結するため、その観点も含めて比較します。

| アプローチ                           | 時間計算量 | 空間計算量 | Rust実装コスト | 安全性 | 可読性 | 備考                                          |
| ------------------------------------ | ---------- | ---------- | -------------- | ------ | ------ | --------------------------------------------- |
| **BFS + 偶奇で reverse**             | O(n)       | O(n)       | **低**         | 高     | ⭐高   | `VecDeque` + `reverse()` のみ。所有権移動なし |
| BFS + `VecDeque` の先頭/末尾交互挿入 | O(n)       | O(n)       | 中             | 高     | 中     | `push_front` / `push_back` 切り替え。やや複雑 |
| DFS（深さ優先）+ 各階層に `push`     | O(n)       | O(n)+O(h)  | 中             | 高     | 中     | 再帰スタックが高さ h 分追加。偏った木で危険   |
| ブルートフォース（全格納後に整理）   | O(n²)      | O(n)       | 低             | 高     | 低     | `reverse` が各階層で O(k)。非効率             |

> 📖 **このセクションで登場した用語**
>
> - **時間計算量**：ノード数に対して処理の手間がどう増えるかの目安
> - **空間計算量**：処理中に使うメモリ量がどう増えるかの目安
> - **ヒープアロケーション**：`Vec` や `Rc` などの動的メモリ確保操作。スタックより低速
> - **再帰スタック**：関数が自分自身を呼び出すたびに積まれるメモリ。深い木では溢れる可能性がある（スタックオーバーフロー）

---

# 3. 選択したアルゴリズムと理由

- **選択したアプローチ**: **BFS（`VecDeque` キュー）+ 偶数階層はそのまま / 奇数階層は `.reverse()`**

| 観点                                | 理由                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------ |
| 計算量                              | 全ノードを一度だけ訪問する O(n)。`reverse()` は各階層サイズ O(k) で合計 O(n)         |
| 所有権との相性                      | `Rc::clone()` で参照カウントを増やすだけ。データのコピーや所有権移動が不要           |
| 可読性                              | 「BFSで階層を読んで偶奇で反転する」という意図がコードから直読できる                  |
| DFSを選ばなかった理由               | 制約「ノード数最大2000」でも偏った木（一方向に連なる木）では再帰深度が2000に達し危険 |
| 先頭/末尾交互挿入を選ばなかった理由 | `push_front` と `push_back` の切り替えロジックが複雑になり、バグの温床になりやすい   |

## Rust特有の最適化ポイント

`Rc::clone()` はデータをコピーせず、参照カウンタ（内部の整数）を +1 するだけなので **O(1) コスト**。JavaやPythonのオブジェクト参照と似ていますが、Rustはカウントがゼロになった瞬間に自動でメモリを解放します（ガベージコレクタ不要）。

> 📖 **このセクションで登場した用語**
>
> - **ゼロコスト抽象化**：`.iter()` や `.reverse()` などの便利な書き方をしても、手書きの低レベルコードと同等の速さになるRustの特性
> - **参照カウント**：「今何箇所からこの値が参照されているか」を数える整数。0になった時点でメモリを解放する仕組み
> - **スタックオーバーフロー**：再帰呼び出しが深くなりすぎてスタックメモリが溢れるエラー

---

# 4. 実装コード

> 💡 **コードの大まかな構造（骨格）**
>
> 1. `root` が `None` なら空の `Vec` を即リターン（ガード節）
> 2. `VecDeque` にルートノードを入れて BFS 開始
> 3. 現在階層のノード数を固定し、全ノードを取り出して値を収集・子をキューに追加
> 4. `result.len() % 2 == 1` が奇数なら `reverse()` で逆順にする
> 5. 全階層を処理した `result` を返す

```rust
use std::cell::RefCell;
use std::collections::VecDeque;
use std::rc::Rc;

impl Solution {
    pub fn zigzag_level_order(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<Vec<i32>> {

        // ── ガード節 ──────────────────────────────────────────────
        // root が None（空ツリー）なら即座に空の Vec を返す。
        // Rustの Option<T> は「値があるかないかを型で表現する箱」。
        // JavaやPythonの null 参照と違い、None かどうかを確認しないと
        // 中身にアクセスできないようになっている（コンパイルが通らない）ため安全。
        let root = match root {
            None => return vec![],  // None なら空配列を即返す
            Some(node) => node,     // Some なら中身の Rc<RefCell<TreeNode>> を取り出す
        };

        // ── 結果格納用の Vec の初期化 ─────────────────────────────
        // 各階層の値の Vec を順に格納していく最終結果。
        let mut result: Vec<Vec<i32>> = Vec::new();

        // ── VecDeque（両端キュー）の初期化 ──────────────────────
        // VecDeque は配列の先頭・末尾どちらにも O(1) で操作できるデータ構造。
        // 通常の Vec で先頭取り出し（.remove(0)）を行うと O(n) のコストがかかるため、
        // BFS のキューには必ず VecDeque を使うのが Rust の慣習。
        // Rc<RefCell<TreeNode>> を格納する。Rc::clone() は参照カウントを +1 するだけ
        // なので、データのコピーは発生しない（コストは O(1)）。
        let mut queue: VecDeque<Rc<RefCell<TreeNode>>> = VecDeque::new();
        queue.push_back(root); // ルートノードをキューの末尾に追加

        // ── BFS メインループ ──────────────────────────────────────
        // キューが空になるまで繰り返す。
        // 「キューが空 = 未処理のノードがなくなった」ことを意味する。
        while !queue.is_empty() {

            // 現在の階層にいるノード数を「今」確定させる。
            // ループ中に子ノードをキューへ追加していくので、
            // 「今の階層のノード数」をループ開始時点で固定しておかないと
            // 次の階層のノードまで同じ階層として処理してしまう。
            let level_size = queue.len();

            // この階層のノード値を格納する一時 Vec。
            // 偶奇判定後に逆順にするため、先に全値を収集する。
            let mut level_values: Vec<i32> = Vec::with_capacity(level_size);
            // with_capacity は「この階層のノード数分だけ先にメモリを確保」する。
            // push するたびに再アロケーション（メモリ拡張）が起きるのを防ぐための最適化。

            // ── 現在の階層を全て処理する ──────────────────────────
            for _ in 0..level_size {

                // キューの先頭からノードを取り出す。
                // pop_front() は Option<T> を返すが、
                // level_size 回のループ内では必ず Some(_) が返ることが
                // 構造上保証されているため unwrap() してよい。
                // （queue が空になるのは level_size 回取り出した後なので）
                let node_rc = queue.pop_front().unwrap();

                // RefCell の borrow() で中身を読み取る。
                // Rust の借用チェッカーはコンパイル時に「同時に複数の可変参照がない」を
                // チェックするが、Rc<RefCell<T>> の場合は実行時チェックになる。
                // borrow() は「読み取り専用の参照」を返す（書き込みは borrow_mut()）。
                // node_ref はこのスコープを抜けると自動で解放されるため安全。
                let node_ref = node_rc.borrow();

                // 現在ノードの値を収集する。
                // ジグザグ処理は後でまとめて行うため、ここでは単純に追加。
                level_values.push(node_ref.val);

                // 左の子ノードが存在すれば次の階層用にキューへ追加する。
                // if let は「Option の中身が Some だった場合だけ処理する」書き方。
                // Rc::clone() はデータをコピーせず参照カウントを +1 するだけ（O(1) コスト）。
                if let Some(left) = node_ref.left.as_ref() {
                    queue.push_back(Rc::clone(left));
                }

                // 右の子ノードも同様にキューへ追加する。
                if let Some(right) = node_ref.right.as_ref() {
                    queue.push_back(Rc::clone(right));
                }

                // node_ref はここでスコープを抜け、borrow() が解放される。
                // これにより RefCell の実行時借用チェックが正常にリセットされる。
            }

            // ── ジグザグ処理（偶奇による方向切り替え）────────────
            // result.len() は「今まで完了した階層数」と等しい。
            //   result.len() が偶数（0, 2, 4…）→ 左→右（そのまま）
            //   result.len() が奇数（1, 3, 5…）→ 右→左（逆順）
            // .reverse() は Vec を「破壊的に（元の Vec を直接変えて）」逆順にする。
            // level_values はこの後使わないので、新しい Vec を作るより効率的。
            if result.len() % 2 == 1 {
                level_values.reverse();
            }

            // 処理済み階層の値を最終結果に追加する。
            result.push(level_values);
        }

        // 全階層を処理した結果を返す。
        // Rust では関数の最後に書いた式が戻り値になる（セミコロンなし）。
        result
    }
}
```

---

# 5. 動作トレース

入力: `root = [3, 9, 20, null, null, 15, 7]`

```
【ツリーの形状】
        3          ← 階層 0（result.len()=0 → 偶数 → 左→右）
       / \
      9   20       ← 階層 1（result.len()=1 → 奇数 → 右→左）
         /  \
        15   7     ← 階層 2（result.len()=2 → 偶数 → 左→右）

┌─────────────────────────────────────────────────────────────────┐
│ 初期状態                                                         │
│   queue   = [Rc(Node{val:3})]                                   │
│   result  = []                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Step 1: 階層 0 の処理（result.len()=0 → 偶数 → そのまま）        │
│                                                                 │
│   level_size = 1                                                │
│   ─ pop_front() → Node{val:3} を取り出す                        │
│       borrow() → val=3 を読み取る → level_values = [3]         │
│       left=Some(Node{9})  → Rc::clone して queue に push_back  │
│       right=Some(Node{20}) → Rc::clone して queue に push_back │
│       borrow() スコープ終了 → RefCell 解放                      │
│                                                                 │
│   result.len()=0 → 偶数 → reverse しない                        │
│   result.push([3])                                              │
│                                                                 │
│   queue  = [Rc(Node{9}), Rc(Node{20})]                         │
│   result = [[3]]                                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Step 2: 階層 1 の処理（result.len()=1 → 奇数 → 逆順）           │
│                                                                 │
│   level_size = 2                                                │
│   ─ pop_front() → Node{val:9}  → level_values = [9]            │
│       left=None, right=None → queue への追加なし                │
│   ─ pop_front() → Node{val:20} → level_values = [9, 20]        │
│       left=Some(Node{15}) → push_back                          │
│       right=Some(Node{7})  → push_back                         │
│                                                                 │
│   result.len()=1 → 奇数 → reverse() → [20, 9]                  │
│   result.push([20, 9])                                          │
│                                                                 │
│   queue  = [Rc(Node{15}), Rc(Node{7})]                         │
│   result = [[3], [20, 9]]                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Step 3: 階層 2 の処理（result.len()=2 → 偶数 → そのまま）        │
│                                                                 │
│   level_size = 2                                                │
│   ─ pop_front() → Node{val:15} → level_values = [15]           │
│       left=None, right=None → 追加なし                          │
│   ─ pop_front() → Node{val:7}  → level_values = [15, 7]        │
│       left=None, right=None → 追加なし                          │
│                                                                 │
│   result.len()=2 → 偶数 → reverse しない → [15, 7]              │
│   result.push([15, 7])                                          │
│                                                                 │
│   queue  = [] (空)                                              │
│   result = [[3], [20, 9], [15, 7]]                              │
└─────────────────────────────────────────────────────────────────┘

✅ while !queue.is_empty() が false → ループ終了
🎉 最終出力: [[3], [20, 9], [15, 7]]
```

---

# `Rc<RefCell<TreeNode>>` の仕組みを図解

LeetCodeのRust版ツリーで使われるこの型は「3層の入れ子」になっています。

```
Option<  Rc<  RefCell<TreeNode>  >  >
  │       │        │
  │       │        └─ TreeNode の実データを包む「実行時借用チェック箱」
  │       │           → borrow() で読み取り参照を取り出せる
  │       │
  │       └─ 参照カウントポインタ
  │           → Rc::clone() で所有者を増やせる（データコピーなし）
  │           → 全所有者がいなくなると自動でメモリ解放
  │
  └─ ノードが存在するか(Some)しないか(None) の表現
      → None = 子ノードなし（null の安全な代替）
```

| 他言語                           | Rustでの対応                | 違い                                    |
| -------------------------------- | --------------------------- | --------------------------------------- |
| Java: `TreeNode node = null;`    | `Option<Rc<...>>` の `None` | null 参照エラーがコンパイル時に防がれる |
| Java: `node.left`                | `node_ref.left.as_ref()`    | `borrow()` が必要（実行時安全チェック） |
| Python: オブジェクト参照のコピー | `Rc::clone()`               | データコピーなし・参照カウント +1 のみ  |

---

# LeetCode 提出コード（最終版）

```rust
// Runtime 0 ms
// Beats 100.00%
// Memory 2.18 MB
// Beats 97.14%

use std::cell::RefCell;
use std::collections::VecDeque;
use std::rc::Rc;

impl Solution {
    pub fn zigzag_level_order(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<Vec<i32>> {
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
                let node_ref = node_rc.borrow();
                level_values.push(node_ref.val);

                if let Some(left) = node_ref.left.as_ref() {
                    queue.push_back(Rc::clone(left));
                }
                if let Some(right) = node_ref.right.as_ref() {
                    queue.push_back(Rc::clone(right));
                }
            }

            if result.len() % 2 == 1 {
                level_values.reverse();
            }
            result.push(level_values);
        }

        result
    }
}
```

---

> 📖 **このセクションで登場した用語**
>
> - **`VecDeque`**：先頭・末尾どちらにも O(1) で追加・取り出しができるキュー。レジの行列と同じ「先に来た人が先に出る（FIFO）」構造
> - **`Rc<T>`**：複数箇所から同じ値を共同所有できるスマートポインタ。`Rc::clone()` はデータをコピーせず参照カウントを +1 するだけ
> - **`RefCell<T>`**：通常コンパイル時の借用チェックを、実行時チェックに切り替える特殊な箱。ツリー構造のような複雑な場合に使う
> - **`borrow()`**：`RefCell<T>` の中身を読み取り専用で借用するメソッド。スコープを抜けると自動で解放される
> - **`if let Some(x) = option`**：`Option` の中身が `Some` だった場合だけ処理する構文。`match` の省略形
> - **`with_capacity(n)`**：`Vec` を作る際に n 個分のメモリを先に確保する。追加のたびに再アロケーションが起きるのを防ぐ最適化
> - **`unwrap()`**：`Option<T>` や `Result<T, E>` の中身を取り出す。`None` / `Err` の場合はパニックするため、「絶対に `Some` が来る」と構造的に保証できる場合のみ使う
> - **`.reverse()`**：`Vec` を破壊的に（元のデータを直接変更して）逆順にするメソッド
