import React from 'react';
import { useEffect } from 'react';
import DashboardHeader from './dashboard/DashboardHeader';
import MetricsCards from './dashboard/MetricsCards';
import ProcessFlow from './dashboard/ProcessFlow';
import GRIFrameworkInfo from './dashboard/GRIFrameworkInfo';
import { useClientData } from '../hooks/useClientData';

const Dashboard = () => {
  const { data } = useClientData();
  
  // Update header progress when dashboard data changes
  useEffect(() => {
    const calculateOverallProgress = () => {
      let totalSteps = 6;
      let completedSteps = 0;
      
      if (data.stakeholders.length > 0) completedSteps += 1;
      if (data.stakeholders.length > 0 && data.sampleSizeParams.confidenceLevel) completedSteps += 1;
      if (data.materialTopics.length > 0) completedSteps += 1;
      if (data.internalTopics.length > 0) completedSteps += 1;
      if (data.materialTopics.length > 0 && data.internalTopics.length > 0) completedSteps += 1;
      
      const materialTopics = [...data.materialTopics.filter(t => t.isMaterial), ...data.internalTopics.filter(t => t.isMaterial)];
      if (materialTopics.length > 0) completedSteps += 1;
      
      return Math.round((completedSteps / totalSteps) * 100);
    };
    
    const progress = calculateOverallProgress();
    const progressElement = document.getElementById('overall-progress');
    const progressBarElement = document.getElementById('progress-bar');
    
    if (progressElement) progressElement.textContent = `${progress}%`;
    if (progressBarElement) progressBarElement.style.width = `${progress}%`;
  }, [data]);

  return (
    <div className="space-y-8 animate-fade-in">
      <DashboardHeader />
      <MetricsCards />
      <ProcessFlow />
      <GRIFrameworkInfo />
    </div>
  );
};

export default Dashboard;