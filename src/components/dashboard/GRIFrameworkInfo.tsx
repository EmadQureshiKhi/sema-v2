import React from 'react';
import Card from '../ui/Card';

const GRIFrameworkInfo = () => {
  const features = [
    {
      title: 'Stakeholder Engagement',
      description: 'Identify, prioritize, and engage key stakeholder groups'
    },
    {
      title: 'Materiality Assessment',
      description: 'Evaluate significance through impact and likelihood'
    },
    {
      title: 'Reporting',
      description: 'Generate GRI-compliant sustainability disclosures'
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-kpmg-blue-600 via-kpmg-blue-700 to-kpmg-teal-600 text-white border-0 shadow-strong relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      <div className="relative">
        <h3 className="text-2xl font-heading font-bold mb-4">GRI 3: Material Topics 2021</h3>
        <p className="text-kpmg-blue-100 mb-8 text-lg leading-relaxed">
          This tool follows the Global Reporting Initiative framework for identifying and prioritizing material topics 
          through comprehensive stakeholder engagement and internal impact assessment.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group">
              <h4 className="font-bold mb-3 text-lg group-hover:scale-105 transition-transform duration-300">
                {feature.title}
              </h4>
              <p className="text-sm text-kpmg-blue-100 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default GRIFrameworkInfo;