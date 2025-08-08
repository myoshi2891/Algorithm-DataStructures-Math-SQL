# ```python
# Runtime
# 3
# ms
# Beats
# 97.48%
# Memory
# 17.74
# MB
# Beats
# 87.72%

from typing import List

class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        """
        与えられた候補数字(candidates)から、合計がtargetとなる全ての組み合わせを返す。
        同じ数字は何度でも利用可能で、順序の異なる同一組み合わせは重複しない。

        Parameters
        ----------
        candidates : List[int]
            候補となる整数のリスト（全て異なる）
        target : int
            合計値（目標値）

        Returns
        -------
        List[List[int]]
            targetに一致する組み合わせのリスト

        制約
        ----
        1 <= len(candidates) <= 30
        2 <= candidates[i] <= 40
        1 <= target <= 40

        計算量
        -----
        時間計算量: O(N^(T/M)) （N=候補数, T=target, M=候補の最小値）
        空間計算量: O(T/M)（再帰スタック）+ O(#解答)（結果保存）
        """
        res: List[List[int]] = []
        path: List[int] = []

        def dfs(start: int, current_sum: int) -> None:
            # targetに到達 → 結果追加
            if current_sum == target:
                res.append(path.copy())
                return
            # 候補を順に試す
            for i in range(start, len(candidates)):
                next_sum = current_sum + candidates[i]
                # 枝刈り: targetを超えたら終了
                if next_sum > target:
                    continue
                path.append(candidates[i])
                dfs(i, next_sum)  # 同じ数字を再利用可能
                path.pop()  # 戻って他の候補を試す

        dfs(0, 0)
        return res
# ```

# ---

# ### 実装のポイント

# 1. **`start`インデックスで順序違いの重複を回避**

#    * 例: \[2,3,2] と \[2,2,3] は同じ組み合わせなので1度だけ返す
# 2. **枝刈り (`if next_sum > target`)**

#    * 計算量を削減し、高速化
# 3. **`path.copy()`で結果保存**

#    * `path`は参照なので、コピーしてから保存しないと変更が影響してしまう
# 4. **Pylance型エラー防止**

#    * `List[int]`, `List[List[int]]` を明示

# ---

# このコードは

# * LeetCodeの制約（最大150通りの組み合わせ）で **TLEやメモリ超過なし**
# * Python (CPython 3.11.4) で安全に動作
# * Pylanceの型検査でもエラーなし

# ---

# もし希望があれば、このPython版の処理も **探索ツリー図** を付けて詳しく解析できます。
# これをやると理解がさらに深まります。
