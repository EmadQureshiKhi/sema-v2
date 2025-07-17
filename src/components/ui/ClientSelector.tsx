import React, { useState } from 'react';
import { ChevronDown, Building2, Sparkles } from 'lucide-react';
import { useClient } from '../../contexts/ClientContext';

const ClientSelector = () => {
  const { clients, activeClient, setActiveClient, isLoading } = useClient();
  const [isOpen, setIsOpen] = useState(false);

  const handleClientSelect = (client: any) => {
    setActiveClient(client);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm border border-kpmg-gray-200 rounded-xl px-4 py-2 hover:bg-white hover:shadow-medium transition-all duration-200 min-w-[200px]"
      >
        <div className="flex items-center space-x-2 flex-1">
          {activeClient?.isDemo ? (
            <Sparkles className="w-4 h-4 text-kpmg-orange-500" />
          ) : (
            <Building2 className="w-4 h-4 text-kpmg-blue-600" />
          )}
          <div className="text-left">
            <div className="font-medium text-kpmg-gray-900 text-sm">
              {isLoading ? 'Loading...' : activeClient?.name || 'Select Client'}
            </div>
            {activeClient?.isDemo && (
              <div className="text-xs text-kpmg-orange-600">Demo Mode</div>
            )}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-kpmg-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-kpmg-gray-200 rounded-xl shadow-strong z-50 max-h-64 overflow-y-auto">
          {clients.map((client) => (
            <button
              key={client.id}
              onClick={() => handleClientSelect(client)}
              className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-kpmg-gray-50 transition-colors text-left ${
                activeClient?.id === client.id ? 'bg-kpmg-blue-50 border-r-2 border-kpmg-blue-600' : ''
              }`}
            >
              {client.isDemo ? (
                <Sparkles className="w-4 h-4 text-kpmg-orange-500" />
              ) : (
                <Building2 className="w-4 h-4 text-kpmg-blue-600" />
              )}
              <div className="flex-1">
                <div className="font-medium text-kpmg-gray-900 text-sm">{client.name}</div>
                {client.description && (
                  <div className="text-xs text-kpmg-gray-600">{client.description}</div>
                )}
                {client.isDemo && (
                  <div className="text-xs text-kpmg-orange-600 font-medium">Demo Organization</div>
                )}
              </div>
              {activeClient?.id === client.id && (
                <div className="w-2 h-2 bg-kpmg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientSelector;