import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  increment
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

/* =========================
   Firebase
========================= */
const firebaseConfig = {
  apiKey: "AIzaSyAlIN5rfUotXMftbvpJStraNYwv-tFfUsw",
  authDomain: "sm-type.firebaseapp.com",
  projectId: "sm-type",
  storageBucket: "sm-type.firebasestorage.app",
  messagingSenderId: "622449309921",
  appId: "1:622449309921:web:0143a01b06cfe5ed179fa0",
  measurementId: "G-D3Y6225DE6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* =========================
   Type Data
========================= */
const TYPE_MAP = {
  FCCC: {
    name: "受けの王",
    symbol: "👑",
    catch: "圧を受けても崩れにくい、受け止め力の高いタイプ。",
    desc: "柔軟な受容力と近い関係への適応が強いタイプ。\n対人圧力にも比較的強く、安定感のある受け側になりやすい。",
    bullets: [
      "いじられても意外と耐える",
      "親しい相手にはかなり強い",
      "空気を壊さずに受け流せる"
    ]
  },
  FCCO: {
    name: "ソロマスター",
    symbol: "🐺",
    catch: "群れなくても問題ない。自分のペースで動く孤高タイプ。",
    desc: "近すぎない距離感を保ちつつ、自分のリズムを大事にするタイプ。\n無理に誰かに合わせすぎず、単独でも成立する強さがある。",
    bullets: [
      "一人行動が苦じゃない",
      "自分のペースを守りたい",
      "無理に群れようとしない"
    ]
  },
  FCVC: {
    name: "月のアンテナ",
    symbol: "🌙",
    catch: "感情や空気を敏感に受け取るタイプ。",
    desc: "近しい相手の感情変化や場の空気を強く感じやすいタイプ。\n静かに察知し、表に出さず抱え込みやすい一面がある。",
    bullets: [
      "空気の変化に敏感",
      "人の機嫌に左右されやすい",
      "静かに気を遣いがち"
    ]
  },
  FCVO: {
    name: "空気の亡霊",
    symbol: "👻",
    catch: "空気に溶けるように立ち回る、繊細な観測者。",
    desc: "外の場でも空気を読んで自然に馴染むタイプ。\n目立たないが、かなり多くを察知している。",
    bullets: [
      "存在感を消して馴染める",
      "発言タイミングを逃しやすい",
      "空気読み能力が高い"
    ]
  },
  FOCC: {
    name: "会話キング",
    symbol: "🦁",
    catch: "気づけば場の中心。会話の流れを握るタイプ。",
    desc: "オープンさと安定感があり、会話の中心に立ちやすいタイプ。\n周囲を巻き込む力が強く、場を回す才能がある。",
    bullets: [
      "話の中心にいることが多い",
      "流れを作るのが得意",
      "場の空気を回せる"
    ]
  },
  FOCO: {
    name: "カオストリックスター",
    symbol: "🎭",
    catch: "空気をかき回し、場を動かすムードメーカー。",
    desc: "柔軟さと外向的なかき混ぜ力を併せ持つタイプ。\n予想外の発言や行動で空気を変える。",
    bullets: [
      "急な一言で流れを変える",
      "場をざわつかせがち",
      "予定調和を崩すのが得意"
    ]
  },
  FOVC: {
    name: "身内ボマー",
    symbol: "💣",
    catch: "身内には容赦なし。近距離戦で本気を出すタイプ。",
    desc: "親しい相手には遠慮が消え、一気に火力が上がるタイプ。\n外では普通でも、近い距離では攻守ともに激しくなりやすい。",
    bullets: [
      "身内相手だと急に強い",
      "仲が良いほど雑になる",
      "近距離戦が得意"
    ]
  },
  FOVO: {
    name: "突撃ファイター",
    symbol: "⚡",
    catch: "考える前に飛び込む。勢いで場を動かすタイプ。",
    desc: "外向きの行動力と瞬発力が高いタイプ。\n考えるより先に動き、あとで振り返ることが多い。",
    bullets: [
      "勢いで動く",
      "とっさの反応が早い",
      "後から考え直すことがある"
    ]
  },
  BCCC: {
    name: "冷静アナリスト",
    symbol: "🧠",
    catch: "感情より分析。会話を構造で捉えるタイプ。",
    desc: "近い関係でも分析目線を失いにくいタイプ。\n会話や感情の流れを一歩引いて見ている。",
    bullets: [
      "会話を分析しがち",
      "感情より構造を見る",
      "観察力が高い"
    ]
  },
  BCCO: {
    name: "観察者",
    symbol: "🔍",
    catch: "一歩引いて人と場を見る、静かな観測者。",
    desc: "外でも近くでも、まず見てから判断するタイプ。\n主張より観察を優先し、場の流れを記録するように理解している。",
    bullets: [
      "人のクセに気づく",
      "発言前に様子を見る",
      "静かな観察が得意"
    ]
  },
  BCVC: {
    name: "影の策士",
    symbol: "♟️",
    catch: "表には出ないが、頭の中では戦略が回っている。",
    desc: "近い関係のなかで静かに先を読み、最適なタイミングを待つタイプ。\n目立たないが、動く前にかなり考えている。",
    bullets: [
      "先を読むのが得意",
      "タイミング待ちをする",
      "裏で作戦を立てる"
    ]
  },
  BCVO: {
    name: "考察オタク",
    symbol: "📚",
    catch: "観察し、解釈し、考察することに快感を覚えるタイプ。",
    desc: "外向きの距離感を保ちながら、物事を深掘りするタイプ。\n事実や行動の裏を読むのが好き。",
    bullets: [
      "裏設定を考えがち",
      "行動の意味を深読みする",
      "考察が止まらない"
    ]
  },
  BOCC: {
    name: "論戦ファイター",
    symbol: "⚔️",
    catch: "議論になると本気を出す、論理バトルの戦士。",
    desc: "主張と分析の両方を持ち、正面から議論するタイプ。\n論理勝負になると熱量が上がりやすい。",
    bullets: [
      "議論が好き",
      "矛盾を見つけやすい",
      "討論になると強い"
    ]
  },
  BOCO: {
    name: "挑発ディベーター",
    symbol: "🗯️",
    catch: "火種を投げ、議論を起こし、流れを作るタイプ。",
    desc: "対立や刺激を会話の燃料にするタイプ。\nあえてズレた意見や挑発を投げることがある。",
    bullets: [
      "反対意見を出しがち",
      "煽って反応を見る",
      "議論を起こすのが得意"
    ]
  },
  BOVC: {
    name: "ツッコミ王",
    symbol: "👊",
    catch: "矛盾を見逃さない。ズレに即反応するタイプ。",
    desc: "親しい関係ほど即時反応でツッコミを入れやすいタイプ。\n会話のズレを放置できない。",
    bullets: [
      "ボケに即反応する",
      "細かいズレを見逃さない",
      "近い相手ほど火力が上がる"
    ]
  },
  BOVO: {
    name: "直感アタッカー",
    symbol: "🔥",
    catch: "思いついたら即行動。勢いで突破するタイプ。",
    desc: "分析寄りに見えて、最終的には直感で決めるタイプ。\n反応速度と突破力が高い。",
    bullets: [
      "思いつきで動ける",
      "勢いで突破する",
      "迷うより先に行く"
    ]
  }
};

const TYPE_COORDS = {
  FCCC: { x: 20, y: 82, short: "👑受けの王" },
  FCCO: { x: 30, y: 82, short: "🐺ソロマスター" },
  FCVC: { x: 20, y: 62, short: "🌙月のアンテナ" },
  FCVO: { x: 30, y: 62, short: "👻空気の亡霊" },

  FOCC: { x: 48, y: 82, short: "🦁会話キング" },
  FOCO: { x: 58, y: 82, short: "🎭トリックスター" },
  FOVC: { x: 48, y: 62, short: "💣身内ボマー" },
  FOVO: { x: 58, y: 62, short: "⚡突撃ファイター" },

  BCCC: { x: 42, y: 38, short: "🧠アナリスト" },
  BCCO: { x: 52, y: 38, short: "🔍観察者" },
  BCVC: { x: 42, y: 18, short: "♟️影の策士" },
  BCVO: { x: 52, y: 18, short: "📚考察オタク" },

  BOCC: { x: 74, y: 38, short: "⚔️論戦ファイター" },
  BOCO: { x: 84, y: 38, short: "🗯️ディベーター" },
  BOVC: { x: 74, y: 18, short: "👊ツッコミ王" },
  BOVO: { x: 84, y: 18, short: "🔥直感アタッカー" }
};

const COMPATIBILITY_MAP = {
  FCCC: ["FOCC", "FCVC", "BCVC"],
  FCCO: ["FCVO", "BCVO", "FOCO"],
  FCVC: ["FCCC", "FCVO", "BCCC"],
  FCVO: ["FCCO", "FCVC", "BCCO"],
  FOCC: ["FCCC", "FOCO", "BOVO"],
  FOCO: ["FOCC", "FCCO", "BOVO"],
  FOVC: ["BOVC", "BCVC", "FOCO"],
  FOVO: ["FOCO", "BOCO", "BOVO"],
  BCCC: ["BCVC", "BCCO", "FCVC"],
  BCCO: ["BCVO", "FCCO", "FCVO"],
  BCVC: ["BCCC", "FCCC", "FOVC"],
  BCVO: ["BCCO", "BOCO", "FCCO"],
  BOCC: ["BOCO", "BOVC", "BCCC"],
  BOCO: ["BOCC", "FOVO", "BCVO"],
  BOVC: ["BOCC", "FOVC", "FOCC"],
  BOVO: ["FOCO", "FOVO", "BOCO"]
};

const RANK_ICON_MAP = {
  N: "▫️",
  R: "🔹",
  SR: "🔷",
  SSR: "🟣",
  UR: "⭐",
  LR: "👑",
  XR: "💎",
  ZR: "🔱"
};

/* =========================
   Full 60 Questions
   12 F/B + 12 C/O + 18 M + 18 S
========================= */
const RAW_QUESTIONS = [
  // F/B
  { group: "FBCO", axis: "F", tag: "思考", text: "嫌いな相手の意見でも、正しいと思えば認められる", reverse: false },
  { group: "FBCO", axis: "F", tag: "思考", text: "好きな相手でも、おかしいと思ったら疑える", reverse: false },
  { group: "FBCO", axis: "F", tag: "思考", text: "物事は白黒はっきりさせたい方だ", reverse: true },
  { group: "FBCO", axis: "F", tag: "思考", text: "不快でも筋が通っている意見なら聞く価値がある", reverse: false },
  { group: "FBCO", axis: "F", tag: "思考", text: "議論では『どちらにも一理ある』と思うことが多い", reverse: false },
  { group: "FBCO", axis: "F", tag: "思考", text: "自分の考えが変わることはあまりない方だ", reverse: true },
  { group: "FBCO", axis: "F", tag: "思考", text: "感情とは別に、意見の中身だけで判断したい", reverse: false },
  { group: "FBCO", axis: "F", tag: "思考", text: "人や物事をすぐ善悪で分けてしまう", reverse: true },
  { group: "FBCO", axis: "F", tag: "思考", text: "相手の立場を想像してから判断することが多い", reverse: false },
  { group: "FBCO", axis: "F", tag: "思考", text: "自分と違う価値観は理解しにくい", reverse: true },
  { group: "FBCO", axis: "F", tag: "思考", text: "結論を急がず、保留したまま考えられる", reverse: false },
  { group: "FBCO", axis: "F", tag: "思考", text: "対立している両者の主張を並べて見たい", reverse: false },

  // C/O
  { group: "FBCO", axis: "C", tag: "関係性", text: "親しい相手からの強めの言葉なら、冗談として受け取りやすい", reverse: false },
  { group: "FBCO", axis: "C", tag: "関係性", text: "知らない人からの強めの言葉でも、あまり気にしない", reverse: true },
  { group: "FBCO", axis: "C", tag: "関係性", text: "相手との距離感で、同じ言葉でも意味が変わると思う", reverse: false },
  { group: "FBCO", axis: "C", tag: "関係性", text: "親しくない相手からいじられても、わりと流せる方だ", reverse: true },
  { group: "FBCO", axis: "C", tag: "関係性", text: "言い方より『誰が言ったか』の方が大きい", reverse: false },
  { group: "FBCO", axis: "C", tag: "関係性", text: "関係性に関係なく、中身が同じなら反応もだいたい同じだ", reverse: true },
  { group: "FBCO", axis: "C", tag: "関係性", text: "親しい相手には多少強いノリでも許容しやすい", reverse: false },
  { group: "FBCO", axis: "C", tag: "関係性", text: "初対面や距離のある相手にも比較的フラットに接しやすい", reverse: true },
  { group: "FBCO", axis: "C", tag: "関係性", text: "親しい相手の失礼は、ある程度なら流せる", reverse: false },
  { group: "FBCO", axis: "C", tag: "関係性", text: "知らない人ともすぐに軽口を言い合える方だ", reverse: true },
  { group: "FBCO", axis: "C", tag: "関係性", text: "信頼関係がない相手の言葉は重く受けやすい", reverse: false },
  { group: "FBCO", axis: "C", tag: "関係性", text: "相手との距離感をあまり意識せず話せる", reverse: true },

  // M 18
  { group: "MS", axis: "M", tag: "M傾向", text: "好きな人ならちょっと意地悪されても嬉しい" },
  { group: "MS", axis: "M", tag: "M傾向", text: "正直、いじられる側のポジションが多い" },
  { group: "MS", axis: "M", tag: "M傾向", text: "軽く罵倒されるとちょっとドキッとする" },
  { group: "MS", axis: "M", tag: "M傾向", text: "『お前ほんとダメだな』って言われると嫌いじゃない" },
  { group: "MS", axis: "M", tag: "M傾向", text: "好きな人に振り回されるの、ちょっと好き" },
  { group: "MS", axis: "M", tag: "M傾向", text: "恋愛では主導権を握られることが多い" },
  { group: "MS", axis: "M", tag: "M傾向", text: "強めの性格の人に弱い" },
  { group: "MS", axis: "M", tag: "M傾向", text: "怒られるとちょっと嬉しい自分がいる" },
  { group: "MS", axis: "M", tag: "M傾向", text: "からかわれるとむしろテンション上がる" },
  { group: "MS", axis: "M", tag: "M傾向", text: "ちょっと雑に扱われるくらいが丁度いい" },
  { group: "MS", axis: "M", tag: "M傾向", text: "好きな人なら軽く叩かれても平気" },
  { group: "MS", axis: "M", tag: "M傾向", text: "いじられるキャラだと思う" },
  { group: "MS", axis: "M", tag: "M傾向", text: "負けると悔しいけどちょっと嬉しい" },
  { group: "MS", axis: "M", tag: "M傾向", text: "好きな人の前では弱くなりがち" },
  { group: "MS", axis: "M", tag: "M傾向", text: "『踏まれてみたい』ネタ、実はちょっと分かる" },
  { group: "MS", axis: "M", tag: "M傾向", text: "守るより守られたい" },
  { group: "MS", axis: "M", tag: "M傾向", text: "主導権を渡す方が楽" },
  { group: "MS", axis: "M", tag: "M傾向", text: "相手に支配される関係、少し憧れる" },

  // S 18
  { group: "MS", axis: "S", tag: "S傾向", text: "人をからかうのが好き" },
  { group: "MS", axis: "S", tag: "S傾向", text: "好きな人をいじめたくなる" },
  { group: "MS", axis: "S", tag: "S傾向", text: "恋愛では主導権を握りたい" },
  { group: "MS", axis: "S", tag: "S傾向", text: "相手を翻弄するのが楽しい" },
  { group: "MS", axis: "S", tag: "S傾向", text: "反応を見るのが好き" },
  { group: "MS", axis: "S", tag: "S傾向", text: "軽く命令するのが好き" },
  { group: "MS", axis: "S", tag: "S傾向", text: "つい相手をいじってしまう" },
  { group: "MS", axis: "S", tag: "S傾向", text: "心理戦が好き" },
  { group: "MS", axis: "S", tag: "S傾向", text: "挑発するのが好き" },
  { group: "MS", axis: "S", tag: "S傾向", text: "相手を困らせるのが楽しい" },
  { group: "MS", axis: "S", tag: "S傾向", text: "『ドSだね』って言われたことがある" },
  { group: "MS", axis: "S", tag: "S傾向", text: "相手を振り回すタイプだと思う" },
  { group: "MS", axis: "S", tag: "S傾向", text: "マウントを取るのが得意" },
  { group: "MS", axis: "S", tag: "S傾向", text: "ゲームでも心理戦が好き" },
  { group: "MS", axis: "S", tag: "S傾向", text: "相手をコントロールするのが好き" },
  { group: "MS", axis: "S", tag: "S傾向", text: "相手の弱点を見抜くのが得意" },
  { group: "MS", axis: "S", tag: "S傾向", text: "相手が困る顔を見るのが好き" },
  { group: "MS", axis: "S", tag: "S傾向", text: "攻める側が好き" }
];

/* =========================
   DOM
========================= */
const hero = document.getElementById("hero");
const quizCard = document.getElementById("quizCard");
const resultPage = document.getElementById("resultPage");

const startBtn = document.getElementById("startBtn");
const prevBtn = document.getElementById("prevBtn");
const retryBtn = document.getElementById("retryBtn");
const copyBtn = document.getElementById("copyBtn");
const saveImageBtn = document.getElementById("saveImageBtn");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const questionTag = document.getElementById("questionTag");
const questionText = document.getElementById("questionText");
const choices = document.getElementById("choices");

const resultCard = document.getElementById("resultCard");
const cardTypeSymbol = document.getElementById("cardTypeSymbol");
const cardTypeName = document.getElementById("cardTypeName");
const cardTypeCode = document.getElementById("cardTypeCode");
const cardMValue = document.getElementById("cardMValue");
const cardSValue = document.getElementById("cardSValue");
const cardTitleName = document.getElementById("cardTitleName");
const cardRankValue = document.getElementById("cardRankValue");
const cardRankIcon = document.getElementById("cardRankIcon");
const cardAwakeningText = document.getElementById("cardAwakeningText");

const resultTypeSymbol = document.getElementById("resultTypeSymbol");
const resultTypeName = document.getElementById("resultTypeName");
const resultTypeCatch = document.getElementById("resultTypeCatch");
const resultTypeCode = document.getElementById("resultTypeCode");
const resultTypeDesc = document.getElementById("resultTypeDesc");
const resultBullets = document.getElementById("resultBullets");

const mValue = document.getElementById("mValue");
const sValue = document.getElementById("sValue");
const resultTitle = document.getElementById("resultTitle");
const resultRank = document.getElementById("resultRank");
const awakeningLine = document.getElementById("awakeningLine");

const fLabel = document.getElementById("fLabel");
const bLabel = document.getElementById("bLabel");
const cLabel = document.getElementById("cLabel");
const oLabel = document.getElementById("oLabel");

const barF = document.getElementById("barF");
const barB = document.getElementById("barB");
const barC = document.getElementById("barC");
const barO = document.getElementById("barO");

const nearTypes = document.getElementById("nearTypes");
const compatibilityTypes = document.getElementById("compatibilityTypes");

const statTotal = document.getElementById("statTotal");
const statSameTitle = document.getElementById("statSameTitle");
const statSameType = document.getElementById("statSameType");
const statAvgM = document.getElementById("statAvgM");
const statAvgS = document.getElementById("statAvgS");
const statTopRate = document.getElementById("statTopRate");

/* =========================
   State
========================= */
const ANSWER_LABELS = [
  "1 全く思わない",
  "2 あまり思わない",
  "3 どちらでもない",
  "4 そう思う",
  "5 とてもそう思う"
];

let shuffledQuestions = [];
let answers = [];
let currentIndex = 0;

/* =========================
   Helpers
========================= */
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

function toPercentFromFiveScale(answer, reverse = false) {
  // 1..5 -> 0..100
  const value = ((answer - 1) / 4) * 100;
  return reverse ? (100 - value) : value;
}

function setSingleBar(el, value) {
  el.style.width = `${clamp(value, 0, 100)}%`;
}

function copyText(text) {
  return navigator.clipboard.writeText(text);
}

function saveLocalHistory(result) {
  const key = "sm_type_history_v1";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  list.push({
    typeCode: result.typeCode,
    typeName: result.typeName,
    title: result.title,
    rank: result.rank,
    m: result.m,
    s: result.s,
    awakening: result.awakening,
    at: Date.now()
  });
  localStorage.setItem(key, JSON.stringify(list.slice(-100)));
}

/* =========================
   Start / Quiz
========================= */
function startQuiz() {
  shuffledQuestions = shuffleArray(RAW_QUESTIONS);
  answers = new Array(shuffledQuestions.length).fill(null);
  currentIndex = 0;

  hero.classList.add("hidden");
  resultPage.classList.add("hidden");
  quizCard.classList.remove("hidden");

  renderQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderQuestion() {
  const q = shuffledQuestions[currentIndex];
  progressText.textContent = `${currentIndex + 1} / ${shuffledQuestions.length}`;
  progressFill.style.width = `${((currentIndex + 1) / shuffledQuestions.length) * 100}%`;
  questionTag.textContent = q.tag;
  questionText.textContent = q.text;

  choices.innerHTML = "";
  ANSWER_LABELS.forEach((label, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = label;
    btn.onclick = () => {
      answers[currentIndex] = idx + 1;
      if (currentIndex < shuffledQuestions.length - 1) {
        currentIndex += 1;
        renderQuestion();
      } else {
        showResult();
      }
    };
    choices.appendChild(btn);
  });

  prevBtn.style.visibility = currentIndex === 0 ? "hidden" : "visible";
}

/* =========================
   Scoring
========================= */
function calculateScores() {
  const fAnswers = [];
  const cAnswers = [];
  const mAnswers = [];
  const sAnswers = [];

  shuffledQuestions.forEach((q, idx) => {
    const answer = answers[idx] ?? 3;
    if (q.group === "FBCO") {
      if (q.axis === "F") {
        fAnswers.push(toPercentFromFiveScale(answer, q.reverse));
      } else if (q.axis === "C") {
        cAnswers.push(toPercentFromFiveScale(answer, q.reverse));
      }
    } else if (q.group === "MS") {
      if (q.axis === "M") {
        mAnswers.push(toPercentFromFiveScale(answer, false));
      } else if (q.axis === "S") {
        sAnswers.push(toPercentFromFiveScale(answer, false));
      }
    }
  });

  const F = Math.round(avg(fAnswers));
  const C = Math.round(avg(cAnswers));
  const M = Math.round(avg(mAnswers));
  const S = Math.round(avg(sAnswers));

  const B = 100 - F;
  const O = 100 - C;

  const typeCode =
    (F >= 50 ? "F" : "B") +
    (C >= 50 ? "C" : "O") +
    (M >= 50 ? "C" : "V") +
    (S >= 50 ? "O" : "C");

  // 上の文字列だと紛らわしいので、実際の16タイプは別マッピングで決める
  // 4象限に安定配置するため専用コードを返す
  const finalTypeCode = resolveTypeCode(F, C, M, S);

  return {
    F, B, C, O, M, S,
    typeCode: finalTypeCode
  };
}

function resolveTypeCode(F, C, M, S) {
  const fb = F >= 50 ? "F" : "B";
  const co = C >= 50 ? "C" : "O";
  const mv = M >= 50 ? "C" : "V";
  const so = S >= 50 ? "O" : "C";

  // 16種類に安定割当
  return `${fb}${co}${mv}${so}`;
}

/* =========================
   Title / Rank / Awakening
========================= */
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

  // 生粋
  if (S <= 5 && M >= 70) return "生粋のドM";
  if (M <= 5 && S >= 70) return "生粋のドS";

  // 一致系
  if (M === S && M >= 95) return "究極均衡体";
  if (M === S && M >= 80) return "完全均衡体";
  if (M === S) return "完全均衡";

  // 高SM系
  if (M >= 95 && S >= 95) return "混沌神";
  if (M >= 85 && S >= 85) return "混沌";
  if (M >= 75 && S >= 75) return "完全二刀流";
  if (M >= 60 && S >= 60) return "二刀流";

  // M強
  if (M >= 90 && S <= 20) return "ド変態";
  if (M >= 80 && S <= 30) return "変態";
  if (M >= 70 && S <= 40) return "筋金入りドM";
  if (M >= 60 && S <= 50) return "ドM";
  if (M >= 50 && S <= 50) return "かなりM";
  if (M >= 40 && S <= 60) return "そこそこM";
  if (M >= 30 && S <= 60) return "ちょいM";

  // S強
  if (S >= 90 && M <= 20) return "魔王";
  if (S >= 80 && M <= 30) return "支配者";
  if (S >= 70 && M <= 40) return "筋金入りドS";
  if (S >= 60 && M <= 50) return "ドS";
  if (S >= 50 && M <= 50) return "かなりS";
  if (S >= 40 && M <= 60) return "そこそこS";
  if (S >= 30 && M <= 60) return "ちょいS";

  // 中央
  const diff = Math.abs(M - S);
  if (M >= 30 && M <= 60 && S >= 30 && S <= 60) {
    if (diff < 15) return "オールラウンダー";
    return "駆け引き上手";
  }

  // ノーマル
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
   Rank / Awakening Theme
========================= */
function applyRankTheme(rank) {
  Array.from(resultCard.classList).forEach(cls => {
    if (cls.startsWith("rank-")) resultCard.classList.remove(cls);
  });
  const baseRank = String(rank).replace("+", "");
  resultCard.classList.add(`rank-${baseRank}`);
  cardRankIcon.textContent = RANK_ICON_MAP[baseRank] || "⭐";
}

function applyAwakeningTheme(awakening) {
  resultCard.classList.remove("awaken-M", "awaken-S", "awaken-chaos");

  if (awakening === "M覚醒") {
    resultCard.classList.add("awaken-M");
  } else if (awakening === "S覚醒") {
    resultCard.classList.add("awaken-S");
  } else if (awakening === "混沌覚醒") {
    resultCard.classList.add("awaken-chaos");
  }
}

/* =========================
   Render
========================= */
function renderTypeInfo(typeCode) {
  const info = TYPE_MAP[typeCode] || {
    name: "オールラウンダー",
    symbol: "✨",
    catch: "柔軟に立ち回れる多面型。",
    desc: "バランスよく状況に合わせて動けるタイプ。",
    bullets: ["柔軟", "適応力", "平均以上に器用"]
  };

  resultTypeSymbol.textContent = info.symbol;
  resultTypeName.textContent = info.name;
  resultTypeCatch.textContent = info.catch;
  resultTypeCode.textContent = typeCode;
  resultTypeDesc.textContent = info.desc;
  resultBullets.innerHTML = info.bullets.map(b => `<li>${b}</li>`).join("");

  cardTypeSymbol.textContent = info.symbol;
  cardTypeName.textContent = info.name;
  cardTypeCode.textContent = typeCode;
}

function renderBars(scores) {
  fLabel.textContent = scores.F;
  bLabel.textContent = scores.B;
  cLabel.textContent = scores.C;
  oLabel.textContent = scores.O;

  setSingleBar(barF, scores.F);
  setSingleBar(barB, scores.B);
  setSingleBar(barC, scores.C);
  setSingleBar(barO, scores.O);
}

function renderMainResult(scores, title, rank, awakening) {
  mValue.textContent = scores.M;
  sValue.textContent = scores.S;
  resultTitle.textContent = title;
  resultRank.textContent = rank;
  awakeningLine.textContent = awakening ? `覚醒：${awakening}` : "覚醒：なし";

  cardMValue.textContent = scores.M;
  cardSValue.textContent = scores.S;
  cardTitleName.textContent = title;
  cardRankValue.textContent = rank;
  cardAwakeningText.textContent = awakening || "";
}

function renderNearTypes(typeCode) {
  nearTypes.innerHTML = "";
  const current = TYPE_COORDS[typeCode];
  if (!current) return;

  const list = Object.entries(TYPE_COORDS)
    .filter(([code]) => code !== typeCode)
    .map(([code, info]) => {
      const dx = info.x - current.x;
      const dy = info.y - current.y;
      return { code, dist: Math.sqrt(dx * dx + dy * dy), info };
    })
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 3);

  nearTypes.innerHTML = list.map(item => `
    <div class="ranking-item">
      <div class="rank-left">
        <div>
          <div class="rank-name">${TYPE_MAP[item.code].symbol} ${TYPE_MAP[item.code].name}</div>
          <div class="mini-label">${item.code}</div>
        </div>
      </div>
      <div class="rank-percent">近い</div>
    </div>
  `).join("");
}

function renderCompatibility(typeCode) {
  compatibilityTypes.innerHTML = "";
  const list = COMPATIBILITY_MAP[typeCode] || [];
  compatibilityTypes.innerHTML = list.map(code => `
    <div class="ranking-item">
      <div class="rank-left">
        <div>
          <div class="rank-name">${TYPE_MAP[code].symbol} ${TYPE_MAP[code].name}</div>
          <div class="mini-label">${TYPE_MAP[code].catch}</div>
        </div>
      </div>
      <div class="rank-percent">◎</div>
    </div>
  `).join("");
}

function renderTypeMap(typeCode) {
  const map = document.getElementById("typeMap");
  map.querySelectorAll(".type-dot").forEach(el => el.remove());

  const current = TYPE_COORDS[typeCode];
  if (!current) return;

  Object.entries(TYPE_COORDS).forEach(([code, info]) => {
    const el = document.createElement("div");
    el.className = "type-dot";
    el.textContent = info.short;
    el.style.left = `${info.x}%`;
    el.style.top = `${100 - info.y}%`;

    if (code === typeCode) {
      el.classList.add("current");
    } else {
      const dx = info.x - current.x;
      const dy = info.y - current.y;
      if (Math.sqrt(dx * dx + dy * dy) < 18) {
        el.classList.add("near");
      }
    }

    map.appendChild(el);
  });
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

  // grid
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
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

  // dot
  const x = (M / 100) * w;
  const y = h - (S / 100) * h;

  ctx.beginPath();
  ctx.arc(x, y, 12, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(80, 180, 255, 0.95)";
  ctx.fill();
}

/* =========================
   Save / Stats
========================= */
async function saveResult(result) {
  try {
    await addDoc(collection(db, "results"), {
      typeCode: result.typeCode,
      typeName: result.typeName,
      title: result.title,
      rank: result.rank,
      awakening: result.awakening,
      mScore: result.m,
      sScore: result.s,
      createdAt: serverTimestamp()
    });

    await setDoc(doc(db, "stats", "global"), {
      totalCount: increment(1),
      totalM: increment(result.m),
      totalS: increment(result.s),
      updatedAt: serverTimestamp()
    }, { merge: true });

    await setDoc(doc(db, "titleStats", result.title), {
      title: result.title,
      count: increment(1)
    }, { merge: true });

    await setDoc(doc(db, "typeStats", result.typeCode), {
      typeCode: result.typeCode,
      typeName: result.typeName,
      count: increment(1)
    }, { merge: true });

  } catch (e) {
    console.error("Firestore save error:", e);
  }
}

async function loadStats(currentResult) {
  try {
    const globalSnap = await getDoc(doc(db, "stats", "global"));
    const globalData = globalSnap.exists() ? globalSnap.data() : {};
    const totalCount = globalData.totalCount || 0;
    const totalM = globalData.totalM || 0;
    const totalS = globalData.totalS || 0;

    const titleSnap = await getDoc(doc(db, "titleStats", currentResult.title));
    const titleCount = titleSnap.exists() ? (titleSnap.data().count || 0) : 0;

    const typeSnap = await getDoc(doc(db, "typeStats", currentResult.typeCode));
    const typeCount = typeSnap.exists() ? (typeSnap.data().count || 0) : 0;

    statTotal.textContent = `${totalCount}`;
    statSameTitle.textContent = `${titleCount}`;
    statSameType.textContent = `${typeCount}`;
    statAvgM.textContent = totalCount ? `${Math.round(totalM / totalCount)}` : "--";
    statAvgS.textContent = totalCount ? `${Math.round(totalS / totalCount)}` : "--";

    // 上位割合: 強度ベースの簡易目安
    const strength = (currentResult.m + currentResult.s) / 2;
    const topRate = Math.max(1, 100 - Math.round(strength));
    statTopRate.textContent = `上位${topRate}%`;

  } catch (e) {
    console.error("Firestore stats error:", e);
  }
}

/* =========================
   Result Flow
========================= */
async function showResult() {
  const scores = calculateScores();
  const typeInfo = TYPE_MAP[scores.typeCode];
  const title = getTitle(scores.M, scores.S);
  const strength = Math.round((scores.M + scores.S) / 2);
  const rank = getRank(strength);
  const awakening = getAwakening(scores.M, scores.S);

  const result = {
    ...scores,
    typeName: typeInfo.name,
    typeSymbol: typeInfo.symbol,
    title,
    rank,
    awakening
  };

  quizCard.classList.add("hidden");
  resultPage.classList.remove("hidden");

  renderTypeInfo(scores.typeCode);
  renderBars(scores);
  renderMainResult(scores, title, rank, awakening);
  renderNearTypes(scores.typeCode);
  renderCompatibility(scores.typeCode);
  renderTypeMap(scores.typeCode);
  drawSMChart(scores.M, scores.S);

  applyRankTheme(rank);
  applyAwakeningTheme(awakening);

  await saveResult(result);
  saveLocalHistory(result);
  await loadStats(result);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================
   Share / Save Image
========================= */
function getShareText() {
  const typeName = cardTypeName.textContent;
  const typeCode = cardTypeCode.textContent;
  const title = cardTitleName.textContent;
  const rank = cardRankValue.textContent;
  const m = cardMValue.textContent;
  const s = cardSValue.textContent;
  const awakening = cardAwakeningText.textContent;

  return [
    `私は「${typeName}」でした`,
    `${typeCode}`,
    ``,
    `M度 ${m}`,
    `S度 ${s}`,
    `称号：${title}`,
    `ランク：${rank}`,
    awakening ? `覚醒：${awakening}` : "",
    ``,
    `#SMタイプ診断`
  ].filter(Boolean).join("\n");
}

async function saveResultImage() {
  const canvas = await html2canvas(resultCard, {
    backgroundColor: null,
    scale: 2
  });

  const link = document.createElement("a");
  link.download = "sm-type-result.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/* =========================
   Events
========================= */
startBtn.onclick = startQuiz;

prevBtn.onclick = () => {
  if (currentIndex > 0) {
    currentIndex -= 1;
    renderQuestion();
  }
};

retryBtn.onclick = () => {
  hero.classList.remove("hidden");
  quizCard.classList.add("hidden");
  resultPage.classList.add("hidden");
  currentIndex = 0;
  answers = [];
  window.scrollTo({ top: 0, behavior: "smooth" });
};

copyBtn.onclick = async () => {
  try {
    await copyText(getShareText());
    copyBtn.textContent = "コピーしました";
    setTimeout(() => {
      copyBtn.textContent = "結果をコピー";
    }, 1400);
  } catch {
    alert(getShareText());
  }
};

saveImageBtn.onclick = saveResultImage;

/* =========================
   Init
========================= */