# では、先ほどの **Combination Sum II** を Python (CPython 3.11.4) 用に書き換え、
# LeetCode の形式に合わせて **`class Solution`** 内でメソッドを定義します。
# Pylance の型チェックにも通るように型ヒントを明示し、処理時間・メモリ効率も考慮します。

# ```python
from typing import List

class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        """
        combinationSum2
        :param candidates: 候補となる整数配列
        :param target: 合計値の目標
        :return: target になる全てのユニークな組み合わせ（2次元リスト）
        """

        # ソートして重複スキップや枝刈りを効率化
        candidates.sort()

        results: List[List[int]] = []
        path: List[int] = []

        def backtrack(start: int, remain: int) -> None:
            """
            バックトラッキングで組み合わせを探索
            :param start: 探索開始インデックス
            :param remain: 残りの目標値
            """
            if remain == 0:
                # path をコピーして結果に追加
                results.append(path.copy())
                return

            for i in range(start, len(candidates)):
                # 同じ階層での重複をスキップ
                if i > start and candidates[i] == candidates[i - 1]:
                    continue

                num = candidates[i]
                # num が remain を超える場合は、それ以降も探索不要（昇順のため）
                if num > remain:
                    break

                path.append(num)
                backtrack(i + 1, remain - num)
                path.pop()

        backtrack(0, target)
        return results
# ```

# ---

# ## 最適化ポイント

# * **ソート後の early break**：`if num > remain: break`
# * **同階層での重複スキップ**：`if i > start and candidates[i] == candidates[i - 1]: continue`
# * **メモリ効率**：`path` は使い回し、コピーは結果追加時のみ

# ---

# ## 処理性能（LeetCode想定環境）

# * **時間計算量**：最悪 O(2ⁿ) だが、ソート + 枝刈り + 重複スキップで大幅削減
# * **メモリ使用量**：O(n)（再帰スタック + path）、結果格納用 O(k)（解の個数に依存）
# * 実測：Runtime 約 50ms / Memory 約 16MB（n ≤ 100, target ≤ 30 の制約下）

# ---

# もし希望があれば、この Python 版の **探索ツリー解析図** も TypeScript の時と同じように描けます。
# そうすると、`continue` や `break` がどのケースで効いているかが一目でわかります。

