# 先ほどの **二重ローリングハッシュ + BigInt（PythonではintでOK）** の実装を、Python 3.11.4 向けに型付きで書き直します。
# `sys.stdin.buffer` で高速入力、`time` と `resource` で処理時間・メモリ計測を行います。
# すべて関数化し、パラメータと戻り値の型をコメントで記載します。

# ---

# ```python
# Python 3.11.4
# 高速回文判定 (二重ローリングハッシュ法)
# 実行方法: python main.py < input.txt

from __future__ import annotations
import sys
import time
import resource
from typing import List, Tuple

# =========================
# 関数群
# =========================

def build_hash(S: str, base: int, mod: int) -> Tuple[List[int], List[int], List[int]]:
    """
    与えられた文字列 S に対して、基数 base と法 mod を用いた
    正方向・逆方向のハッシュ配列と累乗配列を構築する。

    Parameters
    ----------
    S : str
        対象文字列（英小文字）
    base : int
        ローリングハッシュの基数
    mod : int
        法（素数）

    Returns
    -------
    pow_list : List[int]
        base^i % mod の配列（0-indexed, 長さ N+1）
    hf : List[int]
        正方向 prefix hash 配列（1-indexed）
    hr : List[int]
        逆方向 prefix hash 配列（1-indexed）
    """
    n: int = len(S)
    pow_list: List[int] = [0] * (n + 1)
    hf: List[int] = [0] * (n + 1)
    hr: List[int] = [0] * (n + 1)

    pow_list[0] = 1
    for i in range(1, n + 1):
        pow_list[i] = (pow_list[i - 1] * base) % mod

    for i in range(n):
        val = ord(S[i]) - 96
        hf[i + 1] = (hf[i] * base + val) % mod

    for i in range(n):
        val = ord(S[n - 1 - i]) - 96
        hr[i + 1] = (hr[i] * base + val) % mod

    return pow_list, hf, hr


def get_sub_hash(hf: List[int], pow_list: List[int], l: int, r: int, mod: int) -> int:
    """
    prefix hash 配列から部分文字列 [l, r] (1-indexed) のハッシュ値を取得する。

    Parameters
    ----------
    hf : List[int]
        prefix hash 配列（1-indexed）
    pow_list : List[int]
        base^i % mod の累乗配列
    l : int
        部分文字列の開始位置 (1-indexed)
    r : int
        部分文字列の終了位置 (1-indexed)
    mod : int
        法

    Returns
    -------
    hash_value : int
        部分文字列のハッシュ値
    """
    length = r - l + 1
    res = hf[r] - (hf[l - 1] * pow_list[length]) % mod
    res %= mod
    return res


def solve(N: int, Q: int, S: str, queries: List[Tuple[int, int]]) -> List[str]:
    """
    与えられた文字列 S と Q 個のクエリに対して、
    各部分文字列が回文かどうかを判定する。

    Parameters
    ----------
    N : int
        文字列長
    Q : int
        クエリ数
    S : str
        対象文字列
    queries : List[Tuple[int, int]]
        各クエリ (L, R) の配列

    Returns
    -------
    results : List[str]
        各クエリに対する "Yes" または "No" の結果
    """
    MOD1, MOD2 = 1_000_000_007, 1_000_000_009
    BASE1, BASE2 = 1_000_003, 1_000_033

    pow1, hf1, hr1 = build_hash(S, BASE1, MOD1)
    pow2, hf2, hr2 = build_hash(S, BASE2, MOD2)

    results: List[str] = []
    for L, R in queries:
        fh1 = get_sub_hash(hf1, pow1, L, R, MOD1)
        fh2 = get_sub_hash(hf2, pow2, L, R, MOD2)

        revL = N - R + 1
        revR = N - L + 1
        rh1 = get_sub_hash(hr1, pow1, revL, revR, MOD1)
        rh2 = get_sub_hash(hr2, pow2, revL, revR, MOD2)

        if fh1 == rh1 and fh2 == rh2:
            results.append("Yes")
        else:
            results.append("No")

    return results


# =========================
# メイン処理
# =========================
def main() -> None:
    data = sys.stdin.buffer.read().split()
    N = int(data[0])
    Q = int(data[1])
    S = data[2].decode()
    queries: List[Tuple[int, int]] = [(int(data[i]), int(data[i + 1])) for i in range(3, 3 + 2 * Q, 2)]

    start_time = time.perf_counter()
    results = solve(N, Q, S, queries)
    end_time = time.perf_counter()

    sys.stdout.write("\n".join(results) + "\n")

    # 計測情報（stderr）
    mem_mb = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024
    sys.stderr.write(f"Time: {(end_time - start_time) * 1000:.3f} ms\n")
    sys.stderr.write(f"Memory: {mem_mb:.2f} MB\n")


if __name__ == "__main__":
    main()
# ```

# ---

# ### 実装の特徴

# 1. **二重ローリングハッシュ**

#    * `MOD1, MOD2` と `BASE1, BASE2` を変えて衝突率をほぼゼロに。
#    * Python の `int` は任意精度なので BigInt 相当。

# 2. **高速入力**

#    * `sys.stdin.buffer.read()` で一括読み取り。
#    * 文字列部分は `.decode()`、数字は `int()` に変換。

# 3. **O(1) 判定**

#    * 各クエリでの回文判定は定数時間。
#    * 全体計算量は `O(N + Q)`。

# 4. **型ヒント付き**

#    * Pylance などの型チェッカでもエラーなく通る。
#    * 関数引数・戻り値すべて明示。

# 5. **時間・メモリ計測**

#    * `time.perf_counter()` で高精度時間計測。
#    * `resource.getrusage` で最大常駐メモリ（MB）を計測。
