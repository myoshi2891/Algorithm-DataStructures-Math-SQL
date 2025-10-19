# 以下は、指定された制約（Python 3.11.4、Pylance 型チェック対応、処理時間・メモリ制限への配慮）を考慮して実装した **完全な Python 解法** です。

# ---

# ## ✅ 解法の要点

# * **row\_map** を使って、各論理行がどの物理行を参照しているかを記録します。
# * **行の入れ替えはインデックスの入れ替えのみ**で行い、2次元配列（リストのリスト）そのものは一切変更しません。
# * 全操作は **O(1)** 時間で処理可能。

# ---

# ## ✅ Python 実装（型アノテーション、関数分離、効率重視）

# ```python
from typing import List
import sys

def process_grid_operations(n: int, grid: List[List[int]], queries: List[List[int]]) -> List[int]:
    """
    グリッドの行交換と取得操作を効率的に処理する

    Parameters:
    - n: グリッドのサイズ（行・列数）
    - grid: 初期のグリッド（n x n の整数リスト）
    - queries: 操作クエリ（[type, x, y] の形式）

    Returns:
    - List[int]: 取得クエリの結果リスト
    """

    # row_map[i] = gridのどの行が現在i番目に来ているか
    row_map: List[int] = list(range(n))
    results: List[int] = []

    for query in queries:
        t, x, y = query
        x -= 1  # 0-based index に変換
        y -= 1
        if t == 1:
            # 行 x と 行 y を入れ替え（インデックスのみ）
            row_map[x], row_map[y] = row_map[y], row_map[x]
        elif t == 2:
            # 行 x の y 列目を取得（実際の grid を参照）
            results.append(grid[row_map[x]][y])

    return results


def main() -> None:
    """
    標準入力を読み取り、取得操作の結果を標準出力に出力する
    """

    input_data: List[str] = sys.stdin.read().split()
    ptr: int = 0

    n: int = int(input_data[ptr])
    ptr += 1

    # グリッドを読み込む
    grid: List[List[int]] = []
    for _ in range(n):
        row = list(map(int, input_data[ptr:ptr + n]))
        grid.append(row)
        ptr += n

    q: int = int(input_data[ptr])
    ptr += 1

    queries: List[List[int]] = []
    for _ in range(q):
        t = int(input_data[ptr])
        x = int(input_data[ptr + 1])
        y = int(input_data[ptr + 2])
        queries.append([t, x, y])
        ptr += 3

    results = process_grid_operations(n, grid, queries)
    print("\n".join(map(str, results)))


if __name__ == "__main__":
    main()
# ```

# ---

# ## ✅ 入出力例（同様）

# ```bash
# python3 solution.py < input.txt
# ```

# ### 入力例 `input.txt`:

# ```
# 3
# 1 2 3
# 4 5 6
# 7 8 9
# 7
# 2 2 1
# 1 1 2
# 2 2 1
# 2 1 3
# 1 2 3
# 2 2 3
# 2 3 2
# ```

# ### 出力例:

# ```
# 4
# 1
# 6
# 9
# 2
# ```

# ---

# ## ✅ 計算量・メモリ

# | 処理        | 計算量       | メモリ量                    |
# | --------- | --------- | ----------------------- |
# | 初期化（グリッド） | O(N²)     | 最大 250,000 要素 → 約 1MB   |
# | クエリ処理（Q件） | O(Q)      | クエリ最大 200,000 件（O(1)/件） |
# | 出力構築      | O(Q)      | 結果の配列に格納                |
# | 総計        | O(N² + Q) | 合計メモリ ≦ 約2〜3MB          |

# ---

# ## ✅ Pylance型チェック対応ポイント

# * 全関数に引数・戻り値の型を明示
# * 可変長リストや添字アクセスの前に `.split()` で分割
# * `sys.stdin.read()` を使って効率的に読み取り（`input()` 非推奨）

# ---

# 図解やアルゴリズムの可視化（`row_map`の変遷など）を希望される場合も、図で説明可能です。必要であればお知らせください。
