> 🎯 **[algo-beginner スキル発火]**
> 言語/カテゴリ: Python (CPython 3.11.10)
> 適用ルールセット: 共通5ルール + Python固有ルール
> 参照ファイル: references/common.md + references/python.md

---

# 1. 問題分析結果

> 💡 **一言で言うと**：「2種類の"木の探索順リスト"を手がかりに、元の二分木を Python のクラスインスタンスとして復元する問題」です。

## Python で解く際の CPython 特有の注意点

Python の `list.index()` メソッドは内部が C 実装で高速に見えますが、O(n) の線形探索（＝先頭から1つずつ比較する探索）であることに変わりありません。毎回呼び出すと全体で O(n²) になります。代わりに `dict`（ハッシュマップ＝キーから値を O(1) で取り出せる辞書）を前処理で作ることで、全体を O(n) に抑えられます。また、Python の再帰はデフォルトで深さ 1000 までに制限されています。本問の制約（最大 3000 ノード）では最悪 3000 段の再帰（完全に偏った木）が起きうるため、`sys.setrecursionlimit` での上限緩和も業務版では考慮します。

---

### 競技プログラミング視点

- **制約分析**: `n ≤ 3000` → O(n²) は 9,000,000 回の操作で TLE（制限時間超過）の可能性あり。O(n) が必須
- **最速手法**: `dict` による前処理 + 再帰。`nonlocal`（＝内側の関数から外側の変数を書き換えるキーワード）でカーソルを共有
- **CPython 最適化**: `dict.__getitem__` は C 実装で O(1)。`sys.setrecursionlimit` で再帰制限を緩和

### 業務開発視点

- **型安全設計**: `List[int]`・`Optional[TreeNode]` で pylance エラーなし
- **エラーハンドリング**: 長さ不一致・空入力を `ValueError` で早期検出
- **可読性**: ヘルパーメソッドに分割し責務を明確化

### Python 特有分析

| 観点         | 競技版                  | 業務版                             |
| ------------ | ----------------------- | ---------------------------------- |
| データ構造   | `dict` + `list`         | `dict` + `list`                    |
| 再帰制限対応 | `sys.setrecursionlimit` | `sys.setrecursionlimit` + コメント |
| 型ヒント     | 最小限                  | 完全 pylance 対応                  |
| エラー処理   | 省略                    | `ValueError` / `TypeError`         |

> 📖 **このセクションで登場した用語**
>
> - **CPython**: 最も広く使われる Python 実装。C 言語で書かれており、`dict` などの組み込み型は C 実装のため高速
> - **線形探索**: 先頭から1つずつ比較して目的の値を探す方法。リストのサイズに比例して時間がかかる
> - **`nonlocal`**: 内側の関数から、外側（でも `global` ではない）のスコープにある変数を書き換えるための Python キーワード
> - **TLE（Time Limit Exceeded）**: 制限時間内に処理が終わらないエラー

---

# 2. 採用アルゴリズムと根拠

> 💡 同じ問題でも解き方は複数あります。それぞれの「速さ」と「メモリ使用量」を比べてから最適なものを選びます。Python では「C 実装かどうか」も重要な選択基準です。

| アプローチ                   | 時間計算量 | 空間計算量 | Python実装コスト | 可読性 | CPython最適化                       | 備考                         |
| ---------------------------- | ---------- | ---------- | ---------------- | ------ | ----------------------------------- | ---------------------------- |
| **A: 再帰 + `list.index()`** | O(n²)      | O(n)       | 低               | ★★★    | 不適（毎回C実装でも O(n)）          | n=3000で最悪9M操作           |
| **B: 再帰 + `dict` 前処理**  | **O(n)**   | O(n)       | 中               | ★★★    | 適（`dict`ルックアップはC実装O(1)） | ★最適                        |
| **C: 反復 + スタック**       | O(n)       | O(n)       | 高               | ★★☆    | 適                                  | 実装複雑・再帰制限回避できる |

**選択: B（再帰 + `dict` 前処理）**

- **A を選ばなかった理由**: `list.index()` は C 実装で高速ですが、それでも O(n) の線形探索。n=3000 のとき最悪 9,000,000 回の比較が発生します
- **C を選ばなかった理由**: `TreeNode` の `left`/`right` を後から設定するスタック管理が複雑で、可読性が大きく低下します
- **Python 最適化戦略**: `dict` の `__getitem__` は CPython の C 実装で平均 O(1)。`nonlocal` で再帰間のカーソル共有を実現

> 📖 **このセクションで登場した用語**
>
> - **`dict`（辞書）**: キーから値を平均 O(1) で取り出せる Python の組み込みデータ構造。内部はハッシュテーブル（＝値の場所を計算で直接求める仕組み）
> - **時間計算量**: 入力の大きさに対して処理にかかる手間がどう増えるかの目安
> - **空間計算量**: 処理中に使うメモリ量がどう増えるかの目安
> - **C 実装**: Python コードではなく C 言語で書かれた関数。Pure Python より大幅に高速

---

# 3. 実装パターン

## コードの骨格（先に全体像を把握する）

```text
1. 入力検証: 長さ不一致・空リストを早期検出
2. 前処理: inorder の「値 → インデックス」dict を O(n) で構築
3. preorder カーソル idx を nonlocal で再帰間共有する準備
4. 再帰関数 build(left, right):
   a. left > right → None を返す（部分木なし・終了条件）
   b. preorder[idx] をルート値として取得、idx を進める
   c. dict でルートの inorder 位置を O(1) で取得
   d. TreeNode を生成、左右を再帰的に構築して接続
5. build(0, n-1) を呼び出して返す
```

---

## 【業務開発版を使う場面】

チームで長期間メンテナンスするプロダクションコードに向きます。エラーの原因が分かりやすく、pylance による静的型チェックも通る構造になっています。再帰制限の緩和理由もコメントで明示し、後から読んだ人が意図を理解できるようにします。

```python
from __future__ import annotations  # アノテーションを遅延評価にする（PEP 563）

import sys
from typing import TYPE_CHECKING, Optional

# LeetCode 環境外でも import/実行できるよう最小限の TreeNode を定義する。
# LeetCode では実行時に TreeNode が注入されるため、NameError にならない場合はスキップ。
try:
    TreeNode  # type: ignore[name-defined]
except NameError:
    class TreeNode:  # type: ignore[no-redef]
        def __init__(
            self,
            val: int = 0,
            left: Optional[TreeNode] = None,
            right: Optional[TreeNode] = None,
        ) -> None:
            self.val = val
            self.left = left
            self.right = right

# 再帰深度の上限を緩和する。
# Python デフォルトは 1000 だが、本問は最悪 3000 段（偏った木）になりうる。
# この設定は Solution クラスの外に置くことでモジュールロード時に1回だけ実行される。
sys.setrecursionlimit(10_000)


class Solution:
    def buildTree(
        self,
        preorder: list[int],
        inorder: list[int],
    ) -> Optional[TreeNode]:
        """
        preorder（前順）と inorder（中順）から二分木を復元する。

        Args:
            preorder: 前順探索の配列（先頭が必ずルート）
            inorder:  中順探索の配列（ルートの左右を区切る境界線）

        Returns:
            復元した二分木のルートノード。空の場合は None。

        Raises:
            ValueError: 2つの配列の長さが異なる場合
            TypeError:  引数がリストでない場合

        Complexity:
            Time:  O(n) ─ 各ノードをちょうど1回だけ処理
            Space: O(n) ─ dict（n エントリ）+ 再帰スタック（高さ h 分）
        """
        # ① 型チェック：list 以外が渡された場合に分かりやすいエラーを出す。
        #    Python は動的型付けなので、実行時まで型エラーに気づかない。
        #    pylance と合わせることでコンパイル時相当の安全性を実現する。
        if not isinstance(preorder, list) or not isinstance(inorder, list):
            raise TypeError("Both preorder and inorder must be lists")

        # ② 長さ不一致チェック：2つの配列が同じ木を表していない場合は復元不可。
        if len(preorder) != len(inorder):
            raise ValueError(
                f"Length mismatch: preorder={len(preorder)}, inorder={len(inorder)}"
            )

        # ③ 空リストチェック：ノードが1つもない → 木なし → None を返す。
        if not preorder:
            return None

        # ④ 前処理：inorder の「値 → インデックス」を dict に O(n) で登録する。
        #    なぜ dict か：list.index() は C 実装でも O(n) の線形探索のため、
        #    n ノードで合計 O(n²) になる。dict なら __getitem__ が平均 O(1)。
        #    日常の例え：図書館の索引カード。本のタイトル（値）から棚番号（インデックス）を即座に引ける。
        inorder_index: dict[int, int] = {val: i for i, val in enumerate(inorder)}

        # ⑤ preorder を先頭から消費するカーソルを初期化する。
        #    リストに入れるのは Python の nonlocal が int（不変型）の
        #    再代入を外側スコープに反映するために使えるが、
        #    リストでラップすれば .append/.pop なしで添字書き換えができる。
        #    ここでは可読性のため nonlocal を使うシンプルな形にする。
        preorder_idx = 0

        def build(left: int, right: int) -> Optional[TreeNode]:
            """
            inorder の [left, right] 範囲に対応する部分木を再帰的に構築する。

            Args:
                left:  今構築すべき部分木の inorder 上の左端インデックス
                right: 今構築すべき部分木の inorder 上の右端インデックス
            """
            # nonlocal を使って外側の preorder_idx を書き換える宣言。
            # nonlocal なしで代入すると、Python は新しいローカル変数として扱い
            # 外側の変数が更新されないバグが起きる。
            nonlocal preorder_idx

            # ⑥ 再帰の終了条件：範囲が空 → 部分木なし → None を返す。
            if left > right:
                return None

            # ⑦ preorder の現在位置の値がこの部分木のルートになる。
            #    preorder は「ルート → 左 → 右」の順なので、
            #    呼ばれた時点の先頭が必ずこの部分木のルート値になる。
            root_val: int = preorder[preorder_idx]
            preorder_idx += 1  # 次の再帰呼び出しのために進める

            # ⑧ dict でルート値の inorder 上の位置を O(1) で取得する。
            #    この位置（mid）を境に「左側 = 左部分木」「右側 = 右部分木」が決まる。
            mid: int = inorder_index[root_val]

            # ⑨ TreeNode を生成し、左右を再帰的に構築して接続する。
            #    ★ 左を先に構築する理由：preorder は「ルート→左→右」の順なので
            #    左の再帰が終わるまで右のルート値は preorder に現れない。
            node = TreeNode(root_val)
            node.left = build(left, mid - 1)    # 左部分木（mid の左側）
            node.right = build(mid + 1, right)  # 右部分木（mid の右側）
            return node

        # ⑩ inorder 全体（0 〜 n-1）を対象として木全体を構築して返す
        return build(0, len(inorder) - 1)
```

---

## 【競技プログラミング版を使う場面】

LeetCode の制限時間内に通すことが目的のコードです。型チェックやエラーハンドリングを省略し、最小限のコードで最速実行を目指します。

```python
# Runtime 3 ms
# Beats 78.79%
# Memory 21.00 MB
# Beats 80.71%

import sys
from typing import Optional

sys.setrecursionlimit(10_000)


class Solution:
    def buildTree(
        self, preorder: list[int], inorder: list[int]
    ) -> Optional[TreeNode]:
        # inorder の「値→インデックス」を dict で前処理（O(n)）
        # dict 内包表記（＝1行で dict を作るPython固有の書き方）を使い簡潔に書く
        inorder_idx: dict[int, int] = {v: i for i, v in enumerate(inorder)}
        preorder_pos = 0  # preorder のカーソル

        def build(lo: int, hi: int) -> Optional[TreeNode]:
            nonlocal preorder_pos
            if lo > hi:
                return None
            val = preorder[preorder_pos]
            preorder_pos += 1
            mid = inorder_idx[val]
            node = TreeNode(val)
            node.left = build(lo, mid - 1)
            node.right = build(mid + 1, hi)
            return node

        return build(0, len(inorder) - 1)
```

---

## 動作トレース（具体的な入力例）

```text
入力: preorder = [3, 9, 20, 15, 7]
      inorder  = [9, 3, 15, 20,  7]

【前処理】inorder_index の構築（dict 内包表記で O(n)）:
  {9: 0,  3: 1,  15: 2,  20: 3,  7: 4}

preorder_idx = 0 で build(lo=0, hi=4) を呼び出す

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌱 build(lo=0, hi=4)
  val = preorder[0] = 3,  preorder_idx → 1
  mid = inorder_index[3] = 1
  node = TreeNode(3)

  ┌── node.left = build(lo=0, hi=0)    ← inorder[0..0] = [9]
  │     val = preorder[1] = 9,  preorder_idx → 2
  │     mid = inorder_index[9] = 0
  │     node = TreeNode(9)
  │     node.left  = build(lo=0, hi=-1)  → lo > hi → None
  │     node.right = build(lo=1, hi=0)   → lo > hi → None
  │     return TreeNode(9)
  │
  └── node.right = build(lo=2, hi=4)   ← inorder[2..4] = [15, 20, 7]
        val = preorder[2] = 20,  preorder_idx → 3
        mid = inorder_index[20] = 3
        node = TreeNode(20)

        ┌── node.left = build(lo=2, hi=2)  ← inorder[2..2] = [15]
        │     val = preorder[3] = 15,  preorder_idx → 4
        │     mid = inorder_index[15] = 2
        │     node = TreeNode(15)
        │     node.left  = build(lo=2, hi=1) → lo > hi → None
        │     node.right = build(lo=3, hi=2) → lo > hi → None
        │     return TreeNode(15)
        │
        └── node.right = build(lo=4, hi=4) ← inorder[4..4] = [7]
              val = preorder[4] = 7,  preorder_idx → 5
              mid = inorder_index[7] = 4
              node = TreeNode(7)
              node.left  = build(lo=4, hi=3) → lo > hi → None
              node.right = build(lo=5, hi=4) → lo > hi → None
              return TreeNode(7)

        return TreeNode(20, left=TreeNode(15), right=TreeNode(7))

return TreeNode(3, left=TreeNode(9), right=TreeNode(20, ...))

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
最終結果の木：
        3
       / \
      9  20
         / \
        15   7
✅ Output: [3, 9, 20, null, null, 15, 7]
```

---

# 4. 検証

> 💡 エッジケースとは「空リスト・要素が1つ・極端に偏った形の木」など通常とは異なる境界的な入力のことです。エッジケースのテストは、アルゴリズムが"ふつうの入力"だけでなく"極端な入力"でも正しく動くかを確かめるためのものです。

| テストケース       | 入力                                     | 期待出力                  | 確認ポイント             |
| ------------------ | ---------------------------------------- | ------------------------- | ------------------------ |
| 基本例             | `pre=[3,9,20,15,7]`, `ino=[9,3,15,20,7]` | `[3,9,20,null,null,15,7]` | 通常の木                 |
| 要素1つ            | `pre=[-1]`, `ino=[-1]`                   | `[-1]`                    | 単一ノード（左右 None）  |
| 右に偏った木       | `pre=[1,2,3]`, `ino=[1,2,3]`             | `[1,null,2,null,3]`       | 最大再帰深さに近い形     |
| 左に偏った木       | `pre=[3,2,1]`, `ino=[1,2,3]`             | `[3,2,null,1]`            | 逆方向の偏り             |
| 負の値を含む       | `pre=[-3,9,-20]`, `ino=[9,-3,-20]`       | `[-3,9,-20]`              | 制約範囲内の負値         |
| 業務版: 型エラー   | `pre="abc"`, `ino=[1]`                   | `TypeError`               | 型ガードの動作確認       |
| 業務版: 長さ不一致 | `pre=[1,2]`, `ino=[1]`                   | `ValueError`              | バリデーションの動作確認 |

> 📖 **このセクションで登場した用語**
>
> - **エッジケース**: 空のリスト・要素1つ・最大サイズ入力など、境界的な条件のこと
> - **境界値テスト**: エッジケースに対してもアルゴリズムが正しく動くかを確かめること
> - **`nonlocal`**: 内側の関数から外側のローカル変数を書き換えるための Python キーワード。`global`（モジュール変数）とは異なり、直接外側の関数スコープを対象にする
> - **dict 内包表記**: `{k: v for k, v in iterable}` という形で dict を1行で作る Python 固有の書き方。`for` ループより高速で可読性も高い
