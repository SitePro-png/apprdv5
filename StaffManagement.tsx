import React, { useState } from 'react';
import { Plus, Trash, UserPlus } from 'lucide-react';
import type { Staff } from '../../types';

interface StaffManagementProps {
  staff: Staff[];
  categories: string[];
  onAddStaff: (staff: Omit<Staff, 'id'>) => void;
  onUpdateStaffCategories: (staffId: number, categories: string[]) => void;
  onDeleteStaff: (id: number) => void;
}

const StaffManagement: React.FC<StaffManagementProps> = ({
  staff,
  categories,
  onAddStaff,
  onUpdateStaffCategories,
  onDeleteStaff
}) => {
  const [newStaffName, setNewStaffName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStaffName.trim()) {
      onAddStaff({
        name: newStaffName.trim(),
        categories: []
      });
      setNewStaffName('');
      setShowAddForm(false);
    }
  };

  const handleAddCategory = (staffId: number, category: string) => {
    const currentStaff = staff.find(s => s.id === staffId);
    if (currentStaff && !currentStaff.categories.includes(category)) {
      onUpdateStaffCategories(staffId, [...currentStaff.categories, category]);
    }
  };

  const handleRemoveCategory = (staffId: number, categoryToRemove: string) => {
    const currentStaff = staff.find(s => s.id === staffId);
    if (currentStaff) {
      onUpdateStaffCategories(
        staffId,
        currentStaff.categories.filter(cat => cat !== categoryToRemove)
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Gestion du personnel</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <UserPlus size={20} className="mr-2" />
          Ajouter un membre
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-4">
            <input
              type="text"
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
              placeholder="Nom du membre"
              className="flex-1 p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Ajouter
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {staff.map((member) => (
          <div key={member.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-gray-800">{member.name}</h3>
              <button
                onClick={() => onDeleteStaff(member.id)}
                className="text-red-600 hover:text-red-800 p-1 rounded"
              >
                <Trash size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600">Catégories :</h4>
              <div className="flex flex-wrap gap-2">
                {member.categories.map((category) => (
                  <span
                    key={category}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {category}
                    <button
                      onClick={() => handleRemoveCategory(member.id, category)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <div className="relative inline-block">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddCategory(member.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="appearance-none bg-gray-100 border border-gray-300 text-gray-700 py-1 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    defaultValue=""
                  >
                    <option value="" disabled>Ajouter une catégorie</option>
                    {categories
                      .filter(cat => !member.categories.includes(cat))
                      .map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <Plus size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffManagement;