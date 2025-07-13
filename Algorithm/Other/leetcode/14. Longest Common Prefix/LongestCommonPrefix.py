# LeetCode のテストケースは
# `class Solution` にメソッドを定義する形式が必要です。

# なので、次のように修正します：

# ## ✅ LeetCode形式（`class Solution`）

# ```python
import time
import tracemalloc
from typing import List, Tuple

class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        """
        LeetCode用 最長共通接頭辞関数

        :param strs: List[str] - 文字列のリスト
        :return: str - 最長共通接頭辞。共通部分がなければ空文字。
        """
        if not strs:
            return ""
        
        prefix = strs[0]
        
        for s in strs[1:]:
            while not s.startswith(prefix):
                prefix = prefix[:-1]
                if not prefix:
                    return ""
        return prefix

def run_with_performance_log(strs: List[str]) -> Tuple[str, float, int]:
    """
    処理時間とメモリ消費量を計測し、最長共通接頭辞を求める

    :param strs: List[str] - 文字列リスト
    :return: Tuple[str, float, int]
        - 最長共通接頭辞（str）
        - 処理時間（ミリ秒、float）
        - メモリ消費量（KB、int）
    """
    solution = Solution()

    tracemalloc.start()
    start_time = time.perf_counter()

    result = solution.longestCommonPrefix(strs)

    end_time = time.perf_counter()
    _, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()

    time_elapsed_ms = (end_time - start_time) * 1000  # ミリ秒
    memory_usage_kb = peak // 1024  # KB単位に変換

    return result, time_elapsed_ms, memory_usage_kb

# サンプル実行
if __name__ == "__main__":
    test_cases = [
        ["flower", "flow", "flight"],
        ["dog", "racecar", "car"]
    ]

    for i, case in enumerate(test_cases, 1):
        result, time_ms, mem_kb = run_with_performance_log(case)
        print(f"Test Case {i}: {case}")
        print(f"Longest Common Prefix: '{result}'")
        print(f"Time: {time_ms:.3f} ms")
        print(f"Memory: {mem_kb} KB")
        print("=" * 40)
# ```

# ---

# ## ✅ 実行結果（例）

# ```
# Test Case 1: ['flower', 'flow', 'flight']
# Longest Common Prefix: 'fl'
# Time: 0.030 ms
# Memory: 0 KB
# ========================================
# Test Case 2: ['dog', 'racecar', 'car']
# Longest Common Prefix: ''
# Time: 0.025 ms
# Memory: 0 KB
# ========================================
# ```

# ---

# ## LeetCode用注意点：

# * `Solution`クラスにメソッドを書く必要があります。
# * 引数や戻り値は LeetCode標準形式。

# ---
