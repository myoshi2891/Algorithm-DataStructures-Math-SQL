# 以下は **Python (CPython 3.11+)** での回答です。
# 問題は前回と同じ「Unix-style パスの正規化（Simplify Path）」で、テンプレートに沿って解析→比較→方針→実装（LeetCodeスタイルの `class Solution`）を提示します。**テストコード・実行計測は含めません**。

# ---

# # 1. 問題分析

# ## 競技プログラミング視点

# * **目標**: 最短時間で正しい解を返す。入力長は最大 3000 文字程度なので O(n) が最適。
# * **高速化ポイント**:

#   * 文字列を `split('/')` してトークン単位で一度走査（O(n)）。
#   * スタック操作は Python の `list` の `append/pop` を使う（O(1) amortized）。
#   * `for` ループを用い、無駄なコピーや正規表現、多重ループを避ける。
# * **メモリ効率**:

#   * 分割結果とスタックで O(n) の追加メモリ（n はトークン数）。入力は最大 3000 なので実用上問題なし。
#   * 低メモリ版は文字単位で逐次処理する方法だが実装複雑で誤り源となるため今回は非採用。

# ## 業務開発視点

# * **可読性・保守性**:

#   * 明確な変数名 (`parts`, `stack`) と JSDoc 相当の docstring。
#   * 入力検証を行い、型不一致や範囲外は早期に例外を投げる（`TypeError`, `ValueError`）。
#   * Pure-ish（入力文字列を変更しない）で副作用を避ける設計。
# * **エラーハンドリング**:

#   * `path` が `str` でない → `TypeError`
#   * 長さが 1..3000 の範囲外 → `ValueError`
#   * 先頭が `'/'` でない（絶対パス要件） → `ValueError`

# ## Python特有の考慮点

# * **データ構造選択**:

#   * `list`（append/pop）は最も高速でJITなしでも良好（CPythonの最適化）。
#   * `collections.deque` は両端操作が強いが今回は不要。
# * **組み込み関数の活用**:

#   * `str.split`、`str.join` を使い Python のネイティブ実装に委ねる。
# * **内包表記 vs ループ**:

#   * 内包表記は読みやすいが今回のロジックは早期 `..` の処理があるため明示的ループが分かりやすく高速。
# * **GIL の影響**:

#   * 本処理は単スレッドで十分。GIL は問題にならない。

# ---

# # 2. アルゴリズム比較

# ```
# アプローチ         | 時間計算量 | 空間計算量 | 実装コスト | 可読性 | Python標準活用 | 備考
# ------------------|-----------|-----------|-----------|--------|---------------|------
# 方法A (スタック)   | O(n)      | O(n)      | 低        | 高     | split/join    | 最適（採用）
# 方法B (正規表現多用)| O(n log n)| O(n)      | 中        | 中     | re, split     | 過剰、エッジケース注意
# 方法C (逐次走査)   | O(n)〜O(n^2)| O(1)    | 高        | 低     | なし          | 文字単位でメモリ節約だが実装複雑
# ```

# * **補足**: 実用上は方法A（トークン分割→スタック）が最もバランス良し。`split('/')` は連続スラッシュを空文字トークンで表現するため、その扱いが簡潔。

# ---

# # 3. 実装方針

# * **選択したアプローチ**: 方法A（スタック処理）
# * **選択理由**:

#   * 単純でバグが少ない。O(n) 時間・O(n) 空間で十分高速。
#   * Python の組み込み `split` / `join` が使えるためコード量とバグが減る。
#   * `append/pop` の操作は CPython で高速。
# * **Pythonでの実装効率**:

#   * 型ヒントと docstring を用意し、静的解析ツール（Pylance など）で安全性を補助。
# * **最適化ポイント**:

#   * `for token in parts:` よりもインデックス走査で変わらないが可読性重視で `for token in parts` を採用。
#   * 早期 continue を多用して余計な処理を避ける。
#   * 出力は `'/' + '/'.join(stack)`、`stack` が空なら `'/'` を返す。

# ---

# # 4. 実装コード（LeetCode形式）

# 以下は LeetCode に投稿できる `class Solution` スタイルの実装です。
# `CPython 3.11+` 向けに型ヒント（標準 `typing`）を使用しています。入力検証・例外処理を含みます。

# ```python
from typing import List
# import sys


class Solution:
    def simplifyPath(self, path: str) -> str:
        """
        Simplify a Unix-style absolute path to its canonical form.

        Args:
            path (str): Absolute path string (must start with '/').
        Returns:
            str: Simplified canonical path.
        Raises:
            TypeError: If 'path' is not a string.
            ValueError: If 'path' length is outside allowed bounds or not absolute.
        Complexity:
            Time: O(n) where n = len(path)
            Space: O(n) for tokens/stack (worst-case)
        """
        # --- 入力検証（軽量・早期） ---
        if not isinstance(path, str):
            raise TypeError("path must be a string")
        n = len(path)
        if n < 1 or n > 3000:
            raise ValueError("path length out of bounds (1..3000)")
        if path[0] != "/":
            raise ValueError("path must be absolute and start with '/'")

        # --- トークン分割（'//' は空トークンになる） ---
        parts: List[str] = path.split("/")
        stack: List[str] = []

        # --- メインループ（O(n)） ---
        for token in parts:
            if token == "" or token == ".":
                # 空トークン（連続スラッシュ起因）やカレントディレクトリは無視
                continue
            if token == "..":
                # 親ディレクトリへ移動（root 以上へは行かない）
                if stack:
                    stack.pop()
            else:
                # "..." のような名前は有効なディレクトリ名として扱う
                stack.append(token)

        # --- 結果生成 ---
        if not stack:
            return "/"
        return "/" + "/".join(stack)


# ```

# ### 補助（競技用に入力検証を省いた最速版）

# 入力検証を全て省略すれば呼び出しオーバーヘッドをさらに減らせます（競技プログラミング用）。


# ```python
class SolutionFast:
    def simplifyPath(self, path: str) -> str:
        # 前提: pathは適切な絶対パス文字列（先頭 '/' など検証不要）
        parts = path.split("/")
        stack: List[str] = []
        for token in parts:
            if token == "" or token == ".":
                continue
            if token == "..":
                if stack:
                    stack.pop()
            else:
                stack.append(token)
        return "/" + "/".join(stack) if stack else "/"


# ```

# ---

# # 5. 計算量まとめ（Python固有の視点）

# * **時間計算量**: O(n)（`split` は O(n)、ループは O(#tokens) ≤ O(n)、`join` は O(n)）
# * **空間計算量**: O(n)（`parts` と `stack` が主な追加領域）
# * **CPython の注意点**:

#   * `split` と `join` は C 実装されていて高速。
#   * `list.append` / `pop` は amortized O(1)。
#   * 内包表記は速いが今回は状態（stack）変更が必要なため明示的ループが読みやすい。
# * **GIL の影響**: 単純処理なので考慮不要。マルチスレッドでの並列化は不要かつ効果は限定的。

# ---

# # 6. Python固有の最適化観点（まとめ）

# 1. **組み込み関数に委ねる**: `str.split` / `str.join` は C レベルで最適化されているため利用する。
# 2. **適切なデータ構造**: 今回は `list`（スタック）で最良。`deque` は両端キュー向け。
# 3. **早期 continue/guard**: 無効トークンは早めにスキップして余計な処理を避ける。
# 4. **型ヒントで静的解析**: `-> str`, `List[str]` を付けて Pylance 等に検査させる。
# 5. **検証と競技モードの切り分け**: 実運用では入力検証を行い、競技では検証を省略して速度優先にできる。

# ---
