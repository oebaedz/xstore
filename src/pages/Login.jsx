import React, { useState } from 'react';
import supabase from '../components/createClient';

const Login = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Identitas internal yang disembunyikan
    const internalEmail = "mimin@dwk.id";

    const { error } = await supabase.auth.signInWithPassword({
      email: internalEmail,
      password: password,
    });

    if (error) {
      alert("Password salah atau akses ditolak!");
    } else {
      window.location.href = "/dashboard"; // Arahkan ke dashboard admin
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-6">
      {/* Card Login */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="bg-accent-green-dark w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent-green-dark/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Portal</h2>
          <p className="text-slate-500 text-sm mt-1">Sistem Pre-Order IKSADA Store</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password-nya, King
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 text-black rounded-xl bg-gray-50 border border-slate-200 focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all placeholder:text-slate-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-green-dark hover:bg-accent-green-dark/80 text-white font-bold py-3 rounded-xl shadow-lg shadow-accent-green-dark/30 active:transform active:scale-95 transition-all disabled:bg-slate-300 disabled:shadow-none"
          >
            {loading ? 'Mengecek...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        <footer className="mt-8 text-center text-xs text-slate-400">
          Apa yang bisa masuk tapi ga bisa keluar?
        </footer>
      </div>
    </div>
  );
};

export default Login;