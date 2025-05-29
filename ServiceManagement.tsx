import React, { useState, useEffect } from 'react';
import { Plus, Clock, Euro, ChevronRight } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  category: string;
  duration: number;
  price: number;
  paused: boolean;
}

interface ServiceManagementProps {
  services: Service[];
  onAddService: (service: Omit<Service, 'id'>) => void;
  onToggleService: (id: number) => void;
  onDeleteService: (id: number) => void;
}

const ServiceManagement: React.FC<ServiceManagementProps> = ({
  services,
  onAddService,
  onToggleService,
  onDeleteService
}) => {
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [showServicesList, setShowServicesList] = useState(false);

  useEffect(() => {
    const uniqueCategories = Array.from(new Set(services.map(service => service.category)));
    setCategories(uniqueCategories);
  }, [services]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newServiceName.trim() && newServiceCategory.trim() && newServiceDuration.trim() && newServicePrice.trim()) {
      onAddService({
        name: newServiceName.trim(),
        category: newServiceCategory.trim(),
        duration: parseInt(newServiceDuration, 10),
        price: parseFloat(newServicePrice),
        paused: false
      });
      setNewServiceName('');
      setNewServiceCategory('');
      setNewServiceDuration('');
      setNewServicePrice('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Gestion des prestations</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la prestation
            </label>
            <input
              id="serviceName"
              type="text"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="Ex: Massage relaxant"
              className="w-full p-2 border rounded bg-gray-50 text-gray-800"
              required
            />
          </div>

          <div>
            <label htmlFor="serviceCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <input
              id="serviceCategory"
              type="text"
              value={newServiceCategory}
              onChange={(e) => setNewServiceCategory(e.target.value)}
              placeholder="Ex: Massage"
              className="w-full p-2 border rounded bg-gray-50 text-gray-800"
              list="categories"
              required
            />
            <datalist id="categories">
              {categories.map((category, index) => (
                <option key={index} value={category} />
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor="serviceDuration" className="block text-sm font-medium text-gray-700 mb-1">
              Durée (minutes)
            </label>
            <div className="flex items-center">
              <Clock size={20} className="text-blue-600 absolute ml-2" />
              <input
                id="serviceDuration"
                type="number"
                value={newServiceDuration}
                onChange={(e) => setNewServiceDuration(e.target.value)}
                placeholder="60"
                className="w-full p-2 pl-10 border rounded bg-gray-50 text-gray-800"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="servicePrice" className="block text-sm font-medium text-gray-700 mb-1">
              Prix
            </label>
            <div className="flex items-center">
              <Euro size={20} className="text-blue-600 absolute ml-2" />
              <input
                id="servicePrice"
                type="number"
                value={newServicePrice}
                onChange={(e) => setNewServicePrice(e.target.value)}
                placeholder="50"
                className="w-full p-2 pl-10 border rounded bg-gray-50 text-gray-800"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" />
          Ajouter la prestation
        </button>
      </form>

      <button
        onClick={() => setShowServicesList(!showServicesList)}
        className="w-full mt-4 bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition duration-300 flex items-center justify-center"
      >
        <span className="mr-2">Gérer mes prestations</span>
        <ChevronRight size={20} className={`transform transition-transform ${showServicesList ? 'rotate-90' : ''}`} />
      </button>

      {showServicesList && (
        <div className="mt-6 space-y-4">
          {categories.map((category) => (
            <div key={category} className="border-t pt-4 first:border-t-0 first:pt-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{category}</h3>
              <div className="grid gap-4">
                {services
                  .filter(service => service.category === category)
                  .map((service) => (
                    <div 
                      key={service.id} 
                      className="bg-gray-50 p-4 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className={`text-gray-800 font-medium ${service.paused ? 'line-through' : ''}`}>
                          {service.name}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="mr-4">{service.duration} min</span>
                          <span>{service.price.toFixed(2)} €</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => onToggleService(service.id)}
                          className={`px-3 py-1 rounded-md text-sm ${
                            service.paused 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          }`}
                        >
                          {service.paused ? 'Activer' : 'Mettre en pause'}
                        </button>
                        <button 
                          onClick={() => onDeleteService(service.id)}
                          className="px-3 py-1 rounded-md text-sm bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;