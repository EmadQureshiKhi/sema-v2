import React from 'react';
import { 
  Users, 
  Handshake, 
  Newspaper, 
  ShoppingCart, 
  Briefcase, 
  Building2, 
  Factory, 
  Heart, 
  Scale, 
  Truck, 
  Gavel, 
  Shield 
} from 'lucide-react';
import Card from '../ui/Card';

const StakeholderDescriptions = () => {
  const stakeholderGroups = [
    {
      id: 1,
      name: "Shareholders and other Investors",
      description: "As partial owners, they provide guidance and decisions around all key dimensions of an organization's activities, including ESG. Their interests and concerns are of paramount importance since they can influence business decisions, strategic direction, funding, and investment, and demand accountability from organizational stakeholders.",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      id: 2,
      name: "Business Partners",
      description: "These are entities with which the organization has some level of direct and formal engagement for the purpose of meeting its business objectives, and may include lenders, insurers, industry associations, networks & memberships, B2B customers, or JV partners.",
      icon: Handshake,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      id: 3,
      name: "Civil Society Organizations",
      description: "They are key partners in our CSR initiatives and may have a role in deciding the funds allocations and project implementation; they also impact overall brand image as they influence other stakeholders through media, publications, lobbying, etc. Includes media, intergovernmental organizations, multilateral organizations.",
      icon: Newspaper,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    },
    {
      id: 4,
      name: "Consumers",
      description: "Consumers are ultimate users of a product/service even if the company is not directly selling to them. They are becoming increasingly important in informing business decisions and reputational standing.",
      icon: ShoppingCart,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
    {
      id: 5,
      name: "Customers",
      description: "Customers play one of the most integral roles in impacting strategic decisions, branding, and investment/funds allocation.",
      icon: Briefcase,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      textColor: "text-teal-700"
    },
    {
      id: 6,
      name: "Employees and other Workers",
      description: "Employees and workers are an indispensable form of human and social capital within an organization, and their rights and preferences influence policy-making to a significant degree.",
      icon: Users,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700"
    },
    {
      id: 7,
      name: "Government and/or Regulators",
      description: "Governmental stakeholders play a crucial role in maintaining the legal architecture to ensure an overall level playing field, and policies that are conducive to a thriving and competitive market.",
      icon: Building2,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700"
    },
    {
      id: 8,
      name: "Local Communities",
      description: "Local communities provide a crucial contribution to the labor force and towards ensuring uninterrupted plant operations. These also include the communities and regions that might be impacted by company operations and activities due to proximity, and their wellbeing and input need to be taken into account for this reason.",
      icon: Factory,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700"
    },
    {
      id: 9,
      name: "NGOs",
      description: "A crucial implementing arm for an organization's CSR and community-engagement activities.",
      icon: Heart,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-700"
    },
    {
      id: 10,
      name: "Suppliers",
      description: "As critical components of the value chain, suppliers and fluctuations in their operations might critically impact business decisions and outputs.",
      icon: Truck,
      color: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700"
    },
    {
      id: 11,
      name: "Trade Unions",
      description: "Any trade union represents worker interests, and they have substantial influence on the company as they negotiate collective bargaining agreements and can determine worker protection and barriers to hiring new workers.",
      icon: Gavel,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700"
    },
    {
      id: 12,
      name: "Vulnerable Groups",
      description: "This covers any group of individuals that could potentially experience negative impacts as a result of the organization's activities more severely than the general population. It is vital to understand how the company's operations or value chains impacts different vulnerable groups if it is to work on mitigating these impacts.",
      icon: Shield,
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-50",
      textColor: "text-rose-700"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="bg-gradient-to-br from-kpmg-blue-600 via-kpmg-blue-700 to-kpmg-teal-600 rounded-2xl p-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-3xl font-bold mb-1">Stakeholder Group Reference</h3>
                <div className="text-kmpg-blue-100 text-sm font-medium">12 Key Stakeholder Categories</div>
              </div>
            </div>
            
            <p className="text-kmpg-blue-100 text-lg leading-relaxed max-w-4xl mx-auto mb-6">
              Understanding the different stakeholder groups and their importance in the materiality assessment process. 
              Each group plays a unique role in influencing and being affected by organizational decisions.
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white/60 rounded-full"></div>
                <span className="text-kmpg-blue-100">Comprehensive Coverage</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white/60 rounded-full"></div>
                <span className="text-kmpg-blue-100">GRI Framework Aligned</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white/60 rounded-full"></div>
                <span className="text-kmpg-blue-100">Industry Best Practices</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stakeholder Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stakeholderGroups.map((stakeholder) => {
          const Icon = stakeholder.icon;
          return (
            <Card key={stakeholder.id} hover className="group h-full">
              <div className="flex flex-col h-full">
                {/* Header with Icon and Number */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stakeholder.color} flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        #{stakeholder.id.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-slate-700 transition-colors">
                      {stakeholder.name}
                    </h4>
                  </div>
                </div>

                {/* Description */}
                <div className="flex-1">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {stakeholder.description}
                  </p>
                </div>

                {/* Bottom accent */}
                <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${stakeholder.color} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">How to Use This Reference</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              When adding stakeholders to your assessment, refer to these descriptions to ensure you're capturing 
              the right groups and understanding their unique characteristics. Each stakeholder group has different 
              levels of influence and dependency on your organization's activities, which should be reflected in 
              your scoring during the stakeholder management process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeholderDescriptions;