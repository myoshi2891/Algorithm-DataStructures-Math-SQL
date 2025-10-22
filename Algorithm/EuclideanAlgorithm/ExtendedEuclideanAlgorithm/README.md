## **拡張ユークリッドの互除法とは？**

拡張ユークリッドの互除法（Extended Euclidean Algorithm）は、ユークリッドの互除法を拡張し、**ax + by = gcd(a, b)** を満たす整数 **x, y**（ベズー係数）を求めるアルゴリズムです。

これは特に、**モジュラー逆数の計算** や **ディオファントス方程式の解** に利用されます。

---

## **アルゴリズムの概要**

ユークリッドの互除法では、以下の漸化式を利用してGCDを求めます。

\[
\gcd(a, b) = \gcd(b, a \mod b)
\]

これを利用しながら、ベズー係数 \( x, y \) を求める関係式を導きます。

\[
ax + by = \gcd(a, b)
\]

この関係を再帰的に計算することで、\( x \) と \( y \) を求めます。

---

## **JavaScriptでの実装**

### **再帰版**

```javascript
function extendedGCD(a, b) {
    if (b === 0) {
        return { gcd: a, x: 1, y: 0 };
    }
    let { gcd, x: x1, y: y1 } = extendedGCD(b, a % b);
    let x = y1;
    let y = x1 - Math.floor(a / b) * y1;
    return { gcd, x, y };
}

// 例: 48x + 18y = gcd(48, 18) の解
console.log(extendedGCD(48, 18));
// 出力: { gcd: 6, x: 1, y: -2 }
```

**解説**

1. `gcd(a, b) = gcd(b, a % b)` を再帰的に適用。
2. 最後のステップから逆に戻りながら `x` と `y` を更新。

---

### **反復（ループ）版**

```javascript
function extendedGCDIterative(a, b) {
    let x0 = 1,
        y0 = 0;
    let x1 = 0,
        y1 = 1;

    while (b !== 0) {
        let q = Math.floor(a / b);
        [a, b] = [b, a % b];
        [x0, x1] = [x1, x0 - q * x1];
        [y0, y1] = [y1, y0 - q * y1];
    }
    return { gcd: a, x: x0, y: y0 };
}

console.log(extendedGCDIterative(48, 18));
// 出力: { gcd: 6, x: 1, y: -2 }
```

**解説**

- ループで `a % b` を繰り返し、係数 `x, y` を更新。

---

## **活用方法・応用**

### **1. モジュラー逆元の計算**

整数 \( a \) のモジュラー逆元 \( a^{-1} \) とは、ある整数 \( x \) について次の式を満たす数値：

\[
a^{-1} \equiv x \pmod{m}
\]

これは、拡張ユークリッドの互除法を使って求められる。

#### **実装**

```javascript
function modInverse(a, m) {
    let { gcd, x } = extendedGCD(a, m);
    if (gcd !== 1) {
        throw new Error('逆元が存在しません');
    }
    return ((x % m) + m) % m; // x を正の値に調整
}

console.log(modInverse(3, 7)); // 出力: 5（3 × 5 ≡ 1 mod 7）
```

---

### **2. ディオファントス方程式の解**

整数解を求める方程式：
\[
ax + by = c
\]
が与えられたとき、拡張ユークリッドの互除法で基本解を求め、それを基に一般解を計算できる。

#### **実装**

```javascript
function solveDiophantine(a, b, c) {
    let { gcd, x, y } = extendedGCD(a, b);
    if (c % gcd !== 0) {
        return null; // 解なし
    }
    let scale = c / gcd;
    return { x: x * scale, y: y * scale };
}

console.log(solveDiophantine(7, 5, 1)); // 例: 7x + 5y = 1
// 出力: { x: -2, y: 3 }（7 × (-2) + 5 × 3 = 1）
```

---

### **3. 中国剰余定理（CRT）**

中国剰余定理を解く際に、拡張ユークリッドの互除法を使用して合同式の解を求めることができる。

例えば、以下の2つの合同式を解く：
\[
x \equiv 2 \pmod{3}
\]
\[
x \equiv 3 \pmod{5}
\]
この問題は、拡張ユークリッドの互除法を使って一般解を求めることが可能。

#### **実装**

```javascript
function chineseRemainder(a1, m1, a2, m2) {
    let { gcd, x } = extendedGCD(m1, m2);
    if (gcd !== 1) {
        throw new Error('m1 と m2 は互いに素である必要があります');
    }
    let result = (a1 + ((x * (a2 - a1)) % m2) * m1) % (m1 * m2);
    return (result + m1 * m2) % (m1 * m2);
}

console.log(chineseRemainder(2, 3, 3, 5)); // 出力: 8（8 ≡ 2 mod 3, 8 ≡ 3 mod 5）
```

---

## **まとめ**

- **拡張ユークリッドの互除法は、GCDとともにベズー係数（x, y）を求める**
- **再帰・反復どちらでも実装可能**
- **重要な応用**
    1. **モジュラー逆元（暗号理論、RSA暗号）**
    2. **ディオファントス方程式の整数解**
    3. **中国剰余定理の解法**

ユークリッドの互除法（Euclidean Algorithm）は、**2つの整数の最大公約数（GCD）を非常に効率的に求めるアルゴリズム**です。  
以下では、考え方・手順・例・なぜ速いのかまで、わかりやすく解説します。

---

## ✅ 基本のアイデア

ユークリッドの互除法の核となるのは、次の**性質（定理）**です：

> 2つの整数 `A` と `B` に対して（A > B）、  
> **GCD(A, B) = GCD(B, A % B)**

これを繰り返していくと、最終的に **A % B が 0** になり、  
そのときの **B が最大公約数** になります。

---

## 🔁 アルゴリズムのステップ

1. A % B を計算して、余りを R とする。
2. A ← B, B ← R に更新する。
3. B が 0 になるまで繰り返す。
4. 最後に残った A が GCD。

---

## ✏️ 例：GCD(123, 777) を求める

```
1. A = 777, B = 123
2. 777 % 123 = 42   → 次は GCD(123, 42)
3. 123 % 42 = 39    → 次は GCD(42, 39)
4. 42 % 39 = 3      → 次は GCD(39, 3)
5. 39 % 3 = 0       → 終了！ GCD = 3
```

---

## ✅ JavaScript実装

```javascript
function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b]; // 分割代入で同時に更新
    }
    return a;
}
```

使い方：

```javascript
console.log(gcd(123, 777)); // → 3
```

---

## 💡 なぜ速いの？

- 毎回「余り」で更新することで、数がどんどん小さくなります。
- 最悪でも **対数時間（O(log min(A, B))）** で終わるので、非常に効率的。
- 例えば 10億のような大きな数でも、一瞬で GCD が求まります。

---

## 🔁 応用（再帰バージョン）

```javascript
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}
```

---
