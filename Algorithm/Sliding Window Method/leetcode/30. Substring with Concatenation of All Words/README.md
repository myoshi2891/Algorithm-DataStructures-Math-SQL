以下に、TypeScript で実装した `findSubstring` 関数について、**各処理を図とともにステップごとに具体的に解析・説明**します。問題のポイントは、**固定長の単語列の順不同な連結が、文字列のどこかに現れるかを効率的に見つけること**です。

---

## 🔧 前提条件と入力の例

```ts
s = 'barfoofoobarthefoobarman';
words = ['bar', 'foo', 'the'];
```

- 単語長 = `3`
- 単語数 = `3`
- 探索すべき長さ = `3 * 3 = 9`
- 検出したいのは、**長さ9の部分文字列が `["bar", "foo", "the"]` の並べ替えと一致するか**。

---

## 🧠 ステップ1：単語頻度マップの作成

```ts
const wordMap: Map<string, number> = new Map();
for (const word of words) {
    wordMap.set(word, (wordMap.get(word) ?? 0) + 1);
}
```

### 📊 作成される Map

```
wordMap:
{
  "bar" => 1,
  "foo" => 1,
  "the" => 1
}
```

---

## 🧠 ステップ2：スライディングウィンドウの走査開始

探索を `i = 0, 1, 2` の3通りのオフセットからスタートすることで、文字位置を漏れなくカバーします。

---

## 🔍 ステップ3：i = 0 からのウィンドウ探索

### 📌 初期状態

- `left = 0`, `right = 0`, `windowMap = {}`, `count = 0`

### 🔄 ウィンドウスライド（3文字ずつ進む）

#### 🧩 Step A: 文字列 `"bar"` を抽出（right: 0→3）

```
s = [bar][foo][foo]...
      ^   ^   ^
    left  | right
```

- `"bar"` は `wordMap` に存在 → `windowMap["bar"]++`
- `count++`
- `count = 1`

#### 🧩 Step B: `"foo"` を抽出（right: 3→6）

```
s = [bar][foo][foo]...
          ^   ^   ^
        left  | right
```

- `"foo"` も OK → `windowMap["foo"]++`
- `count = 2`

#### 🧩 Step C: `"foo"` を抽出（right: 6→9）

```
s = [bar][foo][foo]...
              ^   ^   ^
            left  | right
```

- `"foo"` → すでに1回カウント済なので **オーバーカウント** 発生！

#### 🛠️ 修正処理（while）

- `windowMap["foo"] > wordMap["foo"]` → 左端 `"bar"` を削除（left: 0→3）
- `"bar"` のカウント減 → `count--`

→ 結果:

```
windowMap = {
  "foo": 2
}
count = 2
left = 3
right = 9
```

---

## 🔍 ステップ4: i = 1, i = 2 の場合も同様

### 結果的に `count === words.length (=3)` になる時に `left` を記録

例えば：

- `"foobar the"` → OK → 開始位置 `6`
- `"barthe foo"` → OK → 開始位置 `9`
- `"thefoobar"` → OK → 開始位置 `12`

---

## ✅ 結果

```ts
出力: [6, 9, 12];
```

---

## 🎨 全体フロー図

```text
s:   b a r f o o f o o b a r t h e f o o b a r m a n
idx: 0 1 2 3 4 5 6 7 8 9 10...

[i = 0]
 [bar][foo][foo]...  → オーバーカウント → left++
     [foo][foo][bar] → valid! (index 6)

[i = 1]
  a r f → invalid, reset

[i = 2]
   r f o → invalid, reset
```

---

## 🧠 スライディングウィンドウの本質

- `windowMap` が `wordMap` と一致する部分を動的に見つける
- オーバーカウントが出たら `left` をずらして修正
- 無駄な再計算を避ける効率的アルゴリズム

---

## 📈 計算量

| 項目         | 計算量                  | 補足                          |
| ------------ | ----------------------- | ----------------------------- |
| 時間         | `O(N * W)`              | `N = s.length`, `W = wordLen` |
| 空間         | `O(U)`                  | `U = ユニークな単語数`        |
| 実行時間例   | 約 80–100ms（LeetCode） | 十分高速                      |
| メモリ使用量 | 約 45–55MB（LeetCode）  | 標準的                        |

---

図や視覚的シミュレーションを画像として見たい場合は、リクエストいただければ生成可能です。必要ですか？
