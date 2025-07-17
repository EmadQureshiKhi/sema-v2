import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface Stakeholder {
  id: string;
  name: string;
  category: string;
  dependencyEconomic: number;
  dependencySocial: number;
  dependencyEnvironmental: number;
  influenceEconomic: number;
  influenceSocial: number;
  influenceEnvironmental: number;
  totalScore: number;
  normalizedScore: number;
  influenceCategory: string;
  priority: boolean;
}

interface StakeholderTableProps {
  stakeholders: Stakeholder[];
  onEdit: (stakeholder: Stakeholder) => void;
  onDelete: (id: string) => void;
}

const StakeholderTable: React.FC<StakeholderTableProps> = ({
  stakeholders,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-xl font-bold text-slate-900">Stakeholder Analysis</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-4 font-medium text-slate-900">Stakeholder</th>
              <th className="text-left p-4 font-medium text-slate-900">Category</th>
              <th className="text-left p-4 font-medium text-slate-900">Dependency</th>
              <th className="text-left p-4 font-medium text-slate-900">Influence</th>
              <th className="text-left p-4 font-medium text-slate-900">Total Score</th>
              <th className="text-left p-4 font-medium text-slate-900">Priority</th>
              <th className="text-left p-4 font-medium text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stakeholders.map((stakeholder) => (
              <tr key={stakeholder.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-4">
                  <div className="font-medium text-slate-900">{stakeholder.name}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    stakeholder.category === 'Internal' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {stakeholder.category}
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-sm text-slate-600">
                    E: {stakeholder.dependencyEconomic}, S: {stakeholder.dependencySocial}, En: {stakeholder.dependencyEnvironmental}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-slate-600">
                    E: {stakeholder.influenceEconomic}, S: {stakeholder.influenceSocial}, En: {stakeholder.influenceEnvironmental}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-slate-900">{stakeholder.totalScore}</div>
                  <div className="text-xs text-slate-600">{(stakeholder.normalizedScore * 100).toFixed(0)}%</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    stakeholder.priority 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {stakeholder.priority ? '✅ Engage' : '❌ Skip'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(stakeholder)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(stakeholder.id)}
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
  );
};

export default StakeholderTable;