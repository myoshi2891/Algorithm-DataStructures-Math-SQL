「**Longest Common Prefix (最長共通接頭辞)**」の処理を
**図解付きで具体的に解析・説明**します。

## アルゴリズム概要：縦方向スキャン

* 最初の文字列を`prefix`に設定
* 2番目以降の文字列と`prefix`を比較し、
  一致しない場合は`prefix`を1文字ずつ短くする
* すべての文字列と一致するまで繰り返す

---

## 例①：「`flower`」「`flow`」「`flight`」

### 初期設定：

```
prefix = "flower"
```

---

### 1回目比較（`flow`と比較）

```
"flower"
"flow"
```

一致チェック：

| f | l | o | w | e | r |
| - | - | - | - | - | - |
| f | l | o | w |   |   |

**→ 一致する部分：`flow`**

→ `prefix`を「`flow`」に短縮。

---

### 2回目比較（`flight`と比較）

```
"flow"
"flight"
```

一致チェック：

| f | l | o | w |
| - | - | - | - |
| f | l | i | g |

→「o ≠ i」で一致失敗。

`prefix`を1文字短くして再チェック：

#### 短縮ループ：

| f | l | o | w |
| - | - | - | - |
| f | l | i | g |

1. `"flow"` → `"flo"`
2. `"flo"` → `"fl"`

| f | l |
| - | - |
| f | l |

→ 一致！

---

### 結果：

```
"fl"
```

---

## 図解フロー（例①）

```plaintext
Input: ["flower", "flow", "flight"]

[Start]
prefix = "flower"

→ Compare with "flow"
    "flower"
    "flow"
→ common: "flow"

→ Compare with "flight"
    "flow"
    "flight"
→ mismatch at 3rd char → shorten prefix
    "flo" → "fl"

Final Answer: "fl"
```

---

## 例②：「`dog`」「`racecar`」「`car`」

### 初期設定：

```
prefix = "dog"
```

---

### 1回目比較（`racecar`と比較）

```
"dog"
"racecar"
```

| d | o | g |
| - | - | - |
| r | a | c |

→ 一致なし。

`prefix`を短縮：

1. "do"
2. "d"
3. ""

**→ 空文字になる → 終了**

---

### 結果：

```
""
```

---

## 図解フロー（例②）

```plaintext
Input: ["dog", "racecar", "car"]

[Start]
prefix = "dog"

→ Compare with "racecar"
    "dog"
    "racecar"
→ no match → shorten prefix to ""
→ return ""

Final Answer: ""
```

---

## メモリと時間について

| 項目       | 内容                               |
| -------- | -------------------------------- |
| 時間計測     | `process.hrtime.bigint()`使用      |
| メモリ消費量計測 | `process.memoryUsage().heapUsed` |
| 記録       | `fs.writeFileSync()`でログ出力        |

---

## 計算量解析

| 項目    | 内容                 |
| ----- | ------------------ |
| 時間計算量 | O(S)（Sはすべての文字数の総和） |
| 空間計算量 | O(1)（出力以外は定数メモリ）   |

---

## 全体処理フロー図（まとめ）

```plaintext
+----------------------+
| 初期prefix = strs[0] |
+----------------------+
           |
           v
+---------------------------+
| 残りの文字列と逐次比較    |
| 一致しない部分があれば    |
| prefixを短くする          |
+---------------------------+
           |
           v
+---------------------------+
| prefixが空になったら終了  |
+---------------------------+
           |
           v
+---------------------------+
| 最終的なprefixを返す     |
+---------------------------+
```

---

## 追加対応可能：

* **分割統治法版の実装**
* **Trie木による実装**
