# # 1. 問題分析

# ### 競技プログラミング視点

# * 目的: `s` の部分文字列のうち `t` の全文字を含む最小の区間を返す。
# * 制約: `m, n ≤ 10^5` → **O(m + n)** が必須。
# * 最適解は **スライディングウィンドウ + 2ポインタ**。
# * メモリ: カウンタ (dict or array) を使えば O(1) 空間で済む（文字集合は英字のみ）。
# * PythonのGIL → 並列処理の恩恵は少ないので、**単一スレッド + dict最適化** がベスト。

# ### 業務開発視点

# * 可読性: スライディングウィンドウを関数化することで理解しやすく。
# * 型ヒント: `str`, `Dict[str, int]`, `Optional[str]` を利用。
# * エラーハンドリング: `t` が空なら `""` を即返却、`s` が短すぎる場合も早期return。

# ### Python特有の考慮点

# * **collections.Counter / defaultdict** が便利で速い。
# * ただし `Counter` 更新は若干遅いので、**dict操作**が最速。
# * 内包表記より通常ループの方が読みやすさ重視。
# * `min` / `max` での計算は不要 → 手動管理が速い。

# ---

# # 2. アルゴリズム比較

# | アプローチ             | 時間計算量      | 空間計算量 | 実装コスト | 可読性 | Python標準ライブラリ活用            | 備考      |
# | ----------------- | ---------- | ----- | ----- | --- | -------------------------- | ------- |
# | 方法A: スライディングウィンドウ | O(m+n)     | O(1)  | 中     | 高   | collections.Counter / dict | 最適解     |
# | 方法B: ソート区間探索      | O(m log m) | O(n)  | 中     | 中   | heapq                      | 非効率     |
# | 方法C: 全区間探索        | O(m²)      | O(1)  | 低     | 高   | なし                         | 小規模のみ有効 |

# ---

# # 3. 実装方針

# * **選択: 方法A (スライディングウィンドウ)**
# * 理由:

#   * O(m+n) で計算量最適。
#   * dict で t の文字カウントを保持 → s を走査して必要数を満たす区間を維持。
#   * 最小区間を逐次更新。
# * Python最適化:

#   * `defaultdict(int)` を使用して高速化。
#   * 文字数カウンタを直接比較せず、「必要な種類数 vs 満たした種類数」で判定。
#   * 入力チェックは業務用メソッドのみ実装、競プロ用は省略。

# ---

# # 4. コード実装例

from collections import defaultdict

# ```python
from typing import Dict, Optional


class Solution:
    def minWindow(self, s: str, t: str) -> str:
        """
        最小ウィンドウ部分文字列を返す
        Args:
            s (str): 探索対象文字列
            t (str): 必要文字列
        Returns:
            str: 条件を満たす最小部分文字列。存在しない場合は空文字。
        Raises:
            ValueError: tが空の場合
            TypeError: 引数がstrでない場合
        """
        # 入力検証
        if not isinstance(s, str) or not isinstance(t, str):
            raise TypeError("Both s and t must be strings")
        if not t:
            raise ValueError("String t must not be empty")
        if len(s) < len(t):
            return ""

        need: Dict[str, int] = defaultdict(int)
        for ch in t:
            need[ch] += 1

        have: Dict[str, int] = defaultdict(int)
        required = len(need)
        formed = 0
        res: Optional[tuple[int, int]] = None  # (left, right)
        l = 0

        for r, ch in enumerate(s):
            have[ch] += 1
            if ch in need and have[ch] == need[ch]:
                formed += 1

            # 左端を縮めて最小化
            while formed == required:
                if res is None or (r - l) < (res[1] - res[0]):
                    res = (l, r)

                left_ch = s[l]
                have[left_ch] -= 1
                if left_ch in need and have[left_ch] < need[left_ch]:
                    formed -= 1
                l += 1

        return "" if res is None else s[res[0] : res[1] + 1]

    def minWindow_optimized(self, s: str, t: str) -> str:
        """
        競技プログラミング向け高速版
        - 入力検証省略
        - defaultdictでO(1)アクセス
        """
        need: Dict[str, int] = defaultdict(int)
        for ch in t:
            need[ch] += 1

        have: Dict[str, int] = defaultdict(int)
        required, formed = len(need), 0
        res, l = None, 0

        for r, ch in enumerate(s):
            have[ch] += 1
            if ch in need and have[ch] == need[ch]:
                formed += 1

            while formed == required:
                if res is None or (r - l) < (res[1] - res[0]):
                    res = (l, r)
                left_ch = s[l]
                have[left_ch] -= 1
                if left_ch in need and have[left_ch] < need[left_ch]:
                    formed -= 1
                l += 1

        return "" if res is None else s[res[0] : res[1] + 1]


# ```

# ---

# # 5. 計算量まとめ

# * **時間計算量**: O(m + n)

#   * s を一度走査、t の長さに比例する初期化。
# * **空間計算量**: O(1) （英字固定 52種 → 上限定数）
# * **Python固有オーバーヘッド**:

#   * dict アクセスは平均 O(1)。
#   * whileループ内での条件分岐がボトルネック。
# * **GIL制約**: 単一スレッド前提のため影響なし。

# ---

# # 6. Python固有の最適化観点

# * **組み込み活用**: `defaultdict(int)` による初期化不要アクセス。
# * **データ構造**: `dict` が最適。`Counter` より速い。
# * **不要コピー回避**: 部分文字列は最後に一度だけ切り出す。
# * **型ヒント**: Pylance で解析可能 (`Dict[str, int]`, `Optional[tuple[int,int]]`)。
# * **メモリ効率**: 辞書のエントリ数は最大 52。大規模文字集合でないため安定。

# ---

### PythonのGILとは？

# **GIL** (Global Interpreter Lock) は、**Python**の**C言語で実装されたインタープリタ**（CPython）に存在する**排他ロック**の一種です。GILが存在すると、**一度に1つのスレッドしかPythonのバイトコードを実行できません**。これは、マルチスレッドアプリケーションにおいて、複数のスレッドが同時にPythonのコードを実行することを妨げます。

# ---

# ### なぜGILは存在するのか？

# GILの主な目的は、**メモリ管理を単純化し、スレッドセーフなPythonコードを簡単に書けるようにすること**です。

# - **単純なメモリ管理:** Pythonのオブジェクトは参照カウントという方法でメモリ管理をしています。これは、オブジェクトへの参照の数を数えることで、不要になったオブジェクトを自動的に解放する仕組みです。複数のスレッドが同時に参照カウントを操作すると、競合状態が発生し、メモリリークやクラッシュにつながる可能性があります。GILは、この参照カウントの操作を一度に1つのスレッドに限定することで、スレッドセーフなメモリ管理を保証します。

# - **C言語ライブラリとの連携:** GILは、PythonがC言語のライブラリ（NumPyなど）と連携する際に、スレッドセーフなアクセスを確保する役割も果たします。

# ### GILのメリットとデメリット

# #### メリット

# - **単一スレッドのパフォーマンス向上:** GILは単純なロックであるため、スレッド切り替えのオーバーヘッドが少なく、単一スレッドの実行速度を向上させる場合があります。
# - **C言語エクステンションの記述を容易に:** GILのおかげで、C言語で書かれたPythonの拡張モジュールは、複雑なスレッドセーフなコードを書く必要がなくなります。

# #### デメリット

# - **並列処理の妨げ:** マルチコアCPU環境でも、複数のスレッドが同時にPythonコードを実行できないため、CPUバウンドな処理（複雑な計算など）のパフォーマンスを向上させることが困難です。つまり、**真の並列処理**は実現できません。

# ---

# ### GILを回避する方法

# GILはCPUバウンドなタスクで問題になりますが、I/Oバウンドなタスク（ネットワーク通信やファイルI/Oなど）では、GILが解放されるため、マルチスレッドの効果を享受できます。

# CPUバウンドなタスクで並列処理を実現するには、主に以下の方法が取られます。

# - **マルチプロセス:** `multiprocessing` モジュールを使用し、複数のプロセスを生成します。各プロセスは独立したPythonインタープリタとメモリ空間を持つため、GILの影響を受けません。これにより、複数のCPUコアをフル活用できます。
# - **C/C++での実装:** パフォーマンスが重要な部分は、GILの影響を受けないCやC++で実装し、Pythonから呼び出す方法です。NumPyなどの科学計算ライブラリがこの方法を採用しています。
# - **代替インタープリタ:** CPython以外のPythonインタープリタ（JythonやIronPythonなど）を使用します。これらのインタープリタはGILを持たないため、真の並列処理が可能です。ただし、これらのインタープリタは、CPythonと互換性がない場合があるため注意が必要です。
