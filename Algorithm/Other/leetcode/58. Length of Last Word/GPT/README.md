了解しました 👍
先ほど提示した TypeScript 実装の各処理を「文字列の走査過程」に沿って図で具体的に説明します。
問題は **「最後の単語の長さを求める」** なので、以下の流れになります。

---

# アルゴリズムの流れ（図解付き）

対象コード：

```ts
function lengthOfLastWord(s: string): number {
    let i: number = s.length - 1;
    let length: number = 0;

    // 1. Skip trailing spaces
    while (i >= 0 && s[i] === ' ') {
        i--;
    }

    // 2. Count characters of the last word
    while (i >= 0 && s[i] !== ' ') {
        length++;
        i--;
    }

    return length;
}
```

---

## 処理 1: 末尾の空白をスキップ

入力例：

```
s = "   fly me   to   the moon  "
```

初期状態：

```
Index:  0   1   2   3   4   5   6   ...   22   23
Char:  ' ' ' ' ' ' 'f' 'l' 'y' ...  'n'  ' '
```

`i = 23` から開始（末尾）。
最後の2文字がスペースなので `i--` を繰り返す。

図（カーソルの動き）：

```
"   fly me   to   the moon  "
                           ↑ i=23 (space → skip)
                          ↑ i=22 (space → skip)
                         ↑ i=21 ('n' → stop)
```

👉 この処理後、`i` は最後の単語 `"moon"` の最後の文字 `'n'` を指す。

---

## 処理 2: 最後の単語の長さをカウント

次の while で `"moon"` を逆方向に走査する。

図：

```
"   fly me   to   the moon  "
                         ↑ i=21 ('n') → length=1
                        ↑ i=20 ('o') → length=2
                       ↑ i=19 ('o') → length=3
                      ↑ i=18 ('m') → length=4
                     ↑ i=17 (' ') → stop
```

👉 カウント終了。
`length = 4`

---

## 処理 3: 結果を返す

```
return 4
```

これが最後の単語 `"moon"` の長さ。

---

# まとめ図（全体フロー）

```mermaid
flowchart TD
    A[Start: i = s.length - 1] --> B{ s[i] == ' ' ? }
    B -- Yes --> B1[ i-- (skip space) ] --> B
    B -- No --> C{ s[i] != ' ' ? }
    C -- Yes --> C1[ length++ , i-- ] --> C
    C -- No --> D[ return length ]
```

---

# 計算量解析

* **時間計算量 O(n)**

  * 最悪の場合（入力が全てスペース + 最後に1単語）、文字列を全走査する。
* **空間計算量 O(1)**

  * `i` と `length` の整数変数のみ利用。

---

✅ このように処理を「末尾の空白を飛ばす → 最後の単語を数える → 終了」という 2 ステップに分けて線形時間で解決しています。
