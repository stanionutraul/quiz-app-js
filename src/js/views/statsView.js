// statsView.js
import View from "./View.js";

class StatsView extends View {
  _parentElement = document.querySelector(".container");

  render(data) {
    if (!data) return;
    const markup = this._generateMarkup(data);
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _generateMarkup(d) {
    return `
      <!-- Welcome -->
      <section class="welcome fade-in-up">
        <h1>Your <span class="gradient-text">Stats Dashboard</span></h1>
        <p>Track your progress and achievements 📊</p>
      </section>

      <!-- Stats Cards -->
      <section class="stats-cards fade-in-up">
        <div class="cards">
          <div class="card gradient-primary stats-card">
            <div class="card-icon">🏆</div>
            <div class="card-info">
              <h3>Total Quizzes</h3>
              <p>${d.totalQuizzes}</p>
            </div>
          </div>
          <div class="card gradient-success stats-card">
            <div class="card-icon">🎯</div>
            <div class="card-info">
              <h3>Average Accuracy</h3>
              <p>${d.averageAccuracy}%</p>
            </div>
          </div>
          <div class="card gradient-secondary stats-card">
            <div class="card-icon">🏅</div>
            <div class="card-info">
              <h3>Total Score</h3>
              <p>${d.totalScore}</p>
            </div>
          </div>
          <div class="card bg-accent stats-card">
            <div class="card-icon">🥇</div>
            <div class="card-info">
              <h3>High Score</h3>
              <p>${d.highScore || 0}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Category Performance -->
      ${
        d.categories && d.categories.length
          ? `
      <section class="category-performance fade-in-up">
        <h2>Category Performance</h2>
        <div class="category-list">
          ${d.categories
            .map(
              (cat) => `
            <div class="category-row">
              <div class="cat-info">
                <div class="cat-name">${cat.name}</div>
                <div class="cat-meta">${cat.quizzes} quizzes • ${cat.accuracy}% accuracy</div>
              </div>
              <div class="cat-bar">
                <div class="cat-bar-fill" style="width: ${cat.accuracy}%"></div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </section>
      `
          : ""
      }

      <!-- Recent Quizzes -->
      <section class="recent-quizzes fade-in-up">
        <h2>Recent Quizzes</h2>
        <div class="recent-list">
          ${
            d.recentQuizzes && d.recentQuizzes.length
              ? d.recentQuizzes
                  .map(
                    (q) => `
            <div class="recent-item">
              <div class="left">
                <div class="recent-cat">${q.category}</div>
                <div class="recent-meta">${q.difficulty} • ${new Date(
                      q.date
                    ).toLocaleString()}</div>
              </div>
              <div class="right">
                <div class="recent-score">${q.score}</div>
                <div class="recent-acc">${Math.round(
                  (q.correctAnswers / q.totalQuestions) * 100
                )}%</div>
              </div>
            </div>
          `
                  )
                  .join("")
              : `<div class="no-history">No quiz history yet.</div>`
          }
        </div>
      </section>
    `;
  }
}

export default new StatsView();
