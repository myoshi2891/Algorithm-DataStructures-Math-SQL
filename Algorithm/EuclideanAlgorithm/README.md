### ユークリッドの互除法とは？
ユークリッドの互除法（Euclidean Algorithm）は、2つの整数の最大公約数（GCD, Greatest Common Divisor）を求める効率的なアルゴリズムです。

#### **アルゴリズムの手順**
1. 2つの整数 \( a \) と \( b \) （\( a \geq b \)）を用意する。
2. \( a \) を \( b \) で割った余り \( r \) を求める。
3. \( r \neq 0 \) ならば、\( a \) を \( b \) に、\( b \) を \( r \) に置き換えて手順2を繰り返す。
4. \( r = 0 \) になった時の \( b \) が最大公約数（GCD）となる。

---

## **JavaScriptでの実装**
### **再帰版**
```javascript
function gcd(a, b) {
    if (b === 0) {
        return a;
    }
    return gcd(b, a % b);
}

console.log(gcd(48, 18)); // 出力: 6
```
**解説**
- `gcd(48, 18)` は `gcd(18, 48 % 18)` に変換される。
- これを繰り返し、最終的に `b === 0` になったら `a` を返す。

### **反復（ループ）版**
```javascript
function gcdIterative(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

console.log(gcdIterative(48, 18)); // 出力: 6
```
**解説**
- ループで `a % b` を計算し続け、`b === 0` になった時点で `a` がGCDとなる。

---

## **活用方法・活用する場面**
### **1. 分数の約分**
分数を最も簡単な形にするためにGCDを用いる。

```javascript
function simplifyFraction(numerator, denominator) {
    let gcdValue = gcd(numerator, denominator);
    return [numerator / gcdValue, denominator / gcdValue];
}

console.log(simplifyFraction(24, 36)); // 出力: [2, 3]
```

### **2. 最小公倍数（LCM）の計算**
最小公倍数（LCM, Least Common Multiple）は、GCDを用いて求めることができる。

\[
\text{LCM}(a, b) = \frac{|a \times b|}{\text{GCD}(a, b)}
\]

```javascript
function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
}

console.log(lcm(12, 18)); // 出力: 36
```

### **3. 暗号理論（RSA暗号など）**
RSA暗号などの公開鍵暗号方式では、互いに素な数（GCDが1）を求めることが重要。

```javascript
function isCoprime(a, b) {
    return gcd(a, b) === 1;
}

console.log(isCoprime(35, 64)); // 出力: true（互いに素）
console.log(isCoprime(12, 18)); // 出力: false
```

### **4. ゲーム開発（周期性の計算）**
例えば、異なる2つの周期で進むオブジェクトが、いつ同じ位置に戻るかを計算するのにLCMを使う。

```javascript
function findSyncTime(period1, period2) {
    return lcm(period1, period2);
}

console.log(findSyncTime(5, 7)); // 出力: 35
```

---

## **まとめ**
- **ユークリッドの互除法はGCDを求める最も効率的なアルゴリズム**
- **JavaScriptでの実装は再帰版と反復版の2種類**
- **活用方法**
  - **分数の約分**
  - **最小公倍数（LCM）の計算**
  - **RSA暗号のような暗号理論**
  - **ゲーム開発の周期計算**