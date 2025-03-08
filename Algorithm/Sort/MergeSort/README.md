### **Merge Sortとは？**
Merge Sort（マージソート）は、「分割統治法（Divide and Conquer）」に基づいたソートアルゴリズムです。配列を再帰的に分割し、小さい部分ごとにソートした後、統合（マージ）して最終的にソートされた配列を作成します。

### **Merge Sortの手順**
1. **分割 (Divide)**  
   - 配列を中央で分割し、左半分と右半分の2つの部分配列にする。
   - それぞれの部分配列を再帰的にMerge Sortする。

2. **統治 (Conquer)**  
   - 各部分配列が1つの要素になるまで分割を続ける。
   - 2つの部分配列をマージしてソートされた状態にする。

3. **結合 (Combine)**  
   - 2つのソートされた部分配列を1つのソート済み配列に統合する。

---

### **JavaScriptでのMerge Sort実装**
```javascript
function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    // 配列の中央を見つける
    const mid = Math.floor(arr.length / 2);
    
    // 左右に分割
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    // 再帰的にソート
    return merge(mergeSort(left), mergeSort(right));
}

// 2つのソート済み配列をマージする関数
function merge(left, right) {
    let result = [];
    let i = 0, j = 0;

    // 2つの配列を比較しながらマージ
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    // 残りの要素を追加
    return result.concat(left.slice(i)).concat(right.slice(j));
}

// 動作確認
const arr = [38, 27, 43, 3, 9, 82, 10];
console.log(mergeSort(arr)); 
// 出力: [3, 9, 10, 27, 38, 43, 82]
```

---

### **Merge Sortの計算量**
- **最悪・平均ケースの時間計算量**：O(n log n)
- **最良ケース（すでにソート済み）**：O(n log n)
- **空間計算量**：O(n)（新しい配列を作成するため）

---

### **Merge Sortの特徴**
✅ **安定ソート**（同じ値の相対的な順序を保持する）  
✅ **最悪でもO(n log n)の時間計算量**（常に高速）  
❌ **空間計算量がO(n)と大きい**（新しい配列を作成するため）  

---

### **応用**
もし、**メモリを節約したい**場合は「**インプレースマージソート**」という方法もありますが、一般的なマージソートより実装が複雑になります。