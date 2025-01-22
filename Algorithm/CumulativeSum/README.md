累積和（Cumulative Sum）とは、ある配列の各要素について、それまでの要素を全て加算した結果を新しい配列として得る操作のことです。たとえば、入力の配列が `[1, 2, 3, 4]` の場合、累積和を計算すると `[1, 3, 6, 10]` となります。

JavaScriptで累積和を計算する方法を以下に示します。

### 基本的なコード例

```javascript
function cumulativeSum(array) {
    let result = [];
    let sum = 0;

    for (let i = 0; i < array.length; i++) {
        sum += array[i];
        result.push(sum);
    }

    return result;
}

// 使用例
const arr = [1, 2, 3, 4];
console.log(cumulativeSum(arr)); // [1, 3, 6, 10]
```

### `map` メソッドを用いた方法

JavaScriptの`map`メソッドを使うと、より簡潔に記述できます。

```javascript
function cumulativeSum(array) {
    let sum = 0;
    return array.map(num => sum += num);
}

// 使用例
const arr = [1, 2, 3, 4];
console.log(cumulativeSum(arr)); // [1, 3, 6, 10]
```

### 解説

1. **ループを用いた方法**  
   配列をループで走査し、`sum`に現在の要素を加算しながら、新しい配列`result`に追加していきます。`sum`が累積的に値を保持します。

2. **`reduce`を用いた方法**  
   `reduce`で現在の合計を保持しつつ、`map`で各ステップの累積和を返します。短いコードで記述可能ですが、`reduce`や`map`に慣れていない場合は少し難しく感じるかもしれません。

### 応用例
負の数や空配列の場合にも対応した例を挙げます。

```javascript
function cumulativeSum(array) {
    if (array.length === 0) return [];
    let sum = 0;
    return array.map(num => sum += num);
}

// 負の数を含む例
console.log(cumulativeSum([-1, 2, -3, 4])); // [-1, 1, -2, 2]

// 空配列の場合
console.log(cumulativeSum([])); // []
```

### 累積和の用途
- 数値データの分析
- グラフやヒストグラムの描画
- 配列から特定範囲の合計を効率よく計算する場合（差分の利用）

必要に応じて、詳細な実装や追加の応用例についてもお手伝いできます！