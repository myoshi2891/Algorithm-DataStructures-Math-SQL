# Binary Tree Inorder Traversal

## 1. 問題の分析

### 競技プログラミング視点での分析

- **中順走査（左→根→右）** の順でノード値を収集する古典的な木探索問題
- ノード数 N ≤ 100 と制約が小さいため、漸近的複全体ノードを一度訪れる O(N) が理論下界
- Follow-up：**反復（スタック）実装**が求められており、再帰によるコールスタック消費を回避できる

### 業務開発視点での分析

- `TreeNode | null` という Union 型を正確に扱う null 安全性が重要
- 再帰は可読性が高いが、深い木でスタックオーバーフローリスクあり
- イテレーティブ実装は明示的スタック管理により**実行時安全性**が高い

### TypeScript特有の考慮点

- `TreeNode | null` の型ガードで null チェックを厳密に
- `readonly` 修飾子と `as const` でイミュータブルな中間状態を表現
- スタックの型を `TreeNode[]` と明示し、型推論を最大活用

---

## 2. アルゴリズムアプローチ比較

| アプローチ                  | 時間計算量 | 空間計算量 | TS実装コスト | 型安全性 | 可読性 | 備考                         |
| --------------------------- | ---------- | ---------- | ------------ | -------- | ------ | ---------------------------- |
| **A: 再帰 DFS**             | O(N)       | O(N)※      | 低           | 高       | 最高   | ※コールスタック深さ N        |
| **B: 反復（明示スタック）** | O(N)       | O(N)       | 中           | 高       | 高     | スタックオーバーフロー回避   |
| **C: Morris Traversal**     | O(N)       | O(1)       | 高           | 中       | 低     | ポインタ書き換えで副作用あり |

---

## 3. 選択したアルゴリズムと理由

- **選択したアプローチ**: **B: 反復（明示スタック）**
- **理由**:
    - Follow-upで反復解が明示的に要求されている
    - コールスタックを消費しないため、深い木でも安全
    - `TreeNode[]` スタックで型安全に実装可能
    - Morris は入力ツリーを一時変更する副作用があり Pure function の原則に反する

- **TypeScript特有の最適化ポイント**:
    - `current: TreeNode | null` によるカーソル変数の明確な型定義
    - `stack: TreeNode[]` で非 null 要素のみ格納し、pop 後のアサーション不要化
    - `result: number[]` の型推論によりキャスト不要

---

## 4. 実装コード

```typescript
// Runtime 0 ms
// Beats 100.00%
// Memory 55.30 MB
// Beats 63.69%

/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

/**
 * Binary Tree Inorder Traversal（反復・明示スタック実装）
 *
 * アルゴリズム:
 *   1. current ポインタを根から開始
 *   2. current が非 null の間、左端までスタックに積む
 *   3. スタックから pop → 値を記録 → current を右子に移す
 *   4. current と stack が両方空になったら終了
 *
 * @param root - 二分木の根ノード（null = 空木）
 * @returns 中順走査の値配列
 * @complexity Time: O(N), Space: O(N)  N = ノード数
 */
function inorderTraversal(root: TreeNode | null): number[] {
    // 入力ガード：空木は即座に空配列を返す（型安全）
    if (root === null) return [];

    const result: number[] = []; // 走査結果を蓄積
    const stack: TreeNode[] = []; // 明示スタック（非 null のみ格納）
    let current: TreeNode | null = root;

    // current（未訪問ノード）とstack（保留ノード）のいずれかが残る間ループ
    while (current !== null || stack.length > 0) {
        // フェーズ1: 左端まで潜りながらスタックに積む
        while (current !== null) {
            stack.push(current); // 右・自身は後回し
            current = current.left; // 左へ進む
        }

        // フェーズ2: スタック top を取り出して訪問
        // stack.length > 0 保証済みなので non-null assertion は安全
        const node = stack.pop()!; // TreeNode 確定
        result.push(node.val); // ← 中順で値を記録

        // フェーズ3: 右部分木へカーソルを移す（null なら次ループでpopへ）
        current = node.right;
    }

    return result;
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

| ステップ | current | stack（底→top） | result  | 操作                            |
| -------- | ------- | --------------- | ------- | ------------------------------- |
| 初期     | 1       | []              | []      | —                               |
| Ph1      | null    | [1]             | []      | 1 を push、左=null で停止       |
| Ph2      | —       | []              | [1]     | pop→1、val=1 を記録             |
| Ph3      | 2       | []              | [1]     | current = 右(2)                 |
| Ph1      | 3       | [2,3]           | [1]     | 2 push → 3 push、左=null で停止 |
| Ph2      | —       | [2]             | [1,3]   | pop→3、val=3 を記録             |
| Ph3      | null    | [2]             | [1,3]   | current = 右(null)              |
| Ph2      | —       | []              | [1,3,2] | pop→2、val=2 を記録             |
| Ph3      | null    | []              | [1,3,2] | ループ終了                      |

**Output: `[1, 3, 2]` ✅**

---

## TypeScript固有の最適化観点まとめ

| 観点                   | 本実装での適用                                                             |
| ---------------------- | -------------------------------------------------------------------------- |
| **null 安全性**        | `TreeNode \| null` Union 型 + `!` アサーション（スタック長保証後のみ使用） |
| **型推論**             | `result`, `stack` の型はイニシャライザから自動推論                         |
| **イミュータブル操作** | `result.push` のみで元ツリー構造を一切変更しない Pure function             |
| **コンパイル時安全性** | `stack: TreeNode[]` により pop 結果が `TreeNode \| undefined` と明確化     |
