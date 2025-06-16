
import React from 'react';
import { EstimationResult } from '../types';

interface ResultsDisplayProps {
  result: EstimationResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  // Simple formatter for the text result, preserving line breaks
  const formattedText = result.text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div className="mt-8 p-6 bg-slate-700 rounded-lg shadow-inner">
      <h2 className="text-2xl font-semibold text-sky-400 mb-4">AIによる見積もり結果</h2>
      <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-slate-200 whitespace-pre-wrap">
        {formattedText}
      </div>
    </div>
  );
};
