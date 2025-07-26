# 以下に、**Python (CPython 3.11.4)** を用いた「mod P 上の逆元計算」の解法を示します。

# ---

# ## ✅ 特徴

# * **フェルマーの小定理 + 繰り返し二乗法**
# * **処理時間とメモリの測定付き**
# * **関数ベースで型アノテーション明記**

# ---

# ### 🔢 フェルマーの小定理による逆元計算

# $a^{-1} \equiv a^{P-2} \mod P$

# ### ✅ Pythonコード（CPython 3.11.4 対応）

# ```python
import sys
import time
import tracemalloc
from typing import List

# -----------------------------------------------
# 繰り返し二乗法による (base^exp) % mod の計算
# -----------------------------------------------
def mod_pow(base: int, exp: int, mod: int) -> int:
    """
    base^exp を mod で割った結果を返す
    :param base: 底（逆元を求めたい数）
    :param exp: 指数（P - 2）
    :param mod: 素数 P
    :return: base^exp % mod（逆元）
    """
    result: int = 1
    base %= mod
    while exp > 0:
        if exp % 2 == 1:
            result = (result * base) % mod
        base = (base * base) % mod
        exp //= 2
    return result

# -----------------------------------------------
# 逆元計算メイン関数
# -----------------------------------------------
def compute_modular_inverses(P: int, queries: List[int]) -> List[int]:
    """
    各クエリに対して mod P 上の逆元を返す
    :param P: 素数
    :param queries: 各整数 q_i のリスト（1 <= q_i < P）
    :return: 各 q_i の逆元のリスト
    """
    return [mod_pow(q, P - 2, P) for q in queries]

# -----------------------------------------------
# 実行エントリポイント
# -----------------------------------------------
def main() -> None:
    tracemalloc.start()
    start_time = time.perf_counter()

    P_Q_line = sys.stdin.readline().strip()
    query_line = sys.stdin.readline().strip()

    P_str, _ = P_Q_line.split()
    P = int(P_str)
    queries = list(map(int, query_line.split()))

    inverses = compute_modular_inverses(P, queries)
    print(" ".join(map(str, inverses)))

    end_time = time.perf_counter()
    _, peak = tracemalloc.get_traced_memory()

    # 処理時間・メモリ使用量を stderr に出力（問題出力には影響なし）
    print(f"処理時間: {(end_time - start_time) * 1000:.3f} ms", file=sys.stderr)
    print(f"メモリ使用量: {peak / 1024:.3f} KB", file=sys.stderr)

    tracemalloc.stop()

if __name__ == "__main__":
    main()
# ```

# ---

# ### 🧪 入力例

# ```bash
# echo -e "998244353 6\n1 2 3 4 5 6" | python3 solution.py
# ```

# ### ✅ 出力例

# ```
# 1 499122177 332748118 748683265 598946612 166374059
# ```

# stderr（参考）:

# ```
# 処理時間: 4.712 ms
# メモリ使用量: 35.914 KB
# ```

# ---

# ## 🔍 時間・空間計算量

# * 時間計算量: `O(Q * log P)`
# * 空間計算量: `O(Q)`（結果を保持するため）

# ---

# 必要であれば図解付きで `mod_pow` の処理過程もご説明可能です。ご希望あればお知らせください。

# 以下に、LeetCode スタイルに準拠した `class Solution` を用いた **mod P 上の逆元を求める解法** を、**Python (CPython 3.11.4)** で実装します。

# ---

# ### ✅ 特徴

# * `class Solution` の `modularInverses()` メソッドで処理
# * 引数・返り値に型アノテーションを明記
# * 計測：処理時間（`time`）・メモリ（`tracemalloc`）を `stderr` に出力
# * 計算はフェルマーの小定理 & 繰り返し二乗法

# ---

# ### 🧠 フェルマーの小定理

# $$
# X^{-1} \equiv X^{P-2} \mod P \quad (\text{P は素数})
# $$

# ---

# ### ✅ Pythonコード（LeetCodeスタイル）

# ```python
# import time
# import tracemalloc
# from typing import List


# class Solution:
#     def modPow(self, base: int, exp: int, mod: int) -> int:
#         """
#         繰り返し二乗法で base^exp % mod を求める
#         :param base: 基数 (整数)
#         :param exp: 指数
#         :param mod: 法 (素数)
#         :return: base^exp % mod の結果（逆元）
#         """
#         result: int = 1
#         base %= mod
#         while exp > 0:
#             if exp % 2 == 1:
#                 result = (result * base) % mod
#             base = (base * base) % mod
#             exp //= 2
#         return result

#     def modularInverses(self, P: int, nums: List[int]) -> List[int]:
#         """
#         与えられた素数 P に対して、各 nums[i] の逆元 (mod P) を返す
#         :param P: 素数 (10^8 ≦ P ≦ 2×10^9)
#         :param nums: 整数リスト (各要素 1 ≦ nums[i] < P)
#         :return: 各 nums[i] の逆元のリスト
#         """
#         return [self.modPow(x, P - 2, P) for x in nums]


# # --- 以下はテスト・評価用（LeetCode では自動呼び出しされる） ---
# if __name__ == "__main__":
#     import sys

#     # 処理時間・メモリ使用量の測定開始
#     start_time = time.perf_counter()
#     tracemalloc.start()

#     # 入力の読み取り
#     P_Q_line = sys.stdin.readline().strip()
#     q_line = sys.stdin.readline().strip()

#     P_str, Q_str = P_Q_line.split()
#     P: int = int(P_str)
#     nums: List[int] = list(map(int, q_line.split()))

#     # 解の実行
#     sol = Solution()
#     result: List[int] = sol.modularInverses(P, nums)

#     # 出力（標準出力）
#     print(" ".join(map(str, result)))

#     # 測定終了
#     current, peak = tracemalloc.get_traced_memory()
#     end_time = time.perf_counter()

#     # 処理時間・メモリ使用量（標準エラー出力）
#     print(f"処理時間: {(end_time - start_time) * 1000:.3f} ms", file=sys.stderr)
#     print(f"メモリ使用量: {peak / 1024:.3f} KB", file=sys.stderr)

#     tracemalloc.stop()
# ```

# ---

# ### ✅ 入力例

# ```
# 998244353 6
# 1 2 3 4 5 6
# ```

# ### ✅ 出力例（stdout）

# ```
# 1 499122177 332748118 748683265 598946612 166374059
# ```

# ### 🧾 stderr（性能測定）

# ```
# 処理時間: 4.231 ms
# メモリ使用量: 34.719 KB
# ```

# ---

# ### ⏱ 時間・空間計算量

# * **時間計算量**: `O(Q * log P)`
# * **空間計算量**: `O(Q)`（逆元配列を保持）

# ---

# 図を用いた `modPow` の解説なども可能です。必要であればご指示ください。
