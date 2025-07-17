import React from 'react';
import { Users, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';

interface StakeholderSummaryProps {
  totalStakeholders: number;
  prioritizedStakeholders: number;
  highInfluenceStakeholders: number;
  nonPriorityStakeholders: number;
}

const StakeholderSummary: React.FC<StakeholderSummaryProps> = ({
  totalStakeholders,
  prioritizedStakeholders,
  highInfluenceStakeholders,
  nonPriorityStakeholders
}) => {
  const summaryCards = [
    {
      value: totalStakeholders,
      label: 'Total Stakeholders',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      value: prioritizedStakeholders,
      label: 'High Priority',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      value: highInfluenceStakeholders,
      label: 'High Influence',
      icon: TrendingUp,
      color: 'text-yellow-600'
    },
    {
      value: nonPriorityStakeholders,
      label: 'Low Priority',
      icon: AlertCircle,
      color: 'text-slate-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {summaryCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-900">{card.value}</div>
                <div className="text-sm text-slate-600">{card.label}</div>
              </div>
              <Icon className={`w-8 h-8 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StakeholderSummary;