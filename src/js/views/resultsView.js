import View from "./View.js";

class ResultsView extends View {
  _parentElement = document.querySelector(".app");

  render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _generateMarkup() {
    const d = this._data;

    return `
      <section class="results fade-in-up">
        <h1>🎉 Rezultatele tale</h1>
        <p>Categoria: <strong>${d.category}</strong></p>

        <div class="cards">
          <div class="card gradient-primary fade-in-up">
            <div class="card-icon">🏆</div>
            <div class="card-info">
              <h3>Punctaj</h3>
              <p>${d.score}</p>
            </div>
          </div>

          <div class="card gradient-success fade-in-up">
            <div class="card-icon">🎯</div>
            <div class="card-info">
              <h3>Corecte</h3>
              <p>${d.correctAnswers}</p>
            </div>
          </div>

          <div class="card gradient-secondary fade-in-up">
            <div class="card-icon">👍</div>
            <div class="card-info">
              <h3>Greșite</h3>
              <p>${d.incorrectAnswers}</p>
            </div>
          </div>

          <div class="card bg-accent fade-in-up">
            <div class="card-icon">💪</div>
            <div class="card-info">
              <h3>Scor maxim</h3>
              <p>${d.highScore}</p>
            </div>
          </div>
        </div>

        <div class="glass-card fade-in-up">
          <h2>Rezumat</h2>
          <p>
            Ai răspuns corect la 
            <span class="text-success">${d.correctAnswers}</span> întrebări și 
            greșit la 
            <span class="text-destructive">${d.incorrectAnswers}</span>.
          </p>

          <p>Ți-a luat în medie <strong>${d.averageTime}s</strong> per întrebare.</p>

          <p>
            Ai răspuns la <strong>${d.totalQuestions}</strong> întrebări în total.
          </p>
        </div>

        <div class="results-buttons fade-in-up">
          <button class="btn restart">Reîncepe quizul</button>
          <button class="btn outline view-history">Vezi istoricul</button>
        </div>
      </section>
    `;
  }

  addHandlerRestart(handler) {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".restart");
      if (!btn) return;
      handler();
    });
  }

  addHandlerViewHistory(handler) {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".view-history");
      if (!btn) return;
      handler();
    });
  }
}

export default new ResultsView();
