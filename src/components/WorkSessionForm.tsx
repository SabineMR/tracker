import React, { useState, useEffect } from 'react';
import { ClockIcon, X } from 'lucide-react';
import { useDebtStore } from '../store/debtStore';
import { WorkSession } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';

interface WorkSessionFormProps {
  isEditing?: boolean;
}

const WorkSessionForm: React.FC<WorkSessionFormProps> = ({ isEditing = false }) => {
  const {
    addWorkSession,
    updateWorkSession,
    isEditingWork,
    setEditingWork,
    workSessions
  } = useDebtStore();
  
  const [hours, setHours] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [fullPayment, setFullPayment] = useState(false);
  
  const hourlyRate = 40;
  
  // Handle editing mode
  useEffect(() => {
    if (isEditingWork) {
      const session = workSessions.find(work => work.id === isEditingWork);
      if (session) {
        setHours(session.hours.toString());
        setDate(session.date);
        setFullPayment(session.fullPayment);
      }
    }
  }, [isEditingWork, workSessions]);
  
  const resetForm = () => {
    setHours('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setFullPayment(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hours || parseFloat(hours) <= 0) {
      toast.error('Please enter valid hours');
      return;
    }
    
    const workData: Omit<WorkSession, 'id' | 'amountApplied'> = {
      hours: parseFloat(hours),
      date,
      fullPayment
    };
    
    if (isEditingWork) {
      updateWorkSession(isEditingWork, workData);
      toast.success('Work session updated');
    } else {
      addWorkSession(workData);
      toast.success('Work session added');
      resetForm();
    }
  };
  
  const cancelEditing = () => {
    setEditingWork(null);
    resetForm();
  };
  
  // Calculate amounts for preview
  const hoursNum = parseFloat(hours) || 0;
  const totalEarned = hoursNum * hourlyRate;
  const percentApplied = fullPayment ? 100 : 35;
  const amountApplied = totalEarned * (percentApplied / 100);
  
  return (
    <div className="card mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <ClockIcon size={20} className="mr-2 text-primary-600" />
          {isEditingWork ? 'Edit Work Session' : 'Add Work Session'}
        </h2>
        {isEditingWork && (
          <button
            onClick={cancelEditing}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="hours" className="label">Hours Worked</label>
            <input
              type="number"
              id="hours"
              className="input"
              placeholder="0.0"
              min="0.1"
              step="0.1"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
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
        
        <div className="mt-4">
          <label className="label">Payment Application</label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-primary-600"
                name="paymentType"
                checked={!fullPayment}
                onChange={() => setFullPayment(false)}
              />
              <span className="ml-2">Apply 35% to debt</span>
            </label>
            
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-primary-600"
                name="paymentType"
                checked={fullPayment}
                onChange={() => setFullPayment(true)}
              />
              <span className="ml-2">Apply 100% to debt</span>
            </label>
          </div>
        </div>
        
        {hours && parseFloat(hours) > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200 animate-fade-in">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Preview</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Hourly Rate:</div>
              <div className="text-right font-medium">{formatCurrency(hourlyRate)}/hr</div>
              
              <div>Total Earned:</div>
              <div className="text-right font-medium">{formatCurrency(totalEarned)}</div>
              
              <div>Percentage Applied:</div>
              <div className="text-right font-medium">{percentApplied}%</div>
              
              <div className="font-medium">Amount Applied to Debt:</div>
              <div className="text-right font-bold text-success-700">{formatCurrency(amountApplied)}</div>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          {isEditingWork && (
            <button
              type="button"
              onClick={cancelEditing}
              className="btn-secondary mr-2"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary">
            {isEditingWork ? 'Update Session' : 'Add Session'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkSessionForm;