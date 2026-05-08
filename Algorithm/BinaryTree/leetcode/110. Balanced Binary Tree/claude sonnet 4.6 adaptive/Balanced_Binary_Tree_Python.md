> 🎯 **[algo-beginner スキル発火]**
> 言語/カテゴリ: Python
> 適用ルールセット: 共通5ルール + Python固有ルール
> 参照ファイル: references/common.md + references/python.md

---

# LeetCode 110 · Balanced Binary Tree — Python 完全解説

---

## 1. 問題分析結果

> 💡 **この問題は一言で言うと**：「木のすべてのノードで、左右の枝の深さの差が1以内かどうかを判定する問題」です。

---

### 🐍 Pythonで解く際に特に気をつけるべきCPython特有の注意点

Pythonのデフォルト再帰（＝関数が自分自身を呼び出すこと）の深さ上限は **`sys.getrecursionlimit()` で確認でき、デフォルトは1000** です。ノード数が最大5000のこの問題では、最悪の場合（一直線の木）に再帰が5000回まで達する可能性があります。ただし **LeetCodeのPython環境は再帰上限が引き上げられている**ため、今回は `sys.setrecursionlimit()` の呼び出しは不要です。また、Pythonは **`is None`（同一性チェック）を `== None`（等値チェック）より優先的に使う** のがPythonの慣習（PEP 8）です。これはPythonの `None` がシングルトン（＝プログラム中に1つしか存在しないオブジェクト）であるために、`is` のほうが意味的に正確だからです。

---

### 競技プログラミング視点

- **制約分析**：ノード数最大5000。O(n) の1パスDFS（深さ優先探索）で十分
- **最速手法**：番兵値（＝通常あり得ない特別な値でエラーを伝える） `-1` を使ったボトムアップ再帰
- **CPython最適化**：`abs()`（C実装の組み込み関数）と `max()`（C実装）を使うことで、Pure Python（＝Pythonコードで書かれた処理）より高速に絶対値・最大値を計算できる

### 業務開発視点

- **型安全設計**：`Optional[TreeNode]`（＝`TreeNode`か`None`のどちらか）を明示し、pylance（＝VSCodeのPython型チェックツール）がエラーを実行前に検出できるようにする
- **エラーハンドリング**：LeetCodeが保証する制約（ノード数0〜5000、値-10⁴〜10⁴）の範囲内なので、`TreeNode` の型検証は省略し、`None`チェックのみ行う
- **可読性**：ヘルパー関数 `check_height` をメソッド内のネスト関数（＝関数の中に定義する関数）として定義し、外部からの誤った呼び出しを防ぐ

### Python特有分析

- **データ構造選択**：`TreeNode` オブジェクトへの参照（＝Pythonオブジェクトのアドレス）をたどるだけ。追加の `list`/`deque`/`dict` は不要
- **標準ライブラリ活用度**：`abs()`（組み込み・C実装）と `max()`（組み込み・C実装）のみ。外部ライブラリ不要
- **CPython最適化度**：ネスト関数はクロージャ（＝外側のスコープの変数を参照できる関数）として実装され、グローバルスコープの関数より少し高速に名前解決される

> 📖 **このセクションで登場した用語**
>
> - **CPython**：最も広く使われるPythonの実装。C言語で書かれており、組み込み関数の多くがC実装のため高速
> - **シングルトン**：プログラム中に1つしか存在しないオブジェクト。`None`、`True`、`False` がこれにあたる
> - **PEP 8**：Pythonの公式コーディングスタイルガイド。`is None` vs `== None` の使い分けもここで定義されている
> - **ネスト関数**：関数の中に定義された関数。外部スコープから直接呼べないため、内部実装を隠蔽できる
> - **クロージャ**：外側のスコープの変数を「閉じ込めて」参照できる関数

---

## 2. 採用アルゴリズムと根拠

> 💡 同じ問題でも解き方は複数あります。Python固有の観点として「C実装の組み込み関数を使えるか」「追加のオブジェクト生成（メモリ確保）が起きるか」も重要な選択基準です。

| アプローチ                        | 時間計算量 | 空間計算量 | Python実装コスト | 可読性 | 標準ライブラリ活用  | CPython最適化 | 備考                             |
| --------------------------------- | ---------- | ---------- | ---------------- | ------ | ------------------- | ------------- | -------------------------------- |
| **① トップダウン再帰（素朴）**    | O(n²)      | O(h)       | 低               | ★★☆    | なし                | 不適          | 同じノードを繰り返し訪問         |
| **② ボトムアップDFS（番兵値-1）** | O(n)       | O(h)       | 低               | ★★★    | `abs()` `max()`     | 適            | 1パス。C実装の組み込み関数を活用 |
| **③ BFS（幅優先探索）**           | O(n)       | O(n)       | 高               | ★☆☆    | `collections.deque` | 中            | `deque` の確保コストあり         |

`h` = 木の高さ。均衡木ではO(log n)、最悪（一直線の木）ではO(n)

### なぜ①（トップダウン）がO(n²)なのか

```
① の問題：「高さ計算」と「均衡チェック」を分けてしまう

isBalanced(root=1) を呼んだとき：
  → height(node=2) を計算 → height(4) → height(5) ...（再帰）
  → height(node=3) を計算 → height(6) → height(7) ...（再帰）
  → |height(2) - height(3)| ≤ 1 を確認
  → isBalanced(2) でもう一度 height(4), height(5) を計算！← 二重計算

② の解決策：高さ計算しながら均衡チェックも同時に行う（1パスで完結）
```

**Python固有の観点：**

- ① では各ノードで `height()` を再帰呼び出しするたびに **Pythonのフレームオブジェクト（＝関数呼び出しの状態を保持するオブジェクト）** が生成される。O(n²)の場合、フレームの生成・破棄コストが無視できなくなる
- ② では各ノードに対してフレームがちょうど1回生成されるだけ

> 📖 **このセクションで登場した用語**
>
> - **時間計算量**：入力の大きさに対して処理にかかる手間がどう増えるかの目安
> - **空間計算量**：処理中に使うメモリ量がどう増えるかの目安
> - **フレームオブジェクト**：Pythonが関数を呼び出すときに作るオブジェクト。ローカル変数・呼び出し元の情報などを保持する。再帰が深いほど大量に生成される
> - **`collections.deque`**：前からも後ろからも O(1) で追加・削除できるデータ構造。BFS のキュー（行列）として最適

---

## 3. 実装パターン

> 💡 **コードの骨格（構造）**
>
> 1. `isBalanced` はエントリポイント。`check_height` を呼んで `-1` でなければ `True`
> 2. ネスト関数 `check_height` が再帰の本体。`Optional[TreeNode]` を受け取り `int` を返す
> 3. `node is None` のベースケース（＝再帰の終端条件）で `0` を返す
> 4. 左右を再帰チェックし、どちらかが `-1` なら即 `-1` を伝播（早期リターン）
> 5. `abs()` で差の絶対値を計算し、`> 1` なら `-1`、そうでなければ `max() + 1` を返す

---

### 【競技プログラミング版】 — LeetCode 提出フォーマット

LeetCodeで制限時間内に正解を出すことが目的です。型ヒントは最低限にとどめ、実行速度とコードの簡潔さを優先します。

```python
# Runtime 0 ms
# Beats 100.00%
# Memory 20.38 MB
# Beats 71.71%

from typing import Optional

class Solution:
    def isBalanced(self, root: Optional[TreeNode]) -> bool:

        # ── ネスト関数としてヘルパーを定義 ──────────────────────────────
        # ネスト関数にする理由：
        # Pythonではクラスのメソッドとして定義すると `self` 経由のアクセスで
        # 名前解決コストが発生する。ネスト関数はローカルスコープで解決されるため
        # わずかに高速になる（CPythonの名前解決の仕組みによる）。
        #
        # 引数に `Optional[TreeNode]` を使う理由：
        # `node.left` や `node.right` は `TreeNode | None` の可能性がある。
        # pylance がこれを認識するために `Optional[TreeNode]` の型ヒントが必要。
        def check_height(node: Optional[TreeNode]) -> int:

            # ── ベースケース ─────────────────────────────────────────────
            # `is None` を使う理由：
            # Pythonの `None` はシングルトン（プログラム中に1つだけ存在するオブジェクト）。
            # `is` は「同じオブジェクトかどうか」を確認する。
            # `== None` は `__eq__` メソッドを呼び出すため遅く、意味的にも不正確。
            # PEP 8（Pythonの公式スタイルガイド）でも `is None` が推奨されている。
            if node is None:
                return 0  # 空の木の高さ = 0。この値が親ノードの計算に使われる。

            # ── 左サブツリーを再帰的に検査 ──────────────────────────────
            # `node.left` は `Optional[TreeNode]` 型。
            # None のときは次の再帰呼び出しでベースケースとして処理される。
            left_height: int = check_height(node.left)

            # 左が -1（不均衡検知済み）なら即座に -1 を返す。
            # Pythonの短絡評価（＝条件が確定した時点で後続の評価をやめること）と同様の考え方。
            # 早期リターンで不要な右サブツリーの探索を省く。
            if left_height == -1:
                return -1

            # ── 右サブツリーを再帰的に検査 ──────────────────────────────
            right_height: int = check_height(node.right)

            # 右が -1 のときも同様に伝播させる。
            if right_height == -1:
                return -1

            # ── このノードでの均衡チェック ───────────────────────────────
            # `abs()` を使う理由：
            # abs() はCPythonのC実装（組み込み関数）なので、
            # Pure Pythonの `if left_height > right_height:` より高速。
            # また「左が深い」「右が深い」の両ケースを1行で処理できる。
            if abs(left_height - right_height) > 1:
                return -1  # 不均衡 → 番兵値 -1 を返す

            # ── このノードの高さを返す ────────────────────────────────────
            # `max()` はCPythonのC実装（組み込み関数）なので高速。
            # `if left_height > right_height: return left_height + 1` より簡潔で速い。
            # +1 は「自分自身のノード」の分を追加している。省略すると高さが1ずれる。
            return max(left_height, right_height) + 1

        # check_height が -1 でなければ均衡している。
        # `!= -1` の単純比較で完結する。
        return check_height(root) != -1
```

---

### 【業務開発版】 — 型安全・可読性・エラーハンドリング重視

チームで長期間メンテナンスするプロダクションコードに向きます。pylance が通る厳密な型ヒントを付け、コードの意図をドキュメントとして残します。

```python
from typing import Optional


class Solution:
    """
    LeetCode 110 - Balanced Binary Tree 解決クラス。

    高さ均衡二分木とは、すべてのノードで左右の部分木の高さの差が
    1以内である木のこと。
    """

    # 番兵値を定数として定義する。
    # なぜ定数にするか：マジックナンバー（意味不明な数値リテラル）を排除し、
    # 「-1 が何を意味するか」をコードで表現するため。
    _UNBALANCED: int = -1

    def isBalanced(self, root: Optional[TreeNode]) -> bool:
        """
        二分木が高さ均衡かどうかを判定する。

        ボトムアップDFS（深さ優先探索）と番兵値パターンを使い、
        O(n) の1パスで完結する実装。

        Args:
            root: 二分木のルートノード。空の木の場合は None。

        Returns:
            すべてのノードで左右の高さの差が1以内なら True、そうでなければ False。

        Note:
            制約（LeetCode保証）:
            - ノード数: 0 ≤ n ≤ 5000
            - ノード値: -10^4 ≤ Node.val ≤ 10^4

        Time Complexity:  O(n) — 各ノードをちょうど1回訪問する
        Space Complexity: O(h) — 再帰のコールスタック（h = 木の高さ）
        """
        # ── ネスト関数（ヘルパー） ──────────────────────────────────────
        # ネスト関数を使う理由：
        # `_check_height` をクラスメソッドとして定義すると、
        # 外部から直接呼べてしまい、番兵値パターンの内部実装が漏れる。
        # ネスト関数にすることで「外部に見せるAPI（isBalanced）」と
        # 「内部実装（check_height）」を明確に分離できる。
        def check_height(node: Optional[TreeNode]) -> int:
            """
            サブツリーの高さを返す。不均衡が検出された場合は -1 を返す。

            Args:
                node: 現在のノード（None = 木の終端）

            Returns:
                均衡している場合は 0 以上の高さ、不均衡なら -1
            """
            # ベースケース：None ノード（木の終端）は高さ 0
            # `is None` を使うのはPEP 8（Pythonスタイルガイド）の推奨する慣習。
            if node is None:
                return 0

            # 左サブツリーを再帰的に検査
            left_height: int = check_height(node.left)
            # 早期リターン：左で不均衡が見つかれば右は調べなくてよい
            if left_height == self._UNBALANCED:
                return self._UNBALANCED

            # 右サブツリーを再帰的に検査
            right_height: int = check_height(node.right)
            # 早期リターン：右で不均衡が見つかれば即座に伝播
            if right_height == self._UNBALANCED:
                return self._UNBALANCED

            # このノードでの均衡チェック
            # abs() は C実装の組み込み関数で高速
            if abs(left_height - right_height) > 1:
                return self._UNBALANCED  # 定数を使うことで意味が明確になる

            # このノードの高さ = 左右の最大 + 自分自身の1
            return max(left_height, right_height) + 1

        # check_height が UNBALANCED(-1) でなければ均衡している
        return check_height(root) != self._UNBALANCED
```

> 💡 **業務版と競技版の使い分け**
>
> |                  | 競技プログラミング版  | 業務開発版                         |
> | ---------------- | --------------------- | ---------------------------------- |
> | **目的**         | LeetCode での正解     | プロダクションのメンテナンス       |
> | **型ヒント**     | 最低限                | 厳密（pylance対応）                |
> | **定数定義**     | なし（`-1` リテラル） | `_UNBALANCED = -1`（意味を明確化） |
> | **ドキュメント** | コメントのみ          | `docstring` + コメント             |
> | **LeetCode提出** | ✅ こちらを使う       | 参考実装として提示                 |

---

### 🔍 動作トレース（入力例での変数変化）

**Example 1** `root = [3, 9, 20, null, null, 15, 7]`

```
木の構造：
        3          ← root
       / \
      9  20
         / \
        15   7

isBalanced(root) の呼び出し
  ↓
check_height(node=TreeNode(3)) 開始
  │
  ├─ check_height(node=TreeNode(9)) 開始
  │    ├─ check_height(node=None) → return 0   ← 9.left が None
  │    │   left_height = 0; (0 != -1) → 早期リターンしない
  │    ├─ check_height(node=None) → return 0   ← 9.right が None
  │    │   right_height = 0; (0 != -1) → 早期リターンしない
  │    ├─ abs(0 - 0) = 0 ≤ 1 → 均衡OK
  │    └─ return max(0, 0) + 1 = 1
  │
  │   left_height = 1; (1 != -1) → 早期リターンしない
  │
  ├─ check_height(node=TreeNode(20)) 開始
  │    ├─ check_height(node=TreeNode(15)) → return 1  ← 同様の手順
  │    │   left_height = 1; (1 != -1) → 早期リターンしない
  │    ├─ check_height(node=TreeNode(7)) → return 1
  │    │   right_height = 1; (1 != -1) → 早期リターンしない
  │    ├─ abs(1 - 1) = 0 ≤ 1 → 均衡OK
  │    └─ return max(1, 1) + 1 = 2
  │
  │   right_height = 2; (2 != -1) → 早期リターンしない
  │
  ├─ abs(1 - 2) = 1 ≤ 1 → 均衡OK（ぎりぎり均衡）
  └─ return max(1, 2) + 1 = 3

check_height(root) = 3
isBalanced: 3 != -1 → True ✅
```

---

**Example 2** `root = [1, 2, 2, 3, 3, null, null, 4, 4]`

```
木の構造：
              1
            /   \
           2     2
          / \
         3   3
        / \
       4   4

（葉ノードから帰り道の結果だけ示す）
check_height(TreeNode(4)) → 1  ← 左の4
check_height(TreeNode(4)) → 1  ← 右の4

check_height(TreeNode(3)) [左の3]
  └─ left=1, right=1, abs(1-1)=0 → return max(1,1)+1 = 2

check_height(TreeNode(3)) [右の3]
  └─ left=0, right=0, abs(0-0)=0 → return 1

check_height(TreeNode(2)) [左の2]
  └─ left_height=2, right_height=1
  └─ abs(2-1) = 1 ≤ 1 → 均衡ギリギリOK → return max(2,1)+1 = 3

check_height(TreeNode(2)) [右の2]
  └─ left=0, right=0 → return 1

check_height(TreeNode(1)) ← ルート
  └─ left_height=3, right_height=1
  └─ abs(3-1) = 2 > 1 → 不均衡！ → return -1

check_height(root) = -1
isBalanced: -1 == -1 → False ✅
```

---

**Example 3** `root = None`（空の木）

```
check_height(node=None)
  └─ node is None → return 0   ← ベースケースで即座に返す

check_height(root) = 0
isBalanced: 0 != -1 → True ✅
```

---

### 🔬 `Optional[TreeNode]` と pylance の役割を図解

```python
# ❌ 型ヒントなし → pylance はエラーを検出できない
def check_height(node):
    if node is None:
        return 0
    return check_height(node.left)  # node が None なのに .left にアクセスしても気づかれない

# ✅ 型ヒントあり → pylance が静的解析でエラーを実行前に検出
def check_height(node: Optional[TreeNode]) -> int:
    if node is None:
        return 0
    # この行以降、pylance は node が TreeNode 型だと推論できる（型の絞り込み）
    return check_height(node.left)  # node.left が Optional[TreeNode] であることも認識される

# Optional[TreeNode] の意味：
# Optional[TreeNode] = TreeNode | None （Python 3.10+ の書き方）
#   → 「TreeNode か None のどちらか」という型
```

> 📖 **このセクションで登場した用語**
>
> - **`Optional[T]`**：`T` または `None` のどちらかであることを表す型ヒント。`from typing import Optional` が必要。Python 3.10+ では `T | None` と書ける
> - **型の絞り込み（Type Narrowing）**：`if node is None: return` の後、pylance が「以降の `node` は絶対に `None` でない」と推論してくれる仕組み
> - **マジックナンバー**：コード中に突然現れる意味不明な数値リテラル（例：`return -1`）。定数に名前を付けることで意図が明確になる
> - **早期リターン（Early Return）**：条件を満たした時点で即座に `return` すること。ネストが深くなるのを防ぎ、コードをフラットに保てる
> - **`abs()`**：絶対値を返す組み込み関数。CPythonのC実装なので Pure Python のif文より高速

---

## 最終回答（LeetCode 提出フォーマット）

```python
from typing import Optional

class Solution:
    def isBalanced(self, root: Optional[TreeNode]) -> bool:
        def check_height(node: Optional[TreeNode]) -> int:
            if node is None:
                return 0
            left_height = check_height(node.left)
            if left_height == -1:
                return -1
            right_height = check_height(node.right)
            if right_height == -1:
                return -1
            if abs(left_height - right_height) > 1:
                return -1
            return max(left_height, right_height) + 1

        return check_height(root) != -1
```

**計算量サマリー**

|                  | 計算量   | 詳細                                                                   |
| ---------------- | -------- | ---------------------------------------------------------------------- |
| ⏱ Time          | **O(n)** | 各ノードをちょうど1回訪問。`abs()` `max()` はC実装でO(1)               |
| 💾 Space         | **O(h)** | 再帰のコールスタック（CPythonのフレームオブジェクトが h 個生成される） |
| 🐍 CPython最適化 | **高**   | `abs()` `max()` `is None` すべてC実装 or 最適化パス                    |

**4言語まとめ比較**

|                    | TypeScript         | Rust                       | Go               | **Python**                |
| ------------------ | ------------------ | -------------------------- | ---------------- | ------------------------- |
| **ノードの型**     | `TreeNode \| null` | `Option<Rc<RefCell<...>>>` | `*TreeNode`      | `Optional[TreeNode]`      |
| **nullチェック**   | `=== null`         | `match { None => }`        | `== nil`         | **`is None`**             |
| **絶対値**         | `Math.abs()`       | `.abs()`                   | 手動比較         | **`abs()`（C実装）**      |
| **最大値**         | `Math.max()`       | `.max()`                   | `max()` 組み込み | **`max()`（C実装）**      |
| **コードの簡潔さ** | ⭐⭐⭐             | ⭐⭐                       | ⭐⭐⭐⭐         | **⭐⭐⭐⭐⭐**            |
| **型安全の強度**   | ⭐⭐⭐             | ⭐⭐⭐⭐⭐                 | ⭐⭐⭐⭐         | **⭐⭐⭐**（pylance依存） |
