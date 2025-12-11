// controller.js
import * as model from "./model.js";
import quizView from "./views/quizView.js";
import resultsView from "./views/resultsView.js";
import statsView from "./views/statsView.js";
import recentQuizzesView from "./views/recentQuizzesView.js";
import paginationView from "./views/paginationView.js";

/* ---------- HOME PAGE HANDLERS ---------- */
function controlSelectCategory(categoryId) {
  model.state.search.categoryId =
    model.state.search.categoryId === categoryId ? "" : categoryId;
}

function controlSelectDifficulty(difficulty) {
  model.state.search.difficulty =
    model.state.search.difficulty === difficulty ? "" : difficulty;
}

async function controlStartQuiz() {
  const { categoryId, difficulty } = model.state.search;
  if (!categoryId || !difficulty) {
    quizView.renderError("Select both category and difficulty!");
    return;
  }

  if (!model.state.search.results.length) await model.loadCategories();

  await model.loadQuiz(categoryId, difficulty);
  quizView.render(model.state.quiz, difficulty);
  quizView.addHandlerEndQuiz(controlQuizEnd);
}

/* ---------- QUIZ END ---------- */
function controlQuizEnd(results) {
  model.saveQuizResult(results);

  resultsView.render(results);

  resultsView.addHandlerRetry(async () => {
    await model.loadQuiz(
      model.state.search.categoryId,
      model.state.search.difficulty
    );
    quizView.render(model.state.quiz, model.state.search.difficulty);
    quizView.addHandlerEndQuiz(controlQuizEnd);
  });

  resultsView.addHandlerHome(() => (window.location.href = "index.html"));
  resultsView.addHandlerViewStats(() => (window.location.href = "stats.html"));
}

/* ---------- STATS PAGE ---------- */
async function controlStatsPage() {
  if (!model.state.search.results.length) await model.loadCategories();

  const summary = model.getSummary() || {
    totalQuizzes: 0,
    totalScore: 0,
    averageAccuracy: 0,
  };

  // Build category performance
  const catMap = {};
  model.state.history.forEach((q) => {
    const cat = q.category;
    if (!catMap[cat]) catMap[cat] = { quizzes: 0, correct: 0, total: 0 };
    catMap[cat].quizzes += 1;
    catMap[cat].correct += q.correctAnswers;
    catMap[cat].total += q.totalQuestions;
  });

  const categories = Object.keys(catMap).map((catId) => {
    const entry = catMap[catId];
    const found = model.state.search.results.find(
      (c) => String(c.id) === String(catId)
    );
    const name = found ? found.name : catId;
    const accuracy =
      entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0;
    return { id: catId, name, quizzes: entry.quizzes, accuracy };
  });

  console.log("Summary:", summary);
  console.log("Categories:", categories);
  console.log("History:", model.state.history);

  statsView.render({
    totalQuizzes: summary.totalQuizzes || 0,
    totalScore: summary.totalScore || 0,
    averageAccuracy: summary.averageAccuracy || 0,
    highScore: model.state.history.length
      ? Math.max(...model.state.history.map((h) => h.score))
      : 0,
    categories: categories || [],
  });

  // Render first page of recent quizzes
  const recentPage = model.getRecentPage(1);
  recentQuizzesView.render(recentPage);

  // Render pagination
  paginationView.render({
    results: model.state.recent.results,
    page: model.state.recent.page,
    perPage: model.state.recent.perPage,
  });

  paginationView.addHandlerClick(controlRecentPagination);
}

/* ---------- RECENT QUIZZES PAGINATION ---------- */
function controlRecentPagination(goToPage) {
  const recentPage = model.getRecentPage(goToPage);
  recentQuizzesView.render(recentPage);

  paginationView.render({
    results: model.state.recent.results,
    page: model.state.recent.page,
    perPage: model.state.recent.perPage,
  });
}

/* ---------- INIT ---------- */
function init() {
  const page = document.body.dataset.page || "home";
  console.log("PAGE:", page);

  if (page === "home") {
    quizView.addHandlerSelectCategory(controlSelectCategory);
    quizView.addHandlerSelectDifficulty(controlSelectDifficulty);
    quizView.addHandlerStart(controlStartQuiz);
  }

  if (page === "stats") {
    controlStatsPage();
  }
}

init();
