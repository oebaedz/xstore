import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Menu, X, LogOut } from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import supabase from '../createClient'

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Produk', icon: <Package size={20} />, path: '/products' },
    { name: 'Pesanan', icon: <ShoppingCart size={20} />, path: '/orders' },
  ];

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    // Kita ambil data secara paralel agar cepat
    const [prodRes, orderRes] = await Promise.all([
      supabase.from('products').select('*').order('name', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false })
    ]);

    setProducts(prodRes.data || []);
    setOrders(orderRes.data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR OVERLAY (Mobile) */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-slate-100 z-50 transform transition-transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 overflow-hidden rounded-lg">
              <img src="https://st2.depositphotos.com/3867453/5975/v/450/depositphotos_59751285-stock-illustration-letter-x-logo-icon-design.jpg" alt="logo" />
            </div>
            IXADA Store
          </h1>
        </div>
        
        <nav className="mt-4 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link 
            key={item.name} to={item.path} 
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 p-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all">
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-50">
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium">
            <LogOut size={20} /> Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-8">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-600">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">Wadehel</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Mimin69</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 overflow-hidden border-white shadow-sm">
              <img src="https://st2.depositphotos.com/3867453/5975/v/450/depositphotos_59751285-stock-illustration-letter-x-logo-icon-design.jpg" alt="mbae" />
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 overflow-y-auto">
          {loading ? <div>Memuat Data...</div> :
            <Outlet context={{ products, orders, refreshData: fetchAdminData }} />
          }
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;