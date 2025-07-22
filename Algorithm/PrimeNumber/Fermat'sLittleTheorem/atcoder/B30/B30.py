# 以下は Python (CPython 3.11.4) を用いた格子経路数（右と下方向のみで (1,1) → (H,W)）を求める実装です。
# 計算量・メモリ効率を重視し、**階乗と逆元を前計算**して、**組み合わせ C(n, r) = n! / (r!(n-r)!)** を `MOD = 10^9+7` で効率よく求めます。

# ---

# ## ✅ Python 実装コード（関数化＋型指定＋効率重視）
import sys
from typing import List

MOD: int = 10**9 + 7
MAX: int = 200000  # H+Wの最大を考慮して十分大きい上限

fact: List[int] = [1] * (MAX + 1)       # fact[i] = i!
inv_fact: List[int] = [1] * (MAX + 1)   # inv_fact[i] = (i!)^(-1) mod MOD


def modinv(a: int) -> int:
    """
    a^(-1) mod MOD を求める（フェルマーの小定理を使用）
    @param a: 逆元を求める数（a ≠ 0）
    @return: a の MOD における逆元
    """
    return pow(a, MOD - 2, MOD)


def precompute_factorials() -> None:
    """
    階乗とその逆元を事前計算して、fact[], inv_fact[] に格納する
    """
    for i in range(1, MAX + 1):
        fact[i] = fact[i - 1] * i % MOD
    inv_fact[MAX] = modinv(fact[MAX])
    for i in range(MAX - 1, -1, -1):
        inv_fact[i] = inv_fact[i + 1] * (i + 1) % MOD


def comb(n: int, r: int) -> int:
    """
    nCr (mod MOD) を返す
    @param n: 総数（0 <= r <= n <= MAX）
    @param r: 選ぶ数
    @return: nCr % MOD
    """
    if r < 0 or r > n:
        return 0
    return fact[n] * inv_fact[r] % MOD * inv_fact[n - r] % MOD


def count_grid_paths(H: int, W: int) -> int:
    """
    格子経路数を計算：C(H+W-2, H-1)
    @param H: 行数
    @param W: 列数
    @return: 経路数（mod 1e9+7）
    """
    precompute_factorials()
    return comb(H + W - 2, H - 1)


def main() -> None:
    """
    標準入力を読み取り、格子経路数を出力する
    """
    H_str, W_str = sys.stdin.read().split()
    H: int = int(H_str)
    W: int = int(W_str)
    result: int = count_grid_paths(H, W)
    print(result)


if __name__ == "__main__":
    main()

# ## ✅ 実行方法

# ```bash
# echo "869 120" | python3 main.py
# # → 223713395
# ```

# ---

# ## 📊 パフォーマンス見積

# | 要素     | 内容                        |
# | ------ | ------------------------- |
# | 時間計算量  | `O(MAX)`（前計算）, `O(1)`（計算） |
# | メモリ使用量 | 約 3～4MB（配列2本：20万要素）       |
# | 使用技術   | フェルマーの小定理, 組み合わせ前計算       |

# ---

# ## ✅ 入出力例

# ### 入力:

# ```
# 5 10
# ```

# ### 出力:

# ```
# 715
# ```

# ---

# ## ✅ 各関数の責務まとめ

# | 関数名                       | 説明                          |
# | ------------------------- | --------------------------- |
# | `modinv(a)`               | 逆元をフェルマーの小定理で計算             |
# | `precompute_factorials()` | `fact[]`, `inv_fact[]` を前計算 |
# | `comb(n, r)`              | `nCr % MOD` を返す             |
# | `count_grid_paths()`      | 格子経路の数を返す（入力から `nCr` への変換）  |
# | `main()`                  | 入力・出力処理                     |

# ---

# ご希望があれば、**再帰的DPで解くバージョン**や、**可視化付きの Jupyter Notebook 形式**での説明も可能です。
