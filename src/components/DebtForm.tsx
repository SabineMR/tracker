import React, { useState, useEffect } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { useDebtStore } from '../store/debtStore';
import { DebtItem } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface DebtFormProps {
  isEditing?: boolean;
}

const DebtForm: React.FC<DebtFormProps> = ({ isEditing = false }) => {
  const { 
    addDebtItem, 
    updateDebtItem, 
    isEditingDebt, 
    setEditingDebt,
    debtItems 
  } = useDebtStore();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  // Handle editing mode
  useEffect(() => {
    if (isEditingDebt) {
      const item = debtItems.find(debt => debt.id === isEditingDebt);
      if (item) {
        setDescription(item.description);
        setAmount(item.amount.toString());
        setDate(item.date);
      }
    }
  }, [isEditingDebt, debtItems]);
  
  const resetForm = () => {
    setDescription('');
    setAmount('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast.error('Please provide a description');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    const debtData: Omit<DebtItem, 'id'> = {
      description: description.trim(),
      amount: parseFloat(amount),
      date
    };
    
    if (isEditingDebt) {
      updateDebtItem(isEditingDebt, debtData);
      toast.success('Debt item updated');
    } else {
      addDebtItem(debtData);
      toast.success('Debt item added');
      resetForm();
    }
  };
  
  const cancelEditing = () => {
    setEditingDebt(null);
    resetForm();
  };
  
  return (
    <div className="card mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <PlusCircle size={20} className="mr-2 text-primary-600" />
          {isEditingDebt ? 'Edit Debt Item' : 'Add New Debt'}
        </h2>
        {isEditingDebt && (
          <button 
            onClick={cancelEditing}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="description" className="label">Description</label>
            <input
              type="text"
              id="description"
              className="input"
              placeholder="e.g., Bail money"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="amount" className="label">Amount ($)</label>
            <input
              type="number"
              id="amount"
              className="input"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="date" className="label">Date</label>
            <input
              type="date"
              id="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          {isEditingDebt && (
            <button 
              type="button" 
              onClick={cancelEditing}
              className="btn-secondary mr-2"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary">
            {isEditingDebt ? 'Update Debt' : 'Add Debt'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DebtForm;