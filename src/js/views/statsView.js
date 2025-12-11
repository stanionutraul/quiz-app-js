import View from "./View.js";
class StatsView extends View {
  _parentElement = document.querySelector(".container");

  _generateMarkup(d) {
    return `
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
      ${this._generateCategories(d)}

      <!-- Recent Quizzes -->
      <section class="recent-quizzes fade-in-up">
        <h2>Recent Quizzes</h2>

        <div class="recent-list"></div>
        <div class="pagination"></div>
      </section>
    `;
  }

  _generateCategories(d) {
    if (!d.categories || !d.categories.length) return "";

    return `
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
    `;
  }
}

export default new StatsView();
