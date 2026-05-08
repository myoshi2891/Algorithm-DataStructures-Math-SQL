> 🎯 **[algo-beginner スキル発火]**
> 言語/カテゴリ: Go
> 適用ルールセット: 共通5ルール + Go固有ルール
> 参照ファイル: references/common.md + references/go.md

---

# LeetCode 110 · Balanced Binary Tree — Go 完全解説

---

## 1. 問題分析結果

> 💡 **この問題は一言で言うと**：「木のすべての分岐点で、左右の枝の深さの差が1以内かを判定する問題」です。

---

### 🐹 Goで解く際に特に気をつけるべき点

Go版での最大の利点は、**`*TreeNode` というシンプルなポインタ（＝メモリ上の別の場所を指し示す値）** だけで木構造を表現できることです。RustのようなRc/RefCellや、TypeScriptのunion型と違い、「ポインタが `nil`（＝何も指していない状態）かどうか」だけを確認すればよいため、コードが非常にシンプルになります。また、Goでは**クロージャ（＝外側の変数を参照できる関数）** を使って再帰関数を定義する慣用句があります。これがGoにおける「ネスト再帰関数」の標準的な書き方です。

---

### 競技プログラミング視点

- **制約分析**：ノード数最大5000。再帰の深さはO(h)（木の高さ）。スタックオーバーフローの心配なし
- **最速手法**：番兵値（＝通常あり得ない特別な値でエラーを伝える）`-1` を使ったボトムアップDFS（深さ優先探索）
- **メモリ最小化**：`*TreeNode` のポインタをたどるだけ。追加のスライスやマップは一切不要

### 業務開発視点

- **型安全設計**：`*TreeNode` と `nil` チェックで null 安全性を確保（Goでは `nil` ポインタに対してフィールドアクセスするとパニックになるため、必ず先にチェックする）
- **エラーハンドリング**：今回は戻り値が `bool` のみなのでエラー戻り値は不要。ただし内部の `checkHeight` は `int` で `-1`（番兵値）を使ってエラーを表現する
- **可読性**：クロージャを使ったネスト関数により、`checkHeight` のスコープを `isBalanced` 内に閉じ込め、外部から誤って呼ばれる心配がなくなる

### Go特有分析

- **データ構造選択**：`*TreeNode` の連鎖ポインタ。追加のデータ構造は不要
- **標準ライブラリ活用度**：今回は不要。組み込みの `if` 分岐と算術演算のみ
- **並行処理適性**：木の再帰DFSは各ノードが依存関係を持つため、ゴルーチン化のメリットがない（オーバーヘッドの方が大きくなる）
- **エスケープ解析**：`checkHeight` の内部変数（`leftHeight`, `rightHeight` など `int` 型）はすべてスタック（＝関数内で完結する高速なメモリ領域）に配置される。ヒープアロケーション（＝動的メモリ確保）はゼロ

> 📖 **このセクションで登場した用語**
>
> - **ポインタ**：メモリ上の別の場所のアドレスを保持する値。`*TreeNode` は「TreeNode の場所を指し示す」という意味
> - **`nil`**：Goにおける「何も指していない」ポインタの値。JavaやPythonの `null` に相当するが、型を持つ
> - **クロージャ**：外側の変数を「閉じ込めて」参照できる関数。Goでは `func(引数) 戻り値 { ... }` という無名関数で書く
> - **スタック**：関数呼び出し時に使われる高速なメモリ領域。関数が終了すると自動で解放される
> - **ヒープ**：動的に確保されるメモリ領域。GC（ガベージコレクション）が管理する。スタックより低速

---

## 2. アルゴリズム比較表

> 💡 同じ問題でも解き方は複数あります。Go固有の視点として「追加のアロケーションが発生するか」「ポインタの参照回数が最小か」も重要な選択基準です。

| アプローチ                        | 時間計算量 | 空間計算量 | Go実装コスト | 可読性 | 標準ライブラリ活用 | 備考                                           |
| --------------------------------- | ---------- | ---------- | ------------ | ------ | ------------------ | ---------------------------------------------- |
| **① トップダウン再帰（素朴）**    | O(n²)      | O(h)       | 低           | ★★☆    | なし               | 同じサブツリーのポインタを繰り返したどる       |
| **② ボトムアップDFS（番兵値-1）** | O(n)       | O(h)       | 低           | ★★★    | なし               | 1パスで完結。Goクロージャとの相性◎             |
| **③ BFS（幅優先探索）**           | O(n)       | O(n)       | 高           | ★☆☆    | `container/list`   | キュー管理複雑。`*TreeNode` のスライスが増える |

`h` = 木の高さ。均衡木では O(log n)、一直線の木（最悪ケース）では O(n)

### なぜ①（トップダウン）が非効率なのか

```
① トップダウン：各ノードで「高さ計算」と「均衡チェック」を分けてしまう問題

isBalanced(root=1) を呼んだ場合：
  → height(2) を計算 → height(4) → height(5) ...（再帰）
  → height(3) を計算 → height(6) → height(7) ...（再帰）
  → |height(2) - height(3)| を確認
  → isBalanced(2) の中でもう一度 height(4), height(5) を計算！ ← 二重計算

② ボトムアップ（採用）：1回のDFSで高さと均衡チェックを同時に行う
  → 各ノードをちょうど1回だけポインタでたどれば完了
```

> 📖 **このセクションで登場した用語**
>
> - **時間計算量**：入力の大きさに対して処理にかかる手間がどう増えるかの目安
> - **空間計算量**：処理中に使うメモリ量がどう増えるかの目安
> - **BFS（幅優先探索）**：木を同じ深さの層ごとに探索する手法。キュー（行列）を使う
> - **`container/list`**：Go標準ライブラリの双方向リンクリスト。BFSのキューとして使えるが、スライスより遅いことが多い

---

## 3. 採用アルゴリズムと根拠

- **選択したアプローチ**：② ボトムアップDFS（番兵値 `-1` パターン）

**理由（他のアプローチとの対比）：**

- ① トップダウンを「選ばなかった」理由：同じ `*TreeNode` ポインタを最大O(n)回たどり直すためO(n²)になるから
- ③ BFSを「選ばなかった」理由：`*TreeNode` を格納するスライス（キュー）の確保・拡張でアロケーションが発生し、空間計算量もO(n)になるから

**Go固有の採用理由：**

- 🟢 **クロージャの再帰定義**：`var checkHeight func(*TreeNode) int` → `checkHeight = func(...) {...}` というGoの慣用句がそのまま使える
- 🟢 **`nil` チェックの明快さ**：`if node == nil { return 0 }` の1行でベースケースが完結。Rustの `match` や TypeScriptの `if (node === null)` より簡潔
- 🟢 **追加アロケーションゼロ**：`int` 型の返り値のみやり取りするため、エスケープ解析の結果すべてスタック割り当てになる

**Go最適化戦略：**

- `leftHeight`, `rightHeight` は `int`（サイズ固定）なのでスタック上に確保
- `diff := leftHeight - rightHeight` で減算を1回だけ行い、正負両方を1つの変数で判定

> 📖 **このセクションで登場した用語**
>
> - **クロージャの再帰定義**：Goで再帰クロージャを書く際は、`var f func(...)` で先に変数を宣言してから代入する必要がある。これはGoの変数スコープのルール（代入の右辺は左辺が宣言済みでないと参照できない）による
> - **エスケープ解析**：変数をスタックに置けるかヒープに「逃がす」必要があるかをコンパイラが自動判断する仕組み
> - **ベースケース**：再帰関数が「これ以上深く潜らなくてよい」と判断して返す終端条件

---

## 4. 実装パターン

> 💡 **コードの骨格（構造）**
>
> 1. `isBalanced` はエントリポイント。`checkHeight` を呼んで `-1` でなければ `true`
> 2. クロージャ `checkHeight` を `var` で先に宣言し、代入する（再帰できるようにするため）
> 3. ベースケース：`node == nil` なら高さ `0` を返す
> 4. 左右を再帰的にチェックし、どちらかが `-1` なら即座に `-1` を伝播する（早期リターン）
> 5. 左右の差の絶対値が1より大きければ `-1`、そうでなければ `max(左, 右) + 1` を返す

---

### 【競技プログラミング版】 — LeetCode提出フォーマット

LeetCodeで制限時間内に通すことが目的です。エラーハンドリングを省略し、実行速度・コードの簡潔さを最優先します。

```go
// Runtime 0 ms
// Beats 100.00%
// Memory 7.38 MB
// Beats 40.08%
func isBalanced(root *TreeNode) bool {

    // ── クロージャとして再帰ヘルパーを定義 ─────────────────────────────
    // なぜ `var` で先に宣言するか：
    // Goでは「短縮変数宣言 :=」の右辺に、まだ宣言されていない変数を参照できない。
    // `checkHeight` 内で自分自身を呼ぶ（再帰）には、先に変数名を宣言しておく必要がある。
    //
    // なぜクロージャか：
    // Go の関数はトップレベルにしか定義できないが、クロージャ（無名関数）なら
    // 関数の中に「内部関数」を定義できる。外部から呼ばれない補助ロジックを
    // スコープ内に閉じ込めることができるため、名前の衝突を防げる。
    var checkHeight func(node *TreeNode) int

    checkHeight = func(node *TreeNode) int {

        // ── ベースケース ────────────────────────────────────────────────
        // `nil` は「ノードが存在しない」＝木の終端を意味する。
        // JavaやPythonの null と同じ概念だが、Goでは型を持った nil なので
        // 型の混乱が起きにくい。
        // 空の木の高さは 0 と定義する。この値が親ノードの高さ計算に使われる。
        if node == nil {
            return 0
        }

        // ── 左サブツリーを再帰的に検査 ──────────────────────────────────
        // `node.Left` は `*TreeNode` 型のポインタ。
        // ポインタをたどって左の子ノードにアクセスする。
        leftHeight := checkHeight(node.Left)

        // 左が -1（不均衡検知済み）なら、このノードでこれ以上調べても意味がない。
        // 早期リターンで無駄な処理を打ち切る。
        // これが「ボトムアップ」の核心：葉から根への帰り道でエラーを伝播させる。
        if leftHeight == -1 {
            return -1
        }

        // ── 右サブツリーを再帰的に検査 ──────────────────────────────────
        rightHeight := checkHeight(node.Right)

        // 右も同様に早期リターン。
        if rightHeight == -1 {
            return -1
        }

        // ── このノードでの均衡チェック ───────────────────────────────────
        // diff を1回計算して再利用することで、
        // `leftHeight - rightHeight` の計算が1回で済む（軽微な最適化）。
        // Go 1.21+ の組み込み `min` / `max` は整数に対応しているが、
        // 絶対値（abs）は組み込み関数がないため、`diff > 1 || diff < -1` で代替する。
        // なぜ math.Abs を使わないか：`math.Abs` は float64 用のため
        // int を渡すには型変換が必要で冗長になるから。
        diff := leftHeight - rightHeight
        if diff > 1 || diff < -1 {
            return -1
        }

        // ── このノードの高さを返す ───────────────────────────────────────
        // Go 1.21+ では組み込み `max` が整数に対して直接使えるようになった。
        // 以前は `if leftHeight > rightHeight { return leftHeight + 1 }` と
        // 書く必要があったが、より簡潔に書ける。
        // +1 は「自分自身のノード」分を追加している。忘れると高さが1ずれる。
        return max(leftHeight, rightHeight) + 1
    }

    // checkHeight が -1 でなければ均衡している。
    // シンプルな != -1 の比較で完結する。
    return checkHeight(root) != -1
}
```

---

### 【業務開発版】 — エラーハンドリング・可読性重視

チームで長期間メンテナンスするプロダクションコードに向きます。Goの慣用句に従い、`error` 戻り値を使ってエラーを明示的に表現します。

```go
import "fmt"

// ErrInvalidTree は木の構造が不正な場合のセンチネルエラー（＝パッケージレベルで定義する特定のエラー値）。
// errors.Is(err, ErrInvalidTree) で呼び出し元がエラー種別を確認できる。
var ErrInvalidTree = fmt.Errorf("invalid tree structure")

// isBalancedProduction は業務開発向けの実装。
//
// Goではエラーを戻り値で返す（try-catch を使わない）。
// JavaやPythonの例外と違い、呼び出し元が if err != nil で必ずエラーを確認する設計。
//
// Time Complexity: O(n) — 各ノードをちょうど1回訪問
// Space Complexity: O(h) — 再帰のコールスタック（h = 木の高さ）
func isBalancedProduction(root *TreeNode) (bool, error) {

    // ── 内部ヘルパー：高さを返し、不均衡なら (-1, nil) を返す ──────────
    // `error` を一緒に返すことで、将来的な拡張（例：ノード数の上限チェック追加）に対応できる。
    var checkHeight func(*TreeNode) (int, error)

    checkHeight = func(node *TreeNode) (int, error) {

        // ベースケース：nil ノード = 高さ 0
        if node == nil {
            return 0, nil
        }

        // 左サブツリーを再帰的に検査
        leftHeight, err := checkHeight(node.Left)
        if err != nil {
            // エラーが発生した場合、0 と error を返して呼び出し元に伝播する。
            // ? 演算子がないGoでは、この if err != nil パターンが慣用句。
            return 0, err
        }
        if leftHeight == -1 {
            return -1, nil // 不均衡を示す番兵値を伝播（これはエラーではなく仕様上の戻り値）
        }

        // 右サブツリーを再帰的に検査
        rightHeight, err := checkHeight(node.Right)
        if err != nil {
            return 0, err
        }
        if rightHeight == -1 {
            return -1, nil
        }

        // 均衡チェック
        diff := leftHeight - rightHeight
        if diff > 1 || diff < -1 {
            return -1, nil // 不均衡
        }

        // このノードの高さを返す（Go 1.21+ の組み込み max を使用）
        return max(leftHeight, rightHeight) + 1, nil
    }

    // ── メイン処理 ────────────────────────────────────────────────────
    height, err := checkHeight(root)
    if err != nil {
        // fmt.Errorf の %w（エラーラップ）で元のエラーを包む。
        // errors.Is(err, ErrInvalidTree) で上位が種別確認できるようにする。
        return false, fmt.Errorf("isBalancedProduction: %w", err)
    }

    return height != -1, nil
}
```

> 💡 **業務版と競技版の使い分け**
>
> |                | 競技プログラミング版     | 業務開発版                       |
> | -------------- | ------------------------ | -------------------------------- |
> | **目的**       | LeetCodeで正解を出すこと | プロダクションで長期メンテナンス |
> | **エラー**     | 番兵値 `-1` のみ         | `error` 戻り値で明示             |
> | **拡張性**     | 低い                     | 高い（将来の仕様追加に対応）     |
> | **コード量**   | 少ない                   | やや多い                         |
> | **今回の選択** | ✅ LeetCode提出はこちら  | 参考実装として提示               |

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

isBalanced(root=&{3, ...}) の呼び出し
  ↓
checkHeight(node=&{3}) 開始
  ├─ checkHeight(node=&{9}) 開始
  │    ├─ checkHeight(node=nil) → return 0   ← 9.Left が nil
  │    │   leftHeight = 0; (0 != -1) → 早期リターンしない
  │    ├─ checkHeight(node=nil) → return 0   ← 9.Right が nil
  │    │   rightHeight = 0; (0 != -1) → 早期リターンしない
  │    ├─ diff = 0 - 0 = 0; (0 <= 1 && 0 >= -1) → 均衡OK
  │    └─ return max(0, 0) + 1 = 1
  │
  │   leftHeight = 1; (1 != -1) → 早期リターンしない
  │
  ├─ checkHeight(node=&{20}) 開始
  │    ├─ checkHeight(node=&{15}) → return 1  ← 同様の手順
  │    │   leftHeight = 1; (1 != -1) → 早期リターンしない
  │    ├─ checkHeight(node=&{7}) → return 1
  │    │   rightHeight = 1; (1 != -1) → 早期リターンしない
  │    ├─ diff = 1 - 1 = 0; 均衡OK
  │    └─ return max(1, 1) + 1 = 2
  │
  │   rightHeight = 2; (2 != -1) → 早期リターンしない
  │
  ├─ diff = 1 - 2 = -1; (-1 <= 1 && -1 >= -1) → 均衡OK
  └─ return max(1, 2) + 1 = 3

checkHeight(root) = 3
isBalanced: 3 != -1 → true ✅
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

（葉からの帰り道）
checkHeight(&{4}) → 1
checkHeight(&{4}) → 1

checkHeight(&{3}) [左の3]
  └─ leftHeight=1, rightHeight=1, diff=0 → return 2

checkHeight(&{3}) [右の3]
  └─ leftHeight=0, rightHeight=0, diff=0 → return 1

checkHeight(&{2}) [左の2]
  └─ leftHeight=2, rightHeight=1
  └─ diff = 2 - 1 = 1; (1 <= 1) → 均衡ギリギリOK → return max(2,1)+1 = 3

checkHeight(&{2}) [右の2]
  └─ leftHeight=0, rightHeight=0 → return 1

checkHeight(&{1}) ← ルート
  └─ leftHeight=3, rightHeight=1
  └─ diff = 3 - 1 = 2; (2 > 1) → 不均衡！ → return -1

checkHeight(root) = -1
isBalanced: -1 == -1 → false ✅
```

---

**Example 3** `root = nil`（空の木）

```
checkHeight(node=nil) → return 0   ← ベースケースで即座に返す

isBalanced: 0 != -1 → true ✅
```

---

### 🔬 Goクロージャの再帰定義を図解

```go
// ❌ これはコンパイルエラーになる（checkHeight が未宣言のまま右辺で参照している）
checkHeight := func(node *TreeNode) int {
    return checkHeight(node.Left)  // ← この時点で checkHeight はまだ宣言されていない！
}

// ✅ Goの正しい書き方：先に var で型だけ宣言 → 後から代入
var checkHeight func(*TreeNode) int   // ← ここで型だけ決める（値はゼロ値 nil）
checkHeight = func(node *TreeNode) int {
    return checkHeight(node.Left)  // ← 今度は checkHeight が宣言済みなので参照できる
}
```

> 📖 **このセクションで登場した用語**
>
> - **ポインタレシーバ `*T`**：`func (s *Solution) Method()` のように型に `*` を付けること。フィールドを変更したい場合に必要。今回は struct のフィールドを変えないため不要
> - **`defer`**：関数終了時に必ず実行される後処理を登録する仕組み。今回は再帰DFSなのでリソース解放は不要だが、`sync.Mutex` のロック解除などに活用される
> - **早期リターン**：条件を満たした時点で即座に `return` すること。不要な後続処理を省いて効率を上げる
> - **センチネルエラー**：`var ErrNotFound = errors.New("not found")` のようにパッケージレベルで定義した特定のエラー値。`errors.Is` で比較できる
> - **`max` 組み込み関数**：Go 1.21+ で追加。以前は `if a > b { return a }` と書く必要があったが、整数に対しても直接使えるようになった

---

## 最終回答（LeetCode 提出フォーマット）

```go
func isBalanced(root *TreeNode) bool {
    var checkHeight func(node *TreeNode) int
    checkHeight = func(node *TreeNode) int {
        if node == nil {
            return 0
        }
        leftHeight := checkHeight(node.Left)
        if leftHeight == -1 {
            return -1
        }
        rightHeight := checkHeight(node.Right)
        if rightHeight == -1 {
            return -1
        }
        diff := leftHeight - rightHeight
        if diff > 1 || diff < -1 {
            return -1
        }
        return max(leftHeight, rightHeight) + 1
    }
    return checkHeight(root) != -1
}
```

**計算量サマリー**

|          | 計算量   | 詳細                                                                                     |
| -------- | -------- | ---------------------------------------------------------------------------------------- |
| ⏱ Time  | **O(n)** | 各ノードのポインタをちょうど1回たどる                                                    |
| 💾 Space | **O(h)** | 再帰のコールスタックが木の高さ分だけ積まれる（均衡木ならO(log n)、最悪の一直線木でO(n)） |
| 🔒 Alloc | **ゼロ** | `int` のやり取りのみ。追加のスライス・マップ・ヒープ確保なし                             |

**3言語比較まとめ**

|                   | TypeScript                        | Rust                            | Go                             |
| ----------------- | --------------------------------- | ------------------------------- | ------------------------------ |
| ノードの型        | `TreeNode \| null`                | `Option<Rc<RefCell<TreeNode>>>` | `*TreeNode`                    |
| null/nil チェック | `if (node === null)`              | `match node { None => ... }`    | `if node == nil`               |
| 再帰関数の定義    | `function checkHeight(...) {...}` | `fn check_height(...) {...}`    | `var f func; f = func() {...}` |
| 簡潔さ            | ⭐⭐⭐                            | ⭐⭐                            | ⭐⭐⭐⭐                       |
| 型安全の強度      | ⭐⭐⭐                            | ⭐⭐⭐⭐⭐                      | ⭐⭐⭐⭐                       |
