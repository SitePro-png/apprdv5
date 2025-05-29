export interface Staff {
  id: number;
  name: string;
  categories: string[];
  avatar?: string;
}

export interface Service {
  id: number;
  name: string;
  category: string;
  duration: number;
  price: number;
  paused: boolean;
}

export interface Booking {
  id: number;
  serviceId: number;
  staffId?: number;
  date: string;
  slot: string;
  email: string;
  fullName: string;
  price: number;
  paymentType: 'full' | 'deposit';
  paid: boolean;
}