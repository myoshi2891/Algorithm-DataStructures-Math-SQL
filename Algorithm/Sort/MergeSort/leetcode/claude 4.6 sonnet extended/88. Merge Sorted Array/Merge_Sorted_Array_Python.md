## 1. 問題分析結果

### 競技プログラミング視点

`nums1` の末尾から逆順に埋める3ポインタ法が最適。CPython では `list` のインデックスアクセスは O(1) の C 実装であり、本実装のようにスライス代入を用いると最悪ケース O(n) の追加空間を消費しますが、時間計算量 O(m+n) を達成できます。

### 業務開発視点

LeetCode のシグネチャは `None` 返却の破壊的操作。Pylance 対応のため `List[int]` 型ヒントを厳密に付与し、`m`/`n` は `int` として明示します。エッジケース（`n == 0`）は早期リターンで明示的に処理します。

### Python特有分析

- `list.__setitem__` は C レイヤーで動作し、純粋な Python ループでも高速
- `nums1[k], i, j, k` のローカル変数参照はグローバル参照より高速（LOAD_FAST）
- 競技版では `while` + インデックス直接操作が最速（イテレータ生成コスト不要）
- `nums1[:j+1] = nums2[:j+1]` のスライス代入は C の `memmove` 相当で残余コピーを一括処理可能

---

## 2. アルゴリズムアプローチ比較

| アプローチ             | 時間計算量       | 空間計算量 | Python実装コスト | 可読性 | 標準ライブラリ活用 | CPython最適化       | 備考                      |
| ---------------------- | ---------------- | ---------- | ---------------- | ------ | ------------------ | ------------------- | ------------------------- |
| 後ろから3ポインタ      | O(m+n)           | O(n)       | 低               | ★★★    | なし               | 適                  | 追加アロケーションなし ✅ |
| コピー後 `list.sort()` | O((m+n)log(m+n)) | O(m+n)     | 最低             | ★★★    | なし               | 適（Timsort C実装） | 競技次善策                |
| `heapq.merge` + 展開   | O(m+n)           | O(m+n)     | 低               | ★★☆    | heapq              | 適                  | 一時リスト生成が発生      |

---

## 3. 採用アルゴリズムと根拠

- **選択**: 後ろからの3ポインタマージ（業務版・競技版ともに同一戦略）
- **Python最適化戦略**: 残余コピーをスライス代入 `nums1[:j+1] = nums2[:j+1]` に置換することで、CPython 内部の `memmove` が発動し逐次代入より高速
- **トレードオフ**: スライス代入は最大 O(n) サイズの一時リストオブジェクトを生成するため、厳密な O(1) 空間計算量が必要な場合は while ループで要素ごとにコピーする手法が適している

---

## 4. 実装パターン

```python
# Runtime 0 ms
# Beats 100.00%
# Memory 19.42 MB
# Beats 35.99%
from typing import List

class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        """
        2つのソート済み配列を nums1 にインプレースでマージする。
        後ろから走査する3ポインタ法により O(m+n) 時間・O(n) 追加空間（スライス代入による最悪ケース）を実現。

        不変条件: k >= i が常に成立するため nums1 の未処理要素を上書きしない。
            初期値 k - i = n >= 0 が各イテレーションで保持される。

        Args:
            nums1: マージ先リスト（長さ m+n、末尾 n 要素は 0 で埋められている）
            m:     nums1 の有効要素数
            nums2: マージ元リスト（長さ n）
            n:     nums2 の要素数

        Time Complexity:  O(m + n)
        Space Complexity: O(n)  ※スライス代入の一時オブジェクトによる最悪ケース
        """
        # ── 業務開発版 ─────────────────────────────────────────────
        # n == 0 のとき nums1 は既に完成しているため早期リターン
        if n == 0:
            return

        i: int = m - 1      # nums1 有効末尾ポインタ
        j: int = n - 1      # nums2 末尾ポインタ
        k: int = m + n - 1  # 書き込み位置ポインタ

        # どちらかが尽きるまで大きい方を末尾に書き込む
        while i >= 0 and j >= 0:
            if nums1[i] >= nums2[j]:
                nums1[k] = nums1[i]
                i -= 1
            else:
                nums1[k] = nums2[j]
                j -= 1
            k -= 1

        # nums2 の残余要素を一括スライス代入（CPython の memmove 相当で高速）
        # nums1 の残余は既に正しい位置にあるため操作不要
        if j >= 0:
            nums1[: j + 1] = nums2[: j + 1]

    def merge_competitive(
        self, nums1: List[int], m: int, nums2: List[int], n: int
    ) -> None:
        """
        競技プログラミング向け最適化実装。
        ローカル変数へのキャッシュで LOAD_FAST を最大活用。

        Time Complexity:  O(m + n)
        Space Complexity: O(n)
        """
        # ローカル変数へのバインドで属性ルックアップを排除
        i, j, k = m - 1, n - 1, m + n - 1

        while i >= 0 and j >= 0:
            if nums1[i] >= nums2[j]:
                nums1[k] = nums1[i]
                i -= 1
            else:
                nums1[k] = nums2[j]
                j -= 1
            k -= 1

        if j >= 0:
            nums1[: j + 1] = nums2[: j + 1]
```

---

## Python特有の追加考慮事項

**スライス代入 `nums1[:j+1] = nums2[:j+1]` の内部動作**

CPython の `list_ass_slice` は `memmove` で連続メモリを一括コピーします。逐次 `while` ループに比べてインタープリタのディスパッチコストを排除でき、残余要素が多いほど効果的です。

**`LOAD_FAST` 最適化（競技版）**

Python のバイトコードにおいて、メソッド内のローカル変数アクセス (`LOAD_FAST`) はグローバル変数アクセス (`LOAD_GLOBAL`) より約2倍高速です。`nums1`, `nums2` は引数として自動的にローカルスコープに入るため、競技版では追加のキャッシュは不要。カウンタ変数 `i`, `j`, `k` も同様です。

**Pylance 型安全性**

`List[int]` を `from typing import List` で明示し、戻り値を `None` と宣言することで Pylance の strict モードでも警告ゼロを維持します。Python 3.9 以降では `list[int]` の組み込み記法も使用可能ですが、LeetCode の CPython 3.11 環境では `from typing import List` が最も互換性の高い記述です。
