import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DebtItem, WorkSession, Summary, ChartData } from '../types';
import { addDays, format, parseISO } from 'date-fns';

interface DebtState {
  debtItems: DebtItem[];
  workSessions: WorkSession[];
  isEditingDebt: string | null;
  isEditingWork: string | null;
  
  // Actions
  addDebtItem: (item: Omit<DebtItem, 'id'>) => void;
  updateDebtItem: (id: string, item: Omit<DebtItem, 'id'>) => void;
  deleteDebtItem: (id: string) => void;
  
  addWorkSession: (session: Omit<WorkSession, 'id' | 'amountApplied'>) => void;
  updateWorkSession: (id: string, session: Omit<WorkSession, 'id' | 'amountApplied'>) => void;
  deleteWorkSession: (id: string) => void;
  
  setEditingDebt: (id: string | null) => void;
  setEditingWork: (id: string | null) => void;
  
  // Calculations
  getSummary: () => Summary;
  getChartData: () => ChartData;
}

export const useDebtStore = create<DebtState>()(
  persist(
    (set, get) => ({
      debtItems: [],
      workSessions: [],
      isEditingDebt: null,
      isEditingWork: null,
      
      addDebtItem: (item) => {
        const newItem = {
          ...item,
          id: crypto.randomUUID(),
        };
        
        set((state) => ({
          debtItems: [...state.debtItems, newItem]
        }));
      },
      
      updateDebtItem: (id, item) => {
        set((state) => ({
          debtItems: state.debtItems.map((debt) => 
            debt.id === id ? { ...debt, ...item } : debt
          ),
          isEditingDebt: null,
        }));
      },
      
      deleteDebtItem: (id) => {
        set((state) => ({
          debtItems: state.debtItems.filter((debt) => debt.id !== id)
        }));
      },
      
      addWorkSession: (session) => {
        const hourlyRate = 40;
        const repaymentPercentage = session.fullPayment ? 1.0 : 0.35;
        const amountApplied = session.hours * hourlyRate * repaymentPercentage;
        
        const newSession = {
          ...session,
          id: crypto.randomUUID(),
          amountApplied,
        };
        
        set((state) => ({
          workSessions: [...state.workSessions, newSession]
        }));
      },
      
      updateWorkSession: (id, session) => {
        const hourlyRate = 40;
        const repaymentPercentage = session.fullPayment ? 1.0 : 0.35;
        const amountApplied = session.hours * hourlyRate * repaymentPercentage;
        
        set((state) => ({
          workSessions: state.workSessions.map((work) => 
            work.id === id 
              ? { ...work, ...session, amountApplied } 
              : work
          ),
          isEditingWork: null,
        }));
      },
      
      deleteWorkSession: (id) => {
        set((state) => ({
          workSessions: state.workSessions.filter((work) => work.id !== id)
        }));
      },
      
      setEditingDebt: (id) => {
        set({ isEditingDebt: id });
      },
      
      setEditingWork: (id) => {
        set({ isEditingWork: id });
      },
      
      getSummary: () => {
        const state = get();
        const totalDebt = state.debtItems.reduce(
          (sum, item) => sum + item.amount, 0
        );
        
        const totalPaid = state.workSessions.reduce(
          (sum, session) => sum + session.amountApplied, 0
        );
        
        return {
          totalDebt,
          totalPaid,
          remainingBalance: totalDebt - totalPaid
        };
      },
      
      getChartData: () => {
        const state = get();
        const allDates = new Set<string>();
        
        // Collect all dates from both debt items and work sessions
        state.debtItems.forEach(item => allDates.add(item.date));
        state.workSessions.forEach(session => allDates.add(session.date));
        
        // Sort dates chronologically
        const sortedDates = Array.from(allDates).sort((a, b) => 
          parseISO(a).getTime() - parseISO(b).getTime()
        );
        
        if (sortedDates.length === 0) {
          return { labels: [], debt: [], repayment: [] };
        }
        
        const labels: string[] = [];
        const debt: number[] = [];
        const repayment: number[] = [];
        
        let cumulativeDebt = 0;
        let cumulativeRepayment = 0;
        
        sortedDates.forEach(date => {
          // Add any debt from this date
          const newDebt = state.debtItems
            .filter(item => item.date === date)
            .reduce((sum, item) => sum + item.amount, 0);
          
          cumulativeDebt += newDebt;
          
          // Add any repayment from this date
          const newRepayment = state.workSessions
            .filter(session => session.date === date)
            .reduce((sum, session) => sum + session.amountApplied, 0);
          
          cumulativeRepayment += newRepayment;
          
          // Add data point
          labels.push(format(parseISO(date), 'MMM d, yyyy'));
          debt.push(cumulativeDebt);
          repayment.push(cumulativeRepayment);
        });
        
        return { labels, debt, repayment };
      }
    }),
    {
      name: 'debt-tracker-storage',
    }
  )
);