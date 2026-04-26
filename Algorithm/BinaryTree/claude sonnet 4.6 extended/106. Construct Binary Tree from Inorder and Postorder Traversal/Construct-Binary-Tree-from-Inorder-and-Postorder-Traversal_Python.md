> 🎯 **[algo-beginner スキル発火]**
> 言語/カテゴリ: Python (CPython 3.11.10)
> 適用ルールセット: 共通5ルール + Python固有ルール
> 参照ファイル: references/common.md + references/python.md

---

# LeetCode 106 · Construct Binary Tree from Inorder and Postorder Traversal（Python版）

---

## 1. 問題分析結果

> 💡 **この問題を一言で言うと？**
> 「2種類の木の巡回記録（Inorder・Postorder）を手がかりに、元の二分木を復元する問題」です。

### 🐍 Pythonで解く際のCPython特有の注意点

Pythonの再帰のデフォルト上限は **1000回** です（`sys.getrecursionlimit()` で確認できます）。入力サイズ上限が3000の本問題では、最悪ケース（完全に偏った木）で再帰が3000段になる可能性があります。競技版では `sys.setrecursionlimit()` で上限を引き上げるか、**`dict`（辞書）による O(1) のインデックス検索**と再帰の組み合わせで深さを抑える設計が重要です。また、`list.index()` は内部でC実装の線形探索を行いますが、それでも毎回呼ぶと O(n²) になるため、**事前に `dict` で値→インデックスのマッピングを構築**するのがPythonらしい最適解です。

### 競技プログラミング視点

- **制約分析**: n ≤ 3000 → O(n²) は最大900万操作 → TLE（時間超過）の危険あり → **O(n) が必要**
- **最速手法**: `dict` による O(1) インデックス引き → `postorder.pop()` による O(1) 末尾取り出し
- **CPython最適化**: `list.pop()` は末尾削除のみ O(1)（先頭削除は O(n) なので注意）。`postorder` を直接 `pop()` することでコピー不要

### 業務開発視点

- **型安全設計**: `Optional[TreeNode]`、`List[int]` を pylance が正しく推論できる形で記述
- **エラーハンドリング**: 長さ不一致・空入力・値の範囲外などをバリデーション層で検出
- **可読性**: ヘルパー関数を分離してメインロジックを読みやすく保つ

### Python特有分析

- **データ構造選択**: `dict` で「値 → Inorderの位置」を O(1) 検索。`list.index()` より大幅に高速
- **`postorder.pop()`**: リストの末尾削除は O(1)。末尾から消費することで配列コピーが不要
- **再帰深度**: `sys.setrecursionlimit(10000)` で上限を引き上げて安全に動作させる

> 📖 **このセクションで登場した用語**
> - **CPython**: 最も広く使われるPythonの実装。C言語で書かれており、`list.pop()` などの組み込み操作がC実装のため高速
> - **再帰上限（recursion limit）**: Pythonが再帰呼び出しを何段まで許可するかの上限。デフォルト1000
> - **O(1)**: 入力サイズに関わらず常に一定時間で処理が終わること
> - **TLE（Time Limit Exceeded）**: LeetCodeで処理時間が制限を超えた時のエラー

---

## 2. 採用アルゴリズムと根拠

> 💡 **なぜ複数のアプローチを比較するのか？**
> 同じ問題でも実装方法によって速さもメモリ消費も大きく変わります。Pythonでは特に「C実装の組み込み関数を使えるか」「余計なリストコピーが発生しないか」がパフォーマンスに直結します。

| アプローチ | 時間計算量 | 空間計算量 | Python実装コスト | 可読性 | 標準ライブラリ活用 | CPython最適化 | 備考 |
|---|---|---|---|---|---|---|---|
| A: 毎回 `.index()` で線形探索 | O(n²) | O(n) | 低 | ★★★ | なし | 不適（Pure Python ループ） | シンプルだが大入力でTLE |
| **B: dict事前構築 + pop()（採用）** | O(n) | O(n) | 低 | ★★★ | dict, list.pop() | **適（C実装の dict ハッシュ）** | 最もバランスが良い |
| C: スライスで部分配列コピー | O(n²) | O(n²) | 低 | ★★☆ | なし | 不適（コピー多発） | メモリ非効率 |

**選択理由**: アプローチBは `dict` の `__getitem__` がC実装のハッシュテーブル検索（O(1)）であり、`list.pop()` も末尾削除はC実装のO(1)です。Pure Pythonのループを最小限に抑えられるため、CPython環境で最も高速になります。

> 📖 **このセクションで登場した用語**
> - **ハッシュテーブル**: `dict` の内部構造。キーをハッシュ値に変換することで、O(1)で値を検索できる辞書構造
> - **`list.pop()`**: リストの末尾要素を取り出して削除するメソッド。末尾はO(1)、先頭（`pop(0)`）はO(n)なので注意
> - **Pure Python**: C実装に頼らず、Pythonコードで書かれた処理。C実装より遅くなる傾向がある
> - **スライス**: `arr[1:3]` のように配列の一部を取り出す操作。新しいリストを生成するためメモリコストがかかる

---

## 3. 実装パターン

> 💡 **コードの骨格（先に全体像を把握）**
> 1. `dict` で「Inorderの値 → インデックス」を O(n) で一括構築する
> 2. `postorder` をリストのまま保持し、末尾から `pop()` でルートを1つずつ取り出す
> 3. 再帰ヘルパーが `inorder` の左端・右端インデックスを引数に受け取り、範囲が空なら `None` を返す
> 4. **右部分木を先に再帰**してから左部分木を再帰する（Postorderの消費順序が「逆順＝右→左」のため）

---

### 【業務開発版を使う場面】

チームで長期間メンテナンスするプロダクションコードに向きます。入力値の検証・型ヒント・docstring が充実しており、後から読んだ人が処理の意図を理解しやすい構造になっています。バグが起きたとき原因を特定しやすいのも特徴です。

```python
import sys
from typing import List, Optional

# TreeNode は LeetCode 環境で定義済みのため、ここでは型ヒントとして参照するだけ
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def buildTree(self, inorder: List[int], postorder: List[int]) -> Optional[TreeNode]:
        """
        Inorder と Postorder の走査結果から二分木を復元する（業務開発版）。

        Args:
            inorder:   中順走査（左→自分→右）の結果リスト
            postorder: 後順走査（左→右→自分）の結果リスト

        Returns:
            復元された二分木のルートノード。空の場合は None。

        Raises:
            ValueError: 入力が空、または長さが一致しない場合
            TypeError:  要素が int でない場合
        """
        # ── 入力バリデーション ──────────────────────────────────────────────
        # isinstance() で型チェック。Pythonは動的型付けなので
        # 呼び出し元が誤った型を渡しても実行時まで気づかない。
        # pylance と組み合わせることで静的チェックも可能になる。
        if not isinstance(inorder, list) or not isinstance(postorder, list):
            raise TypeError("inorder と postorder はリストである必要があります")

        if len(inorder) != len(postorder):
            raise ValueError(
                f"inorder({len(inorder)}) と postorder({len(postorder)}) の長さが一致しません"
            )

        # 空入力はそのまま None を返す（エラーではなく正常なエッジケース）
        if not inorder:
            return None

        # 要素の型チェック：any() は最初に True が見つかった時点で停止するC実装の関数
        # （all() の逆。「1つでも非intがあれば True」）
        if any(not isinstance(x, int) for x in inorder):
            raise TypeError("inorder の全要素は int である必要があります")

        # ── 再帰深度の設定 ─────────────────────────────────────────────────
        # Python のデフォルト再帰上限は1000。
        # 入力上限3000の本問題では最悪ケースで3000段の再帰が必要なため、
        # 安全のために上限を引き上げる。
        sys.setrecursionlimit(10000)

        # ── HashMap の事前構築 ─────────────────────────────────────────────
        # dict内包表記（＝dictを1行で簡潔に作る書き方）で
        # 「値 → inorder上のインデックス」を記録する。
        # list.index() を毎回呼ぶと O(n) × n回 = O(n²) になるため、
        # 1回だけ O(n) で構築しておくことですべての検索を O(1) に短縮できる。
        inorder_index: dict[int, int] = {val: idx for idx, val in enumerate(inorder)}

        # postorder はリストのまま保持し、末尾から pop() で消費する。
        # pop() の末尾削除は O(1)（C実装）なので、配列コピーが不要。
        # ただし元のリストを破壊的に変更するため、コピーを渡す。
        post = postorder.copy()  # 呼び出し元のリストを変更しないよう shallow copy

        def helper(in_left: int, in_right: int) -> Optional[TreeNode]:
            """
            inorder[in_left..in_right] の範囲に対応する部分木を構築する。

            Args:
                in_left:  処理対象の inorder 左端インデックス（境界値を含む）
                in_right: 処理対象の inorder 右端インデックス（境界値を含む）

            Returns:
                構築した部分木のルートノード。範囲が空なら None。
            """
            # 終了条件：左端が右端を超えた = この範囲に要素がない
            # 例: in_left=2, in_right=1 のとき空の部分木 → None を返す
            if in_left > in_right:
                return None

            # post の末尾から現在のルートの値を取り出す
            # list.pop() は末尾削除で O(1)。先頭削除 pop(0) は O(n) なので使わない
            root_val: int = post.pop()

            # 取り出した値で新しいノードを作成
            node = TreeNode(root_val)

            # O(1) で inorder 上のルートのインデックスを取得
            root_idx: int = inorder_index[root_val]

            # ── 重要：右部分木を先に再帰する理由 ────────────────────────
            # postorder は「左→右→ルート」の順なので、
            # 末尾から逆順に取り出すと「ルート→右→左」の順になる。
            # つまり pop() した直後の次の末尾は「右部分木のルート」。
            # 左を先にすると postorder の消費順序がずれて誤った木になる。
            # ─────────────────────────────────────────────────────────────
            # 右部分木: inorder の root_idx+1 〜 in_right の範囲
            node.right = helper(root_idx + 1, in_right)

            # 左部分木: inorder の in_left 〜 root_idx-1 の範囲
            node.left  = helper(in_left, root_idx - 1)

            return node

        # inorder の全範囲（0 〜 len-1）を対象に木を構築する
        return helper(0, len(inorder) - 1)
```

---

### 【競技プログラミング版を使う場面】

LeetCodeなど、制限時間内に正解を出すことが目的のコードに向きます。型チェックやエラーハンドリングを省略し、`nonlocal` を使ってクロージャ変数を共有することで最短・最速の実装を目指しています。

```python
# Runtime 3 ms
# Beats 73.59%
# Memory 21.05 MB
# Beats 76.84%

import sys
from typing import List, Optional

class Solution:
    def buildTree(self, inorder: List[int], postorder: List[int]) -> Optional[TreeNode]:
        """
        競技プログラミング版: 速度・簡潔さ優先。
        Time:  O(n)  ← dict で O(1) 検索 × n回
        Space: O(n)  ← dict O(n) + 再帰スタック O(h)
        """
        # 再帰上限を引き上げる（入力上限3000に備えて余裕を持たせる）
        sys.setrecursionlimit(10000)

        # dict内包表記で「値 → inorderのインデックス」を一括構築（O(n)）
        # これにより各再帰ステップでの検索コストを O(n) → O(1) に短縮できる
        idx_map: dict[int, int] = {v: i for i, v in enumerate(inorder)}

        # postorder をリストのまま末尾から pop() で消費するポインタ代わりに使う
        # nonlocal は外側スコープの変数を内側の関数で書き換えるための宣言
        # （Pythonでは関数内で外側の変数を「読む」だけなら nonlocal 不要だが
        #   「書き換える」ときは必ず nonlocal が必要）
        post_idx: list[int] = [len(postorder) - 1]  # リストで包むことで nonlocal 不要に

        def dfs(left: int, right: int) -> Optional[TreeNode]:
            # 終了条件: 処理対象範囲が空 → この部分木は存在しない
            if left > right:
                return None

            # postorder の現在位置からルートの値を取得し、カーソルを1つ前に進める
            # post_idx[0] とリストで包むのは、Pythonで「内側関数から外側の int 変数を
            # 書き換える」には nonlocal が必要なため、リストを使うことで回避する慣用句
            val: int = postorder[post_idx[0]]
            post_idx[0] -= 1

            # 新しいノードを作成し、右→左の順で再帰（postorder の消費順に合わせる）
            node = TreeNode(val)
            mid: int = idx_map[val]    # O(1) でルートのinorder位置を取得

            # 右部分木を先に再帰（postorderの末尾からの消費順が「ルート→右→左」のため）
            node.right = dfs(mid + 1, right)
            node.left  = dfs(left, mid - 1)
            return node

        return dfs(0, len(inorder) - 1)
```

---

## 4. 動作トレース（入力例での変数変化）

**入力:** `inorder = [9,3,15,20,7]`, `postorder = [9,15,7,20,3]`

```
事前準備:
  idx_map = { 9:0, 3:1, 15:2, 20:3, 7:4 }
  post_idx[0] = 4（末尾から開始）

──────────────────────────────────────────────────────────
dfs(left=0, right=4)   ← inorder全体 [9,3,15,20,7]
  val  = postorder[4] = 3    post_idx[0]: 4 → 3
  mid  = idx_map[3] = 1
  node = TreeNode(3)
  ┌─ 先に右部分木を再帰 ──────────────────────────────┐
  │ dfs(left=2, right=4)  ← [15, 20, 7] の範囲       │
  └────────────────────────────────────────────────────┘

──────────────────────────────────────────────────────────
dfs(left=2, right=4)
  val  = postorder[3] = 20   post_idx[0]: 3 → 2
  mid  = idx_map[20] = 3
  node = TreeNode(20)
  ┌─ 先に右部分木 ─────────────────────────────────────┐
  │ dfs(left=4, right=4)  ← [7] の範囲                │
  └────────────────────────────────────────────────────┘

──────────────────────────────────────────────────────────
dfs(left=4, right=4)   ← [7] の範囲
  val  = postorder[2] = 7    post_idx[0]: 2 → 1
  mid  = idx_map[7] = 4
  node = TreeNode(7)
  dfs(5, 4) → left(5) > right(4) → None  ← 右なし
  dfs(4, 3) → left(4) > right(3) → None  ← 左なし
  return TreeNode(7) ✅ （葉ノード）

──────────────────────────────────────────────────────────
dfs(left=2, right=4) に戻る
  node(20).right = TreeNode(7)
  左部分木: dfs(left=2, right=2) ← [15] の範囲

dfs(left=2, right=2)
  val  = postorder[1] = 15   post_idx[0]: 1 → 0
  mid  = idx_map[15] = 2
  node = TreeNode(15)
  dfs(3, 2) → None, dfs(2, 1) → None
  return TreeNode(15) ✅ （葉ノード）

dfs(left=2, right=4) に戻る
  node(20).left = TreeNode(15)
  return TreeNode(20) ✅

──────────────────────────────────────────────────────────
dfs(left=0, right=4) に戻る
  node(3).right = TreeNode(20)
  左部分木: dfs(left=0, right=0) ← [9] の範囲

dfs(left=0, right=0)
  val  = postorder[0] = 9    post_idx[0]: 0 → -1
  mid  = idx_map[9] = 0
  node = TreeNode(9)
  dfs(1, 0) → None, dfs(0, -1) → None
  return TreeNode(9) ✅ （葉ノード）

dfs(left=0, right=4) に戻る
  node(3).left = TreeNode(9)

最終結果:
        3
       / \
      9   20
         /  \
        15    7
return TreeNode(3) ✅
```

---

## 5. 計算量まとめ

| 指標 | 値 | 理由 |
|---|---|---|
| **時間計算量** | O(n) | dict構築O(n) + 各ノードを1回だけ処理O(n) |
| **空間計算量** | O(n) | dict O(n) + 再帰スタック O(h)（h=木の高さ、最悪O(n)） |

---

## 6. Python固有の設計観点

### `nonlocal` vs リストで包む慣用句

```python
# 問題：Pythonの内側関数から外側の int 変数を「書き換える」には nonlocal が必要
# しかし nonlocal は変数名のスコープを変えるため、
# リストで包む（ミュータブルオブジェクトに変換する）ことで回避できる

# 方法1: nonlocal を使う（明示的だが宣言が必要）
count = 0
def inner():
    nonlocal count   # ← これがないと count += 1 で UnboundLocalError になる
    count += 1

# 方法2: リストで包む（nonlocal 不要・慣用句として広く使われる）
count = [0]          # int ではなく list[int] にする
def inner():
    count[0] += 1    # リストの中身を書き換えるのは「外側変数の再代入」ではない
                     # → nonlocal 不要
```

### dict内包表記 vs `enumerate()` + ループ

```python
# どちらも同じ結果になるが、dict内包表記はCPythonのバイトコード最適化が効く
# （純粋なforループより高速）

# 方法1: dict内包表記（推奨・高速）
idx_map = {v: i for i, v in enumerate(inorder)}

# 方法2: 通常のforループ（同等だがわずかに遅い）
idx_map = {}
for i, v in enumerate(inorder):
    idx_map[v] = i
# どちらも O(n) だが、内包表記はインタープリタのオーバーヘッドが少ない
```

> 📖 **このセクションで登場した用語**
> - **dict内包表記**: `{k: v for ...}` の形でdictを1行で作る書き方。forループより高速でPythonらしい書き方
> - **nonlocal**: 内側の関数が外側スコープの変数を「書き換える」ことを宣言するキーワード
> - **ミュータブル（Mutable）**: 作成後も値を変更できるオブジェクト。`list`・`dict`・`set` がこれに当たる
> - **クロージャ**: 外側スコープの変数を参照し続ける内側の関数。`dfs` 関数が `idx_map` や `post_idx` を参照するのがその例
> - **`sys.setrecursionlimit()`**: Pythonの再帰上限を変更する関数。デフォルト1000を超える再帰が必要な場合に使う
> - **エッジケース**: 空のリスト・要素1つ・最大サイズ入力など、境界的な条件のこと。これらで正しく動くか確認することが重要
