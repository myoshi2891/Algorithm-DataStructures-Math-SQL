## **A11解法の概要**
以下、二分探索を用いた JavaScript の実装です。  
`binarySearch` 関数を用いて `X` の位置を求め、1-based index で出力します。
```javascript
function binarySearch(arr, x) {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] === x) {
            return mid + 1; // 1-based index
        } else if (arr[mid] < x) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1; // 通常ここには到達しない（Xは必ず存在する）
}

function main() {
    const fs = require("fs");
    const input = fs.readFileSync("/dev/stdin", "utf8").trim().split("\n");
    const [N, X] = input[0].split(" ").map(Number);
    const A = input[1].split(" ").map(Number);
    
    console.log(binarySearch(A, X));
}

main();
```
### 実装のポイント
- **二分探索**: 配列 `A` はソート済みなので、二分探索 (`binarySearch`) を用いて `X` の位置を高速に見つける。
- **1-based index**: 出力は1-based index のため、`mid + 1` を返す。
- **入力処理**: `fs.readFileSync("/dev/stdin", "utf8")` で標準入力を取得し、改行で分割。

### 計算量
- 二分探索の計算量は **O(log N)** であり、最大 `N=100000` でも十分高速。

## **A12解法の概要**
1. **最小の時間**: 1秒
2. **最大の時間**: \( K \times \min(A) \)（最速のプリンターがすべて印刷する場合）
3. **二分探索** を使い、「ある時間 \( T \) において K 枚以上のチラシが印刷されるか？」を判定する

この判定を効率よく行い、最小の \( T \) を求めます。

---

## **JavaScript の実装**
以下は **二分探索** を用いた実装です。

```javascript
function findPrintTime(N, K, A) {
    let left = 1, right = K * Math.min(...A);

    const canPrintKSheets = (T) => {
        let totalSheets = 0;
        for (let i = 0; i < N; i++) {
            totalSheets += Math.floor(T / A[i]);
            if (totalSheets >= K) return true; // K 枚以上印刷できるならOK
        }
        return false;
    };

    while (left < right) {
        let mid = Math.floor((left + right) / 2);
        if (canPrintKSheets(mid)) {
            right = mid; // K 枚以上印刷できるなら、もっと小さい時間を探す
        } else {
            left = mid + 1; // K 枚印刷できないなら、もっと時間が必要
        }
    }

    console.log(left);
}

// 標準入力の処理
const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

let input = [];
rl.on("line", (line) => {
    input.push(line.trim());
}).on("close", () => {
    const N = parseInt(input[0]);
    const K = parseInt(input[1]);
    const A = input[2].split(" ").map(Number);
    findPrintTime(N, K, A);
});
```

---

## **解説**
### **1. 二分探索の範囲**
- **最小時間** `left = 1`
- **最大時間** `right = K * min(A)`（最速のプリンターだけが K 枚印刷する場合）

### **2. 判定関数 `canPrintKSheets(T)`**
- ある時間 `T` で **合計何枚のチラシが印刷されるか** を計算
- 各プリンター `i` について `Math.floor(T / A[i])` を足していく
- 合計 `K` 枚以上印刷できれば `true`、できなければ `false`

### **3. 二分探索のロジック**
- `mid = (left + right) / 2` を計算
- `canPrintKSheets(mid)` を評価
  - `true` なら `right = mid`（もっと小さい時間を探す）
  - `false` なら `left = mid + 1`（もっと時間が必要）
- `left == right` になったとき、最小の `T` が求まる

---

## **計算量**
- **判定関数** は **O(N)**
- **二分探索** は **O(log(K × min(A)))**
- **合計計算量** は **O(N log K)** で、高速に求められます。

---

## **テスト**
### **入力**
```
3
7
3 5 7
```
### **出力**
```
9
```
---
### **ポイント**
- 3 秒ごとのプリンター → 3, 6, 9, ...
- 5 秒ごとのプリンター → 5, 10, ...
- 7 秒ごとのプリンター → 7, 14, ...
- **9秒後に7枚目のチラシが出る**ので答えは **9**。

---

## **まとめ**
- **二分探索** を使うと **O(N log K)** で高速に解ける
- **判定関数** で「時間 T で K 枚印刷できるか？」を判定
- **最小の時間** を求めるため、`right = mid` で狭めていく

### **A13解法の概要**
この問題を効率的に解くために、**二分探索（Binary Search）または双方向ポインタ（Two Pointers）** を活用します。  

### **アプローチ**
1. **ソート不要**  
   既に小さい順に並んでいるため、ソート処理は不要です。
2. **二分探索を使用する方法**  
   各 `A[i]` について、`A[i] + K` 以下の最大の `j` を **二分探索** で求め、`i < j` となるペア数を加算する。
3. **双方向ポインタを使用する方法**  
   - `i` を左ポインタ、`j` を右ポインタとして探索  
   - `A[j] - A[i] > K` なら `i` を進める  
   - `A[j] - A[i] ≤ K` なら `j` を進め、ペア数を計算  

### **実装**
#### **1. 二分探索を使う方法**
`O(N log N)` で解ける。

```javascript
function countPairsBinarySearch(N, K, A) {
    let count = 0;

    for (let i = 0; i < N; i++) {
        let left = i, right = N - 1;
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            if (A[mid] - A[i] <= K) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        count += right - i;
    }

    console.log(count);
}

// 入力例
const [N, K, ...A] = `5 3
1 2 4 5 8`.split(/\s+/).map(Number);
countPairsBinarySearch(N, K, A);
```

#### **2. 双方向ポインタ（Two Pointers）**
こちらも `O(N)` で解ける。

```javascript
function countPairsTwoPointers(N, K, A) {
    let count = 0;
    let j = 0;

    for (let i = 0; i < N; i++) {
        while (j < N && A[j] - A[i] <= K) {
            j++;
        }
        count += (j - i - 1);
    }

    console.log(count);
}

// 入力例
const [N, K, ...A] = `5 3
1 2 4 5 8`.split(/\s+/).map(Number);
countPairsTwoPointers(N, K, A);
```

### **解説**
- `二分探索`：各 `A[i]` に対し、`A[i] + K` 以下の最大の `j` を探し、`O(log N)`
- `双方向ポインタ`：`j` を増やしながら `A[j] - A[i] <= K` を満たす最大の `j` を求め、`O(N)`

**`O(N log N)` よりも `O(N)` の双方向ポインタの方が高速** なので、基本的には **双方向ポインタ** を推奨します。