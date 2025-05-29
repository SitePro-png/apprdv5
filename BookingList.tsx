// src/pages/Booking.tsx

import React from 'react';
import { toMinutes } from '../utils/timeSlotUtils';

// Définition des types pour les créneaux et les rendez-vous
export interface TimeSlot {
  start: string; // format "HH:MM"
  end: string;   // format "HH:MM"
}

export interface Appointment {
  employeeId: number;
  serviceId: number;
  start: string; // format "HH:MM"
  end: string;   // format "HH:MM"
}

interface BookingProps {
  // Liste des rendez-vous déjà réservés, par exemple récupérée du serveur
  appointments: Appointment[];
  // Identifiant de l'employé choisi par le client
  employeeId: number;
  // Identifiant de la prestation sélectionnée par le client
  serviceId: number;
  // Callback appelée lorsque le client choisit un créneau disponible
  onBook: (slot: TimeSlot) => void;
}

// Exemple de tous les créneaux possibles dans la journée (par exemple, de 9h à 17h en tranches de 30 minutes)
const ALL_SLOTS: TimeSlot[] = [
  { start: '09:00', end: '09:30' },
  { start: '09:30', end: '10:00' },
  { start: '10:00', end: '10:30' },
  { start: '10:30', end: '11:00' },
  { start: '11:00', end: '11:30' },
  { start: '11:30', end: '12:00' },
  { start: '13:00', end: '13:30' },
  { start: '13:30', end: '14:00' },
  { start: '14:00', end: '14:30' },
  { start: '14:30', end: '15:00' },
  { start: '15:00', end: '15:30' },
  { start: '15:30', end: '16:00' },
  { start: '16:00', end: '16:30' },
  { start: '16:30', end: '17:00' },
];

const Booking: React.FC<BookingProps> = ({
  appointments,
  employeeId,
  serviceId,
  onBook,
}) => {
  // Filtrer les créneaux afin de n'afficher que ceux non réservés pour ce couple employé/service
  const availableSlots = ALL_SLOTS.filter((slot) => {
    const slotStartM = toMinutes(slot.start);
    const slotEndM = toMinutes(slot.end);
    const isReserved = appointments.some((appt) => {
      if (appt.employeeId !== employeeId || appt.serviceId !== serviceId) return false;
      const apptStartM = toMinutes(appt.start);
      const apptEndM = toMinutes(appt.end);
      return slotStartM < apptEndM && slotEndM > apptStartM;
    });
    return !isReserved;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Réserver un rendez-vous</h2>
      {availableSlots.length > 0 ? (
        <div className="space-y-2">
          {availableSlots.map((slot, idx) => (
            <button
              key={idx}
              onClick={() => onBook(slot)}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
            >
              {slot.start} - {slot.end}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Aucun créneau disponible pour le moment.</p>
      )}
    </div>
  );
};

export default Booking;
