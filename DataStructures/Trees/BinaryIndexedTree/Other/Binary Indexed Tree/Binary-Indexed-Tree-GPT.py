# ```python
from typing import List

class Solution:
    def buildBIT(self, n: int, A: List[int]) -> List[int]:
        """
        長さnの配列Aに対してBIT(Binary Indexed Tree)を構築する

        Parameters
        ----------
        n : int
            配列Aの長さ
        A : List[int]
            長さnの整数配列 (0-indexed)

        Returns
        -------
        List[int]
            長さn+1のBIT配列 (BIT[0] = 0)
        
        計算量: O(n log n)
        メモリ使用量: O(n)
        """
        BIT: List[int] = [0] * (n + 1)

        for i in range(1, n + 1):
            # i を 2 で割れる最大回数 = 最下位ビット
            length: int = i & -i
            total: int = 0
            # その区間長分の和を求める
            for j in range(i - length + 1, i + 1):
                total += A[j - 1]  # Aは0-indexed
            BIT[i] = total

        return BIT


# ---- 実行部 ----
if __name__ == "__main__":
    import sys

    data: List[str] = sys.stdin.read().strip().split()
    n: int = int(data[0])
    A: List[int] = list(map(int, data[1:]))

    sol: Solution = Solution()
    BIT: List[int] = sol.buildBIT(n, A)

    print(" ".join(map(str, BIT)))
# ```

# ---

# ### 実装の特徴

# 1. **型注釈を明示**

#    * `List[int]` を使用し、`Pylance` の型チェックに対応。
# 2. **計算量**

#    * 各 i で区間長分だけ加算するため、最悪でも `O(n log n)`。
#    * n ≤ 200,000 でも十分高速。
# 3. **メモリ消費量**

#    * 配列は `O(n)` 個で、200,000 件でも問題なし。
# 4. **LeetCode 対応**

#    * `class Solution` 内でメソッドとして定義。

# ---

# この解法は**理解しやすい実装**ですが、もしLeetCodeでより高速な\*\*O(n)\*\*のBIT構築が必要なら、Fenwick Treeの累積加算で最適化できます。

# 希望すれば、**O(n)** バージョンも提示可能です。
# こちらも作成しますか？
