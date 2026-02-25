import React, { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Menu, LogOut, SettingsIcon, FilesIcon } from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import supabase from '../createClient'

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [appSettings, setAppSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Produk', icon: <Package size={20} />, path: '/products' },
    { name: 'Pesanan', icon: <ShoppingCart size={20} />, path: '/orders' },
    { name: 'Rekap', icon: <FilesIcon size={20} />, path: '/recap' },
    { name: 'Pengaturan', icon: <SettingsIcon size={20} />, path: '/settings' },
  ];
  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      // Kita ambil data secara paralel agar cepat
      const [prodRes, orderItemsRes, orderRes, appSettingsRes] = await Promise.all([
        supabase.from('products').select('*').order('name', { ascending: false }),
        supabase.from('order_items').select('*').order('product_id', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('app_settings').select('*')
      ]);

      if (prodRes.error) throw prodRes.error;
      if (orderItemsRes.error) throw orderItemsRes.error;
      if (orderRes.error) throw orderRes.error;
      if (appSettingsRes.error) throw appSettingsRes.error;

      setProducts(prodRes.data || []);
      setOrderItems(orderItemsRes.data || []);
      setOrders(orderRes.data || []);
      setAppSettings(appSettingsRes.data || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50 font-body flex">
      {/* SIDEBAR OVERLAY (Mobile) */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-slate-100 z-50 transform transition-transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-100">
            X
          </div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">IXADA <span className="text-emerald-500">Store</span></h1>
        </div>
        
        <nav className="mt-4 px-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink 
            key={item.name} to={item.path} 
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) => `
                flex items-center gap-3 p-3 rounded-xl font-medium transition-all
                ${isActive 
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-sm shadow-emerald-50' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
              `}>
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
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
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-600">
              <Menu size={24} />
            </button>
            <Link to="/dashboard" className='flex items-center gap-3 lg:hidden'>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">IXADA <span className="text-emerald-500">Store</span></h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-none">Admin</p>
              <p className="text-[10px] text-emerald-500 uppercase font-bold tracking-wider">Online</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 overflow-hidden border-white shadow-sm">
              <img src="https://ui-avatars.com/api/?name=Xa+No&background=10b981&color=fff" alt="avatar" />
            </div>
          </div>
        </header>

        <main className="lg:p-8 overflow-y-auto">
          {loading && (
            <div className="h-1 bg-emerald-500 animate-pulse w-full fixed top-16 z-[60]" />
          )}
          <Outlet context={{ products, orders, orderItems, appSettings, refreshData: fetchAdminData }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;