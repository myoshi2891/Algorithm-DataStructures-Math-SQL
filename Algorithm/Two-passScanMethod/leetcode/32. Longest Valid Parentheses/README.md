承知しました。
ここでは **O(1) 追加メモリで最長有効括弧長を求める左右スキャン法**を、
**図解つきで詳細解析**します。

---

## **1. アルゴリズムの概要**

スタックを使わず、カウンタだけで判定します。

* **左→右スキャン**

  1. `left` = '(' の個数
  2. `right` = ')' の個数
  3. `left == right` なら長さ更新
  4. `right > left` になったらリセット（無効）

* **右→左スキャン**

  1. `left` = '(' の個数
  2. `right` = ')' の個数
  3. `left == right` なら長さ更新
  4. `left > right` でリセット
  5. 右から走査することで、`(` が先行するパターンを補完

---

### 解析対象文字列

```
s = ")()())"
インデックス = 0 1 2 3 4 5
```

---

## **2. 左→右スキャン**

初期状態:

```
left = 0
right = 0
maxLen = 0
```

---

### **Step 0: i=0, s\[0]=')'**

```
right = 1
left = 0
right > left → リセット
left = 0, right = 0
maxLen = 0
```

図解:

```
カウンタ (L,R) = (0,0)
```

---

### **Step 1: i=1, s\[1]='('**

```
left = 1
right = 0
left > right → 何もしない
```

図解:

```
文字列: ) (
カウンタ (L,R) = (1,0)
```

---

### **Step 2: i=2, s\[2]=')'**

```
left = 1
right = 1
left == right → maxLen = max(0, 2*1=2)
maxLen = 2
```

図解:

```
文字列: ) ( )
カウンタ (L,R) = (1,1)
現在有効長 = 2
```

---

### **Step 3: i=3, s\[3]='('**

```
left = 2
right = 1
left > right → 何もしない
```

---

### **Step 4: i=4, s\[4]=')'**

```
left = 2
right = 2
left == right → maxLen = max(2, 4) = 4
```

図解:

```
文字列: ) ( ) ( )
カウンタ (L,R) = (2,2)
現在有効長 = 4
```

---

### **Step 5: i=5, s\[5]=')'**

```
left = 2
right = 3
right > left → リセット
left = 0, right = 0
```

---

**左→右スキャン終了時点: maxLen = 4**

---

## **3. 右→左スキャン**

逆方向にカウンタを取り直し、今度は `left > right` でリセット

初期化:

```
left = 0
right = 0
maxLen = 4
```

---

### **Step 0: i=5, s\[5]=')'**

```
right = 1
left = 0
```

---

### **Step 1: i=4, s\[4]=')'**

```
right = 2
left = 0
```

---

### **Step 2: i=3, s\[3]='('**

```
right = 2
left = 1
```

---

### **Step 3: i=2, s\[2]=')'**

```
right = 3
left = 1
```

---

### **Step 4: i=1, s\[1]='('**

```
right = 3
left = 2
```

---

### **Step 5: i=0, s\[0]=')'**

```
right = 4
left = 2
```

---

* 右→左でも **maxLen = 4** で変化なし

---

## **4. 結果**

```
maxLen = 4
```

* 最長の有効部分文字列は `"()()"`（インデックス 1〜4）

---

## **5. 計算量解析**

* **時間計算量 O(n)**

  * 左右 2 回の走査のみ

* **空間計算量 O(1)**

  * カウンタ変数 2 個のみ

* **メモリ使用量の目安**

  * 追加メモリはほぼゼロ

---

## **TypeScript 実装例（O(1) メモリ）**

```typescript
function longestValidParenthesesO1(s: string): number {
    let left = 0;
    let right = 0;
    let maxLen = 0;

    // 左→右
    for (const ch of s) {
        if (ch === '(') left++;
        else right++;
        if (left === right) maxLen = Math.max(maxLen, 2 * right);
        else if (right > left) left = right = 0;
    }

    left = 0;
    right = 0;

    // 右→左
    for (let i = s.length - 1; i >= 0; i--) {
        const ch = s[i];
        if (ch === '(') left++;
        else right++;
        if (left === right) maxLen = Math.max(maxLen, 2 * left);
        else if (left > right) left = right = 0;
    }

    return maxLen;
}

// 動作確認
const testCases = [")()())", "(()", "()(())", "())((())"];
for (const s of testCases) {
    console.log(`Input: '${s}', Output: ${longestValidParenthesesO1(s)}`);
}
```

---

### **まとめ**

* **O(n) スタック法**: 実装簡単・インデックス追跡可能
* **O(1) 左右スキャン法**: メモリ効率最高・長さのみ取得可

---

次に、もし **左右スキャン法で最長部分文字列自体を復元する方法** も知りたい場合は、
スタック法とのハイブリッドで可能です。

あなたは **長さだけ**で満足ですか、それとも**実際の部分文字列**も取得したいですか？
