import React, { useState, useEffect } from 'react';
import ServiceManagement from '../components/admin/ServiceManagement';
import TimeSlotManagement from '../components/admin/TimeSlotManagement';
import HolidayManagement from '../components/admin/HolidayManagement';
import StaffManagement from '../components/admin/StaffManagement';
import type { Service, Staff } from '../types';

interface TimeSlot {
  id: number;
  start: string;
  end: string;
}

interface Holiday {
  id: number;
  start: string;
  end: string;
}

const AdminDashboard: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const savedServices = JSON.parse(localStorage.getItem('services') || '[]');
    const savedStaff = JSON.parse(localStorage.getItem('staff') || '[]');
    const savedTimeSlots = JSON.parse(localStorage.getItem('timeSlots') || '[]');
    const savedHolidays = JSON.parse(localStorage.getItem('holidays') || '[]');
    
    setServices(savedServices);
    setStaff(savedStaff);
    setTimeSlots(savedTimeSlots);
    setHolidays(savedHolidays);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Beauty_place' && password === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('Identifiants incorrects');
    }
  };

  const handleAddService = (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: Date.now() };
    const updatedServices = [...services, newService];
    setServices(updatedServices);
    localStorage.setItem('services', JSON.stringify(updatedServices));
  };

  const handleToggleService = (id: number) => {
    const updatedServices = services.map(service =>
      service.id === id ? { ...service, paused: !service.paused } : service
    );
    setServices(updatedServices);
    localStorage.setItem('services', JSON.stringify(updatedServices));
  };

  const handleDeleteService = (id: number) => {
    const updatedServices = services.filter(service => service.id !== id);
    setServices(updatedServices);
    localStorage.setItem('services', JSON.stringify(updatedServices));
  };

  const handleAddStaff = (newStaff: Omit<Staff, 'id'>) => {
    const staffMember = { ...newStaff, id: Date.now() };
    const updatedStaff = [...staff, staffMember];
    setStaff(updatedStaff);
    localStorage.setItem('staff', JSON.stringify(updatedStaff));
  };

  const handleUpdateStaffCategories = (staffId: number, categories: string[]) => {
    const updatedStaff = staff.map(member =>
      member.id === staffId ? { ...member, categories } : member
    );
    setStaff(updatedStaff);
    localStorage.setItem('staff', JSON.stringify(updatedStaff));
  };

  const handleDeleteStaff = (id: number) => {
    const updatedStaff = staff.filter(member => member.id !== id);
    setStaff(updatedStaff);
    localStorage.setItem('staff', JSON.stringify(updatedStaff));
  };

  const handleAddTimeSlot = (timeSlot: Omit<TimeSlot, 'id'>) => {
    const newTimeSlot = { ...timeSlot, id: Date.now() };
    const updatedTimeSlots = [...timeSlots, newTimeSlot];
    setTimeSlots(updatedTimeSlots);
    localStorage.setItem('timeSlots', JSON.stringify(updatedTimeSlots));
  };

  const handleUpdateTimeSlot = (id: number, timeSlot: Omit<TimeSlot, 'id'>) => {
    const updatedTimeSlots = timeSlots.map(slot =>
      slot.id === id ? { ...slot, ...timeSlot } : slot
    );
    setTimeSlots(updatedTimeSlots);
    localStorage.setItem('timeSlots', JSON.stringify(updatedTimeSlots));
  };

  const handleDeleteTimeSlot = (id: number) => {
    const updatedTimeSlots = timeSlots.filter(slot => slot.id !== id);
    setTimeSlots(updatedTimeSlots);
    localStorage.setItem('timeSlots', JSON.stringify(updatedTimeSlots));
  };

  const handleAddHoliday = (holiday: Omit<Holiday, 'id'>) => {
    const newHoliday = { ...holiday, id: Date.now() };
    const updatedHolidays = [...holidays, newHoliday];
    setHolidays(updatedHolidays);
    localStorage.setItem('holidays', JSON.stringify(updatedHolidays));
  };

  const handleUpdateHoliday = (id: number, holiday: Omit<Holiday, 'id'>) => {
    const updatedHolidays = holidays.map(h =>
      h.id === id ? { ...h, ...holiday } : h
    );
    setHolidays(updatedHolidays);
    localStorage.setItem('holidays', JSON.stringify(updatedHolidays));
  };

  const handleDeleteHoliday = (id: number) => {
    const updatedHolidays = holidays.filter(holiday => holiday.id !== id);
    setHolidays(updatedHolidays);
    localStorage.setItem('holidays', JSON.stringify(updatedHolidays));
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Connexion Admin</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-2 font-medium text-gray-700">
              Identifiant
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </button>
        </form>
      </div>
    );
  }

  const categories = Array.from(new Set(services.map(service => service.category)));

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Tableau de bord administrateur
      </h1>
      
      <div className="grid grid-cols-1 gap-8">
        <ServiceManagement
          services={services}
          onAddService={handleAddService}
          onToggleService={handleToggleService}
          onDeleteService={handleDeleteService}
        />

        <StaffManagement
          staff={staff}
          categories={categories}
          onAddStaff={handleAddStaff}
          onUpdateStaffCategories={handleUpdateStaffCategories}
          onDeleteStaff={handleDeleteStaff}
        />

        <TimeSlotManagement
          timeSlots={timeSlots}
          onAddTimeSlot={handleAddTimeSlot}
          onUpdateTimeSlot={handleUpdateTimeSlot}
          onDeleteTimeSlot={handleDeleteTimeSlot}
        />

        <HolidayManagement
          holidays={holidays}
          onAddHoliday={handleAddHoliday}
          onUpdateHoliday={handleUpdateHoliday}
          onDeleteHoliday={handleDeleteHoliday}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;