# 以下に、LeetCode 向けの **Python (CPython 3.11.4)** 実装を提示します。
# 効率を重視した **スライディングウィンドウ + ハッシュマップ** による解法で、クラスベース（`class Solution`）形式を使用し、関数の型注釈・処理時間・メモリ使用についても記述しています。

# ---

# ## ✅ 実装（Python・LeetCode形式）

# ```python
from typing import List
from collections import Counter

class Solution:
    def findSubstring(self, s: str, words: List[str]) -> List[int]:
        """
        与えられた文字列 `s` に対して、配列 `words` に含まれる単語をすべて1回ずつ順不同に連結した部分文字列の開始インデックスを返す。

        :param s: 入力文字列（最大長 10^4）
        :param words: 同じ長さの単語からなる配列（最大長 5000）
        :return: 該当する部分文字列の開始インデックスのリスト
        """
        if not s or not words or not words[0]:
            return []

        word_len: int = len(words[0])
        word_count: int = len(words)
        total_len: int = word_len * word_count
        s_len: int = len(s)

        if s_len < total_len:
            return []

        result: List[int] = []
        # word_map = Counter(words)
        word_map: Counter[str] = Counter(words)  # 明示的な型

        for i in range(word_len):
            left: int = i
            right: int = i
            # window_counter = Counter()
            window_counter: Counter[str] = Counter()  # 型を明示
            count: int = 0

            while right + word_len <= s_len:
                word = s[right:right + word_len]
                right += word_len

                if word in word_map:
                    window_counter[word] += 1
                    count += 1

                    while window_counter[word] > word_map[word]:
                        left_word = s[left:left + word_len]
                        window_counter[left_word] -= 1
                        left += word_len
                        count -= 1

                    if count == word_count:
                        result.append(left)
                else:
                    window_counter.clear()
                    count = 0
                    left = right

        return result
# ```

# ---

# ## ✅ 使用例（ローカル確認用）

# ```python
# # 実行例
# s = "barfoofoobarthefoobarman"
# words = ["bar", "foo", "the"]
# sol = Solution()
# print(sol.findSubstring(s, words))  # 出力: [6, 9, 12]
# ```

# ---

# ## ✅ 計算量解析

# | 項目      | 計算量                         | 備考                            |
# | ------- | --------------------------- | ----------------------------- |
# | 時間計算量   | `O(N * W)`                  | `N`: 文字列長, `W`: 単語長           |
# | 空間計算量   | `O(U)`                      | `U`: ユニーク単語数（最大 words.length） |
# | 実行時間目安  | 約 80〜100ms                  | LeetCodeの中央値程度                |
# | メモリ使用目安 | 約 15〜20MB（CPython 3.11.4基準） | 標準的                           |

# ---

# ## ✅ アルゴリズムのポイント

# * **Counter を使って単語の出現回数を記録**（words）
# * **オフセット i を 0〜word\_len-1 までずらしてウィンドウ探索**
# * **スライドしながらカウントを更新して無駄な再計算を回避**

# ---

# ## 🔍 オプション: 可視化や図解が必要ですか？

# 希望があれば、Pythonコードに対応する **スライディングウィンドウの図** を作成可能です。たとえば、各インデックスでの `left`, `right`, `window_counter`, `word_map` の状態を段階的に視覚化できます。ご希望でしたらお知らせください。

# ご指摘の Pylance 警告（`Counter[Unknown]`）は、`Counter()` の使用時に初期化と同時に型ヒントが明示されていない場合に発生します。

# Python は動的型ですが、Pylance（静的解析ツール）は型推論を厳密に扱うため、次のように明示的に型指定することで警告を回避できます。

# ---

# ## ✅ 修正済コード（型ヒント追加）

# ```python
# from typing import List
# from collections import Counter

# class Solution:
#     def findSubstring(self, s: str, words: List[str]) -> List[int]:
#         """
#         与えられた文字列 `s` に対して、配列 `words` に含まれる単語をすべて1回ずつ順不同に連結した部分文字列の開始インデックスを返す。

#         :param s: 入力文字列（最大長 10^4）
#         :param words: 同じ長さの単語からなる配列（最大長 5000）
#         :return: 該当する部分文字列の開始インデックスのリスト
#         """
#         if not s or not words or not words[0]:
#             return []

#         word_len: int = len(words[0])
#         word_count: int = len(words)
#         total_len: int = word_len * word_count
#         s_len: int = len(s)

#         if s_len < total_len:
#             return []

#         result: List[int] = []
#         word_map: Counter[str] = Counter(words)  # 明示的な型

#         for i in range(word_len):
#             left: int = i
#             right: int = i
#             window_counter: Counter[str] = Counter()  # 型を明示
#             count: int = 0

#             while right + word_len <= s_len:
#                 word: str = s[right:right + word_len]
#                 right += word_len

#                 if word in word_map:
#                     window_counter[word] += 1
#                     count += 1

#                     while window_counter[word] > word_map[word]:
#                         left_word: str = s[left:left + word_len]
#                         window_counter[left_word] -= 1
#                         left += word_len
#                         count -= 1

#                     if count == word_count:
#                         result.append(left)
#                 else:
#                     window_counter.clear()
#                     count = 0
#                     left = right

#         return result
# ```

# ---

# ## ✅ 修正ポイントまとめ

# | 変数名                 | 修正内容                   |
# | ------------------- | ---------------------- |
# | `window_counter`    | `Counter[str]` として型を明示 |
# | `word_map`          | 同様に `Counter[str]` に明示 |
# | `word`, `left_word` | `str` として明示（任意、より明確に）  |

# ---

# ## ✅ 使用例（変わらず動作）

# ```python
# s = "barfoofoobarthefoobarman"
# words = ["bar", "foo", "the"]
# sol = Solution()
# print(sol.findSubstring(s, words))  # [6, 9, 12]
# ```

# ---

# この修正で **Pylance の警告は完全に解消**されるはずです。
# さらに必要があれば、`Counter[str]` を `Dict[str, int]` に変えても構いませんが、Pythonic な書き方では `Counter` が推奨されます。

# 他にも警告があればお知らせください。
