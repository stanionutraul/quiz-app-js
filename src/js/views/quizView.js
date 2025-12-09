// quizView.js
import View from "./View.js";

class QuizView extends View {
  _parentElement = document.querySelector(".container");
  _errorMessage = "No quiz loaded. Please select a category.";
  _message = "";

  _currentQuestionIndex = 0;
  _score = 0;
  _correctAnswers = 0;
  _incorrectAnswers = 0;
  _totalTime = 0;
  _timerDuration = 15;
  _timerInterval;

  render(quizData, difficulty = "medium") {
    if (
      !quizData ||
      !Array.isArray(quizData.questions) ||
      quizData.questions.length === 0
    )
      return this.renderError();

    this._data = quizData;
    this._currentQuestionIndex = 0;
    this._score = 0;
    this._correctAnswers = 0;
    this._incorrectAnswers = 0;
    this._totalTime = 0;
    this._timerDuration =
      difficulty === "easy" ? 20 : difficulty === "hard" ? 10 : 15;

    this._renderQuestion();
  }

  _renderQuestion() {
    const questionObj = this._data.questions[this._currentQuestionIndex];
    const progress =
      ((this._currentQuestionIndex + 1) / this._data.questions.length) * 100;

    const markup = `
      <section class="quiz fade-in-up">
        <div class="quiz-header">
          <span>Question ${this._currentQuestionIndex + 1} of ${
      this._data.questions.length
    }</span>
          <span>Score: ${this._score}</span>
        </div>

        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>

        <div class="timer-wrap">
          <div class="quiz-timer">
            <div class="timer-pulse"></div>
            <div class="timer-number"><span class="timer">${
              this._timerDuration
            }</span>s</div>
            <div class="timer-bar"><div class="timer-fill" style="width:100%"></div></div>
          </div>
        </div>

        <div class="question-card">
          <h2 class="question">${questionObj.question}</h2>
          <div class="options">
            ${questionObj.options
              .map(
                (opt, i) =>
                  `<button class="option-btn" data-index="${i}">${opt}</button>`
              )
              .join("")}
          </div>
        </div>
      </section>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);

    // store reference to timer-fill for animation
    this._timerFillEl = this._parentElement.querySelector(".timer-fill");

    this._startTimer();

    const optionButtons = this._parentElement.querySelectorAll(".option-btn");
    optionButtons.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const selectedIndex = +e.target.dataset.index;
        this._handleAnswer(selectedIndex === questionObj.correctAnswer);
      })
    );
  }

  _startTimer() {
    const timerEl = this._parentElement.querySelector(".timer");
    let timeLeft = this._timerDuration;

    // set initial fill width
    if (this._timerFillEl) this._timerFillEl.style.width = "100%";

    clearInterval(this._timerInterval);
    const total = this._timerDuration;
    this._timerInterval = setInterval(() => {
      timeLeft--;
      timerEl.textContent = timeLeft;

      // update fill width
      if (this._timerFillEl) {
        const pct = Math.max(0, (timeLeft / total) * 100);
        this._timerFillEl.style.width = pct + "%";
      }

      // color states
      timerEl.classList.toggle("warn", timeLeft <= 5 && timeLeft > 2);
      timerEl.classList.toggle("danger", timeLeft <= 2);

      if (timeLeft <= 0) {
        clearInterval(this._timerInterval);
        this._handleAnswer(false);
      }
    }, 1000);
  }

  _handleAnswer(isCorrect) {
    clearInterval(this._timerInterval);

    const timeLeftText =
      this._parentElement.querySelector(".timer").textContent;
    const timeSpent = this._timerDuration - parseInt(timeLeftText || "0", 10);
    this._totalTime += timeSpent;

    if (isCorrect) {
      this._score += 100;
      this._correctAnswers++;
    } else {
      this._incorrectAnswers++;
    }

    const optionButtons = this._parentElement.querySelectorAll(".option-btn");
    optionButtons.forEach((btn) => {
      const index = +btn.dataset.index;
      const correctIndex =
        this._data.questions[this._currentQuestionIndex].correctAnswer;
      if (index === correctIndex) btn.classList.add("correct");
      if (
        index !== correctIndex &&
        index === parseInt(btn.dataset.index, 10) &&
        !isCorrect
      )
        btn.classList.add("incorrect");
      btn.disabled = true;
    });

    setTimeout(() => {
      if (this._currentQuestionIndex < this._data.questions.length - 1) {
        this._currentQuestionIndex++;
        this._renderQuestion();
      } else {
        // build results object
        const results = {
          score: this._score,
          correctAnswers: this._correctAnswers,
          incorrectAnswers: this._incorrectAnswers,
          totalQuestions: this._data.questions.length,
          averageTime: Math.floor(
            this._totalTime / this._data.questions.length
          ),
          totalTime: this._totalTime,
          category: this._data.category,
          difficulty: this._data.difficulty,
        };

        // call controller handler (if set)
        if (this._handlerEndQuiz) this._handlerEndQuiz(results);
      }
    }, 900);
  }

  addHandlerEndQuiz(handler) {
    this._handlerEndQuiz = handler;
  }
}

export default new QuizView();
