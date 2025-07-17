# 以下は、Python (CPython 3.11.4) における実装です。
# 処理時間およびメモリ効率に優れた **O(N log N)** のアルゴリズムを使用し、型ヒント付きで関数分離しています。

# ---

# ## ✅ 解法概要

# * ソート：`X` 昇順、`Y` 降順
# * LIS（Longest Increasing Subsequence）：`Y` 方向の最長増加列を求める

# ---

# ## 🧠 Python 実装（型ヒント・関数分離付き）

# ```python
import sys
import bisect
from typing import List, Tuple

# 最大ネスト数を求める関数
def max_nesting_depth(boxes: List[Tuple[int, int]]) -> int:
    """
    箱の配列に対して最大ネスト数を計算する。

    :param boxes: 各箱を (縦, 横) のタプルで表したリスト
    :return: 最大ネスト数（整数）
    """
    # ソート: X昇順、Xが同じ場合はY降順
    boxes.sort(key=lambda x: (x[0], -x[1]))

    # Yのみ取り出して LIS を求める
    lis: List[int] = []

    for _, y in boxes:
        idx = bisect.bisect_left(lis, y)
        if idx == len(lis):
            lis.append(y)
        else:
            lis[idx] = y

    return len(lis)

# メイン関数（標準入力から読み込み）
def main() -> None:
    """
    標準入力から読み込み、最大ネスト数を出力する。
    """
    input = sys.stdin.read().splitlines()
    _: int = int(input[0])
    # ✅ 修正後（明示的に2要素に限定）
    boxes: List[Tuple[int, int]] = [ (int(x), int(y)) for x, y in (line.split() for line in input[1:]) ]

    result: int = max_nesting_depth(boxes)
    print(result)

if __name__ == "__main__":
    main()
# ```

# ---

# ## ✅ 計算量・メモリ使用量

# | 項目        | 内容                              |
# | --------- | ------------------------------- |
# | 時間計算量     | `O(N log N)` （ソート + LIS）        |
# | 空間計算量     | `O(N)` （入力＋LIS配列）               |
# | 使用メモリ（目安） | 約10〜15MB（N=100,000 時）           |
# | 最大入力対応    | `N ≦ 100,000`, `X, Y ≦ 500,000` |

# ---

# ## 📘 実行例

# ### 標準入力:

# ```
# 5
# 30 50
# 10 30
# 40 10
# 50 20
# 40 60
# ```

# ### 出力:

# ```
# 3
# ```

# ---

# ## ✅ 解説補足

# * `bisect_left` を使って `O(log N)` で LIS の位置を特定
# * 差し替えながら単調増加列を維持
# * LIS の長さがネスト可能な最大深さ

# ---

# 必要であれば、**LISの復元（実際の箱列）** や、**可視化説明**も可能です。ご希望あればお知らせください。
