-- テーブル `BST(N, P)` があり、

-- * **Root**: `P IS NULL` のノード
-- * **Leaf**: 子を持たないノード
-- * **Inner**: それ以外（親もいて子もいる）

-- を判定するクエリを書きます。

-- ---

-- ## 解答（MySQL）

-- ```sql
SELECT
    N,
    CASE
        WHEN P IS NULL THEN 'Root'
        WHEN N NOT IN (SELECT DISTINCT P FROM BST WHERE P IS NOT NULL) THEN 'Leaf'
        ELSE 'Inner'
    END AS NodeType
FROM BST
ORDER BY N;
-- ```

-- ---

-- ### 解説

-- 1. **Root判定**

--    * `P IS NULL` → 親がいないノード。

-- 2. **Leaf判定**

--    * そのノードが **他のノードの親になっていない** ＝ `N NOT IN (SELECT DISTINCT P ...)`

-- 3. **Inner判定**

--    * Root でも Leaf でもないノード。

-- ---

-- ### 実行例（質問のサンプル木）

-- 入力 `BST` が以下の場合:

-- | N | P    |
-- | - | ---- |
-- | 1 | 2    |
-- | 2 | 5    |
-- | 3 | 2    |
-- | 5 | NULL |
-- | 6 | 8    |
-- | 8 | 5    |
-- | 9 | 8    |

-- 実行結果:

-- ```
-- 1 Leaf
-- 2 Inner
-- 3 Leaf
-- 5 Root
-- 6 Leaf
-- 8 Inner
-- 9 Leaf
-- ```

-- ---

-- ✅ このクエリは MySQL でも動作します。

-- 必要なら `JOIN` を使ったバージョンも提示できますが、上記が最もシンプルです。
