> 🎯 **[algo-beginner スキル発火]**
> 言語/カテゴリ: Rust
> 適用ルールセット: 共通5ルール + Rust固有4ルール
> 参照ファイル: references/common.md + references/rust.md

---

# LeetCode 110 · Balanced Binary Tree — Rust 完全解説

---

## 1. 問題の分析

> 💡 **この問題は一言で言うと**：「すべてのノードで左右の部分木の高さの差が1以内かを判定する問題」です。

---

### 🦀 Rustで解く際に特に気をつけるべき点

この問題をRustで解く上で最大のポイントは **`Option<Rc<RefCell<TreeNode>>>` という型**です。これはLeetCodeがRustで木構造を表現するために使う特殊な型で、「ノードが存在するかもしれない（Option）、複数の場所から参照されるかもしれない（Rc）、ノードの中身を変更するかもしれない（RefCell）」という3つの要件を同時に満たすために組み合わされています。今回は**読み取り専用の再帰DFS（深さ優先探索）**なので `borrow()`（共有借用）だけを使い、`borrow_mut()` は一切不要です。

---

### 競技プログラミング視点での分析

- ノード数は最大5000。再帰の深さはO(h)（木の高さ）
- **番兵値（＝通常あり得ない特別な値でエラーを上位に伝える手法）** `-1` を使った1パスDFSが最速
- `Rc<RefCell<T>>` の `borrow()` は実行時チェックを伴うが、LeetCodeのこの問題では回避不可能

### 業務開発視点での分析

- `Option<Rc<RefCell<TreeNode>>>` の `match` パターンマッチング（＝値の形によって処理を分岐する仕組み）を使い、`None`（ノードなし）と `Some`（ノードあり）を明示的に分離
- 戻り値は `i32`（高さ または `-1`）とシンプルに保ち、追加の `enum` 定義は省略（LeetCode形式の実用性優先）
- 内部ヘルパーをクロージャではなくネスト関数（`fn`）で定義することで、スタックフレームを明確に分離

### Rust特有の考慮点

- **借用**（＝所有権を渡さずに値を参照する仕組み）：ノードを `&Option<Rc<RefCell<TreeNode>>>` で受け取ることで、所有権の移動（move）を防ぐ
- **`Rc::borrow()`**（RefCellの共有借用）：実行時に借用チェックを行う。今回は読み取り専用なので `borrow()` のみ使用
- **ネスト関数**：Rustでは関数の中に関数を定義できる。クロージャと違いライフタイムが単純で推論しやすい

> 📖 **このセクションで登場した用語**
>
> - **所有権**：値を"誰が管理するか"をコンパイル時に決めるRust独自の仕組み。JavaやPythonのGC（ガベージコレクタ）とは異なり、コンパイル時にメモリを自動管理する
> - **`Rc<T>`**：「参照カウント付きポインタ」。複数の場所から同じデータを共有できる。ただしシングルスレッド専用
> - **`RefCell<T>`**：「内部可変性」を持つコンテナ。通常Rustは借用規則をコンパイル時に検査するが、`RefCell` は実行時に検査を先送りする
> - **パターンマッチング**：`match` 式で値の「形」によって処理を分岐する仕組み。Rustのパターンマッチはコンパイラが網羅性を保証する

---

## 2. アルゴリズムアプローチ比較

> 💡 解き方は複数ありますが、Rust固有の視点として「所有権の移動が発生するか」「`Rc` のクローン（参照カウントの増加）が起きるか」も重要な選択基準です。

| アプローチ                        | 時間計算量 | 空間計算量 | Rust実装コスト | 安全性 | 可読性 | 備考                                           |
| --------------------------------- | ---------- | ---------- | -------------- | ------ | ------ | ---------------------------------------------- |
| **① トップダウン再帰（素朴）**    | O(n²)      | O(h)       | 中             | 高     | 中     | 各ノードで高さを再計算。`Rc::clone` が多発する |
| **② ボトムアップDFS（番兵値-1）** | O(n)       | O(h)       | 低             | 高     | 高     | 1パスで完結。`&Option<...>` の参照借用のみ     |
| **③ 反復（スタック＋BFS）**       | O(n)       | O(n)       | 高             | 高     | 低     | `VecDeque` 管理が複雑。`Rc::clone` コストあり  |

**Rust固有の重要な観点：**

- ① では高さ計算のたびに `Rc::clone`（参照カウントのインクリメント）が発生し、定数倍のオーバーヘッドがある
- ② では `&Option<Rc<RefCell<TreeNode>>>` を参照として渡すため、**所有権移動もクローンも発生しない**

> 📖 **このセクションで登場した用語**
>
> - **時間計算量**：入力の大きさに対して処理にかかる手間がどう増えるかの目安
> - **空間計算量**：処理中に使うメモリ量がどう増えるかの目安。`h` は木の高さ（均衡木ではO(log n)、最悪O(n)）
> - **`Rc::clone`**：参照カウントを1増やす操作。完全なデータコピーではないが、カウンタ更新のコストが生じる
> - **参照借用**：`&` を付けて所有権を渡さずに値を「借りる」こと。借用中は貸し主もデータを使い続けられる

---

## 3. 選択したアルゴリズムと理由

- **選択したアプローチ**：② ボトムアップDFS（番兵値 `-1` パターン）

**理由（他のアプローチとの対比）：**

- ① トップダウンを「選ばなかった」理由：同じサブツリーを最大O(n)回再計算するためO(n²)になる上、`Rc::clone` が多発してパフォーマンスが低下するから
- ③ BFSを「選ばなかった」理由：`VecDeque`（双方向キュー）の管理が複雑で、O(n)の追加メモリが必要になるから

**②を選んだ根拠：**

- 🟢 **参照借用のみ**：`&Option<Rc<RefCell<TreeNode>>>` を渡すため、所有権移動もクローンもゼロ
- 🟢 **`borrow()` が1ノードにつき1回**：読み取りの実行時チェックを最小限に抑えられる
- 🟢 **`-1` 番兵値による早期リターン**：不均衡を検知した瞬間に以降の探索を打ち切れる

**Rust特有の最適化ポイント：**

- ネスト関数 `check_height` はモノモーフィゼーション（＝型ごとに専用コードへ自動展開）不要の具体型関数なので、インライン展開が起きやすい
- スタック上の `i32` のみをやり取りするため、ヒープアロケーション（＝動的メモリ確保）が発生しない

> 📖 **このセクションで登場した用語**
>
> - **ゼロコスト抽象化**：便利な書き方をしても手書きの低レベルコードと同じ速さになるRustの性質
> - **モノモーフィゼーション**：ジェネリクス関数が使われる型ごとに専用コードへ自動展開される仕組み
> - **ヒープアロケーション**：`Vec` や `Box` などの動的なメモリ確保。スタックより低速だがサイズが可変
> - **インライン展開**：関数呼び出しを、関数の中身をそのまま埋め込むことで呼び出しオーバーヘッドをゼロにする最適化

---

## 4. 実装コード

> 💡 **コードの大まかな構造（骨格）**
>
> 1. `is_balanced` はエントリポイント。ルートノードを参照として `check_height` に渡す
> 2. ネスト関数 `check_height` が再帰の本体。`&Option<...>` を受け取り、`i32`（高さ or -1）を返す
> 3. `None` のノード（木の終端）に達したら高さ `0` を返す（ベースケース）
> 4. `Some(n)` の場合は `n.borrow()` でノードを共有借用し、左右を再帰的に検査する
> 5. 左右どちらかが `-1` なら即座に `-1` を伝播する（早期リターン）
> 6. 高さの差が1以下なら `max(左, 右) + 1` を返す

```rust
// Runtime 0 ms
// Beats 100.00%
// Memory 2.80 MB
// Beats 81.58%

use std::rc::Rc;
use std::cell::RefCell;

impl Solution {
    pub fn is_balanced(root: Option<Rc<RefCell<TreeNode>>>) -> bool {

        // ── ネスト関数としてヘルパーを定義 ─────────────────────
        // クロージャ（|x| { ... }）ではなく fn を使う理由：
        // 再帰呼び出しに self キャプチャが不要で、
        // コンパイラがライフタイムを単純に推論できるから。
        //
        // 引数を `&Option<Rc<RefCell<TreeNode>>>` の"参照借用"で受け取る理由：
        // `Option<Rc<...>>` を値で渡すと所有権が移動（move）してしまい、
        // 呼び出し元で同じノードを再び使えなくなるから。
        // `&` を付けることで、所有権を渡さず「読み取り専用で借りる」だけにする。
        fn check_height(node: &Option<Rc<RefCell<TreeNode>>>) -> i32 {

            // ── パターンマッチングで None / Some を分岐 ────────
            // `match` はRustのパターンマッチング構文。
            // コンパイラが「None と Some の両方を必ず処理しているか」を検査するため、
            // うっかりケースを見落とすことがない（Pythonや JavaのifによるNullチェックとの違い）。
            match node {

                // ベースケース：None = ノードが存在しない（木の終端）
                // JavaScriptの `null` や Javaの `null` と違い、
                // `None` を使い忘れた場合はコンパイルエラーになるため安全。
                // 空の木の高さは 0 と定義する。
                None => 0,

                // Some(n)：ノードが存在する場合
                // n は `Rc<RefCell<TreeNode>>` 型。
                // Rc（参照カウントポインタ）を介してノードにアクセスする。
                Some(n) => {

                    // `n.borrow()` で RefCell の共有借用を行う。
                    // 「共有借用」＝読み取り専用の参照を取得すること。
                    // Rust通常の &T 借用はコンパイル時にチェックされるが、
                    // RefCell はこのチェックを"実行時"に行う（LeetCode の木構造上やむを得ない）。
                    // .borrow() が返す `Ref<T>` はスコープを抜けると自動で解放される。
                    let borrowed = n.borrow();

                    // ── 左サブツリーを再帰的に検査 ────────────
                    // `&borrowed.left` で左の子ノードへの参照を渡す。
                    // `borrowed.left` の型は `Option<Rc<RefCell<TreeNode>>>` なので、
                    // `&` を付けて参照として渡すことで所有権移動を防ぐ。
                    let left_height = check_height(&borrowed.left);

                    // 左サブツリーが -1（不均衡）なら、このノードで調べ続けても意味がない。
                    // 即座に -1 を返して呼び出し元に伝播させる（早期リターン）。
                    if left_height == -1 {
                        return -1;
                    }

                    // ── 右サブツリーを再帰的に検査 ────────────
                    let right_height = check_height(&borrowed.right);

                    // 右サブツリーも同様に早期リターン。
                    if right_height == -1 {
                        return -1;
                    }

                    // ── このノードでの均衡チェック ─────────────
                    // (left_height - right_height).abs() で絶対値（常に0以上の値）を取る。
                    // Rust の i32 には abs() メソッドが標準で存在する。
                    // 差が1より大きければ不均衡 → -1 を返す。
                    if (left_height - right_height).abs() > 1 {
                        return -1;
                    }

                    // ── このノードの高さを返す ─────────────────
                    // left_height.max(right_height) は std::cmp::max と同義。
                    // i32 型に直接 .max() メソッドが定義されているため、
                    // 関数呼び出しなしにシンプルに書ける（Rustの std の利便性）。
                    // +1 は「自分自身のノード」の分を追加している。
                    left_height.max(right_height) + 1
                }
            }
        }

        // check_height が -1 でなければ均衡している。
        // `!= -1` という単純な比較で完結するため、追加の型定義が不要。
        check_height(&root) != -1
    }
}
```

---

### 🔍 動作トレース（入力例での変数変化）

**Example 1** `root = [3, 9, 20, null, null, 15, 7]`

```
木の構造：
        3
       / \
      9  20
         / \
        15   7

再帰の解決順（葉 → 根）：

check_height(&Some(9))
  └─ borrowed = borrow() で 9 のノードを読み取り専用で借用
  └─ check_height(&None) → 0    ← 9.left が None
  └─ left_height = 0; (0 != -1) → 早期リターンしない
  └─ check_height(&None) → 0    ← 9.right が None
  └─ right_height = 0; (0 != -1) → 早期リターンしない
  └─ (0 - 0).abs() = 0 ≤ 1 → 均衡OK
  └─ return 0.max(0) + 1 = 1

check_height(&Some(15)) → 1  （同様）
check_height(&Some(7))  → 1  （同様）

check_height(&Some(20))
  └─ left_height  = check_height(&Some(15)) = 1
  └─ right_height = check_height(&Some(7))  = 1
  └─ (1 - 1).abs() = 0 ≤ 1 → 均衡OK
  └─ return 1.max(1) + 1 = 2

check_height(&Some(3))   ← ルートノード
  └─ left_height  = check_height(&Some(9))  = 1
  └─ right_height = check_height(&Some(20)) = 2
  └─ (1 - 2).abs() = 1 ≤ 1 → 均衡OK
  └─ return 1.max(2) + 1 = 3

is_balanced: check_height(&root) = 3 ≠ -1 → true ✅
```

---

**Example 2** `root = [1, 2, 2, 3, 3, null, null, 4, 4]`

```
木の構造：
              1
            /   \
           2     2
          / \
         3   3
        / \
       4   4

check_height(4) → 1, check_height(4) → 1

check_height(&Some(3)) [左の3]
  └─ left_height=1, right_height=1 → return 2

check_height(&Some(3)) [右の3]
  └─ left_height=0, right_height=0 → return 1

check_height(&Some(2)) [左の2]
  └─ left_height=2, right_height=1
  └─ (2 - 1).abs() = 1 ≤ 1 → 均衡OK → return 3

check_height(&Some(2)) [右の2]
  └─ return 1

check_height(&Some(1)) ← ルート
  └─ left_height=3, right_height=1
  └─ (3 - 1).abs() = 2 > 1 → 不均衡！ → return -1

is_balanced: check_height(&root) = -1 → false ✅
```

---

**Example 3** `root = []`（空の木）

```
root = None

check_height(&None) → match None => 0 （ベースケースで即座に 0 を返す）

is_balanced: 0 ≠ -1 → true ✅
```

---

### 🔬 `Option<Rc<RefCell<TreeNode>>>` の構造を図解

```
JavaScriptの木ノード（参考）：
  node.left → 直接参照またはnull（型の保証なし）

Rustの木ノード：
  node.left: Option< Rc< RefCell<TreeNode> > >
              │       │    │
              │       │    └── 内部可変性（読み書き可能なコンテナ）
              │       └─────── 参照カウント（複数箇所からの共有所有）
              └─────────────── Some（存在する）/ None（存在しない）

アクセスの流れ：
  n.borrow()       ← RefCell から読み取り専用の共有参照を取得
      ↓
  borrowed.left    ← TreeNode の left フィールドにアクセス
      ↓
  &borrowed.left   ← 参照として渡す（所有権移動を防ぐ）
```

> 📖 **このセクションで登場した用語**
>
> - **`match` (パターンマッチング)**：値の「形」によって処理を分岐する構文。コンパイラがすべてのケースの網羅を強制するため、処理漏れが起きない
> - **`borrow()`**：`RefCell<T>` から共有（読み取り専用）の借用を行うメソッド。実行時に他のミュータブル借用がないか確認する
> - **`Ref<T>`**：`borrow()` が返す型。スコープ（`{}`ブロック）を抜けると自動で借用が解放されるRAIIパターンを採用している
> - **RAII（Resource Acquisition Is Initialization）**：スコープを抜けると自動でリソースが解放されるRustの根本的な設計パターン。C++由来。JavaのtryWithResourcesやPythonのwithに相当するが、Rustは言語レベルで強制される
> - **早期リターン**：条件を満たした時点で `return` を使い即座に関数を終了させること。不要な後続処理を省いて効率を上げる

---

## 最終回答（LeetCode 提出フォーマット）

```rust
use std::rc::Rc;
use std::cell::RefCell;

impl Solution {
    pub fn is_balanced(root: Option<Rc<RefCell<TreeNode>>>) -> bool {
        fn check_height(node: &Option<Rc<RefCell<TreeNode>>>) -> i32 {
            match node {
                None => 0,
                Some(n) => {
                    let borrowed = n.borrow();
                    let left_height = check_height(&borrowed.left);
                    if left_height == -1 { return -1; }
                    let right_height = check_height(&borrowed.right);
                    if right_height == -1 { return -1; }
                    if (left_height - right_height).abs() > 1 { return -1; }
                    left_height.max(right_height) + 1
                }
            }
        }
        check_height(&root) != -1
    }
}
```

**計算量サマリー**

|          | 計算量   | 詳細                                                                                     |
| -------- | -------- | ---------------------------------------------------------------------------------------- |
| ⏱ Time  | **O(n)** | 各ノードをちょうど1回 `borrow()` してアクセスする                                        |
| 💾 Space | **O(h)** | 再帰のコールスタックが木の高さ分だけ積まれる（均衡木ならO(log n)、最悪の一直線木でO(n)） |
| 🔒 Alloc | **ゼロ** | ヒープアロケーション追加なし（`borrow()` は Ref を返すがスタック上）                     |
