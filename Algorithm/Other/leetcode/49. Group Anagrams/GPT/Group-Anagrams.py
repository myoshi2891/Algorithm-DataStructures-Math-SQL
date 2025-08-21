# ```python
from typing import List, Dict
from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        """
        Group anagrams together.

        Parameters
        ----------
        strs : List[str]
            入力の文字列配列 (1 <= len(strs) <= 10^4, 各要素は英小文字)

        Returns
        -------
        List[List[str]]
            アナグラムごとにグループ化された二次元配列 (順序は任意)

        計算量
        -----
        時間計算量: O(N * L log L)
            - 各文字列のソートに O(L log L) (L = 文字列長)
            - N 個処理するので合計 O(N * L log L)
        空間計算量: O(N * L)
            - defaultdict に最大 N 個のキー
            - 各キーに紐づく文字列配列を保持
        """
        # key: ソート済み文字列, value: アナグラムのリスト
        anagram_map: Dict[str, List[str]] = defaultdict(list)

        for s in strs:
            # 文字列をソートしてキー生成
            key: str = ''.join(sorted(s))
            anagram_map[key].append(s)

        # 辞書の値のみをリスト化して返却
        return list(anagram_map.values())
# ```
