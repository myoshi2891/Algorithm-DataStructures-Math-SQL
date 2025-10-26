# 解説

## 1) 全体像（データフロー図）

```text
[Students(ID, Name, Marks)]
            │
            │ Marks が Grades の [Min_Mark, Max_Mark] に入る行と結合
            ▼
      ┌─────────── RANGE JOIN ───────────┐
      │  s.Marks BETWEEN g.Min_Mark AND g.Max_Mark
      └───────────────────────────────────┘
            ▼
[一時結果: Name, Marks, Grade]
            │
            │ 表示名を CASE で切替 (Grade<8 → 'NULL'、それ以外 → Name)
            ▼
[出力列: 表示名, Grade, Marks]
            │
            │ 並び替え (Grade 降順) → (Grade≧8は Name 昇順) → (Grade<8は Marks 昇順)
            ▼
           [最終レポート]
```

---

## 2) 結合のしくみ（レンジ結合）

クエリ（再掲）：

```sql
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
```

**ポイント図：**

```text
Grades(例)
+-------+----------+----------+
| Grade | Min_Mark | Max_Mark |
+-------+----------+----------+
|  10   |    90    |   100    |
|   9   |    80    |    89    |
|   8   |    70    |    79    |
|   7   |    60    |    69    |
|  ...  |   ...    |   ...    |
+-------+----------+----------+

Students(例)
+----+---------+-------+
| ID |  Name   | Marks |
+----+---------+-------+
|  1 | Maria   |  99   | → 90～100 の範囲 → Grade=10
|  2 | Jane    |  81   | → 80～89  の範囲 → Grade=9
|  3 | Julia   |  88   | → 80～89  の範囲 → Grade=9
|  4 | Scarlet |  78   | → 70～79  の範囲 → Grade=8
|  5 | Lucas   |  63   | → 60～69  の範囲 → Grade=7
|  6 | Tom     |  68   | → 60～69  の範囲 → Grade=7
+----+---------+-------+
```

`JOIN` 条件
`s.Marks BETWEEN g.Min_Mark AND g.Max_Mark`
で、**各生徒の Marks が入る区間の Grade を 1 行に決定**します（**レンジ結合**）。

---

## 3) 表示名の決定（CASE）

要件：「Grade が 8 未満なら名前は表示せず `'NULL'` と出す」

**分岐図：**

```text
            ┌───────────────┐
            │ Grade < 8 ?   │
            └───────┬───────┘
                    │Yes                      No│
                    ▼                          ▼
             Name = 'NULL'               Name = s.Name
```

- 実際は **文字列 `'NULL'`** を出力（SQL の `NULL` 値ではありません）。

---

## 4) 並び替え（ORDER BY）のルール

要件をそのまま **優先度付きキー** に落とし込みます：

```text
優先度1: Grade を降順 (大きい→小さい)
優先度2: Gradeが 8～10 の行だけ Name を昇順
優先度3: Gradeが 1～7  の行だけ Marks を昇順
```

これを **CASE 式で “使うキーだけ値を入れる”** 方式にすると、MySQL の `ORDER BY` 一発で実現できます。

**並び替えキーの見える化：**

```text
SortKey1 = g.Grade (DESC)

SortKey2 = CASE WHEN g.Grade >= 8 THEN s.Name END (ASC)
  → Grade>=8 の行だけ “名前” を第2キーに使う。Grade<8 は NULL なので効かない。

SortKey3 = CASE WHEN g.Grade < 8 THEN s.Marks END (ASC)
  → Grade<8 の行だけ “点数” を第3キーに使う。Grade>=8 は NULL なので効かない。
```

グループ（Grade 同値）内で：

- **Grade≥8** グループは **名前のアルファベット順**
- **Grade<8** グループは **Marks の小さい順**

---

## 5) サンプルで “最後まで” 追跡

**JOIN の結果（中間）**：

```text
+---------+-------+-------+
|  Name   | Grade | Marks |
+---------+-------+-------+
| Maria   |  10   |  99   |
| Jane    |   9   |  81   |
| Julia   |   9   |  88   |
| Scarlet |   8   |  78   |
| Lucas   |   7   |  63   |
| Tom     |   7   |  68   |
+---------+-------+-------+
```

**CASE で表示名を確定**（Grade<8 を 'NULL' に）：

```text
+---------+-------+-------+
|  Name   | Grade | Marks |
+---------+-------+-------+
| Maria   |  10   |  99   |
| Jane    |   9   |  81   |
| Julia   |   9   |  88   |
| Scarlet |   8   |  78   |
| NULL    |   7   |  63   | ← 'NULL' (文字列)
| NULL    |   7   |  68   | ← 'NULL' (文字列)
+---------+-------+-------+
```

**並び替えを適用（優先度順）**：

1. Grade 降順 → `10, 9, 9, 8, 7, 7`
2. Grade=9 の同点 → Name 昇順 → `Jane, Julia`
3. Grade=7 の同点 → Marks 昇順 → `63, 68`

**最終出力（サンプルの期待通り）**：

```text
Maria  10  99
Jane    9  81
Julia   9  88
Scarlet 8  78
NULL    7  63
NULL    7  68
```

---

## 6) 実務のちょい Tips（最適化・堅牢化）

- **Grades テーブルは通常 10 行前後**（1 ～ 10）なので、レンジ結合でもコストは軽いです。
  それでも安定性を高めるなら：
    - `Students(Marks)` にインデックス（結合時の参照が軽くなります）。
    - `Grades` は小さく固定なので全表スキャンで OK。

- **境界値が重複しない設計**（例：`[70,79]` と `[80,89]` のように連続・非重複）を守ると、`BETWEEN` の挙動が明快になります。
- 文字列 `'NULL'` は **“見せるための文字”** で、SQL の `NULL` とは違います。クエリのままで HackerRank の要件に適合します。

---

## 7) もう一度クエリ

```sql
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
```

この構成（**レンジ結合 → 表示名の CASE 切替 → 条件付き ORDER BY**）で、要件をそのまま素直に充たせます。
