import {
  API_QUIZ_CATEGORIES,
  API_QUIZ_QUESTIONS,
  DEFAULT_AMOUNT,
  RES_PER_PAGE,
} from "./config.js";
import { AJAX } from "./helper.js";

export const state = {
  quiz: {},
  search: {
    query: "",
    categoryId: "",
    difficulty: "",
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  history: [],
  stats: {
    totalQuizzes: 0,
    totalScore: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    totalTime: 0,
  },
};

const createQuizObject = function (data) {
  return {
    id: data.id || `${data.category}-${data.difficulty}-${Date.now()}`,
    title: data.name || data.title || "Quiz",
    category: data.category,
    difficulty: data.difficulty,
    questions: data.questions || [],
  };
};

export const loadCategories = async function () {
  try {
    const data = await AJAX(API_QUIZ_CATEGORIES);
    state.search.results = data.trivia_categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
    }));
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const loadQuiz = async function (categoryId, difficulty = "easy") {
  try {
    state.search.categoryId = categoryId;
    state.search.difficulty = difficulty;

    const url = `${API_QUIZ_QUESTIONS}?amount=${DEFAULT_AMOUNT}&category=${categoryId}&difficulty=${difficulty}&type=multiple`;

    const data = await AJAX(url);

    const formattedQuestions = data.results.map((q) => {
      const options = [...q.incorrect_answers, q.correct_answer];
      const shuffled = options
        .map((v) => ({ v, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map((obj) => obj.v);

      return {
        question: q.question,
        options: shuffled,
        correctAnswer: shuffled.indexOf(q.correct_answer),
      };
    });

    state.quiz = createQuizObject({
      id: `${categoryId}-${difficulty}-${Date.now()}`,
      category: categoryId,
      difficulty,
      questions: formattedQuestions,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// 🔥 salvare rezultate quiz + update stats
export const saveQuizResult = function (results) {
  if (!state.quiz.id) return;

  const entry = {
    id: state.quiz.id,
    title: state.quiz.title,
    category: state.quiz.category,
    difficulty: state.quiz.difficulty,
    questions: state.quiz.questions,
    date: new Date().toISOString(),
    score: results.score,
    correctAnswers: results.correctAnswers,
    incorrectAnswers: results.incorrectAnswers,
    totalQuestions: results.totalQuestions,
    averageTime: results.averageTime,
  };

  state.history.push(entry);

  // update stats aggregate
  state.stats.totalQuizzes++;
  state.stats.totalScore += results.score;
  state.stats.totalCorrect += results.correctAnswers;
  state.stats.totalIncorrect += results.incorrectAnswers;
  state.stats.totalTime += results.totalTime || 0;

  saveToStorage();
};

// summary pentru dashboard
export const getSummary = function () {
  return {
    totalQuizzes: state.stats.totalQuizzes,
    totalScore: state.stats.totalScore,
    totalCorrect: state.stats.totalCorrect,
    totalIncorrect: state.stats.totalIncorrect,
    averageAccuracy:
      state.stats.totalQuizzes > 0
        ? Math.round(
            (state.stats.totalCorrect /
              (state.stats.totalCorrect + state.stats.totalIncorrect)) *
              100
          )
        : 0,
    averageScore:
      state.stats.totalQuizzes > 0
        ? Math.round(state.stats.totalScore / state.stats.totalQuizzes)
        : 0,
  };
};

const saveToStorage = function () {
  localStorage.setItem(
    "quizData",
    JSON.stringify({ history: state.history, stats: state.stats })
  );
};

const loadFromStorage = function () {
  const data = JSON.parse(localStorage.getItem("quizData"));
  if (!data) return;
  state.history = data.history || [];
  state.stats = data.stats || state.stats;
};

loadFromStorage();
