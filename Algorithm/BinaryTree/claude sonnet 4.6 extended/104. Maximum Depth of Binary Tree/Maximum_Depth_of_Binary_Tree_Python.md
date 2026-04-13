> 🎯 **[algo-beginner スキル発火]**
> 言語/カテゴリ: Python（CPython 3.11.10 / LeetCode class形式）
> 適用ルールセット: 共通5ルール + Python固有4ルール
> 参照ファイル: references/common.md + references/python.md

---

# 104. Maximum Depth of Binary Tree（Python版）

---

## 1. 問題の分析

> 💡 **一言で言うと**：「二分木（＝各ノードが最大2つの子を持つ木構造データ）の根（root）から一番遠い葉（末端ノード）まで、何段あるかを数える問題」です。

### Pythonで解く際の特有の注意点

PythonのLeetCode環境では`TreeNode`クラスは定義済みで使えます。Pythonは動的型付け言語（＝変数の型を実行時に決める言語）なので、型ヒントがないと`root`が`None`なのか`TreeNode`なのかをpylanceが判断できません。`Optional[TreeNode]`（＝`TreeNode`または`None`のどちらか）という型ヒントを明示することで、pylanceが実行前にバグを検出できるようになります。再帰（＝関数が自分自身を呼び出す仕組み）はPythonではデフォルトで再帰深度が1000に制限されていますが、制約のノード数最大10^4でも木が完全に偏った場合（一本道）にはこの制限に引っかかる可能性があります。競技版ではこの点も補足します。

### 競技プログラミング視点

- **制約分析**：ノード数 ≤ 10^4。O(n)で十分間に合う
- **最速手法**：再帰DFS（深さ優先探索）。Pythonの`max()`はC実装なので比較処理がネイティブ速度
- **メモリ最小化**：再帰コールスタックのみ（追加データ構造不要）。ただし偏った木では深さ最大10^4のスタックが積まれる

### 業務開発視点

- **型安全設計**：`Optional[TreeNode]`で`None`の可能性を型レベルで明示。pylanceが`root.left`への誤アクセスを事前検出
- **エラーハンドリング**：制約範囲内（ノード数0〜10^4・値-100〜100）の入力しか来ないためバリデーションは最小限に。空の木（`root=None`）はアルゴリズムのベースケースで自然に処理

### Python特有の分析

- **`max()` の活用**：`max(left, right)`はC実装の組み込み関数なので、`if left > right: return left`よりも高速かつ可読性が高い
- **再帰vs反復**：CPythonのデフォルト再帰制限（1000）を考慮し、巨大入力には`collections.deque`を使ったBFS版も提供する

> 📖 **このセクションで登場した用語**
>
> - **CPython**：最も広く使われるPythonの実装。C言語で書かれており、`max()`や`min()`などの組み込み関数はC言語レベルで動作するため高速
> - **`Optional[T]`**：「`T`型またはNone」を表す型ヒント。`from typing import Optional`でインポートする。Python 3.10以降は`T | None`と書ける
> - **動的型付け**：変数の型を実行時に決める仕組み。Pythonはこれを採用しており、型ヒントを書かないとpylanceが型エラーを検出できない
> - **再帰深度制限**：CPythonのデフォルトでは再帰は約1000回まで。`sys.setrecursionlimit()`で変更可能

---

## 2. アルゴリズムアプローチ比較

> 💡 同じ問題でも解き方は複数あります。Pythonでは「C実装の組み込み関数を使えるか」「追加のデータ構造が必要か」もパフォーマンス上の重要な判断基準です。

| アプローチ              | 時間計算量 | 空間計算量 | Python実装コスト | 可読性 | 標準ライブラリ活用   | CPython最適化 | 備考               |
| ----------------------- | ---------- | ---------- | ---------------- | ------ | -------------------- | ------------- | ------------------ |
| **① DFS 再帰**          | O(n)       | O(h)       | 低               | ★★★    | `max()`（C実装）     | ◎             | 最もシンプル       |
| **② BFS 反復（deque）** | O(n)       | O(w)       | 中               | ★★☆    | `collections.deque`  | ○             | 再帰制限を回避     |
| **③ DFS 反復（stack）** | O(n)       | O(h)       | 中               | ★☆☆    | `list`をスタック代用 | △             | 型が複雑になりがち |

> 💡 **各アプローチのPython固有の観点**
>
> - **① DFS再帰**：`max()`がC実装なので比較が最速。ただしCPythonの再帰制限に注意
> - **② BFS（deque）**：`collections.deque`の`popleft()`はO(1)（`list.pop(0)`はO(n)なので使ってはいけない）。再帰制限を完全に回避できる
> - **③ DFS反復**：`list`をスタック代わりに使うが、`append()/pop()`がO(1)なので性能は問題なし。ただし可読性が最も低い
>   📖 **このセクションで登場した用語**
> - **`collections.deque`**：「両端開きの箱」のようなデータ構造。`list.pop(0)`（先頭削除）はO(n)かかるが、`deque.popleft()`はO(1)で済む
> - **BFS（Breadth-First Search＝幅優先探索）**：木を段ごとに横方向に探索する手法。「何段あるか＝何回レベルを処理したか」で深さを数えられる
> - **h（木の高さ）**：根から葉までの最長パスのノード数。再帰のスタックは最大h段積まれる

---

## 3. 実装パターン

> 💡 **コードの骨格（全体の流れ）**
>
> 1. `root`が`None`（空の木・または葉ノードの先）なら深さ`0`を返す（再帰の終了条件）
> 2. 左の部分木の深さを再帰で求める
> 3. 右の部分木の深さを再帰で求める
> 4. 左右の深さの大きい方に`1`（現在ノード分）を加えて返す

---

### 【業務開発版を使う場面】

チームで長期間メンテナンスするプロダクションコードや、コードレビューが行われる現場に向きます。型ヒントとdocstringが充実しているため、後から読んだ人が「この関数は何をするのか・何を受け取るのか」を一目で理解できます。BFSを採用することでCPythonの再帰深度制限を完全に回避しており、本番環境での予期しないクラッシュを防ぎます。

```python
# Runtime 1 ms
# Beats 31.87%
# Memory 20.27 MB
# Beats 70.25%

from typing import Optional
from collections import deque

# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        """
        二分木の最大深さを返す（BFS反復版・業務開発向け）。

        再帰版よりコードは長くなるが、CPythonの再帰深度制限（デフォルト1000）を
        回避できるため、本番環境での安全性が高い。

        Args:
            root: 二分木の根ノード。None は空の木を意味する。

        Returns:
            根から最も遠い葉ノードまでのノード数。空の木は 0 を返す。

        Time Complexity:  O(n)  全ノードを1回ずつ訪問するため
        Space Complexity: O(w)  w は木の最大幅（同じ深さのノード数の最大値）
        """

        # ── エッジケース：空の木 ──────────────────────────────────────────
        # root が None の場合はノードが1つもないため、深さは 0。
        # 後続の deque 処理に None を入れないための早期リターン。
        if root is None:
            return 0

        # ── BFS のためのキューを初期化 ────────────────────────────────────
        # collections.deque を使う理由：
        #   list.pop(0) は先頭削除で O(n) かかる（全要素をずらすため）が、
        #   deque.popleft() は O(1) で済む。
        # 根ノードをキューに入れてBFSを開始する。
        queue: deque[TreeNode] = deque([root])

        # ── 深さカウンター ────────────────────────────────────────────────
        # 各「レベル（段）」を処理するたびに 1 ずつ増やす。
        # BFS は「同じ深さのノードを全部処理してから次の深さへ進む」
        # という特性があるため、この方法で深さを正確に数えられる。
        depth: int = 0

        # ── BFS メインループ ──────────────────────────────────────────────
        # キューが空になるまで「1段分のノードをまとめて処理」を繰り返す。
        while queue:

            # この時点での queue の長さ = 現在の深さにいるノードの数。
            # この level_size 個のノードを全部処理したら、1段下に進む。
            level_size: int = len(queue)

            # 現在の深さのノードを全て処理する。
            for _ in range(level_size):
                # deque の先頭からノードを取り出す（O(1)）。
                # list.pop(0) は O(n) なので絶対に使ってはいけない。
                node: TreeNode = queue.popleft()

                # 左の子が存在すれば、次のレベルとしてキューに追加する。
                # None チェックを先に行うことで、None ノードをキューに入れない。
                if node.left is not None:
                    queue.append(node.left)

                # 右の子が存在すれば、同じく次のレベルとしてキューに追加する。
                if node.right is not None:
                    queue.append(node.right)

            # 現在のレベルを全部処理し終えたので、深さを 1 増やす。
            depth += 1

        return depth
```

---

### 動作トレース（業務開発版・入力例1）

`root = [3, 9, 20, null, null, 15, 7]` でBFSがどう動くかを追います。

```
木の構造:
        3          ← 深さ1
       / \
      9  20        ← 深さ2
        /  \
       15   7      ← 深さ3

─────────────────────────────────────────────────────────────────
初期状態: root=TreeNode(3), queue=deque([3]), depth=0

【レベル1の処理】
  level_size = 1
  popleft() → node=TreeNode(3)
    node.left  = TreeNode(9)  → append → queue=deque([9])
    node.right = TreeNode(20) → append → queue=deque([9, 20])
  レベル完了 → depth = 1

【レベル2の処理】
  level_size = 2
  popleft() → node=TreeNode(9)
    node.left  = None → スキップ
    node.right = None → スキップ
  popleft() → node=TreeNode(20)
    node.left  = TreeNode(15) → append → queue=deque([15])
    node.right = TreeNode(7)  → append → queue=deque([15, 7])
  レベル完了 → depth = 2

【レベル3の処理】
  level_size = 2
  popleft() → node=TreeNode(15)
    node.left = None, node.right = None → 両方スキップ
  popleft() → node=TreeNode(7)
    node.left = None, node.right = None → 両方スキップ
  レベル完了 → depth = 3

while queue → queue=deque([]) → 空なのでループ終了
─────────────────────────────────────────────────────────────────
return 3 ✅
```

---

### 【競技プログラミング版を使う場面】

LeetCodeなど制限時間内に正解を出すことが目的の場合に向きます。再帰DFSで実装しており、コードが非常に短く、アルゴリズムの本質（「深さ＝1＋左右の大きい方の深さ」）が一目で分かります。完全二分木であれば深さは約log2(10^4) ≈ 14程度で安全ですが、左右どちらかに偏った退化木（skewed tree）の場合は深さが最大10^4に達する可能性があります。そのため、そのようなエッジケースでは呼び出し側で`sys.setrecursionlimit(...)`を設定するか、反復アプローチを用いる必要があります。

```python
from typing import Optional

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        # ── ベースケース ──────────────────────────────────────────────────
        # root が None = 「この方向には木がない」を意味する。
        # 存在しない木の深さは 0 なので 0 を返して再帰を終了させる。
        # Python の "if not root:" は None と TreeNode(0) の両方でTrueになるため
        # 明示的に "is None" で書くほうがpylanceの型推論上も安全。
        if root is None:
            return 0

        # ── 再帰ステップ ──────────────────────────────────────────────────
        # max() は C実装の組み込み関数なので、if文での比較よりも高速。
        # 「左の深さ」と「右の深さ」を再帰で求め、大きい方を選んで +1 する。
        # +1 は「今いるこのノード自身」のカウント分。
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
```

---

### 動作トレース（競技プログラミング版・入力例2）

`root = [1, null, 2]` で再帰がどう展開・収束するかを追います。

```
木の構造:
    1              ← 深さ1
     \
      2            ← 深さ2

─────────────────────────────────────────────────────────────────
Call 1: maxDepth(TreeNode(1))
  ├─ root is not None → 再帰ステップへ
  ├─ Call 2: maxDepth(None)     ← root.left
  │    └─ root is None → return 0
  └─ Call 3: maxDepth(TreeNode(2))  ← root.right
       ├─ root is not None → 再帰ステップへ
       ├─ Call 4: maxDepth(None)  ← TreeNode(2).left
       │    └─ return 0
       └─ Call 5: maxDepth(None)  ← TreeNode(2).right
            └─ return 0
       └─ 1 + max(0, 0) = 1

Call 1 の最終結果: 1 + max(0, 1) = 2 ✅
─────────────────────────────────────────────────────────────────
return 2
```

> 💡 **`max()` がなぜ高速か（最適化前→後→理由）**
>
> ```python
> # 最適化前：if文での比較
> if left_depth > right_depth:
>     return 1 + left_depth
> else:
>     return 1 + right_depth
>
> # 最適化後：組み込み関数 max() を使う
> return 1 + max(left_depth, right_depth)
>
> # なぜ速いか：max() はC言語実装。Pythonインタープリタを介さずに
> # C言語レベルで比較するため、if文より高速かつコードが短くなる。
> ```

> 📖 **このセクションで登場した用語**
>
> - **`deque.popleft()`**：dequeの先頭から要素を取り出す操作。O(1)で動作する。`list.pop(0)`はO(n)なので木の幅優先探索には必ず`deque`を使う
> - **レベル（BFSの文脈で）**：木の同じ深さにいるノードの集合。BFSは1レベルずつ処理するため、処理したレベル数＝深さになる
> - **ベースケース**：再帰を止める条件。「これ以上分割できない最小の状態」を定義する。Pythonでは`None`チェックがこれにあたる
> - **`Optional[TreeNode]`**：`TreeNode | None`と同じ意味。pylanceに「この引数はNoneかもしれない」と伝えることで、`root.left`への無条件アクセスを実行前に警告してくれる

---

## 4. エッジケース検証

> 💡 エッジケースのテストは、アルゴリズムが「ふつうの入力」だけでなく「極端な入力」でも正しく動くかを確かめるためのものです。

```
【ケース1】空の木: root = None
  → 業務版: root is None → return 0 ✅
  → 競技版: root is None → return 0 ✅

【ケース2】ノードが1つだけ: root = [1]
  → 業務版: queue=deque([1]) → level処理 → depth=1 → return 1 ✅
  → 競技版: 1 + max(maxDepth(None), maxDepth(None))
           = 1 + max(0, 0) = 1 ✅

【ケース3】右に偏った一本道（再帰深度の観点で最悪ケース）: root = [1,null,2,null,3,...,null,10000]
  → 業務版: BFS使用のため再帰制限なし。depth=10000 ✅
  → 競技版: 再帰深度10000 > CPythonデフォルト制限1000 → 注意が必要
             対処: コード冒頭に import sys; sys.setrecursionlimit(20000) を追加

【ケース4】完全二分木（最大ノード数 10^4）
  → 高さ h ≈ log2(10000) ≈ 14 なので再帰深度は約14。安全範囲内。✅
```

> 📖 **このセクションで登場した用語**
>
> - **エッジケース**：空の木・ノード1つ・一本道など、境界的な条件の入力のこと
> - **`sys.setrecursionlimit(n)`**：CPythonの再帰深度制限をn回まで拡張する関数。デフォルトは約1000
> - **完全二分木**：全ての内部ノードが2つの子を持ち、葉が全て同じ深さにある理想的な木。高さはlog₂(n)に収まる
