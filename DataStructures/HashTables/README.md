JavaScriptでの**ハッシュテーブル（Hash Table）**について詳しく説明します。

---

## **1. ハッシュテーブルとは？**

ハッシュテーブルは、**キー（key）と値（value）**のペアを効率的に保存・検索するためのデータ構造です。  
ハッシュ関数を用いてキーを**一意のインデックス**に変換し、配列の特定の位置に値を格納することで、**O(1)（平均ケース）** の時間でデータを検索・挿入・削除できます。

---

## **2. JavaScriptでのハッシュテーブル**

### **(1) JavaScriptの標準的なハッシュテーブル**

JavaScriptでは、**オブジェクト（Object）やMapをハッシュテーブルとして使用**できます。

### **(2) オブジェクト（`{}`）を使ったハッシュテーブル**

JavaScriptの`Object`は、キーと値のペアを格納するハッシュテーブルとして動作します。

```javascript
const hashTable = {};

// データを追加
hashTable['name'] = 'Alice';
hashTable['age'] = 25;

// データを取得
console.log(hashTable['name']); // "Alice"

// データの削除
delete hashTable['age'];
console.log(hashTable); // { name: 'Alice' }
```

**特長:**

- 文字列キーの使用が可能（数値キーも可能だが文字列に変換される）。
- `Object.prototype`の影響を受けるため、シンプルなハッシュテーブルとして使うには注意が必要。

**欠点:**

- `hasOwnProperty` を使わないと、`toString` などの組み込みプロパティと衝突する可能性がある。
- キーは**必ず文字列**として扱われる。

#### **解決策：`Object.create(null)` を使用**

```javascript
const hashTable = Object.create(null);
hashTable['name'] = 'Alice';
console.log(hashTable['name']); // "Alice"
```

これにより、プロトタイプの影響を受けないクリーンなハッシュテーブルが作れます。

---

### **(3) `Map`を使ったハッシュテーブル**

ECMAScript 6（ES6）では、`Map`が導入され、より強力なハッシュテーブルを利用できるようになりました。

```javascript
const hashTable = new Map();

// データを追加
hashTable.set('name', 'Alice');
hashTable.set('age', 25);

// データを取得
console.log(hashTable.get('name')); // "Alice"

// データの存在確認
console.log(hashTable.has('age')); // true

// データの削除
hashTable.delete('age');

// すべてのデータを削除
hashTable.clear();
```

**メリット:**

- **どんな型でもキーにできる**（オブジェクト、配列、関数も可）
- `size` プロパティで要素数を取得可能（`Object`にはない）
- `forEach` や `for...of` でイテレーションが可能
- 挿入順を保持する

```javascript
hashTable.set(42, 'Number key');
hashTable.set({ key: 'obj' }, 'Object key');

console.log(hashTable.get(42)); // "Number key"
```

---

## **3. 自作ハッシュテーブルの実装**

### **(1) 簡単なハッシュ関数**

キー（文字列）を**数値のインデックス**に変換する簡単なハッシュ関数を作成します。

```javascript
function hashStringToIndex(key, size) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash += key.charCodeAt(i);
    }
    return hash % size; // 配列のサイズで割ることで範囲を制限
}
```

この関数は、`key`の各文字の**Unicode値を合計**し、配列サイズで割った余りを返します。

### **(2) ハッシュテーブルのクラス**

配列をベースに、キー・値ペアを管理するハッシュテーブルを作成します。

```javascript
class HashTable {
    constructor(size = 50) {
        this.table = new Array(size);
        this.size = size;
    }

    // ハッシュ関数
    _hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
        }
        return hash % this.size;
    }

    // データの追加
    set(key, value) {
        const index = this._hash(key);
        if (!this.table[index]) {
            this.table[index] = [];
        }
        this.table[index].push([key, value]); // キー・値ペアを配列で保存
    }

    // データの取得
    get(key) {
        const index = this._hash(key);
        if (this.table[index]) {
            for (let pair of this.table[index]) {
                if (pair[0] === key) {
                    return pair[1];
                }
            }
        }
        return undefined;
    }

    // データの削除
    remove(key) {
        const index = this._hash(key);
        if (this.table[index]) {
            this.table[index] = this.table[index].filter((pair) => pair[0] !== key);
        }
    }

    // 表示
    display() {
        this.table.forEach((pairs, index) => {
            if (pairs) {
                console.log(index, pairs);
            }
        });
    }
}

// ハッシュテーブルの使用
const myHashTable = new HashTable();
myHashTable.set('name', 'Alice');
myHashTable.set('age', 25);
console.log(myHashTable.get('name')); // "Alice"
myHashTable.remove('age');
myHashTable.display();
```

---

## **4. ハッシュテーブルの問題点と解決策**

### **(1) 衝突（Collision）**

同じインデックスに複数のキーが割り当てられる問題。

#### **解決策**

- **チェイン法（Chaining）**: 配列の各インデックスにリスト（配列）を格納する（上のコードで採用）。
- **オープンアドレス法（Open Addressing）**: すでにデータがある場合、次の空きスロットを探す。

### **(2) サイズの動的変更**

配列のサイズが小さいと衝突が増え、大きすぎるとメモリの無駄が発生。

#### **解決策**

- **負荷率（Load Factor）** を監視し、一定以上になったらサイズを増やす。

---

## **5. まとめ**

| 手法                  | 特徴                                       |
| --------------------- | ------------------------------------------ |
| `Object`              | 文字列キーのみ。プロトタイプの影響あり。   |
| `Object.create(null)` | プロトタイプなしの純粋なハッシュテーブル。 |
| `Map`                 | 任意の型のキーが使用可能。順序も保持。     |
| 自作ハッシュテーブル  | `Array`と`hash関数`を使って実装可能。      |

実際の開発では、基本的に **`Map`を推奨**
