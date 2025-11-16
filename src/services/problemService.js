import { getProblemSet, getUserSolvedProblems } from "../services/codeforcesService.js";

export const getUnsolvedProblem = async (handleA, handleB) => {
  const [solvedA, solvedB] = await Promise.all([
    getUserSolvedProblems(handleA),
    getUserSolvedProblems(handleB),
  ]);

  const allSolved = new Set([...solvedA, ...solvedB]);
  const problemset = await getProblemSet();

  const unsolved = problemset.filter((prob) => {
    const key = `${prob.contestId}-${prob.index}`;
    return !allSolved.has(key) && prob.rating >= 800 && prob.rating <= 1700;
  });

  if (unsolved.length === 0) return null;

  return unsolved[Math.floor(Math.random() * unsolved.length)]; // random unsolved
};
