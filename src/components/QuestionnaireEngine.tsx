import React, { useState } from 'react';
import { FileText, Send, Users, Clock, CheckCircle, Plus, Edit2, Trash2 } from 'lucide-react';
import { useClientData } from '../hooks/useClientData';
import { useClient } from '../contexts/ClientContext';

interface MaterialTopic {
  id: string;
  name: string;
  description: string;
  category: 'Economic' | 'Environmental' | 'Social';
  averageScore: number;
  responseCount: number;
  isMaterial: boolean;
}

interface StakeholderResponse {
  id: string;
  stakeholderGroup: string;
  respondentName: string;
  responses: { [topicId: string]: number };
  comments: string;
  submittedAt: string;
}

const QuestionnaireEngine = () => {
  const { activeClient } = useClient();
  const { data, updateMaterialTopics, updateResponses } = useClientData();
  const materialTopics = data.materialTopics;
  const responses = data.responses;


  const [showTopicForm, setShowTopicForm] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState({
    name: '',
    description: '',
    category: 'Economic' as 'Economic' | 'Environmental' | 'Social'
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'topics' | 'responses'>('overview');

  const handleAddTopic = () => {
    if (editingTopicId) {
      const updatedTopics = materialTopics.map(topic => 
        topic.id === editingTopicId 
          ? { ...topic, ...newTopic }
          : topic
      );
      updateMaterialTopics(updatedTopics);
      setEditingTopicId(null);
    } else {
      const topic: MaterialTopic = {
        id: Date.now().toString(),
        ...newTopic,
        averageScore: 0,
        responseCount: 0,
        isMaterial: false
      };
      updateMaterialTopics([...materialTopics, topic]);
    }
    
    setNewTopic({ name: '', description: '', category: 'Economic' });
    setShowTopicForm(false);
  };

  const handleEditTopic = (topic: MaterialTopic) => {
    setNewTopic({
      name: topic.name,
      description: topic.description,
      category: topic.category
    });
    setEditingTopicId(topic.id);
    setShowTopicForm(true);
  };

  const handleDeleteTopic = (topicId: string) => {
    updateMaterialTopics(materialTopics.filter(topic => topic.id !== topicId));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Economic': return 'bg-blue-100 text-blue-800';
      case 'Environmental': return 'bg-green-100 text-green-800';
      case 'Social': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const materialTopicsCount = materialTopics.filter(topic => topic.isMaterial).length;
  const totalResponses = responses.length;
  const averageResponseTime = 5.2; // minutes

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Questionnaire Engine</h2>
          <p className="text-slate-600 mt-2">
            Collect and analyze external stakeholder feedback for {activeClient?.name || 'selected client'}
          </p>
        </div>
        <button
          onClick={() => setShowTopicForm(true)}
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
              <div className="text-2xl font-bold text-slate-900">{materialTopics.length}</div>
              <div className="text-sm text-slate-600">Total Topics</div>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{materialTopicsCount}</div>
              <div className="text-sm text-slate-600">Material Topics</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">{totalResponses}</div>
              <div className="text-sm text-slate-600">Responses</div>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">{averageResponseTime}m</div>
              <div className="text-sm text-slate-600">Avg. Response Time</div>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200">
        <div className="flex border-b border-slate-200">
          {[
            { id: 'overview', label: 'Overview', icon: FileText },
            { id: 'topics', label: 'Material Topics', icon: CheckCircle },
            { id: 'responses', label: 'Responses', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-900 mb-2">Economic Topics</h4>
                  <div className="text-2xl font-bold text-blue-600">
                    {materialTopics.filter(t => t.category === 'Economic').length}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-900 mb-2">Environmental Topics</h4>
                  <div className="text-2xl font-bold text-green-600">
                    {materialTopics.filter(t => t.category === 'Environmental').length}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-900 mb-2">Social Topics</h4>
                  <div className="text-2xl font-bold text-purple-600">
                    {materialTopics.filter(t => t.category === 'Social').length}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <h4 className="font-semibold mb-2">Questionnaire Status</h4>
                <p className="text-blue-100 mb-4">
                  The questionnaire is currently active and collecting responses from stakeholders.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Active</span>
                  </div>
                  <div className="text-sm">
                    {totalResponses} responses collected
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'topics' && (
            <div className="space-y-4">
              {materialTopics.map((topic) => (
                <div key={topic.id} className="bg-slate-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-slate-900">{topic.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(topic.category)}`}>
                          {topic.category}
                        </span>
                        {topic.isMaterial && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Material
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm mb-3">{topic.description}</p>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-slate-600">
                          <span className="font-medium">Score:</span> {topic.averageScore.toFixed(1)}/10
                        </div>
                        <div className="text-sm text-slate-600">
                          <span className="font-medium">Responses:</span> {topic.responseCount}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditTopic(topic)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTopic(topic.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(topic.averageScore / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'responses' && (
            <div className="space-y-4">
              {responses.map((response) => (
                <div key={response.id} className="bg-slate-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-slate-900">{response.respondentName}</h4>
                      <p className="text-slate-600 text-sm">{response.stakeholderGroup}</p>
                    </div>
                    <div className="text-sm text-slate-600">
                      {new Date(response.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {Object.entries(response.responses).map(([topicId, score]) => {
                      const topic = materialTopics.find(t => t.id === topicId);
                      if (!topic) return null;
                      
                      return (
                        <div key={topicId} className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">{topic.name}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(score / 10) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-slate-900 w-8">{score}/10</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {response.comments && (
                    <div className="bg-white rounded-lg p-4">
                      <h5 className="font-medium text-slate-900 mb-2">Comments</h5>
                      <p className="text-slate-600 text-sm">{response.comments}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Topic Form Modal */}
      {showTopicForm && (
        <div className="fixed inset-0 bg-white/20 flex items-center justify-center z-[100]">
          <div className="bg-slate-50 border border-slate-200 shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              {editingTopicId ? 'Edit Topic' : 'Add New Topic'}
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Topic Name
                </label>
                <input
                  type="text"
                  value={newTopic.name}
                  onChange={(e) => setNewTopic({...newTopic, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  placeholder="Enter topic name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newTopic.description}
                  onChange={(e) => setNewTopic({...newTopic, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  placeholder="Enter topic description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category
                </label>
                <select
                  value={newTopic.category}
                  onChange={(e) => setNewTopic({...newTopic, category: e.target.value as any})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                >
                  <option value="Economic">Economic</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Social">Social</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 mt-8">
              <button
                onClick={() => {
                  setShowTopicForm(false);
                  setEditingTopicId(null);
                  setNewTopic({ name: '', description: '', category: 'Economic' });
                }}
                className="px-6 py-3 text-slate-700 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTopic}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
              >
                {editingTopicId ? 'Update' : 'Add'} Topic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionnaireEngine;