# では、TypeScript で説明した **two-pointer 法** を Python (CPython 3.11.4) 用に書き直します。
# LeetCode の仕様に合わせて **`class Solution`** を使い、Pylance で型エラーが出ないように型ヒントも付与します。
# 時間計算量は **O(n)**、追加メモリは **O(1)** です。

# ```python
from typing import List

class Solution:
    def trap(self, height: List[int]) -> int:
        """
        Trapping Rain Water
        :param height: 各位置の柱の高さを表す整数配列
        :return: 溜まる水の総量

        制約:
        - 1 <= len(height) <= 2 * 10^4
        - 0 <= height[i] <= 10^5

        時間計算量: O(n)  (n は配列の長さ)
        空間計算量: O(1)  (定数メモリ)
        """
        n: int = len(height)
        if n < 3:
            return 0  # 棒が2本以下では水は溜まらない

        left: int = 0
        right: int = n - 1
        left_max: int = 0
        right_max: int = 0
        water: int = 0

        while left < right:
            if height[left] < height[right]:
                if height[left] >= left_max:
                    left_max = height[left]
                else:
                    water += left_max - height[left]
                left += 1
            else:
                if height[right] >= right_max:
                    right_max = height[right]
                else:
                    water += right_max - height[right]
                right -= 1

        return water
# ```

# ---

# ## 実装のポイント

# 1. **型ヒント**

#    * `height: List[int]`
#    * 戻り値は `int`
#    * 変数にも型アノテーションを追加 → Pylance 型チェック対応

# 2. **性能**

#    * **時間計算量**: `O(n)` → 左右から中央に向かって1回の走査
#    * **空間計算量**: `O(1)` → 補助配列なし、変数のみ使用

# 3. **LeetCode 用仕様**

#    * `class Solution` 内に `trap` メソッドを定義
#    * 外部から `Solution().trap([...])` で呼び出せる

