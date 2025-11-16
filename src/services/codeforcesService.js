import axios from "axios";

const BASE_URL = "https://codeforces.com/api";

export const getUserSolvedProblems = async (handle) => {
  const res = await axios.get(`${BASE_URL}/user.status?handle=${handle}`);
  const solved = new Set();
  res.data.result.forEach((sub) => {
    if (sub.verdict === "OK") solved.add(`${sub.problem.contestId}-${sub.problem.index}`);
  });
  return solved;
};

export const getProblemSet = async () => {
  const res = await axios.get(`${BASE_URL}/problemset.problems`);
  return res.data.result.problems;
};
