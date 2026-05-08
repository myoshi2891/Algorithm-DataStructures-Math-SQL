# Binary Tree Inorder Traversal — Rust Edition

## 1. 問題の分析

### 競技プログラミング視点での分析

- 全ノードを一度だけ訪れる **O(N) 時間・O(N) 空間**が理論下界
- LeetCode の Rust 環境では `TreeNode` が `Option<Rc<RefCell<TreeNode>>>` でラップされており、**所有権の移動なしに借用で読み取る** 設計が必須
- 明示スタックによる反復実装でコールスタック消費を排除

### 業務開発視点での分析

- `Option<Rc<RefCell<TreeNode>>>` という複合型を安全に扱うため、`.borrow()` による共有参照と `Option` の `?`/`if let` による null 安全な展開が鍵
- `Vec<i32>` への追記は `push` のみで副作用をローカルに限定 → Pure function に近い設計
- `Result` は不要（入力が空 = 空ベクタを返すだけで、エラー状態がない）

### Rust特有の考慮点

- `Rc<RefCell<T>>` の共有所有権モデル：`clone()` はポインタのコピーのみ（O(1)）
- `.borrow()` で `Ref<TreeNode>` を取得 → 借用スコープを最小化してデッドロック回避
- スタックの型を `Rc<RefCell<TreeNode>>` とすることで、非 null 要素のみを格納できる

---

## 2. アルゴリズムアプローチ比較

| アプローチ                  | 時間計算量 | 空間計算量 | Rust実装コスト | 安全性 | 可読性 | 備考                                                |
| --------------------------- | ---------- | ---------- | -------------- | ------ | ------ | --------------------------------------------------- |
| **A: 再帰 DFS**             | O(N)       | O(N)       | 低             | 高     | 最高   | コールスタック深さN、深い木でスタックオーバーフロー |
| **B: 反復（明示スタック）** | O(N)       | O(N)       | 中             | 高     | 高     | Follow-up要件を満たす。`Rc::clone`でO(1)コピー      |
| **C: Morris Traversal**     | O(N)       | O(1)       | 非常に高       | 低     | 低     | `RefCell`の可変借用が複数箇所で必要、実装困難       |

---

## 3. 選択したアルゴリズムと理由

- **選択したアプローチ**: **B: 反復（明示スタック）**
- **理由**:
    - Follow-upの反復解要件を満たす
    - `Rc<RefCell<T>>` モデルで Morris は `borrow_mut()` の多重借用を誘発しやすく危険
    - `Rc::clone()` はポインタカウントのインクリメントのみで、ノード値コピーなし
    - スタック `Vec<Rc<RefCell<TreeNode>>>` で型安全かつ非 null 要素のみ管理

- **Rust特有の最適化ポイント**:
    - `Rc::clone(&node)` の明示的クローンでコスト意識を表現
    - `.borrow()` の借用スコープを `{}` ブロックで最小化（借用の早期解放）
    - `Vec::with_capacity` でリアロケーション回数を削減（N≤100 なので省略可）

---

## 4. 実装コード

```rust
// Runtime 0 ms
// Beats 100.00%
// Memory 2.19MB
// Beats 74.02%

// leetcode環境では use std::rc::Rc; use std::cell::RefCell; が提供済み

// ---- メイン実装 ----

/// Binary Tree Inorder Traversal（反復・明示スタック実装）
///
/// アルゴリズム:
///   1. current カーソルを根から開始
///   2. current が Some の間、左端までスタックに積む（Rc::clone でポインタコピー）
///   3. スタックから pop → 値を記録 → current を右子に移す
///   4. current と stack が両方空になったら終了
///
/// # Arguments
/// * `root` - 二分木の根ノード（`None` = 空木）
///
/// # Returns
/// 中順走査の値ベクタ（空木の場合は空ベクタ）
///
/// # Complexity
/// - Time:  O(N)  — 全ノードを一度だけ訪問
/// - Space: O(N)  — 明示スタック最大深さ N（最悪: 左に偏った木）
pub fn inorder_traversal(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<i32> {
    // 結果バッファ（N ≤ 100 なのでデフォルト容量で十分）
    let mut result: Vec<i32> = Vec::new();

    // 明示スタック：非 null ノードのみ格納（型レベルで None 混入を排除）
    let mut stack: Vec<Rc<RefCell<TreeNode>>> = Vec::new();

    // カーソル：Option で「未訪問ノードあり」「なし」を型安全に表現
    let mut current: Option<Rc<RefCell<TreeNode>>> = root;

    // current（未訪問）とstack（保留）のいずれかが残る間ループ
    while current.is_some() || !stack.is_empty() {

        // ---- フェーズ1: 左端まで潜りながらスタックに積む ----
        while let Some(node_rc) = current {
            // Rc::clone はポインタカウントのインクリメントのみ（O(1)、コピーコストなし）
            stack.push(Rc::clone(&node_rc));

            // .borrow() スコープを最小化: 左子のクローンを取得したら即解放
            let left = node_rc.borrow().left.clone();
            current = left; // 左へ進む（None なら次のwhileを脱出）
        }

        // ---- フェーズ2: スタック top を取り出して訪問 ----
        // stack.is_empty() でないことはループ条件で保証済み → unwrap 安全
        if let Some(node_rc) = stack.pop() {
            // 借用スコープを {} で明示的に限定（右子取得前に解放）
            let (val, right) = {
                let node = node_rc.borrow(); // Ref<TreeNode>
                (node.val, node.right.clone())
            }; // ← ここで Ref が drop され、借用解放

            // 中順で値を記録
            result.push(val);

            // ---- フェーズ3: 右部分木へカーソルを移す ----
            current = right; // None なら次ループで即 pop フェーズへ
        }
    }

    result
}
```

---

## 5. アルゴリズム動作トレース

`root = [1, null, 2, 3]` を例に各フェーズを可視化します。

```
ツリー構造:
      1
       \
        2
       /
      3
```

| ステップ | current      | stack（底→top） | result  | 操作                              |
| -------- | ------------ | --------------- | ------- | --------------------------------- |
| 初期     | Some(1)      | []              | []      | —                                 |
| Ph1      | None         | [1]             | []      | 1 を push、left=None で停止       |
| Ph2      | —            | []              | [1]     | pop→1、val=1 を記録               |
| Ph3      | Some(2)      | []              | [1]     | current = right(2)                |
| Ph1      | Some(3)→None | [2,3]           | [1]     | 2 push → 3 push、left=None で停止 |
| Ph2      | —            | [2]             | [1,3]   | pop→3、val=3 を記録               |
| Ph3      | None         | [2]             | [1,3]   | current = right(None)             |
| Ph2      | —            | []              | [1,3,2] | pop→2、val=2 を記録               |
| Ph3      | None         | []              | [1,3,2] | ループ終了                        |

**Output: `[1, 3, 2]` ✅**

---

## Rust固有の最適化観点まとめ

| 観点              | 本実装での適用                                                         |
| ----------------- | ---------------------------------------------------------------------- |
| **所有権管理**    | `Rc::clone` でポインタ共有（ノード値コピーなし）                       |
| **借用の最小化**  | `{ let node = node_rc.borrow(); ... }` で借用スコープを即解放          |
| **null 安全性**   | `Option<Rc<RefCell<TreeNode>>>` + `while let` で None を型レベルで排除 |
| **Pure function** | 入力ツリーへの書き込みゼロ（`.borrow()` のみ、`.borrow_mut()` 不使用） |
| **パニック制御**  | `unwrap()` を排除し `if let` / `while let` で安全展開                  |
