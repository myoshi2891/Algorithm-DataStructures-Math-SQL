-- # 解答（MySQL）

-- ```sql
SELECT
  c.company_code,
  c.founder,
  COALESCE(lm.lead_cnt, 0)    AS total_lead_managers,
  COALESCE(sm.senior_cnt, 0)  AS total_senior_managers,
  COALESCE(m.manager_cnt, 0)  AS total_managers,
  COALESCE(e.emp_cnt, 0)      AS total_employees
FROM Company AS c
LEFT JOIN (
  SELECT company_code, COUNT(DISTINCT lead_manager_code) AS lead_cnt
  FROM Lead_Manager
  GROUP BY company_code
) AS lm ON lm.company_code = c.company_code
LEFT JOIN (
  SELECT company_code, COUNT(DISTINCT senior_manager_code) AS senior_cnt
  FROM Senior_Manager
  GROUP BY company_code
) AS sm ON sm.company_code = c.company_code
LEFT JOIN (
  SELECT company_code, COUNT(DISTINCT manager_code) AS manager_cnt
  FROM Manager
  GROUP BY company_code
) AS m ON m.company_code = c.company_code
LEFT JOIN (
  SELECT company_code, COUNT(DISTINCT employee_code) AS emp_cnt
  FROM Employee
  GROUP BY company_code
) AS e ON e.company_code = c.company_code
ORDER BY c.company_code ASC;
-- ```

-- ---

-- # 各処理の詳しい解説（ステップごと）

-- 1. **目的**
--    Companyごとに `lead managers`, `senior managers`, `managers`, `employees` の合計数を出す。ただしテーブル内に重複レコードがある可能性があるため **同じコードは1つとして数える（重複除去）**。

-- 2. **COUNT(DISTINCT ...) を使う理由**
--    問題に「テーブルに重複が含まれる可能性がある」とあるため、例えば `Lead_Manager` テーブルに同じ `lead_manager_code` が複数行あっても 1 として数える必要があります。`COUNT(DISTINCT lead_manager_code)` でこれを実現します。

-- 3. **サブクエリで先に集計してから JOIN**
--    各下位テーブル（Lead\_Manager, Senior\_Manager, Manager, Employee）を `company_code` ごとに集計した結果を、Company テーブルに `LEFT JOIN` しています。

--    * メリット：各集計が独立しているため、JOIN時の重複膨張（クロス積的増加）を防げる（例えば Manager と Employee を直接 JOIN して集計すると行数が増えて誤カウントする危険あり）。
--    * `LEFT JOIN` にすることで、従業員が一切居ない会社でも Company 行は残り、`COALESCE(...,0)` で 0 を返します。

-- 4. **ORDER BY company\_code ASC（文字列ソート）**
--    `company_code` は文字列型なので、`ORDER BY c.company_code ASC` で文字列順に昇順ソートされます。例にある通り `C_1, C_10, C_2` のような順になるのが期待通りです（数値順ではありません）。

-- 5. **NULL→0 の処理**
--    下位テーブルに該当データが無い場合、JOIN した集計列は `NULL` になります。`COALESCE(...,0)` で明示的に `0` に置き換えています。

-- ---

-- # 実行パフォーマンスの注意点（推奨インデックス）

-- 集計が大きいテーブルでは以下のインデックスを張ると高速化できます（MySQL での例）：

-- ```sql
CREATE INDEX idx_lm_company ON Lead_Manager(company_code);
CREATE INDEX idx_lm_code    ON Lead_Manager(lead_manager_code);

CREATE INDEX idx_sm_company ON Senior_Manager(company_code);
CREATE INDEX idx_sm_code    ON Senior_Manager(senior_manager_code);

CREATE INDEX idx_m_company  ON Manager(company_code);
CREATE INDEX idx_m_code     ON Manager(manager_code);

CREATE INDEX idx_e_company  ON Employee(company_code);
CREATE INDEX idx_e_code     ON Employee(employee_code);
-- ```

-- これらは `GROUP BY company_code` と `COUNT(DISTINCT ...)` を速くします。

-- ---

-- # 注意事項 / 追加パターン

-- * **Company テーブルに存在しない company\_code も含めたい場合**（＝ Company テーブルに founder 情報がない company\_code も結果に出したい場合）は、全テーブルから company\_code を `UNION` して全会社コード一覧を作り、その一覧を基準に LEFT JOIN する方法が使えます（MySQL 8.0 の CTE を利用可）。必要ならその SQL も提示します。
-- * 各階層の整合性（例えば Manager テーブルの `company_code` と Senior\_Manager テーブルの `company_code` が常に一致するか）はデータ次第です。整合性が怪しい場合は `company_code` を主キーに集計する現在のやり方が安全です（各テーブルの `company_code` フィールドを尊重してカウントする）。

-- ---

-- # 出力例（問題のサンプルに対応する想定）

-- ```
-- C1 Monika   1 2 1 2
-- C2 Samantha 1 1 2 2
-- ```

-- ---

-- 必要であれば、

-- * Company に存在しない company\_code も含めた完全リスト版SQL、
-- * 相関サブクエリ（`SELECT (SELECT COUNT(...))`）を使った別解、
-- * 実際のサンプルデータを使った実行結果（テーブルのダンプを貼っていただければ実行例を示します）
