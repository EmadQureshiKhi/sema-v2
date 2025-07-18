import React, { useState } from 'react';
import { Settings, Users, FileText, Database, Shield, Bell, RefreshCw, Download, Building2 } from 'lucide-react';
import ClientManagement from './admin/ClientManagement';
import TemplateManagement from './admin/TemplateManagement';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'templates' | 'data' | 'clients'>('general');

  const tabs = [
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'clients', label: 'Client Management', icon: Building2 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'data', label: 'Data Management', icon: Database }
  ];

  const GeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-4">SEMA Configuration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Materiality Threshold (External)
            </label>
            <input
              type="range"
              min="5"
              max="9"
              step="0.1"
              defaultValue="7"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>5.0</span>
              <span className="font-medium">7.0</span>
              <span>9.0</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Materiality Threshold (Internal)
            </label>
            <input
              type="range"
              min="8"
              max="15"
              step="1"
              defaultValue="10"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>8</span>
              <span className="font-medium">10</span>
              <span>15</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-4">Sample Size Parameters</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Default Confidence Level
            </label>
            <select className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500">
              <option value="90">90%</option>
              <option value="95">95%</option>
              <option value="99">99%</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Default Margin of Error
            </label>
            <select className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500">
              <option value="5">5%</option>
              <option value="10">10%</option>
              <option value="15">15%</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Population Proportion
            </label>
            <select className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500">
              <option value="0.3">0.3 (Conservative)</option>
              <option value="0.5">0.5 (Maximum Variance)</option>
              <option value="0.7">0.7 (Optimistic)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const UserManagement = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-slate-900">User Roles & Permissions</h4>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add User
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-3 font-medium text-slate-700">Name</th>
                <th className="text-left p-3 font-medium text-slate-700">Email</th>
                <th className="text-left p-3 font-medium text-slate-700">Role</th>
                <th className="text-left p-3 font-medium text-slate-700">Last Active</th>
                <th className="text-left p-3 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'Admin', lastActive: '2 hours ago' },
                { name: 'Michael Chen', email: 'michael.chen@company.com', role: 'Analyst', lastActive: '1 day ago' },
                { name: 'Emma Wilson', email: 'emma.wilson@company.com', role: 'Viewer', lastActive: '3 days ago' }
              ].map((user, index) => (
                <tr key={index} className="border-b border-slate-200">
                  <td className="p-3 font-medium text-slate-900">{user.name}</td>
                  <td className="p-3 text-slate-600">{user.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'Analyst' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{user.lastActive}</td>
                  <td className="p-3">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-4">Role Permissions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { role: 'Admin', permissions: ['Full Access', 'User Management', 'System Config', 'Data Export'] },
            { role: 'Analyst', permissions: ['SEMA Process', 'Data Analysis', 'Report Generation', 'View Only Admin'] },
            { role: 'Viewer', permissions: ['View Reports', 'Download Results', 'Basic Analytics', 'No Edit Access'] }
          ].map((roleInfo, index) => (
            <div key={index} className="bg-slate-50 rounded-lg p-4">
              <h5 className="font-medium text-slate-900 mb-3">{roleInfo.role}</h5>
              <ul className="space-y-2">
                {roleInfo.permissions.map((permission, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-slate-600">{permission}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TemplateManagement = () => (
    <TemplateManagement />
  );

  const DataManagement = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-4">Data Operations</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Database className="w-6 h-6 text-blue-600" />
              <h5 className="font-medium text-slate-900">Backup Data</h5>
            </div>
            <p className="text-sm text-slate-600 mb-4">Create a full backup of all SEMA data</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Create Backup
            </button>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <RefreshCw className="w-6 h-6 text-green-600" />
              <h5 className="font-medium text-slate-900">Reset Process</h5>
            </div>
            <p className="text-sm text-slate-600 mb-4">Start a new SEMA process cycle</p>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Reset Process
            </button>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Download className="w-6 h-6 text-purple-600" />
              <h5 className="font-medium text-slate-900">Export All</h5>
            </div>
            <p className="text-sm text-slate-600 mb-4">Export complete dataset</p>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Export Data
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-4">System Statistics</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">2.3GB</div>
            <div className="text-sm text-slate-600">Total Data Size</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">1,247</div>
            <div className="text-sm text-slate-600">Total Records</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">18</div>
            <div className="text-sm text-slate-600">Active Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">99.8%</div>
            <div className="text-sm text-slate-600">System Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Admin Panel</h2>
          <p className="text-slate-600 mt-2">System configuration and management</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="text-sm text-slate-600">3 notifications</span>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200">
        <div className="flex border-b border-slate-200">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'clients' && <ClientManagement />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'templates' && <TemplateManagement />}
          {activeTab === 'data' && <DataManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;