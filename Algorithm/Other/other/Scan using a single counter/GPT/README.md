# 括弧列判定アルゴリズム

## 1. 問題概要

与えられた括弧列 `S` が **正しい括弧列** かを判定する。

- **正しい括弧列の定義**
    1. 空文字は正しい。
    2. `s` が正しいなら `(s)` も正しい。
    3. `s, t` が正しいなら `st` も正しい。

例:
✅ `()` , `(())` , `()()` , `(()())`
❌ `)(` , `((` , `())` , `(()`

---

## 2. アルゴリズムの流れ

### 概要

- 開き括弧 `(` を見たら **+1**
- 閉じ括弧 `)` を見たら **-1**
- 途中でカウンタが **負** になったら不正
- 最後にカウンタが **0** なら正しい括弧列

---

### 処理フロー（テキスト図）

```text
入力 S を左から右へ走査
         │
         ▼
   各文字 c を判定
         │────────────────────│
 ┌───────┴─────────┐  ┌───────┴─────────┐
 │ ( の場合         │  │ ) の場合         │
 │ balance++       │  │ balance--       │
 └───────┬─────────┘  └───────┬─────────┘
         └───────┬────────────┘
                 │
            balance < 0 ?
            │
            ├──Yes → "No"（不正確定）
            │
            └──No  → 続行
```

最終的に：

```text
balance == 0 → "Yes"
balance != 0 → "No"
```

---

## 3. 入力例と動作イメージ

### 例 1

```text
入力: (())
初期 balance = 0
( → balance = 1
( → balance = 2
) → balance = 1
) → balance = 0
終了 → balance=0 → Yes
```

### 例 2

```text
入力: )(
初期 balance = 0
) → balance = -1 （負になった！）
即座に "No"
```

---

## 4. 実装方針

- **計算量**: O(N) （1 回の走査）
- **メモリ**: O(1) （整数カウンタのみ）
- **実装構成**
    - Pure Function `isValidParentheses`
    - 入力/出力を担当する `main`

---

## 5. コード（solution.js）

```js
'use strict';

/**
 * 正しい括弧列かを判定する Pure Function
 * @param {string} s - 入力括弧列
 * @returns {boolean} 正しい括弧列なら true, そうでなければ false
 * @throws {TypeError} 入力が文字列でない場合
 * @throws {RangeError} 長さが 1 <= N < 50000 を満たさない場合
 * @complexity 時間 O(N), 空間 O(1)
 */
function isValidParentheses(s) {
    if (typeof s !== 'string') throw new TypeError('Input must be string');
    const n = s.length;
    if (n < 1 || n >= 50000) throw new RangeError('String length out of range');

    let balance = 0;
    for (let i = 0; i < n; i++) {
        const ch = s[i];
        if (ch === '(') {
            balance++;
        } else if (ch === ')') {
            balance--;
        } else {
            throw new TypeError('Invalid character in input');
        }
        if (balance < 0) return false; // 閉じすぎ
    }
    return balance === 0;
}

/**
 * メイン処理 (標準入力/標準出力)
 */
function main() {
    const input = require('fs').readFileSync(0, 'utf8').trim().split('\n');
    const n = parseInt(input[0], 10);
    const s = input[1];
    if (s.length !== n) {
        throw new RangeError('Input length does not match N');
    }

    const result = isValidParentheses(s);
    console.log(result ? 'Yes' : 'No');
}

if (require.main === module) {
    main();
}

module.exports = { isValidParentheses };
```

---

## 6. まとめ

- **競技プログラミング視点**: O(N), O(1) で最速
- **業務開発視点**: Pure Function + 入力検証 + JSDoc で保守性担保
- **JavaScript 最適化**:
    - 配列やスタックを使わず整数カウンタのみ
    - GC 負荷最小
    - `for` ループによる安定した処理

---
