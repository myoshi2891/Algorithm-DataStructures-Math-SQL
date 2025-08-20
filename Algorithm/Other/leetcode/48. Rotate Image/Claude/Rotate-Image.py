# Python版のソリューションを作成しました。LeetCode形式に合わせた主な特徴：

# **LeetCode要件への対応:**
# - `class Solution`でメソッド定義
# - `typing.List`を使用した型注釈
# - `None`返却値を明示

# **Pylance対応の型安全性:**
# - 全ての変数に明示的な型注釈（`int`）
# - `//`演算子で整数除算を明示（`/`だとfloatになる可能性）
# - `typing.List[List[int]]`で2次元リストの型を完全指定

# **パフォーマンス最適化:**
# - **時間計算量**: O(n²) - 各要素を正確に1回処理
# - **空間計算量**: O(1) - 一時変数`top`のみ使用
# - レイヤーベースの4要素同時回転でメモリ効率を最大化

# **コード品質:**
# - 詳細なdocstring（引数、返却値、計算量）
# - 各処理ステップの日本語コメント
# - 座標計算の論理を明確に説明

# この実装はTypeScript版と同じアルゴリズムを使用し、Pythonの型システムとLeetCodeの要件を満たしています。

from typing import List

class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        """
        2D行列を90度時計回りに回転させる関数（in-place）
        
        Args:
            matrix (List[List[int]]): n×nの2次元リスト（1 <= n <= 20, -1000 <= matrix[i][j] <= 1000）
        
        Returns:
            None: 元のリストを直接変更するため返却値なし
        
        Time Complexity: O(n²) - 全ての要素を1回ずつ処理
        Space Complexity: O(1) - 一時変数のみ使用
        """
        n: int = len(matrix)
        
        # レイヤーごとに処理（外側から内側へ）
        # Math.floor(n / 2) と同等だが、整数除算(//)を使用してPylanceの型エラーを回避
        for layer in range(n // 2):
            first: int = layer              # 現在レイヤーの開始インデックス
            last: int = n - 1 - layer       # 現在レイヤーの終了インデックス
            
            # 各レイヤーの各要素を4つずつ同時に回転
            # 最後の要素は除く（角の要素は他の辺で処理されるため）
            for i in range(first, last):
                offset: int = i - first      # オフセット計算
                
                # 4つの対応する要素の座標計算:
                # top:    matrix[first][i]
                # right:  matrix[i][last] 
                # bottom: matrix[last][last - offset]
                # left:   matrix[last - offset][first]
                
                # 上辺の要素を一時保存（上書きを防ぐため）
                top: int = matrix[first][i]
                
                # 時計回りに4要素を同時回転
                # left → top
                matrix[first][i] = matrix[last - offset][first]
                
                # bottom → left  
                matrix[last - offset][first] = matrix[last][last - offset]
                
                # right → bottom
                matrix[last][last - offset] = matrix[i][last]
                
                # top → right（保存した値を使用）
                matrix[i][last] = top