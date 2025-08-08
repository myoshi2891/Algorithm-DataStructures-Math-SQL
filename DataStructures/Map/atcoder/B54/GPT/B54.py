# 以下は **Python (CPython 3.11.4)** 向けの実装で、型アノテーションを明示し、処理時間・メモリを意識した **O(N)** 解法です。
# `dict` を使って値の出現回数を記録し、1回の走査で計算します。

# ---

# ```python
# Python 3.11.4
# 処理時間: O(N)
# メモリ使用量: O(U) (U は配列内の異なる値の数、最大で N)

from sys import stdin
from typing import List


def count_pairs(N: int, arr: List[int]) -> int:
    """
    条件を満たす (i, j) の組数をカウントする

    Parameters
    ----------
    N : int
        配列の要素数
    arr : List[int]
        長さ N の整数配列 A1...AN

    Returns
    -------
    int
        条件 (1 ≤ j < i ≤ N かつ A_j = A_i) を満たす組数
    """
    freq: dict[int, int] = {}  # 値 -> 出現回数
    count: int = 0

    for val in arr:
        if val in freq:
            # 過去に出現した回数分だけ組を作れる
            count += freq[val]
            freq[val] += 1
        else:
            freq[val] = 1
    return count


# 高速な入力処理
data: List[int] = list(map(int, stdin.read().strip().split()))
N: int = data[0]
arr: List[int] = data[1:]

result: int = count_pairs(N, arr)
print(result)
# ### 実装のポイント

# 1. **型アノテーション**

#    * `N: int`, `arr: List[int]`, `freq: dict[int, int]`, `count: int` を明示
#    * Pylance で型エラーが出ないように、変数初期化時に型を確定
# 2. **時間計算量**

#    * 1回のループ (O(N)) で組数計算
#    * `dict` の `in`, `[]` アクセスは平均 O(1)
# 3. **メモリ計算量**

#    * `freq` は異なる値の数だけエントリ保持（最大 N）
#    * N=100,000 でも数MB程度

# ---

# このままではテキスト出力ですが、希望があれば
# 処理の各ステップを図解した **Markdown解説** も Python 用に作成できます。
