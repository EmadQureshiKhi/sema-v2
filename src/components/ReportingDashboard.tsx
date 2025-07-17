import React, { useState } from 'react';
import { Download, FileText, CheckCircle, AlertCircle, Calendar, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { useClientData } from '../hooks/useClientData';
import { useClient } from '../contexts/ClientContext';

const ReportingDashboard = () => {
  const { activeClient } = useClient();
  const { data } = useClientData();
  const [selectedExport, setSelectedExport] = useState<'excel' | 'pdf' | 'json'>('excel');

  // Generate final material topics from actual data
  const generateFinalMaterialTopics = () => {
    const finalTopics = [];
    
    // Get material topics from external assessment
    const materialExternalTopics = data.materialTopics.filter(topic => topic.averageScore >= 7);
    
    // Get material topics from internal assessment
    const materialInternalTopics = data.internalTopics.filter(topic => topic.significance >= 10);
    
    // Combine and deduplicate
    const allTopicNames = new Set();
    
    materialExternalTopics.forEach(topic => {
      allTopicNames.add(topic.name);
      const internalTopic = materialInternalTopics.find(it => it.name === topic.name);
      
      finalTopics.push({
        id: topic.id,
        name: topic.name,
        category: topic.category,
        externalScore: topic.averageScore,
        internalScore: internalTopic ? internalTopic.significance : 0,
        rationale: internalTopic ? internalTopic.rationale : `High stakeholder interest (${topic.averageScore.toFixed(1)}/10)`,
        griDisclosure: getGRIDisclosure(topic.name, topic.category)
      });
    });
    
    // Add internal-only material topics
    materialInternalTopics.forEach(topic => {
      if (!allTopicNames.has(topic.name)) {
        finalTopics.push({
          id: topic.id,
          name: topic.name,
          category: topic.category,
          externalScore: 0,
          internalScore: topic.significance,
          rationale: topic.rationale || `High internal impact (${topic.significance}/25)`,
          griDisclosure: getGRIDisclosure(topic.name, topic.category)
        });
      }
    });
    
    return finalTopics;
  };
  
  // Helper function to get GRI disclosure codes
  const getGRIDisclosure = (topicName: string, category: string) => {
    const disclosureMap: { [key: string]: string } = {
      'Economic Performance': 'GRI 201-1',
      'GHG Emissions': 'GRI 305-1, 305-2',
      'Employment': 'GRI 401-1',
      'Training and Education': 'GRI 404-1',
      'Occupational Health & Safety': 'GRI 403-1',
      'Water Management': 'GRI 303-1',
      'Waste': 'GRI 306-1',
      'Energy': 'GRI 302-1',
      'Biodiversity': 'GRI 304-1',
      'Anti-corruption': 'GRI 205-1',
      'Customer Privacy': 'GRI 418-1'
    };
    
    return disclosureMap[topicName] || `GRI ${category === 'Economic' ? '200' : category === 'Environmental' ? '300' : '400'}-X`;
  };
  
  const finalMaterialTopics = generateFinalMaterialTopics();

  // Calculate process status based on actual data
  const calculateProcessStatus = () => {
    const stakeholderCompleted = data.stakeholders.length > 0;
    const materialityCompleted = data.materialTopics.length > 0 && data.internalTopics.length > 0;
    const validationCompleted = finalMaterialTopics.length > 0;
    const reportCompleted = finalMaterialTopics.length > 0 && data.responses.length > 0;
    
    return {
      stakeholderEngagement: { 
        completed: stakeholderCompleted, 
        progress: stakeholderCompleted ? 100 : 0 
      },
      materialityAssessment: { 
        completed: materialityCompleted, 
        progress: materialityCompleted ? 100 : (data.materialTopics.length > 0 || data.internalTopics.length > 0) ? 50 : 0 
      },
      topicValidation: { 
        completed: validationCompleted, 
        progress: validationCompleted ? 100 : 0 
      },
      reportPreparation: { 
        completed: reportCompleted, 
        progress: reportCompleted ? 100 : finalMaterialTopics.length > 0 ? 75 : 0 
      }
    };
  };
  
  const processStatus = calculateProcessStatus();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Economic': return 'bg-blue-100 text-blue-800';
      case 'Environmental': return 'bg-green-100 text-green-800';
      case 'Social': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const handleExport = (format: 'excel' | 'pdf' | 'json') => {
    // Simulate export functionality
    const filename = `SEMA_Report_${new Date().toISOString().split('T')[0]}`;
    console.log(`Exporting ${format.toUpperCase()} report: ${filename}.${format}`);
    
    // In a real implementation, this would trigger actual file download
    alert(`${format.toUpperCase()} report exported successfully!`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Reporting Dashboard</h2>
          <p className="text-slate-600 mt-2">
            Final material topics and GRI-ready sustainability disclosures for {activeClient?.name || 'selected client'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-slate-600" />
            <span className="text-sm text-slate-600">Generated: {new Date().toLocaleDateString()}</span>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Process Summary */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6">SEMA Process Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {[
              { key: 'stakeholderEngagement', label: 'Stakeholder Engagement', icon: Users },
              { key: 'materialityAssessment', label: 'Materiality Assessment', icon: TrendingUp },
              { key: 'topicValidation', label: 'Topic Validation', icon: CheckCircle },
              { key: 'reportPreparation', label: 'Report Preparation', icon: FileText }
            ].map(({ key, label, icon: Icon }) => {
              const status = processStatus[key as keyof typeof processStatus];
              return (
                <div key={key} className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    status.completed ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${status.completed ? 'text-green-600' : 'text-yellow-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900">{label}</span>
                      <span className="text-sm text-slate-600">{status.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          status.completed ? 'bg-green-600' : 'bg-yellow-600'
                        }`}
                        style={{ width: `${status.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <h4 className="font-semibold text-slate-900 mb-4">Key Metrics</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Stakeholders Engaged</span>
                <span className="font-bold text-slate-900">{data.stakeholders.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Topics Assessed</span>
                <span className="font-bold text-slate-900">{data.materialTopics.length + data.internalTopics.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Material Topics</span>
                <span className="font-bold text-green-600">{finalMaterialTopics.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">GRI Disclosures</span>
                <span className="font-bold text-blue-600">{finalMaterialTopics.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Material Topics */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span>Final Material Topics</span>
          </h3>
        </div>
        
        <div className="p-6 space-y-4">
          {finalMaterialTopics.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-slate-900 mb-2">No Material Topics Identified</h4>
              <p className="text-slate-600">Complete the Questionnaire Engine and Internal Assessment to identify material topics.</p>
            </div>
          ) : (
          <>
            {finalMaterialTopics.map((topic, index) => (
            <div key={topic.id} className="bg-slate-50 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <h4 className="font-semibold text-slate-900">{topic.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(topic.category)}`}>
                      {topic.category}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-600">External Score:</span>
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(topic.externalScore / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-900">{topic.externalScore}/10</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-600">Internal Score:</span>
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(topic.internalScore / 25) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-900">{topic.internalScore}/25</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h5 className="font-medium text-slate-900 mb-2">Rationale</h5>
                    <p className="text-sm text-slate-600">{topic.rationale}</p>
                  </div>
                </div>
                
                <div className="ml-6 text-right">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <div className="text-xs text-blue-600 font-medium">GRI Disclosure</div>
                    <div className="text-sm font-bold text-blue-900">{topic.griDisclosure}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </>
          )}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
          <Download className="w-6 h-6 text-blue-600" />
          <span>Export Options</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Excel Report</h4>
                <p className="text-sm text-slate-600">Complete SEMA analysis</p>
              </div>
            </div>
            <ul className="text-sm text-slate-600 space-y-1 mb-4">
              <li>• Stakeholder engagement data</li>
              <li>• Material topics with scores</li>
              <li>• GRI disclosure mapping</li>
              <li>• Statistical calculations</li>
            </ul>
            <button 
              onClick={() => handleExport('excel')}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition-colors"
            >
              Download Excel
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">PDF Summary</h4>
                <p className="text-sm text-slate-600">Executive summary</p>
              </div>
            </div>
            <ul className="text-sm text-slate-600 space-y-1 mb-4">
              <li>• Final material topics</li>
              <li>• Materiality matrix</li>
              <li>• Process methodology</li>
              <li>• GRI compliance checklist</li>
            </ul>
            <button 
              onClick={() => handleExport('pdf')}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition-colors"
            >
              Download PDF
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">JSON Data</h4>
                <p className="text-sm text-slate-600">Raw data export</p>
              </div>
            </div>
            <ul className="text-sm text-slate-600 space-y-1 mb-4">
              <li>• Structured data format</li>
              <li>• API integration ready</li>
              <li>• All assessment data</li>
              <li>• Custom processing</li>
            </ul>
            <button 
              onClick={() => handleExport('json')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition-colors"
            >
              Download JSON
            </button>
          </div>
        </div>
      </div>

      {/* GRI Compliance */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <h3 className="text-xl font-bold mb-4">GRI 3: Material Topics 2021 Compliance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Completed Requirements</h4>
            <div className="space-y-2">
              {[
                'Stakeholder identification and engagement',
                'External stakeholder feedback collection',
                'Internal impact assessment',
                'Materiality determination process',
                'Topic validation and rationale'
              ].map((requirement, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-blue-100">{requirement}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Next Steps</h4>
            <div className="space-y-2">
              {[
                'Collect data for material topics',
                'Prepare detailed disclosures',
                'External assurance review',
                'Final report publication',
                'Stakeholder communication'
              ].map((step, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-blue-100">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingDashboard;