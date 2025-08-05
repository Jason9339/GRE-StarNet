import { useState, useCallback } from 'react';

export const useStarAnimation = () => {
  const [animatingStars, setAnimatingStars] = useState(new Set());

  const triggerStarAnimation = useCallback((starId, animationType = 'twinkle') => {
    setAnimatingStars(prev => new Set(prev).add(starId));
    
    // 動畫結束後移除
    setTimeout(() => {
      setAnimatingStars(prev => {
        const newSet = new Set(prev);
        newSet.delete(starId);
        return newSet;
      });
    }, 1500);
  }, []);

  const isAnimating = useCallback((starId) => {
    return animatingStars.has(starId);
  }, [animatingStars]);

  return { triggerStarAnimation, isAnimating };
};