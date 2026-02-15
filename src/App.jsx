import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, Calendar, Users, Search, Star, Heart, Menu, X, 
  ChevronRight, Facebook, Instagram, Twitter, Mail, Phone, 
  LogOut, User, LayoutDashboard, Plus, Trash2, Edit2, 
  CheckCircle, Loader2, Sun, Moon, CreditCard, ShieldCheck
} from 'lucide-react';

// --- MOCK DATA & ASSETS (Simulating Database) ---

const MOCK_IMAGES = {
  hero: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=2574&auto=format&fit=crop",
  kawasan: "https://images.unsplash.com/photo-1624637737299-4d6cb60023a1?q=80&w=2669&auto=format&fit=crop",
  bantayan: "https://images.unsplash.com/photo-1594389657068-4da9464a3239?q=80&w=2670&auto=format&fit=crop",
  whaleshark: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2670&auto=format&fit=crop",
  moalboal: "https://images.unsplash.com/photo-1597850239276-880486c90539?q=80&w=2670&auto=format&fit=crop",
  city: "https://images.unsplash.com/photo-1598418659132-723f5e55e5bb?q=80&w=2574&auto=format&fit=crop",
  malapascua: "https://images.unsplash.com/photo-1588691888277-24a0d8928509?q=80&w=2670&auto=format&fit=crop"
};

const INITIAL_TOURS = [
  {
    id: 1,
    title: "Kawasan Falls Canyoneering",
    location: "Badian, Cebu",
    price: 3500,
    rating: 4.9,
    reviews: 128,
    category: "Adventure",
    duration: "6 Hours",
    image: MOCK_IMAGES.kawasan,
    description: "Experience the thrill of jumping off cliffs and sliding down natural water slides in the turquoise waters of Kawasan Falls.",
    highlights: ["Full canyoneering gear", "Lunch included", "Professional guides", "GoPro footage"],
    featured: true
  },
  {
    id: 2,
    title: "Oslob Whale Shark Encounter",
    location: "Oslob, Cebu",
    price: 4200,
    rating: 4.7,
    reviews: 342,
    category: "Wildlife",
    duration: "4 Hours",
    image: MOCK_IMAGES.whaleshark,
    description: "Swim with the gentle giants of the sea. A once-in-a-lifetime experience to see whale sharks up close in their natural habitat.",
    highlights: ["Snorkeling gear", "Boat transfer", "Breakfast", "Shower facilities"],
    featured: true
  },
  {
    id: 3,
    title: "Bantayan Island Escape",
    location: "Bantayan, Cebu",
    price: 8500,
    rating: 4.8,
    reviews: 89,
    category: "Relaxation",
    duration: "2 Days",
    image: MOCK_IMAGES.bantayan,
    description: "Escape to the pristine white sands of Bantayan. Perfect for couples and those looking to disconnect and relax.",
    highlights: ["Resort accommodation", "Island hopping", "Ferry transfers", "Seafood dinner"],
    featured: false
  },
  {
    id: 4,
    title: "Moalboal Sardine Run & Turtle Chase",
    location: "Moalboal, Cebu",
    price: 2800,
    rating: 4.9,
    reviews: 210,
    category: "Diving",
    duration: "5 Hours",
    image: MOCK_IMAGES.moalboal,
    description: "Witness millions of sardines moving in unison and swim alongside friendly sea turtles just meters from the shore.",
    highlights: ["Snorkeling gear", "Marine conservation fee", "Guide", "Underwater photos"],
    featured: true
  },
  {
    id: 5,
    title: "Cebu City Heritage Tour",
    location: "Cebu City",
    price: 1500,
    rating: 4.5,
    reviews: 450,
    category: "Culture",
    duration: "4 Hours",
    image: MOCK_IMAGES.city,
    description: "Visit Magellan's Cross, Basilica del Santo Niño, and Fort San Pedro. Dive deep into the history of the oldest city in the Philippines.",
    highlights: ["Air-conditioned van", "Licensed guide", "Entrance fees", "Buffet lunch"],
    featured: false
  },
  {
    id: 6,
    title: "Malapascua Thresher Shark Dive",
    location: "Malapascua, Cebu",
    price: 5500,
    rating: 5.0,
    reviews: 56,
    category: "Diving",
    duration: "8 Hours",
    image: MOCK_IMAGES.malapascua,
    description: "The only place in the world where you can see Thresher Sharks daily. strictly for advanced divers.",
    highlights: ["Dive boat", "Tanks and weights", "Dive master", "Lunch"],
    featured: false
  }
];

// --- SIMULATED BACKEND SERVICE ---

const api = {
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "admin@cebutravel.com" && password === "admin") {
          resolve({ id: 999, name: "Admin User", email, role: "admin", avatar: "https://i.pravatar.cc/150?u=admin" });
        } else if (email && password) {
          resolve({ id: 1, name: "Juana Dela Cruz", email, role: "user", avatar: "https://i.pravatar.cc/150?u=juana" });
        } else {
          reject("Invalid credentials");
        }
      }, 800);
    });
  },
  fetchTours: async () => {
    return new Promise(resolve => setTimeout(() => resolve(INITIAL_TOURS), 600));
  },
  bookTour: async (bookingDetails) => {
    return new Promise(resolve => setTimeout(() => resolve({ id: Math.random(), ...bookingDetails, status: 'confirmed', date: new Date().toISOString() }), 1000));
  }
};

// --- COMPONENTS ---

const Button = ({ children, variant = 'primary', className = '', onClick, disabled, icon: Icon, type='button' }) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20",
    secondary: "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
    outline: "border-2 border-white text-white hover:bg-white/10",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {disabled ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </button>
  );
};

const Input = ({ label, type = "text", placeholder, value, onChange, icon: Icon, required }) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-slate-700 block">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />}
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder:text-slate-400`}
      />
    </div>
  </div>
);

const Badge = ({ children, color = 'teal' }) => {
  const colors = {
    teal: 'bg-teal-50 text-teal-700 border-teal-100',
    orange: 'bg-orange-50 text-orange-700 border-orange-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[color]}`}>
      {children}
    </span>
  );
};

const TourCard = ({ tour, onClick }) => (
  <div 
    onClick={() => onClick(tour)}
    className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer flex flex-col h-full"
  >
    <div className="relative h-64 overflow-hidden">
      <img 
        src={tour.image} 
        alt={tour.title} 
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold text-slate-800 shadow-lg">
        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
        {tour.rating}
      </div>
      <div className="absolute bottom-4 left-4 text-white">
        <Badge color="orange">{tour.category}</Badge>
      </div>
    </div>
    
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-lg text-slate-900 line-clamp-2 leading-tight group-hover:text-teal-600 transition-colors">
          {tour.title}
        </h3>
      </div>
      
      <div className="flex items-center text-slate-500 text-sm mb-4">
        <MapPin className="w-4 h-4 mr-1 text-teal-500" />
        {tour.location}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 uppercase font-semibold">Start from</span>
          <div className="text-xl font-bold text-slate-900">₱{tour.price.toLocaleString()}</div>
        </div>
        <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

// --- MAIN APPLICATION ---

export default function CebuTravelApp() {
  // State Management
  const [view, setView] = useState('home'); // home, tours, tour-detail, login, dashboard, admin
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [filters, setFilters] = useState({ category: 'All', minPrice: 0, maxPrice: 10000 });
  const [bookings, setBookings] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Auth Form State
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Booking Form State
  const [bookDate, setBookDate] = useState('');
  const [bookGuests, setBookGuests] = useState(1);

  useEffect(() => {
    // Initial data load simulation
    const loadData = async () => {
      const data = await api.fetchTours();
      setTours(data);
    };
    loadData();

    // Scroll listener for navbar
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await api.login(email, password);
      setUser(userData);
      setView(userData.role === 'admin' ? 'admin' : 'dashboard');
    } catch (err) {
      alert("Login failed. Try 'admin@cebutravel.com' / 'admin' or any other email for user.");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!user) {
      setView('login');
      return;
    }
    setLoading(true);
    const newBooking = {
      tour: selectedTour,
      date: bookDate,
      guests: bookGuests,
      total: selectedTour.price * bookGuests,
      user: user.email
    };
    await api.bookTour(newBooking);
    setBookings([newBooking, ...bookings]);
    setLoading(false);
    setView('dashboard');
    // In a real app, this would show a Toast
    alert("Booking confirmed! Check your dashboard.");
  };

  const filteredTours = useMemo(() => {
    return tours.filter(t => 
      (filters.category === 'All' || t.category === filters.category) &&
      (t.price >= filters.minPrice && t.price <= filters.maxPrice)
    );
  }, [tours, filters]);

  // Views

  const Navbar = () => (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div 
          onClick={() => setView('home')} 
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">C</div>
          <span className={`text-xl font-bold tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>Cebu<span className="text-teal-500">Travel</span></span>
        </div>

        {/* Desktop Menu */}
        <div className={`hidden md:flex items-center gap-8 font-medium ${scrolled ? 'text-slate-600' : 'text-white/90'}`}>
          <button onClick={() => setView('home')} className="hover:text-teal-500 transition-colors">Home</button>
          <button onClick={() => setView('tours')} className="hover:text-teal-500 transition-colors">Tours</button>
          <button className="hover:text-teal-500 transition-colors">Destinations</button>
          <button className="hover:text-teal-500 transition-colors">About</button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`md:hidden p-2 ${scrolled ? 'text-slate-900' : 'text-white'}`}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-4 flex flex-col gap-4 shadow-xl md:hidden">
          <button onClick={() => {setView('home'); setIsMenuOpen(false)}} className="text-left font-medium text-slate-700 p-2 rounded hover:bg-slate-50">Home</button>
          <button onClick={() => {setView('tours'); setIsMenuOpen(false)}} className="text-left font-medium text-slate-700 p-2 rounded hover:bg-slate-50">Tours</button>
        </div>
      )}
    </nav>
  );

  const HomeView = () => (
    <>
      <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={MOCK_IMAGES.hero} alt="Cebu Beach" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white/10" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white mt-16">
          <Badge color="teal" className="mb-6 bg-white/10 backdrop-blur-md border-white/20 text-white px-4 py-1.5 rounded-full">
            ✨ #1 Travel App in the Philippines
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            Discover the Magic <br/> of <span className="text-teal-400">Cebu</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light">
            Book premium tours, island hopping adventures, and luxury stays. Experience the Queen City of the South like never before.
          </p>

          <div className="bg-white p-4 rounded-2xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input type="text" placeholder="Where do you want to go?" className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl outline-none text-slate-900" />
            </div>
            <div className="flex-1 relative">
              <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input type="date" className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl outline-none text-slate-900" />
            </div>
            <div className="flex-1 relative">
              <Users className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <select className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl outline-none text-slate-900 appearance-none">
                <option>2 Guests</option>
                <option>4 Guests</option>
                <option>6+ Guests</option>
              </select>
            </div>
            <Button onClick={() => setView('tours')} variant="primary" className="md:w-auto w-full">
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Experiences</h2>
              <p className="text-slate-500">Handpicked adventures just for you</p>
            </div>
            <button onClick={() => setView('tours')} className="text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.filter(t => t.featured).slice(0, 3).map(tour => (
              <TourCard 
                key={tour.id} 
                tour={tour} 
                onClick={(t) => { setSelectedTour(t); setView('tour-detail'); }} 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="py-24 bg-teal-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6">Why Choose CebuTravel?</h2>
            <div className="space-y-6">
              {[
                { title: "Best Price Guarantee", desc: "We match any competitor's price for the same tour.", icon: ShieldCheck },
                { title: "Local Experts", desc: "Our guides are certified locals who know every hidden gem.", icon: Users },
                { title: "Secure Booking", desc: "Your data is protected with enterprise-grade security.", icon: CreditCard }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-800 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-teal-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-teal-200">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <img src={MOCK_IMAGES.kawasan} className="rounded-2xl w-full h-64 object-cover transform translate-y-8" alt="Feature 1" />
            <img src={MOCK_IMAGES.whaleshark} className="rounded-2xl w-full h-64 object-cover" alt="Feature 2" />
          </div>
        </div>
      </div>
    </>
  );

  const ToursView = () => (
    <div className="pt-24 pb-12 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-28">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Search className="w-5 h-5" /> Filters
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-3 block">Category</label>
                  <div className="space-y-2">
                    {['All', 'Adventure', 'Relaxation', 'Wildlife', 'Diving', 'Culture'].map(cat => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer hover:text-teal-600">
                        <input 
                          type="radio" 
                          name="category" 
                          checked={filters.category === cat}
                          onChange={() => setFilters({...filters, category: cat})}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-slate-600">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-3 block">Price Range</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="10000" 
                    step="500"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
                    className="w-full accent-teal-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>₱0</span>
                    <span className="font-bold text-slate-900">Max ₱{filters.maxPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-slate-900">
                {filters.category === 'All' ? 'All Tours' : `${filters.category} Tours`}
                <span className="text-slate-400 text-lg font-normal ml-2">({filteredTours.length})</span>
              </h1>
              <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-teal-500">
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Rating: High to Low</option>
              </select>
            </div>

            {filteredTours.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTours.map(tour => (
                  <TourCard 
                    key={tour.id} 
                    tour={tour} 
                    onClick={(t) => { setSelectedTour(t); setView('tour-detail'); }} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No tours found</h3>
                <p className="text-slate-500">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const TourDetailView = () => {
    if (!selectedTour) return null;
    return (
      <div className="pt-20 bg-white min-h-screen">
        {/* Gallery */}
        <div className="h-[50vh] relative">
          <img src={selectedTour.image} alt={selectedTour.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-8 container mx-auto">
            <Badge color="orange" className="mb-4">{selectedTour.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{selectedTour.title}</h1>
            <div className="flex items-center gap-4 text-white/90">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedTour.location}</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {selectedTour.rating} ({selectedTour.reviews} reviews)</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 space-y-8">
              {/* Description */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Experience</h2>
                <p className="text-slate-600 leading-relaxed text-lg">{selectedTour.description}</p>
              </section>

              {/* Highlights */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Highlights</h2>
                <div className="grid grid-cols-2 gap-4">
                  {selectedTour.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                      <span className="text-slate-700 font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Reviews Mock */}
              <section className="pt-8 border-t border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Reviews</h2>
                <div className="space-y-6">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 bg-slate-200 rounded-full flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900">Happy Traveler</span>
                          <div className="flex text-yellow-400"><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /></div>
                        </div>
                        <p className="text-slate-600 text-sm">Absolutely amazing experience! The guides were friendly and the views were breathtaking.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Booking Card */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="sticky top-28 bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-3xl font-bold text-slate-900">₱{selectedTour.price.toLocaleString()}</span>
                  <span className="text-slate-500 mb-1">/ person</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="border border-slate-200 rounded-xl p-3">
                    <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                    <input 
                      type="date" 
                      value={bookDate}
                      onChange={(e) => setBookDate(e.target.value)}
                      className="w-full outline-none text-slate-900 font-medium bg-transparent mt-1" 
                    />
                  </div>
                  <div className="border border-slate-200 rounded-xl p-3">
                    <label className="text-xs font-bold text-slate-500 uppercase">Guests</label>
                    <input 
                      type="number" 
                      min="1"
                      value={bookGuests}
                      onChange={(e) => setBookGuests(e.target.value)}
                      className="w-full outline-none text-slate-900 font-medium bg-transparent mt-1" 
                    />
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>₱{selectedTour.price.toLocaleString()} x {bookGuests} guests</span>
                    <span>₱{(selectedTour.price * bookGuests).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Service fee</span>
                    <span>₱0</span>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-lg text-slate-900">
                    <span>Total</span>
                    <span>₱{(selectedTour.price * bookGuests).toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleBook} 
                  disabled={loading || !bookDate} 
                  variant="primary" 
                  className="w-full py-4 text-lg"
                >
                  {loading ? 'Processing...' : 'Book Now'}
                </Button>
                <p className="text-center text-xs text-slate-400 mt-4">You won't be charged yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AuthView = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="h-32 bg-teal-600 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-800" />
          <h2 className="relative z-10 text-3xl font-bold text-white tracking-tight">CebuTravel</h2>
        </div>
        
        <div className="p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h3>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              icon={Mail} 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <Input 
              icon={ShieldCheck} 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : (authMode === 'login' ? 'Log In' : 'Sign Up')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              className="text-teal-600 font-bold hover:underline"
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            >
              {authMode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-center text-slate-400 mb-2">Demo Credentials</p>
            <div className="flex justify-center gap-2 text-xs">
              <span className="bg-slate-100 px-2 py-1 rounded">Admin: admin@cebutravel.com / admin</span>
              <span className="bg-slate-100 px-2 py-1 rounded">User: any / any</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="pt-24 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" /> Upcoming Trips
              </h2>
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <img src={booking.tour.image} className="w-24 h-24 rounded-lg object-cover" alt="" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-900">{booking.tour.title}</h3>
                          <Badge color="teal">Confirmed</Badge>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{booking.date} • {booking.guests} Guests</p>
                        <p className="font-bold text-teal-600 mt-2">₱{booking.total.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-500 mb-4">No bookings yet.</p>
                  <Button onClick={() => setView('tours')} variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50">Explore Tours</Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex flex-col items-center text-center">
                <img src={user?.avatar} alt="Profile" className="w-24 h-24 rounded-full mb-4 border-4 border-slate-50" />
                <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                <p className="text-slate-500 text-sm mb-6">{user?.email}</p>
                <Button onClick={() => {setUser(null); setView('home');}} variant="ghost" className="w-full text-red-500 hover:bg-red-50 hover:text-red-600">
                  <LogOut className="w-4 h-4 mr-2" /> Log Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AdminView = () => (
    <div className="pt-24 min-h-screen bg-slate-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
          <Button onClick={() => {setUser(null); setView('home');}} variant="ghost">Exit</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Revenue', val: '₱145,200', icon: CreditCard, color: 'text-teal-600' },
            { label: 'Active Bookings', val: '24', icon: Calendar, color: 'text-blue-600' },
            { label: 'Total Users', val: '1,203', icon: Users, color: 'text-orange-600' },
            { label: 'Tours Listed', val: '18', icon: MapPin, color: 'text-purple-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{stat.val}</h3>
                </div>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-900">Recent Bookings</h2>
            <Button variant="secondary" className="text-xs py-2 h-8">Download Report</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                <tr>
                  <th className="px-6 py-4">Tour</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1, 2, 3].map((_, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">Kawasan Falls Canyoneering</td>
                    <td className="px-6 py-4">John Doe</td>
                    <td className="px-6 py-4">Oct 24, 2024</td>
                    <td className="px-6 py-4">₱3,500</td>
                    <td className="px-6 py-4"><Badge color="teal">Confirmed</Badge></td>
                    <td className="px-6 py-4 text-slate-400">
                      <button className="hover:text-teal-600"><Edit2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const Footer = () => (
    <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
              <span className="text-xl font-bold">CebuTravel</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your premium gateway to the beautiful islands of Cebu. Making travel easy, secure, and unforgettable.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="hover:text-teal-400 cursor-pointer">About Us</li>
              <li className="hover:text-teal-400 cursor-pointer">Careers</li>
              <li className="hover:text-teal-400 cursor-pointer">Blog</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="hover:text-teal-400 cursor-pointer">Help Center</li>
              <li className="hover:text-teal-400 cursor-pointer">Terms of Service</li>
              <li className="hover:text-teal-400 cursor-pointer">Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@cebutravel.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +63 32 123 4567</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
          © 2024 CebuTravel Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );

  return (
    <div className="font-sans antialiased text-slate-900">
      {view !== 'auth' && <Navbar />}
      
      {view === 'home' && <HomeView />}
      {view === 'tours' && <ToursView />}
      {view === 'tour-detail' && <TourDetailView />}
      {view === 'login' && <AuthView />}
      {view === 'dashboard' && <DashboardView />}
      {view === 'admin' && <AdminView />}

      {view !== 'login' && view !== 'admin' && <Footer />}
    </div>
  );
}
