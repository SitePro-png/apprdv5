import React, { useState } from 'react';
import { Calendar, Edit2, Trash } from 'lucide-react';

interface Holiday {
  id: number;
  start: string;
  end: string;
}

interface HolidayManagementProps {
  holidays: Holiday[];
  onAddHoliday: (holiday: Omit<Holiday, 'id'>) => void;
  onUpdateHoliday: (id: number, holiday: Omit<Holiday, 'id'>) => void;
  onDeleteHoliday: (id: number) => void;
}

const HolidayManagement: React.FC<HolidayManagementProps> = ({
  holidays,
  onAddHoliday,
  onUpdateHoliday,
  onDeleteHoliday
}) => {
  const [newHolidayStart, setNewHolidayStart] = useState('');
  const [newHolidayEnd, setNewHolidayEnd] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHolidayStart && newHolidayEnd) {
      if (editingId !== null) {
        onUpdateHoliday(editingId, { start: newHolidayStart, end: newHolidayEnd });
        setEditingId(null);
      } else {
        onAddHoliday({ start: newHolidayStart, end: newHolidayEnd });
      }
      setNewHolidayStart('');
      setNewHolidayEnd('');
    }
  };

  const handleEdit = (holiday: Holiday) => {
    setNewHolidayStart(holiday.start);
    setNewHolidayEnd(holiday.end);
    setEditingId(holiday.id);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Périodes de vacances</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="holidayStart" className="block mb-1 text-sm font-medium text-gray-700">
              Début
            </label>
            <input
              type="date"
              id="holidayStart"
              value={newHolidayStart}
              onChange={(e) => setNewHolidayStart(e.target.value)}
              className="w-full p-2 border rounded bg-gray-50 text-gray-800"
              required
            />
          </div>
          <div>
            <label htmlFor="holidayEnd" className="block mb-1 text-sm font-medium text-gray-700">
              Fin
            </label>
            <input
              type="date"
              id="holidayEnd"
              value={newHolidayEnd}
              onChange={(e) => setNewHolidayEnd(e.target.value)}
              className="w-full p-2 border rounded bg-gray-50 text-gray-800"
              required
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 flex items-center justify-center">
          <Calendar size={20} className="mr-2" />
          {editingId !== null ? 'Modifier la période' : 'Ajouter la période'}
        </button>
      </form>
      <ul className="space-y-2">
        {holidays.map((holiday) => (
          <li key={holiday.id} className="bg-gray-100 p-3 rounded flex justify-between items-center">
            <span className="text-gray-800">
              Du {new Date(holiday.start).toLocaleDateString()} au {new Date(holiday.end).toLocaleDateString()}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(holiday)}
                className="text-blue-600 hover:text-blue-800 p-1 rounded"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => onDeleteHoliday(holiday.id)}
                className="text-red-600 hover:text-red-800 p-1 rounded"
              >
                <Trash size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HolidayManagement;