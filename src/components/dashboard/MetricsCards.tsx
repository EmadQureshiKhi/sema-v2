import React from 'react';
import { Users, Calculator, BarChart3, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import { useClientData } from '../../hooks/useClientData';

const MetricsCards = () => {
  const { data } = useClientData();
  
  // Calculate sample size based on current parameters and stakeholder count
  const calculateTotalSampleSize = () => {
    if (data.stakeholders.length === 0) return 0;
    
    const getZScore = (confidence: number) => {
      const zScores: { [key: number]: number } = { 90: 1.645, 95: 1.96, 99: 2.576 };
      return zScores[confidence] || 1.96;
    };
    
    const z = getZScore(data.sampleSizeParams.confidenceLevel);
    const p = data.sampleSizeParams.populationProportion;
    const e = data.sampleSizeParams.marginOfError / 100;
    
    return Math.ceil((z * z * p * (1 - p)) / (e * e));
  };

  const metrics = [
    {
      value: data.stakeholders.length.toString(),
      label: 'Stakeholders',
      icon: Users,
      gradient: 'from-kpmg-blue-100 to-kpmg-blue-200',
      iconColor: 'text-kpmg-blue-600',
      shadowColor: 'group-hover:shadow-glow'
    },
    {
      value: calculateTotalSampleSize().toString(),
      label: 'Sample Size',
      icon: Calculator,
      gradient: 'from-kpmg-teal-100 to-kpmg-teal-200',
      iconColor: 'text-kpmg-teal-600',
      shadowColor: 'group-hover:shadow-glow-teal'
    },
    {
      value: data.materialTopics.filter(t => t.isMaterial).length.toString(),
      label: 'Material Topics',
      icon: BarChart3,
      gradient: 'from-kpmg-orange-100 to-kpmg-orange-200',
      iconColor: 'text-kpmg-orange-600',
      shadowColor: 'group-hover:shadow-glow'
    },
    {
      value: `${data.sampleSizeParams.confidenceLevel}%`,
      label: 'Confidence Level',
      icon: TrendingUp,
      gradient: 'from-success-100 to-success-200',
      iconColor: 'text-success-600',
      shadowColor: 'group-hover:shadow-glow'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} hover className="group">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-kpmg-gray-900 group-hover:scale-110 transition-transform duration-300">
                  {metric.value}
                </div>
                <div className="text-sm text-kpmg-gray-600 font-semibold">{metric.label}</div>
              </div>
              <div className={`w-14 h-14 bg-gradient-to-br ${metric.gradient} rounded-2xl flex items-center justify-center ${metric.shadowColor} transition-all duration-300`}>
                <Icon className={`w-7 h-7 ${metric.iconColor} group-hover:scale-110 transition-transform duration-300`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default MetricsCards;