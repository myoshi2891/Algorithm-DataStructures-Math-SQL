-- やりたいことは “職業ごとに名前をアルファベット順で並べ、同じ行番号（1番目, 2番目, …）の人同士を横に並べる” という **Pivot** です。
-- MySQL 8.0+ ならウィンドウ関数が最短・確実。5.x でもユーザー変数で代替できます。

-- ---

-- ## ✅ MySQL 8.0+（推奨：ウィンドウ関数 `ROW_NUMBER()`）

-- ```sql
WITH ranked AS (
  SELECT
    name,
    occupation,
    ROW_NUMBER() OVER (PARTITION BY occupation ORDER BY name) AS rn
  FROM OCCUPATIONS
)
SELECT
  MAX(CASE WHEN occupation = 'Doctor'   THEN name END) AS Doctor,
  MAX(CASE WHEN occupation = 'Professor' THEN name END) AS Professor,
  MAX(CASE WHEN occupation = 'Singer'   THEN name END) AS Singer,
  MAX(CASE WHEN occupation = 'Actor'    THEN name END) AS Actor
FROM ranked
GROUP BY rn
ORDER BY rn;
-- ```

-- ### ポイント

-- * `ROW_NUMBER() OVER (PARTITION BY occupation ORDER BY name)`
--   職業ごとに名前をアルファベット順で 1,2,3… と採番。
-- * 同じ `rn` を持つ行を `CASE WHEN` で列に振り分け、`MAX()` で1値に畳み込み（欠けは `NULL`）。
-- * 列順は指定どおり **Doctor, Professor, Singer, Actor**。

-- ---

-- ## ♻️ MySQL 5.x 互換（ユーザー変数で採番）

-- ```sql
SET @r_d := 0, @r_p := 0, @r_s := 0, @r_a := 0;

SELECT
  MAX(CASE WHEN occupation = 'Doctor'    THEN name END) AS Doctor,
  MAX(CASE WHEN occupation = 'Professor' THEN name END) AS Professor,
  MAX(CASE WHEN occupation = 'Singer'    THEN name END) AS Singer,
  MAX(CASE WHEN occupation = 'Actor'     THEN name END) AS Actor
FROM (
  SELECT
    name,
    occupation,
    CASE occupation
      WHEN 'Doctor'    THEN (@r_d := @r_d + 1)
      WHEN 'Professor' THEN (@r_p := @r_p + 1)
      WHEN 'Singer'    THEN (@r_s := @r_s + 1)
      WHEN 'Actor'     THEN (@r_a := @r_a + 1)
    END AS rn
  FROM OCCUPATIONS
  -- 職業ごとに名前をアルファベット順に処理するための並び
  ORDER BY occupation, name
) AS t
GROUP BY rn
ORDER BY rn;
-- ```

-- ### ポイント

-- * 職業ごとに独立したカウンタ（`@r_d` など）を持ち、**職業→名前の順**で処理して採番。
-- * 外側は 8.0 版と同様に `CASE` で列に割り当て、`NULL` 埋めが自動で行われます。

-- ---

-- ## 出力イメージ

-- ```
Doctor    | Professor | Singer | Actor
---------------------------------------------
Jenny     | Ashley    | Meera  | Jane
Samantha  | Christeen | Priya  | Julia
NULL      | Ketty     | NULL   | Maria
-- ```

-- これで要件どおり、各列がアルファベット順・不足分は `NULL`、列の順序も固定で得られます。
