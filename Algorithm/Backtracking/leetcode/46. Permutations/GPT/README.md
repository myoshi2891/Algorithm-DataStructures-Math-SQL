了解しました 👍
ここでは **TypeScript 実装**を対象にして、`permute(nums: number[])` がどのように **順列を生成しているか** を、図を使って **処理の流れを具体的に解析**していきます。

---

## コード（再掲）

```typescript
function permute(nums: number[]): number[][] {
    const result: number[][] = [];

    const backtrack = (start: number): void => {
        if (start === nums.length) {
            result.push([...nums]); // 現在の順列を保存
            return;
        }
        for (let i = start; i < nums.length; i++) {
            [nums[start], nums[i]] = [nums[i], nums[start]]; // swap
            backtrack(start + 1);
            [nums[start], nums[i]] = [nums[i], nums[start]]; // swap 戻す
        }
    };

    backtrack(0);
    return result;
}
```

---

## 全体の考え方

- `backtrack(start)` は「`start` の位置を固定し、残りの部分を順列化する」関数。
- `for` ループの中で **swap** を行い、先頭から順に並び替えを試す。
- 再帰終了条件 `start === nums.length` のとき、`nums` のコピーを `result` に保存。

---

## 処理の流れ（例: `nums = [1,2,3]`）

### ステップ 1: 初期呼び出し

```
nums = [1,2,3]
backtrack(0)
```

- `start = 0`
- ループ: i = 0,1,2 で swap を試す。

---

### ステップ 2: i = 0 の場合（swap(0,0) → そのまま）

```
[1,2,3]
```

- 次へ: `backtrack(1)`

---

### ステップ 3: backtrack(1)

```
nums = [1,2,3]
start = 1
```

- ループ: i = 1,2 を試す。

#### 3a. i = 1 の場合（swap(1,1) → そのまま）

```
[1,2,3]
```

→ `backtrack(2)`

#### 3b. backtrack(2)

```
nums = [1,2,3]
start = 2
```

- i = 2 → swap(2,2) → \[1,2,3]
- `backtrack(3)` → **結果保存: \[1,2,3]**

---

#### 3c. i = 2 の場合（swap(1,2)）

```
[1,3,2]
```

→ `backtrack(2)`

- i = 2 → swap(2,2) → \[1,3,2]

- `backtrack(3)` → **結果保存: \[1,3,2]**

- swap 戻し → \[1,2,3]

---

### ステップ 4: i = 1 の場合（swap(0,1)）

```
[2,1,3]
```

→ `backtrack(1)`

- i = 1 → swap(1,1) → \[2,1,3]
    - backtrack(2) → 保存: \[2,1,3]

- i = 2 → swap(1,2) → \[2,3,1]
    - backtrack(2) → 保存: \[2,3,1]
    - swap 戻し → \[2,1,3]

- swap 戻し → \[1,2,3]

---

### ステップ 5: i = 2 の場合（swap(0,2)）

```
[3,2,1]
```

→ `backtrack(1)`

- i = 1 → swap(1,1) → \[3,2,1]
    - backtrack(2) → 保存: \[3,2,1]

- i = 2 → swap(1,2) → \[3,1,2]
    - backtrack(2) → 保存: \[3,1,2]
    - swap 戻し → \[3,2,1]

- swap 戻し → \[1,2,3]

---

## 全体の探索ツリー（図解）

```
start=0
 ├── swap(0,0): [1,2,3]
 │    ├── swap(1,1): [1,2,3] → 保存 [1,2,3]
 │    └── swap(1,2): [1,3,2] → 保存 [1,3,2]
 │
 ├── swap(0,1): [2,1,3]
 │    ├── swap(1,1): [2,1,3] → 保存 [2,1,3]
 │    └── swap(1,2): [2,3,1] → 保存 [2,3,1]
 │
 └── swap(0,2): [3,2,1]
      ├── swap(1,1): [3,2,1] → 保存 [3,2,1]
      └── swap(1,2): [3,1,2] → 保存 [3,1,2]
```

---

## 得られる結果

```
[[1,2,3],
 [1,3,2],
 [2,1,3],
 [2,3,1],
 [3,2,1],
 [3,1,2]]
```

---

## まとめ

- **swap と backtracking** によって順列を効率よく探索できる。
- 各再帰ステップでは「位置を固定して、残りを順列化」する。
- **時間計算量 O(n \* n!)、空間計算量 O(n)** で、制約 (n ≤ 6) の範囲では十分高速。

---
