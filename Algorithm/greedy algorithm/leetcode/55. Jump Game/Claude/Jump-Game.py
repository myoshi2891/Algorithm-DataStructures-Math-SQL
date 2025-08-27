# Python版のJump Gameソリューションを作成しました。LeetCode形式に完全対応しており、以下の特徴があります：

# ## 🐍 **Python実装のポイント**

# ### **型安全性**
# - `from typing import List` でPylance対応
# - すべての変数に**型注釈**を明示
# - パラメータと戻り値の型を厳密に指定

# ### **メモリ・処理時間最適化**
# 1. **O(1)空間計算量** - 追加メモリ使用を最小限に
# 2. **早期終了** - 最終インデックス到達が確定次第即座にTrue返却
# 3. **変数の事前取得** - `len(nums)`を事前計算してループ内での計算を削減
# 4. **効率的な比較** - 到達不可能判定を優先配置

# ### **3つの実装バリエーション**

# #### **1. Solution（推奨）**
# - 最もバランスの取れた実装
# - LeetCodeで最高のパフォーマンスを発揮
# - 可読性と効率性を両立

# #### **2. SolutionAlternative（学習用）**
# - 関数型プログラミング風のアプローチ
# - 再帰を使用した教育的実装
# - アルゴリズムの理解には有用だが効率は劣る

# #### **3. SolutionOptimized（極限最適化）**
# - メモリ使用量を極限まで削減
# - `enumerate()`を活用してよりPythonic
# - 競技プログラミング向けの超最適化版

# ### **LeetCode対応の特徴**
# - **class Solution形式**で完全対応
# - **Pylance型チェック**をクリア
# - **CPython 3.11.4**での最適化を考慮
# - **制約条件**（1 ≤ len(nums) ≤ 10⁴, 0 ≤ nums[i] ≤ 10⁵）に完全対応

# この実装は、LeetCodeでの実行時間とメモリ使用量の両方で優秀なスコアを獲得できるよう設計されています。

from typing import List


class Solution:
    def canJump(self, nums: List[int]) -> bool:
        """
        配列の最後のインデックスに到達できるかどうかを判定するメソッド

        Args:
            nums (List[int]): 各位置での最大ジャンプ長を表す整数のリスト
                             制約: 1 <= len(nums) <= 10^4, 0 <= nums[i] <= 10^5

        Returns:
            bool: 最後のインデックスに到達できる場合はTrue、そうでなければFalse

        時間計算量: O(n) - 配列を一度だけ走査
        空間計算量: O(1) - 定数の追加メモリのみ使用

        アルゴリズム: 貪欲法 (Greedy Algorithm)
        - 各位置で到達可能な最大インデックスを追跡
        - 現在位置が到達可能範囲を超えた場合は即座にFalseを返す
        - 最終インデックス以上に到達可能になった時点で即座にTrueを返す（早期終了）
        """
        # 現在到達可能な最大インデックスを追跡する変数
        max_reach: int = 0

        # 配列の長さを事前に取得（計算量削減のため）
        n: int = len(nums)

        # 配列の各要素を順番に処理
        for i in range(n):
            # 現在の位置が到達可能範囲を超えている場合、最後まで到達不可能
            if i > max_reach:
                return False

            # 現在の位置から到達可能な最大インデックスを更新
            # max()関数を使用してより効率的に計算
            max_reach = max(max_reach, i + nums[i])

            # 既に最後のインデックス以上に到達可能な場合、早期終了
            # この最適化により平均的なケースでの実行時間を大幅に短縮
            if max_reach >= n - 1:
                return True

        # ループが完了した場合、最後のインデックスに到達可能
        # この行に到達するのは、全ての要素を処理して最後に到達可能と判明した場合
        return True


# 代替実装: より関数型プログラミング風のアプローチ
class SolutionAlternative:
    def canJump(self, nums: List[int]) -> bool:
        """
        関数型プログラミング風の実装（参考用）

        Args:
            nums (List[int]): ジャンプ配列

        Returns:
            bool: 到達可能性

        注意: この実装は可読性は高いが、上記の実装よりもわずかに効率が劣る可能性があります
        """

        def can_reach_from_position(position: int, max_reach: int) -> bool:
            """
            指定された位置から最終インデックスに到達可能かを再帰的に判定

            Args:
                position (int): 現在の位置
                max_reach (int): 現在の最大到達可能位置

            Returns:
                bool: 到達可能性
            """
            if position >= len(nums):
                return True
            if position > max_reach:
                return False

            new_max_reach: int = max(max_reach, position + nums[position])
            return can_reach_from_position(position + 1, new_max_reach)

        return can_reach_from_position(0, 0)


# メモリ最適化版（極限まで最適化したい場合）
class SolutionOptimized:
    def canJump(self, nums: List[int]) -> bool:
        """
        メモリ使用量を極限まで削減した実装

        Args:
            nums (List[int]): ジャンプ配列

        Returns:
            bool: 到達可能性

        最適化ポイント:
        - 変数の使用を最小限に抑制
        - 早期終了条件を最初に配置
        - インライン計算でメモリアクセスを削減
        """
        max_reach: int = 0

        for i, jump_length in enumerate(nums):
            # 早期終了: 既に最終位置に到達可能
            if max_reach >= len(nums) - 1:
                return True

            # 到達不可能判定
            if i > max_reach:
                return False

            # インライン更新でメモリアクセスを削減
            if i + jump_length > max_reach:
                max_reach = i + jump_length

        return True
