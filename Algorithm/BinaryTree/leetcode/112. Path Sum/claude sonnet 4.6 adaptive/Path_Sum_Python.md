> 🎯 **[algo-beginner スキル発火]**
> 言語/カテゴリ: Python (CPython 3.11.10)
> 適用ルールセット: 共通5ルール + Python固有ルール
> 参照ファイル: references/common.md + references/python.md

---

# Path Sum（パスの合計）— LeetCode 112｜Python版

---

## 1. 問題分析

> 💡 **この問題は一言で言うと：**
> 「木の根（てっぺん）から葉（末端）まで下りていくルートの数値の合計が、目標値と一致するパスが1本でも存在するか？」を調べる問題です。

### CPython特有の注意点（最初に押さえるべき点）

Pythonの再帰（関数が自分自身を呼び出すこと）にはデフォルトで **最大再帰深度（＝関数が何段まで入れ子になれるか）** が `sys.getrecursionlimit()` で約1000に制限されています。今回の制約は最大5000ノードの木なので、**一直線に伸びた最悪形状の木では再帰深度が5000になりうる**点に注意が必要です。競技版では問題ありませんが、業務版では `sys.setrecursionlimit()` の設定や、再帰を使わない反復（イテレーション）での実装を検討する価値があります。

---

### 競技プログラミング視点

- 制約分析：ノード数 `[0, 5000]`。全ノードを一度ずつ訪れる O(n) で十分間に合う
- 最速手法：再帰DFS（深さ優先探索）。Pythonの再帰はオーバーヘッドがあるが、ノード数5000以下なら実用上問題なし
- メモリ最小化：追加のデータ構造を使わず、関数呼び出しスタックのみ利用。空間計算量 O(h)（hは木の高さ）

### 業務開発視点

- `Optional[TreeNode]`（= `TreeNode` か `None` のどちらかを表す型ヒント）で `None` の可能性を明示し、pylanceに型エラーを検出させる
- `root is None` チェックを先頭に置き、以降のコードで `root.val` に安全にアクセスできるようにする
- 業務版では反復DFSで再帰深度問題を回避し、プロダクション環境での安全性を高める

### Python特有の分析

- `TreeNode | None`（Python 3.10以降の union 記法）または `Optional[TreeNode]` で null 安全性を表現
- 今回は追加の標準ライブラリ（`collections`, `heapq` など）は不要。木の構造そのものを再帰で辿るシンプルな問題
- 業務版の反復DFSでは `collections.deque`（＝前後どちらからでも出し入れできる「両端開きの箱」）を活用し、先頭操作を O(1) にする

> 📖 **このセクションで登場した用語**
>
> - **CPython**：最も広く使われるPythonの実装。C言語で書かれており、組み込み関数の多くがC実装のため高速
> - **再帰深度（Recursion Depth）**：関数が自分自身を呼び出す入れ子の深さ。Pythonはデフォルトで約1000まで
> - **DFS（深さ優先探索）**：木をできるだけ深く潜ってから引き返す探索方法。パス（根から葉への道）を追うのに適している
> - **O(h)**：木の高さ（height）に比例するメモリ使用量。均衡した木では O(log n)、一直線の木では O(n)

---

## 2. 採用アルゴリズムと根拠

> 💡 同じ問題でも複数の解き方があります。「速さ（時間計算量）」と「メモリ使用量（空間計算量）」、さらに「Pythonらしい書きやすさ」を比べて最適なものを選びます。

| アプローチ          | 時間計算量 | 空間計算量 | Python実装コスト | 可読性 | 標準ライブラリ活用  | CPython最適化        | 備考                          |
| ------------------- | ---------- | ---------- | ---------------- | ------ | ------------------- | -------------------- | ----------------------------- |
| ① 再帰DFS           | O(n)       | O(h)       | 低               | ★★★    | なし                | 適（シンプルで最速） | 競技版向け。再帰深度に注意    |
| ② 反復DFS（deque）  | O(n)       | O(h)       | 中               | ★★☆    | `collections.deque` | 適（C実装deque）     | 業務版向け。再帰深度問題なし  |
| ③ BFS（幅優先探索） | O(n)       | O(w)       | 中               | ★☆☆    | `collections.deque` | 適                   | wは最大幅。パス追跡には不向き |

- **競技版に①再帰DFSを選ぶ理由**：コードが最も短く直感的。「木の各ノードに対して同じ処理を繰り返す」という再帰的性質をそのままコードで表現できる
- **業務版に②反復DFSを選ぶ理由**：最大5000ノードの一直線の木では再帰深度が5000に達し、Pythonのデフォルト再帰制限（約1000）を超える恐れがある。`deque` を使ったスタック管理で安全に回避できる

> 📖 **このセクションで登場した用語**
>
> - **時間計算量**：入力の大きさに対して処理にかかる手間がどう増えるかの目安
> - **空間計算量**：処理中に使うメモリ量がどう増えるかの目安
> - **`collections.deque`**：前後どちらからでも O(1) で追加・取り出しできる「両端開きの箱」。`list` で先頭操作をすると O(n) かかるため、スタック・キューには `deque` が適している
> - **トレードオフ**：何かを得ると何かを失う関係。再帰は可読性が高いがスタック深度に限界があり、反復はその逆

---

## 3. 実装パターン

> 💡 **コードの骨格（全体の構造）**
>
> 1. 入力検証（型チェック・制約確認）
> 2. 空の木（`root is None`）のエッジケース処理
> 3. 各ノードで「残り目標値 = targetSum − 現在ノードの値」を計算しながら下に進む
> 4. 葉（子が両方 `None`）に到達したとき、残り目標値が 0 かどうかを確認して返す

---

### 【業務開発版を使う場面】

チームで長期間メンテナンスするプロダクションコードに向きます。再帰深度の問題を `deque` で回避し、型ヒント・入力検証・docstringを充実させ、後から読んだ人がすぐ理解できる構造にしています。

```python
from typing import Optional
from collections import deque


# LeetCode 提供の TreeNode クラス（変更不可）
class TreeNode:
    def __init__(
        self,
        val: int = 0,
        left: Optional["TreeNode"] = None,
        right: Optional["TreeNode"] = None,
    ) -> None:
        self.val = val
        self.left = left
        self.right = right


class Solution:
    """
    Path Sum 解決クラス（業務開発版）
    再帰を使わず反復DFS（dequeスタック）で実装。
    Pythonの再帰深度制限を回避し、最大5000ノードの木でも安全に動作する。
    """

    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:
        """
        根から葉までのパスの合計が targetSum と等しいパスが存在するか判定する。

        Args:
            root: 二分木の根ノード（None の場合は空の木）
            targetSum: 目標とするパスの合計値

        Returns:
            条件を満たすパスが存在すれば True、存在しなければ False

        Raises:
            TypeError: root が TreeNode でも None でもない場合
            TypeError: targetSum が int でない場合

        Complexity:
            Time: O(n)  — 全ノードを最大1回ずつ訪問
            Space: O(h) — スタックの最大サイズは木の高さ h に比例
        """
        # --- 入力検証 ---
        # targetSum の型チェック。Python は動的型付けなので、
        # 呼び出し元が float や str を渡してもコンパイル時には気づけない。
        # isinstance() で実行時に検証することで pylance + 実行時の両方で安全性を確保する。
        if not isinstance(targetSum, int):
            raise TypeError(
                f"targetSum must be int, got {type(targetSum).__name__}"
            )

        # root の型チェック。TreeNode または None のみを受け付ける。
        if root is not None and not isinstance(root, TreeNode):
            raise TypeError(
                f"root must be TreeNode or None, got {type(root).__name__}"
            )

        # --- エッジケース：空の木 ---
        # root が None のとき、そもそもパスが存在しないので即 False を返す。
        if root is None:
            return False

        # --- 反復DFS の準備 ---
        # deque をスタック（後から積んだものを先に取り出す）として使う。
        # (ノード, 現時点までの残り目標値) のペアを積んでいく。
        # list でも動くが、deque の pop() は内部が C 実装のため若干高速。
        stack: deque[tuple[TreeNode, int]] = deque()

        # 最初は根ノードと初期の targetSum をスタックに積む。
        stack.append((root, targetSum))

        # --- 反復DFS 本体 ---
        # スタックが空になるまで繰り返す = 全パスを探索し終えるまで続ける。
        while stack:
            # スタックの末尾（最後に積んだもの）を取り出す。
            # これが DFS（深さ優先）になる理由：直前に積んだ子を先に処理するから。
            node, remaining = stack.pop()

            # 残り目標値から現在のノードの値を引く。
            # 例）targetSum=22, node.val=5 → remaining=17（残りあと17必要）
            remaining -= node.val

            # --- 葉（leaf）の判定 ---
            # 葉 = 左の子も右の子も存在しないノード = パスの終点。
            is_leaf: bool = node.left is None and node.right is None

            if is_leaf:
                # 葉に到達したとき、残り目標値がちょうど 0 になっていれば
                # 「根からこの葉までの合計 = targetSum」が成立している。
                if remaining == 0:
                    return True
                # 0 でなければこのパスは条件を満たさないので、次のパスへ。
                continue

            # --- 子ノードをスタックに積む ---
            # 葉でない場合は、存在する子ノードを次の探索対象としてスタックに積む。
            # None チェックを行い、存在する子だけを積む（None を積んでしまうとエラーになる）。
            if node.right is not None:
                # 右の子を先に積む。後で左の子を積むと、
                # スタックからは「左の子が先に取り出される」→ 左優先の DFS になる。
                stack.append((node.right, remaining))

            if node.left is not None:
                stack.append((node.left, remaining))

        # すべてのパスを探索し終えたが条件を満たすものがなかった。
        return False
```

---

### 【競技プログラミング版を使う場面】

LeetCode などのオンラインジャッジで、制限時間内に正解を出すことが目的のコードに向きます。入力検証・docstring を省き、再帰DFS でコードを最短・最速にしています。ただし、最大ノード数が5000という制約のため、一直線に伸びた最悪ケースの木ではCPythonのデフォルト再帰制限（1000）を超えて `RecursionError` が発生するリスクがある点に注意してください。その場合は、反復処理（DFS/BFS）への書き換えや、`sys.setrecursionlimit()` による制限の引き上げが必要です。

```python
# Runtime 3 ms
# Beats 29.65%
# Memory 20.24 MB
# Beats 21.80%
from typing import Optional


class TreeNode:
    def __init__(
        self,
        val: int = 0,
        left: Optional["TreeNode"] = None,
        right: Optional["TreeNode"] = None,
    ) -> None:
        self.val = val
        self.left = left
        self.right = right


class Solution:
    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:
        # root が None = 空の木 or 葉を超えた = パスなし → False
        # Python では "if not root:" でも動くが、
        # "root is None" の方が pylance が型を正確に絞り込める（型ガードとして機能する）。
        if root is None:
            return False

        # 現在のノードの値を targetSum から引く。
        # こうすることで「残りいくら必要か」を次の階層に伝えられる。
        targetSum -= root.val

        # 葉（left も right も None）に到達したら、残りが 0 かどうかで答えを確定する。
        # Python の "and" は短絡評価（左が False なら右を評価しない）なので効率的。
        if root.left is None and root.right is None:
            return targetSum == 0

        # 葉でなければ、左右の子のどちらかで条件を満たすパスがあれば True。
        # "or" も短絡評価：左が True なら右は評価しない → 早期リターン。
        return (
            self.hasPathSum(root.left, targetSum)
            or self.hasPathSum(root.right, targetSum)
        )
```

---

### 💡 動作トレース（Example 1）

```
入力: root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22

木の形:
          5
         / \
        4   8
       /   / \
      11  13   4
     /  \       \
    7    2        1

─── 競技版（再帰DFS）のトレース ───────────────────────────

Step 1: hasPathSum(node=5, targetSum=22)
        → root is not None → 処理続行
        → targetSum = 22 - 5 = 17
        → 葉でない（left=4, right=8）
        → 左 hasPathSum(4, 17) を先に評価（or の短絡評価）

Step 2: hasPathSum(node=4, targetSum=17)
        → targetSum = 17 - 4 = 13
        → 葉でない（left=11, right=None）
        → 左 hasPathSum(11, 13) を評価

Step 3: hasPathSum(node=11, targetSum=13)
        → targetSum = 13 - 11 = 2
        → 葉でない（left=7, right=2）
        → 左 hasPathSum(7, 2) を評価

Step 4: hasPathSum(node=7, targetSum=2)
        → targetSum = 2 - 7 = -5
        → 葉（left=None, right=None）
        → -5 == 0 ? → False ❌

Step 5: hasPathSum(node=2, targetSum=2)  ← or の右側を評価
        → targetSum = 2 - 2 = 0
        → 葉（left=None, right=None）
        → 0 == 0 ? → True ✅

Step 6: True が or を通じて Step 3 → Step 2 → Step 1 へ伝播
─────────────────────────────────────────────────────
出力: True  ✅
パス: 5 → 4 → 11 → 2  合計 = 22
```

```
─── 業務版（反復DFS + deque）のトレース ──────────────────────

初期状態:
  stack = [(node=5, remaining=22)]

Iteration 1: pop → (node=5, remaining=22)
  remaining = 22 - 5 = 17
  is_leaf = False（left=4, right=8）
  → stack に right(8, 17) を追加 → stack = [(8, 17)]
  → stack に left(4, 17) を追加  → stack = [(8, 17), (4, 17)]

Iteration 2: pop → (node=4, remaining=17)  ← 左が先に取り出される
  remaining = 17 - 4 = 13
  is_leaf = False（left=11, right=None）
  → right=None なのでスキップ
  → stack に left(11, 13) を追加 → stack = [(8, 17), (11, 13)]

Iteration 3: pop → (node=11, remaining=13)
  remaining = 13 - 11 = 2
  is_leaf = False（left=7, right=2）
  → stack に right(2, 2) を追加  → stack = [(8, 17), (2, 2)]
  → stack に left(7, 2) を追加   → stack = [(8, 17), (2, 2), (7, 2)]

Iteration 4: pop → (node=7, remaining=2)
  remaining = 2 - 7 = -5
  is_leaf = True → -5 == 0 ? → False ❌ → continue

Iteration 5: pop → (node=2, remaining=2)
  remaining = 2 - 2 = 0
  is_leaf = True → 0 == 0 ? → True ✅ → return True
─────────────────────────────────────────────────────
出力: True  ✅
```

---

## 4. 検証

> 💡 エッジケースのテストは、アルゴリズムが「ふつうの入力」だけでなく「極端な入力」でも正しく動くかを確かめるためのものです。特に木の問題は「空の木」「葉が1枚だけ」「負の値が含まれる」などのケースでバグが起きやすいです。

| テストケース  | 入力                                                           | 期待出力 | 確認ポイント                  |
| ------------- | -------------------------------------------------------------- | -------- | ----------------------------- |
| 空の木        | `root=None, targetSum=0`                                       | `False`  | `root is None` の即時リターン |
| 葉1枚・一致   | `root=[1], targetSum=1`                                        | `True`   | 根が葉でもある場合            |
| 葉1枚・不一致 | `root=[1], targetSum=2`                                        | `False`  | 葉での等値判定                |
| 負の値を含む  | `root=[-5,3], targetSum=-2`                                    | `True`   | `-5 + 3 = -2` 負数の合計      |
| 全部同じ値    | `root=[0,0,0], targetSum=0`                                    | `True`   | `0+0=0` のゼロ加算            |
| Example 1     | `root=[5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum=22` | `True`   | 通常ケース                    |
| Example 2     | `root=[1,2,3], targetSum=5`                                    | `False`  | すべてのパスが不一致          |

> 📖 **このセクションで登場した用語**
>
> - **エッジケース**：空のリスト・要素1つ・最大サイズ入力・負の値など、境界的な条件のこと
> - **境界値テスト**：エッジケースに対してもアルゴリズムが正しく動くかを確かめること
> - **型ガード（Python）**：`if root is None: return False` のように書くと、以降のブロックで pylance が `root` を `TreeNode` 型として認識してくれる仕組み
> - **短絡評価（Short-circuit Evaluation）**：`A or B` で A が `True` なら B を評価しない、`A and B` で A が `False` なら B を評価しない仕組み。Pythonも同様に動作し、無駄な計算を防ぐ

---

## Python版 vs TypeScript版 比較まとめ

| 観点           | Python（競技版）                        | TypeScript（LeetCode版）                       |
| -------------- | --------------------------------------- | ---------------------------------------------- |
| null 安全      | `if root is None:` + pylance の型ガード | `if (root === null):` + TSコンパイラの型ガード |
| 再帰深度制限   | デフォルト約1000（業務版で回避が必要）  | JavaScriptエンジン依存（通常より深い）         |
| コード量       | 最短（動的型付け・`or` 一行で書ける）   | やや長い（型注釈が必須）                       |
| 型安全性       | 型ヒント + pylance（オプショナル）      | コンパイル時に強制（必須）                     |
| 業務版の優位点 | `deque` で再帰深度問題を回避            | `strict mode` でコンパイル時エラー検出         |
