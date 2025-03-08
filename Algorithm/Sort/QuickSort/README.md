## **Quick Sort（クイックソート）とは？**
Quick Sortは「分割統治法（Divide and Conquer）」を用いたソートアルゴリズムの一種で、高速なソートが可能です。  
平均計算量が **O(n log n)** であり、一般的に高速なソート手法として知られています。

---

## **クイックソートのアルゴリズム**
1. **基準値（Pivot）を選択**: 配列の中から基準となる値（Pivot）を選ぶ。
2. **分割（Partition）**: Pivot を基準に、  
   - **小さい値のグループ（左側）**
   - **大きい値のグループ（右側）**  
   に分ける。
3. **再帰的にソート**: 左側と右側のグループをそれぞれ Quick Sort で再帰的にソートする。
4. **統合**: 最終的にソート済みの部分を結合して完成。

---

## **JavaScriptでのクイックソート実装**

### **1. シンプルなクイックソート**
配列を分割して新しい配列を作成する実装。

```javascript
function quickSort(arr) {
    if (arr.length <= 1) return arr; // 要素が1つ以下ならそのまま返す

    const pivot = arr[Math.floor(arr.length / 2)]; // 基準値（配列の中央を選択）
    const left = arr.filter(num => num < pivot); // Pivotより小さい要素
    const middle = arr.filter(num => num === pivot); // Pivotと同じ要素
    const right = arr.filter(num => num > pivot); // Pivotより大きい要素

    return [...quickSort(left), ...middle, ...quickSort(right)]; // 再帰的にソート
}

const arr = [3, 6, 8, 10, 1, 2, 1];
console.log(quickSort(arr)); // [1, 1, 2, 3, 6, 8, 10]
```

---

### **2. インプレース（in-place）なクイックソート**
**追加の配列を作らず、配列内で直接ソートする（空間計算量 O(1)）**
```javascript
function quickSortInPlace(arr, left = 0, right = arr.length - 1) {
    if (left >= right) return; // 要素が1つなら終了

    const pivotIndex = partition(arr, left, right); // 分割処理
    quickSortInPlace(arr, left, pivotIndex - 1); // 左側を再帰的にソート
    quickSortInPlace(arr, pivotIndex + 1, right); // 右側を再帰的にソート
}

function partition(arr, left, right) {
    const pivot = arr[right]; // 右端の要素をPivotとする
    let i = left; // 小さい要素を配置する位置

    for (let j = left; j < right; j++) {
        if (arr[j] < pivot) {
            [arr[i], arr[j]] = [arr[j], arr[i]]; // 交換
            i++;
        }
    }
    [arr[i], arr[right]] = [arr[right], arr[i]]; // Pivotを正しい位置へ
    return i;
}

const arr = [3, 6, 8, 10, 1, 2, 1];
quickSortInPlace(arr);
console.log(arr); // [1, 1, 2, 3, 6, 8, 10]
```

---

## **クイックソートの計算量**
| ケース | 計算量 |
|--------|--------|
| **最良** | O(n log n) |
| **平均** | O(n log n) |
| **最悪** | O(n²)（すでにソートされている配列など） |

*最悪計算量を避けるために、Pivotの選択方法を工夫（ランダム選択や中央値を選ぶなど）すると改善できます。*

---

## **まとめ**
✅ **Quick Sort** は高速なソートアルゴリズムで、平均計算量 **O(n log n)**  
✅ **再帰的に配列を分割し、小さいグループと大きいグループに分けて並べる**  
✅ **配列を新しく作る方法（非破壊）と、配列内で直接ソートする方法（in-place）がある**  
✅ **最悪 O(n²) のケースを防ぐために Pivot の選び方を工夫することが重要**

JavaScriptで実装する場合、`filter()` を使ったシンプルな方法と、`partition()` を用いた **in-place ソート** の両方を使い分けるのが良い。