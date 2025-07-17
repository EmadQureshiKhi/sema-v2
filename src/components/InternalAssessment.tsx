import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Plus, Edit2, Trash2 } from 'lucide-react';
import { useClientData } from '../hooks/useClientData';
import { useClient } from '../contexts/ClientContext';

interface InternalTopic {
  id: string;
  name: string;
  description: string;
  category: 'Economic' | 'Environmental' | 'Social';
  severity: number;
  likelihood: number;
  significance: number;
  isMaterial: boolean;
  rationale: string;
}

const InternalAssessment = () => {
  const { activeClient } = useClient();
  const { data, updateInternalTopics } = useClientData();
  const internalTopics = data.internalTopics;

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Economic' as 'Economic' | 'Environmental' | 'Social',
    severity: 3,
    likelihood: 3,
    rationale: ''
  });

  const calculateSignificance = (severity: number, likelihood: number) => {
    return severity * likelihood;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const significance = calculateSignificance(formData.severity, formData.likelihood);
    const isMaterial = significance >= 10;
    
    if (editingId) {
      const updatedTopics = internalTopics.map(topic => 
        topic.id === editingId 
          ? { ...topic, ...formData, significance, isMaterial }
          : topic
      );
      updateInternalTopics(updatedTopics);
      setEditingId(null);
    } else {
      const newTopic: InternalTopic = {
        id: Date.now().toString(),
        ...formData,
        significance,
        isMaterial
      };
      updateInternalTopics([...internalTopics, newTopic]);
    }
    
    setShowForm(false);
    setFormData({
      name: '',
      description: '',
      category: 'Economic',
      severity: 3,
      likelihood: 3,
      rationale: ''
    });
  };

  const handleEdit = (topic: InternalTopic) => {
    setFormData({
      name: topic.name,
      description: topic.description,
      category: topic.category,
      severity: topic.severity,
      likelihood: topic.likelihood,
      rationale: topic.rationale
    });
    setEditingId(topic.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    updateInternalTopics(internalTopics.filter(topic => topic.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Economic': return 'bg-blue-100 text-blue-800';
      case 'Environmental': return 'bg-green-100 text-green-800';
      case 'Social': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getSignificanceColor = (significance: number) => {
    if (significance >= 20) return 'text-red-600';
    if (significance >= 15) return 'text-orange-600';
    if (significance >= 10) return 'text-yellow-600';
    return 'text-slate-600';
  };

  const materialTopics = internalTopics.filter(topic => topic.isMaterial);
  const highRiskTopics = internalTopics.filter(topic => topic.significance >= 20);
  const averageSignificance = internalTopics.reduce((sum, topic) => sum + topic.significance, 0) / internalTopics.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Internal Impact Assessment</h2>
          <p className="text-slate-600 mt-2">
            Evaluate material topics for {activeClient?.name || 'selected client'} using severity × likelihood methodology
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Topic</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900">{internalTopics.length}</div>
              <div className="text-sm text-slate-600">Topics Assessed</div>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{materialTopics.length}</div>
              <div className="text-sm text-slate-600">Material Topics</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">{highRiskTopics.length}</div>
              <div className="text-sm text-slate-600">High Risk (≥20)</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900">{averageSignificance.toFixed(1)}</div>
              <div className="text-sm text-slate-600">Avg. Significance</div>
            </div>
            <TrendingUp className="w-8 h-8 text-slate-600" />
          </div>
        </div>
      </div>

      {/* Assessment Matrix */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Risk Assessment Matrix</h3>
        
        <div className="grid grid-cols-6 gap-2 mb-6">
          <div className="text-center font-medium text-slate-700">Likelihood →</div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="text-center font-medium text-slate-700">{i}</div>
          ))}
          
          {[5, 4, 3, 2, 1].map(severity => (
            <React.Fragment key={severity}>
              <div className="text-center font-medium text-slate-700">
                {severity === 3 ? 'Severity ↓' : ''}
                <br />
                {severity}
              </div>
              {[1, 2, 3, 4, 5].map(likelihood => {
                const significance = severity * likelihood;
                const topicsInCell = internalTopics.filter(t => t.severity === severity && t.likelihood === likelihood);
                
                return (
                  <div 
                    key={`${severity}-${likelihood}`}
                    className={`p-4 rounded-lg border-2 min-h-[80px] ${
                      significance >= 20 ? 'bg-red-100 border-red-300' :
                      significance >= 15 ? 'bg-orange-100 border-orange-300' :
                      significance >= 10 ? 'bg-yellow-100 border-yellow-300' :
                      'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="text-center font-bold text-slate-700 mb-2">{significance}</div>
                    {topicsInCell.map(topic => (
                      <div key={topic.id} className="text-xs text-slate-600 truncate" title={topic.name}>
                        {topic.name}
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
            <span>High Risk (≥20)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-100 border-2 border-orange-300 rounded"></div>
            <span>Medium-High (15-19)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
            <span>Medium (10-14)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-slate-50 border-2 border-slate-200 rounded"></div>
            <span>Low (≤9)</span>
          </div>
        </div>
      </div>

      {/* Topics Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-900">Topic Analysis</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-4 font-medium text-slate-900">Topic</th>
                <th className="text-left p-4 font-medium text-slate-900">Category</th>
                <th className="text-left p-4 font-medium text-slate-900">Severity</th>
                <th className="text-left p-4 font-medium text-slate-900">Likelihood</th>
                <th className="text-left p-4 font-medium text-slate-900">Significance</th>
                <th className="text-left p-4 font-medium text-slate-900">Material</th>
                <th className="text-left p-4 font-medium text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {internalTopics.map((topic) => (
                <tr key={topic.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4">
                    <div className="font-medium text-slate-900">{topic.name}</div>
                    <div className="text-sm text-slate-600">{topic.description}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(topic.category)}`}>
                      {topic.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold text-sm">
                        {topic.severity}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-bold text-sm">
                        {topic.likelihood}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`text-xl font-bold ${getSignificanceColor(topic.significance)}`}>
                      {topic.significance}
                    </div>
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
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(topic)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(topic.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-white/20 flex items-start justify-center pt-10 z-[100]">
          <div className="bg-slate-50 border border-slate-200 shadow-2xl rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              {editingId ? 'Edit Topic Assessment' : 'Add New Topic Assessment'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Topic Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  >
                    <option value="Economic">Economic</option>
                    <option value="Environmental">Environmental</option>
                    <option value="Social">Social</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Severity (1-5)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.severity}
                    onChange={(e) => setFormData({...formData, severity: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-600 mt-1">
                    <span>Low</span>
                    <span className="font-medium">{formData.severity}</span>
                    <span>High</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Likelihood (1-5)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.likelihood}
                    onChange={(e) => setFormData({...formData, likelihood: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-600 mt-1">
                    <span>Low</span>
                    <span className="font-medium">{formData.likelihood}</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-600 mb-2">Calculated Significance</div>
                <div className={`text-2xl font-bold ${getSignificanceColor(calculateSignificance(formData.severity, formData.likelihood))}`}>
                  {calculateSignificance(formData.severity, formData.likelihood)}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {calculateSignificance(formData.severity, formData.likelihood) >= 10 ? 'Material Topic' : 'Not Material'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rationale
                </label>
                <textarea
                  value={formData.rationale}
                  onChange={(e) => setFormData({...formData, rationale: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  placeholder="Explain the reasoning behind the severity and likelihood scores"
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="px-6 py-3 text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                >
                  {editingId ? 'Update' : 'Add'} Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalAssessment;