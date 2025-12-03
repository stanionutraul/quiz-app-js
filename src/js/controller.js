// controller.js
import * as model from "./model.js";
import quizView from "./views/quizView.js";

// ----------------------------------------------------------
// 1) CONTROL: Select category
// ----------------------------------------------------------
function controlSelectCategory() {
  const container = document.querySelector(".categories .cards");
  if (!container) return;

  container.addEventListener("click", function (e) {
    const card = e.target.closest(".card");
    if (!card) return;

    const id = card.dataset.categoryId;
    if (!id) return;

    model.state.search.categoryId = id;

    // highlight UI
    document
      .querySelectorAll(".categories .card")
      .forEach((c) => c.classList.remove("selected"));

    card.classList.add("selected");
  });
}

// ----------------------------------------------------------
// 2) CONTROL: Select difficulty
// ----------------------------------------------------------
function controlSelectDifficulty() {
  const container = document.querySelector(".difficulty .cards");
  if (!container) return;

  container.addEventListener("click", function (e) {
    const card = e.target.closest(".card");
    if (!card) return;

    const diff = card.dataset.diff;
    if (!diff) return;

    model.state.search.difficulty = diff;

    // highlight UI
    document
      .querySelectorAll(".difficulty .card")
      .forEach((c) => c.classList.remove("selected"));

    card.classList.add("selected");
  });
}

// ----------------------------------------------------------
// 3) CONTROL: Start quiz
// ----------------------------------------------------------
async function controlStartQuiz() {
  const btn = document.querySelector(".start-button button");
  if (!btn) return;

  btn.addEventListener("click", async function () {
    const category = model.state.search.categoryId;
    const difficulty = model.state.search.difficulty;
    console.log(category, difficulty);

    if (!category || !difficulty) {
      alert("Select both category and difficulty!");
      return;
    }

    // load questions from API
    await model.loadQuiz(category, difficulty);

    // render quiz on screen
    quizView.render(model.state.quiz);
  });
}

// ----------------------------------------------------------
// INIT — exact ca în Travel Journey
// ----------------------------------------------------------
function init() {
  controlSelectCategory();
  controlSelectDifficulty();
  controlStartQuiz();
}

init();
