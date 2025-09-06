// # TypeScript コーディング問題解析・実装

// ## 1. 問題分析結果

// ### 競技プログラミング視点
// - **制約**: 文字列長1-20、限定文字種のみ → O(n)線形解法で十分
// - **パターン認識**: 有限状態機械(FSM)による文字列パース問題
// - **メモリ効率**: 定数空間O(1)で解決可能、型情報はコンパイル時に除去

// ### 業務開発視点
// - **型安全性**: 入力・出力・状態の厳密な型定義によるバグ予防
// - **可読性**: 状態遷移を型システムで表現し、コンパイル時検証
// - **保守性**: 数値定義変更時の型チェックによる安全な修正

// ### TypeScript特有分析
// - **型システム活用**: Union Types、const assertions、型ガードで安全性向上
// - **コンパイル時最適化**: 型情報除去後は純粋なJavaScriptとして高速実行
// - **V8最適化**: インライン関数、整数演算、文字列インデックスアクセスが効率的

// ## 2. アルゴリズム比較表

// |アプローチ|時間計算量|空間計算量|TS実装コスト|可読性|型安全性|V8最適化|備考|
// |-----|-----|-----|-------|---|-----|-----|--|
// |有限状態機械|O(n)|O(1)|中|★★★|高|適|推奨解法|
// |正規表現|O(n)|O(1)|低|★★☆|中|適|型安全性で劣る|
// |分割解析|O(n)|O(k)|高|★☆☆|高|不適|型定義複雑|

// ## 3. 採用アルゴリズムと根拠

// **選択**: 型安全な有限状態機械アプローチ
// - **理由**: 最高のパフォーマンス・型安全性・可読性のバランス
// - **TypeScript最適化**: const assertionsによる型推論最適化、enum代替による効率化
// - **トレードオフ**: 実装コストは中程度だが、長期保守性で大幅な優位性

// ## 4. 実装詳細## 5. パフォーマンス考察

// ### 理論計算量
// - **時間計算量**: O(n) - 文字列を一回走査
// - **空間計算量**: O(1) - 状態変数とプリミティブ値のみ

// ### TypeScript/V8実測予想
// - **コンパイル後最適化**: 型情報除去により純粋なJavaScript実行
// - **V8最適化効果**: const assertions、インライン関数で高速化
// - **型システムオーバーヘッド**: ゼロ（実行時には型情報なし）
// - **予想性能**: JavaScript版と同等またはわずかに高速

// ### TypeScript特有の最適化ポイント

// #### 型システム活用による安全性向上
// 1. **コンパイル時エラー検出**: 状態遷移の抜け漏れを防止
// 2. **型ガード**: 実行時の型安全性確保
// 3. **Union Types**: 有限状態を型レベルで表現
// 4. **const assertions**: リテラル型による型推論最適化

// #### V8最適化との相乗効果
// 1. **インライン化促進**: TypeScriptの小関数が効率的にインライン展開
// 2. **型安定性**: 厳密な型定義によるHidden Class最適化
// 3. **分岐予測**: exhaustive switchによる効率的なジャンプテーブル
// 4. **メモリレイアウト**: 型統一によるメモリアクセス最適化

// ### 改善余地

// #### さらなる最適化可能性
// - **Template Literal Types**: 文字種判定を型レベルで実装
// - **Branded Types**: 状態の型安全性をさらに強化
// - **Conditional Types**: より精密な型推論による最適化
// - **Tree Shaking**: 未使用の型定義・関数の完全除去

// #### 業務開発での活用
// - **型安全なバリデーション**: 入力検証の網羅性確保
// - **保守性**: 仕様変更時の影響範囲をコンパイル時に特定
// - **ドキュメント**: 型定義自体がAPI仕様書として機能
// - **テスタビリティ**: 型システムによるテストケース自動生成支援

// この**TypeScript実装**は、JavaScript版と同等のパフォーマンスを保ちながら、**型安全性**と**長期保守性**を大幅に向上させた最適解となっています。競技プログラミングでの即効性と業務開発での安全性を両立した実装です。

// ===== 型定義 =====

/** 有限状態機械の状態定義（const assertionで型推論最適化） */
const State = {
    INITIAL: 0,         // 初期状態
    SIGN: 1,           // 符号読み取り後
    INTEGER: 2,        // 整数部読み取り中
    DOT: 3,            // ドット読み取り後
    DECIMAL: 4,        // 小数部読み取り中
    EXP: 5,            // E/e読み取り後
    EXP_SIGN: 6,       // 指数符号読み取り後
    EXP_NUMBER: 7      // 指数部読み取り中
} as const;

/** 状態の型定義（Union Type） */
type StateType = typeof State[keyof typeof State];

/** 有効な終了状態の型定義 */
type ValidEndState = typeof State.INTEGER | typeof State.DECIMAL | typeof State.EXP_NUMBER;

/** 入力検証用の型ガード */
interface NumberStringInput {
    readonly length: number;
    readonly [index: number]: string;
    charAt(index: number): string;
}

/** アルゴリズムオプション */
interface ValidationOptions {
    readonly strictMode?: boolean;
    readonly enableLogging?: boolean;
}

// ===== ヘルパー関数群（型安全 + インライン化促進） =====

/**
 * 数字文字判定（型ガード）
 * @param char - 判定対象文字
 * @returns 数字の場合true
 */
const isDigit = (char: string): char is '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' => {
    return char >= '0' && char <= '9';
};

/**
 * 符号文字判定（型ガード）
 * @param char - 判定対象文字
 * @returns 符号の場合true
 */
const isSign = (char: string): char is '+' | '-' => {
    return char === '+' || char === '-';
};

/**
 * 指数記号判定（型ガード）
 * @param char - 判定対象文字
 * @returns 指数記号の場合true
 */
const isExp = (char: string): char is 'e' | 'E' => {
    return char === 'e' || char === 'E';
};

/**
 * 入力文字列検証（型安全）
 * @param input - 検証対象文字列
 * @throws {TypeError} 無効な入力型
 */
function validateInput(input: unknown): asserts input is NumberStringInput {
    if (typeof input !== 'string') {
        throw new TypeError(`Expected string, got ${typeof input}`);
    }
    if (input.length === 0) {
        throw new RangeError('Input string cannot be empty');
    }
    if (input.length > 20) {
        throw new RangeError('Input string too long (max 20 characters)');
    }
}

/**
 * 有効な終了状態判定（型ガード）
 * @param state - 判定対象状態
 * @returns 有効な終了状態の場合true
 */
const isValidEndState = (state: StateType): state is ValidEndState => {
    return state === State.INTEGER || 
           state === State.DECIMAL || 
           state === State.EXP_NUMBER;
};

// ===== メインアルゴリズム =====

/**
 * 有効な数値かどうかを判定する関数（TypeScript版）
 * 有限状態機械を用いた型安全な文字列パース実装
 * @param s - 判定対象の文字列
 * @param options - 検証オプション
 * @returns 有効な数値の場合true、そうでなければfalse
 * @complexity Time: O(n), Space: O(1)
 * @throws {TypeError} 入力型エラー
 * @throws {RangeError} 制約違反エラー
 */
function isNumber(s: string, options: ValidationOptions = {}): boolean {
    // 入力検証（型安全）
    try {
        validateInput(s);
    } catch (error) {
        if (options.strictMode) {
            throw error;
        }
        return false;
    }
    
    // 状態とインデックスの初期化（型安全）
    let state: StateType = State.INITIAL;
    let i: number = 0;
    const len: number = s.length;
    
    // オプショナルなログ出力
    if (options.enableLogging) {
        console.log(`Processing string: "${s}" (length: ${len})`);
    }
    
    // メインループ（V8最適化：インデックスアクセス + 型安全な分岐）
    while (i < len) {
        const char: string = s[i];
        
        // 状態遷移処理（exhaustive switch for type safety）
        switch (state) {
            case State.INITIAL:
                if (isSign(char)) {
                    state = State.SIGN;
                } else if (isDigit(char)) {
                    state = State.INTEGER;
                } else if (char === '.') {
                    state = State.DOT;
                } else {
                    return false;
                }
                break;
                
            case State.SIGN:
                if (isDigit(char)) {
                    state = State.INTEGER;
                } else if (char === '.') {
                    state = State.DOT;
                } else {
                    return false;
                }
                break;
                
            case State.INTEGER:
                if (isDigit(char)) {
                    // 同一状態継続（最適化：状態変更なし）
                } else if (char === '.') {
                    state = State.DECIMAL;
                } else if (isExp(char)) {
                    state = State.EXP;
                } else {
                    return false;
                }
                break;
                
            case State.DOT:
                if (isDigit(char)) {
                    state = State.DECIMAL;
                } else {
                    return false;
                }
                break;
                
            case State.DECIMAL:
                if (isDigit(char)) {
                    // 同一状態継続
                } else if (isExp(char)) {
                    state = State.EXP;
                } else {
                    return false;
                }
                break;
                
            case State.EXP:
                if (isSign(char)) {
                    state = State.EXP_SIGN;
                } else if (isDigit(char)) {
                    state = State.EXP_NUMBER;
                } else {
                    return false;
                }
                break;
                
            case State.EXP_SIGN:
                if (isDigit(char)) {
                    state = State.EXP_NUMBER;
                } else {
                    return false;
                }
                break;
                
            case State.EXP_NUMBER:
                if (isDigit(char)) {
                    // 同一状態継続
                } else {
                    return false;
                }
                break;
                
            default:
                // TypeScriptの型チェックにより到達不可能
                const exhaustiveCheck: never = state;
                throw new Error(`Unhandled state: ${exhaustiveCheck}`);
        }
        
        i++;
    }
    
    // 終了状態判定（型安全）
    const result = isValidEndState(state);
    
    if (options.enableLogging) {
        console.log(`Final state: ${state}, Valid: ${result}`);
    }
    
    return result;
}

// ===== テスト実行部 =====

/** テストケース定義（型安全） */
interface TestCase {
    readonly input: string;
    readonly expected: boolean;
    readonly description: string;
}

const validTestCases: readonly TestCase[] = [
    { input: "0", expected: true, description: "単一桁数字" },
    { input: "2", expected: true, description: "整数" },
    { input: "0089", expected: true, description: "先頭ゼロ付き整数" },
    { input: "-0.1", expected: true, description: "負の小数" },
    { input: "+3.14", expected: true, description: "正の小数" },
    { input: "4.", expected: true, description: "整数部のみの小数" },
    { input: "-.9", expected: true, description: "小数部のみの負数" },
    { input: "2e10", expected: true, description: "整数の指数表記" },
    { input: "-90E3", expected: true, description: "負数の指数表記（大文字）" },
    { input: "3e+7", expected: true, description: "正の指数" },
    { input: "+6e-1", expected: true, description: "正数の負指数" },
    { input: "53.5e93", expected: true, description: "小数の指数表記" },
    { input: "-123.456e789", expected: true, description: "複雑な指数表記" }
] as const;

const invalidTestCases: readonly TestCase[] = [
    { input: "abc", expected: false, description: "アルファベット" },
    { input: "1a", expected: false, description: "数字+文字" },
    { input: "1e", expected: false, description: "指数部なし" },
    { input: "e3", expected: false, description: "指数のみ" },
    { input: "99e2.5", expected: false, description: "小数点指数" },
    { input: "--6", expected: false, description: "二重符号" },
    { input: "-+3", expected: false, description: "混合符号" },
    { input: "95a54e53", expected: false, description: "文字混入" },
    { input: "e", expected: false, description: "指数記号のみ" },
    { input: ".", expected: false, description: "ドットのみ" }
] as const;

// テスト実行関数
function runTests(): void {
    console.log('=== TypeScript Valid Number Tests ===\n');
    
    let passed = 0;
    let total = 0;
    
    // 有効なケースのテスト
    console.log('--- Valid Number Cases ---');
    for (const testCase of validTestCases) {
        const result = isNumber(testCase.input);
        const status = result === testCase.expected ? '✓' : '✗';
        console.log(`${status} isNumber("${testCase.input}") = ${result} (${testCase.description})`);
        if (result === testCase.expected) passed++;
        total++;
    }
    
    // 無効なケースのテスト  
    console.log('\n--- Invalid Number Cases ---');
    for (const testCase of invalidTestCases) {
        const result = isNumber(testCase.input);
        const status = result === testCase.expected ? '✓' : '✗';
        console.log(`${status} isNumber("${testCase.input}") = ${result} (${testCase.description})`);
        if (result === testCase.expected) passed++;
        total++;
    }
    
    console.log(`\n=== Test Summary ===`);
    console.log(`Passed: ${passed}/${total} (${((passed/total)*100).toFixed(1)}%)`);
}

// エラーハンドリングテスト
function runErrorTests(): void {
    console.log('\n=== Error Handling Tests ===');
    
    try {
        // @ts-expect-error: Intentional type error for testing
        isNumber(123, { strictMode: true });
    } catch (error) {
        console.log('✓ TypeError correctly thrown for numeric input');
    }
    
    try {
        isNumber("", { strictMode: true });
    } catch (error) {
        console.log('✓ RangeError correctly thrown for empty string');
    }
    
    // 非厳密モードでのエラー処理
    console.log(`isNumber(null as any) = ${isNumber(null as any)}`); // false
    console.log(`isNumber("") = ${isNumber("")}`); // false
}

// パフォーマンステスト
function performanceTest(): void {
    const testString = "123.456e-789";
    const iterations = 100000;
    
    console.log('\n=== Performance Test ===');
    console.time('TypeScript FSM Approach');
    for (let i = 0; i < iterations; i++) {
        isNumber(testString);
    }
    console.timeEnd('TypeScript FSM Approach');
    
    // メモリ使用量テスト
    const memBefore = process.memoryUsage();
    for (let i = 0; i < iterations; i++) {
        isNumber(testString);
    }
    const memAfter = process.memoryUsage();
    
    console.log('Memory usage (MB):');
    console.log(`  Heap Used: ${((memAfter.heapUsed - memBefore.heapUsed) / 1024 / 1024).toFixed(2)}`);
    console.log(`  External: ${((memAfter.external - memBefore.external) / 1024 / 1024).toFixed(2)}`);
}

// 実行
runTests();
runErrorTests();
performanceTest();

// LeetCode提出用のexport（TypeScript環境向け）
export { isNumber };
export type { ValidationOptions, StateType };