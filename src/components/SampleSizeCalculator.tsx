import React, { useState } from 'react';
import { BarChart3, Users } from 'lucide-react';
import ParametersPanel from './sample-size/ParametersPanel';
import ResultsPanel from './sample-size/ResultsPanel';
import { useClientData } from '../hooks/useClientData';
import { useClient } from '../contexts/ClientContext';

const SampleSizeCalculator = () => {
  const { activeClient } = useClient();
  const { data, updateSampleSizeParams } = useClientData();
  const parameters = data.sampleSizeParams;
  const stakeholders = data.stakeholders;
  
  const setParameters = (newParams: typeof parameters) => {
    updateSampleSizeParams(newParams);
  };

  const [results, setResults] = useState({
    infiniteSampleSize: 0,
    adjustedSampleSize: 0,
    zScore: 0
  });

  const getZScore = (confidence: number) => {
    const zScores: { [key: number]: number } = {
      90: 1.645,
      95: 1.96,
      99: 2.576
    };
    return zScores[confidence] || 1.96;
  };

  const calculateSampleSize = () => {
    const z = getZScore(parameters.confidenceLevel);
    const p = parameters.populationProportion;
    const e = parameters.marginOfError / 100;
    
    const infiniteSize = Math.ceil((z * z * p * (1 - p)) / (e * e));
    
    let adjustedSize = infiniteSize;
    
    if (parameters.useFinitePopulation && parameters.populationSize > 0) {
      adjustedSize = Math.ceil((infiniteSize * parameters.populationSize) / (parameters.populationSize + infiniteSize - 1));
    }
    
    setResults({
      infiniteSampleSize: infiniteSize,
      adjustedSampleSize: adjustedSize,
      zScore: z
    });
  };

  React.useEffect(() => {
    calculateSampleSize();
  }, [parameters]);

  // Convert stakeholders to categories for sample size calculation
  const stakeholderCategories = stakeholders.map(stakeholder => ({
    name: stakeholder.name,
    estimatedPopulation: 100, // Default population - this could be made configurable
    priority: stakeholder.priority ? 'High' : 'Low'
  }));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const calculateCategorySampleSize = (population: number) => {
    const z = getZScore(parameters.confidenceLevel);
    const p = parameters.populationProportion;
    const e = parameters.marginOfError / 100;
    
    const infiniteSize = Math.ceil((z * z * p * (1 - p)) / (e * e));
    return Math.ceil((infiniteSize * population) / (population + infiniteSize - 1));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Sample Size Calculator</h2>
        <p className="text-slate-600 mt-2">
          Determine statistically significant sample sizes for {activeClient?.name || 'selected client'} stakeholder engagement
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ParametersPanel parameters={parameters} setParameters={setParameters} />
        <ResultsPanel results={results} parameters={parameters} />
      </div>

      {/* Stakeholder Categories Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-purple-600" />
          <span>Sample Size by Stakeholder Category</span>
        </h3>
        
        {stakeholderCategories.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-900 mb-2">No Stakeholders Added</h4>
            <p className="text-slate-600">Add stakeholders in the Stakeholder Management module to see sample size calculations.</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-4 font-medium text-slate-900">Stakeholder Category</th>
                <th className="text-left p-4 font-medium text-slate-900">Estimated Population</th>
                <th className="text-left p-4 font-medium text-slate-900">Priority</th>
                <th className="text-left p-4 font-medium text-slate-900">Recommended Sample Size</th>
                <th className="text-left p-4 font-medium text-slate-900">Sampling Rate</th>
              </tr>
            </thead>
            <tbody>
              {stakeholderCategories.map((category, index) => {
                const sampleSize = calculateCategorySampleSize(category.estimatedPopulation);
                const samplingRate = ((sampleSize / category.estimatedPopulation) * 100).toFixed(1);
                
                return (
                  <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-900">{category.name}</td>
                    <td className="p-4 text-slate-600">{category.estimatedPopulation.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(category.priority)}`}>
                        {category.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{sampleSize}</div>
                    </td>
                    <td className="p-4 text-slate-600">{samplingRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Statistical Information */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <h3 className="text-xl font-bold mb-4">Statistical Methodology</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-xl p-4">
            <h4 className="font-semibold mb-2">Confidence Level</h4>
            <p className="text-sm text-blue-100">
              The probability that the sample accurately reflects the population. 
              Higher confidence requires larger sample sizes.
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <h4 className="font-semibold mb-2">Margin of Error</h4>
            <p className="text-sm text-blue-100">
              The maximum expected difference between the sample and population. 
              Lower margins require larger samples.
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <h4 className="font-semibold mb-2">Population Proportion</h4>
            <p className="text-sm text-blue-100">
              Expected proportion of the characteristic of interest. 
              0.5 provides the most conservative estimate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleSizeCalculator;