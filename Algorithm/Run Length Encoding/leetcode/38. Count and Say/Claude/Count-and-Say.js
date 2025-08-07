// この問題はcount-and-say数列のn番目の要素を求める問題ですね。Run-Length Encoding（RLE）を使って前の数列から次の数列を生成していきます。

// Runtime
// 5
// ms
// Beats
// 70.47%
// Memory
// 57.67
// MB
// Beats
// 30.08%

// 効率的な解法として、反復的なアプローチを使用します：この解法のポイント：

// 1. **反復的アプローチ**: 再帰ではなく反復を使用することで、スタックオーバーフローを避け、メモリ効率を向上させています。

// 2. **効率的なRLE実装**: `runLengthEncode`関数では、文字列を1回だけスキャンして連続する文字をカウントし、その場で結果を構築します。

// 3. **メモリ効率**: 必要最小限の変数のみを使用し、不要な配列や複雑なデータ構造を避けています。

// 4. **時間計算量**: O(m × k) ここで、mはnまでの各ステップで生成される文字列の平均長、kはステップ数（n-1）

// 5. **空間計算量**: O(m) 各ステップで生成される文字列の長さに比例

// この実装は、LeetCodeの制約（n ≤ 30）に対して十分効率的で、処理時間とメモリ消費量の両方を最適化しています。

/**
 * Count and Say数列のn番目の要素を返す関数
 * @param {number} n - 取得したい数列の位置（1以上30以下）
 * @return {string} - n番目のcount-and-say数列の文字列
 */
var countAndSay = function(n) {
    // ベースケース: n=1の場合は"1"を返す
    let current = "1";
    
    // n=1の場合はそのまま返す
    if (n === 1) return current;
    
    // 2からnまで反復的に数列を構築
    for (let i = 2; i <= n; i++) {
        current = runLengthEncode(current);
    }
    
    return current;
};

/**
 * 文字列のRun-Length Encodingを行う関数
 * @param {string} str - エンコードする文字列
 * @return {string} - エンコード後の文字列
 */
function runLengthEncode(str) {
    let result = "";
    let count = 1;
    let currentChar = str[0];
    
    // 文字列を左から右にスキャン
    for (let i = 1; i < str.length; i++) {
        if (str[i] === currentChar) {
            // 同じ文字が続く場合はカウントを増加
            count++;
        } else {
            // 異なる文字に変わった場合、カウントと文字を結果に追加
            result += count + currentChar;
            currentChar = str[i];
            count = 1;
        }
    }
    
    // 最後の文字グループを追加
    result += count + currentChar;
    
    return result;
}