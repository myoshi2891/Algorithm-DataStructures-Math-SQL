# 以下は、Python（CPython 3.11.4）での解答です。型アノテーションをすべて明示し、**Pylance** の型エラーが出ないように注意しています。

# また、処理時間・メモリの消費を抑えた構成で、**最大長20万の括弧列**にも耐えるようにしています。

# ---

# ## ✅ 概要

# * スタックを用いた **O(N)** の処理で対応括弧を収集。
# * 出力条件に合わせて **max(l, r)** 昇順にソート。
# * 処理はすべて関数化し、**型付きで記述**。

# ---

# ## ✅ 実装コード（Python 3.11.4）

# ```python
import sys
from typing import List, Tuple


def find_matching_parentheses(s: str) -> List[Tuple[int, int]]:
    """
    対応の取れた括弧列 s の各括弧の対応を求める。

    :param s: 対応の取れた括弧列（文字列）
    :return: 対応する括弧の位置ペア（1-indexed, 昇順ソート済み）
    """
    stack: List[int] = []
    pairs: List[Tuple[int, int]] = []

    for i, ch in enumerate(s):
        if ch == '(':
            stack.append(i + 1)  # 1-indexed
        else:
            if stack:
                left: int = stack.pop()
                pairs.append((left, i + 1))

    # 出力条件: max(l, r) 昇順
    pairs.sort(key=lambda x: max(x[0], x[1]))
    return pairs


def main() -> None:
    """
    標準入力を読み込み、対応括弧の位置を出力する。
    """
    s: str = sys.stdin.read().strip()
    result: List[Tuple[int, int]] = find_matching_parentheses(s)
    output: List[str] = [f"{l} {r}" for l, r in result]
    print("\n".join(output))


if __name__ == "__main__":
    main()
# ```

# ---

# ## ✅ 処理時間・メモリ効率

# | 項目       | 計算量               | 詳細内容                         |
# | -------- | ----------------- | ---------------------------- |
# | 時間計算量    | `O(N log N)`      | N: 長さ。探索 O(N)、ソート O(N log N) |
# | 空間計算量    | `O(N)`            | スタック + 結果ペア（最大で N/2 個）       |
# | メモリ制限対応  | ✅ 最大 1024MiB に収まる |                              |
# | 実行時間制限対応 | ✅ 最大 2 秒以内に収まる    |                              |

# ---

# ## ✅ 型安全に関する注意点（Pylance 対応）

# * `List[int]` や `List[Tuple[int, int]]` を明示。
# * `.pop()` の戻り値は `int` として扱い、型推論が曖昧にならないようにしています。
# * `sys.stdin.read()` の戻り値を `str` と明記。
