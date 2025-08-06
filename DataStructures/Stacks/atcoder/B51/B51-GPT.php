<!-- 以下は **PHP 8.2.8** を用いた解答です。

---

## ✅ 要件対応一覧

| 要件             | 対応内容                             |
| -------------- | -------------------------------- |
| 型の明示           | PHPDoc による明示的な型指定                |
| 関数ベース設計        | 入力処理・括弧対応処理・出力をすべて関数で分離          |
| 処理時間・メモリ考慮     | `O(N log N)` 時間、`O(N)` 空間で効率的に処理 |
| 最大長 200,000 対応 | メモリ制限 1024 MiB／2秒以内に収まる構成        |

---

## ✅ 実装コード（PHP 8.2.8）

```php -->
<?php

/**
 * 対応の取れた括弧列 S の対応括弧位置を求める
 *
 * @param string $s 括弧列（例: "(())()」）
 * @return array<int[]> 対応する括弧の位置ペア（1-indexed）。各要素は [l, r]。
 */
function findMatchingParentheses(string $s): array {
    $stack = [];            // @var int[] スタック（左括弧の位置を記録）
    $pairs = [];            // @var array<int[]> 結果のペアを格納

    $n = strlen($s);
    for ($i = 0; $i < $n; $i++) {
        if ($s[$i] === '(') {
            $stack[] = $i + 1; // 1-indexed
        } else {
            if (!empty($stack)) {
                $left = array_pop($stack); // int
                $pairs[] = [$left, $i + 1];
            }
        }
    }

    // max(l, r) 昇順でソート
    usort($pairs, function(array $a, array $b): int {
        return max($a[0], $a[1]) <=> max($b[0], $b[1]);
    });

    return $pairs;
}

/**
 * 入力を読み取り、対応括弧の位置を出力する
 *
 * @return void
 */
function main(): void {
    $input = trim(fgets(STDIN));
    $result = findMatchingParentheses($input);
    foreach ($result as [$l, $r]) {
        echo "$l $r\n";
    }
}

main();
// ```

// ---

// ## ✅ 実行例

// ```
// Input:
// (())()

// Output:
// 2 3
// 1 4
// 5 6
// ```

// ---

// ## ✅ 処理時間・メモリ効率（分析）

// | 項目    | 計算量        | 詳細                     |
// | ----- | ---------- | ---------------------- |
// | 時間計算量 | O(N log N) | 探索：O(N)、ソート：O(N log N) |
// | 空間計算量 | O(N)       | スタック＋結果リスト             |
// | 入力最大長 | 200,000    | 問題なし                   |
// | メモリ制限 | 1024MiB    | 問題なし                   |

// ---

// ## ✅ 補足

// * `array_pop` の戻り値が `null` になる可能性があるため、`!empty($stack)` で安全確認。
// * 型ヒントがPHPの関数引数では完全に対応していないため、`@param` / `@return` で静的解析に備えています。
// * 追加要件があれば対応できます（例：ペアを辞書順に、逆順出力など）。

// ---

// ご希望があれば、**逐次出力バージョン**や**高速 I/O 対応版**の実装も提示可能です。