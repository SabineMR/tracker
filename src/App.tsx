import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Summary from './components/Summary';
import DebtForm from './components/DebtForm';
import DebtList from './components/DebtList';
import WorkSessionForm from './components/WorkSessionForm';
import WorkSessionList from './components/WorkSessionList';
import DebtChart from './components/DebtChart';
import ExportPDF from './components/ExportPDF';
import { useDebtStore } from './store/debtStore';

function App() {
  const { isEditingDebt, isEditingWork } = useDebtStore();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Summary />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <DebtForm isEditing={!!isEditingDebt} />
            <DebtList />
          </div>
          
          {/* Right Column */}
          <div>
            <WorkSessionForm isEditing={!!isEditingWork} />
            <WorkSessionList />
          </div>
        </div>
        
        <DebtChart />
        
        <div className="mt-6 flex justify-center">
          <ExportPDF />
        </div>
      </main>
      
      <footer className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Debt Tracker Dashboard</p>
        </div>
      </footer>
    </div>
  );
}

export default App;