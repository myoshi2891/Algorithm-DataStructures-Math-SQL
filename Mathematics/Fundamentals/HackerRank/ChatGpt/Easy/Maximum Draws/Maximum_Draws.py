# # 1. 問題分析結果（要点）

# * **本質**: ドロワーに「色だけが異なる」靴下が n 色ある。最悪順序で引いたときでも**必ず**同色を 1 ペア得るのに必要な最小本数を求める。
# * **鳩の巣原理**: 各色 1 本ずつ先に引かれる最悪ケースを考えると、n 本では全て色違いが起こり得る。**次の 1 本（= n+1 本目）**で必ずどれかの色が 2 本になり、ペア成立。
# * **結論**: 解は **n + 1**。テストケースごとに O(1)。

# ---

# # 2. 比較表

# | アプローチ           | 時間計算量    | 空間計算量    | Python実装コスト | 可読性 | 標準ライブラリ活用 | CPython最適化 | 備考     |
# | --------------- | -------- | -------- | ----------- | --- | --------- | ---------- | ------ |
# | 鳩の巣原理で直接計算（n+1） | **O(1)** | **O(1)** | 低           | ★★★ | 不要        | 最小限        | 数学的一発解 |

# ---

# # 3. Python特有最適化ポイント（本問題向け簡潔版）

# * 計算は **定数時間**なので最適化は不要。
# * HackerRank 既定 I/O をそのまま使用（`input().strip()`）。
# * 戻り値は `int`。境界は n≥1（問題想定）で安全。

# ---

# # 4. 検証観点

# * **境界値**: n=1 → 2（サンプル一致）
# * **小規模**: n=2 → 3（サンプル一致）
# * **一般**: 任意の n に対し n 本では同色が確定しない可能性、n+1 本で確定。

# ---

# # HackerRankでの回答フォーマット（関数実装）

# ```python
#!/bin/python3

# import math
import os

# import random
# import re
# import sys

#
# Complete the 'maximumDraws' function below.
#
# The function is expected to return an INTEGER.
# The function accepts INTEGER n as parameter.
#


def maximumDraws(n):
    # By the pigeonhole principle, in the worst case we can draw one sock
    # from each of the n colors without forming a pair. The next draw
    # guarantees a matching pair. Therefore, the answer is n + 1.
    return n + 1


if __name__ == "__main__":
    fptr = open(os.environ["OUTPUT_PATH"], "w")

    t = int(input().strip())

    for t_itr in range(t):
        n = int(input().strip())

        result = maximumDraws(n)

        fptr.write(str(result) + "\n")

    fptr.close()
