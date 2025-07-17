import { useState, useEffect } from 'react';
import { useClient } from '../contexts/ClientContext';

interface ClientData {
  stakeholders: any[];
  internalTopics: any[];
  materialTopics: any[];
  responses: any[];
  sampleSizeParams: {
    confidenceLevel: number;
    marginOfError: number;
    populationProportion: number;
    populationSize: number;
    useFinitePopulation: boolean;
  };
}

// Demo data - only used for demo client
const DEMO_DATA: ClientData = {
  stakeholders: [
    {
      id: '1',
      name: 'Employees',
      category: 'Internal',
      dependencyEconomic: 4,
      dependencySocial: 5,
      dependencyEnvironmental: 3,
      influenceEconomic: 4,
      influenceSocial: 5,
      influenceEnvironmental: 3,
      totalScore: 24,
      normalizedScore: 0.8,
      influenceCategory: 'High',
      priority: true
    },
    {
      id: '2',
      name: 'Shareholders',
      category: 'External',
      dependencyEconomic: 5,
      dependencySocial: 3,
      dependencyEnvironmental: 2,
      influenceEconomic: 5,
      influenceSocial: 3,
      influenceEnvironmental: 2,
      totalScore: 20,
      normalizedScore: 0.67,
      influenceCategory: 'Medium',
      priority: true
    }
  ],
  internalTopics: [
    {
      id: '1',
      name: 'Economic Performance',
      description: 'Direct economic value generated and distributed',
      category: 'Economic',
      severity: 5,
      likelihood: 4,
      significance: 20,
      isMaterial: true,
      rationale: 'Core business performance metric with high impact on stakeholders'
    },
    {
      id: '2',
      name: 'GHG Emissions',
      description: 'Direct and indirect greenhouse gas emissions',
      category: 'Environmental',
      severity: 4,
      likelihood: 5,
      significance: 20,
      isMaterial: true,
      rationale: 'High regulatory risk and stakeholder concern'
    }
  ],
  materialTopics: [
    {
      id: '1',
      name: 'Economic Performance',
      description: 'Direct economic value generated and distributed',
      category: 'Economic',
      averageScore: 8.2,
      responseCount: 45,
      isMaterial: true
    },
    {
      id: '2',
      name: 'GHG Emissions',
      description: 'Direct and indirect greenhouse gas emissions',
      category: 'Environmental',
      averageScore: 7.8,
      responseCount: 42,
      isMaterial: true
    }
  ],
  responses: [
    {
      id: '1',
      stakeholderGroup: 'Employees',
      respondentName: 'John Smith',
      responses: { '1': 9, '2': 8 },
      comments: 'Focus on employee development and environmental initiatives',
      submittedAt: '2024-01-15T10:30:00'
    }
  ],
  sampleSizeParams: {
    confidenceLevel: 90,
    marginOfError: 10,
    populationProportion: 0.5,
    populationSize: 0,
    useFinitePopulation: false
  }
};

const EMPTY_DATA: ClientData = {
  stakeholders: [],
  internalTopics: [],
  materialTopics: [],
  responses: [],
  sampleSizeParams: {
    confidenceLevel: 90,
    marginOfError: 10,
    populationProportion: 0.5,
    populationSize: 0,
    useFinitePopulation: false
  }
};

export const useClientData = () => {
  const { activeClient } = useClient();
  const [data, setData] = useState<ClientData>(EMPTY_DATA);

  useEffect(() => {
    if (!activeClient) return;

    if (activeClient.isDemo) {
      // Load demo data
      setData(DEMO_DATA);
    } else {
      // Load client-specific data from localStorage
      const savedData = localStorage.getItem(`sema_data_${activeClient.id}`);
      if (savedData) {
        setData(JSON.parse(savedData));
      } else {
        // Initialize empty data for new client
        setData(EMPTY_DATA);
        localStorage.setItem(`sema_data_${activeClient.id}`, JSON.stringify(EMPTY_DATA));
      }
    }
  }, [activeClient]);

  const updateData = (updates: Partial<ClientData>) => {
    if (!activeClient) return;

    const newData = { ...data, ...updates };
    setData(newData);

    // Don't save demo data changes
    if (!activeClient.isDemo) {
      localStorage.setItem(`sema_data_${activeClient.id}`, JSON.stringify(newData));
    }
  };

  const updateStakeholders = (stakeholders: any[]) => {
    updateData({ stakeholders });
  };

  const updateInternalTopics = (internalTopics: any[]) => {
    updateData({ internalTopics });
  };

  const updateMaterialTopics = (materialTopics: any[]) => {
    updateData({ materialTopics });
  };

  const updateResponses = (responses: any[]) => {
    updateData({ responses });
  };

  const updateSampleSizeParams = (sampleSizeParams: ClientData['sampleSizeParams']) => {
    updateData({ sampleSizeParams });
  };

  return {
    data,
    updateStakeholders,
    updateInternalTopics,
    updateMaterialTopics,
    updateResponses,
    updateSampleSizeParams,
    updateData
  };
};