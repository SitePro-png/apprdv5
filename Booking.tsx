import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { format, addMinutes, isSunday, parseISO, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CreditCard, Calendar, Clock, User } from 'lucide-react';
import type { Service, Staff } from '../types';

interface Holiday {
  start: string;
  end: string;
}

interface Booking {
  service: string;
  category: string;
  staffId?: number;
  date: string;
  slot: string;
  email: string;
  fullName: string;
  price: number;
  paymentType: 'full' | 'deposit';
  paid: boolean;
}

interface TimeSlot {
  id: number;
  start: string;
  end: string;
}

const SLOT_INTERVAL = 15; // minutes entre chaque créneau

const Booking: React.FC = () => {
  const location = useLocation();
  const initialState = location.state as { selectedCategory?: string; selectedService?: string } || {};

  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialState.selectedCategory || '');
  const [selectedService, setSelectedService] = useState(initialState.selectedService || '');
  const [selectedStaffId, setSelectedStaffId] = useState<number | undefined>();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<'full' | 'deposit'>('full');

  useEffect(() => {
    const loadedServices = JSON.parse(localStorage.getItem('services') || '[]');
    const activeServices = loadedServices.filter((service: Service) => !service.paused);
    setServices(activeServices);
    
    const uniqueCategories = Array.from(new Set(activeServices.map((service: Service) => service.category)));
    setCategories(uniqueCategories);

    const loadedStaff = JSON.parse(localStorage.getItem('staff') || '[]');
    setStaff(loadedStaff);

    const loadedHolidays = JSON.parse(localStorage.getItem('holidays') || '[]');
    setHolidays(loadedHolidays);
    
    const loadedTimeSlots = JSON.parse(localStorage.getItem('timeSlots') || '[]');
    setTimeSlots(loadedTimeSlots);
  }, []);

  // Filtrer le personnel disponible pour la catégorie sélectionnée
  const availableStaff = staff.filter(member => 
    member.categories.includes(selectedCategory)
  );

  const isDateInHolidays = (date: Date): boolean => {
    return holidays.some(holiday => {
      const holidayStart = new Date(holiday.start);
      const holidayEnd = new Date(holiday.end);
      return date >= holidayStart && date <= holidayEnd;
    });
  };

  useEffect(() => {
    if (selectedService && selectedDate) {
      const service = services.find(s => s.name === selectedService);
      if (service) {
        setSelectedPrice(service.price);
        const selectedDateObj = new Date(selectedDate);
        
        if (!isSunday(selectedDateObj) && !isDateInHolidays(selectedDateObj)) {
          calculateAvailableSlots(selectedDate, service.duration);
        } else {
          setAvailableSlots([]);
        }
      }
    }
  }, [selectedService, selectedDate, services]);

  const isSlotAvailable = (startTime: Date, endTime: Date, existingBookings: Booking[], selectedDate: string) => {
    return !existingBookings.some(booking => {
      const [bookingStartStr] = booking.slot.split('-');
      const [bookingHours, bookingMinutes] = bookingStartStr.split(':').map(Number);
      
      const bookingStart = new Date(selectedDate);
      bookingStart.setHours(bookingHours, bookingMinutes, 0, 0);
      
      const bookingService = services.find(s => s.name === booking.service);
      if (!bookingService) return false;
      
      const bookingEnd = addMinutes(bookingStart, bookingService.duration);
      
      return (
        (startTime >= bookingStart && startTime < bookingEnd) ||
        (endTime > bookingStart && endTime <= bookingEnd) ||
        (startTime <= bookingStart && endTime >= bookingEnd)
      );
    });
  };

  const calculateAvailableSlots = (date: string, duration: number) => {
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      .filter((booking: Booking) => booking.date === date);
    
    const availableTimeSlots: string[] = [];
    
    timeSlots.forEach(slot => {
      const [startHour, startMinute] = slot.start.split(':').map(Number);
      const [endHour, endMinute] = slot.end.split(':').map(Number);
      
      let currentTime = new Date(date);
      currentTime.setHours(startHour, startMinute, 0, 0);
      
      const slotEndTime = new Date(date);
      slotEndTime.setHours(endHour, endMinute, 0, 0);
      
      while (addMinutes(currentTime, duration) <= slotEndTime) {
        const potentialEndTime = addMinutes(currentTime, duration);
        
        if (isSlotAvailable(currentTime, potentialEndTime, existingBookings, date)) {
          availableTimeSlots.push(
            `${format(currentTime, 'HH:mm')}-${format(potentialEndTime, 'HH:mm')}`
          );
        }
        
        currentTime = addMinutes(currentTime, SLOT_INTERVAL);
      }
    });
    
    setAvailableSlots(availableTimeSlots);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    const selectedDateObj = new Date(date);
    
    if (isSunday(selectedDateObj)) {
      alert('Les réservations ne sont pas possibles le dimanche.');
      return;
    }
    
    if (isDateInHolidays(selectedDateObj)) {
      alert('Cette date correspond à une période de vacances. Les réservations ne sont pas possibles.');
      return;
    }
    
    setSelectedDate(date);
    setSelectedSlot('');
  };

  const handlePaymentSelection = (type: 'full' | 'deposit') => {
    setPaymentType(type);
  };

  const handlePayment = () => {
    const booking = {
      service: selectedService,
      category: selectedCategory,
      staffId: selectedStaffId,
      date: selectedDate,
      slot: selectedSlot,
      email,
      fullName,
      price: selectedPrice,
      paymentType,
      paid: true
    };
    
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existingBookings, booking]));
    
    setShowPaymentModal(false);
    alert('Réservation confirmée ! Un email de confirmation vous sera envoyé.');
    
    // Reset form
    setSelectedCategory('');
    setSelectedService('');
    setSelectedStaffId(undefined);
    setSelectedDate('');
    setSelectedSlot('');
    setEmail('');
    setFullName('');
    setPaymentType('full');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPaymentModal(true);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Réserver un rendez-vous</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded bg-gray-50 text-gray-800"
            required
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
            Service
          </label>
          <select
            id="service"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full p-2 border rounded bg-gray-50 text-gray-800"
            required
            disabled={!selectedCategory}
          >
            <option value="">Sélectionnez un service</option>
            {services
              .filter(service => service.category === selectedCategory)
              .map((service, index) => (
                <option key={index} value={service.name}>{service.name}</option>
              ))}
          </select>
        </div>

        {selectedCategory && availableStaff.length > 0 && (
          <div>
            <label htmlFor="staff" className="block text-sm font-medium text-gray-700 mb-1">
              Préférence personnel (optionnel)
            </label>
            <select
              id="staff"
              value={selectedStaffId || ''}
              onChange={(e) => setSelectedStaffId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-2 border rounded bg-gray-50 text-gray-800"
            >
              <option value="">Sans préférence</option>
              {availableStaff.map((member) => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full p-2 border rounded bg-gray-50 text-gray-800"
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label htmlFor="slot" className="block text-sm font-medium text-gray-700 mb-1">
            Horaire
          </label>
          <select
            id="slot"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            className="w-full p-2 border rounded bg-gray-50 text-gray-800"
            required
            disabled={!selectedDate || availableSlots.length === 0}
          >
            <option value="">Sélectionnez un horaire</option>
            {availableSlots.map((slot, index) => (
              <option key={index} value={slot}>{slot}</option>
            ))}
          </select>
          {selectedDate && availableSlots.length === 0 && (
            <p className="text-red-500 text-sm mt-1">
              Aucun créneau disponible pour cette date
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded bg-gray-50 text-gray-800"
            required
          />
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Nom et prénom
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border rounded bg-gray-50 text-gray-800"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Réserver
        </button>
      </form>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Choisissez votre mode de paiement</h2>
            <p className="mb-4">Prix total : {selectedPrice} €</p>
            
            <div className="space-y-4 mb-6">
              <button
                onClick={() => handlePaymentSelection('full')}
                className={`w-full p-4 rounded-lg border ${
                  paymentType === 'full' 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-300'
                }`}
              >
                <p className="font-semibold">Paiement complet</p>
                <p className="text-sm text-gray-600">{selectedPrice} €</p>
              </button>
              
              <button
                onClick={() => handlePaymentSelection('deposit')}
                className={`w-full p-4 rounded-lg border ${
                  paymentType === 'deposit' 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-300'
                }`}
              >
                <p className="font-semibold">Acompte (1/3 du prix)</p>
                <p className="text-sm text-gray-600">{(selectedPrice / 3).toFixed(2)} €</p>
              </button>
            </div>

            <button
              onClick={handlePayment}
              className="w-full bg-[#0070BA] text-white py-3 px-4 rounded-lg hover:bg-[#003087] transition duration-300 flex items-center justify-center mb-4"
            >
              <CreditCard className="mr-2" />
              Payer maintenant
            </button>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full border border-gray-300 text-gray-600 py-3 px-4 rounded-lg hover:bg-gray-50 transition duration-300"
            >
              Annuler
            </button>

            <p className="text-sm text-gray-500 mt-4">
              * Les prestations non annulées dans les 24 heures précédant le rendez-vous ne pourront faire l'objet d'aucun remboursement, que ce soit pour l'acompte ou le paiement intégral.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;