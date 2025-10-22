// TypeScriptでの最適化されたcount-and-say解法を提供します：TypeScript版の最適化されたcount-and-say解法の特徴：
// Runtime
// 1
// ms
// Beats
// 95.97%
// Memory
// 57.86
// MB
// Beats
// 66.30%

// 1. **厳密な型定義**: すべての変数とパラメータに適切な型アノテーションを追加し、TypeScript 5.1の型チェック機能を活用しています。

// 2. **関数型アプローチ**: `var`ではなく`function`宣言を使用し、よりクリーンで読みやすいコードになっています。

// 3. **パフォーマンス最適化**:
//    - メモリ効率: 文字列の連結は効率的に行われ、不要なオブジェクト生成を避けています
//    - 時間効率: O(総文字数)の線形時間で処理されます

// 4. **型安全性**: TypeScriptの静的型チェックにより、実行時エラーのリスクを最小限に抑えています。

// 5. **LeetCode最適化**:
//    - 余分な配列やオブジェクトを使わない
//    - インライン文字列操作で高速化
//    - 必要最小限のメモリ使用量

// この実装は、LeetCodeの制約とTypeScript環境において最高のパフォーマンスを発揮するように設計されています。

/**
 * Count and Say数列のn番目の要素を返す関数
 * @param n - 取得したい数列の位置（1以上30以下）
 * @returns n番目のcount-and-say数列の文字列
 */
function countAndSay(n: number): string {
    // ベースケース: n=1の場合は"1"を返す
    let current: string = '1';

    // n=1の場合はそのまま返す
    if (n === 1) return current;

    // 2からnまで反復的に数列を構築
    for (let i: number = 2; i <= n; i++) {
        current = runLengthEncode(current);
    }

    return current;
}

/**
 * 文字列のRun-Length Encodingを行う関数
 * @param str - エンコードする文字列
 * @returns エンコード後の文字列
 */
function runLengthEncode(str: string): string {
    let result: string = '';
    let count: number = 1;
    let currentChar: string = str[0];

    // 文字列を左から右にスキャン
    for (let i: number = 1; i < str.length; i++) {
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
