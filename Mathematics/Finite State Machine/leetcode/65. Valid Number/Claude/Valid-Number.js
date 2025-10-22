// # JavaScript コーディング問題解析・実装

// ## 1. 問題分析結果

// ### 競技プログラミング視点
// - **制約**: 文字列長1-20、限定文字種のみ → O(n)線形解法で十分
// - **パターン認識**: 有限状態機械(FSM)による文字列パース問題
// - **メモリ効率**: 定数空間O(1)で解決可能

// ### 業務開発視点
// - **可読性**: 状態遷移を明確に表現する実装が必要
// - **保守性**: 数値定義の変更に対応しやすい構造
// - **エラーハンドリング**: 不正文字・状態での適切な処理

// ### JavaScript特有分析
// - **V8最適化**: 文字列インデックスアクセス、整数状態管理が効率的
// - **GC負荷**: プリミティブ値中心で最小限
// - **配列操作**: 文字列走査のみでO(1)空間

// ## 2. アルゴリズム比較表

// |アプローチ|時間計算量|空間計算量|JS実装コスト|可読性|V8最適化|備考|
// |-----|-----|-----|-------|---|-----|--|
// |有限状態機械|O(n)|O(1)|低|★★★|適|推奨解法|
// |正規表現|O(n)|O(1)|低|★★☆|適|可読性高いが微妙に重い|
// |分割解析|O(n)|O(k)|中|★☆☆|不適|文字列分割でGC負荷|

// ## 3. 採用アルゴリズムと根拠

// **選択**: 有限状態機械アプローチ
// - **理由**: 最高のパフォーマンスと可読性のバランス
// - **JavaScript最適化**: インデックスアクセス、整数演算中心
// - **トレードオフ**: 正規表現より実装コストは高いが、性能・保守性で優位

// ## 4. 実装詳細## 5. パフォーマンス考察

// ### 理論計算量
// - **時間計算量**: O(n) - 文字列を一回走査
// - **空間計算量**: O(1) - 状態変数のみ使用

// ### JavaScript実測予想
// - **V8最適化効果**: インライン関数、整数演算で高速化
// - **GC負荷**: プリミティブ値のみでゼロ
// - **予想性能**: 文字列長20で1μs未満

// ### V8最適化ポイント
// 1. **インライン化促進**: `isDigit`等の小関数をインライン展開
// 2. **Hidden Class安定**: 状態変数の型が一定
// 3. **効率的分岐**: switch文によるジャンプテーブル最適化
// 4. **メモリアクセス**: 文字列インデックスアクセスの最適化

// ### 改善余地
// - **文字コード比較**: `char.charCodeAt(0)`による数値比較で微小高速化可能
// - **ビット演算**: 状態をビットフラグで管理する手法も検討可能
// - **ループアンローリング**: 極短文字列での分岐削減

// この実装は**leetcode形式**での提出に適しており、競技プログラミングと業務開発の両方の要件を満たす最適解となっています。

/**
 * 有効な数値かどうかを判定する関数
 * 有限状態機械を用いた文字列パース実装
 * @param {string} s - 判定対象の文字列
 * @returns {boolean} 有効な数値の場合true、そうでなければfalse
 * @complexity Time: O(n), Space: O(1)
 */
var isNumber = function (s) {
    // 入力検証
    if (!s || typeof s !== 'string') {
        return false;
    }

    // 状態定義（V8最適化のため整数定数使用）
    const INITIAL = 0; // 初期状態
    const SIGN = 1; // 符号読み取り後
    const INTEGER = 2; // 整数部読み取り中
    const DOT = 3; // ドット読み取り後
    const DECIMAL = 4; // 小数部読み取り中
    const EXP = 5; // E/e読み取り後
    const EXP_SIGN = 6; // 指数符号読み取り後
    const EXP_NUMBER = 7; // 指数部読み取り中

    let state = INITIAL;
    let i = 0;
    const len = s.length;

    // 文字種判定用ヘルパー（インライン化促進）
    const isDigit = (c) => c >= '0' && c <= '9';
    const isSign = (c) => c === '+' || c === '-';
    const isExp = (c) => c === 'e' || c === 'E';

    // メインループ（V8最適化：インデックスアクセス）
    while (i < len) {
        const char = s[i];

        switch (state) {
            case INITIAL:
                if (isSign(char)) {
                    state = SIGN;
                } else if (isDigit(char)) {
                    state = INTEGER;
                } else if (char === '.') {
                    state = DOT;
                } else {
                    return false;
                }
                break;

            case SIGN:
                if (isDigit(char)) {
                    state = INTEGER;
                } else if (char === '.') {
                    state = DOT;
                } else {
                    return false;
                }
                break;

            case INTEGER:
                if (isDigit(char)) {
                    // 同一状態継続
                } else if (char === '.') {
                    state = DECIMAL;
                } else if (isExp(char)) {
                    state = EXP;
                } else {
                    return false;
                }
                break;

            case DOT:
                if (isDigit(char)) {
                    state = DECIMAL;
                } else {
                    return false;
                }
                break;

            case DECIMAL:
                if (isDigit(char)) {
                    // 同一状態継続
                } else if (isExp(char)) {
                    state = EXP;
                } else {
                    return false;
                }
                break;

            case EXP:
                if (isSign(char)) {
                    state = EXP_SIGN;
                } else if (isDigit(char)) {
                    state = EXP_NUMBER;
                } else {
                    return false;
                }
                break;

            case EXP_SIGN:
                if (isDigit(char)) {
                    state = EXP_NUMBER;
                } else {
                    return false;
                }
                break;

            case EXP_NUMBER:
                if (isDigit(char)) {
                    // 同一状態継続
                } else {
                    return false;
                }
                break;

            default:
                return false;
        }

        i++;
    }

    // 終了状態判定（有効な終了状態のみtrue）
    return state === INTEGER || state === DECIMAL || state === EXP_NUMBER;
};

// テストケース
console.log('=== 基本テスト ===');
console.log('isNumber("0"):', isNumber('0')); // true
console.log('isNumber("e"):', isNumber('e')); // false
console.log('isNumber("."):', isNumber('.')); // false

console.log('\n=== 有効な数値 ===');
const validCases = [
    '2',
    '0089',
    '-0.1',
    '+3.14',
    '4.',
    '-.9',
    '2e10',
    '-90E3',
    '3e+7',
    '+6e-1',
    '53.5e93',
    '-123.456e789',
];
validCases.forEach((test) => {
    console.log(`isNumber("${test}"):`, isNumber(test));
});

console.log('\n=== 無効な数値 ===');
const invalidCases = ['abc', '1a', '1e', 'e3', '99e2.5', '--6', '-+3', '95a54e53'];
invalidCases.forEach((test) => {
    console.log(`isNumber("${test}"):`, isNumber(test));
});

console.log('\n=== エッジケース ===');
const edgeCases = ['', ' ', '1 ', ' 1', '1.2.3', '+-2', 'e', 'E', '.', '+', '-'];
edgeCases.forEach((test) => {
    console.log(`isNumber("${test}"):`, isNumber(test));
});

// パフォーマンステスト用関数
function performanceTest() {
    const testString = '123.456e-789';
    const iterations = 100000;

    console.log('\n=== パフォーマンステスト ===');
    console.time('FSM Approach');
    for (let i = 0; i < iterations; i++) {
        isNumber(testString);
    }
    console.timeEnd('FSM Approach');
}
