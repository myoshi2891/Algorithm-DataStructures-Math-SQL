# ご要望に沿って **Python (3.8.10)** で解答を示します。
# ポイントは以下です：

# * **関数化**してパラメータ・返却値に型ヒントを明示する
# * **処理時間**: O(n)
# * **メモリ使用量**: O(1)（heights 配列以外に追加メモリを使わない）
# * **標準入力**からデータを受け取り、結果を標準出力

# ---

# ### 実装（Python 3.8.10）

# ```python
# import sys

# def longest_non_decreasing_subarray(heights: list[int]) -> int:
#     """
#     最長の「背の順」区間の長さを求める関数

#     Parameters
#     ----------
#     heights : list[int]
#         各人の身長を格納した配列（長さ n）

#     Returns
#     -------
#     int
#         最長の背の順区間の長さ
#     """

#     n: int = len(heights)
#     if n == 0:
#         return 0

#     max_len: int = 1      # これまでの最長区間長
#     current_len: int = 1  # 現在継続中の区間長

#     for i in range(1, n):
#         if heights[i - 1] <= heights[i]:
#             current_len += 1
#         else:
#             current_len = 1
#         if current_len > max_len:
#             max_len = current_len

#     return max_len


# if __name__ == "__main__":
#     data = sys.stdin.read().strip().split()
#     n: int = int(data[0])
#     heights: list[int] = list(map(int, data[1:n+1]))

#     result: int = longest_non_decreasing_subarray(heights)
#     print(result)
# ```

# ---

# ### 処理時間・メモリ解析

# * **時間計算量**:

#   * 各要素を一度だけ確認するので **O(n)**
#   * 最大 n=200,000 でも十分高速（約 0.05 秒程度）
# * **メモリ計算量**:

#   * 入力の配列 `heights` (O(n))
#   * 追加で使う変数は `max_len` と `current_len` のみ → **O(1)**

# ---

# このエラーは **Python 3.8** では `list[int]` のような「組み込み型のジェネリクス表記」がまだ使えないために発生しています。

# 👉 解決方法は **`typing` モジュール**を使って `List[int]` を書くことです。

# ---

# ### 修正版（Python 3.8.10 対応）

# ```python
import sys
from typing import List

def longest_non_decreasing_subarray(heights: List[int]) -> int:
    """
    最長の「背の順」区間の長さを求める関数

    Parameters
    ----------
    heights : List[int]
        各人の身長を格納した配列（長さ n）

    Returns
    -------
    int
        最長の背の順区間の長さ
    """

    n: int = len(heights)
    if n == 0:
        return 0

    max_len: int = 1      # これまでの最長区間長
    current_len: int = 1  # 現在継続中の区間長

    for i in range(1, n):
        if heights[i - 1] <= heights[i]:
            current_len += 1
        else:
            current_len = 1
        if current_len > max_len:
            max_len = current_len

    return max_len


if __name__ == "__main__":
    data = sys.stdin.read().strip().split()
    n: int = int(data[0])
    heights: List[int] = list(map(int, data[1:n+1]))

    result: int = longest_non_decreasing_subarray(heights)
    print(result)
# ```

# ---

# ### 補足

# * **Python 3.9 以降**では `list[int]` と書けますが、
# * **Python 3.8 以前**では `typing.List[int]` を使う必要があります。

