-- ```sql
SELECT
  CASE WHEN g.Grade < 8 THEN 'NULL' ELSE s.Name END AS Name,
  g.Grade,
  s.Marks
FROM Students AS s
JOIN Grades   AS g
  ON s.Marks BETWEEN g.Min_Mark AND g.Max_Mark
ORDER BY
  g.Grade DESC,
  CASE WHEN g.Grade >= 8 THEN s.Name END ASC,
  CASE WHEN g.Grade < 8 THEN s.Marks END ASC;
-- ```

-- **ポイント**

-- * `Marks` が `Grades` のレンジ（`Min_Mark`～`Max_Mark`）に入る行で結合。
-- * 表示名は `Grade < 8` のとき `'NULL'`、それ以外は `Name`。
-- * 並び順は

--   1. まず `Grade` 降順、
--   2. `Grade >= 8` の行は `Name` 昇順、
--   3. `Grade < 8` の行は `Marks` 昇順。
--      （条件付き `ORDER BY` を `CASE WHEN` で実現）
