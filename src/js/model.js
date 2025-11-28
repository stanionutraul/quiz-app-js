import { API_QUIZ, RES_PER_PAGE } from "./config";
import { AJAX } from "./helper";

export const state = {
  quiz: {},

  search: {
    query: "",
    results: [],
    resultsPerPage,
    page: 1,
  },

  history: [],
};

const createQuizObject = function (data) {
  return {
    id: data.id,
    title: data.title,
    category: data.category,
    difficulty: data.difficulty,
    questions: data.questions,
  };
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const quizData = await AJAX("${API_URL}?search=${query}");

    const quiz = createQuizObject(quizData);
  } catch (err) {
    console.log(`${err}`);
    throw err;
  }
};
