import React from 'react';
import { Calculator } from 'lucide-react';

interface ParametersPanelProps {
  parameters: {
    confidenceLevel: number;
    marginOfError: number;
    populationProportion: number;
    populationSize: number;
    useFinitePopulation: boolean;
  };
  setParameters: (params: any) => void;
}

const ParametersPanel: React.FC<ParametersPanelProps> = ({
  parameters,
  setParameters
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
        <Calculator className="w-6 h-6 text-blue-600" />
        <span>Parameters</span>
      </h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Confidence Level
          </label>
          <div className="flex space-x-4">
            {[90, 95, 99].map((level) => (
              <button
                key={level}
                onClick={() => setParameters({...parameters, confidenceLevel: level})}
                className={`px-4 py-2 rounded-xl transition-colors ${
                  parameters.confidenceLevel === level
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {level}%
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Margin of Error (%)
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={parameters.marginOfError}
            onChange={(e) => setParameters({...parameters, marginOfError: parseInt(e.target.value)})}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-slate-600 mt-1">
            <span>1%</span>
            <span className="font-medium">{parameters.marginOfError}%</span>
            <span>20%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Population Proportion
          </label>
          <input
            type="range"
            min="0.1"
            max="0.9"
            step="0.1"
            value={parameters.populationProportion}
            onChange={(e) => setParameters({...parameters, populationProportion: parseFloat(e.target.value)})}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-slate-600 mt-1">
            <span>0.1</span>
            <span className="font-medium">{parameters.populationProportion}</span>
            <span>0.9</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParametersPanel;