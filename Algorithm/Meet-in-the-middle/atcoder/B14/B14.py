# 以下は、**Python (CPython 3.11.4)** を用いて、**半分全列挙（Meet-in-the-middle）** 手法で解く実装です。
# 処理時間・メモリ消費を考慮して、最大 $N = 30$ にも対応可能です。

# ## ✅ 解法概要

# * 配列を **2つに分割**（最大15要素ずつ）
# * 各部分集合の和を列挙（`2^15 = 32,768` 通り）
# * **二分探索**により、合計がちょうど `K` になるか確認

# ## ✅ 実装（Python 3.11.4・型付き）

from typing import List
import sys
import bisect

def get_subset_sums(arr: List[int]) -> List[int]:
    n: int = len(arr)
    result: List[int] = []
    for bit in range(1 << n):
        total: int = 0
        for i in range(n):
            if bit & (1 << i):
                total += arr[i]
        result.append(total)
    return result

def main() -> None:
    input = sys.stdin.read
    data = list(map(int, input().split()))
    
    N: int = data[0]
    K: int = data[1]
    A: List[int] = data[2:]
    
    mid: int = N // 2
    left: List[int] = A[:mid]
    right: List[int] = A[mid:]
    
    left_sums: List[int] = get_subset_sums(left)
    right_sums: List[int] = get_subset_sums(right)
    right_sums.sort()
    
    for x in left_sums:
        remain: int = K - x
        idx: int = bisect.bisect_left(right_sums, remain)
        if idx < len(right_sums) and right_sums[idx] == remain:
            print("Yes")
            return
    print("No")

if __name__ == "__main__":
    main()

# ## ✅ 入出力例

# ### 入力

# ```
# 6 30
# 5 1 18 7 2 9
# ```

# ### 出力

# ```
# Yes
# ```

# ---

# ## ✅ 時間計算量

# | ステップ                  | 計算量                                             |
# | --------------------- | ----------------------------------------------- |
# | 部分集合和列挙 (`2^(N/2)`)   | $O(2^{N/2} \cdot N) \approx 500,000$（最大）        |
# | ソート                   | $O(2^{N/2} \log 2^{N/2})$                       |
# | 二分探索 × `left_sums` 件数 | $O(2^{N/2} \log 2^{N/2})$                       |
# | **合計**                | $O(2^{N/2} \log 2^{N/2})$ ≒ $3 \times 10^5$（高速） |

# ---

# ## ✅ メモリ計算量

# * 各部分和リスト：最大 $2^{15} = 32,768$ 要素 × 2つ ≒ 約 260 KB 程度
# * 制限（1024 MiB）には **余裕で収まる**

# ---

# ## ✅ 備考

# * `bisect.bisect_left` により、Python 標準ライブラリで高速な二分探索が可能
# * 型アノテーションにより、静的型解析ツール（mypy等）にも対応

