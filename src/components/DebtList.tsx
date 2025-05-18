import React from 'react';
import { BookOpen, Edit, Trash2 } from 'lucide-react';
import { useDebtStore } from '../store/debtStore';
import { formatCurrency } from '../utils/formatters';
import { format, parseISO } from 'date-fns';

const DebtList: React.FC = () => {
  const { debtItems, deleteDebtItem, setEditingDebt } = useDebtStore();
  
  if (debtItems.length === 0) {
    return (
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BookOpen size={20} className="mr-2 text-primary-600" />
          Debt Items
        </h2>
        <div className="py-8 text-center text-gray-500">
          <p>No debt items added yet.</p>
          <p className="text-sm mt-1">Add your first debt item using the form above.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <BookOpen size={20} className="mr-2 text-primary-600" />
        Debt Items
      </h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {debtItems
              .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
              .map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {format(parseISO(item.date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingDebt(item.id)}
                        className="text-primary-600 hover:text-primary-800"
                        aria-label={`Edit ${item.description}`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteDebtItem(item.id)}
                        className="text-error-600 hover:text-error-800"
                        aria-label={`Delete ${item.description}`}
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

export default DebtList;