# このエラーは、**Python 3.8以前**または、
# **古いオンラインジャッジ環境**で発生しやすいものです。

# 原因：

# ```python
# list[int]
# ```

# という記法は **Python 3.9以降** の正式サポートです。

# ## 【解決策】

# Python 3.8 / 3.7 / 3.6 / CPython 3.11.4（古い互換環境）では
# `typing.List` を使う必要があります。

# ---

# ### **修正版コード**

# ```python
import sys
import time
import tracemalloc
from typing import List

class Solution:
    def minSubsetSumCount(self, N: int, K: int, A: List[int]) -> int:
        """
        部分和問題の最小個数版を解く関数

        Parameters:
        N (int): 数列の長さ
        K (int): 目標和
        A (List[int]): 数列 a_1, a_2, ..., a_N

        Returns:
        int: Kを作れる場合は最小個数、作れない場合は-1
        """
        dp: List[float] = [float('inf')] * (K + 1)
        dp[0] = 0  # 0を作るには何も選ばないので0個

        for i in range(N):
            for j in range(K, A[i]-1, -1):  # 逆ループ（同じ要素を複数回使わない）
                if dp[j - A[i]] != float('inf'):
                    dp[j] = min(dp[j], dp[j - A[i]] + 1)

        return -1 if dp[K] == float('inf') else int(dp[K])

if __name__ == "__main__":
    # 計測開始
    start_time = time.perf_counter()
    tracemalloc.start()

    # 入力読み込み
    N_K = sys.stdin.readline().split()
    N, K = int(N_K[0]), int(N_K[1])
    A = list(map(int, sys.stdin.readline().split()))

    # ソリューション実行
    sol = Solution()
    result: int = sol.minSubsetSumCount(N, K, A)
    print(result)

    # 計測終了
    current, peak = tracemalloc.get_traced_memory()
    end_time = time.perf_counter()
    tracemalloc.stop()

    # デバッグ用（標準出力には出さない）
    with open("performance_log.txt", "w") as f:
        f.write(f"Time: {(end_time - start_time) * 1000:.3f} ms\n")
        f.write(f"Memory: {peak / (1024 * 1024):.3f} MB\n")
# ```

# ---

# ## 【ポイント】

# | 項目         | 対応                                    |
# | ---------- | ------------------------------------- |
# | 型ヒント互換性エラー | `list[int]` → `List[int]` に修正         |
# | 対応バージョン    | Python 3.6～3.11互換                     |
# | メモリ＆時間計測   | `tracemalloc` + `time.perf_counter()` |

# ---

# ## 【計算量】

# * **時間計算量**：O(N × K)
# * **メモリ消費量**：O(K)（約16KB）

# ---

# ## 【注意】

# オンラインジャッジやLeetCode、AtCoderでは、
# **`typing.List` を使うのが無難**です。
