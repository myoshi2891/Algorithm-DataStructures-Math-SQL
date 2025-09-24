# # ✅ 解答

# ```python
from typing import Optional


# LeetCodeの定義に合わせたListNodeクラス
class ListNode:
    def __init__(self, val: int = 0, next: Optional["ListNode"] = None) -> None:
        self.val: int = val
        self.next: Optional["ListNode"] = next


class Solution:
    """
    Remove Duplicates from Sorted List II
    - 与えられたソート済み連結リストから、重複要素をすべて削除し、重複していない要素のみを残す
    """

    # ------------------------------
    # 🚀 競技プログラミング向け実装（性能最優先、エラーハンドリング省略）
    # ------------------------------
    def deleteDuplicates(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        Time Complexity: O(n)  （各ノードを一度だけ走査）
        Space Complexity: O(1) （ポインタ操作のみ）
        """
        dummy = ListNode(0, head)  # ダミーノード（削除処理を簡単にするため）
        prev = dummy  # 最後に確定したユニーク要素の直前を指す
        curr = head

        while curr:
            # 重複があるかどうかを確認
            if curr.next and curr.val == curr.next.val:
                # 重複が終わる位置までスキップ
                dup_val = curr.val
                while curr and curr.val == dup_val:
                    curr = curr.next
                prev.next = curr  # 重複を飛ばす
            else:
                prev = curr
                curr = curr.next

        return dummy.next

    # ------------------------------
    # 🏢 業務開発向け実装（型安全・入力検証あり）
    # ------------------------------
    def deleteDuplicates_safe(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        型チェック・入力検証込みの堅牢版
        """
        if head is not None and not isinstance(head, ListNode):
            raise TypeError("head must be a ListNode or None")

        # 実データなしなら即終了
        if head is None or head.next is None:
            return head

        dummy = ListNode(0, head)
        prev = dummy
        curr = head

        while curr:
            if curr.next and curr.val == curr.next.val:
                dup_val = curr.val
                while curr and curr.val == dup_val:
                    curr = curr.next
                prev.next = curr
            else:
                prev = curr
                curr = curr.next

        return dummy.next


# ```

# ---

# # 🔍 解説

# ## 1. アルゴリズム選定理由

# * **入力はソート済み** → 重複要素は必ず連続する。
# * 一度の線形走査（O(n)）で十分。
# * 余分なデータ構造は不要（O(1)空間）。

# ---

# ## 2. 処理の流れ

# 1. ダミーノードを作成（先頭が削除される場合にも対応可能にするため）。
# 2. `curr` が重複開始点なら、同じ値をすべてスキップ。
# 3. `prev.next` を `curr` に繋ぎ直して重複ノードを除外。
# 4. 重複がなければ `prev` を更新。
# 5. 最後に `dummy.next` を返す。

# ---

# ## 3. 競技プログラミング版 vs 業務版

# * **競技プログラミング版 (`deleteDuplicates`)**

#   * 入力検証や例外処理は省略
#   * シンプルで高速
# * **業務版 (`deleteDuplicates_safe`)**

#   * 型チェック・エラーハンドリング付き
#   * 予期せぬ入力に対して堅牢

# ---
