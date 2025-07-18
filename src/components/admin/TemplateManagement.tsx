import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FileText, AlertTriangle, Eye } from 'lucide-react';
import { templateService, QuestionnaireTemplate, Topic } from '../../lib/supabase';
import { useClient } from '../../contexts/ClientContext';
import { useToast } from '../ui/ToastContainer';

const TemplateManagement = () => {
  const { activeClient } = useClient();
  const { showToast } = useToast();
  const [templates, setTemplates] = useState<QuestionnaireTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showTopicsModal, setShowTopicsModal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    topics: [] as Topic[]
  });

  // Load templates on component mount and when client changes
  useEffect(() => {
    let isMounted = true;
    
    const loadTemplatesEffect = async () => {
      if (!activeClient || !isMounted) {
        setTemplates([]);
        setLoading(false);
        return;
      }

      // Check if we're in demo mode or using local client
      if (activeClient.id === 'demo' || activeClient.id.startsWith('client_')) {
        console.log('Demo/local client detected, skipping template load');
        setTemplates([]);
        setLoading(false);
        setLoadError(null);
        return;
      }

      try {
        setLoading(true);
        setLoadError(null);
        console.log('Loading templates for client:', activeClient.id);
        
        const data = await templateService.getTemplates(activeClient.id);
        
        if (isMounted) {
          console.log('Templates loaded:', data);
          setTemplates(data || []);
        }
      } catch (error) {
        console.error('Error loading templates:', error);
        if (isMounted) {
          setTemplates([]);
          setLoadError(error.message || 'Failed to load templates');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTemplatesEffect();

    return () => {
      isMounted = false;
    };
  }, [activeClient?.id]); // Only depend on activeClient.id, not the entire object

  const loadTemplates = async () => {
    if (!activeClient || activeClient.id === 'demo' || activeClient.id.startsWith('client_')) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setLoadError(null);
      console.log('Loading templates for client:', activeClient?.id);
      
      const data = await templateService.getTemplates(activeClient.id);
      console.log('Templates loaded:', data);
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates([]);
      setLoadError(error.message || 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Template name is required.'
      });
      return;
    }

    if (formData.topics.length === 0) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'At least one topic is required.'
      });
      return;
    }

    // Check if we're working with a demo or local client
    if (!activeClient || activeClient.id === 'demo' || activeClient.id.startsWith('client_')) {
      showToast({
        type: 'warning',
        title: 'Demo Mode',
        message: 'Templates cannot be saved in demo mode. Please connect to Supabase to save templates.'
      });
      return;
    }
    
    try {
      if (editingId) {
        await templateService.updateTemplate(editingId, {
          name: formData.name,
          topics: formData.topics
        });
        showToast({
          type: 'success',
          title: 'Template Updated',
          message: `${formData.name} has been updated successfully.`
        });
      } else {
        await templateService.createTemplate({
          name: formData.name,
          topics: formData.topics,
          client_id: activeClient.id
        });
        showToast({
          type: 'success',
          title: 'Template Created',
          message: `${formData.name} has been created successfully.`
        });
      }
      
      await loadTemplates();
      handleCancel();
    } catch (error) {
      console.error('Error saving template:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to save template. Please try again.'
      });
    }
  };

  const handleEdit = (template: QuestionnaireTemplate) => {
    setFormData({
      name: template.name,
      topics: template.topics
    });
    setEditingId(template.id);
    setShowForm(true);
  };

  const handleDelete = async (templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId);
      await templateService.deleteTemplate(templateId);
      showToast({
        type: 'success',
        title: 'Template Deleted',
        message: `${template?.name} has been deleted successfully.`
      });
      await loadTemplates();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting template:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete template. Please try again.'
      });
      setShowDeleteConfirm(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      topics: []
    });
  };

  const addTopic = () => {
    const newTopic: Topic = {
      id: `topic_${Date.now()}`,
      name: '',
      description: '',
      category: 'Economic'
    };
    setFormData({
      ...formData,
      topics: [...formData.topics, newTopic]
    });
  };

  const updateTopic = (index: number, field: keyof Topic, value: string) => {
    const updatedTopics = [...formData.topics];
    updatedTopics[index] = { ...updatedTopics[index], [field]: value };
    setFormData({ ...formData, topics: updatedTopics });
  };

  const removeTopic = (index: number) => {
    const updatedTopics = formData.topics.filter((_, i) => i !== index);
    setFormData({ ...formData, topics: updatedTopics });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Economic': return 'bg-blue-100 text-blue-800';
      case 'Environmental': return 'bg-green-100 text-green-800';
      case 'Social': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  // Early return for demo/local clients
  if (!activeClient || activeClient.id === 'demo' || activeClient.id.startsWith('client_')) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold text-kpmg-gray-900">Template Management</h4>
            <p className="text-kpmg-gray-600 mt-1">Create and manage questionnaire templates</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-kpmg-orange-100 text-kpmg-orange-800">
                Demo Mode - Templates require Supabase connection
              </span>
            </div>
          </div>
        </div>

        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-kpmg-gray-400 mx-auto mb-4" />
          <h5 className="text-lg font-medium text-kpmg-gray-900 mb-2">Templates Not Available</h5>
          <p className="text-kpmg-gray-600 mb-4">
            Templates require a Supabase database connection. Connect to Supabase to create and manage templates.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold text-kpmg-gray-900">Template Management</h4>
            <p className="text-kpmg-gray-600 mt-1">Loading templates...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-kpmg-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold text-kmpg-gray-900">Template Management</h4>
            <p className="text-kmpg-gray-600 mt-1">Error loading templates</p>
          </div>
        </div>
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-error-500 mx-auto mb-4" />
          <h5 className="text-lg font-medium text-kmpg-gray-900 mb-2">Failed to Load Templates</h5>
          <p className="text-kmpg-gray-600 mb-4">{loadError}</p>
          <button
            onClick={() => loadTemplates()}
            className="bg-kmpg-blue-600 hover:bg-kmpg-blue-700 text-white px-6 py-2 rounded-xl transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xl font-bold text-kpmg-gray-900">Template Management</h4>
          <p className="text-kpmg-gray-600 mt-1">Create and manage questionnaire templates</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-kpmg-blue-600 hover:bg-kpmg-blue-700 text-white px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Template</span>
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-kpmg-gray-200 hover:shadow-medium transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-kpmg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-kpmg-blue-600" />
                </div>
                <div>
                  <h5 className="font-bold text-kpmg-gray-900">{template.name}</h5>
                  <p className="text-sm text-kpmg-gray-600">{template.topics.length} topics</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setShowTopicsModal(template.id)}
                  className="p-2 text-kpmg-gray-600 hover:bg-kpmg-gray-50 rounded-lg transition-colors"
                  title="View topics"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(template)}
                  className="p-2 text-kpmg-blue-600 hover:bg-kpmg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(template.id)}
                  className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-kpmg-gray-600">Economic:</span>
                <span className="font-medium">{template.topics.filter(t => t.category === 'Economic').length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-kpmg-gray-600">Environmental:</span>
                <span className="font-medium">{template.topics.filter(t => t.category === 'Environmental').length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-kpmg-gray-600">Social:</span>
                <span className="font-medium">{template.topics.filter(t => t.category === 'Social').length}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-kpmg-gray-200">
              <span className="text-xs text-kpmg-gray-500">
                Created: {new Date(template.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-kpmg-gray-400 mx-auto mb-4" />
          <h5 className="text-lg font-medium text-kpmg-gray-900 mb-2">No Templates Yet</h5>
          <p className="text-kpmg-gray-600 mb-4">
            Create your first questionnaire template to get started
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-kpmg-blue-600 hover:bg-kpmg-blue-700 text-white px-6 py-2 rounded-xl transition-colors"
          >
            Create First Template
          </button>
        </div>
      )}

      {/* Create/Edit Template Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-kpmg-gray-200">
              <h3 className="text-xl font-bold text-kpmg-gray-900">
                {editingId ? 'Edit Template' : 'Create New Template'}
              </h3>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-kpmg-gray-700 mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-kpmg-gray-300 focus:border-kpmg-blue-500 focus:ring-2 focus:ring-kpmg-blue-500/20 transition-colors"
                    placeholder="Enter template name"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-kpmg-gray-700">
                      Topics *
                    </label>
                    <button
                      type="button"
                      onClick={addTopic}
                      className="flex items-center space-x-2 bg-kpmg-blue-600 hover:bg-kpmg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Topic</span>
                    </button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {formData.topics.map((topic, index) => (
                      <div key={topic.id} className="bg-kpmg-gray-50 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h6 className="font-medium text-kpmg-gray-900">Topic {index + 1}</h6>
                          <button
                            type="button"
                            onClick={() => removeTopic(index)}
                            className="text-error-600 hover:bg-error-50 p-1 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-kpmg-gray-700 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              value={topic.name}
                              onChange={(e) => updateTopic(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-kpmg-gray-300 focus:border-kpmg-blue-500 focus:ring-1 focus:ring-kpmg-blue-500/20 transition-colors"
                              placeholder="Topic name"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-kpmg-gray-700 mb-1">
                              Category
                            </label>
                            <select
                              value={topic.category}
                              onChange={(e) => updateTopic(index, 'category', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-kpmg-gray-300 focus:border-kpmg-blue-500 focus:ring-1 focus:ring-kpmg-blue-500/20 transition-colors"
                            >
                              <option value="Economic">Economic</option>
                              <option value="Environmental">Environmental</option>
                              <option value="Social">Social</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-kpmg-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={topic.description}
                            onChange={(e) => updateTopic(index, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-kpmg-gray-300 focus:border-kpmg-blue-500 focus:ring-1 focus:ring-kpmg-blue-500/20 transition-colors"
                            placeholder="Topic description"
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {formData.topics.length === 0 && (
                    <div className="text-center py-8 bg-kpmg-gray-50 rounded-xl">
                      <FileText className="w-8 h-8 text-kpmg-gray-400 mx-auto mb-2" />
                      <p className="text-kpmg-gray-600">No topics added yet. Click "Add Topic" to get started.</p>
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-kpmg-gray-200 flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-kpmg-gray-700 hover:text-kpmg-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-kpmg-blue-600 hover:bg-kpmg-blue-700 text-white rounded-xl transition-colors"
              >
                {editingId ? 'Update' : 'Create'} Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Topics Modal */}
      {showTopicsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-kpmg-gray-200">
              <h3 className="text-xl font-bold text-kpmg-gray-900">
                {templates.find(t => t.id === showTopicsModal)?.name} - Topics
              </h3>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              <div className="space-y-4">
                {templates.find(t => t.id === showTopicsModal)?.topics.map((topic, index) => (
                  <div key={topic.id} className="bg-kpmg-gray-50 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h6 className="font-medium text-kpmg-gray-900">{topic.name}</h6>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(topic.category)}`}>
                        {topic.category}
                      </span>
                    </div>
                    <p className="text-sm text-kpmg-gray-600">{topic.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-kpmg-gray-200 flex items-center justify-end">
              <button
                onClick={() => setShowTopicsModal(null)}
                className="px-6 py-2 bg-kpmg-gray-600 hover:bg-kpmg-gray-700 text-white rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-error-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-error-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-kpmg-gray-900">Delete Template</h3>
                <p className="text-kpmg-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-kpmg-gray-700 mb-6">
              Are you sure you want to delete this template? All associated questionnaire instances and responses will also be deleted.
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
                Delete Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManagement;