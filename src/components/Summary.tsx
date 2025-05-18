import React from 'react';
import { ArrowDownCircle, ArrowUpCircle, PieChart } from 'lucide-react';
import { useDebtStore } from '../store/debtStore';
import { formatCurrency } from '../utils/formatters';

const Summary: React.FC = () => {
  const summary = useDebtStore(state => state.getSummary());
  
  // Calculate percentage paid
  const percentagePaid = summary.totalDebt > 0 
    ? (summary.totalPaid / summary.totalDebt) * 100 
    : 0;
  
  return (
    <div className="card mb-6 animate-slide-up">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <PieChart size={20} className="mr-2 text-primary-600" /> 
        Financial Summary
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-1">
            <ArrowUpCircle className="mr-2 text-error-500" size={18} />
            <span className="text-sm font-medium text-gray-500">Total Debt</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalDebt)}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-1">
            <ArrowDownCircle className="mr-2 text-success-500" size={18} />
            <span className="text-sm font-medium text-gray-500">Total Paid</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalPaid)}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-1">
            <span className="w-4 h-4 rounded-full bg-primary-600 mr-2 flex-shrink-0"></span>
            <span className="text-sm font-medium text-gray-500">Remaining Balance</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.remainingBalance)}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-gray-500">Payment Progress</span>
          <span className="text-xs font-medium text-gray-700">{percentagePaid.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-success-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(percentagePaid, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Summary;