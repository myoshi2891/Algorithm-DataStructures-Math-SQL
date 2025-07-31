# 以下に **Python (CPython 3.11.4)** での解答例を示します。
# Segment Tree を用いて**一点更新 + 右方向の連続長取得**を O(log N) で行います。

# ---

# ### 実装方針

# 1. **Segment Tree ノード情報**

#    * `left_char`: 区間の左端の文字
#    * `right_char`: 区間の右端の文字
#    * `prefix`: 先頭から同じ文字が続く長さ
#    * `suffix`: 末尾から同じ文字が続く長さ
#    * `all_same`: 区間がすべて同じ文字かどうか
#    * `len`: 区間長

# 2. **更新 (update)**

#    * 対象位置の文字を更新し、セグ木を再計算

# 3. **右方向連続長の取得 (query\_right)**

#    * `idx` から右方向に同じ文字がどこまで続くかを二分探索的に取得
#    * 部分的にしか一致しない場合は子ノードを再帰的に探索

# 4. **計算量・メモリ**

#    * `O((N+Q) log N)`
#    * セグ木は約 `4*N` ノード → メモリ数MB程度

# ---

# ### Pythonコード

# ```python
from typing import List, Tuple
import sys

sys.setrecursionlimit(1 << 25)


class Node:
    """Segment Treeノードを表現"""
    __slots__ = ("left_char", "right_char", "prefix", "suffix", "all_same", "length")

    def __init__(self, ch: str = "") -> None:
        self.left_char: str = ch
        self.right_char: str = ch
        self.prefix: int = 1 if ch else 0
        self.suffix: int = 1 if ch else 0
        self.all_same: bool = True if ch else False
        self.length: int = 1 if ch else 0


def merge(left: Node, right: Node) -> Node:
    """2ノードを結合して親ノードを作る"""
    res = Node()
    res.length = left.length + right.length
    res.left_char = left.left_char
    res.right_char = right.right_char

    # prefix
    res.prefix = left.prefix
    if left.all_same and left.right_char == right.left_char:
        res.prefix = left.length + right.prefix

    # suffix
    res.suffix = right.suffix
    if right.all_same and left.right_char == right.left_char:
        res.suffix = right.length + left.suffix

    # all_same
    res.all_same = left.all_same and right.all_same and (left.left_char == right.left_char)
    return res


def solve(n: int, q: int, s: str, queries: List[Tuple[int, str]]) -> List[int]:
    """
    n: 文字列長
    q: クエリ数
    s: 初期文字列
    queries: [(index(1-indexed), char)]
    return: 各クエリに対する右方向連続長
    """

    arr: List[str] = list(s)
    size = 4 * n
    tree: List[Node] = [Node() for _ in range(size)]

    def build(node: int, l: int, r: int) -> None:
        if l == r:
            tree[node] = Node(arr[l])
            return
        mid = (l + r) // 2
        build(node * 2, l, mid)
        build(node * 2 + 1, mid + 1, r)
        tree[node] = merge(tree[node * 2], tree[node * 2 + 1])

    def update(node: int, l: int, r: int, idx: int, ch: str) -> None:
        if l == r:
            arr[idx] = ch
            tree[node] = Node(ch)
            return
        mid = (l + r) // 2
        if idx <= mid:
            update(node * 2, l, mid, idx, ch)
        else:
            update(node * 2 + 1, mid + 1, r, idx, ch)
        tree[node] = merge(tree[node * 2], tree[node * 2 + 1])

    def query_right(node: int, l: int, r: int, idx: int, ch: str) -> int:
        """idx から右方向に char が連続する長さ"""
        if r < idx:
            return 0
        if l >= idx:
            seg = tree[node]
            if seg.all_same and seg.left_char == ch:
                return seg.length
            if l == r:
                return 1 if seg.left_char == ch else 0

        mid = (l + r) // 2
        left_len = query_right(node * 2, l, mid, idx, ch)
        # 左側が途切れたら右は調べない
        expected_left_len = max(0, min(mid, r) - max(idx, l) + 1)
        if left_len < expected_left_len:
            return left_len
        right_len = query_right(node * 2 + 1, mid + 1, r, idx, ch)
        return left_len + right_len

    # Build tree
    build(1, 0, n - 1)

    results: List[int] = []
    for i, c in queries:
        idx = i - 1
        update(1, 0, n - 1, idx, c)
        length = query_right(1, 0, n - 1, idx, c)
        results.append(length)

    return results


if __name__ == "__main__":
    data = sys.stdin.read().strip().split()
    N, Q = map(int, data[:2])
    S = data[2]
    queries_input: List[Tuple[int, str]] = []
    ptr = 3
    for _ in range(Q):
        idx = int(data[ptr])
        ch = data[ptr + 1]
        ptr += 2
        queries_input.append((idx, ch))

    ans = solve(N, Q, S, queries_input)
    print("\n".join(map(str, ans)))
# ```

# ---

# ### 計算量・メモリ

# * **時間計算量**:

#   * `build` O(N)
#   * `update` O(log N)
#   * `query_right` O(log N)
#   * 合計 `O((N+Q) log N)` ≈ 45万程度

# * **メモリ**:

#   * Segment Tree: 4N ノード × 軽量属性 → 数MB程度

# ---

# この実装で、最悪ケースでも高速にクエリ処理が可能です。

# ---

# ご希望なら、この実装を **Union-Findベースの連続区間管理** に変換することも可能です。
# 必要でしょうか？
