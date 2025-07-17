import React, { useState } from 'react';
import { Plus, Building2, Edit2, Trash2, Sparkles, AlertTriangle } from 'lucide-react';
import { useClient } from '../../contexts/ClientContext';
import { useToast } from '../ui/ToastContainer';

const ClientManagement = () => {
  const { clients, addClient, updateClient, deleteClient } = useClient();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    status: 'active' as 'active' | 'inactive'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        updateClient(editingId, formData);
        showToast({
          type: 'success',
          title: 'Client Updated',
          message: `${formData.name} has been updated successfully.`
        });
        setEditingId(null);
      } else {
        const newClient = addClient({
          ...formData,
          isDemo: false
        });
        showToast({
          type: 'success',
          title: 'Client Added',
          message: `${formData.name} has been added successfully. A fresh SEMA process has been initialized.`
        });
      }
      
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        industry: '',
        status: 'active'
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to save client. Please try again.'
      });
    }
  };

  const handleEdit = (client: any) => {
    setFormData({
      name: client.name,
      description: client.description || '',
      industry: client.industry || '',
      status: client.status
    });
    setEditingId(client.id);
    setShowForm(true);
  };

  const handleDelete = (clientId: string) => {
    try {
      const client = clients.find(c => c.id === clientId);
      deleteClient(clientId);
      showToast({
        type: 'success',
        title: 'Client Deleted',
        message: `${client?.name} and all associated data have been deleted.`
      });
      setShowDeleteConfirm(null);
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Cannot Delete',
        message: error.message || 'Failed to delete client.'
      });
      setShowDeleteConfirm(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      industry: '',
      status: 'active'
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-success-100 text-success-800' 
      : 'bg-kpmg-gray-100 text-kpmg-gray-600';
  };

  const nonDemoClients = clients.filter(c => !c.isDemo);
  const demoClient = clients.find(c => c.isDemo);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xl font-bold text-kpmg-gray-900">Client Management</h4>
          <p className="text-kpmg-gray-600 mt-1">Manage organizations and their SEMA processes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-kpmg-blue-600 hover:bg-kpmg-blue-700 text-white px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Demo Client Section */}
      {demoClient && (
        <div className="bg-gradient-to-r from-kpmg-orange-50 to-kpmg-orange-100 rounded-xl p-6 border border-kpmg-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-kpmg-orange-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h5 className="font-bold text-kpmg-gray-900">{demoClient.name}</h5>
                <p className="text-sm text-kpmg-gray-600">{demoClient.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2 py-1 bg-kpmg-orange-200 text-kpmg-orange-800 rounded-full text-xs font-medium">
                    Demo Mode
                  </span>
                  <span className="text-xs text-kpmg-gray-500">
                    Created: {new Date(demoClient.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-kpmg-gray-600">Contains sample data for training</div>
              <div className="text-xs text-kpmg-orange-600 font-medium">Cannot be deleted</div>
            </div>
          </div>
        </div>
      )}

      {/* Client Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nonDemoClients.map((client) => (
          <div key={client.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-kpmg-gray-200 hover:shadow-medium transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-kpmg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-kpmg-blue-600" />
                </div>
                <div>
                  <h5 className="font-bold text-kpmg-gray-900">{client.name}</h5>
                  {client.industry && (
                    <p className="text-sm text-kpmg-gray-600">{client.industry}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleEdit(client)}
                  className="p-2 text-kpmg-blue-600 hover:bg-kpmg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(client.id)}
                  className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {client.description && (
              <p className="text-sm text-kpmg-gray-600 mb-4">{client.description}</p>
            )}
            
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                {client.status}
              </span>
              <span className="text-xs text-kpmg-gray-500">
                Created: {new Date(client.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {nonDemoClients.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-kpmg-gray-400 mx-auto mb-4" />
          <h5 className="text-lg font-medium text-kpmg-gray-900 mb-2">No Clients Yet</h5>
          <p className="text-kpmg-gray-600 mb-4">Add your first client to start managing SEMA processes</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-kpmg-blue-600 hover:bg-kpmg-blue-700 text-white px-6 py-2 rounded-xl transition-colors"
          >
            Add First Client
          </button>
        </div>
      )}

      {/* Add/Edit Client Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md shadow-strong border border-kpmg-gray-200">
            <h3 className="text-xl font-bold text-kpmg-gray-900 mb-6">
              {editingId ? 'Edit Client' : 'Add New Client'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-kpmg-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-kpmg-gray-300 focus:border-kpmg-blue-500 focus:ring-2 focus:ring-kpmg-blue-500/20 transition-colors"
                  placeholder="Enter client name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-kpmg-gray-700 mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-kpmg-gray-300 focus:border-kpmg-blue-500 focus:ring-2 focus:ring-kpmg-blue-500/20 transition-colors"
                  placeholder="e.g., Technology, Manufacturing"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-kpmg-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-kpmg-gray-300 focus:border-kpmg-blue-500 focus:ring-2 focus:ring-kpmg-blue-500/20 transition-colors"
                  placeholder="Brief description of the client"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-kpmg-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
                  className="w-full px-4 py-3 rounded-xl border border-kpmg-gray-300 focus:border-kpmg-blue-500 focus:ring-2 focus:ring-kpmg-blue-500/20 transition-colors"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 text-kpmg-gray-700 hover:text-kpmg-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-kpmg-blue-600 hover:bg-kpmg-blue-700 text-white rounded-xl transition-colors"
                >
                  {editingId ? 'Update' : 'Add'} Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md shadow-strong border border-kpmg-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-error-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-error-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-kmpg-gray-900">Delete Client</h3>
                <p className="text-kmpg-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-kmpg-gray-700 mb-6">
              Are you sure you want to delete this client? All associated SEMA data, including stakeholders, 
              assessments, and reports will be permanently deleted.
            </p>

            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-6 py-2 text-kpmg-gray-700 hover:text-kpmg-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-6 py-2 bg-error-600 hover:bg-error-700 text-white rounded-xl transition-colors"
              >
                Delete Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;