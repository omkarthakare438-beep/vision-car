import React, { useState, useEffect } from 'react';
import { 
  Car as CarIcon, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  History, 
  PlusCircle,
  ShieldCheck,
  Calendar,
  CreditCard,
  CheckCircle2,
  X,
  Search,
  Filter,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Car, Booking } from './types';

// --- Components ---

const Navbar: React.FC<{ user: User | null, onLogout: () => void, setView: (v: string) => void }> = ({ user, onLogout, setView }) => (
  <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-zinc-900 p-2 rounded-xl">
            <CarIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">CloudDrive</span>
        </div>
        
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <button onClick={() => setView('home')} className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Browse</button>
              <button onClick={() => setView('history')} className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">My Bookings</button>
              {user.role === 'admin' && (
                <button onClick={() => setView('admin')} className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </button>
              )}
              <div className="h-6 w-px bg-zinc-200" />
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-medium text-zinc-900">{user.email}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{user.role}</p>
                </div>
                <button onClick={onLogout} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <LogOut className="w-5 h-5 text-zinc-500" />
                </button>
              </div>
            </>
          ) : (
            <button onClick={() => setView('login')} className="bg-zinc-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-zinc-800 transition-all">
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  </nav>
);

const CarCard: React.FC<{ car: Car, onBook: (car: Car) => void }> = ({ car, onBook }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-xl transition-all group"
  >
    <div className="aspect-[16/10] overflow-hidden relative">
      <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
      <div className="absolute top-4 right-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${car.available ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>
          {car.available ? 'Available' : 'Booked'}
        </span>
      </div>
    </div>
    <div className="p-5">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-zinc-900">{car.name}</h3>
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{car.type}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-zinc-900">${car.price}</p>
          <p className="text-[10px] text-zinc-500 font-medium">per day</p>
        </div>
      </div>
      <button 
        disabled={!car.available}
        onClick={() => onBook(car)}
        className={`w-full mt-4 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${car.available ? 'bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98]' : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'}`}
      >
        {car.available ? 'Book Now' : 'Not Available'}
        {car.available && <ChevronRight className="w-4 h-4" />}
      </button>
    </div>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState('home');
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [adminBookings, setAdminBookings] = useState<Booking[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [bookingDates, setBookingDates] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchCars();
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserBookings();
      if (user.role === 'admin') fetchAdminBookings();
    }
  }, [user]);

  const fetchCars = async () => {
    const res = await fetch('/api/cars');
    const data = await res.json();
    setCars(data);
  };

  const fetchUserBookings = async () => {
    if (!user) return;
    const res = await fetch(`/api/bookings/${user.id}`);
    const data = await res.json();
    setBookings(data);
  };

  const fetchAdminBookings = async () => {
    const res = await fetch('/api/admin/bookings');
    const data = await res.json();
    setAdminBookings(data);
  };

  const handleAuth = async (e: React.FormEvent, type: 'login' | 'register') => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        setView('home');
      } else {
        alert(data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCar) return;
    
    const start = new Date(bookingDates.start);
    const end = new Date(bookingDates.end);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const totalPrice = days * selectedCar.price;

    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          car_id: selectedCar.id,
          start_date: bookingDates.start,
          end_date: bookingDates.end,
          total_price: totalPrice
        })
      });
      if (res.ok) {
        setSelectedCar(null);
        fetchCars();
        fetchUserBookings();
        setView('history');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const carData = {
      name: formData.get('name'),
      type: formData.get('type'),
      price: Number(formData.get('price')),
      image: formData.get('image')
    };

    const res = await fetch('/api/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData)
    });
    if (res.ok) {
      fetchCars();
      (e.target as HTMLFormElement).reset();
    }
  };

  const handleDeleteCar = async (id: number) => {
    if (!confirm('Are you sure you want to remove this car?')) return;
    const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
    if (res.ok) fetchCars();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setView('home');
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <Navbar user={user} onLogout={logout} setView={setView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.div 
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
              <form onSubmit={(e) => handleAuth(e, 'login')} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
                    placeholder="name@example.com"
                    value={authForm.email}
                    onChange={e => setAuthForm({...authForm, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Password</label>
                  <input 
                    type="password" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                    value={authForm.password}
                    onChange={e => setAuthForm({...authForm, password: e.target.value})}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-zinc-900 text-white py-3 rounded-xl font-semibold hover:bg-zinc-800 transition-all disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
                <div className="text-center mt-4">
                  <button 
                    type="button"
                    onClick={(e) => handleAuth(e as any, 'register')}
                    className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    Don't have an account? <span className="font-bold text-zinc-900 underline underline-offset-4">Register</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight mb-2">Find your perfect drive</h1>
                  <p className="text-zinc-500">Premium cars for your next adventure, available instantly.</p>
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                      type="text" 
                      placeholder="Search cars..." 
                      className="pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-full text-sm focus:ring-2 focus:ring-zinc-900 outline-none w-64"
                    />
                  </div>
                  <button className="p-2.5 bg-white border border-zinc-200 rounded-full hover:bg-zinc-50 transition-colors">
                    <Filter className="w-4 h-4 text-zinc-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cars.map(car => (
                  <CarCard 
                    key={car.id} 
                    car={car} 
                    onBook={(c) => {
                      if (!user) setView('login');
                      else setSelectedCar(c);
                    }} 
                  />
                ))}
              </div>
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-3 mb-8">
                <History className="w-8 h-8 text-zinc-900" />
                <h1 className="text-3xl font-bold">Booking History</h1>
              </div>
              
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="bg-white border border-dashed border-zinc-300 rounded-3xl p-12 text-center">
                    <div className="bg-zinc-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-zinc-300" />
                    </div>
                    <h3 className="text-lg font-bold">No bookings yet</h3>
                    <p className="text-zinc-500 mb-6">Your rental history will appear here once you make a booking.</p>
                    <button onClick={() => setView('home')} className="bg-zinc-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-zinc-800 transition-all">
                      Browse Cars
                    </button>
                  </div>
                ) : (
                  bookings.map(booking => (
                    <div key={booking.id} className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-center gap-6">
                      <img src={booking.car_image} className="w-24 h-24 rounded-xl object-cover" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{booking.car_name}</h3>
                            <p className="text-xs text-zinc-500">{booking.start_date} to {booking.end_date}</p>
                          </div>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            {booking.status}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
                            <CreditCard className="w-3.5 h-3.5" />
                            Total: ${booking.total_price}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Paid
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {view === 'admin' && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-8 h-8 text-zinc-900" />
                  <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <PlusCircle className="w-5 h-5 text-emerald-600" />
                      <h2 className="font-bold text-lg">Add New Car</h2>
                    </div>
                    <form onSubmit={handleAddCar} className="space-y-4">
                      <input name="name" placeholder="Car Name" required className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:ring-2 focus:ring-zinc-900" />
                      <input name="type" placeholder="Type (e.g. SUV, Sport)" required className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:ring-2 focus:ring-zinc-900" />
                      <input name="price" type="number" placeholder="Price per day" required className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:ring-2 focus:ring-zinc-900" />
                      <input name="image" placeholder="Image URL" required className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:ring-2 focus:ring-zinc-900" />
                      <button type="submit" className="w-full bg-zinc-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-all">
                        Add to Inventory
                      </button>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                      <h2 className="font-bold">Recent Bookings</h2>
                      <span className="text-xs text-zinc-500 font-medium">{adminBookings.length} Total</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
                          <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Car</th>
                            <th className="px-6 py-4">Dates</th>
                            <th className="px-6 py-4">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {adminBookings.map(b => (
                            <tr key={b.id} className="hover:bg-zinc-50 transition-colors">
                              <td className="px-6 py-4 font-medium">{b.user_email}</td>
                              <td className="px-6 py-4">{b.car_name}</td>
                              <td className="px-6 py-4 text-zinc-500">{b.start_date}</td>
                              <td className="px-6 py-4 font-bold">${b.total_price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-zinc-100">
                      <h2 className="font-bold">Inventory Management</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {cars.map(car => (
                        <div key={car.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                          <div className="flex items-center gap-3">
                            <img src={car.image} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                            <div>
                              <p className="font-bold text-xs">{car.name}</p>
                              <p className="text-[10px] text-zinc-500">${car.price}/day</p>
                            </div>
                          </div>
                          <button onClick={() => handleDeleteCar(car.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedCar && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCar(null)}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="aspect-video relative">
                <img src={selectedCar.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button onClick={() => setSelectedCar(null)} className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCar.name}</h2>
                    <p className="text-zinc-500 font-medium">{selectedCar.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-zinc-900">${selectedCar.price}</p>
                    <p className="text-xs text-zinc-500 font-medium">per day</p>
                  </div>
                </div>

                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">Pick-up Date</label>
                      <input 
                        type="date" 
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
                        value={bookingDates.start}
                        onChange={e => setBookingDates({...bookingDates, start: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">Return Date</label>
                      <input 
                        type="date" 
                        required
                        min={bookingDates.start || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
                        value={bookingDates.end}
                        onChange={e => setBookingDates({...bookingDates, end: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="bg-zinc-50 p-4 rounded-2xl flex items-start gap-3">
                    <Info className="w-5 h-5 text-zinc-400 mt-0.5" />
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      By clicking confirm, you agree to our rental terms. A security deposit may be required at the time of pick-up.
                    </p>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-zinc-900 p-1.5 rounded-lg">
              <CarIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight">CloudDrive</span>
          </div>
          <p className="text-xs text-zinc-400">© 2026 CloudDrive Rental Systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
