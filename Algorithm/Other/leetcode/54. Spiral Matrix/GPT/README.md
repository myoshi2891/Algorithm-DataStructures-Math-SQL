
## 🎓 Spiral Order 解法（教材版）

### 1. 問題設定

与えられた `m x n` の行列を **外側から内側に向かってぐるぐる回る順番（スパイラル順）で出力する**。

---

### 2. 解法の直感

* 四方向（右・下・左・上）を繰り返す。
* **上下左右の境界線（境界ポインタ）** を更新して、探索範囲を少しずつ狭めていく。

---

### 3. 図解ステップ

#### 📌 例: `matrix = [[1,2,3],[4,5,6],[7,8,9]]`

初期状態（境界を赤で示す）：

```
top = 0, bottom = 2
left = 0, right = 2
```

```
[ 1,  2,  3 ]   ← 右へ
[ 4,  5,  6 ]
[ 7,  8,  9 ]
```

---

**Step 1. → （上端を左→右へ走査）**

```
出力: [1, 2, 3]
```

次に `top++` → `top = 1`

```
       right=2
top=1 ↓     ↑
      [ 4,  5,  6 ]
      [ 7,  8,  9 ]
```

---

**Step 2. ↓ （右端を上→下へ走査）**

```
出力: [1, 2, 3, 6, 9]
```

次に `right--` → `right = 1`

```
left=0      right=1
↓              ↑
[ 4,  5 ]  
[ 7,  8 ]
```

---

**Step 3. ← （下端を右→左へ走査）**

```
出力: [1, 2, 3, 6, 9, 8, 7]
```

次に `bottom--` → `bottom = 1`

```
left=0     right=1
↓             ↑
[ 4,  5 ]
```

---

**Step 4. ↑ （左端を下→上へ走査）**

```
出力: [1, 2, 3, 6, 9, 8, 7, 4]
```

次に `left++` → `left = 1`

---

**Step 5. 中央処理**

残った `5` を右方向に追加：

```
出力: [1, 2, 3, 6, 9, 8, 7, 4, 5]
```

完了 ✅

---

### 4. TypeScript 実装

```typescript
/**
 * spiralOrder
 * @param matrix - 2次元配列 (m x n)
 * @returns number[] - 行列をスパイラル順に並べた配列
 *
 * 計算量: O(m * n) → 各要素を一度だけ訪問
 * メモリ: O(1) → 出力以外の追加メモリは定数
 */
function spiralOrder(matrix: number[][]): number[] {
    const result: number[] = [];
    let top = 0, bottom = matrix.length - 1;
    let left = 0, right = matrix[0].length - 1;

    while (top <= bottom && left <= right) {
        // → 上端
        for (let col = left; col <= right; col++) {
            result.push(matrix[top][col]);
        }
        top++;

        // ↓ 右端
        for (let row = top; row <= bottom; row++) {
            result.push(matrix[row][right]);
        }
        right--;

        if (top <= bottom) {
            // ← 下端
            for (let col = right; col >= left; col--) {
                result.push(matrix[bottom][col]);
            }
            bottom--;
        }

        if (left <= right) {
            // ↑ 左端
            for (let row = bottom; row >= top; row--) {
                result.push(matrix[row][left]);
            }
            left++;
        }
    }
    return result;
}
```

---

### 5. 学習者が理解を深める工夫（インタラクティブ要素）

* ✅ 各ステップで **境界(top, bottom, left, right)** がどう動くかアニメーションで見せる
* ✅ 出力リストが **どのタイミングで更新されるか** を色付きで示す
* ✅ 小さい行列（例: 2x2, 3x3, 3x4）を実際に入力して実行 → ステップを手で追える

---

👉 この形式にすると「ただコードを読む」ではなく「図と境界の動き」で直感的に理解でき、教材として効果的になります。

