# `rotate list` 系の問題（LeetCode #61 Rotate List）ということですね。
# Python 版も `rotateRight` に寄せて整理して書き直します。

# 以下、**LeetCode形式（Python, class Solution）** での実装です。
# 処理時間・メモリ効率を意識して、O(n) 時間・O(1) 追加メモリで実現しています。

# ---

# ```python
# Definition for singly-linked list.
from typing import Optional

class ListNode:

    def __init__(self, val: int = 0, next: Optional["ListNode"] = None):
        self.val: int = val
        self.next: Optional["ListNode"] = next


class Solution:
    def rotateRight(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        """
        リストを右に k 回回転させる

        Args:
            head (Optional[ListNode]): 単方向リンクリストの先頭ノード
            k (int): 回転回数

        Returns:
            Optional[ListNode]: 回転後の先頭ノード
        """
        if not head or not head.next or k == 0:
            return head

        # リストの長さを計算し、末尾ノードを取得
        length = 1
        tail = head
        while tail.next:
            tail = tail.next
            length += 1

        # 実際に必要な回転回数を求める
        k = k % length
        if k == 0:
            return head

        # tail を head に接続 → 一周するサイクルリストに変換
        tail.next = head

        # 新しい先頭ノードを探す (length - k) 番目のノードの次
        steps_to_new_head: int = length - k
        new_tail: ListNode = head
        for _ in range(steps_to_new_head - 1):
            new_tail = new_tail.next

        # 新しい head と tail を切り離す
        new_head = new_tail.next
        new_tail.next = None

        return new_head
# ```

# ---

# ### 🔍 処理の流れ（図解イメージ）

# 例: `head = [1,2,3,4,5], k=2`

# 1. **リスト長計算** → `length=5`
# 2. **k の調整** → `k=2`
# 3. **サイクル化**

#    ```
#    1 → 2 → 3 → 4 → 5
#    ↑                 ↓
#    └─────────────────┘
#    ```
# 4. **新しい先頭を探す**
#    `steps_to_new_head = 5 - 2 = 3` → `3番目のノード(3)` の次が新しい head
# 5. **切り離し** → `[4,5,1,2,3]`

# ---

# ✅ **計算量**:

# * 時間: O(n) （長さ計算 + 先頭探索）
# * メモリ: O(1) （追加領域ほぼなし）

# ---

# こちらをベースに、さっきの JavaScript 実装と揃えれば、**rotate list 問題の両対応（JS/Python）** がきれいに揃います。

# 👉 次は **テストケース付き Python 実行例** も用意しますか？
