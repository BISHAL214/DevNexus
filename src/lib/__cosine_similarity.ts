export const __cosineSimilarity = async (
  vecA: number[],
  vecB: number[]
): Promise<number> => {
  let dotProduct = 0,
    magA = 0,
    magB = 0;

  // Use a single loop to calculate dotProduct and magnitudes
  for (let i = 0; i < vecA.length; i++) {
    const a = vecA[i];
    const b = vecB[i];

    dotProduct += a * b;
    magA += a * a;
    magB += b * b;
  }

  // Avoid division by zero
  const denominator = Math.sqrt(magA) * Math.sqrt(magB);
  return denominator === 0 ? 0 : dotProduct / denominator;
};
