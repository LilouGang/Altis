import { Ascension } from "../../../shared/types";

export const calculateSummitStats = (ascensions: Ascension[]) => {
  if (ascensions.length === 0) return { total: 0, avg: "0.0", distribution: [0, 0, 0, 0, 0] };
  
  const total = ascensions.length;
  const sum = ascensions.reduce((acc, curr) => acc + curr.rating, 0);
  
  return { 
    total, 
    avg: (sum / total).toFixed(1), 
    distribution: [5, 4, 3, 2, 1].map(star => ascensions.filter(a => a.rating === star).length)
  };
};

export const sortAscensions = (ascensions: Ascension[], sortBy: 'recent' | 'rating') => {
  return [...ascensions].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.dateAscension).getTime() - new Date(a.dateAscension).getTime();
    return b.rating - a.rating;
  });
};