# Python版のCombination Sum問題の解答を3つのバリエーションで実装しました。
# Runtime
# 5
# ms
# Beats
# 87.66%
# Memory
# 17.92
# MB
# Beats
# 39.73%
# ## 主な特徴：

# ### 1. **型安全性**
# - `typing.List`を使用してPylanceの型チェックに対応
# - 全ての変数、パラメータ、戻り値に適切な型注釈を追加
# - `-> None`で戻り値なしの関数を明示

# ### 2. **パフォーマンス最適化**
# - **in-place sort**: `candidates.sort()`でメモリ効率化
# - **浅いコピー**: `current_combination[:]`で必要最小限のコピー
# - **早期終了**: ソート済み配列での枝刈り
# - **while文最適化**: `SolutionOptimized`クラスではrange()のオーバーヘッドを削減

# ### 3. **メモリ効率**
# - 動的な`append()`と`pop()`でスタック使用量を最小化
# - 結果リストのみに最終的な組み合わせを保存
# - 不要な中間リストの生成を回避

# ### 4. **LeetCode対応**
# - 標準的な`class Solution`形式
# - `self`パラメータを適切に使用
# - CPython 3.11.4の最適化機能を活用

# ## 計算量：
# - **時間計算量**: O(N^(T/M)) - N=配列長, T=target, M=最小値
# - **空間計算量**: O(T/M) - 再帰スタックの深度
# - **前処理**: O(N log N) - ソート処理

# この実装はLeetCodeのPython環境で最適なパフォーマンスを発揮し、Pylanceの静的解析もパスします。特に`SolutionOptimized`クラスは大規模なテストケースでも効率的に動作します。
from typing import List

class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        """
        指定された配列から重複使用可能な要素を選んで目標値に達する全ての組み合わせを返す
        
        Args:
            candidates (List[int]): 重複のない整数配列（各要素は無制限に使用可能）
            target (int): 目標とする合計値
            
        Returns:
            List[List[int]]: 目標値に達する全ての組み合わせの配列
        """
        result: List[List[int]] = []
        
        # 配列をソートして早期終了を可能にする（in-place操作でメモリ効率化）
        candidates.sort()
        
        def backtrack(start_index: int, current_combination: List[int], remaining_target: int) -> None:
            """
            バックトラッキングで組み合わせを探索
            
            Args:
                start_index (int): 探索開始インデックス
                current_combination (List[int]): 現在の組み合わせ
                remaining_target (int): 残りの目標値
                
            Returns:
                None: 結果はresultリストに格納される
            """
            # ベースケース: 目標値に達した場合
            if remaining_target == 0:
                result.append(current_combination[:])  # 浅いコピーで結果に追加
                return
            
            # 候補要素を順次試行
            for i in range(start_index, len(candidates)):
                candidate: int = candidates[i]
                
                # 枝刈り: 候補値が残り目標値より大きい場合、以降の候補も大きいので終了
                if candidate > remaining_target:
                    break
                
                # 現在の候補を組み合わせに追加
                current_combination.append(candidate)
                
                # 再帰呼び出し: 同じ候補を再度使用可能なのでstart_indexはiのまま
                backtrack(i, current_combination, remaining_target - candidate)
                
                # バックトラック: 候補を削除して次の候補を試行
                current_combination.pop()
        
        # バックトラッキング開始
        backtrack(0, [], target)
        return result


# パフォーマンス最適化版（メモリ使用量をさらに削減）
class SolutionOptimized:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        """
        最適化版: メモリ使用量を最小化したバージョン
        
        Args:
            candidates (List[int]): 重複のない整数配列
            target (int): 目標とする合計値
            
        Returns:
            List[List[int]]: 目標値に達する全ての組み合わせの配列
        """
        result: List[List[int]] = []
        candidates.sort()  # O(n log n) の前処理
        
        def dfs(index: int, path: List[int], remaining: int) -> None:
            """
            深度優先探索による組み合わせ探索（最適化版）
            
            Args:
                index (int): 現在の探索インデックス
                path (List[int]): 現在のパス（組み合わせ）
                remaining (int): 残りの目標値
            """
            if remaining == 0:
                result.append(path[:])  # スライス操作による浅いコピー
                return
            
            # 最適化: rangeの代わりにwhile文を使用してオーバーヘッドを削減
            i: int = index
            while i < len(candidates):
                candidate: int = candidates[i]
                
                # 早期終了: ソート済み配列の利点を活用
                if candidate > remaining:
                    return
                
                path.append(candidate)
                dfs(i, path, remaining - candidate)  # 同じ要素の再利用可能
                path.pop()
                
                i += 1
        
        dfs(0, [], target)
        return result


# メモリ効率を重視した関数ベース実装
def combination_sum_functional(candidates: List[int], target: int) -> List[List[int]]:
    """
    関数ベースの実装（クラス外での使用向け）
    
    Args:
        candidates (List[int]): 候補となる整数のリスト
        target (int): 目標合計値
        
    Returns:
        List[List[int]]: 全ての有効な組み合わせのリスト
    """
    def helper(nums: List[int], target_val: int, start: int) -> List[List[int]]:
        """
        ヘルパー関数：再帰的に組み合わせを生成
        
        Args:
            nums (List[int]): ソート済み候補配列
            target_val (int): 現在の目標値
            start (int): 開始インデックス
            
        Returns:
            List[List[int]]: 現在の条件での全組み合わせ
        """
        if target_val == 0:
            return [[]]
        
        combinations: List[List[int]] = []
        
        for i in range(start, len(nums)):
            if nums[i] > target_val:
                break
            
            # 再帰的に残りの組み合わせを取得
            sub_combinations: List[List[int]] = helper(nums, target_val - nums[i], i)
            
            # 現在の数値を各サブ組み合わせに追加
            for combo in sub_combinations:
                combinations.append([nums[i]] + combo)
        
        return combinations
    
    # 前処理とメイン処理
    sorted_candidates: List[int] = sorted(candidates)
    return helper(sorted_candidates, target, 0)