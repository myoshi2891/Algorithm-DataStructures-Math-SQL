
### ✅ 解法のポイント（線形走査）：

* 各日において「これまでに見た最小価格」を記録しながら、
* その日に売った場合の利益（現在価格 − 最小価格）を計算して、
* 利益の最大値を更新します。

---

## ✅ TypeScriptでの実装：

```ts
function maxProfit(prices: number[]): number {
    let minPrice = Infinity;
    let maxProfit = 0;

    for (let price of prices) {
        if (price < minPrice) {
            minPrice = price; // 安く買える日を更新
        } else {
            maxProfit = Math.max(maxProfit, price - minPrice); // 利益を最大化
        }
    }

    return maxProfit;
}
```

---

### ✅ 図解（例: `[7,1,5,3,6,4]`）

| Day | Price | minPrice | Potential Profit | maxProfit |
| --- | ----- | -------- | ---------------- | --------- |
| 0   | 7     | 7        | -                | 0         |
| 1   | 1     | 1        | -                | 0         |
| 2   | 5     | 1        | 4                | 4         |
| 3   | 3     | 1        | 2                | 4         |
| 4   | 6     | 1        | 5                | 5         |
| 5   | 4     | 1        | 3                | 5         |

---

### ✅ 時間・空間計算量

* **時間計算量**: `O(n)` （1回のループ）
* **空間計算量**: `O(1)` （定数の記憶だけ）

---

### ✅ 特記事項（落とし穴）

* `minPrice` を初期化する際に `Infinity` を使うことで、最初の価格が何であっても安全に最小値を記録できます。
* 利益が負になる場合（ずっと値下がり）は、必ず `0` を返すので問題なし。

---

「線形走査（Linear Scanning）」と「線形探査（Linear Probing）」は名前が似ていますが、**意味が異なる**ことがあるので注意が必要。

---

## ✅ 線形走査（Linear Scan / Linear Search）

これは単純に配列やリストを**先頭から1つずつ順番に見る方法**です。
今回の「最大利益の株」問題などで使われるのはこちらです。

### 特徴:

* データを順番に1つずつ調べる（`for` ループなど）
* 最悪 O(n) 時間がかかる
* ソートされていない配列に対しても使える
* **使い所**: 小さい配列や条件分岐が複雑なとき

### 例（最大値の線形走査）:

```ts
const arr = [3, 1, 4, 1, 5, 9];
let max = -Infinity;
for (let x of arr) {
  if (x > max) max = x;
}
console.log(max); // 9
```

---

## ✅ 線形探査（Linear Probing）

こちらは **ハッシュテーブル（Hash Table）で衝突が起きたときの解決法** です。

### イメージ：

ハッシュ関数でキーの格納場所を求めたが、すでにその場所が使われていた（衝突）。
→ 空いている次の場所を1つずつ順に探して格納する方式です。

---

### 🔧 処理の流れ（ハッシュテーブル + 線形探査）:

1. `index = hash(key) % capacity` で基本のインデックスを求める
2. その場所が使われていなければそこに格納
3. 使われていれば `index + 1`, `index + 2`, ... と空き場所が見つかるまで探す

---

### 💡 例：簡単な線形探査（Linear Probing）の実装（TypeScript）

```ts
class HashTable {
    table: (string | null)[];
    size: number;

    constructor(size: number) {
        this.size = size;
        this.table = new Array(size).fill(null);
    }

    hash(key: string): number {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
        }
        return hash % this.size;
    }

    insert(key: string) {
        let index = this.hash(key);
        const startIndex = index;

        while (this.table[index] !== null) {
            index = (index + 1) % this.size;
            if (index === startIndex) throw new Error("Hash table is full");
        }

        this.table[index] = key;
    }

    print() {
        console.log(this.table);
    }
}

const hash = new HashTable(10);
hash.insert("apple");
hash.insert("grape");
hash.insert("banana");
hash.print();
```

---

### 📊 線形探査のメリット・デメリット

| 項目      | 内容                                     |
| ------- | -------------------------------------- |
| ✅メリット   | 実装がシンプル、メモリのローカリティが良い（キャッシュ効率）         |
| ⚠️デメリット | クラスタリング（連続した空き探しによる偏り）が起きやすい           |
| 🧠 適用   | オープンアドレッシング方式の1つ。他には二次探査、ダブルハッシュ法などもある |

---

## 🔁 線形走査 vs 線形探査：まとめ

| 用語   | 内容            | 使う場面           |
| ---- | ------------- | -------------- |
| 線形走査 | 配列を順番に見て処理する  | 最大・最小、条件チェックなど |
| 線形探査 | ハッシュの衝突解決法の1つ | ハッシュテーブルの実装    |

---
