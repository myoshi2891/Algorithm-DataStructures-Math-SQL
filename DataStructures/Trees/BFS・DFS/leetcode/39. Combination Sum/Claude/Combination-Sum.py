# DFS（深さ優先探索）+ バックトラッキングを使ったPython実装を4つのバリエーションで提供しました。
# Runtime
# 4
# ms
# Beats
# 90.69%
# Memory
# 18.10
# MB
# Beats
# 19.61%
# ## 🔍 **実装の特徴**

# ### 1. **標準的なDFS + バックトラッキング** (`Solution`)
# - **探索戦略**: 深さ優先で全ての可能性を探索
# - **バックトラッキング**: 各選択後に状態を復元
# - **枝刈り**: ソート済み配列による早期終了

# ### 2. **最適化版DFS** (`SolutionOptimizedDFS`)
# - **while文使用**: `range()`のオーバーヘッドを削減
# - **不要な計算排除**: `current_sum`パラメータを削除
# - **メモリ効率**: 最小限の状態管理

# ### 3. **反復的DFS** (`SolutionIterativeDFS`)
# - **スタックベース**: 再帰のオーバーヘッドを回避
# - **明示的スタック**: `List[tuple[int, List[int], int]]`
# - **メモリ制御**: 深い再帰による Stack Overflow を防止

# ### 4. **関数型DFS** (`dfs_combination_sum_functional`)
# - **純粋関数**: 副作用のない実装
# - **関数合成**: ヘルパー関数との組み合わせ
# - **クラス外使用**: 独立した関数として利用可能

# ## ⚡ **パフォーマンス分析**

# | 実装方式 | 時間計算量 | 空間計算量 | 特徴 |
# |---------|------------|------------|------|
# | 再帰DFS | O(N^(T/M)) | O(T/M) | 直感的、理解しやすい |
# | 最適化DFS | O(N^(T/M)) | O(T/M) | CPU効率最適化 |
# | 反復DFS | O(N^(T/M)) | O(T/M) | スタック制御、安定性 |
# | 関数型DFS | O(N^(T/M)) | O(T/M) | 関数型プログラミング |

# ## 🎯 **DFS + バックトラッキングの核心**

# ```python
# # DFS の核心パターン
# path.append(candidate)              # 選択
# dfs(index, path, remaining - candidate)  # 深く探索
# path.pop()                          # バックトラック（選択取り消し）
# ```

# この実装は：
# - **Pylance型チェック** 完全対応
# - **CPython 3.11.4** の最適化機能を活用
# - **LeetCode形式** で即座に使用可能
# - **メモリ効率** と **処理速度** を両立

# 特に `SolutionOptimizedDFS` は大規模なテストケースでも優秀なパフォーマンスを発揮します。

from typing import List

class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        """
        DFS（深さ優先探索）+ バックトラッキングで組み合わせ問題を解く
        
        Args:
            candidates (List[int]): 重複のない整数配列（各要素は無制限に使用可能）
            target (int): 目標とする合計値
            
        Returns:
            List[List[int]]: 目標値に達する全ての組み合わせの配列
        """
        result: List[List[int]] = []
        
        # 前処理: ソートして枝刈りを効率化（O(n log n)）
        candidates.sort()
        
        def dfs_backtrack(
            index: int, 
            current_path: List[int], 
            current_sum: int, 
            remaining_target: int
        ) -> None:
            """
            DFS + バックトラッキングによる深さ優先探索
            
            Args:
                index (int): 現在探索中の候補のインデックス
                current_path (List[int]): 現在の探索パス（組み合わせ）
                current_sum (int): 現在のパスの合計値
                remaining_target (int): 残りの目標値
                
            Returns:
                None: 結果はresultリストに蓄積される
                
            Time Complexity: O(N^(T/M)) where N=len(candidates), T=target, M=min(candidates)
            Space Complexity: O(T/M) for recursion stack depth
            """
            # ベースケース1: 目標値に到達（成功）
            if remaining_target == 0:
                result.append(current_path[:])  # 浅いコピーで結果に追加
                return
            
            # ベースケース2: 目標値を超過（失敗）
            if remaining_target < 0:
                return
            
            # DFS: 各候補に対して深さ優先探索を実行
            for i in range(index, len(candidates)):
                candidate: int = candidates[i]
                
                # 枝刈り最適化: ソート済み配列の利点を活用
                # 現在の候補が残り目標値より大きい場合、以降の候補も全て大きい
                if candidate > remaining_target:
                    break  # 早期終了でパフォーマンス向上
                
                # --- DFS段階: 候補を選択して深く探索 ---
                current_path.append(candidate)  # パスに追加
                
                # 再帰的DFS: 同じ候補の再利用を許可（indexはiのまま）
                dfs_backtrack(
                    i,  # 同じインデックスから開始（重複使用可能）
                    current_path,
                    current_sum + candidate,
                    remaining_target - candidate
                )
                
                # --- バックトラッキング段階: 選択を取り消して他の選択肢を試行 ---
                current_path.pop()  # パスから削除（状態を復元）
        
        # DFS探索開始
        dfs_backtrack(0, [], 0, target)
        return result


class SolutionOptimizedDFS:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        """
        最適化されたDFS + バックトラッキング実装
        メモリ効率とCPU効率を両立
        
        Args:
            candidates (List[int]): 候補配列
            target (int): 目標値
            
        Returns:
            List[List[int]]: 全ての有効な組み合わせ
        """
        result: List[List[int]] = []
        candidates.sort()  # O(n log n) 前処理
        
        def optimized_dfs(start_idx: int, path: List[int], remaining: int) -> None:
            """
            最適化されたDFS実装
            - 不要なcurrent_sum計算を排除
            - メモリアクセス回数を最小化
            
            Args:
                start_idx (int): 探索開始インデックス
                path (List[int]): 現在の探索パス
                remaining (int): 残り目標値
            """
            # 成功条件
            if remaining == 0:
                result.append(path[:])
                return
            
            # while文で範囲チェックを最小化（パフォーマンス向上）
            idx: int = start_idx
            while idx < len(candidates):
                candidate: int = candidates[idx]
                
                # 枝刈り: 残り値より大きい候補は無効
                if candidate > remaining:
                    return  # ソート済みなので全て無効
                
                # DFS + バックトラッキングの核心部分
                path.append(candidate)              # 選択
                optimized_dfs(idx, path, remaining - candidate)  # 探索
                path.pop()                          # 取り消し
                
                idx += 1
        
        optimized_dfs(0, [], target)
        return result


class SolutionIterativeDFS:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        """
        反復的DFS実装（スタックベース）
        再帰のオーバーヘッドを回避してメモリ効率を向上
        
        Args:
            candidates (List[int]): 候補配列
            target (int): 目標値
            
        Returns:
            List[List[int]]: 全ての有効な組み合わせ
        """
        result: List[List[int]] = []
        candidates.sort()
        
        # スタックを使った反復的DFS
        # スタック要素: (現在のインデックス, 現在のパス, 残り目標値)
        stack: List[tuple[int, List[int], int]] = [(0, [], target)]
        
        while stack:
            index, current_path, remaining = stack.pop()
            
            # 成功条件
            if remaining == 0:
                result.append(current_path[:])
                continue
            
            # 各候補をスタックにプッシュ（逆順でプッシュして正順で処理）
            for i in range(len(candidates) - 1, index - 1, -1):
                candidate: int = candidates[i]
                
                # 枝刈り
                if candidate > remaining:
                    continue
                
                # 新しい状態をスタックにプッシュ
                new_path: List[int] = current_path + [candidate]
                stack.append((i, new_path, remaining - candidate))
        
        return result


def dfs_combination_sum_functional(candidates: List[int], target: int) -> List[List[int]]:
    """
    関数型スタイルのDFS + バックトラッキング実装
    
    Args:
        candidates (List[int]): 候補となる整数のリスト
        target (int): 目標合計値
        
    Returns:
        List[List[int]]: 全ての有効な組み合わせのリスト
    """
    def dfs_helper(
        nums: List[int], 
        target_val: int, 
        start_index: int, 
        current_combination: List[int]
    ) -> List[List[int]]:
        """
        DFS再帰ヘルパー関数
        
        Args:
            nums (List[int]): ソート済み候補配列
            target_val (int): 現在の目標値
            start_index (int): 開始インデックス
            current_combination (List[int]): 現在の組み合わせ
            
        Returns:
            List[List[int]]: 現在の状態から得られる全組み合わせ
        """
        # ベースケース
        if target_val == 0:
            return [current_combination[:]]
        
        if target_val < 0:
            return []
        
        all_combinations: List[List[int]] = []
        
        # DFS探索
        for i in range(start_index, len(nums)):
            if nums[i] > target_val:
                break
            
            # 選択 → 探索 → バックトラック
            current_combination.append(nums[i])
            sub_results = dfs_helper(nums, target_val - nums[i], i, current_combination)
            all_combinations.extend(sub_results)
            current_combination.pop()  # バックトラック
        
        return all_combinations
    
    sorted_candidates: List[int] = sorted(candidates)
    return dfs_helper(sorted_candidates, target, 0, [])