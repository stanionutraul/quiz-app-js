// resultsView.js
import View from "./View.js";

class ResultsView extends View {
  _parentElement = document.querySelector(".container");

  render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _generateMarkup() {
    const d = this._data;
    const successRate = Math.round((d.correctAnswers / d.totalQuestions) * 100);
    const message =
      successRate >= 80
        ? "Excellent! 🏆"
        : successRate >= 50
        ? "Good effort! 👍"
        : "Keep practicing! 💪";

    return `
      <section class="results fade-in-up">
        <div class="results-card">
          <h2 class="results-title">Quiz Completed! 🎉</h2>
          <p class="results-category">Category: <strong>${d.category}</strong></p>

          <div class="results-stats">
            <div class="stat gradient-primary">
              <div class="stat-icon">🏆</div>
              <div class="stat-info">
                <h3>Total Score</h3>
                <p>${d.score}</p>
              </div>
            </div>

            <div class="stat gradient-success">
              <div class="stat-icon">🎯</div>
              <div class="stat-info">
                <h3>Correct</h3>
                <p>${d.correctAnswers}</p>
              </div>
            </div>

            <div class="stat gradient-warning">
              <div class="stat-icon">❌</div>
              <div class="stat-info">
                <h3>Incorrect</h3>
                <p>${d.incorrectAnswers}</p>
              </div>
            </div>

            <div class="stat gradient-accent">
              <div class="stat-icon">⏱️</div>
              <div class="stat-info">
                <h3>Avg. Time</h3>
                <p>${d.averageTime}s</p>
              </div>
            </div>
          </div>

          <p class="results-message">${message}</p>

          <div class="results-buttons">
            <button class="btn btn-retry">Try Again</button>
            <button class="btn btn-home">Back to Home</button>
            <button class="btn btn-outline view-stats">View Stats</button>
          </div>
        </div>
      </section>
    `;
  }

  addHandlerRetry(handler) {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-retry");
      if (!btn) return;
      handler();
    });
  }

  addHandlerHome(handler) {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-home");
      if (!btn) return;
      handler();
    });
  }

  addHandlerViewStats(handler) {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".view-stats");
      if (!btn) return;
      handler();
    });
  }
}

export default new ResultsView();
