TypeScript を使った「2. Add Two Numbers」問題の解答。
リストは逆順で数字が格納されているため、対応するノードの数字を順に足し合わせ、繰り上がりも考慮。

---

### ✅ 解法：TypeScript 実装

```ts
class ListNode {
    val: number;
    next: ListNode | null;

    constructor(val?: number, next?: ListNode | null) {
        this.val = val ?? 0;
        this.next = next ?? null;
    }
}

function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    const dummyHead = new ListNode(0);
    let current = dummyHead;
    let carry = 0;

    while (l1 !== null || l2 !== null || carry > 0) {
        const val1 = l1?.val ?? 0;
        const val2 = l2?.val ?? 0;
        const sum = val1 + val2 + carry;

        carry = Math.floor(sum / 10);
        current.next = new ListNode(sum % 10);
        current = current.next;

        l1 = l1?.next ?? null;
        l2 = l2?.next ?? null;
    }

    return dummyHead.next;
}
```

---

### 🧠 アルゴリズムの解説

```text
342 (l1 = [2, 4, 3])
+ 465 (l2 = [5, 6, 4])
= 807 ⇒ [7, 0, 8]
```

1. **ダミーノード（`dummyHead`）** を作り、最終的な連結リストを構築します。
2. 各桁の `val1`, `val2` を取り出し、`carry` を含めて合計。
3. その合計から `% 10` で現在の桁、`/ 10` で繰り上がりを計算。
4. 新しいノードを作成して、`current.next` に追加。
5. 最後に `dummyHead.next` を返すことで答えのリストを返却。

---

### 🧪 テスト用ユーティリティ関数（任意）

以下は、配列と `ListNode` 間の変換を行う補助関数です：

```ts
function arrayToList(arr: number[]): ListNode | null {
    const dummy = new ListNode();
    let current = dummy;
    for (const num of arr) {
        current.next = new ListNode(num);
        current = current.next;
    }
    return dummy.next;
}

function listToArray(head: ListNode | null): number[] {
    const result: number[] = [];
    while (head !== null) {
        result.push(head.val);
        head = head.next;
    }
    return result;
}
```

---

### 🧪 使用例

```ts
const l1 = arrayToList([2, 4, 3]);
const l2 = arrayToList([5, 6, 4]);

const result = addTwoNumbers(l1, l2);
console.log(listToArray(result)); // [7, 0, 8]
```

---

そのエラーは「`ListNode` が重複して定義されている」ことを意味します。つまり、`ListNode` クラスが **すでに他の場所（ファイルやコード上部）で定義されている** 状況です。

---

### ✅ 解決方法

**方法①：既存の `ListNode` を使う**

もし問題が与える `ListNode` クラスが既に存在している場合は、**再定義せずにそのまま使う**だけでOKです。以下のように `ListNode` の定義部分を削除して、`addTwoNumbers` の関数部分だけ使ってください。

```ts
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    const dummyHead = new ListNode(0);
    let current = dummyHead;
    let carry = 0;

    while (l1 !== null || l2 !== null || carry > 0) {
        const val1 = l1?.val ?? 0;
        const val2 = l2?.val ?? 0;
        const sum = val1 + val2 + carry;

        carry = Math.floor(sum / 10);
        current.next = new ListNode(sum % 10);
        current = current.next;

        l1 = l1?.next ?? null;
        l2 = l2?.next ?? null;
    }

    return dummyHead.next;
}
```

---

**方法②：自分でテスト用に `ListNode` を書く場合**

あなたがローカル環境などで単体テストをしたいなら、**他の `ListNode` 定義と競合しないように名前を変更するか、既存の定義を削除**してください。

例：テスト用なら `MyListNode` などに名前を変えるのも一手です。

```ts
class MyListNode {
    val: number;
    next: MyListNode | null;

    constructor(val?: number, next?: MyListNode | null) {
        this.val = val ?? 0;
        this.next = next ?? null;
    }
}
```

---

### 🔁 よくあるミス

* LeetCode などのオンラインジャッジでは、`ListNode` が**あらかじめ定義済み**。
* その環境で自分で `ListNode` を定義すると **TS2300: Duplicate identifier** が出る。

---

### 🎯 結論

* **LeetCode やオンライン環境** → `ListNode` の定義は削除してください。
* **ローカルで実行** → 他に `ListNode` があれば削除、またはクラス名を変更してください。

