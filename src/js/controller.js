// controller.js
import * as model from "./model.js";
import quizView from "./views/quizView.js";
import resultsView from "./views/resultsView.js";
import statsView from "./views/statsView.js";

/* ---------------------------------------------
   CHECK WHICH PAGE YOU ARE ON
---------------------------------------------- */
const page = document.body.dataset.page;

/* ---------------------------------------------
   INDEX PAGE — category & difficulty selection
---------------------------------------------- */
function controlSelectCategory() {
  const container = document.querySelector(".categories .cards");
  if (!container) return;

  container.addEventListener("click", function (e) {
    const card = e.target.closest(".card");
    if (!card) return;

    model.state.search.categoryId = card.dataset.categoryId;

    document
      .querySelectorAll(".categories .card")
      .forEach((c) => c.classList.remove("selected"));

    card.classList.add("selected");
  });
}

function controlSelectDifficulty() {
  const container = document.querySelector(".difficulty .cards");
  if (!container) return;

  container.addEventListener("click", function (e) {
    const card = e.target.closest(".card");
    if (!card) return;

    model.state.search.difficulty = card.dataset.diff;

    document
      .querySelectorAll(".difficulty .card")
      .forEach((c) => c.classList.remove("selected"));

    card.classList.add("selected");
  });
}

async function controlStartQuiz() {
  const btn = document.querySelector(".start-button button");
  if (!btn) return;

  btn.addEventListener("click", async function () {
    const { categoryId, difficulty } = model.state.search;

    if (!categoryId || !difficulty) {
      alert("Select both category and difficulty!");
      return;
    }

    await model.loadQuiz(categoryId, difficulty);
    quizView.render(model.state.quiz);
  });
}

/* ---------------------------------------------
   QUIZ END — save & show results
---------------------------------------------- */
function controlQuizEnd(results) {
  console.log("Quiz finished:", results);

  model.saveQuizResult(results);

  resultsView.render(results);

  resultsView.addHandlerRetry(() => quizView.render(model.state.quiz));
  resultsView.addHandlerHome(() => (window.location.href = "index.html"));
}

/* ---------------------------------------------
   STATS PAGE
---------------------------------------------- */
function controlStatsPage() {
  const summary = model.getSummary();

  const recentQuizzes = [...model.state.history]
    .slice(-5)
    .reverse()
    .map((q) => ({
      category: q.category,
      score: q.score,
      correctAnswers: q.correctAnswers,
      totalQuestions: q.totalQuestions,
    }));

  statsView.render({
    ...summary,
    recentQuizzes,
    highScore:
      model.state.history.length > 0
        ? Math.max(...model.state.history.map((q) => q.score))
        : 0,
  });
}

/* ---------------------------------------------
   INIT
---------------------------------------------- */
function init() {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("PAGE:", page);

    if (page === "home") {
      controlSelectCategory();
      controlSelectDifficulty();
      controlStartQuiz();
    }

    if (page === "stats") {
      controlStatsPage();
    }
  });
}

init();
