// TypeScriptで実装し直します。型安全性を保ちながら効率的な実装にします。TypeScript版の主な変更点：

// 1. **型注釈の追加**:
//    - パラメーター `s: string`, `p: string`
//    - 返り値 `: boolean`
//    - ローカル変数の型注釈

// 2. **配列初期化の改善**:
//    - `Array.fill(null).map()` を使用してより安全な初期化
//    - `boolean[][]` で2次元配列の型を明示

// 3. **型安全性**:
//    - TypeScript 5.1の型チェックにより、実行時エラーを防止
//    - 文字列インデックスアクセスも型安全

// 4. **パフォーマンス特性**:
//    - **時間計算量**: O(m × n) where m = s.length, n = p.length
//    - **空間計算量**: O(m × n)
//    - LeetCodeの制約（≤ 2000文字）に対して最適

// 5. **メモリ効率**:
//    - 必要最小限のDPテーブルサイズ
//    - プリミティブ型（boolean）を使用してメモリ使用量を削減

// この実装はTypeScriptの型システムを活用しながら、JavaScriptと同等のパフォーマンスを維持しています。

/**
 * ワイルドカードパターンマッチングを実装する関数
 * @param s - 入力文字列（小文字の英字のみ）
 * @param p - パターン文字列（小文字の英字、'?'、'*'を含む）
 * @returns パターンが文字列全体にマッチするかどうか
 */
function isMatchCaude(s: string, p: string): boolean {
    const sLen: number = s.length;
    const pLen: number = p.length;

    // DPテーブル: dp[i][j] = s[0...i-1]とp[0...j-1]がマッチするかどうか
    const dp: boolean[][] = Array(sLen + 1)
        .fill(null)
        .map(() => Array(pLen + 1).fill(false));

    // ベースケース: 空文字列と空パターンはマッチ
    dp[0][0] = true;

    // パターンの先頭が'*'の連続の場合、空文字列ともマッチする可能性がある
    for (let j = 1; j <= pLen; j++) {
        if (p[j - 1] === '*') {
            dp[0][j] = dp[0][j - 1];
        }
    }

    // DPテーブルを埋める
    for (let i = 1; i <= sLen; i++) {
        for (let j = 1; j <= pLen; j++) {
            const sChar: string = s[i - 1];
            const pChar: string = p[j - 1];

            if (pChar === '*') {
                // '*'は以下のケースでマッチ:
                // 1. '*'を空文字列として扱う: dp[i][j-1]
                // 2. '*'を1文字以上として扱う: dp[i-1][j]
                dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
            } else if (pChar === '?' || pChar === sChar) {
                // '?'は任意の1文字、または文字が完全一致
                dp[i][j] = dp[i - 1][j - 1];
            }
            // それ以外の場合はfalse（既に初期化済み）
        }
    }

    return dp[sLen][pLen];
}
