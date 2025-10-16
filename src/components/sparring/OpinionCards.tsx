import React from 'react';
import { Debate } from '@/types/Debate';

interface OpinionCardsProps {
  debate: Debate;
}

export default function OpinionCards({ debate }: OpinionCardsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="relative p-3 bg-blue-300 rounded-2xl max-w-xs" role="region" aria-label="찬성 의견">
        <span className="text-blue-900 font-bold">👍 {debate.pros.title}</span>
        <div className="absolute -bottom-1 left-8 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-300"></div>
      </div>
      <div className="relative p-3 bg-red-300 rounded-2xl max-w-xs" role="region" aria-label="반대 의견">
        <span className="text-red-900 font-bold">👎 {debate.cons.title}</span>
        <div className="absolute -bottom-1 right-8 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-300"></div>
      </div>
    </div>
  );
}
