# ## 1. 問題分析

# ### 競技プログラミング視点

# * **実行速度**: 一度の走査 O(n) が最速。
# * **メモリ効率**: 定数領域 O(1)。
# * **Python制約**: インタープリターのループコストを抑えるため、組み込み swap 操作で実装。

# ### 業務開発視点

# * **可読性**: 「赤=0, 白=1, 青=2」を扱うことを明示。
# * **保守性**: 変数名を `low`, `mid`, `high` として直感的に。
# * **型ヒント**: `List[int]` を利用。
# * **エラーハンドリング**: 入力検証を追加。

# ### Python特有の考慮点

# * `list` アクセスは O(1) → インデックス操作で効率的。
# * ループ回数は最大 n → Python のオーバーヘッドは許容範囲。
# * 内包表記は不要（就地変更なので return しない）。

# ---

# ## 2. アルゴリズム比較

# | アプローチ                            | 時間計算量 | 空間計算量 | 実装コスト | 可読性 | Python標準ライブラリ活用 | 備考        |
# | -------------------------------- | ----- | ----- | ----- | --- | --------------- | --------- |
# | 方法A: Dutch National Flag (ポインタ法) | O(n)  | O(1)  | 中     | 高   | なし              | 最適解       |
# | 方法B: カウントソート                     | O(n)  | O(1)  | 中     | 中   | Counter         | 2回走査が必要   |
# | 方法C: バブル/選択ソート                   | O(n²) | O(1)  | 低     | 高   | なし              | 小規模専用、非推奨 |

# ---

# ## 3. 実装方針

# * **選択アプローチ**: 方法A（Dutch National Flag アルゴリズム）
# * **理由**:

#   * 計算量 O(n), 空間 O(1) → 最速・最省メモリ。
#   * Python でも swap 操作で簡潔に記述可能。
#   * 可読性を保ちながら競技・業務両対応。

# ---

# ## 4. コード実装例

# ```python
from typing import List


class Solution:
    def sortColors(self, nums: List[int]) -> None:
        """
        オランダ国旗問題の解法 (業務開発向け堅牢版)

        Args:
            nums (List[int]): 色を表す配列 (0=赤, 1=白, 2=青)
        Returns:
            None: 配列を in-place でソート
        Raises:
            ValueError: 入力が空、または 0/1/2 以外を含む場合
        """
        if not nums:
            raise ValueError("Input must not be empty")
        if any(num not in (0, 1, 2) for num in nums):
            raise ValueError("Input must contain only 0, 1, or 2")

        low, mid, high = 0, 0, len(nums) - 1
        while mid <= high:
            if nums[mid] == 0:
                nums[low], nums[mid] = nums[mid], nums[low]
                low += 1
                mid += 1
            elif nums[mid] == 1:
                mid += 1
            else:  # nums[mid] == 2
                nums[mid], nums[high] = nums[high], nums[mid]
                high -= 1

    def sortColors_optimized(self, nums: List[int]) -> None:
        """
        競技プログラミング向け最適化版
        - 入力検証を省略
        - 性能最優先
        """
        low, mid, high = 0, 0, len(nums) - 1
        while mid <= high:
            if nums[mid] == 0:
                nums[low], nums[mid] = nums[mid], nums[low]
                low += 1
                mid += 1
            elif nums[mid] == 1:
                mid += 1
            else:
                nums[mid], nums[high] = nums[high], nums[mid]
                high -= 1


# ```

# ---

# ## 5. 計算量まとめ

# * **時間計算量**: O(n)
# * **空間計算量**: O(1)
# * **Python固有オーバーヘッド**:

#   * ループの実行コストは O(n) で支配的。
#   * `swap` 操作はタプルアンパックで効率的に実行可能。

# ---

# ## 6. Python固有の最適化観点

# * **組み込み関数活用**: `any` を使って入力検証を簡潔化。
# * **不要コピー回避**: in-place で処理。
# * **型ヒント**: `List[int]` → Pylance による静的解析可能。
# * **slots やジェネレータ**: 今回は不要。

# ---

# ✅ 以上により、**業務向けには `sortColors` を使用、競プロでは `sortColors_optimized` を使用**する二段構成がベストです。
