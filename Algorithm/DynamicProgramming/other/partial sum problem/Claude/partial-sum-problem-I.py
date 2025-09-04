# Pythonでの部分和問題の解法を以下に示します。

# ```python
# # File: /solution.py
# # 部分和問題の解法（動的プログラミング）

# import sys
# from typing import List

# def can_make_sum(n: int, x: int, weights: List[int]) -> bool:
#     """
#     部分和問題を動的プログラミングで解く
    
#     Args:
#         n: おもりの個数
#         x: 目標の重さ
#         weights: 各おもりの重さのリスト
    
#     Returns:
#         目標の重さを作れるかどうかの真偽値
    
#     Time Complexity: O(n × x)
#     Space Complexity: O(x)
#     """
#     # dp[j] = 重さの和がjになるかどうか
#     dp: List[bool] = [False] * (x + 1)
    
#     # 初期状態：何も選ばなければ重さ0
#     dp[0] = True
    
#     # 各おもりについて処理
#     for i in range(n):
#         weight: int = weights[i]
        
#         # 逆順でループ（同じおもりの重複使用を防ぐため）
#         for j in range(x, weight - 1, -1):
#             if dp[j - weight]:
#                 dp[j] = True
    
#     return dp[x]

# def main() -> None:
#     """
#     メイン処理：標準入力から読み取り、結果を出力
#     """
#     # 標準入力の読み込み
#     input_lines: List[str] = sys.stdin.read().strip().split('\n')
    
#     # 入力の解析
#     n, x = map(int, input_lines[0].split())
#     weights: List[int] = []
    
#     for i in range(1, n + 1):
#         weights.append(int(input_lines[i]))
    
#     # 部分和問題を解く
#     result: bool = can_make_sum(n, x, weights)
    
#     # 結果の出力
#     print("yes" if result else "no")

# if __name__ == "__main__":
#     main()
# ```

# ## より簡潔な書き方

# ```python
# # File: /solution_simple.py
# # 部分和問題の簡潔版

# # 標準入力の読み込み
# n, x = map(int, input().split())
# weights = []
# for _ in range(n):
#     weights.append(int(input()))

# # DPテーブルの初期化
# dp = [False] * (x + 1)
# dp[0] = True

# # 各おもりについて処理
# for weight in weights:
#     # 逆順でループ
#     for j in range(x, weight - 1, -1):
#         if dp[j - weight]:
#             dp[j] = True

# # 結果の出力
# print("yes" if dp[x] else "no")
# ```

# ## さらに最適化した版（メモリ効率重視）

# ```python
# File: /solution_optimized.py
# メモリ効率を重視した実装

import sys
from typing import List

def solve() -> None:
    """
    部分和問題の最適化版
    処理時間とメモリ使用量を最小化
    """
    # 高速入力
    input_data = sys.stdin.read().strip().split('\n')
    n, x = map(int, input_data[0].split())
    
    # DPテーブル（ビット演算でさらに高速化可能）
    dp: List[bool] = [False] * (x + 1)
    dp[0] = True
    
    # 各おもりについて処理
    for i in range(1, n + 1):
        weight: int = int(input_data[i])
        
        # 範囲チェック付きの逆順ループ
        for j in range(min(x, x), max(weight - 1, -1), -1):
            if j >= weight and dp[j - weight]:
                dp[j] = True
    
    # 結果出力
    sys.stdout.write("yes\n" if dp[x] else "no\n")

if __name__ == "__main__":
    solve()
# ```

# ## 動作例の詳細解説

# 入力例1での動作過程：
# ```
# n=5, x=19, weights=[7,18,5,4,8]

# 初期状態: dp = [True, False, False, ..., False] (長さ20)

# おもり1 (重さ7):
#   j=19→12: dp[19-7]=dp[12]=False → 変更なし
#   j=11→7: dp[7-7]=dp[0]=True → dp[7]=True
#   結果: dp = [True, False, ..., False, True, False, ...]
#                                       ↑(index 7)

# おもり2 (重さ18):
#   j=19→18: dp[19-18]=dp[1]=False → 変更なし
#   j=18: dp[18-18]=dp[0]=True → dp[18]=True
#   結果: dp[18]=True

# おもり3 (重さ5):
#   j=19→5の範囲で更新
#   dp[5]=True, dp[12]=True (7+5), dp[23]は範囲外

# おもり4 (重さ4):
#   各位置で更新
#   dp[4]=True, dp[9]=True, dp[11]=True, dp[16]=True, dp[22]=True

# おもり5 (重さ8):
#   dp[19]=True (11+8=19) ← ここで目標達成！

# 最終結果: dp[19]=True → "yes"
# ```

# ## 重要なポイント

# 1. **逆順ループの理由**: 同じおもりを複数回使用することを防ぐ
# 2. **型アノテーション**: コードの可読性と保守性向上
# 3. **計算量**: O(n × x) で制約条件下では十分高速
# 4. **メモリ使用量**: O(x) でメモリ効率的

# この実装は、プロジェクトの他のアルゴリズム実装と同様に、型安全性とパフォーマンスの両方を考慮した設計になっています。