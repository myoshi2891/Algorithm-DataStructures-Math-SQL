# 🌳 Symmetric Tree — Python 完全解説

---

## 1. 問題分析結果

> 💡 **初学者向け補足**：この問題は一言で言うと「**二分木が中心軸に対して鏡写しになっているかを確認する問題**」です。
> Pythonで解く際の特徴として、`TreeNode` はPure Pythonクラスのため属性アクセスは軽量ですが、**再帰呼び出しはCPythonのデフォルトスタック上限（`sys.getrecursionlimit()` = 1000）に近づく可能性があります**。ノード数が最大1000なので、最悪ケースの一直線の木では再帰深度が1000に達しうることを頭に入れておく必要があります。

---

### 🖼️ まず「対称」を視覚的に理解する

```
【対称な木 ✅】              【非対称な木 ❌】

       1                           1
      / \                         / \
     2   2                       2   2
    / \ / \                       \   \
   3  4 4  3                       3   3

中心軸を境に                    右の2にleftがなく
左右が完全に鏡写し              rightしかないので非対称
```

「鏡写し」の条件を3つに分解すると：

1. 左右の値が同じか？
2. 左の「左子」↔ 右の「右子」が鏡写しか？（外側ペア）
3. 左の「右子」↔ 右の「左子」が鏡写しか？（内側ペア）

---

### 競技プログラミング視点

- **制約分析**：ノード数1〜1000と小さいため、全ノードを1回訪問する O(n) で十分
- **最速手法**：再帰DFS。Pythonの関数呼び出しコストはあるが、ノード数1000では問題なし
- **CPython最適化**：`and` の短絡評価（＝左辺がFalseなら右辺を評価しない仕組み）で無駄な再帰を早期カット

### 業務開発視点

- **型安全設計**：docstringの `:type:` / `:rtype:` で型情報を明示（Python 2スタイルテンプレートのため）
- **エラーハンドリング**：`None` チェックをパターンマッチングで網羅的に処理
- **可読性**：ヘルパーメソッド `_is_mirror` を分離し、責務（＝その関数が担う役割）を明確に分ける

### Python特有分析

- **データ構造選択**：反復版は `collections.deque` を使う（`list.pop(0)` はO(n)だが `deque.popleft()` はO(1)）
- **再帰 vs 反復**：再帰はコードが直感的。反復は `deque` でスタック深度制限を回避できる
- **CPython最適化**：`deque` はC実装のため `list` の先頭削除より大幅に高速

> 📖 **このセクションで登場した用語**
>
> - **CPython**：最も広く使われるPythonの実装。C言語で書かれており、`deque`など標準ライブラリの多くがC実装のため高速
> - **短絡評価**：`A and B` でAがFalseなら、Bをまったく評価しない仕組み。無駄な処理を省ける
> - **スタック深度制限**：Pythonの再帰呼び出しはデフォルトで1000回まで。それを超えると `RecursionError` が発生する
> - **O(n) vs O(1)**：`list.pop(0)` はリスト全体をずらすのでO(n)。`deque.popleft()` は先頭を直接取り出すのでO(1)

---

## 2. 採用アルゴリズムと根拠

> 💡 **初学者向け補足**：同じ問題でも解き方は複数あります。「速さ（時間計算量）」と「メモリの使いやすさ（空間計算量）」を比べて最適なものを選びます。問題文のフォローアップが「再帰・反復の両方を実装せよ」なので、両方解説します。

| アプローチ              | 時間計算量 | 空間計算量 | Python実装コスト | 可読性 | 標準ライブラリ活用           | CPython最適化 | 備考                                 |
| ----------------------- | ---------- | ---------- | ---------------- | ------ | ---------------------------- | ------------- | ------------------------------------ |
| **A: 再帰（DFS）**      | O(n)       | O(h)※      | 低               | ★★★    | なし                         | 適            | コードが「定義そのもの」で読みやすい |
| **B: 反復（deque）**    | O(n)       | O(w)※※     | 中               | ★★☆    | `collections.deque`（C実装） | 適            | RecursionError回避に強い             |
| **C: 配列シリアライズ** | O(n)       | O(n)       | 高               | ★☆☆    | なし                         | 不適          | list生成が多く非効率                 |

> ※ **h = 木の高さ**。最悪O(n)（一直線の木）、平均O(log n)（バランス木）
> ※※ **w = 木の最大幅**。最悪O(n)（完全二分木の最下段にノードが集中）

- **選択理由**：A（再帰）は「鏡写しの定義」がコードに直接現れ可読性が最高。バランス木であれば問題ないが、一直線の木（最悪ケース）ではCPythonのデフォルト再帰上限（約1000）に達しRecursionErrorになるリスクがある（冒頭の説明や用語解説、反復版のコメントも参照）。フォローアップとしてB（反復）も実装
- **Python最適化戦略**：反復版には `deque`（C実装・`popleft()` がO(1)）を採用。`list.pop(0)` はO(n)のため不可
- **トレードオフ**：再帰は読みやすいがスタック深度に依存。反復は少し複雑になるがスタック無制限

> 💡 **Big-O記法の読み方**（初学者向け）
>
> - `O(1)`：入力の大きさに関わらず、常に一定の時間・メモリで済む（最速・最小）
> - `O(n)`：入力が2倍になると、処理も約2倍になる（線形）
> - `O(n log n)`：入力が2倍になると、処理は約2倍強になる（ソートアルゴリズムに多い）
> - `O(n²)`：入力が2倍になると、処理は約4倍になる（二重ループに多い）

---

> 📖 **このセクションで登場した用語**
>
> - **時間計算量**：入力の大きさに対して処理にかかる手間がどう増えるかの目安
> - **空間計算量**：処理中に使うメモリ量がどう増えるかの目安
> - **トレードオフ**：何かを得ると何かを失う関係。再帰は読みやすいがスタックを消費する、など
> - **C実装**：Pythonコードではなく、内部でC言語で実装された関数。Pure Pythonより大幅に高速

---

## 3. 実装パターン

> 💡 **コードの骨格（全体像）**
>
> 1. `isSymmetric`：エントリーポイント。`root` を受け取りヘルパーに渡す
> 2. `_is_mirror`（再帰版）：2つのノードが鏡写しかを再帰で確認するヘルパー
> 3. `isSymmetricIterative`（反復版）：`deque` でペアを順番に確認する

---

### 【業務開発版を使う場面】

チームで長期間メンテナンスするプロダクションコードに向きます。
docstringを充実させ、エラーの原因が分かりやすく後から読んだ人が理解しやすい構造になっています。

```python
from collections import deque


# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution(object):
    """
    Symmetric Tree 解決クラス（業務開発版）

    二分木が中心軸に対して鏡写しかどうかを判定する。
    再帰（DFS）と反復（BFS with deque）の2パターンを提供する。
    """

    # =============================================
    # 解法①: 再帰版（メイン）
    # =============================================
    def isSymmetric(self, root):
        """
        二分木が鏡写し（対称）かどうかを再帰で判定する。

        :type  root: Optional[TreeNode]
        :rtype: bool

        Time:  O(n) - 全ノードを1回ずつ訪問する
        Space: O(h) - 再帰スタックの深さ（h = 木の高さ）
        """
        # rootがNone（空の木）は定義上「対称」とする
        # LeetCodeの制約では最低1ノードあるが、型上Noneがあり得るため処理する
        if root is None:
            return True

        # rootの左子と右子が「鏡写し」かをヘルパーで確認する
        # rootそのものは中心軸なので比較対象にならない
        return self._is_mirror(root.left, root.right)

    def _is_mirror(self, left, right):
        """
        2つのノードが「鏡写し」の関係かどうかを再帰的に確認するヘルパー。

        鏡写しの条件（3つ全てを満たす必要がある）:
            1. 左右の値が等しい
            2. 左の「左子」と右の「右子」が鏡写し（外側ペア）
            3. 左の「右子」と右の「左子」が鏡写し（内側ペア）

        :type  left:  Optional[TreeNode]
        :type  right: Optional[TreeNode]
        :rtype: bool
        """
        # ケース①: 両方Noneなら「空同士」= 対称 → True
        # 例: 葉ノードの子（存在しない位置）同士を比較した場合
        if left is None and right is None:
            return True

        # ケース②: 片方だけNoneなら「一方だけ枝がある」= 非対称 → False
        # `is None` を使う理由: `== None` より高速（同一性チェック）かつ
        # Pythonの慣用的な書き方（イディオム）
        if left is None or right is None:
            return False

        # ケース③: 両方ノードが存在する場合
        # 3条件を and で繋いで確認する。
        # and の短絡評価（= 左辺がFalseなら右辺を評価しない仕組み）により
        # 値が違った時点で即座にFalseを返し、無駄な再帰を省く
        return (
            left.val == right.val                          # 条件1: 値が同じか？
            and self._is_mirror(left.left, right.right)   # 条件2: 外側ペア
            and self._is_mirror(left.right, right.left)   # 条件3: 内側ペア
        )

    # =============================================
    # 解法②: 反復版（フォローアップ）
    # =============================================
    def isSymmetricIterative(self, root):
        """
        二分木が鏡写しかどうかを反復（deque使用）で判定する。
        再帰の深さ制限（RecursionError）が心配な場合に使う代替実装。

        dequeを使う理由:
            list.pop(0) は O(n)（先頭削除のたびに全要素をずらす）
            deque.popleft() は O(1)（C実装の双方向リストのため高速）

        :type  root: Optional[TreeNode]
        :rtype: bool

        Time:  O(n) - 全ノードを1回ずつ訪問する
        Space: O(w) - wは木の最大幅（dequeに入るペアの最大数）
        """
        # rootがNoneなら空の木 → 対称
        if root is None:
            return True

        # dequeに「比較すべきノードのペア」をタプルで格納する。
        # タプル (左ノード, 右ノード) を順番に取り出して比較していく。
        # deque（デック）= 両端開きの箱: popleft() がO(1) でlistより高速
        queue = deque()

        # 最初のペア: rootの左子と右子をキューに追加
        queue.append((root.left, root.right))

        # キューが空になるまで（= 全ペアの確認が終わるまで）繰り返す
        while queue:
            # popleft() でキューの先頭からペアを取り出す
            # FIFO（先入れ先出し）= 最初に追加したペアから順番に処理する
            left, right = queue.popleft()

            # ケース①: 両方NoneならこのペアはOK → 次のペアへ
            if left is None and right is None:
                continue

            # ケース②: 片方だけNone → 非対称確定
            if left is None or right is None:
                return False

            # ケース③: 値が違う → 非対称確定
            if left.val != right.val:
                return False

            # 次に確認すべき「鏡ペア」をキューに積む
            queue.append((left.left, right.right))  # 外側ペア
            queue.append((left.right, right.left))  # 内側ペア

        # 全ペアをパスしたので対称
        return True
```

---

> 💡 **再帰版のトレース** — Example 1: `[1,2,2,3,4,4,3]`

```
       1
      / \
     2   2
    / \ / \
   3  4 4  3

isSymmetric(root=1)
└─ _is_mirror(left=Node(2), right=Node(2))
     ├─ 2 == 2 ✅
     ├─ _is_mirror(left=Node(3), right=Node(3))  ← 外側ペア
     │    ├─ 3 == 3 ✅
     │    ├─ _is_mirror(None, None) → True ✅
     │    └─ _is_mirror(None, None) → True ✅
     │    → True ✅
     └─ _is_mirror(left=Node(4), right=Node(4))  ← 内側ペア
          ├─ 4 == 4 ✅
          ├─ _is_mirror(None, None) → True ✅
          └─ _is_mirror(None, None) → True ✅
          → True ✅
→ True ✅ 最終結果: True

Example 2: [1,2,2,null,3,null,3]
_is_mirror(left=Node(2), right=Node(2))
  ├─ 2 == 2 ✅
  └─ _is_mirror(left=None, right=Node(3))  ← 外側ペア
       → 片方だけNone → False ❌ ← 短絡評価でここで即終了！
→ False ❌ 最終結果: False
```

> 💡 **反復版のトレース** — Example 1: `[1,2,2,3,4,4,3]`

```
初期状態: queue = [(Node(2), Node(2))]

─── ループ1回目 ───
取り出し: (Node(2), Node(2))
  left.val=2, right.val=2 → 2==2 ✅
  外側ペア追加: (Node(3), Node(3))
  内側ペア追加: (Node(4), Node(4))
queue = [(Node(3),Node(3)), (Node(4),Node(4))]

─── ループ2回目 ───
取り出し: (Node(3), Node(3))
  3==3 ✅
  追加: (None,None) × 2
queue = [(Node(4),Node(4)), (None,None), (None,None)]

─── ループ3回目 ───
取り出し: (Node(4), Node(4))
  4==4 ✅ → (None,None) × 2 追加
queue = [(None,None) × 4]

─── ループ4〜7回目 ───
(None, None) → continue（スキップ）× 4回

queue = [] → while が False → ループ終了
→ return True ✅
```

---

### 【競技プログラミング版を使う場面】

LeetCodeなどで制限時間内に正解を出すことが目的のコードに向きます。
docstringを最小限にし、実行速度・コードの短さを優先した書き方になっています。

```python
from collections import deque


class Solution(object):
    def isSymmetric(self, root):
        """
        :type root: Optional[TreeNode]
        :rtype: bool
        """
        # ローカル関数にすることで self 参照のオーバーヘッドを削減する
        # （毎回 self._is_mirror と辞書引きする分のコストを省く微小最適化）
        def is_mirror(left, right):
            # 両方Noneなら対称
            if left is None and right is None:
                return True
            # 片方だけNoneなら非対称
            if left is None or right is None:
                return False
            # 値比較 + 外側・内側ペアを再帰確認（and の短絡評価を活用）
            return (
                left.val == right.val
                and is_mirror(left.left, right.right)
                and is_mirror(left.right, right.left)
            )

        # rootがNoneなら対称（空の木）
        # `or` の短絡評価: rootがNoneなら is_mirror を呼ばずに True を返す
        return root is None or is_mirror(root.left, root.right)
```

---

## 4. 検証

> 💡 **初学者向け補足**：エッジケースとは「入力が空・最小値・最大値・重複あり」など、
> 通常とは異なる境界的な入力のことです。エッジケースのテストは、アルゴリズムが
> "ふつうの入力"だけでなく"極端な入力"でも正しく動くかを確かめるためのものです。

| ケース               | 入力                    | 期待出力 | 理由                      |
| -------------------- | ----------------------- | -------- | ------------------------- |
| 基本ケース（対称）   | `[1,2,2,3,4,4,3]`       | `True`   | 左右が完全に鏡写し        |
| 基本ケース（非対称） | `[1,2,2,null,3,null,3]` | `False`  | 内側の子の位置が非対称    |
| ノード1個            | `[1]`                   | `True`   | 左右の子が両方None → 対称 |
| 値は同じ・構造が違う | `[1,2,2,null,3,3,null]` | `True`   | 鏡写しの構造を満たす      |
| 全て同じ値           | `[1,1,1,1,1,1,1]`       | `True`   | 値もノード数も対称        |
| 一直線（左偏り）     | `[1,2,null,3]`          | `False`  | 右サブツリーが存在しない  |

> 📖 **このセクションで登場した用語**
>
> - **エッジケース**：空のリスト・要素1つ・最大サイズ入力など、境界的な条件のこと
> - **境界値テスト**：エッジケースに対してもアルゴリズムが正しく動くかを確かめること
> - **静的解析**：プログラムを実行せずに、コードを読むだけでバグや型エラーを検出する手法

---

## 計算量まとめ

| 解法                   | 時間計算量 | 空間計算量           |
| ---------------------- | ---------- | -------------------- |
| 再帰（DFS）            | O(n)       | O(h) — hは木の高さ   |
| 反復（BFS with deque） | O(n)       | O(w) — wは木の最大幅 |

どちらも全ノードを1回ずつ訪問するため **O(n)** です。
空間計算量は木の形状によりますが、最悪ケースはどちらも **O(n)** です（一直線の木 / 完全二分木の最下段にノードが集中する場合）。

---

## Python特有の追加考慮事項

### このテンプレート（`class Solution(object)`）のルール

```
class Solution(object):        ← Python 2 スタイル（object継承）
    def isSymmetric(self, root):
        """
        :type root: Optional[TreeNode]   ← 型はdocstringに書く
        :rtype: bool                     ← 戻り値の型もdocstringに
        """

✅ 使える:  from collections import deque（標準ライブラリ）
❌ 使えない: 引数の型アノテーション（root: Optional[TreeNode]）
❌ 使えない: 戻り値アノテーション（-> bool）
❌ 不要:     from typing import Optional
❌ 禁止:     from __future__ import annotations（先頭行にしか置けないため）
```

### `collections.deque` の仕組み

```
list.pop(0) の場合（O(n)）:
  [1, 2, 3, 4, 5]
   ↑ 取り出す
  → [_, 2, 3, 4, 5] → 全要素を左に1つずらす → [2, 3, 4, 5]
  ノード数が増えるほど遅くなる！

deque.popleft() の場合（O(1)）:
  双方向リスト: 先頭ポインタを1つ進めるだけ
  ノード数が増えても常に一定の速度！
```

> 📖 **最終まとめ用語集**
>
> - **`is None`**：PythonのイディオムでNoneとの比較に使う。`== None` より高速（同一性チェック）でpylance推奨
> - **`collections.deque`**：両端開きのキュー。C実装のため `list.pop(0)` （O(n)）より `popleft()` （O(1)）が大幅に高速
> - **FIFO（先入れ先出し）**：First In First Out。キューの動作原則。最初に入れたものを最初に取り出す
> - **短絡評価**：`A and B` でAがFalseなら、Bをまったく評価せず即Falseを返す。無駄な関数呼び出しを省ける
> - **ローカル関数**：関数の中に定義した関数。`self.` 参照が不要になりわずかに高速
> - **docstringの `:type:` / `:rtype:`**：型アノテーションが使えない環境で型情報を伝えるコメント形式
