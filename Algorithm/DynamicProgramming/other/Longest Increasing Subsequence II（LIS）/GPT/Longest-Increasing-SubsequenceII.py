# 了解しました。ご提示の条件（Python 3.8.10, 型明示、処理時間・メモリ消費に配慮）に沿って、**最長増加部分列（LIS）を DP で O(n²) で解く版**を示します。
# ※入力サイズ n ≤ 5000 のため O(n²) でも 25,000,000 回程度の比較で十分処理可能です。

# ```python
from typing import List

def longest_increasing_subsequence(n: int, heights: List[int]) -> int:
    """
    パラメータ:
        n (int): 木の本数
        heights (List[int]): 各木の高さを格納したリスト (長さ n)
    返却値:
        int: 残せる木の最大本数 (最長増加部分列の長さ)
    """
    # dp[i]: i 番目の木を末尾とする増加部分列の最長長さ
    dp: List[int] = [1] * n  # 各木を単独で選んだ場合の長さは1
    
    for i in range(n):
        for j in range(i):
            if heights[j] < heights[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)


if __name__ == "__main__":
    import sys
    input_data = sys.stdin.read().strip().split()
    n: int = int(input_data[0])
    heights: List[int] = list(map(int, input_data[1:]))
    
    result: int = longest_increasing_subsequence(n, heights)
    print(result)
# ```

# ---

# ### 処理時間

# * 外側ループ n 回、内側ループ最大 n 回 → O(n²)
# * n ≤ 5000 の場合、最大 25,000,000 回程度の比較演算 → 実行可能

# ### メモリ消費量

# * `heights`: n 要素 (最大 5000)
# * `dp`: n 要素 (最大 5000)
# * 使用メモリは O(n) ≈ 数万程度の整数格納 → 数百 KB 程度

# ---

# ✅ 入力例

# ```
# 5
# 100
# 102
# 101
# 91
# 199
# ```

# ✅ 出力

# ```
# 3
# ```

# ---

# こちらは O(n²) DP 解法ですが、もし n がもっと大きい（例: 10^5 以上）場合は、二分探索を用いた O(n log n) LIS アルゴリズムに切り替える必要があります。

# 👉 この問題の範囲（n ≤ 5000）では O(n²) DP で十分です。

# ---

# ご希望があれば、O(n log n) 版の実装も提示できますが、用意しますか？
