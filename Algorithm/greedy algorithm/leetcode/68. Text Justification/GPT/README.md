# Text Justification 解説 (TypeScript)

> LeetCode #68 - Text Justification の TypeScript 実装と詳細解説

## 目次

- 問題概要
- 実装コード (TypeScript)
- 処理の流れ解析
- 計算量
- 関連問題

## 問題概要

**難易度**: Hard
**カテゴリ**: Greedy Algorithm, String Manipulation

- 単語の配列 `words` と幅 `maxWidth` が与えられる
- 各行を **最大幅に揃えて (Justify)** 出力する
- 各行は以下の条件を満たす:

  1. 各行の文字数はちょうど `maxWidth`
  2. 両端揃えになるようにスペースを調整する
  3. 最終行は左寄せ、右はスペースで埋める

## 実装コード (TypeScript)

````ts
/**
 * @param words - 単語の配列
 * @param maxWidth - 各行の最大幅
 * @returns 揃えられた文字列配列
 */
export function fullJustify(
  words: readonly string[],
  maxWidth: number
): string[] {
  const result: string[] = [];
  let line: string[] = [];
  let lineLength = 0;

  for (const word of words) {
    // 次の単語を追加して maxWidth を超える場合、行を確定する
    if (lineLength + word.length + line.length > maxWidth) {
      let spaces = maxWidth - lineLength;
      for (let i = 0; i < spaces; i++) {
        line[i % (line.length - 1 || 1)] += " ";
      }
      result.push(line.join(""));
      line = [];
      lineLength = 0;
    }
    line.push(word);
    lineLength += word.length;
  }

  // 最終行 (左寄せ + 右側スペース詰め)
  result.push(
    line.join(" ") + " ".repeat(maxWidth - lineLength - (line.length - 1))
  );
  return result;
}
```

TypeScript で書いた `fullJustify` の解法を **GitHub README.md 向けの解説ドキュメント**としてまとめます。
以下ではコードと一緒に **図 (Mermaid + ASCII)** を交えて、「どうやって文字列を詰めていくか」をステップごとに解析します。

---

# Text Justification 解説 (TypeScript)

## 問題概要

- 単語の配列 `words` と幅 `maxWidth` が与えられる
- 各行を **最大幅に揃えて (Justify)** 出力する
- 各行は以下の条件を満たす:

  1. 各行の文字数はちょうど `maxWidth`
  2. 両端揃えになるようにスペースを調整する
  3. 最終行は左寄せ、右はスペースで埋める

---

## 実装コード (TypeScript)

```ts
/**
 * @param words - 単語の配列
 * @param maxWidth - 各行の最大幅
 * @returns 揃えられた文字列配列
 */
export function fullJustify(
  words: readonly string[],
  maxWidth: number
): string[] {
  const result: string[] = [];
  let line: string[] = [];
  let lineLength = 0;

  for (const word of words) {
    // 次の単語を追加して maxWidth を超える場合、行を確定する
    if (lineLength + word.length + line.length > maxWidth) {
      let spaces = maxWidth - lineLength;
      for (let i = 0; i < spaces; i++) {
        line[i % (line.length - 1 || 1)] += " ";
      }
      result.push(line.join(""));
      line = [];
      lineLength = 0;
    }
    line.push(word);
    lineLength += word.length;
  }

  // 最終行 (左寄せ + 右側スペース詰め)
  result.push(
    line.join(" ") + " ".repeat(maxWidth - lineLength - (line.length - 1))
  );
  return result;
}
````

---

## 処理の流れ解析

### 1. 行に単語を追加

- 1 行に入る単語を **line\[]** に追加していく
- もし次の単語を追加すると `maxWidth` を超える → 行を確定

```mermaid
graph TD
  A[新しい単語を読む] --> B{lineLength + word.length + line.length > maxWidth ?}
  B -- No --> C[単語を追加<br>line.push(word)]
  B -- Yes --> D[行を確定<br>スペース調整]
  D --> E[行を result に追加]
  C --> A
  E --> A
```

---

### 2. スペースの均等割り振り

例えば次の入力を考える:

```text
words = ["This", "is", "an", "example", "of", "text", "justification."]
maxWidth = 16
```

#### 最初の行候補

```text
["This", "is", "an"]
```

- 合計文字数 = 4 + 2 + 2 = 8
- 空き = 16 - 8 = 8
- 単語の区切り = 2 箇所
- 各区切りに順番にスペースを入れていく

```text
This    is    an
```

---

### 3. 最終行処理

最後の行は **左寄せ** + **右スペース埋め**。

例:

```text
["justification."]
```

- 合計文字数 = 14
- 右に `"  "` (2 スペース) を追加

```text
justification.
```

---

## 出力例

入力:

```ts
const words = ["This", "is", "an", "example", "of", "text", "justification."];
const maxWidth = 16;
console.log(fullJustify(words, maxWidth));
```

出力:

```ts
["This    is    an", "example  of text", "justification.  "];
```

---

## ASCII 図による可視化

```makefile
行1: |This|----|is|----|an|
      ^^^^^    ^^^^    ^^^
      4文字    2文字   2文字
      残り8文字を均等に → "This    is    an"

行2: |example|--|of|--|text|
      7文字   2文字  4文字
      残り3文字を割り振り → "example  of text"

行3: |justification.|␣␣
      14文字 + 右2スペース
```

---

## まとめ

- 単語を **1 行ずつ貪欲に追加**
- 行が埋まったら **残りのスペースを均等に割り振り**
- **最後の行は左寄せ**にする
  → これで LeetCode #68 **Text Justification** が解けます ✅

---
