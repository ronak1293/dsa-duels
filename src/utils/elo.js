export const updateElo = (Ra, Rb, resultA, resultB) => {
  const K = 30;
  const Ea = 1 / (1 + 10 ** ((Rb - Ra) / 400));
  const Eb = 1 / (1 + 10 ** ((Ra - Rb) / 400));
  return [Ra + K * (resultA - Ea), Rb + K * (resultB - Eb)];
};
