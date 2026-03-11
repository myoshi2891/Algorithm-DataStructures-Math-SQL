# LeetCode #83 - Remove Duplicates from Sorted List (Python)

---

## 1. 問題分析結果

### 競技プログラミング視点

- **制約分析**: `n ≤ 300` と極小 → アルゴリズムより**ポインタ操作の正確性**が支配的
- **最速手法**: 1ポインタ線形走査 `O(n)` / 追加メモリなし `O(1)`
- **メモリ最小化**: インプレース `next` 付け替えのみ → 新規オブジェクト生成ゼロ
- **CPython最適化**: 属性アクセス（`obj.attr`）はCPythonでコスト高 → ローカル変数へキャッシュ

### 業務開発視点

- **型安全設計**: `Optional[ListNode]` を厳密に使い、Pylance エラーゼロを確保
- **エラーハンドリング**: `head is None` / `head.next is None` をガード節で明示
- **可読性**: ステップごとにコメントを付与し、意図を明示

### Python特有分析

- **データ構造**: 連結リストのノードは `ListNode` クラス → Python オブジェクト参照で管理
- **標準ライブラリ**: 本問題では不要（ポインタ操作のみ）
- **CPython最適化**: `current.next` の繰り返しアクセスを `nxt` ローカル変数でキャッシュ → LOAD_ATTR 削減

---

## 2. アプローチ比較

| アプローチ                  | 時間計算量 | 空間計算量 | Python実装コスト | 可読性 | CPython最適化 | 備考                        |
| --------------------------- | ---------- | ---------- | ---------------- | ------ | ------------- | --------------------------- |
| **1ポインタ・インプレース** | O(n)       | O(1)       | 低               | ★★★    | 適            | ✅ 最適解                   |
| 再帰                        | O(n)       | O(n)       | 低               | ★★★    | 不適          | スタック消費・n≤300なら許容 |
| 配列変換＋再構築            | O(n)       | O(n)       | 中               | ★★☆    | 不適          | 不要なオブジェクト生成      |

---

## 3. 採用アルゴリズムと根拠

- **選択**: 1ポインタ・インプレース走査
- **理由**: ソート済みという特性上、重複は**必ず隣接**するため1パスで完結。`O(1)` 追加メモリで最適
- **Python最適化戦略**: `current.next` の属性アクセスをローカル変数 `nxt` にキャッシュし LOAD_ATTR を削減
- **トレードオフ**: 競技版は型チェック省略で最速、業務版は Pylance 対応の型安全を優先

---

## 4. 実装

```python
# Runtime 0 ms
# Beats 100.00%
# Memory 19.30 MB
# Beats 91.01%
from typing import Optional


# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val: int = 0, next: Optional['ListNode'] = None) -> None:
#         self.val = val
#         self.next = next


class Solution:
    """
    LeetCode #83 - Remove Duplicates from Sorted List

    ソート済み連結リストから重複ノードをインプレースで削除する。
    業務開発版（型安全・Pylance対応）と
    競技プログラミング版（最速・最小）の2パターンを提供。
    """

    # ------------------------------------------------------------------ #
    #  業務開発版 ── 型安全・可読性・Pylance 対応                          #
    # ------------------------------------------------------------------ #
    def deleteDuplicates(self, head: Optional['ListNode']) -> Optional['ListNode']:
        """
        ソート済み連結リストの重複ノードを削除する（業務開発版）

        Args:
            head: 連結リストの先頭ノード（空リストの場合は None）

        Returns:
            重複を除いたソート済み連結リストの先頭ノード

        Time Complexity:  O(n)  ─ 各ノードを最大1回走査
        Space Complexity: O(1)  ─ ポインタ変数のみ、追加メモリなし
        """
        # ── ガード節 ────────────────────────────────────────────────────
        # 空リスト、またはノードが1つ → 重複なし、そのまま返す
        if head is None or head.next is None:
            return head

        # ── 1ポインタ走査（インプレース） ─────────────────────────────
        current: ListNode = head  # type: ignore[name-defined]

        while current.next is not None:
            nxt: ListNode = current.next  # type: ignore[name-defined]
            # ┌──────────────────────────────────────────────┐
            # │ 重複検出: current.val == nxt.val             │
            # │                                              │
            # │  [1] → [1] → [2]                            │
            # │   ↑     ↑                                    │
            # │ cur    nxt (スキップ対象)                    │
            # │                                              │
            # │  [1] ──────────→ [2]   ← nxt.next を接続   │
            # └──────────────────────────────────────────────┘
            if current.val == nxt.val:
                # 重複 → nxt をスキップ（current は進めない）
                # 次のノードも同値の可能性があるため
                current.next = nxt.next
            else:
                # 異なる値 → current を1つ進める
                current = nxt

        return head

    # ------------------------------------------------------------------ #
    #  競技プログラミング版 ── 最速・型チェック省略                         #
    # ------------------------------------------------------------------ #
    def deleteDuplicates_competitive(
        self, head: Optional['ListNode']
    ) -> Optional['ListNode']:
        """
        競技プログラミング向け最適化実装

        - エラーハンドリング省略
        - ローカル変数キャッシュで LOAD_ATTR を削減
        - CPython の属性参照コストを最小化

        Time Complexity:  O(n)
        Space Complexity: O(1)
        """
        cur = head
        while cur and cur.next:
            # cur.next を nxt にキャッシュ → LOAD_ATTR 削減
            nxt = cur.next
            if cur.val == nxt.val:
                cur.next = nxt.next   # スキップ（cur は移動しない）
            else:
                cur = nxt             # 前進
        return head
```

---

## 5. ポインタ操作の可視化

```
【入力】 head = [1, 1, 2, 3, 3]

Step 1  cur.val(1) == nxt.val(1)  → nxt をスキップ
  [1] → [1] → [2] → [3] → [3] → None
   ↑
  cur
         ↓ cur.next = nxt.next
  [1] ──────→ [2] → [3] → [3] → None
   ↑
  cur   ※ cur は移動しない（次も重複の可能性）

Step 2  cur.val(1) != nxt.val(2)  → cur を前進
  [1] → [2] → [3] → [3] → None
         ↑
        cur

Step 3  cur.val(2) != nxt.val(3)  → cur を前進
  [1] → [2] → [3] → [3] → None
               ↑
              cur

Step 4  cur.val(3) == nxt.val(3)  → nxt をスキップ
  [1] → [2] → [3] → None
               ↑
              cur

Step 5  cur.next is None  → ループ終了

【出力】 [1, 2, 3] ✅
```

---

## 6. 計算量サマリー

| 指標            | 値     | 説明                                      |
| --------------- | ------ | ----------------------------------------- |
| **時間計算量**  | `O(n)` | 各ノードを最大1回走査                     |
| **空間計算量**  | `O(1)` | ローカル変数のみ、追加構造なし            |
| **安定性**      | ✅     | 元の順序・値を保持                        |
| **破壊的操作**  | ✅     | 元リストをインプレースで変更              |
| **Pylance対応** | ✅     | `Optional[ListNode]` で静的解析エラーなし |
