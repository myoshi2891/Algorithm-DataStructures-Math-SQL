制約を考慮して、**エラトステネスの篩**で 300,000 以下の素数をあらかじめ全て求め、各質問に対して高速に `O(1)` で判定できるようにしています。

---

### ✅ JavaScriptコード（Node.js環境向け）

```javascript
const fs = require('fs');

// 標準入力を読み込み（Node.js向け）
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');

const Q = parseInt(input[0]);
const queries = input.slice(1).map(Number);

// ===== エラトステネスの篩 =====
const MAX = 300000;
const is_prime = new Array(MAX + 1).fill(true);
is_prime[0] = is_prime[1] = false;

for (let i = 2; i * i <= MAX; i++) {
    if (is_prime[i]) {
        for (let j = i * i; j <= MAX; j += i) {
            is_prime[j] = false;
        }
    }
}

// ===== 質問に答える =====
for (let i = 0; i < Q; i++) {
    const x = queries[i];
    console.log(is_prime[x] ? 'Yes' : 'No');
}
```

---

### 🔍 実行方法（Node.jsの場合）

1. ファイルを `prime_check.js` として保存
2. 入力をファイルから渡す場合：
    ```bash
    node prime_check.js < input.txt
    ```

---

### 🧠 ポイント解説

- 入力の数が多いため、各回で素数判定するのではなく、**事前に 300,000 以下のすべての素数を求めておく**のが効率的です。
- `is_prime[x]` を使えば、各質問に `O(1)` で答えられるので、**全体で O(N + √N + Q)** の計算量で済みます。
- `fs.readFileSync('/dev/stdin')` を使って標準入力を受け取るのは Node.js で競技プログラミング的な入力に対応するためです。

---

### ✅ 入力例での動作確認

入力:

```
4
17
31
35
49
```

出力:

```
Yes
Yes
No
No
```

---

この `for` ループは、**エラトステネスの篩（ふるい）** の中心的な処理部分です。  
以下に、**一行ずつ丁寧に解説**します。

---

### 👇 対象コード：

```javascript
for (let i = 2; i * i <= MAX; i++) {
    if (is_prime[i]) {
        for (let j = i * i; j <= MAX; j += i) {
            is_prime[j] = false;
        }
    }
}
```

---

### 🔍 行ごとの説明

#### `for (let i = 2; i * i <= MAX; i++)`

- `i` は現在の「候補となる素数」を表します。
- ループの上限が `i * i <= MAX` なのは、例えば `MAX = 100` なら、10まで調べれば十分だからです。
    - なぜなら、それ以上の `i` に対しては、`i * i > MAX` となり、それ以下の倍数はすでに前のループで除去済みです。

---

#### `if (is_prime[i])`

- 現在の `i` がまだ素数と判定されている場合のみ処理を行います。
- `i` がすでに他の素数で割り切れる（＝素数じゃない）ならスキップ。

---

#### `for (let j = i * i; j <= MAX; j += i)`

- `i` の倍数である `j` を順に見ていきます。
- 開始が `i * i` になっているのは、`i * 2`, `i * 3`, ..., `i * (i - 1)` は**すでにそれより小さい素数で消されている**ため、ここから始めれば十分だからです。
    - たとえば `i = 5` のとき、`5 * 2 = 10` や `5 * 3 = 15` は `i = 2` や `i = 3` の時点で `false` にされている。

---

#### `is_prime[j] = false;`

- `j` は `i` の倍数なので、素数ではありません。`false` に設定します。
- これにより、最終的に `is_prime[x] === true` となる `x` は **素数**だけになります。

---

### ✅ このループの効果

このループを通すことで、`is_prime[0..MAX]` に「素数かどうかの真偽値」がすべて正しく設定されます。  
時間計算量はおおよそ **O(N log log N)** と非常に高速で、Q=10,000・X≤300,000 のような大規模な問題にも対応可能です。

---

### 📌 まとめ

| 変数          | 意味                                        |
| ------------- | ------------------------------------------- |
| `i`           | 素数の候補（2から√MAXまで）                 |
| `j`           | `i` の倍数（合成数）                        |
| `is_prime[x]` | x が素数なら `true`、そうでなければ `false` |

---

---

## ✅ 1. フェルマーテストによる素数判定（a = 2 固定）

### 🔍 手順の要点

- N が 1 より大きく、かつ `a^(N-1) ≡ 1 (mod N)` であれば、N は素数の可能性が高い
- a は固定で `2`
- 簡易的なフェルマーテストなので **擬素数**を素数と誤認する可能性があります（例：カーマイケル数）

---

### ✅ フェルマーテスト実装（PHP）

```php
<?php
function fermat_test($n) {
    if ($n <= 1) return false;
    if ($n == 2) return true;
    if ($n % 2 == 0) return false;

    $a = 2;
    $res = mod_pow($a, $n - 1, $n);
    return $res === 1;
}

// 高速累乗（繰り返し二乗法）
function mod_pow($base, $exp, $mod) {
    $result = 1;
    while ($exp > 0) {
        if ($exp % 2 === 1) {
            $result = ($result * $base) % $mod;
        }
        $base = ($base * $base) % $mod;
        $exp = intdiv($exp, 2);
    }
    return $result;
}

// 入力処理
$Q = (int)trim(fgets(STDIN));
for ($i = 0; $i < $Q; $i++) {
    $x = (int)trim(fgets(STDIN));
    echo fermat_test($x) ? "Yes\n" : "No\n";
}
```

---

## ✅ 2. ミラー・ラビン素数判定法（より高精度なテスト）

### 🔍 特徴

- フェルマーテストを改良し、**カーマイケル数**の誤判定も回避可能
- 一般に `a` を複数使うことで精度を高めます（ここでは 2, 3, 5 を使う）

---

### ✅ ミラー・ラビン法 実装（PHP）

```php
<?php
function is_prime_miller_rabin($n) {
    if ($n < 2) return false;
    if ($n === 2 || $n === 3) return true;
    if ($n % 2 === 0) return false;

    $d = $n - 1;
    $s = 0;
    while ($d % 2 === 0) {
        $d /= 2;
        $s++;
    }

    // 任意の基数 a（小さい値で十分）
    $bases = [2, 3, 5];
    foreach ($bases as $a) {
        if ($a >= $n) continue;

        $x = mod_pow($a, $d, $n);
        if ($x == 1 || $x == $n - 1) continue;

        $is_composite = true;
        for ($r = 1; $r < $s; $r++) {
            $x = mod_pow($x, 2, $n);
            if ($x == $n - 1) {
                $is_composite = false;
                break;
            }
        }

        if ($is_composite) return false;
    }

    return true;
}

// 繰り返し二乗法
function mod_pow($base, $exp, $mod) {
    $result = 1;
    while ($exp > 0) {
        if ($exp % 2 === 1) {
            $result = ($result * $base) % $mod;
        }
        $base = ($base * $base) % $mod;
        $exp = intdiv($exp, 2);
    }
    return $result;
}

// 入力処理
$Q = (int)trim(fgets(STDIN));
for ($i = 0; $i < $Q; $i++) {
    $x = (int)trim(fgets(STDIN));
    echo is_prime_miller_rabin($x) ? "Yes\n" : "No\n";
}
```

---

## ✅ 精度と用途の違い

| 判定方法           | 精度                   | 実行速度         | 説明                               |
| ------------------ | ---------------------- | ---------------- | ---------------------------------- |
| エラトステネスの篩 | 完全                   | 高速（O(1)判定） | 事前処理は必要だが最速・確実       |
| フェルマーテスト   | 中（擬素数に弱い）     | 早い             | 簡単な高速判定、誤判定の可能性あり |
| ミラー・ラビン法   | 高（擬似素数にも強い） | 少し遅い         | 暗号などでも使われる高精度手法     |

---
