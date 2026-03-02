# Candy Jars - 範囲加算の平均を O(m) で求める

---

## 目次

- [概要](#overview)
- [アルゴリズム要点 TL;DR](#tldr)
- [図解](#figures)
- [証明のスケッチ](#proof)
- [計算量](#complexity)
- [Python 実装](#impl)
- [CPython 最適化](#cpython)
- [エッジケースと検証](#edgecases)
- [FAQ](#faq)

---

<h2 id="overview">概要</h2>

### 問題要約

$n$ 個のキャンディ瓶（初期値 $0$）に対して $m$ 回の操作を行う。
各操作 $[a,\, b,\, v]$ は「インデックス $a$ 以上 $b$ 以下の瓶すべてに $v$ 個追加」を意味する。
全操作後の **平均キャンディ数の床関数** $\lfloor \bar{c} \rfloor$ を返せ。

### 入出力仕様

| 項目   | 内容                                  |
| ------ | ------------------------------------- |
| 入力 1 | 整数 $n$（瓶の数）、$m$（操作数）     |
| 入力 2 | $m$ 行、各行 $a\; b\; v$              |
| 出力   | $\lfloor \text{平均} \rfloor$（整数） |

### 制約

$$1 \le n \le 10^7,\quad 1 \le m \le 10^5,\quad 1 \le a \le b \le n,\quad 0 \le v \le 10^9$$

---

<h2 id="tldr">アルゴリズム要点 TL;DR</h2>

### 核心的洞察

> **差分配列は不要。総和だけ計算すれば十分。**

各操作 $[a, b, v]$ が全瓶の総和に与える寄与は

$$\Delta S = v \times (b - a + 1)$$

全操作後の総和 $S$ は

$$S = \sum_{i=1}^{m} v_i \times (b_i - a_i + 1)$$

平均の床関数は

$$\text{answer} = \left\lfloor \frac{S}{n} \right\rfloor$$

### なぜこれで正しいか

$$\bar{c} = \frac{1}{n} \sum_{j=1}^{n} c_j = \frac{1}{n} \sum_{i=1}^{m} \sum_{j=a_i}^{b_i} v_i = \frac{1}{n} \sum_{i=1}^{m} v_i (b_i - a_i + 1)$$

**各瓶の個別値を求める必要がない** → $O(m)$ で完結。

---

<h2 id="figures">図解</h2>

### フローチャート

```mermaid
flowchart TD
  Start[開始] --> Init[総和 S を 0 で初期化]
  Init --> Loop[操作 i を 1 から m まで繰り返す]
  Loop --> Calc[寄与 = v × (b - a + 1) を S に加算]
  Calc --> Check{全操作完了?}
  Check -- No --> Loop
  Check -- Yes --> Avg[平均 = S を n で整数除算]
  Avg --> End[結果を返す]
```

_フロー解説: 差分配列展開・復元ステップを完全にスキップし、各操作の寄与だけを O(1) で加算する。_

---

### 具体例のデータフロー

```
n=5, 操作=[[1,2,100], [2,5,100], [3,4,100]]

操作1: [1,2,100]  → 寄与 = 100 × (2-1+1) = 100×2 =  200
操作2: [2,5,100]  → 寄与 = 100 × (5-2+1) = 100×4 =  400
操作3: [3,4,100]  → 寄与 = 100 × (4-3+1) = 100×2 =  200
                                               ─────────
総和 S                                        =  800
平均 = floor(800 / 5)                         =  160 ✅
```

---

### 差分配列アプローチとの比較

```
差分配列アプローチ（過剰）             直接総和アプローチ（最適）
─────────────────────────────────────  ──────────────────────────────
1. diff 配列を n+2 サイズで確保        1. S = 0 を初期化
2. 各操作で diff[a]+=v, diff[b+1]-=v  2. 各操作で S += v*(b-a+1)
3. prefix sum を展開 → O(n)           3. 終了
4. sum() で総和 → O(n)
5. 平均を計算

時間: O(n+m)  空間: O(n)              時間: O(m)  空間: O(1)
```

---

<h2 id="proof">証明のスケッチ</h2>

### 不変条件

各操作適用後、以下が常に成立する。

$$S = \sum_{j=1}^{n} c_j$$

ここで $c_j$ は瓶 $j$ の現在のキャンディ数。

### 基底ケース

操作 $0$ 回後: 全 $c_j = 0$、よって $S = 0$。✓

### 帰納法

操作 $k$ 回後に $S_k = \sum_j c_j^{(k)}$ が成立すると仮定する。
操作 $k+1$ の内容を $[a, b, v]$ とすると

$$S_{k+1} = S_k + \sum_{j=a}^{b} v = S_k + v(b - a + 1)$$

これは計算式と完全に一致する。✓

### 終了性

$m$ 回の有限ループで必ず終了。$v \ge 0$ かつ $b \ge a$ より各寄与は非負。

### floor の正当性

Python の `//` 演算子は **切り捨て除算**（床関数）を実装しており、$S \ge 0$ かつ $n > 0$ の場合

$$S \,\mathbin{//}\, n = \left\lfloor \frac{S}{n} \right\rfloor$$

が保証される。

---

<h2 id="complexity">計算量</h2>

| 指標 | 計算量 | 説明                                   |
| ---- | ------ | -------------------------------------- |
| 時間 | $O(m)$ | 操作数のみに依存、$n$ の大きさに非依存 |
| 空間 | $O(1)$ | 追加配列不要、整数 $S$ のみ            |

### 差分配列との比較

| アプローチ           | 時間           | 空間   | 備考                  |
| -------------------- | -------------- | ------ | --------------------- |
| **直接総和（本解）** | $O(m)$         | $O(1)$ | 最適解                |
| 差分配列             | $O(n + m)$     | $O(n)$ | $n=10^7$ で無駄に遅い |
| 愚直シミュレーション | $O(n \cdot m)$ | $O(n)$ | $10^{12}$ 操作で TLE  |

$n = 10^7,\; m = 10^5$ のとき

$$O(n \cdot m) = O(10^{12}) \gg O(n+m) = O(10^7) \gg O(m) = O(10^5)$$

---

<h2 id="impl">Python 実装</h2>

```python
from __future__ import annotations

import math
import os
import sys
from typing import List


# ──────────────────────────────────────────────
# 競技プログラミング向け実装
# Time:  O(m)   ← 操作数のみ
# Space: O(1)   ← 追加配列なし
# ──────────────────────────────────────────────
def solve(n: int, operations: List[List[int]]) -> int:
    """
    全操作後の平均キャンディ数の床関数を返す。

    核心式:
        S = Σ v_i × (b_i - a_i + 1)
        answer = floor(S / n) = S // n

    Args:
        n:          瓶の数
        operations: [[a, b, v], ...] 形式の操作リスト
    Returns:
        floor(平均) の整数値
    """
    # S = Σ v * (b - a + 1)
    total: int = sum(v * (b - a + 1) for a, b, v in operations)

    # floor(S / n) = S // n  (S >= 0, n > 0 が保証されるため)
    return total // n


# ──────────────────────────────────────────────
# 業務開発向け実装（型安全・バリデーション付き）
# ──────────────────────────────────────────────
def solve_production(n: int, operations: List[List[int]]) -> int:
    """
    入力検証付きの安全な実装。

    Raises:
        ValueError: n が正でない、または操作が制約違反の場合
        TypeError:  引数の型が不正な場合
    """
    if not isinstance(n, int):
        raise TypeError(f"n は整数である必要があります: {type(n)}")
    if n <= 0:
        raise ValueError(f"n は正の整数である必要があります: {n}")

    if not isinstance(operations, (list, tuple)):
        raise TypeError(f"operations はリストまたはタプルである必要があります: {type(operations)}")
    if len(operations) == 0:
        return 0

    total: int = 0
    for op in operations:
        if not isinstance(op, (list, tuple)):
            raise TypeError(f"各操作はリストまたはタプルである必要があります: {type(op)}")
        if len(op) != 3:
            raise ValueError(f"操作は 3 要素である必要があります: {op}")

        a, b, v = op
        if not (isinstance(a, int) and isinstance(b, int) and isinstance(v, int)):
            raise TypeError(f"操作の要素 a, b, v はすべて整数である必要があります: {a}, {b}, {v}")

        if not (1 <= a <= b <= n):
            raise ValueError(f"無効なインデックス範囲 [{a}, {b}]（n={n}）")
        if v < 0:
            raise ValueError(f"v は非負である必要があります: {v}")
        total += v * (b - a + 1)   # Δ S = v × (b - a + 1)

    return total // n              # floor(S / n)


# ──────────────────────────────────────────────
# HackerRank エントリポイント
# ──────────────────────────────────────────────
if __name__ == '__main__':
    with open(os.environ['OUTPUT_PATH'], 'w') as fptr:
        first_multiple_input = input().rstrip().split()
        n = int(first_multiple_input[0])
        m = int(first_multiple_input[1])

        operations: List[List[int]] = []
        for _ in range(m):
            operations.append(list(map(int, input().rstrip().split())))

        result = solve(n, operations)
        fptr.write(str(result) + '\n')
```

---

<h2 id="cpython">CPython 最適化</h2>

### 1. ジェネレータ式による遅延評価

```python
# NG: リスト全体をメモリに展開してから sum
total = sum([v * (b - a + 1) for a, b, v in operations])  # O(m) メモリ

# OK: ジェネレータで逐次評価
total = sum(v * (b - a + 1) for a, b, v in operations)    # O(1) メモリ
```

### 2. アンパック代入でインデックスアクセスを回避

```python
# NG: operations[i][0], operations[i][1], operations[i][2] と明示的にアクセス
# OK: for a, b, v in operations  ← CPython の UNPACK_SEQUENCE が高速
```

### 3. sys.stdin の高速化（大量入力時）

```python
import sys
input = sys.stdin.readline  # input() より高速
```

### 4. Python 整数演算の特性

CPython では $10^{16}$ を超える整数も **bignum** として正確に処理される。
$n \le 10^7,\; m \le 10^5,\; v \le 10^9$ の最大値では

$$S_{\max} = 10^9 \times 10^7 \times 10^5 = 10^{21}$$

`//` 演算子は bignum に対しても正確に機能するため、オーバーフローの心配は不要。

---

<h2 id="edgecases">エッジケースと検証</h2>

### ケース一覧

| ケース       | $n$    | 操作                              | 期待値   | 計算式                        |
| ------------ | ------ | --------------------------------- | -------- | ----------------------------- |
| 全瓶同じ     | 3      | `[[1,3,5]]`                       | $5$      | $\lfloor 15/3 \rfloor = 5$    |
| 操作なし     | 5      | `[]`                              | $0$      | $\lfloor 0/5 \rfloor = 0$     |
| 単一瓶       | 1      | `[[1,1,999]]`                     | $999$    | $\lfloor 999/1 \rfloor = 999$ |
| 小数切り捨て | 3      | `[[1,1,10]]`                      | $3$      | $\lfloor 10/3 \rfloor = 3$    |
| 最大値       | $10^7$ | $10^5$ 回, $v=10^9$               | 計算通り | bignum で正確                 |
| サンプル1    | 5      | `[[1,2,100],[2,5,100],[3,4,100]]` | $160$    | $\lfloor 800/5 \rfloor = 160$ |

### サンプル入力の手動検証

```
n=5, ops=[[1,2,100],[2,5,100],[3,4,100]]

瓶の状態遷移:
  初期:       [0,   0,   0,   0,   0]
  op[1,2,100]:[100, 100, 0,   0,   0]
  op[2,5,100]:[100, 200, 100, 100, 100]
  op[3,4,100]:[100, 200, 200, 200, 100]

総和 = 100+200+200+200+100 = 800
直接計算: 100×2 + 100×4 + 100×2 = 200+400+200 = 800  ✅
平均 = 800 // 5 = 160  ✅
```

---

<h2 id="faq">FAQ</h2>

**Q1. なぜ差分配列（Difference Array）が不要なのか？**

差分配列は各瓶の**個別の最終値**を知りたいときに必要。
今回は**総和のみ**が必要なので、各操作の寄与 $v(b-a+1)$ を直接加算するだけでよい。

---

**Q2. `//` は本当に floor と等価か？**

Python の `//` はすべての整数（負の値を含む）に対して切り捨て除算（数学的な床関数）を実装しており、

$$S \,\mathbin{//}\, n = \left\lfloor \frac{S}{n} \right\rfloor$$

が成立する。本問では $v \ge 0$ が保証されるため `//` で十分。

---

**Q3. Python の整数はオーバーフローしないのか？**

CPython の `int` 型は**任意精度の bignum** であり、オーバーフローしない。
最大総和 $S_{\max} \approx 10^{21}$ も正確に計算される。

---

**Q4. `sum()` と `for` ループどちらが速いか？**

CPython では組み込みの `sum()` は C 実装のため、純粋な `for` ループより定数倍高速。
ジェネレータ式と組み合わせることで空間効率も $O(1)$ に保てる。

---

**Q5. 操作が空（`m=0`）の場合はどうなるか？**

`sum()` は空のイテラブルに対して `0` を返すため、`0 // n = 0` となり正しく処理される。
