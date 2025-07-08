# 以下に、Python を用いた高速解法（しゃくとり法）を **型アノテーション付き・効率重視** で実装し、**実行時間とメモリ使用量**も考慮したコードを提示します。

# ## ✅ 問題概要（再掲）

# * 長さ `N` の配列 `A` において、連続部分列のうち合計が `K` 以下であるものの数を求める。
# * 制約:

#   * `1 ≤ N ≤ 10^5`
#   * `1 ≤ K ≤ 10^9`
#   * `1 ≤ A[i] ≤ 10^9`

# ## ✅ 解法：**しゃくとり法（Two Pointers）**

# * 時間計算量: **O(N)**（`right` ポインタは最大で N 回進む）
# * 空間計算量: **O(N)**（入力配列の保持のみ）

# ## ✅ Python 実装（型明示・高速 I/O）

from typing import List
import sys

def count_subarrays_with_sum_leq_k(N: int, K: int, A: List[int]) -> int:
    count: int = 0
    total: int = 0
    right: int = 0

    for left in range(N):
        while right < N and total + A[right] <= K:
            total += A[right]
            right += 1

        count += right - left

        if right == left:
            right += 1  # A[left] > K のとき
        else:
            total -= A[left]

    return count

def main() -> None:
    input = sys.stdin.read
    data: List[str] = input().split()
    
    N: int = int(data[0])
    K: int = int(data[1])
    A: List[int] = list(map(int, data[2:]))

    result: int = count_subarrays_with_sum_leq_k(N, K, A)
    print(result)

if __name__ == "__main__":
    main()

# ## ✅ 実行方法（オンラインジャッジ等）

# ```bash
# $ python3 main.py < input.txt
# ```

# ---

# ## ✅ パフォーマンス評価

# | 項目       | 評価                  |
# | -------- | ------------------- |
# | 時間計算量    | O(N)                |
# | 空間計算量    | O(N)（配列保持のみ）        |
# | メモリ使用目安  | ≦ 約1MB（N=1e5 の整数配列） |
# | 実行時間（参考） | 数十ms程度（PyPyで高速）     |

# ---

# ## ✅ 処理の流れ図解（簡易）

# ```text
# [11, 12, 16, 22, 27, 28, 31]
#  ↑                           left
#  ↑                           right
#  sum = 0 → rightを右へ進めて条件を満たす間続ける
#  → 合計 13通りをカウント
# ```

