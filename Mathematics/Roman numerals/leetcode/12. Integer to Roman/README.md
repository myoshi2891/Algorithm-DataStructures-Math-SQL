では、`intToRoman` 関数の各処理を **図を使って** 段階的に解説します。例として、次の入力を用います：

---

## 🎯 例：`num = 3749` の場合

### 🔢 入力

```
3749
```

---

## 🧩 Step 1: 変換テーブルの用意

```ts
const valueSymbolPairs: [number, string][] = [
  [1000, 'M'],
  [900,  'CM'],
  [500,  'D'],
  [400,  'CD'],
  [100,  'C'],
  [90,   'XC'],
  [50,   'L'],
  [40,   'XL'],
  [10,   'X'],
  [9,    'IX'],
  [5,    'V'],
  [4,    'IV'],
  [1,    'I'],
];
```

<table border="1">
<tr><th>数値</th><th>記号</th></tr>
<tr><td>1000</td><td>M</td></tr>
<tr><td>900</td><td>CM</td></tr>
<tr><td>500</td><td>D</td></tr>
<tr><td>400</td><td>CD</td></tr>
<tr><td>100</td><td>C</td></tr>
<tr><td>90</td><td>XC</td></tr>
<tr><td>50</td><td>L</td></tr>
<tr><td>40</td><td>XL</td></tr>
<tr><td>10</td><td>X</td></tr>
<tr><td>9</td><td>IX</td></tr>
<tr><td>5</td><td>V</td></tr>
<tr><td>4</td><td>IV</td></tr>
<tr><td>1</td><td>I</td></tr>
</table>

---

## 🧮 Step 2: 大きい値から順に処理

初期値：

```ts
num = 3749
result = ''
```

---

### ① `1000 ≤ 3749` → `M` を追加

```
num = 3749
↓ -1000
num = 2749
result = 'M'

↓ -1000
num = 1749
result = 'MM'

↓ -1000
num = 749
result = 'MMM'
```

### ② `900 > 749` → スキップ

### ③ `500 ≤ 749` → `D` を追加

```
num = 749
↓ -500
num = 249
result = 'MMMD'
```

### ④ `100 ≤ 249` → `C` を追加

```
↓ -100
num = 149
result = 'MMMDC'

↓ -100
num = 49
result = 'MMMDCC'
```

### ⑤ `40 ≤ 49` → `XL` を追加

```
↓ -40
num = 9
result = 'MMMDCCXL'
```

### ⑥ `9 = 9` → `IX` を追加

```
↓ -9
num = 0
result = 'MMMDCCXLIX'
```

---

## ✅ 最終結果

```
num = 0
result = "MMMDCCXLIX"
```

---

## 🖼️ 処理の図解（フローチャート風）

```
[3749]
  |
[ -1000 ] → "M" → [2749]
  |
[ -1000 ] → "M" → [1749]
  |
[ -1000 ] → "M" → [749]
  |
[ -500  ] → "D" → [249]
  |
[ -100  ] → "C" → [149]
  |
[ -100  ] → "C" → [49]
  |
[ -40   ] → "XL"→ [9]
  |
[ -9    ] → "IX"→ [0]
```

---

## 💡 補足：なぜ 49 = XLIX ？

* `40` → `XL`（10 less than 50）
* `9`  → `IX`（1 less than 10）

---

## ⏱ パフォーマンス面

* 最大でも `num` が 3999 なので、ループ回数は十数回（O(1) 時間）
* メモリ使用もほぼ固定：`string` 結果と一時変数のみ（O(1) 空間）

---

必要であれば、他の例（1994や58など）についても図解可能です。ご希望があればお知らせください。
    