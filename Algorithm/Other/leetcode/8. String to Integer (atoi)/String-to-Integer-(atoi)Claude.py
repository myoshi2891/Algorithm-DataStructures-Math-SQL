# この問題は文字列を32bit符号付き整数に変換する問題です。アルゴリズムに従って実装します。実装のポイント：

# 1. **型注釈**: すべての変数と関数に適切な型注釈を付けています。
# 2. **処理時間**: O(n) - 文字列を一度だけ走査するため、文字列の長さに比例します。
# 3. **メモリ消費量**: O(1) - 固定数の変数のみ使用し、入力サイズに依存しません。

# **アルゴリズムの詳細**:

# - **Step 1**: 先頭の空白文字をスキップ
# - **Step 2**: 符号（`+` または `-`）を判定
# - **Step 3**: 数字文字を順次読み取り、整数に変換
# - **Step 4**: 32bit整数の範囲内に収める

# **オーバーフロー対策**:
# - 乗算前にオーバーフローをチェックすることで、実際のオーバーフローを防いでいます
# - `result > (INT_MAX - digit) // 10` の条件で事前にチェック

# **エッジケース対応**:
# - 空文字列
# - 空白のみの文字列  
# - 符号のみの文字列
# - 数字以外の文字が最初に現れる場合
# - 整数範囲外の値

# この実装はPylanceの型チェックもパスし、LeetCodeの要件を満たしています。

class Solution:
    def myAtoi(self, s: str) -> int:
        """
        文字列を32bit符号付き整数に変換する関数
        
        Args:
            s (str): 変換対象の文字列
            
        Returns:
            int: 変換された32bit符号付き整数
            
        Time Complexity: O(n) - 文字列の長さに比例
        Space Complexity: O(1) - 定数領域のみ使用
        """
        # 32bit符号付き整数の範囲を定義
        INT_MIN: int = -2**31  # -2147483648
        INT_MAX: int = 2**31 - 1  # 2147483647
        
        # 空文字列の場合は0を返す
        if not s:
            return 0
        
        # インデックスと符号を初期化
        i: int = 0
        sign: int = 1
        result: int = 0
        
        # Step 1: 先頭の空白文字をスキップ
        while i < len(s) and s[i] == ' ':
            i += 1
        
        # 文字列がすべて空白の場合
        if i == len(s):
            return 0
        
        # Step 2: 符号を判定
        if s[i] == '-':
            sign = -1
            i += 1
        elif s[i] == '+':
            sign = 1
            i += 1
        
        # Step 3: 数字を読み取り
        while i < len(s) and s[i].isdigit():
            digit: int = int(s[i])
            
            # オーバーフローチェック
            # result * 10 + digit が INT_MAX を超える場合
            if result > (INT_MAX - digit) // 10:
                return INT_MIN if sign == -1 else INT_MAX
            
            result = result * 10 + digit
            i += 1
        
        # Step 4: 符号を適用し、範囲内に収める
        result *= sign
        
        # 範囲チェック（念のため）
        if result < INT_MIN:
            return INT_MIN
        elif result > INT_MAX:
            return INT_MAX
        
        return result