// model.js
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
    results: [], // {id, name}
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
  recent: {
    results: [], // Recent quizzes array
    page: 1, // current page
    perPage: 5, // max items per page
  },
};

// =====================
// QUIZ LOADING & FORMATTING
// =====================
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
    console.error(err);
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

    const catObj = state.search.results.find(
      (c) => String(c.id) === String(categoryId)
    );
    const categoryName = catObj ? catObj.name : categoryId;

    state.quiz = createQuizObject({
      id: `${categoryId}-${difficulty}-${Date.now()}`,
      category: categoryId, // store id
      categoryName, // friendly name
      difficulty,
      questions: formattedQuestions,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// =====================
// SAVE QUIZ RESULT
// =====================
export const saveQuizResult = function (results) {
  if (!state.quiz || !state.quiz.id) return;

  const entry = {
    id: state.quiz.id,
    title: state.quiz.title,
    categoryId: state.quiz.category,
    category: state.quiz.categoryName || state.quiz.category, // friendly name
    difficulty: state.quiz.difficulty,
    questions: state.quiz.questions,
    date: new Date().toISOString(),
    score: results.score,
    correctAnswers: results.correctAnswers,
    incorrectAnswers: results.incorrectAnswers,
    totalQuestions: results.totalQuestions,
    averageTime: results.averageTime,
    totalTime:
      results.totalTime || results.averageTime * results.totalQuestions,
  };

  // Push history
  state.history.push(entry);

  // Update aggregates
  state.stats.totalQuizzes++;
  state.stats.totalScore += entry.score;
  state.stats.totalCorrect += entry.correctAnswers;
  state.stats.totalIncorrect += entry.incorrectAnswers;
  state.stats.totalTime += entry.totalTime || 0;

  // Update recent quizzes (reverse order: latest first)
  state.recent.results = [...state.history].slice(-50).reverse(); // keep last 50 max
  state.recent.page = 1; // reset pagination

  saveToStorage();
};

// =====================
// SUMMARY FOR DASHBOARD
// =====================
export const getSummary = function () {
  const stats = state.stats || {};
  return {
    totalQuizzes: stats.totalQuizzes || 0,
    totalScore: stats.totalScore || 0,
    totalCorrect: stats.totalCorrect || 0,
    totalIncorrect: stats.totalIncorrect || 0,
    averageAccuracy:
      stats.totalCorrect + stats.totalIncorrect > 0
        ? Math.round(
            (stats.totalCorrect / (stats.totalCorrect + stats.totalIncorrect)) *
              100
          )
        : 0,
    averageScore:
      stats.totalQuizzes > 0
        ? Math.round(stats.totalScore / stats.totalQuizzes)
        : 0,
  };
};

// =====================
// RECENT QUIZZES PAGINATION
// =====================
export const getRecentPage = function (page = state.recent.page) {
  state.recent.page = page;
  const start = (page - 1) * state.recent.perPage;
  const end = page * state.recent.perPage;
  return state.recent.results.slice(start, end);
};

export const getRecentNumPages = function () {
  return Math.ceil(state.recent.results.length / state.recent.perPage);
};

// =====================
// LOCAL STORAGE
// =====================
const saveToStorage = function () {
  localStorage.setItem(
    "quizData",
    JSON.stringify({ history: state.history, stats: state.stats })
  );
};

const loadFromStorage = function () {
  try {
    const data = JSON.parse(localStorage.getItem("quizData"));
    if (!data) return;
    state.history = data.history || [];
    state.stats = data.stats || state.stats;

    // populate recent quizzes
    state.recent.results = [...state.history].slice(-50).reverse();
  } catch (err) {
    // ignore
  }
};

loadFromStorage();
