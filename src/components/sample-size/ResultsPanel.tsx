import React from 'react';
import { TrendingUp, Info } from 'lucide-react';

interface ResultsPanelProps {
  results: {
    infiniteSampleSize: number;
    adjustedSampleSize: number;
    zScore: number;
  };
  parameters: {
    confidenceLevel: number;
  };
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, parameters }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
        <TrendingUp className="w-6 h-6 text-green-600" />
        <span>Base Parameters</span>
      </h3>
      
      <div className="space-y-6">
        <div className="bg-blue-50 rounded-xl p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {results.infiniteSampleSize}
          </div>
          <div className="text-sm text-slate-600">
            Base Sample Size (Infinite Population)
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-xl font-bold text-slate-900">{results.zScore}</div>
            <div className="text-sm text-slate-600">Z-Score</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-xl font-bold text-slate-900">{parameters.confidenceLevel}%</div>
            <div className="text-sm text-slate-600">Confidence</div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <div className="font-medium text-yellow-800 mb-1">Base Formula</div>
              <div className="text-sm text-yellow-700 font-mono">
                n = (Z² × p × (1-p)) / E²
              </div>
              <div className="text-xs text-yellow-600 mt-1">
                This base calculation is used for all stakeholders, with finite population correction applied individually when selected.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;