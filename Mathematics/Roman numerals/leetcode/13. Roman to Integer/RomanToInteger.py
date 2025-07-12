# 以下は、**Python (CPython 3.11.4)** を用いて「ローマ数字を整数に変換」するコードです。
# **型アノテーション、処理時間、メモリ使用量**を明示しており、LeetCodeなどでの実行も想定しています。

# ---

# ## ✅ 解法：ローマ数字を整数に変換する

# ### 📄 `roman_to_int.py`

# ```python
import time
import tracemalloc
from typing import Dict, List

def roman_to_int(s: str) -> int:
    roman_map: Dict[str, int] = {
        'I': 1, 'V': 5, 'X': 10,
        'L': 50, 'C': 100, 'D': 500, 'M': 1000
    }
    total: int = 0
    i: int = 0
    while i < len(s):
        curr: int = roman_map[s[i]]
        if i + 1 < len(s) and roman_map[s[i + 1]] > curr:
            total += roman_map[s[i + 1]] - curr
            i += 2
        else:
            total += curr
            i += 1
    return total

def main() -> None:
    test_cases: List[str] = ["III", "LVIII", "MCMXCIV"]

    # 測定開始
    start_time: float = time.perf_counter()
    tracemalloc.start()

    results: List[int] = [roman_to_int(s) for s in test_cases]

    # 測定終了
    current, peak = tracemalloc.get_traced_memory()
    end_time: float = time.perf_counter()
    tracemalloc.stop()

    # 結果出力
    print("入力:", test_cases)
    print("出力:", results)
    print(f"\n処理時間: {(end_time - start_time) * 1000:.3f} ms")
    print(f"メモリ使用量: {current / 1024:.3f} KB")
    print(f"最大メモリ使用量: {peak / 1024:.3f} KB")

if __name__ == "__main__":
    main()
# ```

# ---

# ## 🧪 実行結果（例）

# ```
# 入力: ['III', 'LVIII', 'MCMXCIV']
# 出力: [3, 58, 1994]

# 処理時間: 0.121 ms
# メモリ使用量: 0.523 KB
# 最大メモリ使用量: 0.582 KB
# ```

# ---

# ## 🔍 解説（図）

# ### 入力： `"MCMXCIV"`

# | 位置 | 文字 | 値    | 次の値    | 判定         | 操作               | 合計   |
# | -- | -- | ---- | ------ | ---------- | ---------------- | ---- |
# | 0  | M  | 1000 | C=100  | 100<1000 ❌ | +1000            | 1000 |
# | 1  | C  | 100  | M=1000 | 100<1000 ✅ | +900 (1000 -100) | 1900 |
# | 3  | X  | 10   | C=100  | 10<100 ✅   | +90  (100 - 10)  | 1990 |
# | 5  | I  | 1    | V=5    | 1<5 ✅      | +4   (5 - 1)     | 1994 |

# ---

# ## 📌 特徴まとめ

# | 項目       | 内容                              |
# | -------- | ------------------------------- |
# | 時間計算量    | O(n)（nは文字列長）                    |
# | 空間計算量    | O(1)（固定の辞書のみ使用）                 |
# | メモリ使用量   | 数百KB未満（トレース含む）                  |
# | 処理時間     | 数百μs〜1ms                        |
# | 型アノテーション | `Dict`, `List`, `int`, `str` 明示 |

# ---

# ## ✅ LeetCode 用の形式（関数のみ）

# 以下のように `class Solution` 形式にすれば LeetCode に提出可能です：

# ```python
class Solution:
    def romanToInt(self, s: str) -> int:
        roman_map: Dict[str, int] = {
            'I': 1, 'V': 5, 'X': 10,
            'L': 50, 'C': 100, 'D': 500, 'M': 1000
        }
        total: int = 0
        i: int = 0
        while i < len(s):
            curr: int = roman_map[s[i]]
            if i + 1 < len(s) and roman_map[s[i + 1]] > curr:
                total += roman_map[s[i + 1]] - curr
                i += 2
            else:
                total += curr
                i += 1
        return total
