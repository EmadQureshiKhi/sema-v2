import React, { useState } from 'react';
import { Home, Users, Calculator, FileText, TrendingUp, Settings, ChevronRight, BarChart3, Download, CheckCircle, Menu, X } from 'lucide-react';
import { ToastProvider } from './components/ui/ToastContainer';
import { ClientProvider } from './contexts/ClientContext';
import Card from './components/ui/Card';
import ClientSelector from './components/ui/ClientSelector';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const StakeholderManagement = React.lazy(() => import('./components/StakeholderManagement'));
const SampleSizeCalculator = React.lazy(() => import('./components/SampleSizeCalculator'));
const QuestionnaireEngine = React.lazy(() => import('./components/QuestionnaireEngine'));
const InternalAssessment = React.lazy(() => import('./components/InternalAssessment'));
const MaterialityMatrix = React.lazy(() => import('./components/MaterialityMatrix'));
const ReportingDashboard = React.lazy(() => import('./components/ReportingDashboard'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));

type ModuleType = 'dashboard' | 'stakeholders' | 'sample-size' | 'questionnaire' | 'internal-assessment' | 'materiality-matrix' | 'reporting' | 'admin';

const modules = [
  { id: 'dashboard', name: 'Dashboard', icon: Home, description: 'Overview & Progress' },
  { id: 'stakeholders', name: 'Stakeholder Management', icon: Users, description: 'Score & Prioritize' },
  { id: 'sample-size', name: 'Sample Size Calculator', icon: Calculator, description: 'Statistical Sampling' },
  { id: 'questionnaire', name: 'Questionnaire Engine', icon: FileText, description: 'External Feedback' },
  { id: 'internal-assessment', name: 'Internal Assessment', icon: TrendingUp, description: 'Severity × Likelihood' },
  { id: 'materiality-matrix', name: 'Materiality Matrix', icon: BarChart3, description: 'Visual Analysis' },
  { id: 'reporting', name: 'Reporting Dashboard', icon: Download, description: 'Final Reports' },
  { id: 'admin', name: 'Admin Panel', icon: Settings, description: 'Configuration' }
];

function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleModuleChange = (moduleId: ModuleType) => {
    if (moduleId === activeModule) return;
    setActiveModule(moduleId);
  };

  const renderActiveModule = () => {
    return (
      <React.Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-kpmg-blue-600 border-t-transparent"></div>
        </div>
      }>
        {(() => {
          switch (activeModule) {
            case 'dashboard':
              return <Dashboard />;
            case 'stakeholders':
              return <StakeholderManagement />;
            case 'sample-size':
              return <SampleSizeCalculator />;
            case 'questionnaire':
              return <QuestionnaireEngine />;
            case 'internal-assessment':
              return <InternalAssessment />;
            case 'materiality-matrix':
              return <MaterialityMatrix />;
            case 'reporting':
              return <ReportingDashboard />;
            case 'admin':
              return <AdminPanel />;
            default:
              return <Dashboard />;
          }
        })()}
      </React.Suspense>
    );
  };

  return (
    <ClientProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gradient-to-br from-kpmg-gray-50 via-white to-kpmg-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-kpmg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-kpmg-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-kpmg-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-kpmg-gray-200/50 sticky top-0 z-40 shadow-soft">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-kpmg-blue-600 to-kpmg-blue-700 rounded-2xl flex items-center justify-center shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-105">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-heading font-bold text-kpmg-gray-900 tracking-tight">SEMA Automation</h1>
                  <p className="text-sm text-kpmg-gray-600 font-medium">GRI Framework Integration</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <ClientSelector />
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-sm text-kpmg-gray-600">
                  Progress: <span className="font-bold text-kpmg-blue-600" id="overall-progress">0%</span>
                </div>
                <div className="w-24 bg-kpmg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-kpmg-blue-600 to-kpmg-teal-500 h-2 rounded-full transition-all duration-500" id="progress-bar" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-kpmg-gray-600 font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-white/70 backdrop-blur-sm border-r border-kpmg-gray-200/30 min-h-screen relative`}>
          <div className="p-3 border-b border-kpmg-gray-200/30">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`${sidebarCollapsed ? 'w-10 h-10 rounded-lg bg-kpmg-gray-50 hover:bg-kpmg-gray-100' : 'w-full px-3 py-2 rounded-lg bg-kpmg-gray-50 hover:bg-kpmg-gray-100'} flex items-center justify-center text-kpmg-gray-600 hover:text-kpmg-gray-900 transition-all duration-200 group`}
            >
              <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
              {!sidebarCollapsed && <span className="ml-2 text-xs font-medium">Collapse</span>}
            </button>
          </div>
          
          <nav className={`${sidebarCollapsed ? 'px-2' : 'px-3'} py-3 space-y-1`}>
            {modules.map((module) => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;
              
              return (
                <button
                  key={module.id}
                  onClick={() => handleModuleChange(module.id as ModuleType)}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2 py-3' : 'space-x-3 px-3 py-3'} rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-kpmg-blue-600 to-kpmg-blue-700 text-white shadow-md'
                      : 'text-kpmg-gray-700 hover:bg-kpmg-gray-100 hover:text-kpmg-gray-900'
                  }`}
                  title={sidebarCollapsed ? module.name : ''}
                >
                  <Icon className={`${sidebarCollapsed ? 'w-5 h-5' : 'w-5 h-5'} flex-shrink-0 transition-transform duration-200`} />
                  {sidebarCollapsed ? (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-kpmg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-lg" style={{ zIndex: 99999 }}>
                      {module.name}
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-2 border-b-2 border-r-2 border-transparent border-r-kpmg-gray-900"></div>
                    </div>
                  ) : (
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{module.name}</div>
                      <div className={`text-xs ${isActive ? 'text-kpmg-blue-100' : 'text-kpmg-gray-500'}`}>
                        {module.description}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 relative">
          <div className="animate-fade-in">
            {renderActiveModule()}
          </div>
        </main>
      </div>
        </div>
      </ToastProvider>
    </ClientProvider>
  );
}

export default App;