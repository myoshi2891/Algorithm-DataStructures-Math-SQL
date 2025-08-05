from typing import List


class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        """
        ビットマスクを使用して数独ボードが有効かどうかを判定するメソッド
        
        Args:
            board (List[List[str]]): 9x9の数独ボード（文字列の2次元リスト）
                                   各セルは'1'-'9'の数字または'.'（空セル）
        
        Returns:
            bool: ボードが有効な場合True、無効な場合False
        """
        # 各行、各列、各3x3ボックスで使用されている数字をビットマスクで管理
        # ビット位置: 数字1 -> bit 0, 数字2 -> bit 1, ..., 数字9 -> bit 8
        rows: List[int] = [0] * 9     # 9個の行用ビットマスク
        cols: List[int] = [0] * 9     # 9個の列用ビットマスク
        boxes: List[int] = [0] * 9    # 9個の3x3ボックス用ビットマスク
        
        # ボード全体を一度だけスキャン
        for i in range(9):
            for j in range(9):
                cell: str = board[i][j]
                
                # 空のセルはスキップ
                if cell == '.':
                    continue
                
                # 数字を0-8の範囲に変換してビット位置を取得
                digit: int = int(cell) - 1  # '1' -> 0, '2' -> 1, ..., '9' -> 8
                bit_mask: int = 1 << digit  # 対応するビット位置に1を設定
                
                # 3x3ボックスのインデックスを計算
                box_index: int = (i // 3) * 3 + (j // 3)
                
                # ビットマスクを使用した重複チェック（各チェックはO(1)）
                if (rows[i] & bit_mask) or (cols[j] & bit_mask) or (boxes[box_index] & bit_mask):
                    return False
                
                # ビットマスクに数字を記録（OR演算でビットを設定）
                rows[i] |= bit_mask
                cols[j] |= bit_mask
                boxes[box_index] |= bit_mask
        
        return True
    
    def _get_digit_from_char(self, char: str) -> int:
        """
        文字を数字に変換するヘルパー関数
        
        Args:
            char (str): '1'-'9'の文字
            
        Returns:
            int: 0-8の範囲の数字（ビット位置用）
        """
        return ord(char) - ord('1')
    
    def _create_bit_mask(self, digit: int) -> int:
        """
        指定された数字に対応するビットマスクを作成するヘルパー関数
        
        Args:
            digit (int): 0-8の範囲の数字
            
        Returns:
            int: 対応するビット位置に1が設定されたビットマスク
        """
        return 1 << digit
    
    def _check_bit_collision(self, current_mask: int, new_bit: int) -> bool:
        """
        ビットマスクでの衝突（重複）をチェックするヘルパー関数
        
        Args:
            current_mask (int): 現在のビットマスク
            new_bit (int): 新しく追加するビット
            
        Returns:
            bool: 衝突がある場合True、ない場合False
        """
        return bool(current_mask & new_bit)


# より最適化されたバージョン（インライン処理）
class SolutionOptimized:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        """
        最適化されたビットマスク版数独検証メソッド
        ヘルパー関数を使わずインライン処理で高速化
        
        Args:
            board (List[List[str]]): 9x9の数独ボード
            
        Returns:
            bool: ボードが有効な場合True、無効な場合False
        """
        # 27個の整数でメモリ使用量を最小化（各整数は最大512 = 2^9の値）
        masks: List[int] = [0] * 27  # [0-8]: rows, [9-17]: cols, [18-26]: boxes
        
        for i in range(9):
            for j in range(9):
                if board[i][j] == '.':
                    continue
                
                # インライン処理で関数呼び出しオーバーヘッドを削減
                bit: int = 1 << (int(board[i][j]) - 1)
                box_idx: int = 18 + (i // 3) * 3 + (j // 3)
                
                # 一つの条件文で3つの制約を同時チェック
                if masks[i] & bit or masks[9 + j] & bit or masks[box_idx] & bit:
                    return False
                
                # ビットマスクを同時更新
                masks[i] |= bit
                masks[9 + j] |= bit
                masks[box_idx] |= bit
        
        return True