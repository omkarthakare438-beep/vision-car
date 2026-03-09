export interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
}

export interface Car {
  id: number;
  name: string;
  type: string;
  price: number;
  image: string;
  available: number;
}

export interface Booking {
  id: number;
  user_id: number;
  car_id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  car_name?: string;
  car_image?: string;
  user_email?: string;
}
