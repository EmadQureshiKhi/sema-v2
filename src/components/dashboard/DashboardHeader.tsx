import React from 'react';
import Card from '../ui/Card';
import { useClient } from '../../contexts/ClientContext';
import { useClientData } from '../../hooks/useClientData';

const DashboardHeader = () => {
  const { activeClient } = useClient();
  const { data } = useClientData();

  // Calculate overall progress based on actual data
  const calculateOverallProgress = () => {
    let totalSteps = 6;
    let completedSteps = 0;
    
    // Stakeholder Management (completed if stakeholders exist)
    if (data.stakeholders.length > 0) completedSteps += 1;
    
    // Sample Size Calculator (completed if parameters are set and stakeholders exist)
    if (data.stakeholders.length > 0 && data.sampleSizeParams.confidenceLevel) completedSteps += 1;
    
    // Questionnaire Engine (completed if material topics exist)
    if (data.materialTopics.length > 0) completedSteps += 1;
    
    // Internal Assessment (completed if internal topics exist)
    if (data.internalTopics.length > 0) completedSteps += 1;
    
    // Materiality Matrix (completed if both external and internal data exist)
    if (data.materialTopics.length > 0 && data.internalTopics.length > 0) completedSteps += 1;
    
    // Reporting (completed if material topics are identified)
    const materialTopics = [...data.materialTopics.filter(t => t.isMaterial), ...data.internalTopics.filter(t => t.isMaterial)];
    if (materialTopics.length > 0) completedSteps += 1;
    
    return Math.round((completedSteps / totalSteps) * 100);
  };

  const overallProgress = calculateOverallProgress();

  return (
    <Card variant="glass" padding="lg" className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-kpmg-blue-500/10 to-kpmg-teal-500/10 rounded-full -mr-16 -mt-16"></div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-heading font-bold text-kpmg-gray-900 mb-3 tracking-tight">SEMA Process Overview</h2>
          <p className="text-kpmg-gray-600 text-lg font-medium">
            {activeClient?.name ? `${activeClient.name} - ` : ''}Stakeholder Engagement and Materiality Assessment Dashboard
          </p>
          {activeClient?.isDemo && (
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-kpmg-orange-100 text-kmpg-orange-800">
                Demo Mode - Sample Data
              </span>
            </div>
          )}
        </div>
        <div className="text-right relative">
          <div className="text-5xl font-heading font-bold bg-gradient-to-r from-kpmg-blue-600 to-kpmg-teal-500 bg-clip-text text-transparent">{overallProgress}%</div>
          <div className="text-sm text-kpmg-gray-600 font-semibold">Overall Progress</div>
          {overallProgress > 0 && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-success-500 rounded-full animate-bounce-subtle"></div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DashboardHeader;