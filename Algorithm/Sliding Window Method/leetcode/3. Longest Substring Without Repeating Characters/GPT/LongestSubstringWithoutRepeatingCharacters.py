# ### 1. 問題分析結果

# #### 競技プログラミング視点

# * **最速手法**: スライディングウィンドウ＋「直近出現位置」記録で **O(n)**。
# * **メモリ最小化**: 典型入力は ASCII が多い → まず **128 要素**だけ確保。非 ASCII が出た時だけ段階的に追加確保（BMP 用 65,536、さらに稀なサロゲート外は辞書）。無駄な初期化・コピーを避ける。

# #### 業務開発視点

# * **可読性・保守性**: `Solution.lengthOfLongestSubstring` に集約し、説明的な変数名と docstring。
# * **型安全/エラー**: `s: str` を厳格に受け、型/長さの妥当性を早期チェック（LeetCode では想定外入力は来ないが、実務基準で堅牢化）。

# #### Python特有分析

# * **CPython 性能**: Python の `list` は PyObject 参照でメモリ過大になりがち。**`array('I')`** を使って C 連続メモリ（32bit 無符号整数）で **高速＆省メモリ**にインデックス操作。
# * **辞書は最小化**: 非 BMP（コードポイント ≥ 65536）に遭遇した場合のみ辞書を使用。
# * **分岐最小化**: ホットループでは単純整数演算と添字アクセスのみ。

# ---

# ### 2. アルゴリズム比較表

# | アプローチ                                             | 時間計算量    | 空間計算量                 | Python実装コスト | 可読性 | 標準ライブラリ活用    | CPython最適化 | 備考                |
# | ------------------------------------------------- | -------- | --------------------- | ----------- | --- | ------------ | ---------- | ----------------- |
# | 方法A: **段階確保**（ASCII 128 → BMP 65536 → 非BMPは dict） | **O(n)** | **O(1)**（入力集合に応じ段階確保） | 中           | 高   | `array('I')` | 適          | 本回答。最速・省メモリのバランス◎ |
# | 方法B: 常に BMP 65536 の表                              | O(n)     | O(1)（固定）              | 低           | 中   | `array('I')` | 適          | 実装は楽だが毎回メモリ確保が大きい |
# | 方法C: 辞書のみ（`dict`）                                 | O(n)     | O(min(n,Σ))           | 低           | 高   | dict         | 不適         | 実装は簡単だが相対的に遅・多メモリ |

# ---

# ### 3. 採用アルゴリズムと根拠

# * **選択**: 方法A（段階確保）。
# * **理由**:

#   * 計算量は **O(n)** を維持しつつ、ASCII 入力での**超軽量メモリとキャッシュ効率**を享受。
#   * 非 ASCII も **必要時のみ**拡張、非 BMP は **辞書限定**で最小コスト。
#   * `array('I')` による **連続メモリ & C実装**で CPython に最適。

# **Python最適化ポイント**

# * `array('I')` の 0 初期化を利用（`fill`不要）。
# * 直近位置は **index+1** を格納（未出現=0 で分岐を簡素化）。
# * 例外はホットパス外で早期判定、ループは整数添字と単純比較のみ。

# ---

# ### 4. 実装コード（LeetCode 提出形式・Class 形式・型付け厳格／pylance対応）

# ```python
# from __future__ import annotations

# from array import array
# from typing import Dict, Final, Optional


# class Solution:
#     """
#     Longest Substring Without Repeating Characters

#     スライディングウィンドウ + 直近出現位置の段階確保（ASCII → BMP → 非BMPは辞書）。
#     CPython では array('I') による連続メモリで低オーバーヘッド化。
#     """

#     # 仕様上の上限（LeetCode 想定）
#     _MAX_LEN: Final[int] = 5 * 10**4

#     def lengthOfLongestSubstring(self, s: str) -> int:
#         """
#         連続部分文字列のうち、重複文字を含まない最長の長さを返す。

#         Args:
#             s: 入力文字列（str）

#         Returns:
#             最長長さ（int）

#         Raises:
#             TypeError: 入力が文字列でない場合
#             ValueError: 入力長が仕様上限を超える場合

#         Complexity:
#             Time: O(n)  /  Space: O(1)（文字集合に応じ段階確保）
#         """
#         # --- 入力検証（ホットパス外） ---
#         if not isinstance(s, str):
#             raise TypeError("Input must be a string")
#         n: int = len(s)
#         if n > self._MAX_LEN:
#             raise ValueError("Input length exceeds allowed maximum")
#         if n == 0:
#             return 0

#         # --- 段階確保テーブル ---
#         # ASCII（0..127）は最初から確保（超軽量）
#         last_ascii: array = array("I", [0]) * 128

#         # BMP（0..65535）は必要になるまで確保しない
#         last_bmp: Optional[array] = None  # type: ignore[assignment]

#         # 非BMP（>= 65536）は非常に稀 → 初遭遇時のみ辞書を用意
#         last_large: Optional[Dict[int, int]] = None

#         left: int = 0   # ウィンドウ左端は「直近位置+1」を直接入れる運用
#         best: int = 0

#         # --- メインループ（ホットパス） ---
#         for i, ch in enumerate(s):
#             code: int = ord(ch)

#             if code < 128:
#                 prev: int = last_ascii[code]
#                 if prev > left:
#                     left = prev
#                 last_ascii[code] = i + 1

#             elif code < 65536:
#                 if last_bmp is None:
#                     # 必要時のみ BMP 用 65536 テーブルを確保（ゼロ初期化）
#                     last_bmp = array("I", [0]) * 65536
#                 prev = last_bmp[code]  # type: ignore[index]
#                 if prev > left:
#                     left = prev
#                 last_bmp[code] = i + 1  # type: ignore[index]

#             else:
#                 if last_large is None:
#                     last_large = {}
#                 prev = last_large.get(code, 0)
#                 if prev > left:
#                     left = prev
#                 last_large[code] = i + 1

#             # 長さ更新
#             curr_len: int = i - left + 1
#             if curr_len > best:
#                 best = curr_len

#         return best
# ```

# ---

# ### 5. 検証（方針のみ・コード不要）

# * **境界**: `"" -> 0`, `"a" -> 1`, `"bbbbb" -> 1`, `"abcabcbb" -> 3`, `"pwwkew" -> 3`。
# * **ASCII 専用パス**: 英数字＋記号のみの長文でも O(n)/極小メモリで安定。
# * **非 ASCII**: `"あいうえお"` や `"ééabc"` 混在で BMP パスが自動有効。
# * **非 BMP**: 例えば `"𝟘𝟙𝟚abc"`（数学用太字数字など）のコードポイントでも辞書フォールバックで正しく動作。

# > メモ: LeetCode 環境は妥当な入力のみを与えるため、上記の型・長さチェックは実務基準の堅牢性として付与しています（競技では省略可）。

# 以下は原因の特定 → 具体的な修正案（ピークメモリ削減）→ 修正版コード（LeetCode提出形式 / Class形式）です。

# ---

# ## 1) なぜメモリが大きく見えるのか（原因）

# * **LeetCodeのメモリ計測はプロセス全体のRSS（実効使用量）**に近く、CPythonランタイムの常駐オーバーヘッド（インタープリタ本体、ヒープ管理、フレーム・コードオブジェクト等）が**十数MB**を占めます。
#   → これがベースラインなので、**18MB台は珍しくありません**。

# * その上で、前回の実装は「**非ASCII（U+0080..U+FFFF）に遭遇した場合に限り**」`array('I')` の **65536 要素表（約256KB）** を確保する設計でした。
#   → 256KBは小さいですが、**メモリ beat には効いてしまう**（他解が dict のみ等でピークを更に抑えている）。

# * 稀に**非BMP（サロゲートペア領域, U+10000以上）**が混じると `dict` も併用し、わずかに上乗せされます。

# 結論: **ベースライン（Python自体の常駐）＋ BMP表 256KB** が主因。速度は速い一方で、**メモリ順位は相対的に不利**になりがちです。

# ---

# ## 2) どう直すか（修正方針）

# 目標：**速度は維持しつつピークメモリを削る**。

# ### 修正案A（おすすめ）

# * **ASCIIは `array('I', 128)` 固定**で超軽量・高速を維持
# * **非ASCIIは常に `dict` にフォールバック**（**BMP 65536表を作らない**）

#   * 非ASCIIが少数なら、辞書は必要なキー分しか増えず、**65536表の256KBを確実に回避**
#   * 多くのケースで**メモリ beat が改善**します（速度への影響はごく軽微）

# ### 修正案B

# * **全文字 `dict` のみ**で管理（最少メモリ、最も単純）

#   * 速度はわずかに落ちるが、**メモリはさらに下がりやすい**
#   * 速度が十分速い現在（Runtime 8ms, 97%ile）なら、メモリ順位を優先する場面で有効

# 以下では **修正案A** を実装します（現実的に速度とメモリの両立が良い）。

# ---

# ## 3) 修正版コード（LeetCode提出形式 / Class形式 / Pylance対応）

# ```python
from __future__ import annotations

from array import array
from typing import Dict, Final


class Solution:
    """
    Longest Substring Without Repeating Characters

    メモリ削減版：
    - ASCII (0..127) は array('I', 128) の軽量表（未出現=0, 出現は index+1）
    - 非ASCII (>=128) は dict に格納（BMP 65536表は使わない）
      → 65536 要素配列(約256KB) の確保を完全に回避してピークメモリを下げる
    """

    _MAX_LEN: Final[int] = 5 * 10**4

    def lengthOfLongestSubstring(self, s: str) -> int:
        """
        Args:
            s: 入力文字列

        Returns:
            重複のない最長連続部分文字列の長さ

        Raises:
            TypeError: s が str でない場合
            ValueError: 入力長が仕様上限を超える場合

        Complexity:
            Time: O(n)
            Space: O(1) 相当（ASCIIは固定128、非ASCIIは出現数に比例）
        """
        if not isinstance(s, str):
            raise TypeError("Input must be a string")
        n: int = len(s)
        if n > self._MAX_LEN:
            raise ValueError("Input length exceeds allowed maximum")
        if n == 0:
            return 0

        # ASCII 用（0..127）だけ固定確保：極小＆高速
        last_ascii: array = array("I", [0]) * 128
        # 非ASCII は dict にのみ格納（BMP 65536表は作らない）
        last_other: Dict[int, int] = {}

        left: int = 0
        best: int = 0

        for i, ch in enumerate(s):
            code: int = ord(ch)
            if code < 128:
                prev: int = last_ascii[code]
                if prev > left:
                    left = prev
                last_ascii[code] = i + 1
            else:
                prev = last_other.get(code, 0)
                if prev > left:
                    left = prev
                last_other[code] = i + 1

            curr_len: int = i - left + 1
            if curr_len > best:
                best = curr_len

        return best


# ```

# ---

# ## 4) まとめ（効果とトレードオフ）

# * **効果**:

#   * 以前の「非ASCIIで 65536 配列を確保」を**完全に撤廃** → **約256KBぶんのピーク削減**
#   * 多くの入力でメモリ順位（Beats%）が改善しやすい
# * **速度**:

#   * 非ASCIIを `dict` で扱うぶん、ASCIIに比べると**わずかに遅い可能性**はありますが、
#     ASCII主体のケースは引き続き高速（`array` 参照のみ）。
#   * トータルでは **8msクラスの性能をほぼ維持**できます
# * **さらに削るなら**:

#   * **全文字 `dict` のみ（修正案B）**にすると、状況次第でピークをより下げられます（速度は微減）

# 必要なら、**「速度最優先版（BMP 65536配列あり）」と「メモリ最小版（dictのみ）」の2実装を併記**して、ワークロードに合わせて切り替えるテンプレートもお渡しできます。
