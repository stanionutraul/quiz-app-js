// controller.js
import * as model from "./model.js";
import quizView from "./views/quizView.js";
import resultsView from "./views/resultsView.js";
import statsView from "./views/statsView.js";

/* determine page */
const page = document.body.dataset.page || "home";

/* ---------- INDEX (home) controls ---------- */
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

    // ensure categories list is loaded so we can map names later
    if (
      !model.state.search.results ||
      model.state.search.results.length === 0
    ) {
      try {
        await model.loadCategories();
      } catch (err) {
        console.error(err);
      }
    }

    await model.loadQuiz(categoryId, difficulty);
    // register handler for quiz end
    quizView.addHandlerEndQuiz(controlQuizEnd);
    quizView.render(model.state.quiz, difficulty);
  });
}

/* ---------- QUIZ end: save -> show results -> update stats view data ---------- */
function controlQuizEnd(results) {
  // Save into model (history + stats + localStorage)
  model.saveQuizResult(results);

  // Show results page (markup)
  resultsView.render(results);

  // wire results buttons
  resultsView.addHandlerRetry(() => {
    // reload the same quiz (re-run loadQuiz to reshuffle questions)
    (async () => {
      await model.loadQuiz(
        model.state.search.categoryId,
        model.state.search.difficulty
      );
      quizView.addHandlerEndQuiz(controlQuizEnd);
      quizView.render(model.state.quiz, model.state.search.difficulty);
    })();
  });

  resultsView.addHandlerHome(() => (window.location.href = "index.html"));
  resultsView.addHandlerViewStats(() => (window.location.href = "stats.html"));

  // Precompute stats and (optionally) render stats if user is on stats page
  if (document.body.dataset.page === "stats") {
    controlStatsPage();
  }
}

/* ---------- STATS page renderer ---------- */
function controlStatsPage() {
  // ensure categories loaded so we can map id -> name
  const ensureCats = async () => {
    if (
      !model.state.search.results ||
      model.state.search.results.length === 0
    ) {
      try {
        await model.loadCategories();
      } catch (err) {
        // ignore
      }
    }
  };

  ensureCats().then(() => {
    const summary = model.getSummary();

    // build per-category aggregated data
    const catMap = {};
    model.state.history.forEach((q) => {
      const cat = q.category;
      if (!catMap[cat])
        catMap[cat] = { quizzes: 0, correct: 0, total: 0, name: cat };
      catMap[cat].quizzes += 1;
      catMap[cat].correct += q.correctAnswers;
      catMap[cat].total += q.totalQuestions;
    });

    const categories = Object.keys(catMap).map((catId) => {
      const entry = catMap[catId];
      // try to resolve name
      const found = model.state.search.results.find(
        (c) => String(c.id) === String(catId)
      );
      const name = found ? found.name : entry.name;
      const accuracy =
        entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0;
      return { id: catId, name, quizzes: entry.quizzes, accuracy };
    });

    // recent quizzes
    const recentQuizzes = [...model.state.history]
      .slice(-10)
      .reverse()
      .map((q) => ({
        category: (
          model.state.search.results.find(
            (c) => String(c.id) === String(q.category)
          ) || { name: q.category }
        ).name,
        difficulty: q.difficulty,
        date: q.date,
        score: q.score,
        correctAnswers: q.correctAnswers,
        totalQuestions: q.totalQuestions,
      }));

    statsView.render({
      ...summary,
      categories,
      recentQuizzes,
      highScore:
        model.state.history.length > 0
          ? Math.max(...model.state.history.map((h) => h.score))
          : 0,
    });
  });
}

/* ---------- INIT ---------- */
function init() {
  console.log("PAGE:", page);

  if (page === "home") {
    controlSelectCategory();
    controlSelectDifficulty();
    controlStartQuiz();
  }

  if (page === "stats") {
    // If user opens stats.html directly, controller should render stats using stored data
    controlStatsPage();
  }
}

init();
