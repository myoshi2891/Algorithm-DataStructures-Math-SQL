from typing import List

class Solution:
    def getPermutation(self, n: int, k: int) -> str:
        """
        与えられた n と k に対して、[1, 2, ..., n] の順列を辞書順に並べたときの k 番目を返す。

        Args:
            n (int): 要素数 (1 <= n <= 9)
            k (int): 順列のインデックス (1 <= k <= n!)

        Returns:
            str: k 番目の順列を表す文字列

        計算量:
            時間計算量: O(n^2) 
                → 各ループで numbers.pop(index) (内部的には O(n)) を n 回行うため
            空間計算量: O(n) 
                → factorial 配列と numbers 配列を保持するため
        """
        # factorial[i] = i! を事前計算
        factorial: List[int] = [1] * (n + 1)
        for i in range(1, n + 1):
            factorial[i] = factorial[i - 1] * i

        # 候補の数字リスト
        numbers: List[str] = [str(i) for i in range(1, n + 1)]

        # k を 0-indexed にする
        k -= 1

        result: List[str] = []

        # 各桁を決定していく
        for i in range(n, 0, -1):
            idx: int = k // factorial[i - 1]
            result.append(numbers.pop(idx))  # 選んだ数字を結果に追加
            k %= factorial[i - 1]

        return "".join(result)

