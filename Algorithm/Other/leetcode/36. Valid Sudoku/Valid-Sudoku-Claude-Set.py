# このPython実装の特徴：

# 1. **型安全性**: `typing.List`を使用し、すべての変数に適切な型アノテーションを付けています

# 2. **効率的な一回のスキャン**: ボード全体を一度だけスキャンして、すべての制約を同時にチェック

# 3. **メモリ効率**: 各行、列、3x3ボックスに対してsetを使用し、重複検出を高速化（O(1)の検索時間）

# 4. **3x3ボックスインデックス計算**: `(i // 3) * 3 + (j // 3)` を使用して効率的に計算

# 5. **早期終了**: 重複が見つかった瞬間に `False` を返すため、不要な処理を回避

# 6. **Pylance対応**: 型ヒントが正しく設定されており、静的解析ツールによるエラーを防止

# **時間計算量**: O(1) - 9x9の固定サイズボードなので定数時間
# **空間計算量**: O(1) - 最大でも各setに9個の要素が格納されるだけなので定数空間

# この実装はLeetCodeでの性能を重視し、リスト内包表記やset操作の効率性を活用して最適化されています。

# Runtime
# 0
# ms
# Beats
# 100.00%
# Memory
# 17.63
# MB
# Beats
# 92.44%

from typing import List

class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        """
        数独ボードが有効かどうかを判定するメソッド
        
        Args:
            board (List[List[str]]): 9x9の数独ボード（文字列の2次元リスト）
                                   各セルは'1'-'9'の数字または'.'（空セル）
        
        Returns:
            bool: ボードが有効な場合True、無効な場合False
        """
        # 各行、各列、各3x3ボックスで使用されている数字を追跡するset
        rows: List[set[str]] = [set() for _ in range(9)]
        cols: List[set[str]] = [set() for _ in range(9)]
        boxes: List[set[str]] = [set() for _ in range(9)]
        
        # ボード全体を一度だけスキャン
        for i in range(9):
            for j in range(9):
                cell: str = board[i][j]
                
                # 空のセルはスキップ
                if cell == '.':
                    continue
                
                # 3x3ボックスのインデックスを計算
                box_index: int = (i // 3) * 3 + (j // 3)
                
                # 重複チェック
                if cell in rows[i] or cell in cols[j] or cell in boxes[box_index]:
                    return False
                
                # 数字を各setに追加
                rows[i].add(cell)
                cols[j].add(cell)
                boxes[box_index].add(cell)
        
        return True