// main.js
import { questions } from "./questions.js";

// ==============================
//  かな → ファイル名
// ==============================
function kanaToFile(k) {
  const map = {
    "あ": "a.jpg", "い": "i.jpg", "う": "u.jpg", "え": "e.jpg", "お": "o.jpg",
    "か": "ka.jpg", "き": "ki.jpg", "く": "ku.jpg", "け": "ke.jpg", "こ": "ko.jpg",
    "さ": "sa.jpg", "し": "si.jpg", "す": "su.jpg", "せ": "se.jpg", "そ": "so.jpg",
    "た": "ta.jpg", "ち": "ti.jpg", "つ": "tu.jpg", "て": "te.jpg", "と": "to.jpg",
    "な": "na.jpg", "に": "ni.jpg", "ぬ": "nu.jpg", "ね": "ne.jpg", "の": "no.jpg",
    "は": "ha.jpg", "ひ": "hi.jpg", "ふ": "hu.jpg", "へ": "he.jpg", "ほ": "ho.jpg",
    "ま": "ma.jpg", "み": "mi.jpg", "む": "mu.jpg", "め": "me.jpg", "も": "mo.jpg",
    "や": "ya.jpg", "ゆ": "yu.jpg", "よ": "yo.jpg",
    "ら": "ra.jpg", "り": "ri.jpg", "る": "ru.jpg", "れ": "re.jpg", "ろ": "ro.jpg",
    "わ": "wa.jpg", "を": "wo.jpg", "ん": "n.jpg"
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
    img.loading = "lazy"; 

    // 黒丸マスク（②レスポンシブはCSS側で改善）
    const mask = document.createElement("div");
    mask.className = "kana-mask";

    // 〇✕表示
    const mark = document.createElement("div");
    mark.className = "result-mark";
    const wrapper = document.createElement("div");
    wrapper.className = "image-wrapper";

    wrapper.appendChild(img);
    wrapper.appendChild(mask);

    cardDiv.appendChild(wrapper);
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
nextBtn.style.visibility = "visible";
nextBtn.style.pointerEvents = "auto";
  // 「次の問題」ボタンはここで有効化（③の対策もここ）
  enableNextButton();
}

// ==============================
// ③ Safari「2度タップ」対策：pointerup + click + フォーカス解除
// ==============================
let nextButtonWired = false;

function enableNextButton() {
  if (nextButtonWired) return;
  nextButtonWired = true;

  const nextBtn = document.getElementById("nextButton");
  if (!nextBtn) return;   // ← ★これを必ず入れる

  nextButtonWired = true;
  let locked = false;

  function goNext(e) {
    if (locked) return;
    locked = true;

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    nextQuestionIndex();
    showQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      try { nextBtn.blur(); } catch (_) { }
      locked = false;
    }, 50);
  }

  if (window.PointerEvent) {
    nextBtn.addEventListener("pointerup", goNext);
  } else {
    nextBtn.addEventListener("touchend", goNext, { passive: false });
  }

  nextBtn.addEventListener("click", goNext);
}


function startGame() {
  shuffleOrder();
  currentIndex = 0;
  console.log("questions:", questions.length, "問");
  showQuestion();
}

function hideIfExists(id) {
  const el = document.getElementById(id);
  if (el) el.hidden = true;
}

function showMenu() {
  const menu = document.getElementById("menuView");
  if (menu) menu.hidden = false;

  hideIfExists("gameView");
  hideIfExists("bookView");
  hideIfExists("dailyDetailView");
}

function showGame() {
  hideIfExists("menuView");
  const game = document.getElementById("gameView");
  if (game) game.hidden = false;

  hideIfExists("bookView");
  hideIfExists("dailyDetailView");
  startGame();
}

function showBook() {
  hideIfExists("menuView");
  hideIfExists("gameView");
   hideIfExists("dailyDetailView");

  const book = document.getElementById("bookView");
  if (book) book.hidden = false;

  hideIfExists("dailyDetailView");
  renderReadbook(); 
}
function showDailyDetail(q) {
  // 他の view をすべて隠す
  hideIfExists("menuView");
  hideIfExists("gameView");
  hideIfExists("bookView");

  // 詳細 view を表示
  const detail = document.getElementById("dailyDetailView");
  if (detail) detail.hidden = false;

  // 中身を描画
  const container = document.getElementById("dailyDetailContent");
  container.innerHTML = `
    <img src="images/${kanaToFile(q.kana)}" class="daily-detail-image">
    <div style="font-weight:700; margin-bottom:6px;">
      ${q.fullPhrase}
    </div>
    <div style="line-height:1.6;">
      ${q.explanation}
    </div>
  `;
}


function getTodayKey() {
  const now = new Date();
  return now.getFullYear() + "-" +
    (now.getMonth() + 1) + "-" +
    now.getDate();
}

function getTodayCardIndex() {
  const key = "todayCard-" + getTodayKey();
  const saved = localStorage.getItem(key);

  if (saved !== null) {
    return Number(saved);
  }

  const index = Math.floor(Math.random() * questions.length);
  localStorage.setItem(key, index);
  return index;
}
function renderDailyCard() {
  const container = document.getElementById("dailyCardPreview");
  if (!container) return;

  container.innerHTML = "";

  const q = questions[getTodayCardIndex()];

  const img = document.createElement("img");
  img.src = "images/" + kanaToFile(q.kana);
  img.alt = q.kana;
  img.loading = "lazy"; 
  img.style.width = "100%";
  img.style.cursor = "pointer";

  container.appendChild(img);

  img.addEventListener("click", () => {
    showDailyDetail(q);
  });
}

 // ★ 追加：右上の「次の問題」ボタンを完全に無効化
  const nextBtn = document.getElementById("nextButton");
  if (nextBtn) {
    nextBtn.style.display = "none";
    nextBtn.style.visibility = "hidden";
    nextBtn.style.pointerEvents = "none";
  }

function renderReadbook() {
     const root = document.getElementById("readbookRoot");
  if (!root) return;

  root.innerHTML = "";

  // 50音順で並べる
  const sorted = [...questions].sort((a, b) =>
    a.kana.localeCompare(b.kana, "ja")
  );

  sorted.forEach(q => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "12px";
    row.style.padding = "6px 0";
    row.style.cursor = "pointer";
    row.style.borderBottom = "1px solid #ddd";

    const img = document.createElement("img");
    img.src = "images/" + kanaToFile(q.kana);
    img.loading = "lazy";
    img.className = "readbook-thumb";
    img.style.width = "50px";
    img.style.aspectRatio = "5 / 7";
    img.style.objectFit = "contain";

    const title = document.createElement("div");
    title.textContent = q.fullPhrase;
    title.style.fontSize = "14px";
    title.style.fontWeight = "600";

    row.appendChild(img);
    row.appendChild(title);

    // クリックしたら「今日の1枚」と同じ詳細へ
    row.addEventListener("click", () => {
      showDailyDetail(q);
    });

    root.appendChild(row);
  });
}

window.addEventListener("load", () => {
  showMenu();
  renderDailyCard();

  document.getElementById("startGameBtn")
    ?.addEventListener("click", showGame);

  document.getElementById("openBookBtn")
    ?.addEventListener("click", showBook);

  document.querySelectorAll(".backToMenu")
    .forEach(btn => btn.addEventListener("click", showMenu));

  document.getElementById("detailBackBtn")
    ?.addEventListener("click", showBook);
});

