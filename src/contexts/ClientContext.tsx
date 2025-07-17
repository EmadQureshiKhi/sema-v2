import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Client {
  id: string;
  name: string;
  logo?: string;
  createdAt: string;
  isDemo: boolean;
  description?: string;
  industry?: string;
  status: 'active' | 'inactive';
}

interface ClientContextType {
  clients: Client[];
  activeClient: Client | null;
  setActiveClient: (client: Client) => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  isLoading: boolean;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};

// Demo client with current test data
const DEMO_CLIENT: Client = {
  id: 'demo',
  name: 'Demo Organization',
  description: 'Sample organization for demonstration purposes',
  industry: 'Technology',
  createdAt: '2024-01-01T00:00:00Z',
  isDemo: true,
  status: 'active'
};

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([DEMO_CLIENT]);
  const [activeClient, setActiveClientState] = useState<Client | null>(DEMO_CLIENT);
  const [isLoading, setIsLoading] = useState(false);

  // Load clients from localStorage on mount
  useEffect(() => {
    const savedClients = localStorage.getItem('sema_clients');
    const savedActiveClient = localStorage.getItem('sema_active_client');
    
    if (savedClients) {
      const parsedClients = JSON.parse(savedClients);
      // Always ensure demo client exists
      const clientsWithDemo = parsedClients.find((c: Client) => c.id === 'demo') 
        ? parsedClients 
        : [DEMO_CLIENT, ...parsedClients];
      setClients(clientsWithDemo);
    }
    
    if (savedActiveClient) {
      const parsedActiveClient = JSON.parse(savedActiveClient);
      setActiveClientState(parsedActiveClient);
    }
  }, []);

  // Save to localStorage whenever clients or activeClient changes
  useEffect(() => {
    localStorage.setItem('sema_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    if (activeClient) {
      localStorage.setItem('sema_active_client', JSON.stringify(activeClient));
    }
  }, [activeClient]);

  const setActiveClient = (client: Client) => {
    setIsLoading(true);
    // Simulate loading time for client switch
    setTimeout(() => {
      setActiveClientState(client);
      setIsLoading(false);
    }, 500);
  };

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: `client_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    setClients(prev => [...prev, newClient]);
    
    // Initialize empty data for new client
    initializeClientData(newClient.id);
    
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(client => 
      client.id === id ? { ...client, ...updates } : client
    ));
    
    // Update active client if it's the one being updated
    if (activeClient?.id === id) {
      setActiveClientState(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteClient = (id: string) => {
    if (id === 'demo') {
      throw new Error('Cannot delete demo client');
    }
    
    setClients(prev => prev.filter(client => client.id !== id));
    
    // Clear client data from localStorage
    clearClientData(id);
    
    // If deleting active client, switch to demo
    if (activeClient?.id === id) {
      setActiveClientState(DEMO_CLIENT);
    }
  };

  const initializeClientData = (clientId: string) => {
    // Initialize empty data structures for new client
    const emptyData = {
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
    
    localStorage.setItem(`sema_data_${clientId}`, JSON.stringify(emptyData));
  };

  const clearClientData = (clientId: string) => {
    localStorage.removeItem(`sema_data_${clientId}`);
  };

  return (
    <ClientContext.Provider value={{
      clients,
      activeClient,
      setActiveClient,
      addClient,
      updateClient,
      deleteClient,
      isLoading
    }}>
      {children}
    </ClientContext.Provider>
  );
};