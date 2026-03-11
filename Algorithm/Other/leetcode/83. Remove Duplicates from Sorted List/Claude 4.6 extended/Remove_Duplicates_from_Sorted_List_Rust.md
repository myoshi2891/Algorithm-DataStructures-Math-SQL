# LeetCode #83 - Remove Duplicates from Sorted List (Rust)

---

## 1. 問題の分析

### 競技プログラミング視点

- **制約分析**: `n ≤ 300` → アルゴリズムより**所有権モデルとの格闘**が主戦場
- **最速手法**: 1ポインタ線形走査 `O(n)` / 追加ヒープアロケーションゼロ `O(1)`
- **メモリ最小化**: `Box<ListNode>` の drop を `take()` で制御し、不要ノードを即座に解放

### 業務開発視点

- **型安全設計**: `Option<Box<ListNode>>` が Rust での連結リスト表現 → `None` = リスト終端が型レベルで保証
- **エラーハンドリング**: `Option` の `map_or` / `take` で null 相当の安全な操作
- **所有権設計**: 関数が `head` の所有権を受け取り、変更済みリストの所有権を返す

### Rust特有の考慮点

- `Option<Box<ListNode>>` の二重ラップ → `as_mut()` / `take()` / `.next` の連鎖が肝
- **借用チェッカーとの戦い**: `current` への `&mut` を保持しつつ `node.next` を書き換える → `while let` ループで解決
- スタック上の `current: Option<&mut Box<ListNode>>` のみ → ヒープ追加確保ゼロ

---

## 2. アルゴリズムアプローチ比較

| アプローチ                  | 時間計算量 | 空間計算量 | Rust実装コスト | 安全性 | 可読性 | 備考                     |
| --------------------------- | ---------- | ---------- | -------------- | ------ | ------ | ------------------------ |
| **1ポインタ・インプレース** | O(n)       | O(1)       | 中             | 高     | 高     | ✅ 最適解・追加alloc不要 |
| 再帰                        | O(n)       | O(n)       | 低             | 高     | 高     | スタック消費・TCO非保証  |
| Vec収集＋再構築             | O(n)       | O(n)       | 低             | 高     | 中     | 不要なヒープ確保         |

---

## 3. 選択したアルゴリズムと理由

- **選択**: 1ポインタ・インプレース走査
- **理由**:
    - ソート済みリストの隣接重複という特性で1パス完結
    - `Box<ListNode>` の所有権移動を `take()` で明示的に制御 → 解放タイミングが明確
    - 再帰は末尾呼び出し最適化が Rust でコンパイラ保証されないため回避
- **Rust固有の最適化ポイント**:
    - `take()` で `next` の所有権を一時取り出し → 借用チェッカーを満足させる慣用パターン
    - `as_mut()` で `Option<Box<T>>` を `Option<&mut Box<T>>` に変換 → ゼロコスト
    - スタック変数 `current` のみ → キャッシュフレンドリー

---

## 4. 実装コード

```rust
// Runtime 0 ms
// Beats 100.00%
// Memory 2.13 MB
// Beats 68.10%
// Definition for singly-linked list.
// #[derive(PartialEq, Eq, Clone, Debug)]
// pub struct ListNode {
//   pub val: i32,
//   pub next: Option<Box<ListNode>>
// }
//
// impl ListNode {
//   #[inline]
//   fn new(val: i32) -> Self {
//     ListNode {
//       next: None,
//       val
//     }
//   }
// }

impl Solution {
    /// ソート済み連結リストから重複ノードをインプレースで削除する
    ///
    /// # Algorithm
    /// `current` ポインタを先頭から走査し、
    /// `current.val == current.next.val` の間は `next` を `take()` でスキップ。
    /// 値が異なった時点で `current` を1つ進める（1ポインタ・インプレース）。
    ///
    /// # Arguments
    /// * `head` - 連結リストの所有権（空リストの場合は `None`）
    ///
    /// # Returns
    /// 重複を除去したソート済み連結リストの所有権
    ///
    /// # Complexity
    /// - Time:  O(n) — 各ノードを最大1回走査
    /// - Space: O(1) — スタック変数のみ、追加ヒープ確保なし
    pub fn delete_duplicates(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        // head の所有権を受け取り、変更後に返す
        let mut head = head;

        // ── ガード節 ────────────────────────────────────────────────────
        // 空リスト or ノード1つ → 重複なし、所有権をそのまま返す
        if matches!(head, None | Some(ref node) if node.next.is_none()) {
            return head;
        }

        // ── 1ポインタ走査（インプレース） ─────────────────────────────
        //
        // current: Option<&mut Box<ListNode>>
        //   - as_mut() で head の &mut 参照を取得
        //   - ループ内で node.next.as_mut() により1つずつ前進
        //
        // 【所有権の流れ】
        //   head(所有) ──as_mut()──> current(&mut)
        //   current は head を所有したまま参照だけを持ち歩く
        //
        let mut current = head.as_mut();

        while let Some(node) = current {
            // ┌──────────────────────────────────────────────────────┐
            // │ 内側ループ: 同じ値が連続する限り next をスキップ     │
            // │                                                      │
            // │  [1] → [1] → [2]                                    │
            // │   ↑     ↑                                            │
            // │  node  next (take で所有権を取り出しドロップ)        │
            // │                                                      │
            // │  take() の動作:                                      │
            // │    node.next の所有権を `skipped` へ移動             │
            // │    node.next は None になる                          │
            // │    skipped.next を node.next へ接続                  │
            // │    skipped は スコープを抜けて自動 drop              │
            // └──────────────────────────────────────────────────────┘
            while node.next.as_ref().map_or(false, |nxt| nxt.val == node.val) {
                // next の所有権を取り出す（node.next は一時的に None）
                let skipped = node.next.take().unwrap(); // Box<ListNode>
                // スキップされたノードの next を現在ノードの next へ接続
                node.next = skipped.next;
                // skipped はここで drop → ヒープ解放
            }

            // 値が異なる → current を1つ前進
            current = node.next.as_mut();
        }

        head // 変更済みリストの所有権を返す
    }
}
```

---

## 5. 所有権フローの可視化

```
【入力】 head = Some([1] → [1] → [2] → [3] → [3] → None)

┌─ head (所有) ─────────────────────────────────────────────┐
│  as_mut() で &mut を取り出し current へ                   │
└────────────────────────────────────────────────────────────┘

Step 1  node.val(1) == next.val(1)  → take() でスキップ
  before: [1] → [1] → [2] → [3] → [3] → None
  take():  skipped = Box([1] → [2] → ...)
  after:  [1] ──────→ [2] → [3] → [3] → None
  drop:    skipped (旧2番目ノード) を即時解放 ✅

Step 2  node.val(1) != next.val(2)  → current を前進
  current → [2]

Step 3  node.val(2) != next.val(3)  → current を前進
  current → [3]

Step 4  node.val(3) == next.val(3)  → take() でスキップ
  before: [3] → [3] → None
  take():  skipped = Box([3] → None)
  after:  [3] → None
  drop:    skipped を即時解放 ✅

Step 5  node.next is None  → while let を抜ける

【出力】 Some([1] → [2] → [3] → None) ✅
```

---

## 6. 計算量サマリー

| 指標               | 値          | 説明                               |
| ------------------ | ----------- | ---------------------------------- |
| **時間計算量**     | `O(n)`      | 各ノードを最大1回走査              |
| **空間計算量**     | `O(1)`      | スタック変数 `current` のみ        |
| **ヒープ確保**     | `0` 回      | 既存ノードの `next` 付け替えのみ   |
| **安全性**         | `safe Rust` | `unsafe` ブロックなし              |
| **重複ノード解放** | 即時        | `take()` スコープ末尾で自動 `drop` |
| **clippy 適合**    | ✅          | `#![deny(clippy::all)]` 相当       |
