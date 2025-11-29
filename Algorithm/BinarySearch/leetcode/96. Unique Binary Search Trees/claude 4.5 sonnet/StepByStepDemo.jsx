// Update StepByStepDemo.js with:
// npx esbuild StepByStepDemo.jsx --loader:.jsx=jsx --target=es2017 --format=iife --outfile=StepByStepDemo.js
const { useState, useEffect, useRef } = React;

            // ステップデータ
            const stepsData = [
                {
                    step: 1,
                    title: '初期化',
                    desc: 'カタラン数の基底条件 C₀ = 1 を設定します。変数 c を 1 で初期化します。',
                    visual: {
                        type: 'init',
                        n: 5,
                        c: 1,
                        i: 0,
                    },
                },
                {
                    step: 2,
                    title: 'ループ開始 (i=1)',
                    desc: 'i = 1 から n まで反復を開始します。各ステップで漸化式を適用してカタラン数を更新します。',
                    visual: {
                        type: 'loop',
                        n: 5,
                        c: 1,
                        i: 1,
                        formula: 'c = 1 × 2(2×1 - 1) ÷ (1 + 1) = 1 × 2 ÷ 2 = 1',
                    },
                },
                {
                    step: 3,
                    title: 'i=2: C₂を計算',
                    desc: '漸化式 c = c × 2(2i - 1) ÷ (i + 1) を適用。c = 1 × 2(4-1) ÷ 3 = 1 × 6 ÷ 3 = 2',
                    visual: {
                        type: 'loop',
                        n: 5,
                        c: 2,
                        i: 2,
                        formula: 'c = 1 × 2(2×2 - 1) ÷ (2 + 1) = 1 × 6 ÷ 3 = 2',
                    },
                },
                {
                    step: 4,
                    title: 'i=3: C₃を計算',
                    desc: 'c = 2 × 2(6-1) ÷ 4 = 2 × 10 ÷ 4 = 5。3個のノードで作れるBSTは5通り。',
                    visual: {
                        type: 'loop',
                        n: 5,
                        c: 5,
                        i: 3,
                        formula: 'c = 2 × 2(2×3 - 1) ÷ (3 + 1) = 2 × 10 ÷ 4 = 5',
                    },
                },
                {
                    step: 5,
                    title: 'i=4: C₄を計算',
                    desc: 'c = 5 × 2(8-1) ÷ 5 = 5 × 14 ÷ 5 = 14。4個のノードで作れるBSTは14通り。',
                    visual: {
                        type: 'loop',
                        n: 5,
                        c: 14,
                        i: 4,
                        formula: 'c = 5 × 2(2×4 - 1) ÷ (4 + 1) = 5 × 14 ÷ 5 = 14',
                    },
                },
                {
                    step: 6,
                    title: 'i=5: C₅を計算',
                    desc: 'c = 14 × 2(10-1) ÷ 6 = 14 × 18 ÷ 6 = 42。5個のノードで作れるBSTは42通り。',
                    visual: {
                        type: 'loop',
                        n: 5,
                        c: 42,
                        i: 5,
                        formula: 'c = 14 × 2(2×5 - 1) ÷ (5 + 1) = 14 × 18 ÷ 6 = 42',
                    },
                },
                {
                    step: 7,
                    title: 'ループ終了',
                    desc: 'i > n となりループ終了。最終的な c の値（C₅ = 42）を返します。',
                    visual: {
                        type: 'result',
                        n: 5,
                        c: 42,
                        i: 6,
                    },
                },
            ];

            // 可視化コンポーネント
            function StepVisualization({ visual }) {
                const { type, n, c, i, formula } = visual;

                if (type === 'init') {
                    return (
                        <svg viewBox="0 0 600 250" className="step-visualization-svg">
                            <text
                                x="300"
                                y="50"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="18"
                                fontWeight="600"
                                fill="#0f766e"
                            >
                                初期状態: n = {n}
                            </text>

                            <rect
                                x="200"
                                y="90"
                                width="200"
                                height="80"
                                rx="8"
                                fill="#d1fae5"
                                stroke="#10b981"
                                strokeWidth="2"
                            />
                            <text
                                x="300"
                                y="115"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="18"
                                fontWeight="600"
                            >
                                <tspan x="300" dy="-8">
                                    c = {c}
                                </tspan>
                                <tspan x="300" dy="20">
                                    i = {i}
                                </tspan>
                            </text>

                            <text
                                x="300"
                                y="200"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="16"
                                fill="#64748b"
                            >
                                C₀ = 1 を設定（カタラン数の基底）
                            </text>
                        </svg>
                    );
                }

                if (type === 'loop') {
                    return (
                        <svg viewBox="0 0 600 350" className="step-visualization-svg">
                            <text
                                x="300"
                                y="40"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="18"
                                fontWeight="600"
                                fill="#0f766e"
                            >
                                ステップ i = {i} / n = {n}
                            </text>

                            {/* 現在の値 */}
                            <rect
                                x="150"
                                y="80"
                                width="300"
                                height="80"
                                rx="8"
                                fill="#e0f2fe"
                                stroke="#0284c7"
                                strokeWidth="2"
                            />
                            <text
                                x="300"
                                y="105"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="16"
                                fontWeight="600"
                            >
                                <tspan x="300" dy="-8">
                                    現在の値: c = {c}
                                </tspan>
                                <tspan x="300" dy="20">
                                    ループ変数: i = {i}
                                </tspan>
                            </text>

                            {/* 計算式 */}
                            <rect
                                x="50"
                                y="190"
                                width="500"
                                height="60"
                                rx="8"
                                fill="#fef3c7"
                                stroke="#f59e0b"
                                strokeWidth="2"
                            />
                            <text
                                x="300"
                                y="220"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="14"
                                fontWeight="600"
                            >
                                {formula}
                            </text>

                            {/* 説明 */}
                            <text
                                x="300"
                                y="280"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="16"
                                fill="#64748b"
                            >
                                漸化式を適用して C{i} を計算
                            </text>
                        </svg>
                    );
                }

                if (type === 'result') {
                    return (
                        <svg viewBox="0 0 600 250" className="step-visualization-svg">
                            <text
                                x="300"
                                y="50"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="18"
                                fontWeight="600"
                                fill="#0f766e"
                            >
                                最終結果
                            </text>

                            <rect
                                x="150"
                                y="90"
                                width="300"
                                height="80"
                                rx="8"
                                fill="#d1fae5"
                                stroke="#10b981"
                                strokeWidth="2"
                            />
                            <text
                                x="300"
                                y="115"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="18"
                                fontWeight="600"
                            >
                                <tspan x="300" dy="-8">
                                    C{n} = {c}
                                </tspan>
                                <tspan x="300" dy="20">
                                    i = {i} (ループ終了)
                                </tspan>
                            </text>

                            <text
                                x="300"
                                y="200"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="16"
                                fill="#64748b"
                            >
                                n = {n} のとき、{c} 通りのBSTが存在
                            </text>
                        </svg>
                    );
                }

                return null;
            }

            // メインコンポーネント
            function StepByStepDemo() {
                const [activeStep, setActiveStep] = useState(1);
                const [isPlaying, setIsPlaying] = useState(false);
                const timerRef = useRef(null);

                const currentStepData =
                    stepsData.find((s) => s.step === activeStep) || stepsData[0];

                // 自動再生
                useEffect(() => {
                    if (isPlaying) {
                        if (activeStep >= stepsData.length) {
                            setIsPlaying(false);
                            setActiveStep(1);
                            return;
                        }
                        timerRef.current = setTimeout(() => {
                            setActiveStep((prev) => prev + 1);
                        }, 2000);
                    }
                    return () => {
                        if (timerRef.current) clearTimeout(timerRef.current);
                    };
                }, [isPlaying, activeStep]);

                const handlePlay = () => {
                    if (isPlaying) return;
                    setIsPlaying(true);
                    if (activeStep >= stepsData.length) {
                        setActiveStep(1);
                    }
                };

                const handlePrev = () => {
                    setIsPlaying(false);
                    setActiveStep((prev) => Math.max(1, prev - 1));
                };

                const handleNext = () => {
                    setIsPlaying(false);
                    setActiveStep((prev) => Math.min(stepsData.length, prev + 1));
                };

                const handleReset = () => {
                    setIsPlaying(false);
                    setActiveStep(1);
                };

                const handleStepClick = (step) => {
                    setIsPlaying(false);
                    setActiveStep(step);
                };

                return (
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 mt-2">
                        {/* 左: ステップリスト */}
                        <div>
                            <h3 className="mt-0 mb-4 text-teal-800 text-xl font-semibold">
                                ステップ一覧
                            </h3>
                            <div className="space-y-2">
                                {stepsData.map((step) => {
                                    const isActive = activeStep === step.step;
                                    return (
                                        <button
                                            key={step.step}
                                            type="button"
                                            className={[
                                                'w-full text-left text-[0.95rem] rounded-xl border-2 transition cursor-pointer px-4 py-4',
                                                'bg-white border-slate-200 hover:border-emerald-500 hover:translate-x-1',
                                                isActive
                                                    ? 'bg-[linear-gradient(135deg,#d1fae5,#a7f3d0)] border-emerald-500 shadow-[0_4px_12px_rgba(16,185,129,0.20)]'
                                                    : '',
                                            ].join(' ')}
                                            onClick={() => handleStepClick(step.step)}
                                            aria-label={`ステップ${step.step}: ${step.title}`}
                                            aria-current={isActive ? 'step' : undefined}
                                        >
                                            <div
                                                className={[
                                                    'font-bold mb-1',
                                                    isActive ? 'text-emerald-900' : 'text-teal-800',
                                                ].join(' ')}
                                            >
                                                Step {step.step}: {step.title}
                                            </div>
                                            <div className="text-slate-500 text-sm mt-1">
                                                {step.desc.substring(0, 50)}
                                                {step.desc.length > 50 ? '...' : ''}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 右: 可視化 + コントロール */}
                        <div className="my-auto">
                            <div className="rounded-2xl p-8 mt-10 border-2 border-emerald-200 bg-[linear-gradient(135deg,#ecfdf5,#f0f9ff)]">
                                <h3 className="mt-0 text-teal-800 text-xl font-semibold">
                                    Step {currentStepData.step}: {currentStepData.title}
                                </h3>
                                <p className="text-slate-600 leading-7">{currentStepData.desc}</p>
                            </div>

                            <StepVisualization visual={currentStepData.visual} />

                            <div className="flex flex-wrap justify-center gap-2 mt-1">
                                <button
                                    type="button"
                                    className="px-6 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50 shadow hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(16,185,129,0.30)] bg-[linear-gradient(135deg,#10b981,#059669)]"
                                    onClick={handlePlay}
                                    disabled={isPlaying}
                                    aria-label="自動再生"
                                >
                                    ▶ Play
                                </button>
                                <button
                                    type="button"
                                    className="px-6 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50 shadow hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(16,185,129,0.30)] bg-[linear-gradient(135deg,#0ea5e9,#0284c7)]"
                                    onClick={handlePrev}
                                    disabled={activeStep === 1}
                                    aria-label="前のステップ"
                                >
                                    ◀ Prev
                                </button>
                                <button
                                    type="button"
                                    className="px-6 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50 shadow hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(16,185,129,0.30)] bg-[linear-gradient(135deg,#0ea5e9,#0284c7)]"
                                    onClick={handleNext}
                                    disabled={activeStep === stepsData.length}
                                    aria-label="次のステップ"
                                >
                                    Next ▶
                                </button>
                                <button
                                    type="button"
                                    className="px-6 py-3 rounded-xl font-semibold text-white transition shadow hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(16,185,129,0.30)] bg-[linear-gradient(135deg,#64748b,#475569)]"
                                    onClick={handleReset}
                                    aria-label="リセット"
                                >
                                    ↻ Reset
                                </button>
                            </div>
                        </div>
                    </div>
                );
            }

            // レンダリング
            const container = document.getElementById('step-container');
            if (!container) {
                console.error('Element with id "step-container" not found');
            } else {
                const root = ReactDOM.createRoot(container);
                root.render(<StepByStepDemo />);
            }
