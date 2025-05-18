import React from 'react';
import { ClipboardList, Edit, Trash2 } from 'lucide-react';
import { useDebtStore } from '../store/debtStore';
import { formatCurrency } from '../utils/formatters';
import { format, parseISO } from 'date-fns';

const WorkSessionList: React.FC = () => {
  const { workSessions, deleteWorkSession, setEditingWork } = useDebtStore();
  
  if (workSessions.length === 0) {
    return (
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <ClipboardList size={20} className="mr-2 text-primary-600" />
          Work Sessions
        </h2>
        <div className="py-8 text-center text-gray-500">
          <p>No work sessions recorded yet.</p>
          <p className="text-sm mt-1">Add work sessions using the form above.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <ClipboardList size={20} className="mr-2 text-primary-600" />
        Work Sessions
      </h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hours
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rate
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                % Applied
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount Applied
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workSessions
              .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
              .map((session) => (
                <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {format(parseISO(session.date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {session.hours} {session.hours === 1 ? 'hour' : 'hours'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                    $40/hr
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                    <span className={`badge ${session.fullPayment ? 'badge-green' : 'badge-amber'}`}>
                      {session.fullPayment ? '100%' : '35%'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                    {formatCurrency(session.amountApplied)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingWork(session.id)}
                        className="text-primary-600 hover:text-primary-800"
                        aria-label={`Edit session from ${session.date}`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteWorkSession(session.id)}
                        className="text-error-600 hover:text-error-800"
                        aria-label={`Delete session from ${session.date}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkSessionList;