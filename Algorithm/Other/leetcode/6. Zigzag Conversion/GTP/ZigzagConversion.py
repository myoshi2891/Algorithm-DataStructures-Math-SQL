# ## 1. 多角的問題分析

# ### 競技プログラミング視点

# * **最速方針**: 文字列長 `n` に対して**1パス O(n)**。
#   周期 `cycle = 2*(numRows-1)` を用い、各行 `row` の**縦列** `i = row + k*cycle` を走査。中間行（`row∉{0, numRows-1}`）は**斜め要素** `diag = i + (cycle - 2*row)` を追加。
# * **メモリ効率**: 出力以外の補助領域は定数個だけで **O(1)**（出力バッファは `n` 必要）。

# ### 業務開発視点

# * **可読性/保守性**: 端条件（`numRows==1` と `numRows>=n`）を**早期 return**。変数名（`cycle`, `diag_idx`, `k`）で意図を明確化。
# * **型安全性/エラーハンドリング**: LeetCode 環境では**異常入力は与えられない前提**だが、実務では型検証関数を用意可能（本コードに `_validate_inputs` を併記、実行パスでは未使用）。

# ### Python特有考慮

# * **CPython特性**:

#   * ループ内の属性/グローバル参照コスト削減のため**ローカル変数に束縛**。
#   * **リストへ逐次代入 → `''.join(list)`** が文字列連結より効率的。
# * **データ構造**:

#   * `out = [''] * n` の**固定長リスト**にインデックス代入で GC 負荷を低減。
#   * `deque` 等は不要（先頭操作が無いため）。

# ---

# ## 2. アルゴリズム比較表

# | アプローチ                | 時間計算量      | 空間計算量 | Python実装コスト | 可読性 | 標準ライブラリ活用 | CPython最適化 | 備考          |
# | -------------------- | ---------- | ----- | ----------- | --- | --------- | ---------- | ----------- |
# | 方法A: 周期式で行別に直接抽出（採用） | O(n)       | O(1)* | 低           | ★★★ | 不要        | 適          | *出力を除く      |
# | 方法B: 行番号タグ付けしてソート    | O(n log n) | O(n)  | 中           | ★★☆ | `sorted`  | 不適         | 不要に重い       |
# | 方法C: 2D配置して読み出し      | O(n²)      | O(n²) | 低           | ★★★ | 不要        | 不適         | 無駄セル多数で非現実的 |

# ---

# ## 3. 採用アルゴリズムと根拠

# * **選択**: 方法A（周期式・直接抽出）
# * **理由**:

#   * **O(n)** で最短、補助メモリ最小。
#   * 端条件が単純で**バグ混入点が少ない**。
#   * Python でも**固定長リスト + 逐次代入**により高速・低 GC。
# * **Python最適化戦略**:

#   * ループ内計算を**定数式化**（`cycle`、`2*row` などをローカルに）。
#   * `out` へ **k インデックスで連続代入** → 最後に `''.join(out)`。

# ---

# ## 4. 検証（方針のみ）

# * **境界**: `numRows == 1`、`numRows >= len(s)`、`len(s) == 1`。
# * **一般**: 提示例（3行/4行）で期待出力に一致。
# * **型**: `s: str` / `numRows: int` のみ（*pylance* で静的検証可能）。

# ---

# ## 5. 実装（LeetCode クラス形式 / 型付き / 競技向け高速版を既定で使用）

# ```python
from __future__ import annotations


class Solution:
    """
    6. Zigzag Conversion
    - 競技向け: convert() は高速版を直接呼び出し
    - 実務向け: 必要に応じて _validate_inputs() を convert() 冒頭で有効化
    """

    def convert(self, s: str, numRows: int) -> str:
        """
        与えられた文字列を numRows 行のジグザグ配置で並べ替え、行ごとに読み出す。

        Args:
            s: 変換対象の文字列（長さ 1..1000）
            numRows: 行数（1..1000）

        Returns:
            変換後の文字列

        Note:
            LeetCode 前提では異常入力は与えられない。
            実務では self._validate_inputs(s, numRows) の呼び出しを検討。
        """
        # 実務での厳格検証を行う場合は次行を有効化
        # self._validate_inputs(s, numRows)
        return self._convert_fast(s, numRows)

    # ---- 競技プログラミング向け（最小オーバーヘッド） ----
    def _convert_fast(self, s: str, numRows: int) -> str:
        n: int = len(s)
        if numRows == 1 or numRows >= n:
            return s

        cycle: int = (numRows - 1) * 2  # 2*(numRows-1)
        out: list[str] = [""] * n
        k: int = 0

        # ローカル束縛で高速化（ループ内の属性/グローバル解決を避ける）
        _s = s
        _n = n
        _out = out
        _k = k
        _cycle = cycle
        last_row = numRows - 1

        for row in range(numRows):
            i = row
            if row == 0 or row == last_row:
                # 端の行: 斜め要素なし、周期刻みで縦成分のみ
                while i < _n:
                    _out[_k] = _s[i]
                    _k += 1
                    i += _cycle
            else:
                # 中間行: 縦成分 + 斜め成分
                step_diag = _cycle - (row << 1)  # cycle - 2*row
                while i < _n:
                    _out[_k] = _s[i]
                    _k += 1
                    diag_idx = i + step_diag
                    if diag_idx < _n:
                        _out[_k] = _s[diag_idx]
                        _k += 1
                    i += _cycle

        # k を戻す（Python は整数はイミュータブルだが、参照変数は別名束縛）
        k = _k  # noqa: F841  # 明示的に未使用警告を避けるための代入（実行に影響なし）
        return "".join(_out)

    # ---- 実務向けの入力検証（必要時のみ使用） ----
    def _validate_inputs(self, s: object, numRows: object) -> None:
        """
        実務向けの入力検証。
        LeetCode では想定外入力が来ないため呼び出さない。
        """
        if not isinstance(s, str):
            raise TypeError("s must be a string")
        if not isinstance(numRows, int):
            raise TypeError("numRows must be an int")
        n = len(s)
        if not (1 <= n <= 1000):
            raise ValueError("len(s) must be in [1, 1000]")
        if not (1 <= numRows <= 1000):
            raise ValueError("numRows must be in [1, 1000]")


# Analyze Complexity

# Runtim 4 ms
# Beats 95.83%
# Memory 17.9 MB
# Beats 49.25%

# ```

# * **計算量**: Time `O(n)`、Space `O(1)`（出力バッファ除く補助領域は定数）
# * **pylance**: すべてのシンボルに型情報があり、未定義参照はありません。
