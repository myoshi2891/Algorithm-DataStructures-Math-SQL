# 🪜 Climbing Stairs — 問題分析 & 解説

---

## 1. 問題分析結果

### 競技プログラミング視点

- **制約分析**: `1 <= n <= 45` → 最大45段。O(n) でも O(log n) でも余裕
- **本質**: `f(n) = f(n-1) + f(n-2)` ← **フィボナッチ数列そのもの**
- **CPython最適化**: ループ変数の直接演算でオブジェクト生成を最小化

### 業務開発視点

- **型安全設計**: `int → int` のシンプルな関係、`pylance` 対応
- **エラーハンドリング**: 制約外の入力（`n < 1`, `n > 45`）への対応
- **可読性**: 意図が明確な変数名と段階的なロジック

### Python特有分析

| 観点           | 分析結果                             |
| -------------- | ------------------------------------ |
| データ構造     | `list` (DP配列) or 変数2個でO(1)空間 |
| 標準ライブラリ | `functools.cache` でメモ化が最も簡潔 |
| CPython最適化  | タプルアンパック代入で一時変数不要   |

---

## 2. アルゴリズム比較表

| アプローチ       | 時間計算量 | 空間計算量 | 実装コスト | 可読性  | 標準ライブラリ活用 | CPython最適化 | 備考                  |
| ---------------- | ---------- | ---------- | ---------- | ------- | ------------------ | ------------- | --------------------- |
| 再帰 + `@cache`  | O(n)       | O(n)       | 低         | ★★★     | `functools.cache`  | 適            | 最も簡潔・可読性◎     |
| DP配列           | O(n)       | O(n)       | 低         | ★★★     | -                  | 適            | 直感的・教育的        |
| **空間最適化DP** | **O(n)**   | **O(1)**   | **低**     | **★★☆** | **-**              | **最適**      | **本命：変数2個のみ** |
| 行列累乗         | O(log n)   | O(1)       | 高         | ★☆☆     | `numpy`            | 不適          | n<=45では過剰         |

---

## 3. なぜフィボナッチなのか（図解）

```
n段目に到達するルートは必ず2通りの直前状態から来る:
  ┌── (n-1)段目から 1歩
  └── (n-2)段目から 2歩

f(1) = 1   [1]
f(2) = 2   [1+1, 2]
f(3) = 3   [1+1+1, 1+2, 2+1]  ← f(2) + f(1) = 3
f(4) = 5                        ← f(3) + f(2) = 5
f(5) = 8                        ← f(4) + f(3) = 8

状態遷移:
  prev2   prev1    curr
  f(n-2)  f(n-1)  f(n) = f(n-1) + f(n-2)
    1  →    2   →   3
            ↑       ↑
          prev2   prev1  (次のイテレーション)
```

---

## 4. 実装

```python
from functools import cache


class Solution:
    """
    Climbing Stairs 解決クラス

    本質: f(n) = f(n-1) + f(n-2) のフィボナッチ数列
    - 業務開発版: 入力検証・型安全・エラーハンドリング重視
    - 競技版:     空間O(1)・タプルアンパックによるCPython最適化
    """

    # =========================================================
    # ✅ 業務開発版 (pylance対応・エラーハンドリング・可読性重視)
    #
    # Runtime 0 ms
    # Beats 100.00%
    # Memory 19.31 MB
    # Beats 50.45%
    # =========================================================
    def climbStairs(self, n: int) -> int:
        """
        n段の階段を1歩 or 2歩で登る組み合わせ数を返す（業務開発版）

        Args:
            n: 階段の段数 (制約: 1 <= n <= 45)

        Returns:
            頂上への異なる登り方の数

        Raises:
            TypeError:  n が int でない場合
            ValueError: n が制約範囲外の場合

        Time Complexity:  O(n)
        Space Complexity: O(1)
        """
        self._validate_input(n)

        # エッジケース: 1段または2段
        if n <= 2:
            return n

        return self._fibonacci_space_optimized(n)

    def _validate_input(self, n: int) -> None:
        """pylance対応の型安全な入力検証"""
        if not isinstance(n, int) or isinstance(n, bool):
            raise TypeError(f"n must be an integer, got {type(n).__name__}")
        if not (1 <= n <= 45):
            raise ValueError(f"n must satisfy 1 <= n <= 45, got {n}")

    def _fibonacci_space_optimized(self, n: int) -> int:
        """
        空間O(1)のフィボナッチ計算
        タプルアンパックで一時変数・中間オブジェクトを排除
        """
        prev2: int = 1  # f(n-2): 1段前々の答え
        prev1: int = 2  # f(n-1): 1段前の答え

        for _ in range(n - 2):
            # CPython最適化: タプルアンパックで右辺を先に評価
            prev2, prev1 = prev1, prev1 + prev2

        return prev1

    # =========================================================
    # ⚡ 競技プログラミング版 (速度・簡潔さ最優先)
    #
    # Runtime 0 ms
    # Beats 100.00%
    # Memory 19.39 MB
    # Beats 50.45%
    # =========================================================
    def climbStairs_competitive(self, n: int) -> int:
        """
        競技プログラミング向け最適化実装
        @cache デコレータによるメモ化再帰 — 最も簡潔な表現

        Time Complexity:  O(n)
        Space Complexity: O(n) ← コールスタック + キャッシュ
        """
        @cache
        def dp(i: int) -> int:
            if i <= 2:
                return i
            return dp(i - 1) + dp(i - 2)

        return dp(n)

    def climbStairs_oneliner(self, n: int) -> int:
        """
        ワンライナー競技版 — reduce を使った関数型スタイル
        Time Complexity:  O(n)
        Space Complexity: O(1)
        Runtime 0 ms
        Beats 100.00%
        Memory 19.39 MB
        Beats 50.45%
        """
        from functools import reduce
        # (prev2, prev1) のペアを n-1 回更新
        _, result = reduce(
            lambda acc, _: (acc[1], acc[0] + acc[1]),
            range(n - 1),
            (1, 1)
        )
        return result
```

---

## 5. 動作トレース（n = 5）

```
初期値: prev2=1(f1), prev1=2(f2)
ループ n-2=3 回:

  iter 1: prev2, prev1 = 2,  (2+1)=3   → f(3)=3
  iter 2: prev2, prev1 = 3,  (3+2)=5   → f(4)=5
  iter 3: prev2, prev1 = 5,  (5+3)=8   → f(5)=8

return prev1 = 8  ✅
```

---

## 6. 境界値・型チェック検証

| 入力      | 期待値       | 分類                                         |
| --------- | ------------ | -------------------------------------------- |
| `n = 1`   | `1`          | 最小値エッジケース                           |
| `n = 2`   | `2`          | エッジケース境界                             |
| `n = 3`   | `3`          | 基本ケース                                   |
| `n = 45`  | `1836311903` | 最大値・オーバーフロー不要（Python任意精度） |
| `n = 0`   | `ValueError` | 範囲外                                       |
| `n = "5"` | `TypeError`  | 型エラー                                     |

> 💡 **Pythonのint型は任意精度** のため、n=45でもオーバーフロー不要。C++/Javaと異なる重要なPython特性。
