import React from 'react';
import { Users, Calculator, FileText, TrendingUp, BarChart3, Download, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import Card from '../ui/Card';
import { useClientData } from '../../hooks/useClientData';

const ProcessFlow = () => {
  const { data } = useClientData();

  const calculateModuleStatus = () => {
    const stakeholdersProgress = data.stakeholders.length > 0 ? 100 : 0;
    const stakeholdersStatus = stakeholdersProgress === 100 ? 'completed' : 'pending';

    const sampleSizeProgress = data.stakeholders.length > 0 ? 100 : 0;
    const sampleSizeStatus = sampleSizeProgress === 100 ? 'completed' : 'pending';

    const questionnaireProgress = data.materialTopics.length > 0 ? 
      (data.responses.length > 0 ? 100 : 50) : 0;
    const questionnaireStatus = questionnaireProgress === 100 ? 'completed' : 
      questionnaireProgress > 0 ? 'in-progress' : 'pending';

    const internalProgress = data.internalTopics.length > 0 ? 100 : 0;
    const internalStatus = internalProgress === 100 ? 'completed' : 'pending';

    const matrixProgress = (data.materialTopics.length > 0 && data.internalTopics.length > 0) ? 100 : 0;
    const matrixStatus = matrixProgress === 100 ? 'completed' : 'pending';

    const materialTopics = [...data.materialTopics.filter(t => t.isMaterial), ...data.internalTopics.filter(t => t.isMaterial)];
    const reportingProgress = materialTopics.length > 0 ? 100 : 0;
    const reportingStatus = reportingProgress === 100 ? 'completed' : 'pending';

    return [
      { id: 'stakeholders', name: 'Stakeholder Management', icon: Users, status: stakeholdersStatus, progress: stakeholdersProgress },
      { id: 'sample-size', name: 'Sample Size Calculator', icon: Calculator, status: sampleSizeStatus, progress: sampleSizeProgress },
      { id: 'questionnaire', name: 'Questionnaire Engine', icon: FileText, status: questionnaireStatus, progress: questionnaireProgress },
      { id: 'internal-assessment', name: 'Internal Assessment', icon: TrendingUp, status: internalStatus, progress: internalProgress },
      { id: 'materiality-matrix', name: 'Materiality Matrix', icon: BarChart3, status: matrixStatus, progress: matrixProgress },
      { id: 'reporting', name: 'Reporting Dashboard', icon: Download, status: reportingStatus, progress: reportingProgress }
    ];
  };

  const modules = calculateModuleStatus();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <Card variant="elevated" padding="lg">
      <h3 className="text-2xl font-heading font-bold text-kpmg-gray-900 mb-8">SEMA Process Flow</h3>
      <div className="space-y-4">
        {modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <div key={module.id} className="flex items-center space-x-6 p-5 rounded-2xl hover:bg-kpmg-gray-50 transition-all duration-300 group hover:shadow-medium">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-kpmg-gray-100 to-kpmg-gray-200 rounded-xl group-hover:shadow-medium transition-all duration-300">
                <Icon className="w-6 h-6 text-kpmg-gray-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-kpmg-gray-900 text-lg">{module.name}</h4>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(module.status)}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(module.status)}`}>
                      {module.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-kpmg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-kpmg-blue-600 to-kpmg-teal-500 h-3 rounded-full transition-all duration-500 shadow-inner"
                    style={{ width: `${module.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-base text-kpmg-gray-600 font-bold min-w-[3rem] text-right">
                {module.progress}%
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ProcessFlow;