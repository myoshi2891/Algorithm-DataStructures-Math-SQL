## JavaScriptにおける再帰（Recursion）

**再帰（Recursion）** とは、関数が自分自身を呼び出して問題を解決する手法のことです。再帰を適切に活用すると、特定のアルゴリズムを簡潔に記述できます。

---

## 1. **基本的な再帰の構造**

再帰関数は **ベースケース（終了条件）** と **再帰呼び出し** の2つの要素で構成されます。

### **基本形**

```javascript
function recursiveFunction(param) {
    if (ベースケース) {
        return 結果;
    }
    return recursiveFunction(新しい引数);
}
```

---

## 2. **具体例：階乗（Factorial）の計算**

階乗（n!）は、以下のように定義されます：
\[
n! = n \times (n-1) \times (n-2) \times \dots \times 1
\]

- ベースケース： \(0! = 1\)
- 再帰関数： \(n! = n \times (n-1)!\)

### **実装**

```javascript
function factorial(n) {
    if (n === 0) {
        return 1; // ベースケース
    }
    return n * factorial(n - 1); // 再帰呼び出し
}

console.log(factorial(5)); // 120
```

---

## 3. **フィボナッチ数列**

フィボナッチ数列は、次のように定義されます：
\[
F(n) = F(n-1) + F(n-2)
\]

- ベースケース： \(F(0) = 0, F(1) = 1\)
- 再帰関数： \(F(n) = F(n-1) + F(n-2)\)

### **実装**

```javascript
function fibonacci(n) {
    if (n === 0) return 0;
    if (n === 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(6)); // 8
```

⚠️ **問題点**  
この実装では **重複計算** が発生し、指数時間 **O(2ⁿ)** になってしまうため、効率が悪い。

**メモ化（Memoization）** を使うと改善できます。

### **最適化（メモ化を使用）**

```javascript
function fibonacciMemo(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n === 0) return 0;
    if (n === 1) return 1;
    memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
    return memo[n];
}

console.log(fibonacciMemo(50)); // 高速に結果を得られる
```

これで計算量が **O(n)** に改善されます。

---

## 4. **再帰を用いた探索アルゴリズム**

### **二分探索（Binary Search）**

ソート済み配列を対象に、効率的に値を探索するアルゴリズムです。  
**計算量：O(log n)**

#### **手順**

1. 配列の中央要素を確認する
2. 探したい値が中央より小さければ左半分を探索
3. 大きければ右半分を探索
4. 見つかるか、範囲がなくなるまで繰り返す

#### **実装**

```javascript
function binarySearch(arr, target, left = 0, right = arr.length - 1) {
    if (left > right) return -1; // ベースケース（見つからなかった）

    let mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid; // 見つかった
    if (arr[mid] > target) return binarySearch(arr, target, left, mid - 1);
    return binarySearch(arr, target, mid + 1, right);
}

const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(sortedArray, 7)); // 3
console.log(binarySearch(sortedArray, 2)); // -1
```

**ポイント**

- 配列の中央要素を確認することで **探索範囲を半分** に減らせる。
- ループを使わず、再帰でシンプルに記述。

---

## 5. **再帰を用いたデータ構造操作**

### **再帰で木（Tree）を探索**

ツリー構造の探索に再帰が便利です。

#### **ツリー構造**

```javascript
const tree = {
    value: 1,
    children: [
        {
            value: 2,
            children: [
                { value: 4, children: [] },
                { value: 5, children: [] },
            ],
        },
        {
            value: 3,
            children: [
                { value: 6, children: [] },
                { value: 7, children: [] },
            ],
        },
    ],
};
```

#### **深さ優先探索（DFS）**

```javascript
function dfs(node) {
    console.log(node.value); // 現在のノードを処理
    for (let child of node.children) {
        dfs(child); // 再帰呼び出し
    }
}

dfs(tree);
// 出力: 1, 2, 4, 5, 3, 6, 7（深さ優先）
```

ツリーの各ノードを再帰的にたどることで、簡潔なコードで探索が可能。

---

## 6. **まとめ**

✅ **再帰のポイント**

- **終了条件（ベースケース）** を明確に定義する
- **状態の変化**（引数や変数）を適切に更新する
- **無限ループを防ぐためにベースケースを適切に設計する**

✅ **どんなときに使う？**

- 階乗やフィボナッチのような数学的問題
- 二分探索のような分割統治アルゴリズム
- ツリーやグラフなどのデータ構造の探索

---

### **🛠 再帰とループ、どちらを使うべき？**

| **比較項目**               | **再帰（Recursion）**          | **ループ（Iteration）** |
| -------------------------- | ------------------------------ | ----------------------- |
| **可読性**                 | シンプルで分かりやすい         | 複雑になりがち          |
| **パフォーマンス**         | 関数呼び出しコストがある       | 一般的に高速            |
| **適用範囲**               | ツリー・グラフ・数学的問題向き | 反復処理に適している    |
| **スタックオーバーフロー** | 発生する可能性あり             | なし                    |

💡 **基本的にループの方が効率的ですが、再帰はツリーや探索系の処理で便利！**

## **JavaScriptにおける再帰とメモ化（Memoization）**

### **1. メモ化とは？**

**メモ化（Memoization）** は、関数の実行結果をキャッシュ（保存）して、同じ計算を繰り返さないようにする最適化手法です。  
再帰処理では同じ関数が何度も呼び出されることが多いため、メモ化を使うことで**計算量を大幅に削減**できます。

---

## **2. メモ化が必要な理由**

例えば、**フィボナッチ数列**を単純な再帰で計算すると、同じ値を何度も計算するため非効率になります。

### **(1) メモ化なし（非効率）**

```javascript
function fibonacci(n) {
    if (n === 0) return 0;
    if (n === 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(6)); // 8
```

このコードは、指数時間 **O(2ⁿ)** の計算量になります。  
例えば `fibonacci(6)` を呼び出すと、以下のような**重複計算**が発生します。

```
fibonacci(6)
 ├── fibonacci(5)
 │   ├── fibonacci(4)
 │   │   ├── fibonacci(3)
 │   │   │   ├── fibonacci(2)
 │   │   │   │   ├── fibonacci(1) → 1
 │   │   │   │   ├── fibonacci(0) → 0
 │   │   │   ├── fibonacci(1) → 1  ← 重複計算
 │   │   ├── fibonacci(2) → 1  ← 重複計算
 │   ├── fibonacci(3) → 2  ← 重複計算
 ├── fibonacci(4) → 3  ← 重複計算
```

このように `fibonacci(3)` や `fibonacci(2)` が何度も計算されるため、非常に無駄が多くなります。

---

## **3. メモ化を使った最適化**

メモ化を使うと、一度計算した結果を保存し、**同じ計算を繰り返さない** ようにできます。

### **(2) メモ化あり（効率的）**

```javascript
function fibonacciMemo(n, memo = {}) {
    if (n in memo) return memo[n]; // すでに計算済みならキャッシュを返す
    if (n === 0) return 0;
    if (n === 1) return 1;

    memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
    return memo[n];
}

console.log(fibonacciMemo(6)); // 8
console.log(fibonacciMemo(50)); // 高速に計算可能
```

### **メモ化のポイント**

✅ `memo` というオブジェクトに計算結果をキャッシュ  
✅ `n in memo` で既に計算済みの値があれば再計算しない  
✅ 計算量が **O(n)** に改善（指数時間 O(2ⁿ) → 線形時間 O(n)）

---

## **4. メモ化を関数でカプセル化**

上の実装では `memo` を毎回引数で渡していますが、**クロージャを使ってメモをカプセル化** すると、よりシンプルになります。

### **(3) クロージャを利用**

```javascript
function memoizedFibonacci() {
    let memo = {};
    return function fib(n) {
        if (n in memo) return memo[n];
        if (n === 0) return 0;
        if (n === 1) return 1;

        memo[n] = fib(n - 1) + fib(n - 2);
        return memo[n];
    };
}

const fib = memoizedFibonacci(); // メモ化関数を作成
console.log(fib(6)); // 8
console.log(fib(50)); // 高速
```

この方法では、`memo` が関数のスコープ内に保持され、外部から操作されることがなくなります。

---

## **5. 汎用的なメモ化関数**

メモ化を**汎用的な関数**として定義すると、どんな関数でもメモ化できます。

### **(4) 汎用メモ化関数**

```javascript
function memoize(fn) {
    let cache = {};
    return function (...args) {
        let key = JSON.stringify(args);
        if (key in cache) return cache[key];
        cache[key] = fn(...args);
        return cache[key];
    };
}

// 使用例：フィボナッチ数列
const fibonacciMemoized = memoize(function fibonacci(n) {
    if (n === 0) return 0;
    if (n === 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacciMemoized(6)); // 8
console.log(fibonacciMemoized(50)); // 高速
```

### **この方法のメリット**

✅ **どんな関数でもメモ化できる**  
✅ **複数の引数にも対応可能**

---

## **6. メモ化の適用例**

### **(1) 再帰で計算するパス数（動的計画法）**

**問題:** `m × n` のグリッドを左上から右下へ移動するとき、右または下にしか進めない場合の経路数を求める。

#### **メモ化なし（遅い）**

```javascript
function gridTraveler(m, n) {
    if (m === 1 && n === 1) return 1;
    if (m === 0 || n === 0) return 0;
    return gridTraveler(m - 1, n) + gridTraveler(m, n - 1);
}

console.log(gridTraveler(18, 18)); // 遅い
```

⚠️ **指数時間 O(2ⁿ⁺ᵐ) で非常に遅い**

#### **メモ化あり（高速）**

```javascript
function gridTravelerMemo(m, n, memo = {}) {
    let key = `${m},${n}`;
    if (key in memo) return memo[key];
    if (m === 1 && n === 1) return 1;
    if (m === 0 || n === 0) return 0;

    memo[key] = gridTravelerMemo(m - 1, n, memo) + gridTravelerMemo(m, n - 1, memo);
    return memo[key];
}

console.log(gridTravelerMemo(18, 18)); // 一瞬で計算完了！
```

💡 **メモ化を使うことで計算量が O(m × n) に改善され、1000倍以上速くなる！**

---

## **7. まとめ**

✅ **メモ化（Memoization）とは？**  
➡ 計算結果を保存し、**同じ計算を繰り返さない** 最適化手法

✅ **再帰と相性が良い**  
➡ フィボナッチ数列やグリッド移動問題など、**重複計算が多い場合に有効**

✅ **メモ化の方法**

1. **手動でオブジェクト（memo）を利用**
2. **クロージャでカプセル化**
3. **汎用メモ化関数を作る**

✅ **計算量の改善**

- **O(2ⁿ)（指数時間） → O(n)（線形時間）**
- 例：`fibonacci(50)` は **メモ化なしで数秒 → メモ化ありで即時計算**

💡 **再帰を使うときは、メモ化を検討すると大幅にパフォーマンスが向上する！**
