-- 要求は **STATION テーブルの LAT\_N 列の中央値 (median)** を小数点4桁に丸めて出力することです。

-- ---

-- ## 🔎 中央値の定義

-- 中央値とは：

-- * データ数が **奇数** → 真ん中の値
-- * データ数が **偶数** → 真ん中2つの平均値

-- SQL には `MEDIAN()` 関数は存在しないため、ウィンドウ関数や `LIMIT` を利用して計算する必要があります。

-- ---

-- ## ✅ MySQL 解答

-- ```sql
-- SELECT ROUND(AVG(middle_values), 4) AS median
-- FROM (
--     SELECT LAT_N AS middle_values
--     FROM STATION
--     ORDER BY LAT_N
--     LIMIT 2 - (SELECT COUNT(*) FROM STATION) % 2    -- 奇数なら1, 偶数なら2
--     OFFSET (SELECT (COUNT(*) - 1) / 2 FROM STATION) -- 真ん中の位置
-- ) AS subquery;
-- ```

-- ---

-- ## 💡 解説

-- ### 1. `ORDER BY LAT_N`

-- 中央値を求めるため、まず `LAT_N` を昇順に並べる。

-- ### 2. `LIMIT` の工夫

-- ```sql
-- LIMIT 2 - (SELECT COUNT(*) FROM STATION) % 2
-- ```

-- * データ数が奇数 → `COUNT % 2 = 1` → `2 - 1 = 1` → 1件取得（真ん中1件）
-- * データ数が偶数 → `COUNT % 2 = 0` → `2 - 0 = 2` → 真ん中2件を取得

-- ### 3. `OFFSET`

-- ```sql
-- OFFSET (SELECT (COUNT(*) - 1) / 2 FROM STATION)
-- ```

-- * データ数が奇数 → 真ん中の位置までスキップ
-- * データ数が偶数 → 真ん中2件のうち最初の位置までスキップ

-- ### 4. `AVG(middle_values)`

-- * 奇数 → 1件だけ取得されるので、そのまま平均 = 中央値
-- * 偶数 → 2件が取得されるので、平均をとることで中央値を計算

-- ### 5. `ROUND(..., 4)`

-- 結果を **小数点第4位** に四捨五入。

-- ---

-- ## 📌 出力例

-- もし `LAT_N` が以下のデータだとします：

-- ```
-- 10.1, 20.5, 30.0, 40.2, 50.7
-- ```

-- * 件数 = 5 (奇数) → 真ん中 = 30.0 → 出力 `30.0000`

-- もし `LAT_N` が：

-- ```
-- 10.1, 20.5, 30.0, 40.2
-- ```

-- * 件数 = 4 (偶数) → 真ん中2つ = 20.5, 30.0 → 平均 = 25.25 → 出力 `25.2500`

-- ---

-- 👉 これで **奇数・偶数両方に対応した堅牢な MySQL 中央値クエリ** になります。

-- ---

-- エラーメッセージを見ると、実際に実行されているのは **MySQL ではなく SQL Server (T-SQL)** です。

-- ```
-- Msg 102, Level 15, State 1, Server dbrank-tsql
-- Incorrect syntax near 'LIMIT'.
-- ```

-- 👉 SQL Server には **`LIMIT` も `OFFSET` も存在しません**。そのため、私が提示した MySQL 用のクエリをそのまま使うとランタイムエラーになります。
-- HackerRank の「Weather Observation Station 20」問題は **環境によって SQL Server (MS SQL)** を使っているため、この違いが原因です。

-- ---

-- ## ✅ 修正版 (SQL Server / T-SQL 用)

-- SQL Server では `TOP` と `ORDER BY` を組み合わせて中央値を取得します。
-- 中央値を求める一般的な方法は **順位関数 (`ROW_NUMBER`) と COUNT** を使う方法です。

-- ```sql
WITH Ordered AS (
    SELECT LAT_N,
           ROW_NUMBER() OVER (ORDER BY LAT_N) AS rn,
           COUNT(*) OVER() AS total_count
    FROM STATION
)
SELECT ROUND(AVG(1.0 * LAT_N), 4) AS median
FROM Ordered
WHERE rn IN ((total_count + 1) / 2, (total_count + 2) / 2);
-- ```

-- ---

-- ## 💡 解説

-- 1. **`ROW_NUMBER() OVER (ORDER BY LAT_N)`**

--    * `LAT_N` を昇順に並べ、各行に連番を付与。

-- 2. **`COUNT(*) OVER()`**

--    * 全体の件数を求める（`total_count`）。

-- 3. **中央値の行を抽出**

--    * 奇数の場合 → `(total_count + 1) / 2` が中央の行番号。
--    * 偶数の場合 → `(total_count / 2, total_count / 2 + 1)` の2行が中央。
--    * 上記をまとめると `IN ((total_count+1)/2, (total_count+2)/2)`。

-- 4. **`AVG()`**

--    * 奇数 → 1行だけ選ばれるので、その値がそのまま中央値。
--    * 偶数 → 2行選ばれて平均が取られるので中央値。

-- 5. **`ROUND(..., 4)`**

--    * 小数点第4位に丸める。

-- ---

-- ## 📌 まとめ

-- * あなたのエラー原因 → **MySQL 用の `LIMIT` / `OFFSET` を SQL Server (T-SQL) に書いてしまった**。
-- * 修正方法 → **`ROW_NUMBER` と `COUNT` を用いた T-SQL クエリ** に書き換える。

-- ---
