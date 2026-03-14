/* global QUESTIONS, TYPES, RANK_ICONS, buildShareUrl */

const ANSWER_LABELS = [
  "1 全く思わない",
  "2 あまり思わない",
  "3 どちらでもない",
  "4 そう思う",
  "5 とてもそう思う"
];

const quizPage = document.getElementById("questionBox") || document.getElementById("questionText");
const resultPage = document.getElementById("resultCard");

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function scoreToPercent(answer, reverse = false) {
  const v = ((answer - 1) / 4) * 100;
  return reverse ? (100 - v) : v;
}

function resolveTypeCode(F, C, Saxis, K) {
  const a1 = F >= 50 ? "F" : "L";
  const a2 = C >= 50 ? "C" : "X";
  const a3 = Saxis >= 50 ? "S" : "V";
  const a4 = K >= 50 ? "K" : "R";
  return `${a1}${a2}${a3}${a4}`;
}

function getHiddenTitle(M, S) {
  if (M === 69 && S === 69) return "69の支配者";
  if (M === 100 && S === 100) return "全能者";
  if (M === 100 && S === 0) return "究極のドM";
  if (M === 0 && S === 100) return "絶対魔王";
  if (M === 1 && S === 1) return "ほぼ無害";
  if (M === 50 && S === 50) return "五分五分の男";
  if (M === 77 && S === 77) return "混沌予備軍";
  if (M === 88 && S === 88) return "深淵の住人";
  if (M === 33 && S === 33) return "様子見の達人";
  if (M === 44 && S === 44) return "調停者";
  if (M === 55 && S === 55) return "二面使い";
  return null;
}

function getTitle(M, S) {
  const hidden = getHiddenTitle(M, S);
  if (hidden) return hidden;

  if (S <= 5 && M >= 70) return "生粋のドM";
  if (M <= 5 && S >= 70) return "生粋のドS";

  if (M === S && M >= 95) return "究極均衡体";
  if (M === S && M >= 80) return "完全均衡体";
  if (M === S) return "完全均衡";

  if (M >= 95 && S >= 95) return "混沌神";
  if (M >= 85 && S >= 85) return "混沌";
  if (M >= 75 && S >= 75) return "完全二刀流";
  if (M >= 60 && S >= 60) return "二刀流";

  if (M >= 90 && S <= 20) return "ド変態";
  if (M >= 80 && S <= 30) return "変態";
  if (M >= 70 && S <= 40) return "筋金入りドM";
  if (M >= 60 && S <= 50) return "ドM";
  if (M >= 50 && S <= 50) return "かなりM";
  if (M >= 40 && S <= 60) return "そこそこM";
  if (M >= 30 && S <= 60) return "ちょいM";

  if (S >= 90 && M <= 20) return "魔王";
  if (S >= 80 && M <= 30) return "支配者";
  if (S >= 70 && M <= 40) return "筋金入りドS";
  if (S >= 60 && M <= 50) return "ドS";
  if (S >= 50 && M <= 50) return "かなりS";
  if (S >= 40 && M <= 60) return "そこそこS";
  if (S >= 30 && M <= 60) return "ちょいS";

  const diff = Math.abs(M - S);
  if (M >= 30 && M <= 60 && S >= 30 && S <= 60) {
    if (diff < 15) return "オールラウンダー";
    return "駆け引き上手";
  }

  if (M <= 10 && S <= 10) return "凡人";
  if (M <= 20 && S <= 20) return "超ノーマル";
  if (M <= 20 && S <= 30) return "一般人";

  return "オールラウンダー";
}

function getRank(strength) {
  let base = "N";
  let min = 0;
  let max = 15;

  if (strength < 15) { base = "N"; min = 0; max = 15; }
  else if (strength < 25) { base = "R"; min = 15; max = 25; }
  else if (strength < 40) { base = "SR"; min = 25; max = 40; }
  else if (strength < 55) { base = "SSR"; min = 40; max = 55; }
  else if (strength < 70) { base = "UR"; min = 55; max = 70; }
  else if (strength < 85) { base = "LR"; min = 70; max = 85; }
  else if (strength < 95) { base = "XR"; min = 85; max = 95; }
  else { base = "ZR"; min = 95; max = 100; }

  const band = max - min;
  const plusThreshold = max - band * 0.2;
  const withPlus = strength >= plusThreshold && base !== "ZR";

  return withPlus ? `${base}+` : base;
}

function getAwakening(M, S) {
  if (M >= 90 && S >= 90) return "混沌覚醒";
  if (M >= 90) return "M覚醒";
  if (S >= 90) return "S覚醒";
  return "";
}

/* =========================
   quiz page
========================= */
if (document.getElementById("choicesBox")) {
  const quiz = shuffleArray(QUESTIONS);
  let current = 0;
  const answers = new Array(quiz.length).fill(null);

  const progressText = document.getElementById("progressText");
  const progressFill = document.getElementById("progressFill");
  const questionTag = document.getElementById("questionTag");
  const questionText = document.getElementById("questionText");
  const choicesBox = document.getElementById("choicesBox");
  const prevBtn = document.getElementById("prevBtn");

  function renderQuestion() {
    const q = quiz[current];
    progressText.textContent = `${current + 1} / ${quiz.length}`;
    progressFill.style.width = `${((current + 1) / quiz.length) * 100}%`;
    questionTag.textContent = q.tag;
    questionText.textContent = q.text;

    choicesBox.innerHTML = "";
    ANSWER_LABELS.forEach((label, idx) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = label;
      btn.onclick = () => {
        answers[current] = idx + 1;
        if (current < quiz.length - 1) {
          current += 1;
          renderQuestion();
        } else {
          finishQuiz();
        }
      };
      choicesBox.appendChild(btn);
    });

    prevBtn.style.visibility = current === 0 ? "hidden" : "visible";
  }

  function finishQuiz() {
    const Fvals = [];
    const Cvals = [];
    const SaxisVals = [];
    const Kvals = [];
    const Mvals = [];
    const Svals = [];

    quiz.forEach((q, i) => {
      const answer = answers[i] ?? 3;
      const value = scoreToPercent(answer, q.reverse);

      if (q.axis === "F") Fvals.push(value);
      else if (q.axis === "C") Cvals.push(value);
      else if (q.axis === "S") SaxisVals.push(value);
      else if (q.axis === "K") Kvals.push(value);
      else if (q.axis === "M") Mvals.push(value);
      else if (q.axis === "SM_S") Svals.push(value);
    });

    const F = Math.round(avg(Fvals));
    const L = 100 - F;
    const C = Math.round(avg(Cvals));
    const X = 100 - C;
    const Saxis = Math.round(avg(SaxisVals));
    const V = 100 - Saxis;
    const K = Math.round(avg(Kvals));
    const R = 100 - K;
    const M = Math.round(avg(Mvals));
    const S = Math.round(avg(Svals));

    const typeCode = resolveTypeCode(F, C, Saxis, K);
    const type = TYPES[typeCode];
    const title = getTitle(M, S);
    const strength = Math.round((M + S) / 2);
    const rank = getRank(strength);
    const awakening = getAwakening(M, S);

    const result = {
      typeCode,
      typeName: type.name,
      emoji: type.emoji,
      typeCatch: type.catch,
      typeDesc: type.desc,
      F, L, C, X, Saxis, V, K, R,
      m: clamp(M, 0, 100),
      s: clamp(S, 0, 100),
      title,
      rank,
      awakening
    };

    localStorage.setItem("sm_result_v1", JSON.stringify(result));
    location.href = "./result.html";
  }

  prevBtn.onclick = () => {
    if (current > 0) {
      current -= 1;
      renderQuestion();
    }
  };

  renderQuestion();
}

/* =========================
   result page
========================= */
if (document.getElementById("resultCard")) {
  const result = JSON.parse(localStorage.getItem("sm_result_v1") || "null");

  if (!result) {
    location.href = "./index.html";
  } else {
    const resultCard = document.getElementById("resultCard");
    const typeSymbol = document.getElementById("typeSymbol");
    const typeName = document.getElementById("typeName");
    const typeCode = document.getElementById("typeCode");
    const mValue = document.getElementById("mValue");
    const sValue = document.getElementById("sValue");
    const titleName = document.getElementById("titleName");
    const rankValue = document.getElementById("rankValue");
    const rankIcon = document.getElementById("rankIcon");
    const awakeningText = document.getElementById("awakeningText");

    const typeCatch = document.getElementById("typeCatch");
    const typeDesc = document.getElementById("typeDesc");

    const fVal = document.getElementById("fVal");
    const lVal = document.getElementById("lVal");
    const cVal = document.getElementById("cVal");
    const xVal = document.getElementById("xVal");
    const sAxisVal = document.getElementById("sAxisVal");
    const vVal = document.getElementById("vVal");
    const kVal = document.getElementById("kVal");
    const rVal = document.getElementById("rVal");

    const barF = document.getElementById("barF");
    const barL = document.getElementById("barL");
    const barC = document.getElementById("barC");
    const barX = document.getElementById("barX");
    const barSAxis = document.getElementById("barSAxis");
    const barV = document.getElementById("barV");
    const barK = document.getElementById("barK");
    const barR = document.getElementById("barR");

    function setBar(el, value) {
      el.style.width = `${clamp(value, 0, 100)}%`;
    }

    function applyRankTheme(rank) {
      Array.from(resultCard.classList).forEach(cls => {
        if (cls.startsWith("rank-")) resultCard.classList.remove(cls);
      });
      const baseRank = String(rank).replace("+", "");
      resultCard.classList.add(`rank-${baseRank}`);
      rankIcon.textContent = RANK_ICONS[baseRank] || "⭐";
    }

    function applyAwakeningTheme(awakening) {
      resultCard.classList.remove("awaken-M", "awaken-S", "awaken-chaos");
      if (awakening === "M覚醒") resultCard.classList.add("awaken-M");
      else if (awakening === "S覚醒") resultCard.classList.add("awaken-S");
      else if (awakening === "混沌覚醒") resultCard.classList.add("awaken-chaos");
    }

    function drawSMChart(M, S) {
      const canvas = document.getElementById("smChart");
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(255,255,255,.06)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        const gx = (w / 4) * i;
        const gy = (h / 4) * i;
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      const x = (M / 100) * w;
      const y = h - (S / 100) * h;

      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,.95)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(80,180,255,.95)";
      ctx.fill();
    }

    typeSymbol.textContent = result.emoji;
    typeName.textContent = result.typeName;
    typeCode.textContent = result.typeCode;
    mValue.textContent = result.m;
    sValue.textContent = result.s;
    titleName.textContent = result.title;
    rankValue.textContent = result.rank;
    awakeningText.textContent = result.awakening || "";

    typeCatch.textContent = result.typeCatch;
    typeDesc.textContent = result.typeDesc;

    fVal.textContent = result.F;
    lVal.textContent = result.L;
    cVal.textContent = result.C;
    xVal.textContent = result.X;
    sAxisVal.textContent = result.Saxis;
    vVal.textContent = result.V;
    kVal.textContent = result.K;
    rVal.textContent = result.R;

    setBar(barF, result.F);
    setBar(barL, result.L);
    setBar(barC, result.C);
    setBar(barX, result.X);
    setBar(barSAxis, result.Saxis);
    setBar(barV, result.V);
    setBar(barK, result.K);
    setBar(barR, result.R);

    applyRankTheme(result.rank);
    applyAwakeningTheme(result.awakening);
    drawSMChart(result.m, result.s);

    document.getElementById("saveImageBtn").onclick = async () => {
      const canvas = await html2canvas(resultCard, {
        backgroundColor: null,
        scale: 2
      });
      const link = document.createElement("a");
      link.download = "sm-result.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    document.getElementById("shareXBtn").onclick = () => {
      window.open(buildShareUrl(result), "_blank");
    };
  }
}