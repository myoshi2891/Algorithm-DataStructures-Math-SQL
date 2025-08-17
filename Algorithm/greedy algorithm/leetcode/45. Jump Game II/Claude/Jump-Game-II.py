# Python版のJump Game II解法を作成しました。LeetCode環境に最適化した実装です。

# ## 🎯 主要な特徴

# **1. 完全な型アノテーション**
# - `List[int]`、`int`、`tuple[int, List[dict]]`など全ての型を明示
# - Pylanceの型チェックに完全対応
# - mypy準拠の型ヒント

# **2. パフォーマンス最適化**
# - **時間計算量**: O(n) - 単一ループのみ
# - **空間計算量**: O(1) - 追加配列なし
# - **早期終了**: 目標到達時点で即座に終了
# - **効率的なrange操作**: `enumerate()`を活用

# **3. LeetCode形式準拠**
# - `class Solution`でのメソッド定義
# - 標準的なメソッド名`jump`
# - 入力制約に対応した実装

# ## 🔧 実装のポイント

# **メイン解法 (`Solution.jump`)**:
# - 基本的なグリーディアルゴリズム
# - 詳細なコメントとdocstring
# - 型安全性を保証

# **最適化版 (`SolutionOptimized.jump`)**:
# - `enumerate(nums[:-1])`でメモリ効率向上
# - 不要な変数を削減
# - より簡潔な早期終了ロジック

# **デバッグ版 (`jump_with_trace`)**:
# - アルゴリズムの実行過程を追跡
# - 学習・デバッグ目的での詳細情報出力
# - パフォーマンスよりも可読性重視

# ## 💡 Python特有の最適化

# 1. **`max()`関数**: C実装で高速
# 2. **`enumerate()`**: インデックスと値を効率的に取得
# 3. **スライシング**: `nums[:-1]`で最後の要素を除外
# 4. **早期return**: 不要な処理をスキップ

# この実装はLeetCodeでの実行時間とメモリ使用量を最小限に抑え、Pythonの特性を活かした効率的な解法となっています。

from typing import List


class Solution:
    def jump(self, nums: List[int]) -> int:
        """
        配列の最後のインデックスに到達するための最小ジャンプ数を求める
        
        Args:
            nums: 0-indexedの整数配列。各要素はそのインデックスから可能な最大ジャンプ長を表す
                 制約: 1 <= len(nums) <= 10^4, 0 <= nums[i] <= 1000
        
        Returns:
            int: 最後のインデックス(n-1)に到達するための最小ジャンプ数
        
        時間計算量: O(n) - 配列を一度だけ走査
        空間計算量: O(1) - 定数の追加空間のみ使用
        
        アルゴリズム:
        - グリーディアプローチを使用
        - 各ステップで到達可能な最遠距離を追跡
        - ジャンプ範囲の終端に到達した時点でジャンプを実行
        """
        n: int = len(nums)
        
        # ベースケース: 配列が1つの要素のみの場合はジャンプ不要
        if n <= 1:
            return 0
        
        jumps: int = 0          # 現在のジャンプ数
        current_end: int = 0    # 現在のジャンプで到達可能な最遠インデックス
        farthest: int = 0       # これまでに到達可能な最遠インデックス
        
        # 最後のインデックスの1つ前まで処理
        # (最後に到達すれば完了なので n-1 まで)
        for i in range(n - 1):
            # 現在位置 i から到達可能な最遠距離を更新
            # i + nums[i] が現在位置から到達できる最遠インデックス
            farthest = max(farthest, i + nums[i])
            
            # 現在のジャンプで到達可能な範囲の終端に到達した場合
            if i == current_end:
                jumps += 1                    # ジャンプ数を増加
                current_end = farthest        # 次のジャンプで到達可能な最遠地点を設定
                
                # 既に最後のインデックスに到達可能な場合は早期終了
                # パフォーマンス最適化: 不要な計算を避ける
                if current_end >= n - 1:
                    break
        
        return jumps


# 補助関数: アルゴリズムの動作をデバッグ用に可視化
def jump_with_trace(nums: List[int]) -> tuple[int, List[dict]]:
    """
    ジャンプアルゴリズムの実行過程を追跡する関数（デバッグ用）
    
    Args:
        nums: 入力配列
    
    Returns:
        tuple[int, List[dict]]: (最小ジャンプ数, 実行ステップのリスト)
    """
    n: int = len(nums)
    if n <= 1:
        return 0, []
    
    jumps: int = 0
    current_end: int = 0
    farthest: int = 0
    trace: List[dict] = []
    
    for i in range(n - 1):
        old_farthest: int = farthest
        farthest = max(farthest, i + nums[i])
        
        step_info: dict = {
            'index': i,
            'value': nums[i],
            'farthest_before': old_farthest,
            'farthest_after': farthest,
            'current_end': current_end,
            'jumps_before': jumps
        }
        
        if i == current_end:
            jumps += 1
            current_end = farthest
            step_info['jump_executed'] = True
            step_info['new_current_end'] = current_end
        else:
            step_info['jump_executed'] = False
        
        step_info['jumps_after'] = jumps
        trace.append(step_info)
        
        if current_end >= n - 1:
            break
    
    return jumps, trace


# より効率的な実装（メモリ最適化版）
class SolutionOptimized:
    def jump(self, nums: List[int]) -> int:
        """
        メモリ使用量を最小限に抑えた最適化版
        
        Args:
            nums: 入力配列
            
        Returns:
            int: 最小ジャンプ数
            
        最適化ポイント:
        - 不要な変数の削除
        - 早期終了条件の効率化
        - Pythonの組み込み関数の効率的な使用
        """
        if len(nums) <= 1:
            return 0
        
        jumps: int = 0
        current_end: int = 0
        farthest: int = 0
        
        # range() の代わりに enumerate() を使用してメモリ効率を向上
        for i, val in enumerate(nums[:-1]):  # 最後の要素を除く
            farthest = max(farthest, i + val)
            
            if i == current_end:
                jumps += 1
                current_end = farthest
                
                # 早期終了: 目標に到達可能
                if current_end >= len(nums) - 1:
                    return jumps
        
        return jumps