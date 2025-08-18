# では **Python 3.8.10** 用に、型ヒントを付けて、処理時間・メモリの消費量に注意した **配列を使うDP版** を実装します。

# ```python
import sys
from typing import List

def count_ways_dp(n: int) -> int:
    """
    n 段の階段を上る方法の数を DP（配列）で計算する関数
    
    Parameters
    ----------
    n : int
        段数 (1 ≦ n ≦ 40)
    
    Returns
    -------
    int
        n 段の階段を上る方法の数
    """
    # dp[i] = i 段を上る方法の数
    dp: List[int] = [0] * (n + 1)
    dp[0] = 1  # 0段目は「何もしない」1通り
    
    for i in range(1, n + 1):
        if i >= 1:
            dp[i] += dp[i - 1]  # 1 段上る場合
        if i >= 2:
            dp[i] += dp[i - 2]  # 2 段上る場合
    
    return dp[n]

if __name__ == "__main__":
    # 標準入力から整数 n を取得
    input_data: str = sys.stdin.read().strip()
    n: int = int(input_data)
    
    # 計算して出力
    print(count_ways_dp(n))
# ```

# ---

# ## 実装のポイント

# ### 計算量

# * **時間計算量**: O(n)
#   ループは n 回、各ループで加算は最大 2 回 → 加算回数は `2n - 1` 回。
#   n ≤ 40 なので実行時間は 1μs〜数十μs程度（環境依存）。
# * **メモリ計算量**: O(n)
#   dp配列は `n + 1` 要素（整数）。
#   Python の `int` は可変長ですが、n ≤ 40 の場合は全て 32bit に収まり、要素1つあたり数十バイト程度。
#   全体でも数百バイト程度で非常に軽量。

# ### 関数化の理由

# * 再利用性の向上
# * 単体テストが容易
# * 入力・出力部分とロジックを分離できる

# ---

# もしこの後、**同じアルゴリズムの O(1) メモリ版（2変数で計算する版）** も提示すれば、DP配列版とのメモリ消費比較が可能です。

# 先ほどの DP 配列版と同じ漸化式を使いつつ、**直近 2 ステップ分の変数だけを保持**することで **O(1) メモリ** にした Python 実装を示します。

# ```python
# import sys

# def count_ways_optimized(n: int) -> int:
#     """
#     n 段の階段を上る方法の数を O(1) メモリで計算する関数
    
#     Parameters
#     ----------
#     n : int
#         段数 (1 ≦ n ≦ 40)
    
#     Returns
#     -------
#     int
#         n 段の階段を上る方法の数
#     """
#     # dp[0] = 1, dp[1] = 1
#     if n == 0:
#         return 1
#     if n == 1:
#         return 1

#     prev2: int = 1  # dp[i-2]
#     prev1: int = 1  # dp[i-1]

#     for _ in range(2, n + 1):
#         current: int = prev1 + prev2
#         prev2, prev1 = prev1, current

#     return prev1

# if __name__ == "__main__":
#     input_data: str = sys.stdin.read().strip()
#     n: int = int(input_data)
#     print(count_ways_optimized(n))
# ```

# ---

# ## 比較（配列版 vs O(1) 版）

# | 項目          | 配列版 DP                     | O(1) メモリ版         |
# | ----------- | -------------------------- | ----------------- |
# | **メモリ量**    | O(n) 要素 → n ≤ 40 なら数百バイト程度 | O(1) → 数十バイト程度    |
# | **時間計算量**   | O(n)                       | O(n)              |
# | **可視化しやすさ** | 途中経過（dp 配列）が追える            | 途中経過は追えない（最終結果のみ） |
# | **用途**      | 学習・デバッグに向く                 | 実運用・省メモリが必要な場合に向く |

# ---

# もし希望があれば、この **O(1) 版と配列版の処理過程を並べてトレース図** を作成し、違いを視覚的に比較できますが、それもやりますか？
# そうすれば「配列を捨てるとどうメモリ消費が減るか」が一目で分かります。
