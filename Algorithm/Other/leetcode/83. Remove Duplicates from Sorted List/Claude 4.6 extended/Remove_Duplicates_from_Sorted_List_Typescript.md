# LeetCode #83 - Remove Duplicates from Sorted List

---

## 1. 問題の分析

### 競技プログラミング視点での分析

- ソート済みリストなので、**重複は必ず隣接**する → 1パスで解決可能
- ポインタ操作のみ → 追加メモリ不要 `O(1)` space
- `n ≤ 300` と小さいため、計算量よりも**ポインタの正確な操作**が肝

### 業務開発視点での分析

- `ListNode | null` の Union型を正確に扱う null安全性が重要
- 破壊的操作（`next`の付け替え）のため、**副作用を局所化**した明確な実装が必要
- 型ガードで `current.next` の null チェックを明示

### TypeScript特有の考慮点

- `ListNode | null` → `!= null` での絞り込みで型ガード
- `while` ループ内での型推論を活用し、余分なキャストを排除
- `readonly` は付けられない（破壊的操作必須）のでその代わりに関数スコープで副作用を限定

---

## 2. アルゴリズムアプローチ比較

| アプローチ                | 時間計算量 | 空間計算量 | TS実装コスト | 型安全性 | 可読性 | 備考                         |
| ------------------------- | ---------- | ---------- | ------------ | -------- | ------ | ---------------------------- |
| **インプレース1ポインタ** | O(n)       | O(1)       | 低           | 高       | 高     | ✅ 最適解                    |
| 再帰                      | O(n)       | O(n)       | 低           | 高       | 高     | スタックオーバーフローリスク |
| 配列変換+再構築           | O(n)       | O(n)       | 中           | 高       | 中     | 不要なメモリ確保             |

---

## 3. 選択したアルゴリズムと理由

- **選択**: インプレース1ポインタ走査
- **理由**:
    - ソート済みリストの特性（隣接する重複）を最大限に活かし、1パスで完結
    - `O(1)` 追加メモリ、`O(n)` 時間の最適バランス
    - 再帰は `n≤300` では問題ないが、スタック消費の観点で反復が優位
- **TypeScript最適化ポイント**:
    - `current` の型が `while` の条件式で `ListNode` に自動的に絞り込まれる型推論を活用
    - `current.next !== null` チェック後、型が自動的に `ListNode` へ narrowing

---

## 4. 実装コード

```typescript
// Runtime 0 ms
// Beats 100.00%
// Memory 58.86 MB
// Beats 26.83%
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

/**
 * ソート済み連結リストから重複ノードを削除する
 *
 * アルゴリズム：
 *   current ポインタを先頭から走査し、
 *   current.val === current.next.val の間は next を読み飛ばす。
 *   値が異なった時点で current を進める（1ポインタ・インプレース）
 *
 * @param head - 連結リストの先頭ノード (null の場合は空リスト)
 * @returns 重複を除去したソート済み連結リストの先頭ノード
 * @complexity Time: O(n), Space: O(1)
 */
function deleteDuplicates(head: ListNode | null): ListNode | null {
    // ── 入力ガード ──────────────────────────────────────────
    // 空リスト or ノードが1つ → 重複なし、そのまま返す
    if (head === null || head.next === null) {
        return head;
    }

    // ── 1ポインタ走査（インプレース） ────────────────────────
    // TypeScriptの型narrowing:
    //   while条件で current != null が保証されるため
    //   ループ内で current は ListNode 型として扱われる
    let current: ListNode = head;

    while (current.next !== null) {
        // current.next は null でないことが確定（型: ListNode）
        if (current.val === current.next.val) {
            // ┌─────────────────────────────────────────┐
            // │ 重複検出: current.next をスキップ        │
            // │                                         │
            // │  [1] → [1] → [2]                       │
            // │   ↑     ↑                               │
            // │ current next(スキップ)                  │
            // │                                         │
            // │  [1] ──────→ [2]   ← next.next を接続  │
            // └─────────────────────────────────────────┘
            current.next = current.next.next;
            // current は進めない（次も重複の可能性があるため）
        } else {
            // 値が異なる → current を1つ進める
            current = current.next;
        }
    }

    return head;
}
```

---

## ポインタ操作の可視化

```
【初期状態】  head = [1, 1, 2, 3, 3]

Step 1: current.val(1) === current.next.val(1) → next をスキップ
  [1] → [1] → [2] → [3] → [3] → null
   ↑
 current
         ↓ current.next = current.next.next
  [1] ──────→ [2] → [3] → [3] → null
   ↑
 current

Step 2: current.val(1) !== current.next.val(2) → current を進める
  [1] → [2] → [3] → [3] → null
         ↑
       current

Step 3: current.val(2) !== current.next.val(3) → current を進める
  [1] → [2] → [3] → [3] → null
               ↑
             current

Step 4: current.val(3) === current.next.val(3) → next をスキップ
  [1] → [2] → [3] → null
               ↑
             current

Step 5: current.next === null → ループ終了

【出力】  [1, 2, 3] ✅
```

---

## 計算量サマリー

| 指標           | 値     | 説明                                |
| -------------- | ------ | ----------------------------------- |
| **時間計算量** | `O(n)` | 各ノードを最大1回走査               |
| **空間計算量** | `O(1)` | ポインタ変数1つのみ、追加メモリなし |
| **安定性**     | ✅     | 元の順序・値を保持                  |
| **破壊的操作** | ✅     | 元リストをインプレースで変更        |
