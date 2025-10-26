-- ## 1) 名前 + 職業の頭文字（カッコ付き）、名前のアルファベット順

-- ```sql
SELECT
  CONCAT(name, '(', LEFT(occupation, 1), ')') AS name_with_initial
FROM OCCUPATIONS
ORDER BY name;
-- ```

-- ### 解説

-- * `LEFT(occupation, 1)`：職業名の先頭1文字（D/P/S/A）を取得します。`SUBSTRING(occupation,1,1)`でも同じです。
-- * `CONCAT(...)`：`name` と `(` + 頭文字 + `)` を連結して `AnActorName(A)` のような表記を作ります。
-- * `ORDER BY name`：名前を**アルファベット順**に整列します（大文字小文字の扱いは DB の照合順序に依存しますが、通常は意図通りになります）。

-- ---

-- ## 2) 職業ごとの人数をカウントし、指定の文言で件数を出力

-- 件数の**昇順**、同数なら**職業名のアルファベット順**で並べます。

-- ```sql
SELECT
  CONCAT('There are a total of ', cnt, ' ', LOWER(occupation), 's.') AS summary
FROM (
  SELECT occupation, COUNT(*) AS cnt
  FROM OCCUPATIONS
  GROUP BY occupation
) AS t
ORDER BY t.cnt ASC, t.occupation ASC;
-- ```

-- ### 解説

-- * 内側の集計サブクエリ

--   * `SELECT occupation, COUNT(*) AS cnt ... GROUP BY occupation`
--     各職業（Doctor/Professor/Singer/Actor）ごとの人数を数え、`cnt` 列に入れます。
-- * 外側の整形

--   * `LOWER(occupation)`：職業名を**小文字**化（`doctor`, `singer`, …）。
--   * 文言の成形は `CONCAT('There are a total of ', cnt, ' ', LOWER(occupation), 's.')`。
--     問題の前提上、全て規則的に **語尾に s を付ければ複数形**になります（irregular なし）。
-- * 並び順

--   * `ORDER BY t.cnt ASC, t.occupation ASC`：件数の昇順、同数なら職業名のアルファベット順。
--     サンプルの並び（2件の *doctors* → 2件の *singers* → 3件の *actors* → 3件の *professors*）と一致します。

-- ---

-- ### 補足（よくある質問）

-- * **サブクエリなしでも可？**
--   はい。次のようにしても同じ並びになります：

--   ```sql
  SELECT
    CONCAT('There are a total of ', COUNT(*), ' ', LOWER(occupation), 's.') AS summary
  FROM OCCUPATIONS
  GROUP BY occupation
  ORDER BY COUNT(*) ASC, occupation ASC;
--   ```

-- * **大文字小文字の並びが気になる場合**
--   並び替えキーに明示的に `LOWER(occupation)` を使うと安定します：

--   ```sql
  ORDER BY COUNT(*) ASC, LOWER(occupation) ASC;
--   ```

