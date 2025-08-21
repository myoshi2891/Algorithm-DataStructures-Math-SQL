# Pythonでの最適化されたGroup Anagramsソリューションを3つの実装パターンで提供しました。

# ## 🎯 実装の特徴

# ### **基本実装 (Solution)**
# - **型安全性**: `List[str]`, `Dict[str, List[str]]` で完全な型注釈
# - **defaultdict使用**: キー存在チェックが不要で高速
# - **文字列ソート**: 標準的なアプローチで安定性重視

# ### **メモリ最適化版 (SolutionOptimized)**
# - **tupleキー**: 文字列結合のオーバーヘッドを削減
# - **メモリ効率**: 中間文字列生成を回避

# ### **文字カウント版 (SolutionCountBased)**
# - **ソート不要**: O(N × K) の最適時間計算量
# - **固定配列**: 26文字の配列で文字カウント
# - **最高速度**: 大量データで特に有効

# ## ⚡ パフォーマンス比較

# | 実装 | 時間計算量 | 空間計算量 | 特徴 |
# |------|------------|------------|------|
# | Solution | O(N × K log K) | O(N × K) | 標準実装、安定性重視 |
# | SolutionOptimized | O(N × K log K) | O(N × K) | メモリ効率最適化 |
# | SolutionCountBased | O(N × K) | O(N × K) | 最高速度、ソート不要 |

# ## 🔧 LeetCode最適化ポイント

# 1. **defaultdict使用**: `if key not in dict` チェックが不要
# 2. **型注釈**: Pylanceエラーを完全回避
# 3. **メモリ効率**: 不要な中間オブジェクト生成を削減
# 4. **CPython最適化**: 内蔵関数(`sorted`, `ord`)を活用

# 制約条件（文字列数≤10⁴、文字列長≤100）に対して、`SolutionCountBased`が最も高速でLeetCodeでの実行時間短縮に効果的です。

from typing import List, Dict, Tuple
from collections import defaultdict


class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        """
        アナグラムをグループ化するメソッド
        
        Args:
            strs: 文字列のリスト
            
        Returns:
            グループ化されたアナグラムの2次元リスト
            
        Time Complexity: O(N * K log K)
            - N: 文字列の数 (len(strs))
            - K: 最長文字列の長さ
            - sorted()によるソートがO(K log K)
            
        Space Complexity: O(N * K)
            - defaultdict内の全文字列を格納
            - ソートされたキーの保存
        """
        # defaultdictを使用してキーが存在しない場合の処理を簡素化
        anagram_groups: Dict[str, List[str]] = defaultdict(list)
        
        # 各文字列を処理
        for s in strs:
            # 文字列をソートしてキーとして使用
            # sorted()はリストを返すため、tupleに変換してハッシュ可能にする
            sorted_key: str = ''.join(sorted(s))
            
            # アナグラムグループに文字列を追加
            anagram_groups[sorted_key].append(s)
        
        # defaultdictの値（アナグラムのグループ）をリストとして返却
        return list(anagram_groups.values())


# 代替実装1: tupleをキーとして使用（メモリ効率重視）
class SolutionOptimized:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        """
        tupleキーを使用したメモリ最適化版
        
        Args:
            strs: 文字列のリスト
            
        Returns:
            グループ化されたアナグラムの2次元リスト
            
        メモリ使用量を削減するためtupleキーを使用
        文字列結合のオーバーヘッドを回避
        """
        # anagram_groups: Dict[tuple, List[str]] = defaultdict(list)
        anagram_groups: Dict[Tuple[str, ...], List[str]] = defaultdict(list)

        for s in strs:
            # sorted()の結果をtupleに変換してキーとして使用
            # sorted_key: tuple = tuple(sorted(s))
            sorted_key: Tuple[str, ...] = tuple(sorted(s))
            anagram_groups[sorted_key].append(s)
        
        return list(anagram_groups.values())


# 代替実装2: 文字カウント方式（ソート不要）
class SolutionCountBased:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        """
        文字カウントを使用したソート不要版
        
        Args:
            strs: 文字列のリスト
            
        Returns:
            グループ化されたアナグラムの2次元リスト
            
        Time Complexity: O(N * K)
            - ソートが不要のため高速
            
        Space Complexity: O(N * K)
            - 文字カウント配列の保存が必要
        """
        # anagram_groups: Dict[tuple, List[str]] = defaultdict(list)
        anagram_groups: Dict[Tuple[int, ...], List[str]] = defaultdict(list)

        for s in strs:
            # 各文字の出現回数をカウント（a-z の26文字）
            char_count: List[int] = [0] * 26
            
            for char in s:
                char_count[ord(char) - ord('a')] += 1
            
            # カウント配列をtupleに変換してキーとして使用
            # count_key: tuple = tuple(char_count)
            count_key: Tuple[int, ...] = tuple(char_count)
            anagram_groups[count_key].append(s)
        
        return list(anagram_groups.values())
    
# 修正されたPylanceエラー
# 主な修正点
# 1.
# Tupleのインポート追加
# from typing import List, Dict, Tuple  # Tupleを追加
# 2.
# 具体的なTuple型注釈
# # ❌ 以前（曖昧な型）
# sorted_key: tuple = tuple(sorted(s))
# anagram_groups: Dict[tuple, List[str]] = defaultdict(list)

# # ✅ 修正後（具体的な型）
# sorted_key: Tuple[str, ...] = tuple(sorted(s))
# anagram_groups: Dict[Tuple[str, ...], List[str]] = defaultdict(list)
# 3.
# 文字カウント版の型修正
# # ❌ 以前
# count_key: tuple = tuple(char_count)
# anagram_groups: Dict[tuple, List[str]] = defaultdict(list)

# # ✅ 修正後
# count_key: Tuple[int, ...] = tuple(char_count)
# anagram_groups: Dict[Tuple[int, ...], List[str]] = defaultdict(list)
# 型安全性の向上
# `Tuple[str, ...]`: 文字列の可変長タプル
# `Tuple[int, ...]`: 整数の可変長タプル（文字カウント用）
# 明示的な型定義: Pylanceによる静的解析が完全に機能
# これらの修正により、Pylanceエラーが完全に解決され、型安全性が大幅に向上しました。
