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

    state.quiz = createQuizObject({
      id: `${categoryId}-${difficulty}-${Date.now()}`,
      category: categoryId,
      difficulty,
      questions: data.results,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const saveHistory = function () {
  if (!state.quiz.id) return;
  const entry = {
    id: state.quiz.id,
    title: state.quiz.title,
    category: state.quiz.category,
    difficulty: state.quiz.difficulty,
    questions: state.quiz.questions,
    date: new Date().toISOString(),
    score: state.quiz.score || 0,
  };
  state.history.push(entry);
  saveToStorage();
};

export const getSummary = function () {
  return {
    totalQuizzes: state.history.length,
  };
};

const saveToStorage = function () {
  localStorage.setItem("quizData", JSON.stringify({ history: state.history }));
};

const loadFromStorage = function () {
  const data = JSON.parse(localStorage.getItem("quizData"));
  if (!data) return;
  state.history = data.history || [];
};

loadFromStorage();
