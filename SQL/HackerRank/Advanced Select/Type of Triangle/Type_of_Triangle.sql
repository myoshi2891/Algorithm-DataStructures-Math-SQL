-- この問題は **三角形の成立条件** と **三角形の種類の判定** を SQL で分岐させるものです。

-- ---

-- ## 🔑 判定の流れ

-- 1. **三角形成立条件**

--    * 3つの辺 (A, B, C) が三角形を作るためには：
--      [
--      A + B > C,; A + C > B,; B + C > A
--      ]
--    * これを満たさない場合は **Not A Triangle**。

-- 2. **成立した場合の種類判定**

--    * (A = B = C) → **Equilateral**
--    * どれか2辺だけ等しい → **Isosceles**
--    * 全て異なる → **Scalene**

-- ---

-- ## ✅ MySQL クエリ

-- ```sql
SELECT
  CASE
    WHEN (A + B <= C) OR (A + C <= B) OR (B + C <= A)
      THEN 'Not A Triangle'
    WHEN A = B AND B = C
      THEN 'Equilateral'
    WHEN A = B OR B = C OR A = C
      THEN 'Isosceles'
    ELSE 'Scalene'
  END AS triangle_type
FROM TRIANGLES;
-- ```

-- ---

-- ## ⚡ 解説

-- * `CASE` 文を使い、優先度の高い判定から順に条件分岐。
-- * **順序が重要**：

--   1. 成立しないパターンを最初に判定しないと、例えば `(1,2,3)` が「Isosceles」など誤判定される可能性がある。
--   2. Equilateral（全辺等しい）は Isosceles の特殊ケースなので **先に判定**。

-- ---

-- ## ✅ サンプル実行

-- 入力テーブル (TRIANGLES):

-- | A  | B  | C  |
-- | -- | -- | -- |
-- | 20 | 20 | 23 |
-- | 20 | 20 | 20 |
-- | 20 | 21 | 22 |
-- | 1  | 2  | 3  |

-- 出力結果:

-- ```
-- Isosceles
-- Equilateral
-- Scalene
-- Not A Triangle
-- ```

-- ---

-- 👉 このクエリを `TRIANGLES` テーブルに実行すれば、各レコードが三角形かどうか、またその種類を判定できます。

-- ---
