# 以下は “leetcodeでの回答フォーマット（Class 形式）” に準拠した提出用一式です。
# 環境: **Python (CPython 3.11.10)**、外部ライブラリ不使用、**pylance で型エラーが出ない**よう型注釈を厳密化しています。

# ---

# ## 1. 問題分析結果

# ### 競技プログラミング視点

# * 目標計算量は **O(log (m+n))**。短い配列を対象にした **二分探索パーティション法** が定石。
# * 追加メモリ **O(1)**。配列のマージやソートは不要。
# * エッジケース（片方空・極端な長さ差・重複・負数）でも同一ロジックで処理可能。

# ### 業務開発視点

# * **可読性/保守性**：`aLeft/aRight/bLeft/bRight` の境界値を `±inf` で一元化し分岐を簡潔化。
# * **型安全性**：`List[int]` を明示、戻り値は `float`。ドキュメンテーション文字列で契約を明確化。
# * **エラーハンドリング**：LeetCode では前提条件が保証されるため **例外送出は行わない**。ただし、補助的な内部検証関数を用意（本メソッドでは未使用）し、プロダクション移行時の堅牢化に備える。

# ### Python特有考慮

# * **CPython**：数値・配列アクセスは C 実装で高速。ホットパスは単純な `while` と添字アクセスに限定。
# * **GIL**：CPU バウンドで並列化は無意味。本問題は単一スレッドで十分。
# * **内蔵最適化**：`float('inf')` による境界処理、条件分岐の削減で分岐予測ミスを減らす。

# ---

# ## 2. アルゴリズム比較表

# | アプローチ                  |               時間計算量 |  空間計算量 | Python実装コスト | 可読性 | 標準ライブラリ活用 | CPython最適化 | 備考          |
# | ---------------------- | ------------------: | -----: | ----------- | --- | --------- | ---------- | ----------- |
# | 方法A: 二分探索パーティション（採用）   | **O(log min(m,n))** |   O(1) | 中           | 中   | 不要        | 適          | 要件を満たす代表解   |
# | 方法B: 2 本ポインタで中央値まで線形走査 |              O(m+n) |   O(1) | 低           | 高   | 不要        | 適          | 簡潔だが計算量劣後   |
# | 方法C: 連結して `sorted()`   |   O((m+n) log(m+n)) | O(m+n) | 低           | 高   | `sorted`  | 適          | メモリ・時間ともに不利 |

# ---

# ## 3. 採用アルゴリズムと根拠

# * **選択**：方法A（二分探索パーティション）
# * **理由**：要件の **O(log (m+n))** を満たし、追加メモリ O(1)。実装は短く、境界も `±inf` で素直に扱える。
# * **Python最適化**：

#   * ループは `while`、添字アクセスのみ（クロージャやイテレータ生成を避ける）。
#   * 比較は単純な数値比較のみ。タプルや余計な一時オブジェクトを作らない。

# ---

# ## 4. 検証（方針のみ・コード不要）

# * **境界値**：`nums1=[]` / `nums2=[]`、要素が全て同値、極小/極大値（±1e6）、奇数/偶数合計長。
# * **型**：`List[int]` のみ。戻り値 `float` は `int` も表現可能（2 → 2.0 互換）。

# ---

# ## 5. 提出コード（LeetCode Class 形式）

# ```python
# from __future__ import annotations
# from typing import List, Final


# class Solution:
#     """
#     Median of Two Sorted Arrays
#     - Time:  O(log(min(m, n)))
#     - Space: O(1)
#     実装は短い配列に対してのみ二分探索を行うパーティション法。
#     """

#     # --- 競プロ用（LeetCode 実行エントリ） ---
#     def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
#         """
#         Args:
#             nums1: Non-decreasing sorted list of ints (length 0..1000)
#             nums2: Non-decreasing sorted list of ints (length 0..1000)
#         Returns:
#             Median as float (even length -> average of two middles)

#         Note:
#             LeetCode では前提条件が満たされるため、実行時例外は送出しない。
#         """
#         # 競技プログラミング最適化版を直接呼び出し
#         return self._median_binary_partition(nums1, nums2)

#     # --- 競技プログラミング向け最適化実装 ---
#     def _median_binary_partition(self, nums1: List[int], nums2: List[int]) -> float:
#         # A を短い配列にする
#         if len(nums1) > len(nums2):
#             nums1, nums2 = nums2, nums1

#         a: List[int] = nums1
#         b: List[int] = nums2
#         m: int = len(a)
#         n: int = len(b)

#         # 片方が空でもロジックはそのまま動作
#         half: int = (m + n + 1) // 2
#         lo: int = 0
#         hi: int = m

#         INF: Final[float] = float("inf")

#         while lo <= hi:
#             i: int = (lo + hi) // 2       # a側の左パート長
#             j: int = half - i             # b側の左パート長

#             a_left: float  = -INF if i == 0 else float(a[i - 1])
#             a_right: float =  INF if i == m else float(a[i])
#             b_left: float  = -INF if j == 0 else float(b[j - 1])
#             b_right: float =  INF if j == n else float(b[j])

#             # 正しいパーティション条件
#             if a_left <= b_right and b_left <= a_right:
#                 if ((m + n) & 1) == 1:
#                     # 奇数: 左側最大が中央値
#                     return a_left if a_left > b_left else b_left
#                 # 偶数: 左最大と右最小の平均
#                 left_max: float = a_left if a_left > b_left else b_left
#                 right_min: float = a_right if a_right < b_right else b_right
#                 return (left_max + right_min) / 2.0

#             # パーティションを調整
#             if a_left > b_right:
#                 hi = i - 1  # aの左が大きすぎる → a左を減らす
#             else:
#                 lo = i + 1  # aの右が大きすぎる → a左を増やす

#         # 前提条件が満たされる限り到達しない
#         # LeetCode 入力ではここに来ない
#         return 0.0

#     # --- 業務開発向け：堅牢化（本提出では未使用だが参考実装） ---
#     def _validate_non_decreasing(self, arr: List[int]) -> bool:
#         """非減少（昇順）確認。pylance対応の厳密 int 配列のみを前提。"""
#         # for ループ + 直接添字アクセス（最速の部類）
#         for i in range(1, len(arr)):
#             if arr[i - 1] > arr[i]:
#                 return False
#         return True
# ```

# ### 実装ポイント

# * **while + 添字アクセス**のみでホットパスを構成（イテレータ・クロージャ不要）。
# * **`float('inf')`** による境界処理で `if` 分岐を単純化。
# * 返り値は `float` で一貫。奇数長でも `float` を返す（LeetCode 互換）。

# **同じ（二分探索パーティション）アルゴリズム**のまま、CPython 3.11 での実行速度・メモリを意識してホットパスを削った改良版を示します。

# ---

# ## 1) どこを削るか（短評）

# * **不要な `float()` キャスト除去**：ループ内での `float(a[i])` 等をやめ、**すべて `int`** で比較。偶数長の **最後だけ** `0.5` 乗算で `float` 化。
# * **分岐回数/関数呼び出し削減**：`max/min` を使わず **条件演算子で直接比較**、タプル生成を回避。
# * **ローカル変数への束縛**：`nums1/nums2/len` をローカルに束縛（属性/グローバル参照の回数を低減）。
# * **整数のセンチネル使用**：境界は `±INF` の代わりに **値域を超える固定整数**（例: `NEG = -10_000_007`, `POS = 10_000_007`）を使用し、**int↔float 混在比較を回避**。
# * **再計算しない**：`total_is_odd` を事前計算、`half` は固定。
# * **オブジェクト生成ゼロ**：一時タプル/リスト/クロージャを作らない。

# > 制約が ±1e6 なので、センチネルは ±1e7 で十分安全です。

# ---

# ## 2) 改良版コード（LeetCode “Class 形式”・pylance対応）

# ```python
from __future__ import annotations

from typing import Final, List


class Solution:
    """
    Median of Two Sorted Arrays
    - Time:  O(log(min(m, n)))
    - Space: O(1)
    速度・メモリ最適化版（同一アルゴリズム、ホットパス最小化）
    """

    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        # --- 短い配列を A にする（参照束縛で属性参照も削減） ---
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1

        A: List[int] = nums1
        B: List[int] = nums2
        a_len: int = len(A)
        b_len: int = len(B)

        # 総数・奇偶は事前計算してループ内で条件分岐を減らす
        total: int = a_len + b_len
        total_is_odd: bool = (total & 1) == 1
        half: int = (total + 1) >> 1

        # 整数センチネル（制約±1e6 を大きく超える）
        NEG: Final[int] = -10_000_007
        POS: Final[int] = +10_000_007

        lo: int = 0
        hi: int = a_len

        # --- 中央探索（ホットパス） ---
        # すべて int 比較。最後にのみ float を作る。
        while lo <= hi:
            i: int = (lo + hi) >> 1  # A の左パート長
            j: int = half - i  # B の左パート長

            a_left: int = NEG if i == 0 else A[i - 1]
            a_right: int = POS if i == a_len else A[i]
            b_left: int = NEG if j == 0 else B[j - 1]
            b_right: int = POS if j == b_len else B[j]

            # 正しいパーティション条件
            if a_left <= b_right and b_left <= a_right:
                if total_is_odd:
                    # 奇数：左側最大（float で返す）
                    return float(a_left if a_left > b_left else b_left)
                # 偶数：左最大・右最小の平均（0.5 乗算で float 化）
                left_max: int = a_left if a_left > b_left else b_left
                right_min: int = a_right if a_right < b_right else b_right
                return (left_max + right_min) * 0.5

            # パーティション調整（分岐は2択のみ）
            if a_left > b_right:
                hi = i - 1
            else:
                lo = i + 1

        # 前提条件上ここには来ない
        return 0.0


# ```

# ### 変更点が効く理由

# * **int 比較のみ**：`int` と `float('inf')` の比較は内部で float に寄せるため、**キャスト/型変換コスト**が乗ります。センチネルを `int` にするとこのコストを避けられます。
# * **演算子比較 > max/min**：`max(x, y)` は関数呼び出し＋タプル類似の引数処理になるため、`x if x > y else y` の方がホットパスでは速いことが多いです。
# * **ループ内割当の削減**：`total_is_odd` などを外に逃がして **条件式の評価回数**を抑制。

# ---

# ## 3) 期待できる効果（目安）

# * **Runtime**：`float()` キャスト除去・整数センチネルにより分岐/型変換が減り、**数 ms 改善**が見込めます。
# * **Memory**：もともと O(1) ですが、一時オブジェクト（タプル/float）の生成を減らすため、**微減**します。

# > もちろんジャッジ環境のノイズはありますが、上のような **ホットパス縮小** は安定して効く最適化です。

# ---

# ## 4) 追加の微調整オプション（任意）

# * **`(lo + hi) >> 1` の継続**：`// 2` より ほんの僅かに速いケースが多い（CPython 実装依存）。
# * **早期 return の単純化**：`total_is_odd` を使い、奇数/偶数で分岐を 1 回だけに。
# * **関数分割の抑制**：ホットパス中のヘルパー呼び出しを完全排除（既に実施済み）。

# ---

# ### まとめ

# アルゴリズムは不変のまま、**型変換・関数呼び出し・分岐**を削ることで **実行時間・メモリ**ともに改善できます。上記の改良版は LeetCode の要件（Class 形式 / 返り値 float）を満たしつつ、pylance でも型エラーにならない実装です。
