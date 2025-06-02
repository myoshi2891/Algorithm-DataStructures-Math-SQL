# **JavaScriptで学ぶ部分和問題（Subset Sum Problem）**
  
## **1. 部分和問題とは？**
部分和問題（Subset Sum Problem）は、次のように定義される典型的な **動的計画法（DP）** の問題です。

### **問題の定義**
> `N` 枚のカードがあり、それぞれに整数 `A[i]` が書かれています。  
> これらの中からいくつかを選んで、その合計を `S` にできるかを判定してください。

### **入力**
```
N S
A1 A2 A3 ... AN
```

### **出力**
- `S` を作れるなら `"Yes"`
- 作れないなら `"No"`

---

## **2. 解法の考え方**
### **① 再帰（バックトラッキング）**
各カードに対して、**「選ぶ」or「選ばない」** の2択を試す。

### **② 動的計画法（DP）**
**状態を記録しながら解く** ことで、同じ計算を繰り返さないようにする。

---

## **3. 再帰（バックトラッキング）による解法**
### **考え方**
1. **現在のカードを選ぶ**
2. **現在のカードを選ばない**
3. **残りのカードで `S` を作れるかを再帰的に判定**

### **JavaScript実装**
```javascript
function subsetSumRecursive(N, S, A, index = 0, sum = 0) {
    // ベースケース: 合計が S になったら成功
    if (sum === S) return true;
    // カードをすべて使ったら終了
    if (index >= N) return false;
    
    // カード index を選ばない場合
    if (subsetSumRecursive(N, S, A, index + 1, sum)) return true;

    // カード index を選ぶ場合
    if (subsetSumRecursive(N, S, A, index + 1, sum + A[index])) return true;

    return false;
}

// 入力例
const N = 4, S = 11;
const A = [3, 1, 4, 5];

console.log(subsetSumRecursive(N, S, A) ? "Yes" : "No");
```
### **計算量**
- `O(2^N)` （指数時間） → **`N ≤ 20` ならOK、`N > 20` は厳しい！**

---

## **4. 動的計画法（DP）による解法**
### **考え方**
**DPテーブル `dp[i][j]` を用意して、以下の遷移を考える。**
- `dp[i][j] = true` の場合、**`i` 枚目までのカードを使って `j` を作れる**
- `dp[i][j]` の更新方法：
  1. `dp[i+1][j] = dp[i][j]`（カードを使わない場合）
  2. `dp[i+1][j + A[i]] = dp[i][j]`（カードを使う場合）

---

### **DPテーブルによる解法**
```javascript
function subsetSumDP(N, S, A) {
    let dp = Array.from({ length: N + 1 }, () => Array(S + 1).fill(false));
    dp[0][0] = true; // 何も選ばない場合、0は作れる

    for (let i = 0; i < N; i++) {
        for (let j = 0; j <= S; j++) {
            if (dp[i][j]) {
                dp[i + 1][j] = true; // カードを使わない場合
                if (j + A[i] <= S) {
                    dp[i + 1][j + A[i]] = true; // カードを使う場合
                }
            }
        }
    }

    return dp[N][S] ? "Yes" : "No";
}

// 入力例
const N = 4, S = 11;
const A = [3, 1, 4, 5];

console.log(subsetSumDP(N, S, A));
```
### **計算量**
- `O(N × S)` → **`N ≤ 60, S ≤ 10000` でも間に合う！**

---

## **5. より高速な方法（ビットマスク）**
### **考え方**
- **`N ≤ 60`** ならば、**ビットマスク（bitset）** を使って `O(N × log S)` にできる！
- **ビット演算を使って可能な合計を更新する。**

---

### **ビットマスク（bitset）を使った実装**
```javascript
function subsetSumBitset(N, S, A) {
    let possible = 1n; // ビットセットを整数で管理 (BigInt)
    
    for (let i = 0; i < N; i++) {
        possible |= possible << BigInt(A[i]); // 新しい和を追加
    }
    
    return (possible & (1n << BigInt(S))) !== 0n ? "Yes" : "No";
}

// 入力例
const N = 4, S = 11;
const A = [3, 1, 4, 5];

console.log(subsetSumBitset(N, S, A));
```
### **計算量**
- `O(N log S)`（非常に高速）
- `bitset` を使うことで `S ≤ 10^7` でも処理可能！

---

## **6. まとめ**
| 解法 | 計算量 | メリット | デメリット |
|------|------|----------|------------|
| **再帰（バックトラッキング）** | `O(2^N)` | 実装が簡単 | `N > 20` で遅い |
| **動的計画法（DP）** | `O(N × S)` | `N = 60` でも可能 | `S` が大きいとメモリを消費 |
| **ビットマスク（bitset）** | `O(N log S)` | 超高速 (`S = 10^7` も可能) | `S` が大きいと計算できない |

**おすすめの選び方**
- **`N ≤ 20`** → **再帰（バックトラッキング）**
- **`N ≤ 60, S ≤ 10000`** → **動的計画法（DP）**
- **`S` が超大きい (`10^7` など)** → **ビットマスク（bitset）**

---

### **7. まとめ**
✅ **部分和問題は「選ぶ or 選ばない」の2択を考える！**  
✅ **`N ≤ 20` なら再帰、`N ≤ 60, S ≤ 10000` なら DP、S が超大きいならビットマスク！**  
✅ **`O(N × S)` で十分高速、bitset で更に最適化できる！**

---
