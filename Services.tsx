import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Euro } from 'lucide-react';
import type { Service } from '../types';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadedServices = JSON.parse(localStorage.getItem('services') || '[]');
    const activeServices = loadedServices.filter((service: Service) => !service.paused);
    setServices(activeServices);
  }, []);

  const handleBooking = (service: Service) => {
    navigate('/booking', { 
      state: { 
        selectedCategory: service.category,
        selectedService: service.name
      }
    });
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${minutes} min`;
    } else if (remainingMinutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h${remainingMinutes}`;
    }
  };

  // Grouper les services par catégorie
  const servicesByCategory = services.reduce((acc: Record<string, Service[]>, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  if (services.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Prestations</h1>
        <p className="text-gray-600">Aucune prestation n'est disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Prestations</h1>
      
      {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{category}</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {categoryServices.map((service, index) => (
              <div 
                key={service.id} 
                className={`p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                  index !== categoryServices.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center">
                      <Clock size={18} className="mr-1" />
                      <span>{formatDuration(service.duration)}</span>
                    </div>
                    <div className="flex items-center">
                      <Euro size={18} className="mr-1" />
                      <span>{service.price} €</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleBooking(service)}
                  className="bg-[#C87B76] text-white px-8 py-3 rounded-lg hover:bg-[#B66B66] transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  Choisir
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Services;