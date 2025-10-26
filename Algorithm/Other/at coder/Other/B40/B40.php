<!-- 以下は **PHP 8.2.8** に対応した解答です。
時間計算量 `O(N)`・空間計算量 `O(100)` で、**最大入力サイズ N = 200,000 に対しても高速**に動作します。

---

## ✅ アルゴリズムの概要

* 各要素 `A[i]` の `A[i] % 100` の回数をカウント
* 組 `(i, j)` が `(A[i] + A[j]) % 100 == 0` を満たすのは：

  * `(0, 0)`, `(50, 50)`：→ `nC2`（同じ余りの中から2つ選ぶ）
  * `(r, 100 - r)`：→ `count[r] * count[100 - r]`（r=1〜49）

---

## ✅ PHP 実装（型付きコメントつき）

```php -->
<?php

/**
 * 条件を満たす (i, j) のペア数を返す
 *
 * @param int $n 配列の長さ
 * @param array<int> $a 整数配列（長さ $n）
 * @return int 条件を満たすペアの数
 */
function countDivisiblePairs(int $n, array $a): int
{
    /** @var array<int> $modCount mod 100 の出現回数を格納 */
    $modCount = array_fill(0, 100, 0);

    // A[i] % 100 の頻度をカウント
    foreach ($a as $value) {
        $mod = $value % 100;
        $modCount[$mod]++;
    }

    $result = 0;

    // mod=0 のペア (C(n, 2))
    $result += intdiv($modCount[0] * ($modCount[0] - 1), 2);

    // mod=50 のペア
    $result += intdiv($modCount[50] * ($modCount[50] - 1), 2);

    // mod=r, 100-r のペア (r=1〜49)
    for ($r = 1; $r < 50; $r++) {
        $result += $modCount[$r] * $modCount[100 - $r];
    }

    return $result;
}

// ----------- 入出力処理 ------------
$input = trim(stream_get_contents(STDIN));
$tokens = preg_split('/\s+/', $input);
$n = (int)array_shift($tokens);
$a = array_map('intval', $tokens);

// 結果出力
echo countDivisiblePairs($n, $a) . PHP_EOL;
// ```

// ---

// ## ✅ 実行方法

// ファイル名を `main.php` とした場合：

// ```bash
// php main.php < input.txt
// ```

// ---

// ## ✅ 処理時間・メモリ量

// * **時間計算量：** `O(N)`（配列走査＋mod集計）
// * **空間計算量：** `O(100)`（固定配列1つ）→ 約数KB

// メモリ制限：**1024 MiB** 以内に大幅な余裕あり

// ---

// ## ✅ 入力例と出力例

// ### 入力:

// ```
// 9
// 10 20 30 40 50 60 70 80 90
// ```

// ### 出力:

// ```
// 4
// ```

// ---

// 必要であれば、テスト用の `input.txt` や `unittest` の形式もお渡しできます。どうしますか？