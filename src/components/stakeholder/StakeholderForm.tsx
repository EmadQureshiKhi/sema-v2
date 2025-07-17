import React from 'react';

interface StakeholderFormProps {
  formData: {
    name: string;
    category: string;
    dependencyEconomic: number;
    dependencySocial: number;
    dependencyEnvironmental: number;
    influenceEconomic: number;
    influenceSocial: number;
    influenceEnvironmental: number;
  };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  editingId: string | null;
}

const StakeholderForm: React.FC<StakeholderFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  editingId
}) => {
  const stakeholderOptions = [
    {
      name: "Shareholders and other Investors",
      description: "Partial owners who provide guidance on ESG decisions, influence business strategy, funding, and demand accountability."
    },
    {
      name: "Business Partners",
      description: "Entities with formal engagement for business objectives including lenders, insurers, B2B customers, and JV partners."
    },
    {
      name: "Civil Society Organizations",
      description: "Key CSR partners including media, intergovernmental organizations that influence brand image and other stakeholders."
    },
    {
      name: "Consumers",
      description: "Ultimate users of products/services who increasingly influence business decisions and reputational standing."
    },
    {
      name: "Customers",
      description: "Play integral roles in strategic decisions, branding, and investment allocation as direct purchasers."
    },
    {
      name: "Employees and other Workers",
      description: "Indispensable human and social capital whose rights and preferences significantly influence policy-making."
    },
    {
      name: "Government and/or Regulators",
      description: "Maintain legal architecture for competitive markets and policies conducive to business operations."
    },
    {
      name: "Local Communities",
      description: "Provide labor force and ensure operations continuity; communities impacted by proximity to company activities."
    },
    {
      name: "NGOs",
      description: "Crucial implementing partners for CSR and community-engagement activities."
    },
    {
      name: "Suppliers",
      description: "Critical value chain components whose operations fluctuations can impact business decisions and outputs."
    },
    {
      name: "Trade Unions",
      description: "Represent worker interests, negotiate collective bargaining, and influence worker protection and hiring."
    },
    {
      name: "Vulnerable Groups",
      description: "Groups potentially experiencing negative impacts from operations more severely than general population."
    }
  ];

  const [showCustomInput, setShowCustomInput] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  // Handle dropdown selection
  const handleStakeholderSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption(value);
    
    if (value === 'custom') {
      setShowCustomInput(true);
      setFormData({...formData, name: ''});
    } else if (value) {
      setShowCustomInput(false);
      setFormData({...formData, name: value});
    }
  };

  // Reset form when editing changes
  React.useEffect(() => {
    if (editingId && formData.name) {
      const existingOption = stakeholderOptions.find(opt => opt.name === formData.name);
      if (existingOption) {
        setSelectedOption(formData.name);
        setShowCustomInput(false);
      } else {
        setSelectedOption('custom');
        setShowCustomInput(true);
      }
    } else if (!editingId) {
      setSelectedOption('');
      setShowCustomInput(false);
    }
  }, [editingId, formData.name]);

  return (
    <div className="fixed inset-0 bg-white/20 flex items-center justify-center z-[100]">
      <div className="bg-slate-50 border border-slate-200 shadow-2xl rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">
          {editingId ? 'Edit Stakeholder' : 'Add New Stakeholder'}
        </h3>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Stakeholder Name
              </label>
              <div className="space-y-3">
                <select
                  value={selectedOption}
                  onChange={handleStakeholderSelect}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  required={!showCustomInput}
                >
                  <option value="">Select a stakeholder group...</option>
                  {stakeholderOptions.map((option, index) => (
                    <option key={index} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                  <option value="custom">Custom Stakeholder</option>
                </select>
                
                {showCustomInput && (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                    placeholder="Enter custom stakeholder name"
                    required
                  />
                )}
                
                {selectedOption && selectedOption !== 'custom' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Description:</strong> {stakeholderOptions.find(opt => opt.name === selectedOption)?.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
              >
                <option value="External">External</option>
                <option value="Internal">Internal</option>
              </select>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-slate-900 mb-4">Dependency Scores (1-5)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: 'dependencyEconomic', label: 'Economic' },
                { key: 'dependencySocial', label: 'Social' },
                { key: 'dependencyEnvironmental', label: 'Environmental' }
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {label}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData[key as keyof typeof formData] as number}
                    onChange={(e) => setFormData({...formData, [key]: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-slate-600 mt-1">
                    {formData[key as keyof typeof formData]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-slate-900 mb-4">Influence Scores (1-5)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: 'influenceEconomic', label: 'Economic' },
                { key: 'influenceSocial', label: 'Social' },
                { key: 'influenceEnvironmental', label: 'Environmental' }
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {label}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData[key as keyof typeof formData] as number}
                    onChange={(e) => setFormData({...formData, [key]: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-slate-600 mt-1">
                    {formData[key as keyof typeof formData]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-slate-700 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
              {editingId ? 'Update' : 'Add'} Stakeholder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StakeholderForm;