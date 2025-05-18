import React from 'react';
import { DollarSign, Scale } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary-950 text-white sticky top-0 z-10 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-800 rounded-md">
            <Scale size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Debt Tracker</h1>
            <p className="text-xs text-primary-200">Balance the books</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center text-sm">
          <DollarSign size={16} className="mr-1 text-success-400" />
          <span>Recovery at $40/hour</span>
        </div>
      </div>
    </header>
  );
};

export default Header;