了解しました 👍
では TypeScript 実装の **各処理を図を使って解析・説明** します。
例として、`nums = [2,3,1,1,4]` を用います。

---

## コード（再掲）

```typescript
function jump(nums: number[]): number {
    const n: number = nums.length;
    if (n <= 1) return 0;

    let jumps: number = 0; // 最小ジャンプ回数
    let currentEnd: number = 0; // 現在のジャンプで到達できる範囲の終端
    let farthest: number = 0; // 現時点で到達可能な最も遠い位置

    for (let i = 0; i < n - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        if (i === currentEnd) {
            jumps++;
            currentEnd = farthest;
            if (currentEnd >= n - 1) break;
        }
    }

    return jumps;
}
```

---

## アルゴリズムの考え方

- **currentEnd** … 今のジャンプで行ける「区間の終端」
- **farthest** … 次のジャンプで到達可能な「最も遠いインデックス」
- **jumps** … ジャンプ回数

`for` ループで **i が currentEnd に到達したときにジャンプ回数を増やす** のがポイントです。

---

## 処理の流れ（例: nums = \[2,3,1,1,4]）

### ステップ 0: 初期化

```
nums = [2, 3, 1, 1, 4]
index = 0  1  2  3  4

jumps = 0
currentEnd = 0
farthest = 0
```

---

### ステップ 1: i = 0

- `farthest = max(0, 0 + nums[0]) = max(0, 2) = 2`

```
[0]───→(到達可能: 1,2)
currentEnd = 0
farthest   = 2
```

- `i === currentEnd (0)` なのでジャンプ回数を増加
    - `jumps = 1`
    - `currentEnd = farthest = 2`

---

### ステップ 2: i = 1

- `farthest = max(2, 1 + nums[1]) = max(2, 4) = 4`

```
[1]───→(到達可能: 2,3,4)
currentEnd = 2
farthest   = 4
```

- `i !== currentEnd` なのでジャンプ回数はまだ増えない

---

### ステップ 3: i = 2

- `farthest = max(4, 2 + nums[2]) = max(4, 3) = 4`

```
[2]───→(到達可能: 3)
currentEnd = 2
farthest   = 4
```

- `i === currentEnd (2)` → ジャンプ回数を増加
    - `jumps = 2`
    - `currentEnd = farthest = 4`

---

### ステップ 4: currentEnd >= n-1 で終了

- `currentEnd = 4 (最後のインデックス)`
- ループ終了 → 答え = `jumps = 2`

---

## 図解まとめ

### 各ジャンプ範囲の変化

```
初期: [0]
  ↓ (nums[0] = 2)
1回目ジャンプ範囲: [1,2]
  ↓ (nums[1] = 3 で farthest = 4)
2回目ジャンプ範囲: [3,4]
  ↓ 到達
```

### 可視化イメージ

```
index:   0   1   2   3   4
nums :   2   3   1   1   4
--------------------------------
jump1:  [======]        (0 → 2)
jump2:          [===========] (1 → 4)
```

---

## 計算量とメモリ消費

- **計算量**: `O(n)`
    - 各要素を一度走査するだけ。

- **メモリ使用量**: `O(1)`
    - `jumps`, `currentEnd`, `farthest` の3変数だけ。

---

✅ この方法は「幅優先探索（BFS）の区間管理版」と考えると分かりやすいです。

---

ご希望であれば、この処理を **「BFS風の探索」と「Greedy戦略」の違い」を比較する図** も作成できますが、追加しましょうか？
