const questions = [
  {
    tag: "思考",
    text: "嫌いな相手の意見でも、正しいと思えば認められる",
    dimension: "F",
    direction: 1
  },
  {
    tag: "思考",
    text: "好きな相手でも、おかしいと思ったら疑える",
    dimension: "F",
    direction: 1
  },
  {
    tag: "思考",
    text: "物事は白黒はっきりさせたい方だ",
    dimension: "F",
    direction: -1
  },
  {
    tag: "思考",
    text: "不快でも筋が通っている意見なら聞く価値がある",
    dimension: "F",
    direction: 1
  },

  {
    tag: "受け / 攻め",
    text: "自分はいじられ役に回ってもわりと平気だ",
    dimension: "M",
    direction: 1
  },
  {
    tag: "受け / 攻め",
    text: "会話では自分がツッコミ役・攻め役になりやすい",
    dimension: "M",
    direction: -1
  },
  {
    tag: "受け / 攻め",
    text: "強めに指摘されても、内容次第では受け止められる",
    dimension: "M",
    direction: 1
  },
  {
    tag: "受け / 攻め",
    text: "少し意地悪っぽく相手を揺さぶるのが楽しい",
    dimension: "M",
    direction: -1
  },

  {
    tag: "関係性",
    text: "親しい相手からの強めの言葉なら、冗談として受け取りやすい",
    dimension: "C",
    direction: 1
  },
  {
    tag: "関係性",
    text: "知らない人からの強めの言葉でも、あまり気にしない",
    dimension: "C",
    direction: -1
  },
  {
    tag: "関係性",
    text: "相手との距離感で、同じ言葉でも意味が変わると思う",
    dimension: "C",
    direction: 1
  },
  {
    tag: "関係性",
    text: "親しくない相手からいじられても、わりと流せる方だ",
    dimension: "C",
    direction: -1
  },

  {
    tag: "メンタル",
    text: "言われたことを後から長く引きずることは少ない",
    dimension: "T",
    direction: 1
  },
  {
    tag: "メンタル",
    text: "その場で平気でも、後でダメージが来ることが多い",
    dimension: "T",
    direction: -1
  },
  {
    tag: "メンタル",
    text: "批判されても、比較的すぐ立て直せる",
    dimension: "T",
    direction: 1
  },
  {
    tag: "メンタル",
    text: "相手の一言で気分がかなり左右されやすい",
    dimension: "T",
    direction: -1
  }
];

const results = {
  FMCT: {
    name: "クールな参謀",
    catch: "冷静に見て、受け止めて、ちゃんと考えるタイプ。",
    axis: ["F：フラット寄り", "M：受け止め寄り", "C：親密圏重視", "T：タフ寄り"],
    desc: "相手や状況を切り分けながら考えられるタイプ。感情だけで決めず、強い言葉も内容次第で受け取れる。議論を壊すより、構造を見て整理するのが得意。"
  },
  FMCV: {
    name: "やわらか参謀",
    catch: "考える力は強いけど、心の柔らかさも大きいタイプ。",
    axis: ["F：フラット寄り", "M：受け止め寄り", "C：親密圏重視", "V：繊細寄り"],
    desc: "多面的に見られる一方で、言葉の重さもよく感じ取る。親しい関係ではかなり深く受け取るので、理解者として優秀。でも無理を続けると消耗しやすい。"
  },
  FMOT: {
    name: "冷静アナリスト",
    catch: "距離があっても比較的ぶれずに分析できるタイプ。",
    axis: ["F：フラット寄り", "M：受け止め寄り", "O：開放寄り", "T：タフ寄り"],
    desc: "相手との距離に左右されにくく、知らない相手の強い言葉も内容で切り分けやすい。対人よりも論点そのものを見やすく、議論の観察者にもなれる。"
  },
  FMOV: {
    name: "受け上手な観察者",
    catch: "いろいろ見えるぶん、静かに受け止めるタイプ。",
    axis: ["F：フラット寄り", "M：受け止め寄り", "O：開放寄り", "V：繊細寄り"],
    desc: "相手を広く理解しようとする力が強い。知らない相手にもある程度開けているけれど、そのぶん心への蓄積には注意が必要。抱え込みやすい優しさ型。"
  },

  FSCT: {
    name: "平和メーカー",
    catch: "考え方は柔らかく、関係を整えるのがうまいタイプ。",
    axis: ["F：フラット寄り", "S：攻め寄り", "C：親密圏重視", "T：タフ寄り"],
    desc: "フラットに物事を見つつ、場では自分が回す側に回りやすい。攻めるといっても破壊的ではなく、親しい相手との空気を整えるツッコミ型。"
  },
  FSCV: {
    name: "気づかい名人",
    catch: "場を回しつつ、相手の心も見ているタイプ。",
    axis: ["F：フラット寄り", "S：攻め寄り", "C：親密圏重視", "V：繊細寄り"],
    desc: "会話を進める力があり、場の空気も読める。でも自分自身はダメージを受けやすい面もある。優しいいじり役になりやすいけど、疲れやすさには注意。"
  },
  FSOT: {
    name: "まとめ上手",
    catch: "対人処理がうまく、場全体をさばけるタイプ。",
    axis: ["F：フラット寄り", "S：攻め寄り", "O：開放寄り", "T：タフ寄り"],
    desc: "相手を選びすぎずに会話を回せるタイプ。視野も広く、メンタルも比較的安定しているので、まとめ役・司会役・進行役に向きやすい。"
  },
  FSOV: {
    name: "共感リスナー",
    catch: "人のことが見えすぎる、やさしい調整役タイプ。",
    axis: ["F：フラット寄り", "S：攻め寄り", "O：開放寄り", "V：繊細寄り"],
    desc: "人を広く受け入れつつ、場にも参加できる。やわらかい牽引力がある半面、他人の感情や空気を抱え込みやすい。"
  },

  BMCT: {
    name: "慎重な受け手",
    catch: "親しい相手の中で、静かに受け止めるタイプ。",
    axis: ["B：白黒寄り", "M：受け止め寄り", "C：親密圏重視", "T：タフ寄り"],
    desc: "物事を比較的はっきり捉えやすいが、受け身コミュニケーションには耐性がある。信頼関係のある相手には強いが、外にはあまり広げない。"
  },
  BMCV: {
    name: "繊細ガード",
    catch: "近い関係を大事にしつつ、自分を守るタイプ。",
    axis: ["B：白黒寄り", "M：受け止め寄り", "C：親密圏重視", "V：繊細寄り"],
    desc: "受け身寄りだけど、関係性がないと厳しい。傷つきやすさもあるので、防御ラインをちゃんと持っている。内輪では素直、外では警戒しやすい。"
  },
  BMOT: {
    name: "マイペース受け手",
    catch: "人と距離を取りつつ、自分のペースで受け流すタイプ。",
    axis: ["B：白黒寄り", "M：受け止め寄り", "O：開放寄り", "T：タフ寄り"],
    desc: "考え方は比較的シンプルでも、対人ストレスの受け流しはうまい。深入りせず、自分のテンポで処理できるタイプ。"
  },
  BMOV: {
    name: "ゆらぎウォッチャー",
    catch: "外には開けるけど、内側は揺れやすいタイプ。",
    axis: ["B：白黒寄り", "M：受け止め寄り", "O：開放寄り", "V：繊細寄り"],
    desc: "人との距離はそこまで選ばないが、実は内面でかなり影響を受けやすい。見た目より疲れやすいので、休むタイミングが大事。"
  },

  BSCT: {
    name: "議論ファイター",
    catch: "はっきり言うし、押すときは押すタイプ。",
    axis: ["B：白黒寄り", "S：攻め寄り", "C：親密圏重視", "T：タフ寄り"],
    desc: "親しい相手にはかなり強く出られるタイプ。議論やツッコミもはっきりしていて、良くも悪くもわかりやすい。勢いが武器。"
  },
  BSCV: {
    name: "ちょいムキ型",
    catch: "攻めるけど、内心は意外と傷つきやすいタイプ。",
    axis: ["B：白黒寄り", "S：攻め寄り", "C：親密圏重視", "V：繊細寄り"],
    desc: "強く出ることで自分を守る傾向がある。内輪では言えるけど、感情の余波は残りやすい。勢いと繊細さが同居している。"
  },
  BSOT: {
    name: "自由な挑発屋",
    catch: "相手を選ばず、はっきり動かしていくタイプ。",
    axis: ["B：白黒寄り", "S：攻め寄り", "O：開放寄り", "T：タフ寄り"],
    desc: "押しの強さとフットワークの軽さがある。外向きの会話や場のノリで強いが、繊細な配慮よりテンポを優先しやすい。"
  },
  BSOV: {
    name: "気まぐれトリックスター",
    catch: "自由で刺激的。でも気分の波も持っているタイプ。",
    axis: ["B：白黒寄り", "S：攻め寄り", "O：開放寄り", "V：繊細寄り"],
    desc: "会話を動かす力がある一方で、内面は意外と揺れやすい。テンションで進むと強いが、心が削れているときは極端になりやすい。"
  }
};

const hero = document.getElementById("hero");
const quizCard = document.getElementById("quizCard");
const resultCard = document.getElementById("resultCard");
const startBtn = document.getElementById("startBtn");
const prevBtn = document.getElementById("prevBtn");
const copyBtn = document.getElementById("copyBtn");
const retryBtn = document.getElementById("retryBtn");

const questionTag = document.getElementById("questionTag");
const questionText = document.getElementById("questionText");
const choices = document.getElementById("choices");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const resultTypeCode = document.getElementById("resultTypeCode");
const resultTypeName = document.getElementById("resultTypeName");
const resultCatch = document.getElementById("resultCatch");
const axis1 = document.getElementById("axis1");
const axis2 = document.getElementById("axis2");
const axis3 = document.getElementById("axis3");
const axis4 = document.getElementById("axis4");
const resultDesc = document.getElementById("resultDesc");

let currentIndex = 0;
let answers = new Array(questions.length).fill(null);

const labels = [
  "1 まったく違う",
  "2 あまり違う",
  "3 どちらともいえない",
  "4 ややそう",
  "5 とてもそう"
];

function startQuiz() {
  hero.classList.add("hidden");
  resultCard.classList.add("hidden");
  quizCard.classList.remove("hidden");
  currentIndex = 0;
  renderQuestion();
}

function renderQuestion() {
  const q = questions[currentIndex];
  questionTag.textContent = `${q.tag}`;
  questionText.textContent = q.text;
  progressText.textContent = `${currentIndex + 1} / ${questions.length}`;
  progressFill.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;

  choices.innerHTML = "";
  labels.forEach((label, idx) => {
    const value = idx + 1;
    const btn = document.createElement("button");
    btn.className = "choice";
    if (answers[currentIndex] === value) btn.classList.add("selected");
    btn.textContent = label;
    btn.onclick = () => {
      answers[currentIndex] = value;
      if (currentIndex < questions.length - 1) {
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

function computeType() {
  const score = { F: 0, M: 0, C: 0, T: 0 };

  questions.forEach((q, i) => {
    const a = answers[i] ?? 3;
    const centered = a - 3; // -2 ~ +2
    score[q.dimension] += centered * q.direction;
  });

  const type =
    (score.F >= 0 ? "F" : "B") +
    (score.M >= 0 ? "M" : "S") +
    (score.C >= 0 ? "C" : "O") +
    (score.T >= 0 ? "T" : "V");

  return { type, score };
}

function showResult() {
  const { type } = computeType();
  const r = results[type];

  quizCard.classList.add("hidden");
  resultCard.classList.remove("hidden");

  resultTypeCode.textContent = type;
  resultTypeName.textContent = r.name;
  resultCatch.textContent = r.catch;
  axis1.textContent = r.axis[0];
  axis2.textContent = r.axis[1];
  axis3.textContent = r.axis[2];
  axis4.textContent = r.axis[3];
  resultDesc.textContent = r.desc;
}

prevBtn.onclick = () => {
  if (currentIndex > 0) {
    currentIndex -= 1;
    renderQuestion();
  }
};

retryBtn.onclick = () => {
  answers = new Array(questions.length).fill(null);
  resultCard.classList.add("hidden");
  hero.classList.remove("hidden");
};

copyBtn.onclick = async () => {
  const code = resultTypeCode.textContent;
  const name = resultTypeName.textContent;
  const catchText = resultCatch.textContent;
  const text = `私の診断結果は ${code}「${name}」でした。\n${catchText}`;
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "コピーしました";
    setTimeout(() => {
      copyBtn.textContent = "結果をコピー";
    }, 1500);
  } catch {
    alert(text);
  }
};

startBtn.onclick = startQuiz;
