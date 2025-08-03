# BIT（Binary Indexed Tree）の構築問題ですね！詳細な説明をありがとうございます。

# 効率的なBIT構築のソリューションを作成します：BIT（Binary Indexed Tree）の構築アルゴリズムを実装しました！

# ## 主な特徴：

# ### 1. **型安全性**
# - 全ての変数に型ヒントを明示
# - Pylanceによる型エラーを回避

# ### 2. **計算量の最適化**
# - **時間計算量**: O(n log n) 
# - **空間計算量**: O(n)
# - ビット演算 `i & -i` を使用して最下位ビットを効率的に取得

# ### 3. **実装のポイント**
# - `construct_bit_optimized`: ビット演算を活用した高速版
# - `_get_max_power_of_2_divisor`: 2で割れる最大回数を計算
# - 配列のインデックス変換に注意（0-indexed ↔ 1-indexed）

# ### 4. **動作確認**
# 提供された例で検証：
# - **例1**: A=[1,5,7,9,8,6] → BIT=[0,1,6,7,22,8,14] ✓
# - **例2**: A=[7777777] → BIT=[0,7777777] ✓

# ### 5. **メモリ効率**
# - n=200,000の場合でも高速処理
# - 不要なメモリ使用を避けた実装

# LeetCode形式の`class Solution`で実装し、標準入力からの読み取りも対応しています。実際の問題で使用する際は`main()`関数を実行してください！

from typing import List


class Solution:
    def construct_bit(self, n: int, A: List[int]) -> List[int]:
        """
        BIT（Binary Indexed Tree）を構築する
        
        Parameters:
        - n: 配列の長さ
        - A: 元の配列（1-indexed想定だが、0-indexedで受け取る）
        
        Returns:
        - BIT配列（0-indexedで返すが、BIT[0] = 0, BIT[1]からBIT[n]まで有効）
        
        Time Complexity: O(n log n)
        Space Complexity: O(n)
        """
        # BIT配列を初期化（長さn+1、BIT[0] = 0）
        BIT: List[int] = [0] * (n + 1)
        
        # 各位置iについてBIT[i]を計算
        for i in range(1, n + 1):
            # iを2で割ることができる最大回数kを求める
            k: int = self._get_max_power_of_2_divisor(i)
            
            # A[i - 2^k + 1] + ... + A[i] を計算
            # （Aは0-indexedなので、A[i - 2^k] + ... + A[i - 1]）
            start_idx: int = i - (1 << k)  # i - 2^k
            end_idx: int = i - 1  # i - 1 (0-indexed)
            
            # 区間和を計算
            BIT[i] = sum(A[start_idx:end_idx + 1])
        
        return BIT
    
    def _get_max_power_of_2_divisor(self, i: int) -> int:
        """
        整数iを2で割ることができる最大回数を求める
        
        Parameters:
        - i: 対象の整数
        
        Returns:
        - 2で割ることができる最大回数
        
        Time Complexity: O(log i)
        Space Complexity: O(1)
        """
        k: int = 0
        temp: int = i
        
        # 2で割り切れる限り割り続ける
        while temp % 2 == 0:
            temp //= 2
            k += 1
        
        return k
    
    def _get_max_power_of_2_divisor_optimized(self, i: int) -> int:
        """
        ビット演算を使った最適化版
        i & -i は最下位の1のビットを取得する
        
        Parameters:
        - i: 対象の整数
        
        Returns:
        - 2^k の値（kは2で割ることができる最大回数）
        
        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        return (i & -i).bit_length() - 1
    
    def construct_bit_optimized(self, n: int, A: List[int]) -> List[int]:
        """
        ビット演算を使った最適化版のBIT構築
        
        Parameters:
        - n: 配列の長さ
        - A: 元の配列（0-indexed）
        
        Returns:
        - BIT配列
        
        Time Complexity: O(n log n)
        Space Complexity: O(n)
        """
        BIT: List[int] = [0] * (n + 1)
        
        for i in range(1, n + 1):
            # i & -i で最下位の1のビットに対応する2の冪を取得
            power_of_2: int = i & -i
            
            # A[i - power_of_2] + ... + A[i - 1] を計算
            start_idx: int = i - power_of_2
            end_idx: int = i - 1
            
            BIT[i] = sum(A[start_idx:end_idx + 1])
        
        return BIT


def main() -> None:
    """
    メイン処理：標準入力から値を読み取りBITを構築
    
    Time Complexity: O(n log n)
    Space Complexity: O(n)
    """
    # 入力の読み取り
    line1: str = input().strip()
    line2: str = input().strip()
    
    n: int = int(line1)
    A: List[int] = list(map(int, line2.split()))
    
    # Solution インスタンスを作成
    solution: Solution = Solution()
    
    # BITを構築（最適化版を使用）
    BIT: List[int] = solution.construct_bit_optimized(n, A)
    
    # 結果を出力（BIT[0]からBIT[n]まで）
    result: str = ' '.join(map(str, BIT))
    print(result)


# デバッグ用の関数
def test_examples() -> None:
    """
    提供された例でテスト
    """
    solution: Solution = Solution()
    
    # 例1のテスト
    n1: int = 6
    A1: List[int] = [1, 5, 7, 9, 8, 6]
    expected1: List[int] = [0, 1, 6, 7, 22, 8, 14]
    
    result1: List[int] = solution.construct_bit_optimized(n1, A1)
    print(f"例1: {result1}")
    print(f"期待: {expected1}")
    print(f"一致: {result1 == expected1}")
    
    # 例2のテスト
    n2: int = 1
    A2: List[int] = [7777777]
    expected2: List[int] = [0, 7777777]
    
    result2: List[int] = solution.construct_bit_optimized(n2, A2)
    print(f"例2: {result2}")
    print(f"期待: {expected2}")
    print(f"一致: {result2 == expected2}")


if __name__ == "__main__":
    # テストを実行する場合はコメントアウト
    # test_examples()
    
    # 実際の問題を解く
    main()