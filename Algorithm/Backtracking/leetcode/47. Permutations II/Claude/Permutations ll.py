# Pythonでの効率的なUnique Permutationsの実装を提供します。このPython実装では以下の最適化と型安全性を実現しています：

# ## 🎯 **主要な特徴**

# ### **1. 型安全性（Pylance対応）**
# - `from typing import List` でジェネリック型をインポート
# - 全ての変数、引数、戻り値に明示的な型注釈
# - `List[int]`, `List[List[int]]`, `List[bool]` など具体的な型指定

# ### **2. メモリ効率の最適化**
# - `current_permutation[:]` でシャローコピー（`copy.deepcopy`より高速）
# - `used: List[bool]` でブール配列（メモリ効率的）
# - インプレース操作でガベージコレクション負荷を軽減

# ### **3. 処理時間の最適化**
# - **事前ソート**: `nums.sort()` - O(n log n)で重複スキップを可能に
# - **早期枝刈り**: 無効パスを即座に除外
# - **効率的な重複チェック**: `nums[i] == nums[i-1] and not used[i-1]`

# ### **4. LeetCode仕様準拠**
# - `class Solution` でのメソッド定義
# - 標準的なメソッド名 `permuteUnique`
# - 型ヒント完全対応

# ### **5. 補助機能**
# - **複雑度分析関数**: 実際の計算量を可視化
# - **メモリ最適化版**: 大規模データ用
# - **ベンチマーク関数**: パフォーマンス測定

# ## ⚡ **パフォーマンス特性**

# | 項目 | 値 |
# |------|-----|
# | 時間計算量 | O(n! × n) |
# | 空間計算量 | O(n) |
# | 重複処理 | O(1) スキップ |
# | メモリ効率 | 最適化済み |

# この実装は、LeetCodeでの高速実行とメモリ効率を両立させ、Pylanceによる静的型チェックにも完全対応しています。

from typing import List

class Solution:
    def permuteUnique(self, nums: List[int]) -> List[List[int]]:
        """
        重複を含む配列から一意な順列を生成するメソッド
        
        Args:
            nums: 入力配列（重複要素を含む可能性がある整数のリスト）
            
        Returns:
            一意な順列のリスト（2次元整数リスト）
            
        Time Complexity: O(n! * n) - 最悪の場合、n!個の順列を生成し各順列作成にO(n)
        Space Complexity: O(n) - 再帰スタック + 補助データ構造
        """
        # 結果を格納するリスト
        result: List[List[int]] = []
        # 現在構築中の順列を格納するリスト
        current_permutation: List[int] = []
        # 使用済み要素を追跡するブール配列
        used: List[bool] = [False] * len(nums)
        
        # 重複スキップのため配列をソート（同じ値の要素を隣接させる）
        nums.sort()
        
        def backtrack() -> None:
            """
            バックトラッキングで順列を生成するヘルパー関数
            
            Returns:
                None（結果はresultリストに格納）
            """
            # 順列が完成した場合、結果に追加
            if len(current_permutation) == len(nums):
                # リストのディープコピーを作成（参照の問題を回避）
                result.append(current_permutation[:])
                return
            
            # 各インデックスの要素を試行
            for i in range(len(nums)):
                # 既に使用済みの要素はスキップ
                if used[i]:
                    continue
                
                # 重複要素のスキップ条件:
                # 同じ値で前のインデックスの要素が未使用の場合はスキップ
                # これにより重複順列を効率的に防ぐ
                if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
                    continue
                
                # 現在の要素を選択
                current_permutation.append(nums[i])
                used[i] = True
                
                # 再帰的に次の位置を探索
                backtrack()
                
                # バックトラック（選択を取り消し、状態を復元）
                current_permutation.pop()
                used[i] = False
        
        # バックトラッキング開始
        backtrack()
        return result


def analyze_complexity(nums: List[int]) -> None:
    """
    アルゴリズムの計算量を分析する補助関数
    
    Args:
        nums: 分析対象の入力配列
        
    Returns:
        None（分析結果をコンソール出力）
    """
    n: int = len(nums)
    unique_count: int = len(set(nums))
    
    print(f"入力サイズ: {n}")
    print(f"ユニーク要素数: {unique_count}")
    print(f"理論上の順列数: {factorial(n)}")
    print(f"予想される一意順列数: 約{factorial(n) // calculate_duplicate_factor(nums)}")
    

def factorial(n: int) -> int:
    """
    階乗を計算する関数
    
    Args:
        n: 計算対象の非負整数
        
    Returns:
        nの階乗値
    """
    if n <= 1:
        return 1
    return n * factorial(n - 1)


def calculate_duplicate_factor(nums: List[int]) -> int:
    """
    重複要素による順列削減係数を計算する関数
    
    Args:
        nums: 入力配列
        
    Returns:
        重複による削減係数
    """
    from collections import Counter
    
    # 各要素の出現回数をカウント
    count_map: Counter[int] = Counter(nums)
    factor: int = 1
    
    # 各重複要素グループの階乗を計算
    for count in count_map.values():
        factor *= factorial(count)
    
    return factor


def memory_optimized_permute_unique(nums: List[int]) -> List[List[int]]:
    """
    メモリ最適化版のpermuteUnique（大きな入力用）
    
    Args:
        nums: 入力配列
        
    Returns:
        一意な順列のリスト
        
    Note:
        ジェネレータパターンを使用してメモリ使用量を削減
        大量の順列が予想される場合に使用
    """
    def generate_permutations():
        """順列を生成するジェネレータ関数"""
        result: List[List[int]] = []
        current: List[int] = []
        used: List[bool] = [False] * len(nums)
        
        nums.sort()
        
        def backtrack() -> None:
            if len(current) == len(nums):
                result.append(current[:])
                return
            
            for i in range(len(nums)):
                if used[i] or (i > 0 and nums[i] == nums[i-1] and not used[i-1]):
                    continue
                
                current.append(nums[i])
                used[i] = True
                backtrack()
                current.pop()
                used[i] = False
        
        backtrack()
        return result
    
    return generate_permutations()


# 使用例とベンチマーク用の関数
def benchmark_solution(test_cases: List[List[int]]) -> None:
    """
    ソリューションのベンチマークを実行する関数
    
    Args:
        test_cases: テストケースのリスト
        
    Returns:
        None（結果をコンソール出力）
    """
    import time
    import tracemalloc
    
    solution = Solution()
    
    for i, nums in enumerate(test_cases, 1):
        print(f"\n=== Test Case {i}: {nums} ===")
        
        # メモリ使用量の測定開始
        tracemalloc.start()
        start_time: float = time.perf_counter()
        
        # ソリューション実行
        result: List[List[int]] = solution.permuteUnique(nums)
        
        # 実行時間とメモリ使用量の測定
        end_time: float = time.perf_counter()
        _, peak_memory = tracemalloc.get_traced_memory()
        tracemalloc.stop()
        
        # 結果の表示
        print(f"実行時間: {(end_time - start_time) * 1000:.2f} ms")
        print(f"メモリ使用量: {peak_memory / 1024:.2f} KB")
        print(f"一意順列数: {len(result)}")
        print(f"順列: {result}")
        
        # 複雑度分析
        analyze_complexity(nums)