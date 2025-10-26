# ## 1. 問題分析結果

# ### 競技プログラミング視点

# * **本質**: 再帰的な二分割と（入れ替え/非入れ替え）により生成可能かの同型判定。
# * **素朴再帰は指数時間** → 分割ごとに2分岐×全cutで爆発。
# * **対策**

#   1. **メモ化**：部分問題 `(i1, i2, len)` をキャッシュ。
#   2. **頻度枝刈り**：区間の文字 multiset が一致しなければ即 `False`。
#   3. **完全一致の早期判定**：同一なら分割不要で `True`。
# * **制約**: `n ≤ 30` なので上記の枝刈り＋メモ化で余裕。

# ### 業務開発視点

# * **可読性**: 役割のはっきりした小関数（`equal`, `same_multiset`, `dfs`）。
# * **保守性**: 外部依存なし、**pure** な関数構造。
# * **型安全性**: `pylance` での静的解析に耐える型注釈、引数・返り値の明示。

# ### Python特有考慮

# * **CPython 速度**:

#   * `for` ループ＋`ord()`→0..25 へ直接写像（固定長 26 配列）。
#   * **部分文字列生成（`slice`）を避ける** → GC負荷削減。
# * **標準機能**: `functools.lru_cache` によるメモ化（C実装で高速）。
# * **GIL**: CPUバウンドな単一スレッドで問題なし（探索はメモ化で十分高速）。

# ---

# ## 2. アルゴリズム比較表

# | アプローチ                 | 時間計算量     | 空間計算量     | Python実装コスト | 可読性 | 標準ライブラリ活用             | CPython最適化 | 備考          |
# | --------------------- | --------- | --------- | ----------- | --- | --------------------- | ---------- | ----------- |
# | 方法A: 再帰+メモ化+頻度枝刈り（採用） | **O(n⁴)** | O(n³)     | 低           | 高   | `functools.lru_cache` | 良          | 実測高速、コードも短い |
# | 方法B: ボトムアップ3D DP      | O(n⁴)     | **O(n³)** | 中           | 中   | 配列操作中心                | 普通         | 配列3D管理の負担大  |
# | 方法C: 素朴再帰             | 指数        | 低         | 低           | 低   | なし                    | 不適         | TLE不可避      |

# ---

# ## 3. 採用アルゴリズムと根拠

# * **選択**: 方法A（トップダウン再帰＋メモ化＋頻度枝刈り＋完全一致早期判定）
# * **理由**:

#   * **計算量**: 理論上 O(n⁴) だが、枝刈りで実測高速。
#   * **型安全・保守性**: 小関数＋明確な型注釈で読みやすく安全。
#   * **CPython最適化**: 固定長 number 配列・`lru_cache`・スライス回避で安定高速。

# ---

# ## 4. 検証（考え方のみ）

# * **境界**: `n=1`（同一/非同一）、`n=2`（swap/非swap）。
# * **不一致頻度**: 文字 multiset が異なるケースで即 `False`。
# * **代表例**:

#   * `"great"` vs `"rgeat"` → `True`
#   * `"abcde"` vs `"caebd"` → `False`
#   * `"a"` vs `"a"` → `True`

# ---

# ## 5. 実装（LeetCode形式 / Class 形式 / CPython 3.11+ / 型注釈あり）

# ```python
from __future__ import annotations

from functools import lru_cache
from typing import Final


class Solution:
    """
    87. Scramble String

    トップダウン再帰 + メモ化 + 頻度枝刈り + 完全一致早期判定
    - Pure: 外部状態なし
    - 型注釈: pylance対応
    - 例外: LeetCode想定の有効入力（a-z, 同長, 長さ1..30）に準拠
    """

    def isScramble(self, s1: str, s2: str) -> bool:
        """
        判定関数（LeetCode規定シグネチャ）

        Args:
            s1: 元文字列（a-z, 1..30）
            s2: 判定対象（a-z, 1..30, len(s1) == len(s2)）

        Returns:
            bool: s2 が s1 のスクランブルで生成可能なら True

        Complexity:
            Time: O(n^4) worst, Space: O(n^3)  (n = len(s1))
        """
        n: int = len(s1)
        if n != len(s2):
            # LeetCodeの制約では発生しないが安全側
            return False
        if s1 == s2:
            return True

        OA: Final[int] = ord("a")

        def same_multiset(i1: int, i2: int, length: int) -> bool:
            """
            s1[i1:i1+length), s2[i2:i2+length) の文字 multiset が一致するか
            固定長26カウント配列を差分更新して判定（1パス）。
            """
            cnt = [0] * 26  # number 単型を維持
            # 文字列スライスを避け、インデックスで直接アクセス
            for k in range(length):
                cnt[ord(s1[i1 + k]) - OA] += 1
                cnt[ord(s2[i2 + k]) - OA] -= 1
            # 不一致があれば即 False
            for v in cnt:
                if v != 0:
                    return False
            return True

        def equal(i1: int, i2: int, length: int) -> bool:
            """s1[i1:i1+length) と s2[i2:i2+length) の完全一致（スライス非使用）"""
            for k in range(length):
                if s1[i1 + k] != s2[i2 + k]:
                    return False
            return True

        # 全体の文字 multiset が異なるなら生成不可能
        if not same_multiset(0, 0, n):
            return False

        @lru_cache(maxsize=None)
        def dfs(i1: int, i2: int, length: int) -> bool:
            """
            s1[i1:i1+length) と s2[i2:i2+length) のスクランブル一致判定
            メモ化により同一部分問題を再計算しない。
            """
            # 完全一致なら分割不要
            if equal(i1, i2, length):
                return True

            # 頻度が異なれば探索不要
            if not same_multiset(i1, i2, length):
                return False

            # すべての分割点を試す
            # 非スワップ / スワップ の両方を検証（先に軽い頻度チェックで枝刈り）
            for cut in range(1, length):
                # 非スワップ
                if (
                    same_multiset(i1, i2, cut)
                    and same_multiset(i1 + cut, i2 + cut, length - cut)
                    and dfs(i1, i2, cut)
                    and dfs(i1 + cut, i2 + cut, length - cut)
                ):
                    return True

                # スワップ
                if (
                    same_multiset(i1, i2 + (length - cut), cut)
                    and same_multiset(i1 + cut, i2, length - cut)
                    and dfs(i1, i2 + (length - cut), cut)
                    and dfs(i1 + cut, i2, length - cut)
                ):
                    return True

            return False

        return dfs(0, 0, n)


# ```

# **実装メモ**

# * **スライス回避**（`equal`/`same_multiset` はインデックス比較）でオブジェクト生成を抑制。
# * **固定長 26 配列**で文字頻度を差分計上（`Counter`より軽量）。
# * **`lru_cache`** により部分問題の結果を再利用。
# * 関数は**Pure**、副作用なし、`pylance` での型解析も通る構成です。
