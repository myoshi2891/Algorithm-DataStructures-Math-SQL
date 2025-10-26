# 以下は **Python (CPython 3.11+)** での解答（LeetCode 形式）です。
# 要求どおり「解析 → アルゴリズム比較 → 実装方針 → 実装コード」を順に示します。型ヒント・入力検証・例外処理を含め、競プロ向けに高速でメモリ効率の良い実装を採用しています。

# ---

# ## 1. 問題分析

# ### 競技プログラミング視点

# * **方針**: 貪欲法（Greedy）。単語を左から順に1回ずつ走査して各行を確定する。
# * **実行速度**: 各単語を一度だけ扱うため **O(n)**（n = 単語数）。文字列操作は join/`' '.join` と `str * k`（繰り返し）を活用して効率化。
# * **メモリ効率**: 出力用配列以外は定数補助領域。中間で大きなコピーを作らないように注意。

# ### 業務開発視点

# * **可読性／保守性**: 行生成ロジックを `_build_line` に切り出す。型ヒントとdocstringで契約を明示。
# * **エラーハンドリング**: 型不正は `TypeError`、制約違反は `ValueError` を投げる（呼び出し側が明確に扱えるように）。

# ### Python特有の考慮点

# * リスト走査は `for` ループで行い、`pop(0)` のような非効率操作は使わない。
# * 文字列連結は `join`／`+`／`*` を適切に使用（多数の小さな連結は `join` が有利）。
# * 内包表記で不必要な一時配列を作らない。
# * GIL の影響はこの単一スレッドアルゴリズムでは関係なし。

# ---

# ## 2. アルゴリズム比較

# |            アプローチ |    時間計算量   |    空間計算量   | 実装コスト | 可読性 |    Python標準ライブラリ活用    | 備考     |
# | ---------------: | :--------: | :--------: | :---: | :-: | :-------------------: | :----- |
# |      方法A: 貪欲（推奨） |    O(n)    | O(1)（出力除く） |   低   |  高  | `str.join`, `str * k` | 標準的で最速 |
# | 方法B: 事前解析＋複雑割り振り | O(n log n) |    O(n)    |   中   |  中  |       `heapq` 等       | 不要な複雑化 |
# | 方法C: ブルートフォース全探索 |    O(n²)   |    O(1)    |   低   |  低  |           なし          | 小入力のみ可 |

# ---

# ## 3. 実装方針

# * **選択**: 方法A（貪欲）。
# * **理由**:

#   * 計算量・実装コスト・可読性のバランスが最良。
#   * Pythonでも `O(n)` を保てる。
# * **Python最適化ポイント**:

#   * 単語長の合計を保持して条件判定（`line_len + len(word) + len(line)` を用いる）。
#   * 行確定時は `join` および `' ' * k` を使ってスペースを効率的に作る。
#   * `line` は単語配列のみ持ち、文字列結合は最終段階で一度だけ行う。

# ---

# ## 4. 実装コード（LeetCode 形式）

# ```python
from typing import List


class Solution:
    def fullJustify(self, words: List[str], maxWidth: int) -> List[str]:
        """
        Fully justify text (LeetCode #68 style).
        Args:
            words: List[str] - non-empty list of words (each length <= maxWidth)
            maxWidth: int - target width per line (1 <= maxWidth <= 100)
        Returns:
            List[str] - list of justified lines, each length == maxWidth
        Raises:
            TypeError: if inputs are of incorrect type
            ValueError: if constraints are violated
        Complexity:
            Time: O(n) where n = len(words)
            Space: O(1) auxiliary (excluding output)
        """
        # --- 入力検証 ---
        if not isinstance(words, list):
            raise TypeError("words must be a list of strings")
        if not isinstance(maxWidth, int):
            raise TypeError("maxWidth must be an integer")
        if maxWidth < 1 or maxWidth > 100:
            raise ValueError("maxWidth must be between 1 and 100")
        if len(words) < 1 or len(words) > 300:
            raise ValueError("words length must be between 1 and 300")
        for w in words:
            if not isinstance(w, str):
                raise TypeError("each word must be a string")
            if len(w) == 0 or len(w) > maxWidth:
                raise ValueError("each word length must be 1..maxWidth")

        res: List[str] = []
        line: List[str] = []
        line_len = 0  # sum of lengths of words in current line (no spaces)

        i = 0
        n = len(words)
        while i < n:
            w = words[i]
            # if adding this word (plus at least one space between words) exceeds maxWidth
            # current: line_len + len(line) spaces currently needed between words
            if line_len + len(line) + len(w) > maxWidth:
                # finalize current line (not last)
                res.append(self._build_line(line, line_len, maxWidth, is_last=False))
                line = []
                line_len = 0
            # append current word to line
            line.append(w)
            line_len += len(w)
            i += 1

        # final line: left-justified
        if line:
            res.append(self._build_line(line, line_len, maxWidth, is_last=True))

        return res

    def _build_line(
        self, words: List[str], words_len: int, maxWidth: int, is_last: bool
    ) -> str:
        """
        Build a justified line from words.
        Args:
            words: words in the line
            words_len: sum(len(w) for w in words)
            maxWidth: target width
            is_last: whether this is the last line
        Returns:
            single line string of length == maxWidth
        """
        count = len(words)
        if count == 0:
            return " " * maxWidth

        if is_last or count == 1:
            # Left-justify: words joined by single space, pad right with spaces
            line = " ".join(words)
            pad = maxWidth - len(line)
            return line + (" " * pad)

        # full justify (not last, and more than one word)
        total_spaces = maxWidth - words_len
        gaps = count - 1
        space_each = total_spaces // gaps
        extra = total_spaces % gaps  # leftmost 'extra' gaps get one more space

        parts: List[str] = []
        for idx in range(gaps):
            parts.append(words[idx])
            # add base spaces + possibly one extra for leftmost gaps
            parts.append(" " * (space_each + (1 if idx < extra else 0)))
        parts.append(words[-1])  # last word, no trailing space
        return "".join(parts)


# ```

# ---

# ## 補足（アルゴリズムの正しさを説明する簡潔なフロー）

# 1. 単語をひとつずつ読み、現在の `line` に追加可能か判定する。

#    * 判定式: `line_len + len(line) + len(word) <= maxWidth`
#      （`len(line)` は単語間に必要な最小スペース数：単語数-1）
# 2. 追加不可なら現在の `line` を確定して `res` に追加（均等配分処理 `_build_line`）。
# 3. 最後の残りは `is_last=True` として左寄せで追加。

# ---

# ## 計算量まとめ

# * **時間**: O(n) — 各単語は1度だけ処理され、行ごとの文字列構築は行の単語数に比例。
# * **空間**: 出力 `res` のみ（入力以外の補助は定数レベル）。中間 `parts` リストは行長に依存し、最大でも `maxWidth` 程度。

# ---

# 必要であれば、上の実装を使った簡単なテストケース（例示）や、READMEに貼るための「処理フロー図（Mermaid）」や「ASCII ビジュアル」を追加で作成します。どれが良いですか？
