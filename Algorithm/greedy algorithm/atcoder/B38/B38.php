<!-- 以下は、問題に対する **PHP 8.2.8** を用いた解答です。
処理時間（1秒）、メモリ制限（1024MiB）を考慮し、**O(N) 時間・O(N) 空間**の効率的なアルゴリズムを採用しています。

---

## ✅ 解法概要（再掲）

* 各草の高さを最小の整数（1）で初期化。
* `'A'` に対して前から昇順補正、`'B'` に対して後ろから降順補正。
* 最終的な高さの合計が最小になる。

---

## ✅ PHP 8.2.8 実装

```php -->
<?php

/**
 * 草の高さの合計の最小値を計算する。
 *
 * @param int $n 草の本数（1 <= $n <= 3000）
 * @param string $s 草の比較条件（長さ $n - 1、'A' または 'B' からなる）
 * @return int 草の高さの合計として考えられる最小値
 */
function computeMinimumTotalHeight(int $n, string $s): int {
    // 各草の初期高さは1
    $height = array_fill(0, $n, 1);

    // 左から 'A' 条件に従って昇順に補正
    for ($i = 0; $i < $n - 1; $i++) {
        if ($s[$i] === 'A' && $height[$i] >= $height[$i + 1]) {
            $height[$i + 1] = $height[$i] + 1;
        }
    }

    // 右から 'B' 条件に従って降順に補正
    for ($i = $n - 2; $i >= 0; $i--) {
        if ($s[$i] === 'B' && $height[$i] <= $height[$i + 1]) {
            $height[$i] = $height[$i + 1] + 1;
        }
    }

    // 合計値を返す
    return array_sum($height);
}

/**
 * エントリポイント：標準入力を読み込み、結果を出力する。
 */
function main(): void {
    $lines = explode("\n", trim(file_get_contents("php://stdin")));
    $n = (int)$lines[0];
    $s = trim($lines[1]);

    $result = computeMinimumTotalHeight($n, $s);
    echo $result . PHP_EOL;
}

main();
// ```

// ---

// ## ✅ 入力例と実行例

// ### 入力:

// ```
// 7
// AABBBA
// ```

// ### 実行:

// ```bash
// php solve.php
// ```

// 入力を手動で入れるか、パイプで渡す：

// ```bash
// echo -e "7\nAABBBA" | php solve.php
// # 出力: 15
// ```

// ---

// ## ✅ 処理性能

// * **時間計算量:** `O(N)`（最大3000回のループ）
// * **空間計算量:** `O(N)`（高さ配列）

// PHP 8.2.8 の実行速度でも制限内（1秒・1024MiB）で十分処理可能です。

// ---

// ## ✅ コメントと型について

// * PHP 8.2.8 では関数の引数・戻り値に **厳格な型指定**が可能（`int`, `string`, `void`など）。
// * `declare(strict_types=1);` を使うとさらに安全な型チェックも可能（必要であれば追加できます）。

// ---

// ご希望があれば：

// * `unittest`によるテスト例
// * 入力が全てBや全てAなどの特殊パターン例
// * 処理中のデバッグ表示付き実装

// なども対応可能です。お気軽にどうぞ。