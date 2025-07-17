import React, { useState } from 'react';
import { BarChart3, Download, Filter, Grid3x3 } from 'lucide-react';
import { useClientData } from '../hooks/useClientData';
import { useClient } from '../contexts/ClientContext';

const MaterialityMatrix = () => {
  const { activeClient } = useClient();
  const { data } = useClientData();
  
  // Combine external (questionnaire) and internal assessment data
  const combineTopicsData = () => {
    const combinedTopics = [];
    
    // Add external topics (from questionnaire)
    data.materialTopics.forEach(topic => {
      const getQuadrant = (external: number, internal: number) => {
        const extHigh = external >= 7;
        const intHigh = internal >= 10;
        if (extHigh && intHigh) return 'high-high';
        if (extHigh && !intHigh) return 'high-low';
        if (!extHigh && intHigh) return 'low-high';
        return 'low-low';
      };
      
      combinedTopics.push({
        id: topic.id,
        name: topic.name,
        category: topic.category,
        externalScore: topic.averageScore,
        internalScore: 0, // Default if no internal assessment
        isMaterial: topic.averageScore >= 7,
        quadrant: getQuadrant(topic.averageScore, 0)
      });
    });
    
    // Add internal topics
    data.internalTopics.forEach(topic => {
      const existingTopic = combinedTopics.find(t => t.name === topic.name);
      const getQuadrant = (external: number, internal: number) => {
        const extHigh = external >= 7;
        const intHigh = internal >= 10;
        if (extHigh && intHigh) return 'high-high';
        if (extHigh && !intHigh) return 'high-low';
        if (!extHigh && intHigh) return 'low-high';
        return 'low-low';
      };
      
      if (existingTopic) {
        // Update existing topic with internal data
        existingTopic.internalScore = topic.significance;
        existingTopic.isMaterial = existingTopic.externalScore >= 7 || topic.significance >= 10;
        existingTopic.quadrant = getQuadrant(existingTopic.externalScore, topic.significance);
      } else {
        // Add new topic from internal assessment
        combinedTopics.push({
          id: topic.id,
          name: topic.name,
          category: topic.category,
          externalScore: 0, // Default if no external assessment
          internalScore: topic.significance,
          isMaterial: topic.significance >= 10,
          quadrant: getQuadrant(0, topic.significance)
        });
      }
    });
    
    return combinedTopics;
  };
  
  const topics = combineTopicsData();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Economic': return '#3B82F6';
      case 'Environmental': return '#10B981';
      case 'Social': return '#8B5CF6';
      default: return '#64748B';
    }
  };

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case 'high-high': return '#EF4444';
      case 'high-low': return '#F59E0B';
      case 'low-high': return '#F59E0B';
      case 'low-low': return '#64748B';
      default: return '#64748B';
    }
  };

  const filteredTopics = selectedCategory === 'All' 
    ? topics 
    : topics.filter(topic => topic.category === selectedCategory);

  const materialTopics = topics.filter(topic => topic.isMaterial);
  const highHighTopics = topics.filter(topic => topic.quadrant === 'high-high');

  const MatrixChart = () => (
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-50 to-white rounded-xl border-2 border-slate-200 overflow-hidden">
      {/* Axes */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-slate-300"></div>
      <div className="absolute bottom-0 left-0 w-px h-full bg-slate-300"></div>
      
      {/* Axis Labels */}
      <div className="absolute bottom-2 right-4 text-xs text-slate-600 font-medium">
        External Stakeholder Importance →
      </div>
      <div className="absolute bottom-2 left-6 text-xs text-slate-600 font-medium transform -rotate-90 origin-bottom-left whitespace-nowrap">
        Internal Impact Significance →
      </div>
      
      {/* Quadrant Labels */}
      <div className="absolute top-6 right-6 text-xs text-slate-500 font-medium text-center">
        High-High<br/>Priority
      </div>
      <div className="absolute bottom-6 right-6 text-xs text-slate-500 font-medium text-center">
        High-Low<br/>Monitor
      </div>
      <div className="absolute top-6 left-8 text-xs text-slate-500 font-medium text-center">
        Low-High<br/>Manage
      </div>
      <div className="absolute bottom-6 left-8 text-xs text-slate-500 font-medium text-center">
        Low-Low<br/>Minimal
      </div>
      
      {/* Threshold Lines */}
      <div className="absolute left-1/2 top-0 w-px h-full bg-slate-300 opacity-50"></div>
      <div className="absolute bottom-1/2 left-0 w-full h-px bg-slate-300 opacity-50"></div>
      
      {/* Data Points */}
      {filteredTopics.map((topic) => {
        // Add padding to keep points within visible area
        const x = Math.max(5, Math.min(95, (topic.externalScore / 10) * 90 + 5));
        const y = Math.max(5, Math.min(95, 100 - ((topic.internalScore / 25) * 90 + 5)));
        
        return (
          <div
            key={topic.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-200 group-hover:scale-150 ${
                topic.isMaterial ? 'ring-2 ring-red-500' : ''
              }`}
              style={{ backgroundColor: getCategoryColor(topic.category) }}
            ></div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
              {topic.name}
              <br />
              External: {topic.externalScore}/10
              <br />
              Internal: {topic.internalScore}/25
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Materiality Matrix</h2>
          <p className="text-slate-600 mt-2">
            Visual analysis of material topics for {activeClient?.name || 'selected client'} by external importance and internal impact
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            >
              <option value="All">All Categories</option>
              <option value="Economic">Economic</option>
              <option value="Environmental">Environmental</option>
              <option value="Social">Social</option>
            </select>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors">
            <Download className="w-5 h-5" />
            <span>Export Matrix</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900">{topics.length}</div>
              <div className="text-sm text-slate-600">Total Topics</div>
            </div>
            <Grid3x3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">{materialTopics.length}</div>
              <div className="text-sm text-slate-600">Material Topics</div>
            </div>
            <BarChart3 className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">{highHighTopics.length}</div>
              <div className="text-sm text-slate-600">High Priority</div>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{Math.round((materialTopics.length / topics.length) * 100)}%</div>
              <div className="text-sm text-slate-600">Materiality Rate</div>
            </div>
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Matrix Visualization */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">Materiality Matrix</h3>
          {topics.length === 0 && (
            <div className="text-sm text-slate-600">No topics available - add topics in Questionnaire Engine and Internal Assessment</div>
          )}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
              <span className="text-sm text-slate-600">Economic</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-600"></div>
              <span className="text-sm text-slate-600">Environmental</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-purple-600"></div>
              <span className="text-sm text-slate-600">Social</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-600 ring-2 ring-red-500"></div>
              <span className="text-sm text-slate-600">Material</span>
            </div>
          </div>
        </div>
        
        {topics.length === 0 ? (
          <div className="text-center py-12">
            <Grid3x3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-900 mb-2">No Topics to Display</h4>
            <p className="text-slate-600">Add material topics in the Questionnaire Engine and complete Internal Assessment to see the materiality matrix.</p>
          </div>
        ) : (
          <MatrixChart />
        )}
      </div>

      {/* Topics Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-900">Topic Analysis</h3>
        </div>
        
        {topics.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-900 mb-2">No Topics Available</h4>
            <p className="text-slate-600">Complete the Questionnaire Engine and Internal Assessment modules to see topic analysis.</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-4 font-medium text-slate-900">Topic</th>
                <th className="text-left p-4 font-medium text-slate-900">Category</th>
                <th className="text-left p-4 font-medium text-slate-900">External Score</th>
                <th className="text-left p-4 font-medium text-slate-900">Internal Score</th>
                <th className="text-left p-4 font-medium text-slate-900">Quadrant</th>
                <th className="text-left p-4 font-medium text-slate-900">Material</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopics.map((topic) => (
                <tr key={topic.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-900">{topic.name}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getCategoryColor(topic.category) }}
                      ></div>
                      <span className="text-slate-600">{topic.category}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(topic.externalScore / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-900">{topic.externalScore}/10</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(topic.internalScore / 25) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-900">{topic.internalScore}/25</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: getQuadrantColor(topic.quadrant) }}
                    >
                      {topic.quadrant.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      topic.isMaterial 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {topic.isMaterial ? '✅ Material' : '❌ Not Material'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Methodology */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <h3 className="text-xl font-bold mb-4">Matrix Methodology</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 rounded-xl p-4">
            <h4 className="font-semibold mb-2">X-Axis: External Importance</h4>
            <p className="text-sm text-blue-100">
              Based on stakeholder feedback scores (1-10 scale). Topics scoring ≥7 are considered 
              externally material by stakeholders.
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <h4 className="font-semibold mb-2">Y-Axis: Internal Impact</h4>
            <p className="text-sm text-blue-100">
              Based on internal assessment using Severity × Likelihood (1-25 scale). 
              Topics scoring ≥10 are considered internally material.
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <h4 className="font-semibold mb-2">Quadrant Analysis</h4>
            <ul className="text-sm text-blue-100 space-y-1">
              <li>• High-High: Priority topics for immediate action</li>
              <li>• High-Low: Monitor external stakeholder concerns</li>
              <li>• Low-High: Manage internal risks effectively</li>
              <li>• Low-Low: Minimal attention required</li>
            </ul>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <h4 className="font-semibold mb-2">Materiality Determination</h4>
            <p className="text-sm text-blue-100">
              Topics are considered material if they meet either external (≥7) or internal (≥10) 
              thresholds, with priority given to high-high quadrant topics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialityMatrix;