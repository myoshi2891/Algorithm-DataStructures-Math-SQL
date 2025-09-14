# パフォーマンス比較とボトルネック分析

class PerformanceAnalysis:
    """各実装手法のパフォーマンス特性を詳細分析"""

    def analyze_space_complexity(self):
        """空間計算量の実際の影響を分析"""

        # ケース1: 2次元DP (O(m×n))
        def version_2d(word1: str, word2: str) -> int:
            m, n = len(word1), len(word2)
            # メモリ使用: (m+1) × (n+1) × 28bytes (Python int object)
            dp = [[0] * (n + 1) for _ in range(m + 1)]

            # 初期化のオーバーヘッド
            for i in range(m + 1):
                dp[i][0] = i
            for j in range(n + 1):
                dp[0][j] = j

            for i in range(1, m + 1):
                for j in range(1, n + 1):
                    if word1[i - 1] == word2[j - 1]:
                        dp[i][j] = dp[i - 1][j - 1]
                    else:
                        dp[i][j] = min(
                            dp[i - 1][j] + 1,
                            dp[i][j - 1] + 1,
                            dp[i - 1][j - 1] + 1
                        )
            return dp[m][n]

        # ケース2: 1次元最適化 (O(min(m,n)))
        def version_1d_optimized(word1: str, word2: str) -> int:
            if len(word2) > len(word1):
                word1, word2 = word2, word1

            m, n = len(word1), len(word2)
            # メモリ使用: 2 × (n+1) × 28bytes のみ
            prev = list(range(n + 1))

            for i in range(1, m + 1):
                # 効率的な配列生成
                curr = [i] + [0] * n

                for j in range(1, n + 1):
                    if word1[i - 1] == word2[j - 1]:
                        curr[j] = prev[j - 1]
                    else:
                        # min()の引数順序も最適化可能
                        curr[j] = 1 + min(prev[j], curr[j - 1], prev[j - 1])

                prev = curr  # O(1) 参照切り替え

            return prev[n]

        return version_2d, version_1d_optimized

    def analyze_memory_access_patterns(self):
        """メモリアクセスパターンの違いを分析"""

        print("=== メモリアクセスパターン分析 ===")

        # 2次元版: ランダムアクセスパターン
        print("2次元DP版:")
        print("- dp[i-1][j-1], dp[i-1][j], dp[i][j-1] への不規則アクセス")
        print("- キャッシュミス率が高い（特に大きな配列）")
        print("- メモリ局所性が低い")

        # 1次元最適化版: 順次アクセスパターン
        print("\n1次元最適化版:")
        print("- prev[j-1], prev[j], curr[j-1] への順次アクセス")
        print("- キャッシュフレンドリーなアクセスパターン")
        print("- 高いメモリ局所性")

    def analyze_cpython_optimizations(self):
        """CPython特有の最適化ポイント"""

        optimizations = {
            "配列初期化": {
                "効率的": "[i] + [0] * n",
                "非効率": "手動ループでの要素設定",
                "理由": "C実装による高速な配列操作"
            },
            "min()関数": {
                "効率的": "min(prev[j], curr[j-1], prev[j-1])",
                "非効率": "if-elif チェーン",
                "理由": "C実装 + 可変長引数の最適化"
            },
            "変数スワップ": {
                "効率的": "word1, word2 = word2, word1",
                "非効率": "temp変数使用",
                "理由": "タプルパック/アンパック最適化"
            },
            "リスト参照切り替え": {
                "効率的": "prev = curr",
                "非効率": "prev[:] = curr[:]",
                "理由": "参照の付け替えのみ（O(1)）"
            }
        }

        return optimizations

    def analyze_algorithmic_improvements(self):
        """アルゴリズム観点での改善点"""

        improvements = {
            "早期終了条件": {
                "手法": "共通接頭辞・接尾辞のスキップ",
                "効果": "最良ケースでO(min(m,n))に削減",
                "実装例": """
                # 共通接頭辞をスキップ
                start = 0
                while start < min(m, n) and word1[start] == word2[start]:
                    start += 1

                # 共通接尾辞をスキップ
                end1, end2 = m, n
                while end1 > start and end2 > start and word1[end1-1] == word2[end2-1]:
                    end1 -= 1
                    end2 -= 1
                """
            },
            "分割統治法": {
                "手法": "Hirschberg's algorithm",
                "効果": "O(min(m,n))空間 + 分割による並列化可能",
                "トレードオフ": "実装複雑度 vs 大規模データでの効果"
            }
        }

        return improvements

# 実際のパフォーマンステスト用コード
def benchmark_comparison():
    """実際のパフォーマンス差を測定"""

    import random
    import string
    import time

    def generate_test_string(length: int) -> str:
        return ''.join(random.choices(string.ascii_lowercase, k=length))

    # テストケース生成
    test_cases = [
        (50, 50),    # 小規模
        (200, 200),  # 中規模
        (500, 500),  # 大規模
    ]

    for m, n in test_cases:
        word1 = generate_test_string(m)
        word2 = generate_test_string(n)

        print(f"\n=== テストケース: {m}×{n} ===")

        # メモリ使用量推定
        memory_2d = (m + 1) * (n + 1) * 28  # Python int object
        memory_1d = 2 * (min(m, n) + 1) * 28
        reduction = (1 - memory_1d / memory_2d) * 100

        print(f"メモリ使用量削減: {reduction:.1f}%")
        print(f"2次元版: {memory_2d:,} bytes")
        print(f"1次元版: {memory_1d:,} bytes")

# 追加の最適化テクニック
class AdvancedOptimizations:
    """さらなる最適化手法"""

    def minDistance_ultra_optimized(self, word1: str, word2: str) -> int:
        """究極最適化版（実用性とのトレードオフあり）"""

        # 共通接頭辞をスキップ
        start = 0
        min_len = min(len(word1), len(word2))
        while start < min_len and word1[start] == word2[start]:
            start += 1

        # 共通接尾辞をスキップ
        end1, end2 = len(word1), len(word2)
        while end1 > start and end2 > start and word1[end1-1] == word2[end2-1]:
            end1 -= 1
            end2 -= 1

        # 処理対象部分を抽出
        word1 = word1[start:end1]
        word2 = word2[start:end2]

        m, n = len(word1), len(word2)

        if m == 0:
            return n
        if n == 0:
            return m

        # 短い方をnに
        if n > m:
            word1, word2 = word2, word1
            m, n = n, m

        # 標準アルゴリズム
        prev = list(range(n + 1))
        for i in range(1, m + 1):
            curr = [i] + [0] * n
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    curr[j] = prev[j - 1]
                else:
                    curr[j] = 1 + min(prev[j], curr[j - 1], prev[j - 1])
            prev = curr

        return prev[n]

if __name__ == "__main__":
    # 分析実行
    analyzer = PerformanceAnalysis()

    print("=== CPython最適化分析 ===")
    opts = analyzer.analyze_cpython_optimizations()
    for category, details in opts.items():
        print(f"\n{category}:")
        print(f"  効率的: {details['効率的']}")
        print(f"  理由: {details['理由']}")

    print("\n" + "="*50)
    analyzer.analyze_memory_access_patterns()

    print("\n" + "="*50)
    benchmark_comparison()

# 実行結果
# === CPython最適化分析 ===

# 配列初期化:
#   効率的: [i] + [0] * n
#   理由: C実装による高速な配列操作

# min()関数:
#   効率的: min(prev[j], curr[j-1], prev[j-1])
#   理由: C実装 + 可変長引数の最適化

# 変数スワップ:
#   効率的: word1, word2 = word2, word1
#   理由: タプルパック/アンパック最適化

# リスト参照切り替え:
#   効率的: prev = curr
#   理由: 参照の付け替えのみ（O(1)）

# ==================================================
# === メモリアクセスパターン分析 ===
# 2次元DP版:
# - dp[i-1][j-1], dp[i-1][j], dp[i][j-1] への不規則アクセス
# - キャッシュミス率が高い（特に大きな配列）
# - メモリ局所性が低い

# 1次元最適化版:
# - prev[j-1], prev[j], curr[j-1] への順次アクセス
# - キャッシュフレンドリーなアクセスパターン
# - 高いメモリ局所性

# ==================================================

# === テストケース: 50×50 ===
# メモリ使用量削減: 96.1%
# 2次元版: 72,828 bytes
# 1次元版: 2,856 bytes

# === テストケース: 200×200 ===
# メモリ使用量削減: 99.0%
# 2次元版: 1,131,228 bytes
# 1次元版: 11,256 bytes

# === テストケース: 500×500 ===
# メモリ使用量削減: 99.6%
# 2次元版: 7,028,028 bytes
# 1次元版: 28,056 bytes
