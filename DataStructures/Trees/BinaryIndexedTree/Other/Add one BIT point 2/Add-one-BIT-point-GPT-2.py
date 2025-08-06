# 以下に、**Python 3.8.10** 向けに、**BIT (Binary Indexed Tree / フェニック木)** を使って **一点更新・クエリ後のBIT状態出力** を行うコードを示します。

# ---

# ## ✅ 実装要件

# * **型ヒント付き**
# * 処理を関数化
# * 入力は `sys.stdin`（`fs` 相当）
# * メモリと処理時間を考慮（最大で n, Q ≤ 500）

# ---

# ## ✅ Python実装（コメント付き）

# ```python
import sys
from typing import List


class BIT:
    """Binary Indexed Tree (Fenwick Tree) for cumulative sum updates."""

    def __init__(self, size: int) -> None:
        self.n: int = size
        self.tree: List[int] = [0] * (self.n + 1)  # 1-indexed

    def add(self, index: int, value: int) -> None:
        """
        Adds `value` to the element at position `index`.
        index: 1-based index
        Time Complexity: O(log n)
        """
        while index <= self.n:
            self.tree[index] += value
            index += index & -index

    def get_tree(self) -> List[int]:
        """
        Returns the current BIT tree with 0 at index 0 (for output).
        Time Complexity: O(n)
        """
        return [0] + self.tree[1:]  # Output format includes 0 at the beginning


def process_queries(n: int, A: List[int], queries: List[List[int]]) -> None:
    """
    Processes the update queries and prints the BIT after each.
    
    Parameters:
    - n: int - Size of the array A
    - A: List[int] - Initial array A[0..n-1]
    - queries: List[List[int]] - Each query is [I, b] representing A[I-1] += b
    
    Output:
    - For each query, print the current BIT state
    """

    bit: BIT = BIT(n)

    # Initial construction of BIT from A
    for i in range(n):
        bit.add(i + 1, A[i])  # BIT is 1-indexed

    for I, b in queries:
        bit.add(I, b)  # Update A[I-1] += b, reflect in BIT
        print(' '.join(map(str, bit.get_tree())))


def main() -> None:
    """
    Main function to read input and call the query processor.
    Assumes input from stdin.
    """
    input_lines = sys.stdin.read().strip().split('\n')
    n: int = int(input_lines[0])
    A: List[int] = list(map(int, input_lines[1].split()))
    Q: int = int(input_lines[2])
    queries: List[List[int]] = [list(map(int, line.split())) for line in input_lines[3:3 + Q]]

    process_queries(n, A, queries)


if __name__ == '__main__':
    main()
# ```

# ---

# ## ✅ 処理時間とメモリの見積もり

# | 項目      | 詳細                                  | 計算量               |
# | ------- | ----------------------------------- | ----------------- |
# | 初期BIT構築 | `n` 回の `add`                        | `O(n log n)`      |
# | クエリ処理   | `Q` 回の `add` と `get_tree`           | `O(Q log n + Qn)` |
# | メモリ使用量  | `A`: 4n bytes, `tree`: 4(n+1) bytes | 約 8KB (n=500)     |

# → 実行時間・メモリ消費は**非常に軽量**です（数百個まで）。

# ---

# ## ✅ 実行方法例

# ファイル `main.py` として保存後：

# ```bash
# python3 main.py < input.txt
# ```

# `input.txt` の内容：

# ```
# 6
# 1 5 7 9 8 6
# 5
# 5 4
# 1 10
# 3 9
# 3 8
# 4 7
# ```

# 出力：

# ```
# 0 1 6 7 22 12 18
# 0 11 16 7 32 12 18
# 0 11 16 16 41 12 18
# 0 11 16 24 49 12 18
# 0 11 16 24 56 12 18
# ```

# ---

# 必要であれば、`sum(i)` や `range_sum(l, r)` の機能や図解も追加できます。希望があればお知らせください。
