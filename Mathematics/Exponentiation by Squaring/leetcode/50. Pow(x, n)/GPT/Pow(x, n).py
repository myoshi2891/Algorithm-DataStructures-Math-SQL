# ```python
# from typing import Union

class Solution:
    def myPow(self, x: float, n: int) -> float:
        """
        pow 関数
        Parameters
        ----------
        x : float
            基数 ( -100.0 < x < 100.0 )
        n : int
            指数 ( -2^31 <= n <= 2^31 - 1 )

        Returns
        -------
        float
            x の n 乗 ( x^n )

        処理内容
        --------
        - n が負の場合は逆数に変換 ( 1 / x^(-n) )
        - 高速累乗法 (Exponentiation by Squaring) を用いて O(log |n|) 時間で計算
        - ループで実装することで O(1) 空間に抑制
        """

        exponent: int = n
        # 負の指数を処理
        if exponent < 0:
            x = 1.0 / x
            exponent = -exponent

        result: float = 1.0
        base: float = x

        # 高速累乗法 (Exponentiation by Squaring)
        while exponent > 0:
            # exponent が奇数なら result に base を掛ける
            if exponent % 2 == 1:
                result *= base
            # base を自乗し、指数を半分にする
            base *= base
            exponent //= 2

        return result
# ```

# ---

# ## ⚡ 計算量解析

# * **時間計算量:** `O(log |n|)`

#   * ループ毎に指数 `N` を半分にしていくため。
# * **空間計算量:** `O(1)`

#   * 再帰を使用せず、定数個の変数 (`result`, `base`, `N`) のみを利用。

# ---

# ## ✅ Pylance 型チェック

# * 引数 `x: float`, `n: int`
# * 戻り値 `float`
# * 中間変数 `result: float`, `base: float`, `N: int`
# * 型の矛盾がないため **Pylance でも型エラーは発生しません**。

# ---

# 👉 必要であれば、この Python 実装についても **処理を図解して解析**しましょうか？

# 修正内容
# 1. 定数再定義エラーの解決
# # 修正前
# N: int = n
# if N < 0:
#     N = -N

# # 修正後
# exponent: int = n
# if exponent < 0:
#     exponent = -exponent
# 2. 未使用インポートの削除
# # 修正前
# from typing import Union

# # 修正後
# # インポート文を削除
# 3. 変数名の一貫性
# N → exponent に変更して意味を明確化
# コメントも対応する変数名に更新
# 📝 Pylance対応のポイント
# 大文字変数名の回避: Pylanceは大文字で始まる変数を定数として扱うため、再代入時にエラーが発生
# 未使用インポートの削除: コードの品質向上とlinterエラーの回避
# 意味のある変数名: exponentにより可読性が向上
# これでPylanceの型チェックエラーがすべて解消されます。
