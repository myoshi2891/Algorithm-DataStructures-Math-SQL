// 以下は、指定された仕様に従って `myAtoi` 関数を TypeScript で実装したものです。
function myAtoi(s: string): number {
    const INT_MIN = -(2 ** 31);
    const INT_MAX = 2 ** 31 - 1;

    let i = 0;
    const n = s.length;

    // 1. 空白をスキップ
    while (i < n && s[i] === ' ') {
        i++;
    }

    // 2. 符号の確認
    let sign = 1;
    if (i < n && (s[i] === '+' || s[i] === '-')) {
        if (s[i] === '-') sign = -1;
        i++;
    }

    // 3. 数字を読み取る
    let result = 0;
    while (i < n && s[i] >= '0' && s[i] <= '9') {
        const digit = s[i].charCodeAt(0) - '0'.charCodeAt(0);

        // 4. オーバーフロー確認
        if (result > Math.floor(INT_MAX / 10) || 
            (result === Math.floor(INT_MAX / 10) && digit > INT_MAX % 10)) {
            return sign === 1 ? INT_MAX : INT_MIN;
        }

        result = result * 10 + digit;
        i++;
    }

    return result * sign;
}

// ### ✅ 処理フローの図解説明

// #### 例: `"  -042"` の場合

// | ステップ | 処理                       | 状態                 |
// | ---- | ------------------------ | ------------------ |
// | 1    | 空白をスキップ (`i=0→3`)        | `i=3`, `s[i]='-'`  |
// | 2    | `'-'`を見つけた → `sign = -1` | `i=4`, `sign = -1` |
// | 3    | `0` → `4` → `2` と読み取る    | `result = 42`      |
// | 4    | 範囲内 → そのまま返す             | `return -42`       |

// ---

// ### ✅ 制約への対応

// * 空文字列や非数字始まり → `0` を返す
// * 数値部分が 32-bit の範囲外 → オーバーフロー対策済み
// * 入力が `"words and 987"` のようなケース → 先頭が非数字 → `0` を返す

// ---

// ### ✅ テスト例

// ```typescript
// console.log(myAtoi("42"));          // 42
// console.log(myAtoi("   -042"));     // -42
// console.log(myAtoi("1337c0d3"));    // 1337
// console.log(myAtoi("0-1"));         // 0
// console.log(myAtoi("words and 987")); // 0
// console.log(myAtoi("-91283472332"));  // -2147483648（下限に丸められる）
// console.log(myAtoi("91283472332"));   // 2147483647（上限に丸められる）
// ```
