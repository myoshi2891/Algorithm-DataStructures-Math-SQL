## **Radix Sortとは？**
**Radix Sort（基数ソート）** は **非比較ソート** の一種で、数値や文字列の桁ごとにソートを行うアルゴリズムです。  
特に **整数のソート** に適しており、**安定なソート** であることが特徴です。

Radix Sort は **個々の数値の桁（ビット、文字）に注目** して並べ替えを行います。一般的な方法として **LSD（Least Significant Digit）方式** がよく使われます。

## **Radix Sortの流れ**
1. **最大の桁数を求める**（例: 3桁なら最大値は100〜999）
2. **各桁ごとに安定なソート（通常はCounting Sort）を適用**
   - 1の位（最下位桁）から順に並べ替え
   - 10の位、100の位…と桁を増やしていく
3. **最上位桁まで処理を繰り返す**
4. **最終的に並び替えが完了する**

---

## **JavaScriptでの実装**
### **1. ユーティリティ関数**
```javascript
// 指定した桁の値を取得する関数
function getDigit(num, place) {
    return Math.floor(Math.abs(num) / Math.pow(10, place)) % 10;
}

// 数の桁数を取得する関数
function digitCount(num) {
    if (num === 0) return 1;
    return Math.floor(Math.log10(Math.abs(num))) + 1;
}

// 配列内の最大桁数を取得する関数
function mostDigits(nums) {
    let maxDigits = 0;
    for (let num of nums) {
        maxDigits = Math.max(maxDigits, digitCount(num));
    }
    return maxDigits;
}
```

### **2. Radix Sortの実装**
```javascript
function radixSort(nums) {
    let maxDigitCount = mostDigits(nums); // 最大桁数を取得
    
    for (let k = 0; k < maxDigitCount; k++) {
        let digitBuckets = Array.from({ length: 10 }, () => []); // 0~9のバケット

        for (let num of nums) {
            let digit = getDigit(num, k);
            digitBuckets[digit].push(num);
        }

        nums = [].concat(...digitBuckets); // バケットを結合
    }
    
    return nums;
}

// 使用例
const arr = [170, 45, 75, 90, 802, 24, 2, 66];
console.log(radixSort(arr)); // [2, 24, 45, 66, 75, 90, 170, 802]
```

---

## **Radix Sortの計算量**
- **時間計算量（Time Complexity）**:
  - **O(nk)**（`n` = 要素数, `k` = 最大桁数）
  - `k` が **log(n) 以下** である限り、**O(n log n) に近い** 速度を保つ
  - **整数データにおいて非常に高速**
- **空間計算量（Space Complexity）**:
  - **O(n + k)**（バケット用の追加配列を使用）

---

## **Radix Sortの特徴**
✅ **整数のソートに特化**（比較ソートではない）  
✅ **安定ソート**（同じ値の順番が保持される）  
✅ **O(n) に近い計算量**（比較ソートの O(n log n) より速い場合がある）  
❌ **負の数には追加の処理が必要**（符号を考慮する必要がある）  
❌ **浮動小数点や文字列には適用が難しい**（基数を調整する必要がある）  

---

## **負の数に対応する**
Radix Sort は通常 **非負整数** にしか適用できません。  
負の数を扱うには **正の数と負の数を分けて処理** する必要があります。

```javascript
function radixSortWithNegatives(nums) {
    let positives = nums.filter(num => num >= 0);
    let negatives = nums.filter(num => num < 0).map(num => Math.abs(num));
    
    positives = radixSort(positives);
    negatives = radixSort(negatives).reverse(); // 負の数は逆順にする
    
    return negatives.map(num => -num).concat(positives);
}

// 使用例
const arr = [170, -45, 75, -90, 802, 24, 2, -66];
console.log(radixSortWithNegatives(arr)); // [-90, -66, -45, 2, 24, 75, 170, 802]
```

---

## **まとめ**
- **Radix Sortは整数のソートに最適**（非比較ソート）
- **安定ソート** で、O(n) に近い計算量で動作
- **負の数は追加処理が必要**
- **浮動小数点や文字列のソートには工夫が必要**

Radix Sort は、データが大きく桁数が限られている場合に特に有効なソートアルゴリズムです。