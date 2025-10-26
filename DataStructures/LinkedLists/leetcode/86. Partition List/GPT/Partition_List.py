# ## 1. 問題分析結果

# ### 競技プログラミング視点

# * **目標**：連結リストを閾値 `x` で安定パーティション（`< x` が先、`>= x` が後）に並べ替え。
# * **最速**：単一走査で 2 本のリスト（`less` / `ge`）へ追加し最後に連結 → **O(n)**。
# * **メモリ**：

#   * 破壊的（再配線）：**O(1)** 追加メモリ。
#   * 非破壊（新ノード複製）：**O(n)** 追加メモリ（入力不変・Pure）。

# ### 業務開発視点

# * **可読性/保守性**：番兵（ダミー）ノード＋テールポインタで分岐と結合を単純化。
# * **型安全性**：`Optional[ListNode]` を明示し null 安全。Pylance が `ListNode` を解決できるようフォールバック定義を用意。
# * **エラーハンドリング**：LeetCode では通常例外を投げないため、ロジック内で自然に空リスト等を処理。

# ### Python特有考慮

# * **CPython**：属性参照の回数を抑え、`while` ループで単純化。余計な一時リストやクロージャ生成なし。
# * **データ構造**：linked list の再配線はポインタ操作のみで O(1) 追加メモリだが、本回答は「非破壊（Pure）」で実装。

# ---

# ## 2. アルゴリズム比較表

# | アプローチ                | 時間計算量      | 空間計算量    | Python実装コスト | 可読性   | 標準ライブラリ活用 | CPython最適化 | 備考                   |
# | -------------------- | ---------- | -------- | ----------- | ----- | --------- | ---------- | -------------------- |
# | 方法A：破壊的再配線（in-place） | O(n)       | O(1)     | 低           | 中     | 不要        | 適          | 入力を変更（最速・省メモリ）       |
# | 方法B：**非破壊コピー（二列構築）** | **O(n)**   | **O(n)** | 低           | **高** | 不要        | 適          | **安定・Pure・バグ少**（本採用） |
# | 方法C：安定ソート            | O(n log n) | O(n)     | 中           | 中     | `sorted`  | 適          | 要比較関数、過剰計算           |
# | 方法D：逐次挿入             | O(n²)      | O(1)     | 低           | 中     | 不要        | 不適         | 実用性低                 |

# ---

# ## 3. 採用アルゴリズムと根拠

# * **選択**：方法B（非破壊コピー：`less` / `ge` の 2 本に追加 → 連結）
# * **理由**：

#   * 計算量 **O(n)** と十分高速、安定性が自明。
#   * 入力不変（**Pure**）で安全・可読性が高い。
#   * 実装が短く境界条件（空、全 `< x`、全 `>= x`）が自然に処理できる。
# * **Python最適化**：

#   * `while` ループで属性アクセスを最小化。
#   * 余計な配列やイテレータ生成を避ける。
#   * ダミー（番兵）ノードで分岐を削減。

# ---

# ## 4. 実装コード（LeetCode / Class 形式 / Pylance 対応）

# ```python
from __future__ import annotations
from typing import Optional, TYPE_CHECKING

# --- Pylance（型チェッカー）対応のためのフォールバック定義 ---
# LeetCode 実行環境では ListNode が既に提供されるが、ローカルの型検査を通すために用意。
if TYPE_CHECKING:

    class ListNode:  # pragma: no cover - type checking only
        def __init__(self, val: int = 0, next: Optional["ListNode"] = None) -> None: ...

        val: int
        next: Optional["ListNode"]
else:
    # LeetCode環境外（ローカル実行時）のフォールバック
    class ListNode:
        __slots__ = ("val", "next")

        def __init__(self, val: int = 0, next: Optional["ListNode"] = None) -> None:
            self.val = val
            self.next = next


class Solution:
    """
    Partition List（安定パーティション）
    - 非破壊（Pure）：入力ノードは変更せず、新ノードを生成して返す。
    - (< x) が前、(>= x) が後。元の相対順序は維持（安定）。
    """

    def partition(self, head: Optional[ListNode], x: int) -> Optional[ListNode]:
        """
        Args:
            head: 連結リスト先頭
            x: しきい値

        Returns:
            パーティション後の新しい連結リスト先頭（非破壊）

        Complexity:
            Time: O(n)  — n はノード数（単一走査）
            Space: O(n) — Pureのため新ノードを生成
        """
        # ダミー（番兵）とテール
        less_dummy = ListNode(0)
        ge_dummy = ListNode(0)
        lt_tail = less_dummy
        ge_tail = ge_dummy

        cur = head
        while cur is not None:
            v = cur.val  # 属性参照を一度だけ
            if v < x:
                lt_tail.next = ListNode(v)
                lt_tail = lt_tail.next
            else:
                ge_tail.next = ListNode(v)
                ge_tail = ge_tail.next
            cur = cur.next

        # 連結（less -> ge）
        lt_tail.next = ge_dummy.next
        ge_tail.next = None
        return less_dummy.next

    # 参考：最速/省メモリの in-place 版（入力を再配線：Pureではない）
    # def partition(self, head: Optional[ListNode], x: int) -> Optional[ListNode]:
    #     less_dummy, ge_dummy = ListNode(0), ListNode(0)
    #     lt_tail, ge_tail = less_dummy, ge_dummy
    #     cur = head
    #     while cur:
    #         nxt = cur.next
    #         cur.next = None
    #         if cur.val < x:
    #             lt_tail.next = cur
    #             lt_tail = cur
    #         else:
    #             ge_tail.next = cur
    #             ge_tail = cur
    #         cur = nxt
    #     lt_tail.next = ge_dummy.next
    #     return less_dummy.next


# ```

# ---

# ## 5. 検証（テストコード不要）

# * **境界**：

#   * `head is None` → そのまま `None` を返却。
#   * 全ノード `< x` / 全ノード `>= x` → 片側のみ構築、連結動作で自然に処理。
#   * 単一要素 / 重複値（例：`[1,4,3,2,5,2], x=3` → `[1,2,2,4,3,5]`）。
# * **型チェック**：`Optional[ListNode]` とフォールバック定義により Pylance エラーなし。
# * **計算量**：単一走査 **O(n)**、Pure のため **O(n)** 追加メモリ。
#   （最速・省メモリが必要なら in-place 版に切り替え可能）
