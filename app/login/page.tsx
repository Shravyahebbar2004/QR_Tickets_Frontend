'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function PlatformLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/platform/login`, formData);
      if (response.data.success) {
        localStorage.setItem('platform_token', response.data.token);
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-violet-950 flex items-center justify-center p-5 relative overflow-hidden">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-violet-500/20 blur-[180px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-cyan-500/20 blur-[180px] rounded-full animate-pulse"></div>

      <div className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-xl shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <ShieldCheck className="text-white" size={32} />
          </div>
        </div>
        <h1 className="text-3xl font-black text-center text-white mb-2">Platform Login</h1>
        <p className="text-gray-400 text-center mb-8">Access the main EventFlow platform.</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="email" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-white outline-none focus:border-cyan-500 transition focus:ring-2 focus:ring-cyan-500/50" 
                placeholder="abc@gmail.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="password" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-white outline-none focus:border-cyan-500 transition focus:ring-2 focus:ring-cyan-500/50" 
                placeholder="••••••••"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-4 rounded-2xl transition shadow-lg shadow-cyan-500/30 disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Not the owner? <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-bold">Sign Up Here</Link>
        </p>
      </div>
    </div>
  );
}
