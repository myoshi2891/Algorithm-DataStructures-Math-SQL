"use strict";
(() => {
  const { useState, useEffect, useRef } = React;
  const stepsData = [
    {
      step: 1,
      title: "\u521D\u671F\u5316",
      desc: "\u30AB\u30BF\u30E9\u30F3\u6570\u306E\u57FA\u5E95\u6761\u4EF6 C\u2080 = 1 \u3092\u8A2D\u5B9A\u3057\u307E\u3059\u3002\u5909\u6570 c \u3092 1 \u3067\u521D\u671F\u5316\u3057\u307E\u3059\u3002",
      visual: {
        type: "init",
        n: 5,
        c: 1,
        i: 0
      }
    },
    {
      step: 2,
      title: "\u30EB\u30FC\u30D7\u958B\u59CB (i=1)",
      desc: "i = 1 \u304B\u3089 n \u307E\u3067\u53CD\u5FA9\u3092\u958B\u59CB\u3057\u307E\u3059\u3002\u5404\u30B9\u30C6\u30C3\u30D7\u3067\u6F38\u5316\u5F0F\u3092\u9069\u7528\u3057\u3066\u30AB\u30BF\u30E9\u30F3\u6570\u3092\u66F4\u65B0\u3057\u307E\u3059\u3002",
      visual: {
        type: "loop",
        n: 5,
        c: 1,
        i: 1,
        formula: "c = 1 \xD7 2(2\xD71 - 1) \xF7 (1 + 1) = 1 \xD7 2 \xF7 2 = 1"
      }
    },
    {
      step: 3,
      title: "i=2: C\u2082\u3092\u8A08\u7B97",
      desc: "\u6F38\u5316\u5F0F c = c \xD7 2(2i - 1) \xF7 (i + 1) \u3092\u9069\u7528\u3002c = 1 \xD7 2(4-1) \xF7 3 = 1 \xD7 6 \xF7 3 = 2",
      visual: {
        type: "loop",
        n: 5,
        c: 2,
        i: 2,
        formula: "c = 1 \xD7 2(2\xD72 - 1) \xF7 (2 + 1) = 1 \xD7 6 \xF7 3 = 2"
      }
    },
    {
      step: 4,
      title: "i=3: C\u2083\u3092\u8A08\u7B97",
      desc: "c = 2 \xD7 2(6-1) \xF7 4 = 2 \xD7 10 \xF7 4 = 5\u30023\u500B\u306E\u30CE\u30FC\u30C9\u3067\u4F5C\u308C\u308BBST\u306F5\u901A\u308A\u3002",
      visual: {
        type: "loop",
        n: 5,
        c: 5,
        i: 3,
        formula: "c = 2 \xD7 2(2\xD73 - 1) \xF7 (3 + 1) = 2 \xD7 10 \xF7 4 = 5"
      }
    },
    {
      step: 5,
      title: "i=4: C\u2084\u3092\u8A08\u7B97",
      desc: "c = 5 \xD7 2(8-1) \xF7 5 = 5 \xD7 14 \xF7 5 = 14\u30024\u500B\u306E\u30CE\u30FC\u30C9\u3067\u4F5C\u308C\u308BBST\u306F14\u901A\u308A\u3002",
      visual: {
        type: "loop",
        n: 5,
        c: 14,
        i: 4,
        formula: "c = 5 \xD7 2(2\xD74 - 1) \xF7 (4 + 1) = 5 \xD7 14 \xF7 5 = 14"
      }
    },
    {
      step: 6,
      title: "i=5: C\u2085\u3092\u8A08\u7B97",
      desc: "c = 14 \xD7 2(10-1) \xF7 6 = 14 \xD7 18 \xF7 6 = 42\u30025\u500B\u306E\u30CE\u30FC\u30C9\u3067\u4F5C\u308C\u308BBST\u306F42\u901A\u308A\u3002",
      visual: {
        type: "loop",
        n: 5,
        c: 42,
        i: 5,
        formula: "c = 14 \xD7 2(2\xD75 - 1) \xF7 (5 + 1) = 14 \xD7 18 \xF7 6 = 42"
      }
    },
    {
      step: 7,
      title: "\u30EB\u30FC\u30D7\u7D42\u4E86",
      desc: "i > n \u3068\u306A\u308A\u30EB\u30FC\u30D7\u7D42\u4E86\u3002\u6700\u7D42\u7684\u306A c \u306E\u5024\uFF08C\u2085 = 42\uFF09\u3092\u8FD4\u3057\u307E\u3059\u3002",
      visual: {
        type: "result",
        n: 5,
        c: 42,
        i: 6
      }
    }
  ];
  function StepVisualization({ visual }) {
    const { type, n, c, i, formula } = visual;
    if (type === "init") {
      return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 600 250", className: "step-visualization-svg" }, /* @__PURE__ */ React.createElement(
        "text",
        {
          x: "300",
          y: "50",
          textAnchor: "middle",
          dominantBaseline: "middle",
          fontSize: "18",
          fontWeight: "600",
          fill: "#0f766e"
        },
        "\u521D\u671F\u72B6\u614B: n = ",
        n
      ), /* @__PURE__ */ React.createElement(
        "rect",
        {
          x: "200",
          y: "90",
          width: "200",
          height: "80",
          rx: "8",
          fill: "#d1fae5",
          stroke: "#10b981",
          strokeWidth: "2"
        }
      ), /* @__PURE__ */ React.createElement(
        "text",
        {
          x: "300",
          y: "115",
          textAnchor: "middle",
          dominantBaseline: "middle",
          fontSize: "18",
          fontWeight: "600"
        },
        /* @__PURE__ */ React.createElement("tspan", { x: "300", dy: "-8" }, "c = ", c),
        /* @__PURE__ */ React.createElement("tspan", { x: "300", dy: "20" }, "i = ", i)
      ), /* @__PURE__ */ React.createElement(
        "text",
        {
          x: "300",
          y: "200",
          textAnchor: "middle",
          dominantBaseline: "middle",
          fontSize: "16",
          fill: "#64748b"
        },
        "C\u2080 = 1 \u3092\u8A2D\u5B9A\uFF08\u30AB\u30BF\u30E9\u30F3\u6570\u306E\u57FA\u5E95\uFF09"
      ));
    }
    if (type === "loop") {
      return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 600 350", className: "step-visualization-svg" }, /* @__PURE__ */ React.createElement(
        "text",
        {
          x: "300",
          y: "40",
          textAnchor: "middle",
          dominantBaseline: "middle",
          fontSize: "18",
          fontWeight: "600",
          fill: "#0f766e"
        },
        "\u30B9\u30C6\u30C3\u30D7 i = ",
        i,
        " / n = ",
        n
      ), /* @__PURE__ */ React.createElement(
        "rect",
        {
          x: "150",
          y: "80",
          width: "300",
          height: "80",
          rx: "8",
          fill: "#e0f2fe",
          stroke: "#0284c7",
          strokeWidth: "2"
        }
      ), /* @__PURE__ */ React.createElement(
        "text",
        {
          x: "300",
          y: "105",
          textAnchor: "middle",
          dominantBaseline: "middle",
          fontSize: "16",
          fontWeight: "600"
        },
        /* @__PURE__ */ React.createElement("tspan", { x: "300", dy: "-8" }, "\u73FE\u5728\u306E\u5024: c = ", c),
        /* @__PURE__ */ React.createElement("tspan", { x: "300", dy: "20" }, "\u30EB\u30FC\u30D7\u5909\u6570: i = ", i)
      ), /* @__PURE__ */ React.createElement(
        "rect",
        {
          x: "50",
          y: "190",
          width: "500",
          height: "60",
          rx: "8",
          fill: "#fef3c7",
          stroke: "#f59e0b",
          strokeWidth: "2"
        }
      ), /* @__PURE__ */ React.createElement(
        "text",
        {
          x: "300",
          y: "220",
          textAnchor: "middle",
          dominantBaseline: "middle",
          fontSize: "14",
          fontWeight: "600"
        },
        formula
      ), /* @__PURE__ */ React.createElement(
        "text",
        {
          x: "300",
          y: "280",
          textAnchor: "middle",
          dominantBaseline: "middle",
          fontSize: "16",
          fill: "#64748b"
        },
        "\u6F38\u5316\u5F0F\u3092\u9069\u7528\u3057\u3066 C",
        i,
        " \u3092\u8A08\u7B97"
      ));
    }
    if (type === "result") {
      return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 600 250", className: "step-visualization-svg" }, /* @__PURE__ */ React.createElement(
        "text",
        {
          x: "300",
          y: "50",
          textAnchor: "middle",
          dominantBaseline: "middle",
          fontSize: "18",
          fontWeight: "600",
          fill: "#0f766e"
        },
        "\u6700\u7D42\u7D50\u679C"
      ), /* @__PURE__ */ React.createElement(
        "rect",
        {
          x: "150",
          y: "90",
          width: "300",
          height: "80",
          rx: "8",
          fill: "#d1fae5",
          stroke: "#10b981",
          strokeWidth: "2"
        }
      ), /* @__PURE__ */ React.createElement(
        "text",
        {
          x: "300",
          y: "115",
          textAnchor: "middle",
          dominantBaseline: "middle",
          fontSize: "18",
          fontWeight: "600"
        },
        /* @__PURE__ */ React.createElement("tspan", { x: "300", dy: "-8" }, "C", n, " = ", c),
        /* @__PURE__ */ React.createElement("tspan", { x: "300", dy: "20" }, "i = ", i, " (\u30EB\u30FC\u30D7\u7D42\u4E86)")
      ), /* @__PURE__ */ React.createElement(
        "text",
        {
          x: "300",
          y: "200",
          textAnchor: "middle",
          dominantBaseline: "middle",
          fontSize: "16",
          fill: "#64748b"
        },
        "n = ",
        n,
        " \u306E\u3068\u304D\u3001",
        c,
        " \u901A\u308A\u306EBST\u304C\u5B58\u5728"
      ));
    }
    return null;
  }
  function StepByStepDemo() {
    const [activeStep, setActiveStep] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const timerRef = useRef(null);
    const currentStepData = stepsData.find((s) => s.step === activeStep) || stepsData[0];
    useEffect(() => {
      if (isPlaying) {
        if (activeStep >= stepsData.length) {
          setIsPlaying(false);
          setActiveStep(1);
          return;
        }
        timerRef.current = setTimeout(() => {
          setActiveStep((prev) => prev + 1);
        }, 2e3);
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
    return /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 mt-2" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "mt-0 mb-4 text-teal-800 text-xl font-semibold" }, "\u30B9\u30C6\u30C3\u30D7\u4E00\u89A7"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, stepsData.map((step) => {
      const isActive = activeStep === step.step;
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key: step.step,
          type: "button",
          className: [
            "w-full text-left text-[0.95rem] rounded-xl border-2 transition cursor-pointer px-4 py-4",
            "bg-white border-slate-200 hover:border-emerald-500 hover:translate-x-1",
            isActive ? "bg-[linear-gradient(135deg,#d1fae5,#a7f3d0)] border-emerald-500 shadow-[0_4px_12px_rgba(16,185,129,0.20)]" : ""
          ].join(" "),
          onClick: () => handleStepClick(step.step),
          "aria-label": `\u30B9\u30C6\u30C3\u30D7${step.step}: ${step.title}`,
          "aria-current": isActive ? "step" : void 0
        },
        /* @__PURE__ */ React.createElement(
          "div",
          {
            className: [
              "font-bold mb-1",
              isActive ? "text-emerald-900" : "text-teal-800"
            ].join(" ")
          },
          "Step ",
          step.step,
          ": ",
          step.title
        ),
        /* @__PURE__ */ React.createElement("div", { className: "text-slate-500 text-sm mt-1" }, step.desc.substring(0, 50), step.desc.length > 50 ? "..." : "")
      );
    }))), /* @__PURE__ */ React.createElement("div", { className: "my-auto" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl p-8 mt-10 border-2 border-emerald-200 bg-[linear-gradient(135deg,#ecfdf5,#f0f9ff)]" }, /* @__PURE__ */ React.createElement("h3", { className: "mt-0 text-teal-800 text-xl font-semibold" }, "Step ", currentStepData.step, ": ", currentStepData.title), /* @__PURE__ */ React.createElement("p", { className: "text-slate-600 leading-7" }, currentStepData.desc)), /* @__PURE__ */ React.createElement(StepVisualization, { visual: currentStepData.visual }), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap justify-center gap-2 mt-1" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "px-6 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50 shadow hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(16,185,129,0.30)] bg-[linear-gradient(135deg,#10b981,#059669)]",
        onClick: handlePlay,
        disabled: isPlaying,
        "aria-label": "\u81EA\u52D5\u518D\u751F"
      },
      "\u25B6 Play"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "px-6 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50 shadow hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(16,185,129,0.30)] bg-[linear-gradient(135deg,#0ea5e9,#0284c7)]",
        onClick: handlePrev,
        disabled: activeStep === 1,
        "aria-label": "\u524D\u306E\u30B9\u30C6\u30C3\u30D7"
      },
      "\u25C0 Prev"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "px-6 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50 shadow hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(16,185,129,0.30)] bg-[linear-gradient(135deg,#0ea5e9,#0284c7)]",
        onClick: handleNext,
        disabled: activeStep === stepsData.length,
        "aria-label": "\u6B21\u306E\u30B9\u30C6\u30C3\u30D7"
      },
      "Next \u25B6"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "px-6 py-3 rounded-xl font-semibold text-white transition shadow hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(16,185,129,0.30)] bg-[linear-gradient(135deg,#64748b,#475569)]",
        onClick: handleReset,
        "aria-label": "\u30EA\u30BB\u30C3\u30C8"
      },
      "\u21BB Reset"
    ))));
  }
  const container = document.getElementById("step-container");
  if (!container) {
    console.error('Element with id "step-container" not found');
  } else {
    const root = ReactDOM.createRoot(container);
    root.render(/* @__PURE__ */ React.createElement(StepByStepDemo, null));
  }
})();
