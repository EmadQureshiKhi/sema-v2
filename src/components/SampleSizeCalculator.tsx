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

  const [stakeholderPopulations, setStakeholderPopulations] = useState<{[key: string]: number}>({});
  const [stakeholderFiniteFlags, setStakeholderFiniteFlags] = useState<{[key: string]: boolean}>({});

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
    
    setResults({
      infiniteSampleSize: infiniteSize,
      adjustedSampleSize: infiniteSize, // This is now just for display, individual calculations happen per stakeholder
      zScore: z
    });
  };

  React.useEffect(() => {
    calculateSampleSize();
  }, [parameters]);

  const updateStakeholderPopulation = (stakeholderId: string, population: number) => {
    setStakeholderPopulations(prev => ({
      ...prev,
      [stakeholderId]: population
    }));
  };

  const updateStakeholderFiniteFlag = (stakeholderId: string, useFinite: boolean) => {
    setStakeholderFiniteFlags(prev => ({
      ...prev,
      [stakeholderId]: useFinite
    }));
  };

  const calculateCategorySampleSize = (population: number, useFinitePopulation: boolean) => {
    const z = getZScore(parameters.confidenceLevel);
    const p = parameters.populationProportion;
    const e = parameters.marginOfError / 100;
    
    // Calculate infinite population sample size first
    const infiniteSize = Math.ceil((z * z * p * (1 - p)) / (e * e));
    
    // If using finite population correction and population is provided and greater than 0
    if (useFinitePopulation && population > 0) {
      // Apply finite population correction formula: n_adjusted = (n_infinite * N) / (N + n_infinite - 1)
      const adjustedSize = Math.ceil((infiniteSize * population) / (population + infiniteSize - 1));
      // Ensure sample size never exceeds population size
      return Math.min(adjustedSize, population);
    }
    
    // For infinite population or when finite correction is not used
    // Still cap at population size if population is specified and greater than 0
    if (population > 0) {
      return Math.min(infiniteSize, population);
    }
    
    return infiniteSize;
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
        
        {stakeholders.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-900 mb-2">No Stakeholders Added</h4>
            <p className="text-slate-600">Add stakeholders in the Stakeholder Management module to see sample size calculations.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Population Input Section */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 mb-4">Configure Sample Size Parameters</h4>
              <div className="space-y-4">
                {stakeholders.map((stakeholder) => {
                  const population = stakeholderPopulations[stakeholder.id] || 0;
                  const useFinite = stakeholderFiniteFlags[stakeholder.id] || false;
                  const sampleSize = calculateCategorySampleSize(population, useFinite);
                  
                  return (
                    <div key={stakeholder.id} className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-slate-900">{stakeholder.name}</h5>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                            stakeholder.category === 'Internal' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {stakeholder.category}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-600">Sample Size</div>
                          <div className="text-2xl font-bold text-blue-600">
                            {sampleSize}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Population Size
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={stakeholderPopulations[stakeholder.id] || ''}
                            onChange={(e) => updateStakeholderPopulation(stakeholder.id, parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                            placeholder="Enter population size"
                          />
                        </div>
                        
                        <div className="flex items-end">
                          <label className="flex items-center space-x-2 pb-2">
                            <input
                              type="checkbox"
                              checked={stakeholderFiniteFlags[stakeholder.id] || false}
                              onChange={(e) => updateStakeholderFiniteFlag(stakeholder.id, e.target.checked)}
                              disabled={population === 0}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className={`text-sm font-medium ${population === 0 ? 'text-slate-400' : 'text-slate-700'}`}>
                              Use finite population correction
                            </span>
                          </label>
                        </div>
                      </div>
                      
                      {population > 0 && (
                        <div className="mt-3 text-sm text-slate-600">
                          <div className="flex justify-between">
                            <span>Sampling Rate:</span>
                            <span className="font-medium">{((sampleSize / population) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Formula Used:</span>
                            <span className="font-mono text-xs">
                              {useFinite ? 'n = (n₀ × N) / (N + n₀ - 1)' : 'n = (Z² × p × (1-p)) / E²'}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {population === 0 && (
                        <div className="mt-3 text-sm text-slate-600">
                          <div className="flex justify-between">
                            <span>Formula Used:</span>
                            <span className="font-mono text-xs">n = (Z² × p × (1-p)) / E²</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            Infinite population calculation (default)
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left p-4 font-medium text-slate-900">Stakeholder</th>
                    <th className="text-left p-4 font-medium text-slate-900">Category</th>
                    <th className="text-left p-4 font-medium text-slate-900">Population Size</th>
                    <th className="text-left p-4 font-medium text-slate-900">Finite Correction</th>
                    <th className="text-left p-4 font-medium text-slate-900">Priority</th>
                    <th className="text-left p-4 font-medium text-slate-900">Sample Size</th>
                    <th className="text-left p-4 font-medium text-slate-900">Sampling Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {stakeholders.map((stakeholder) => {
                    const population = stakeholderPopulations[stakeholder.id] || 0;
                    const useFinite = stakeholderFiniteFlags[stakeholder.id] || false;
                    const sampleSize = calculateCategorySampleSize(population, useFinite);
                    const samplingRate = population > 0 ? ((sampleSize / population) * 100).toFixed(1) : '0';
                    
                    return (
                      <tr key={stakeholder.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="p-4 font-medium text-slate-900">{stakeholder.name}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            stakeholder.category === 'Internal' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {stakeholder.category}
                          </span>
                        </td>
                        <td className="p-4">
                          {population > 0 ? (
                            <span className="text-slate-900 font-medium">{population.toLocaleString()}</span>
                          ) : (
                            <span className="text-slate-400 italic">Infinite</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            useFinite && population > 0
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {useFinite && population > 0 ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            stakeholder.priority 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {stakeholder.priority ? 'High' : 'Low'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-blue-600">{sampleSize}</div>
                        </td>
                        <td className="p-4">
                          {population > 0 ? (
                            <span className="text-slate-600">{samplingRate}%</span>
                          ) : (
                            <span className="text-slate-400 italic">N/A</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 mb-3">Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {(() => {
                      const totalPop = Object.values(stakeholderPopulations).reduce((sum, pop) => sum + (pop || 0), 0);
                      return totalPop === 0 ? '∞' : totalPop.toLocaleString();
                    })()}
                  </div>
                  <div className="text-sm text-slate-600">Total Population</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stakeholders.reduce((sum, stakeholder) => {
                      const population = stakeholderPopulations[stakeholder.id] || 0;
                      const useFinite = stakeholderFiniteFlags[stakeholder.id] || false;
                      return sum + calculateCategorySampleSize(population, useFinite);
                    }, 0)}
                  </div>
                  <div className="text-sm text-slate-600">Total Sample Size</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {stakeholders.filter(s => s.priority).length}
                  </div>
                  <div className="text-sm text-slate-600">High Priority Groups</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistical Information */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <h3 className="text-xl font-bold mb-4">Statistical Methodology</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 rounded-xl p-4">
            <h4 className="font-semibold mb-2">Infinite Population Formula</h4>
            <p className="text-sm text-blue-100 mb-2">
              <code className="bg-white/20 px-2 py-1 rounded">n = (Z² × p × (1-p)) / E²</code>
            </p>
            <p className="text-sm text-blue-100">
              Used when population is very large or unknown. Provides conservative estimates.
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <h4 className="font-semibold mb-2">Finite Population Correction</h4>
            <p className="text-sm text-blue-100 mb-2">
              <code className="bg-white/20 px-2 py-1 rounded">n = (n₀ × N) / (N + n₀ - 1)</code>
            </p>
            <p className="text-sm text-blue-100">
              Used when population size is known and finite. Reduces required sample size.
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <h4 className="font-semibold mb-2">When to Use Finite Correction</h4>
            <p className="text-sm text-blue-100">
              Use finite population correction when you know the exact population size and 
              the sample size would be more than 5% of the population.
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <h4 className="font-semibold mb-2">Variables</h4>
            <p className="text-sm text-blue-100">
              <strong>Z</strong> = Z-score for confidence level<br/>
              <strong>p</strong> = Population proportion<br/>
              <strong>E</strong> = Margin of error<br/>
              <strong>N</strong> = Population size<br/>
              <strong>n₀</strong> = Infinite population sample size
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleSizeCalculator;