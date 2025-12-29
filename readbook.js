// question.js のデータを前提にする
// questions = [{ id, title, thumbnail, kana, text, comment }, ...]

const tocContainer = document.getElementById("toc");

// 50音順に並べ替え（必要に応じて）
const sortedQuestions = questions.sort((a, b) =>
  a.kana.localeCompare(b.kana, "ja")
);

// 目次を描画
sortedQuestions.forEach(q => {
  const row = document.createElement("div");
  row.className = "toc-row";
  row.onclick = () => openDetail(q.id);

  const img = document.createElement("img");
  img.className = "toc-card";
  img.src = q.thumbnail;

  const title = document.createElement("div");
  title.className = "toc-title";
  title.textContent = q.title;

  row.appendChild(img);
  row.appendChild(title);
  tocContainer.appendChild(row);
});

// 詳細ページ遷移（後で実装）
function openDetail(id) {
  // ここで詳細ページへ切り替える
  console.log("open detail:", id);
}
