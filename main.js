// main.js
import { questions } from "./questions.js";

// ==============================
//  かな → ファイル名
// ==============================
function kanaToFile(k) {
  const map = {
    "あ":"a.jpg","い":"i.jpg","う":"u.jpg","え":"e.jpg","お":"o.jpg",
    "か":"ka.jpg","き":"ki.jpg","く":"ku.jpg","け":"ke.jpg","こ":"ko.jpg",
    "さ":"sa.jpg","し":"si.jpg","す":"su.jpg","せ":"se.jpg","そ":"so.jpg",
    "た":"ta.jpg","ち":"ti.jpg","つ":"tu.jpg","て":"te.jpg","と":"to.jpg",
    "な":"na.jpg","に":"ni.jpg","ぬ":"nu.jpg","ね":"ne.jpg","の":"no.jpg",
    "は":"ha.jpg","ひ":"hi.jpg","ふ":"hu.jpg","へ":"he.jpg","ほ":"ho.jpg",
    "ま":"ma.jpg","み":"mi.jpg","む":"mu.jpg","め":"me.jpg","も":"mo.jpg",
    "や":"ya.jpg","ゆ":"yu.jpg","よ":"yo.jpg",
    "ら":"ra.jpg","り":"ri.jpg","る":"ru.jpg","れ":"re.jpg","ろ":"ro.jpg",
    "わ":"wa.jpg","を":"wo.jpg","ん":"n.jpg"
  };
  return map[k];
}

let currentIndex = 0;
let order = [];
let hasAnswered = false;

function shuffleOrder() {
  order = [...Array(questions.length).keys()];
  order.sort(() => Math.random() - 0.5);
}

function nextQuestionIndex() {
  currentIndex++;
  if (currentIndex >= questions.length) {
    currentIndex = 0;
    shuffleOrder();
  }
}

function showQuestion() {
  hasAnswered = false;

  const q = questions[order[currentIndex]];

  const kanaEl = document.getElementById("currentKana");
  const fullPhraseEl = document.getElementById("fullPhrase");
  const explanationEl = document.getElementById("explanation");
  const nextBtn = document.getElementById("nextButton");

  // 表示初期化
  kanaEl.textContent = q.leadingKana;
  fullPhraseEl.textContent = "";
  explanationEl.style.display = "none";
  explanationEl.textContent = "";
  nextBtn.style.display = "none";

  // 絵札4枚
  createCards(q);
}

function createCards(q) {
  const cardsEl = document.getElementById("cards");
  cardsEl.innerHTML = "";

  const correctKana = q.kana;

  // 正解以外をランダムに3つ
  const allKana = questions.map(x => x.kana);
  const wrongCandidates = allKana.filter(k => k !== correctKana);
  const wrong3 = wrongCandidates.sort(() => Math.random() - 0.5).slice(0, 3);

  const choiceKanaList = [correctKana, ...wrong3].sort(() => Math.random() - 0.5);

  choiceKanaList.forEach(k => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

    const img = document.createElement("img");
    img.src = "images/" + kanaToFile(k);
    img.alt = k;

    // 黒丸マスク（②レスポンシブはCSS側で改善）
    const mask = document.createElement("div");
    mask.className = "kana-mask";

    // 〇✕表示
    const mark = document.createElement("div");
    mark.className = "result-mark";

    cardDiv.appendChild(img);
    cardDiv.appendChild(mask);
    cardDiv.appendChild(mark);

   cardDiv.onclick = () => {
  if (hasAnswered) return;

  const isCorrect = (k === correctKana);

  if (isCorrect) {
    hasAnswered = true;

    // 正解したら全カードを無効化
    document.querySelectorAll(".card").forEach(c => {
      c.style.pointerEvents = "none";
    });

    mark.textContent = "◯";
    mark.classList.add("mark-correct");

    // 黒丸をすべて外す
    document.querySelectorAll(".kana-mask").forEach(m => {
      m.style.display = "none";
    });

    showFullPhraseAndExplanation(q);

  } else {
    mark.textContent = "✕";
    mark.classList.add("mark-wrong");

    // 何もしない（選び直し可）
  }
};

    cardsEl.appendChild(cardDiv);
  });
}

function showFullPhraseAndExplanation(q) {
  const fullPhraseEl = document.getElementById("fullPhrase");
  const explanationEl = document.getElementById("explanation");
  const nextBtn = document.getElementById("nextButton");

  fullPhraseEl.textContent = q.fullPhrase;

  explanationEl.textContent = q.explanation;
  explanationEl.style.display = "block";

  nextBtn.style.display = "block";

  // 「次の問題」ボタンはここで有効化（③の対策もここ）
  enableNextButton();
}

// ==============================
// ③ Safariの「2度タップ」対策：touchend + click 両対応しつつ二重発火ガード
// ==============================
let nextButtonWired = false;
let lastNextAt = 0;

function enableNextButton() {
  if (nextButtonWired) return;
  nextButtonWired = true;

  const nextBtn = document.getElementById("nextButton");

  function goNext(e) {
    // 二重発火ガード
    const now = Date.now();
    if (now - lastNextAt < 350) return;
    lastNextAt = now;

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // 次の問題へ
    nextQuestionIndex();
    showQuestion();

    // 画面上へ
    window.scrollTo({ top: 0, behavior: "smooth" });

    // iOSの「フォーカスだけ当たる」感を減らす
    try { nextBtn.blur(); } catch (_) {}
  }

  // iOS Safari で click が遅い/効かない系を吸う
  nextBtn.addEventListener("touchend", goNext, { passive: false });
  // PC/その他
  nextBtn.addEventListener("click", goNext);

  // タップ最適化（CSS側でも touch-action を入れる）
}

function startGame() {
  shuffleOrder();
  currentIndex = 0;
  console.log("questions:", questions.length, "問");
  showQuestion();
}

window.addEventListener("load", startGame);
