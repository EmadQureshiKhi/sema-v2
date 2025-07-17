import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import StakeholderSummary from './stakeholder/StakeholderSummary';
import StakeholderTable from './stakeholder/StakeholderTable';
import StakeholderForm from './stakeholder/StakeholderForm';
import StakeholderDescriptions from './stakeholder/StakeholderDescriptions';
import { useClientData } from '../hooks/useClientData';
import { useClient } from '../contexts/ClientContext';

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

const StakeholderManagement = () => {
  const { activeClient } = useClient();
  const { data, updateStakeholders } = useClientData();
  const stakeholders = data.stakeholders;

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'External',
    dependencyEconomic: 3,
    dependencySocial: 3,
    dependencyEnvironmental: 3,
    influenceEconomic: 3,
    influenceSocial: 3,
    influenceEnvironmental: 3
  });

  const calculateStakeholderMetrics = (data: any) => {
    const totalScore = data.dependencyEconomic + data.dependencySocial + data.dependencyEnvironmental + 
                      data.influenceEconomic + data.influenceSocial + data.influenceEnvironmental;
    const normalizedScore = totalScore / 30;
    const influenceCategory = normalizedScore >= 0.7 ? 'High' : normalizedScore >= 0.4 ? 'Medium' : 'Low';
    const priority = totalScore >= 16;

    return {
      totalScore,
      normalizedScore,
      influenceCategory,
      priority
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const metrics = calculateStakeholderMetrics(formData);
    
    if (editingId) {
      const updatedStakeholders = stakeholders.map(s => 
        s.id === editingId 
          ? { ...s, ...formData, ...metrics }
          : s
      );
      updateStakeholders(updatedStakeholders);
      setEditingId(null);
    } else {
      const newStakeholder: Stakeholder = {
        id: Date.now().toString(),
        ...formData,
        ...metrics
      };
      updateStakeholders([...stakeholders, newStakeholder]);
    }
    
    setShowForm(false);
    setFormData({
      name: '',
      category: 'External',
      dependencyEconomic: 3,
      dependencySocial: 3,
      dependencyEnvironmental: 3,
      influenceEconomic: 3,
      influenceSocial: 3,
      influenceEnvironmental: 3
    });
  };

  const handleEdit = (stakeholder: Stakeholder) => {
    setFormData({
      name: stakeholder.name,
      category: stakeholder.category,
      dependencyEconomic: stakeholder.dependencyEconomic,
      dependencySocial: stakeholder.dependencySocial,
      dependencyEnvironmental: stakeholder.dependencyEnvironmental,
      influenceEconomic: stakeholder.influenceEconomic,
      influenceSocial: stakeholder.influenceSocial,
      influenceEnvironmental: stakeholder.influenceEnvironmental
    });
    setEditingId(stakeholder.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    updateStakeholders(stakeholders.filter(s => s.id !== id));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      category: 'External',
      dependencyEconomic: 3,
      dependencySocial: 3,
      dependencyEnvironmental: 3,
      influenceEconomic: 3,
      influenceSocial: 3,
      influenceEnvironmental: 3
    });
  };

  const prioritizedStakeholders = stakeholders.filter(s => s.priority);
  const nonPriorityStakeholders = stakeholders.filter(s => !s.priority);
  const highInfluenceStakeholders = stakeholders.filter(s => s.influenceCategory === 'High');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Stakeholder Management</h2>
          <p className="text-slate-600 mt-2">
            Score and prioritize stakeholders for {activeClient?.name || 'selected client'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Stakeholder</span>
        </button>
      </div>

      <StakeholderSummary
        totalStakeholders={stakeholders.length}
        prioritizedStakeholders={prioritizedStakeholders.length}
        highInfluenceStakeholders={highInfluenceStakeholders.length}
        nonPriorityStakeholders={nonPriorityStakeholders.length}
      />

      <StakeholderTable
        stakeholders={stakeholders}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <StakeholderDescriptions />

      {showForm && (
        <StakeholderForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          editingId={editingId}
        />
      )}
    </div>
  );
};

export default StakeholderManagement;