# 以下に、制約 `1 ≤ N < 10^15` を満たす効率的な Python 実装を提示します。
# 逐次的に `f(1) + f(2) + ... + f(N)` を計算すると間に合わないため、**桁DP（Digit DP）** を用いて計算量とメモリ使用量を抑えます。

# ---

# ## ✅ 方針概要

# * 各 `x` に対して `f(x)` は「x の各桁の和」です。
# * `1 〜 N` すべてに対して f(x) を逐次計算するのではなく、**各桁における数字の出現回数**を数えて桁和の合計を導出します。
# * Python の再帰上限とメモリ制限に配慮してメモ化再帰（lru\_cache）を使用。

# ---

# ## ✅ Pythonコード（CPython 3.11.4対応、型・コメント付き）

# ```python
import sys
sys.setrecursionlimit(1 << 25)  # 深い再帰に対応

from functools import lru_cache

def main() -> None:
    N = input().strip()
    print(sum_of_digit_sums(N))

# ------------------- 解法本体 -------------------

def sum_of_digit_sums(N_str: str) -> int:
    """
    f(1) + f(2) + ... + f(N) を返す。
    
    :param N_str: N（最大15桁）の文字列
    :return: 総和（整数）
    """
    digits: list[int] = list(map(int, N_str))
    L: int = len(digits)

    @lru_cache(maxsize=None)
    def dp(pos: int, tight: bool, leading_zero: bool, total: int) -> int:
        """
        桁DP：現在の位置から作れる数の各桁の和の合計
        
        :param pos: 現在の桁（0-indexed）
        :param tight: 上限制約（Trueならdigits[pos]以下）
        :param leading_zero: 現在先頭が0の状態か（0はf(0)=0として無視）
        :param total: ここまでの桁和
        :return: 桁和の合計
        """
        if pos == L:
            return 0 if leading_zero else total  # leading zero は数と見なさない

        limit: int = digits[pos] if tight else 9
        res: int = 0
        for d in range(0, limit + 1):
            next_tight = tight and (d == limit)
            next_leading_zero = leading_zero and (d == 0)
            add = 0 if next_leading_zero else d
            res += dp(pos + 1, next_tight, next_leading_zero, total + add)
        return res

    return dp(0, True, True, 0)

# ------------------- 入力処理 -------------------

if __name__ == "__main__":
    main()
# ```

# ---

# ## ✅ 処理時間・メモリ使用量

# | 指標        | 説明                                 |
# | --------- | ---------------------------------- |
# | 実行時間      | 約 0.02〜0.1 秒（N < 10¹⁵ まで）          |
# | 再帰回数      | 最大で `15 * 2 * 2 * 135` ≒ 数千回（許容範囲） |
# | メモリ使用量    | 数MB以下（再帰キャッシュ + 関数スタック）            |
# | Python互換性 | CPython 3.11.4 / PyPy 3対応可         |

# ---

# ## ✅ テスト例

# ### 入力:

# ```
# 4
# ```

# 出力:

# ```
# 10
# ```

# ### 入力:

# ```
# 288
# ```

# 出力:

# ```
# 2826
# ```

# ### 入力（最大級）:

# ```
# 999999999999999
# ```

# 出力:

# ```
# ?（すぐに完了、1秒以内）※必要なら値出力可能
# ```

# ---

# ## ✅ 補足：簡易チェック用の愚直解（小N向け）

# ```python
# def brute(N: int) -> int:
#     return sum(sum(int(c) for c in str(i)) for i in range(1, N + 1))
# ```

# ---

# ## ✅ まとめ

# * 再帰＋メモ化（桁DP）で効率よく解ける。
# * `leading_zero` を管理し、`f(0)` を含めないよう注意。
# * lru\_cache により再帰も高速・省メモリ。

# ---

# 必要であれば「愚直版と差分チェック」「単体テスト」「解の復元」なども提供できます。
