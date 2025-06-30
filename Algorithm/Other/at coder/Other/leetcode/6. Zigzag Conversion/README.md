
```ts
function convert(s: string, numRows: number): string {
    if (numRows === 1 || s.length <= numRows) return s;

    const rows: string[] = Array(Math.min(numRows, s.length)).fill("");
    let currentRow = 0;
    let goingDown = false;

    for (const char of s) {
        rows[currentRow] += char;

        // 一番上または一番下に到達したら方向を反転
        if (currentRow === 0 || currentRow === numRows - 1) {
            goingDown = !goingDown;
        }

        currentRow += goingDown ? 1 : -1;
    }

    return rows.join("");
}
```

---

### 🔍 実行例:

#### 入力1:

```ts
console.log(convert("PAYPALISHIRING", 3));
```

出力:

```
"PAHNAPLSIIGYIR"
```

#### 入力2:

```ts
console.log(convert("PAYPALISHIRING", 4));
```

出力:

```
"PINALSIGYAHRPI"
```

#### 入力3:

```ts
console.log(convert("A", 1));
```

出力:

```
"A"
```

---

### 🧠 アルゴリズムの考え方（図付き）

例: `s = "PAYPALISHIRING", numRows = 4`

```
P     I    N
A   L S  I G
Y A   H R
P     I
```

* 各文字を1文字ずつ `rows[]` に追加
* 上から下に移動し、最下段に達したら反転して上に戻るというパターン
* 方向はフラグ `goingDown` で管理

---