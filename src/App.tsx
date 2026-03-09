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
  Info,
  Edit,
  Trash2,
  Plus,
  BadgeCheck,
  Tag,
  Palette,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Car, Booking } from './types';

// --- Components ---

const Navbar: React.FC<{ user: User | null, onLogout: () => void, setView: (v: string) => void }> = ({ user, onLogout, setView }) => (
  <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-20 items-center">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
          <div className="bg-indigo-600 p-2.5 rounded-2xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-200">
            <CarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 block leading-none">CloudDrive</span>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Premium Rentals</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-6">
                <button onClick={() => setView('home')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Browse</button>
                <button onClick={() => setView('history')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">My Bookings</button>
                <button onClick={() => setView('my-listings')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">My Listings</button>
                <button onClick={() => setView('list-car')} className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-4 py-2 rounded-full">
                  <Plus className="w-4 h-4" />
                  List Your Car
                </button>
              </div>
              
              {user.role === 'admin' && (
                <button onClick={() => setView('admin')} className="flex items-center gap-1.5 text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors">
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </button>
              )}
              
              <div className="h-8 w-px bg-slate-200" />
              
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 leading-none">{user.email.split('@')[0]}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{user.role}</p>
                </div>
                <button onClick={onLogout} className="p-2.5 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <button onClick={() => setView('login')} className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
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
    className="bg-white rounded-[32px] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 group"
  >
    <div className="aspect-[16/11] overflow-hidden relative">
      <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
      <div className="absolute top-5 left-5 flex flex-col gap-2">
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg ${car.available ? 'bg-emerald-500/90 text-white' : 'bg-slate-500/90 text-white'}`}>
          {car.available ? 'Available' : 'Booked'}
        </span>
        {car.owner_id && (
          <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-500/90 text-white backdrop-blur-md shadow-lg flex items-center gap-1">
            <BadgeCheck className="w-3 h-3" />
            User Listed
          </span>
        )}
      </div>
    </div>
    <div className="p-7">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 leading-tight">{car.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">{car.type}</span>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{car.model}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-indigo-600 leading-none">${car.price}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">per day</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mb-6 text-slate-500">
        <div className="flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-slate-300" />
          <span className="text-xs font-semibold">{car.color}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-slate-300" />
          <span className="text-xs font-semibold">{car.model}</span>
        </div>
      </div>

      <button 
        disabled={!car.available}
        onClick={() => onBook(car)}
        className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${car.available ? 'bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-200 hover:shadow-indigo-200 active:scale-[0.98]' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}
      >
        {car.available ? 'Reserve Now' : 'Currently Rented'}
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
  const [myCars, setMyCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [adminBookings, setAdminBookings] = useState<Booking[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [bookingDates, setBookingDates] = useState({ start: '', end: '' });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [carSortBy, setCarSortBy] = useState('newest');

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAdminBookings = React.useMemo(() => {
    let sortableItems = [...adminBookings];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = (a as any)[sortConfig.key] || '';
        const bValue = (b as any)[sortConfig.key] || '';
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [adminBookings, sortConfig]);

  const filteredAndSortedCars = React.useMemo(() => {
    let result = cars.filter(car => 
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (carSortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (carSortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (carSortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [cars, searchQuery, carSortBy]);

  useEffect(() => {
    fetchCars();
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserBookings();
      fetchMyCars();
      if (user.role === 'admin') fetchAdminBookings();
    }
  }, [user]);

  const fetchCars = async () => {
    const res = await fetch('/api/cars');
    const data = await res.json();
    setCars(data);
  };

  const fetchMyCars = async () => {
    if (!user) return;
    const res = await fetch(`/api/cars/owner/${user.id}`);
    const data = await res.json();
    setMyCars(data);
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

  const handleCarAction = async (e: React.FormEvent, isUserListing = false) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const carData = {
      name: formData.get('name'),
      model: formData.get('model'),
      color: formData.get('color'),
      type: formData.get('type'),
      price: Number(formData.get('price')),
      image: formData.get('image'),
      owner_id: isUserListing ? user?.id : null
    };

    const method = editingCar ? 'PUT' : 'POST';
    const url = editingCar ? `/api/cars/${editingCar.id}` : '/api/cars';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData)
    });
    
    if (res.ok) {
      fetchCars();
      fetchMyCars();
      setEditingCar(null);
      if (isUserListing) setView('my-listings');
      (e.target as HTMLFormElement).reset();
    }
  };

  const handleDeleteCar = async (id: number) => {
    if (!confirm('Are you sure you want to remove this car?')) return;
    const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchCars();
      fetchMyCars();
    }
  };

  const toggleAvailability = async (id: number, currentStatus: number) => {
    const res = await fetch(`/api/cars/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: currentStatus ? 0 : 1 })
    });
    if (res.ok) {
      fetchCars();
      fetchMyCars();
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setView('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar user={user} onLogout={logout} setView={setView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.div 
              key="login"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="max-w-md mx-auto bg-white p-10 rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-200"
            >
              <div className="text-center mb-10">
                <div className="bg-indigo-600 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100">
                  <CarIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black tracking-tight">Welcome Back</h2>
                <p className="text-slate-400 font-medium mt-2">Sign in to manage your rentals</p>
              </div>
              <form onSubmit={(e) => handleAuth(e, 'login')} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-medium"
                    placeholder="name@example.com"
                    value={authForm.email}
                    onChange={e => setAuthForm({...authForm, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Password</label>
                  <input 
                    type="password" 
                    required
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-medium"
                    placeholder="••••••••"
                    value={authForm.password}
                    onChange={e => setAuthForm({...authForm, password: e.target.value})}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all disabled:opacity-50 shadow-xl shadow-slate-200 hover:shadow-indigo-200 active:scale-95"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
                <div className="text-center pt-4">
                  <button 
                    type="button"
                    onClick={(e) => handleAuth(e as any, 'register')}
                    className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    New to CloudDrive? <span className="text-slate-900 underline underline-offset-8 decoration-2 decoration-indigo-500">Create Account</span>
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
              <div className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                <div className="max-w-2xl">
                  <h1 className="text-6xl font-black tracking-tighter mb-6 leading-[0.9]">Drive the future, <br/><span className="text-indigo-600">today.</span></h1>
                  <p className="text-xl text-slate-500 font-medium leading-relaxed">Experience premium mobility with our curated fleet of luxury and performance vehicles.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search by name or model..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-14 pr-8 py-4 bg-white border border-slate-200 rounded-[24px] text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none w-full md:w-80 shadow-sm transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <select 
                      value={carSortBy}
                      onChange={(e) => setCarSortBy(e.target.value)}
                      className="pl-14 pr-10 py-4 bg-white border border-slate-200 rounded-[24px] text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none shadow-sm transition-all appearance-none cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name: A-Z</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredAndSortedCars.length === 0 ? (
                  <div className="col-span-full py-20 text-center">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-8 h-8 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">No vehicles found</h3>
                    <p className="text-slate-400 font-medium mt-2">Try adjusting your search or filters.</p>
                  </div>
                ) : (
                  filteredAndSortedCars.map(car => (
                    <CarCard 
                      key={car.id} 
                      car={car} 
                      onBook={(c) => {
                        if (!user) setView('login');
                        else setSelectedCar(c);
                      }} 
                    />
                  ))
                )}
              </div>
            </motion.div>
          )}

          {view === 'list-car' && (
            <motion.div 
              key="list-car"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto bg-white p-12 rounded-[48px] border border-slate-200 shadow-2xl shadow-slate-100"
            >
              <div className="mb-10">
                <h2 className="text-4xl font-black tracking-tight">List Your Vehicle</h2>
                <p className="text-slate-500 font-medium mt-2">Earn extra income by sharing your car with our community.</p>
              </div>
              <form onSubmit={(e) => handleCarAction(e, true)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Vehicle Name</label>
                    <input name="name" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600" placeholder="e.g. Tesla" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Model</label>
                    <input name="model" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600" placeholder="e.g. Model S Plaid" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Color</label>
                    <input name="color" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600" placeholder="e.g. Midnight Silver" />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Category</label>
                    <select name="type" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 appearance-none">
                      <option>Electric</option>
                      <option>Sport</option>
                      <option>SUV</option>
                      <option>Luxury</option>
                      <option>Classic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Daily Rate ($)</label>
                    <input name="price" type="number" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600" placeholder="99" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Image URL</label>
                    <input name="image" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600" placeholder="https://..." />
                  </div>
                </div>
                <div className="md:col-span-2 pt-6">
                  <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95">
                    Submit Listing
                  </button>
                </div>
              </form>
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
              <div className="flex items-center gap-4 mb-12">
                <div className="bg-slate-900 p-3 rounded-2xl shadow-lg">
                  <History className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-black tracking-tight">Booking History</h1>
              </div>
              
              <div className="space-y-6">
                {bookings.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-20 text-center">
                    <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                      <Calendar className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black mb-2">No adventures yet</h3>
                    <p className="text-slate-400 font-medium mb-10">Your rental history will appear here once you start driving.</p>
                    <button onClick={() => setView('home')} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
                      Explore Fleet
                    </button>
                  </div>
                ) : (
                  bookings.map(booking => (
                    <div key={booking.id} className="bg-white border border-slate-200 rounded-[32px] p-6 flex flex-col md:flex-row items-center gap-8 hover:shadow-xl transition-all duration-500">
                      <img src={booking.car_image} className="w-full md:w-48 aspect-video rounded-2xl object-cover shadow-lg" referrerPolicy="no-referrer" />
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-black text-2xl text-slate-900">{booking.car_name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-300" />
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{booking.start_date} — {booking.end_date}</p>
                            </div>
                          </div>
                          <span className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-8 pt-4 border-t border-slate-50">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Paid</span>
                            <span className="text-xl font-black text-slate-900">${booking.total_price}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Payment</span>
                            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                              <CheckCircle2 className="w-4 h-4" />
                              Verified
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {view === 'my-listings' && (
            <motion.div 
              key="my-listings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-4 mb-12">
                <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg">
                  <CarIcon className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-black tracking-tight">My Listings</h1>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {myCars.length === 0 ? (
                  <div className="col-span-full bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-20 text-center">
                    <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                      <Plus className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black mb-2">No cars listed</h3>
                    <p className="text-slate-400 font-medium mb-10">Start earning by listing your vehicle for rent.</p>
                    <button onClick={() => setView('list-car')} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100">
                      List Your Car
                    </button>
                  </div>
                ) : (
                  myCars.map(car => (
                    <div key={car.id} className="bg-white border border-slate-200 rounded-[32px] overflow-hidden hover:shadow-xl transition-all duration-500 group">
                      <div className="aspect-video relative overflow-hidden">
                        <img src={car.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${car.available ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}`}>
                            {car.available ? 'Available' : 'Booked'}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-black text-xl">{car.name}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{car.model} • {car.type}</p>
                          </div>
                          <p className="text-xl font-black text-indigo-600">${car.price}</p>
                        </div>
                        <div className="flex gap-2 mb-2">
                          <button 
                            onClick={() => toggleAvailability(car.id, car.available)}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${car.available ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                          >
                            {car.available ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
                            {car.available ? 'Active' : 'Hidden'}
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingCar(car)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button onClick={() => handleDeleteCar(car.id)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-rose-50 hover:text-rose-600 transition-all">
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
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
              className="space-y-12"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-rose-600 p-3 rounded-2xl shadow-lg shadow-rose-100">
                    <LayoutDashboard className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-4xl font-black tracking-tight">Admin Console</h1>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-8">
                  <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-xl shadow-slate-100">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="bg-emerald-100 p-2 rounded-xl">
                        <PlusCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h2 className="font-black text-xl">Add New Car</h2>
                    </div>
                    <form onSubmit={(e) => handleCarAction(e)} className="space-y-5">
                      <input name="name" placeholder="Brand Name" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600" />
                      <input name="model" placeholder="Model Name" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600" />
                      <input name="color" placeholder="Color" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600" />
                      <input name="type" placeholder="Category (SUV, Sport...)" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600" />
                      <input name="price" type="number" placeholder="Daily Rate" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600" />
                      <input name="image" placeholder="Image URL" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600" />
                      <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
                        Add to Fleet
                      </button>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-10">
                  <div className="bg-white rounded-[40px] border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                      <h2 className="font-black text-xl">Recent Activity</h2>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">{adminBookings.length} Total Bookings</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">
                          <tr>
                            <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => requestSort('user_email')}>
                              <div className="flex items-center gap-1">
                                Customer
                                {sortConfig?.key === 'user_email' && (
                                  sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                )}
                              </div>
                            </th>
                            <th className="px-8 py-5">Vehicle</th>
                            <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => requestSort('start_date')}>
                              <div className="flex items-center gap-1">
                                Period
                                {sortConfig?.key === 'start_date' && (
                                  sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                )}
                              </div>
                            </th>
                            <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => requestSort('total_price')}>
                              <div className="flex items-center gap-1">
                                Revenue
                                {sortConfig?.key === 'total_price' && (
                                  sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                )}
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {sortedAdminBookings.map(b => (
                            <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-8 py-6 font-bold text-slate-600 group-hover:text-slate-900">{b.user_email}</td>
                              <td className="px-8 py-6 font-bold">{b.car_name}</td>
                              <td className="px-8 py-6 text-slate-400 font-medium">{b.start_date}</td>
                              <td className="px-8 py-6 font-black text-indigo-600">${b.total_price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white rounded-[40px] border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-50">
                      <h2 className="font-black text-xl">Fleet Management</h2>
                    </div>
                    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {cars.map(car => (
                        <div key={car.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100 group">
                          <div className="flex items-center gap-4">
                            <img src={car.image} className="w-14 h-14 rounded-2xl object-cover shadow-md" referrerPolicy="no-referrer" />
                            <div>
                              <p className="font-black text-sm text-slate-900 leading-none">{car.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">${car.price} / day</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setEditingCar(car)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteCar(car.id)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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

      {/* Edit Car Modal */}
      <AnimatePresence>
        {editingCar && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingCar(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden p-12"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black tracking-tight">Edit Vehicle Details</h2>
                <button onClick={() => setEditingCar(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={(e) => handleCarAction(e)} className="grid grid-cols-2 gap-6">
                <div className="space-y-5">
                  <input name="name" defaultValue={editingCar.name} placeholder="Brand" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50" />
                  <input name="model" defaultValue={editingCar.model} placeholder="Model" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50" />
                  <input name="color" defaultValue={editingCar.color} placeholder="Color" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50" />
                </div>
                <div className="space-y-5">
                  <input name="type" defaultValue={editingCar.type} placeholder="Category" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50" />
                  <input name="price" type="number" defaultValue={editingCar.price} placeholder="Price" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50" />
                  <input name="image" defaultValue={editingCar.image} placeholder="Image URL" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50" />
                </div>
                <div className="col-span-2 pt-6">
                  <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl">
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedCar && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCar(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden"
            >
              <div className="aspect-video relative">
                <img src={selectedCar.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button onClick={() => setSelectedCar(null)} className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/40 transition-all">
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-6 left-8">
                  <h2 className="text-3xl font-black text-white leading-tight">{selectedCar.name}</h2>
                  <p className="text-white/80 font-bold uppercase tracking-widest text-xs mt-1">{selectedCar.model} • {selectedCar.type}</p>
                </div>
              </div>
              <div className="p-10">
                <form onSubmit={handleBooking} className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Pick-up Date</label>
                      <input 
                        type="date" 
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600"
                        value={bookingDates.start}
                        onChange={e => setBookingDates({...bookingDates, start: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Return Date</label>
                      <input 
                        type="date" 
                        required
                        min={bookingDates.start || new Date().toISOString().split('T')[0]}
                        className="w-full px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600"
                        value={bookingDates.end}
                        onChange={e => setBookingDates({...bookingDates, end: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-[32px] flex items-start gap-4 border border-slate-100">
                    <div className="bg-indigo-100 p-2 rounded-xl">
                      <Info className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 mb-1">Total Estimated Price</p>
                      <p className="text-2xl font-black text-indigo-600">
                        ${(Math.ceil((new Date(bookingDates.end).getTime() - new Date(bookingDates.start).getTime()) / (1000 * 60 * 60 * 24)) || 1) * selectedCar.price}
                      </p>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Confirm Reservation'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-20 mt-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <div className="bg-slate-900 p-2 rounded-xl">
                  <CarIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter">CloudDrive</span>
              </div>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">The world's first decentralized luxury car rental platform powered by cloud technology.</p>
            </div>
            <div className="flex justify-center gap-10">
              <a href="#" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">Fleet</a>
              <a href="#" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">Pricing</a>
              <a href="#" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">Support</a>
            </div>
            <div className="text-center md:text-right">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">© 2026 CloudDrive Systems</p>
              <p className="text-[10px] font-bold text-slate-400 mt-2">Designed for the future of mobility.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
