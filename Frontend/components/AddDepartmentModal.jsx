import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const DEPARTMENT_OPTIONS = [
  'Engineering',
  'Sales',
  'HR',
  'Marketing',
  'Finance',
  'Support',
];

export default function AddDepartmentModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name) {
      toast.error('Please select a department');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/departments/create', { name });
      toast.success('✅ Department created');
      onSuccess(res.data);
      onClose();
      setName('');
    } catch (err) {
      toast.error(err.response?.data?.error || '❌ Failed to create department');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-40 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-6 rounded-2xl shadow-2xl w-full max-w-md text-gray-800">
        <h2 className="text-2xl font-bold mb-5 text-center text-slate-700">
          Add New Department
        </h2>

        <select
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6"
        >
          <option value="">-- Select Department --</option>
          {DEPARTMENT_OPTIONS.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
