'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Sparkles } from 'lucide-react';

export default function PlatformSignup() {
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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/platform/signup`, formData);
      if (response.data.success) {
        alert('Platform Owner Account Created Successfully ✅');
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
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
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Sparkles className="text-white" size={32} />
          </div>
        </div>
        <h1 className="text-3xl font-black text-center text-white mb-2">Owner Signup</h1>
        <p className="text-gray-400 text-center mb-8">Register the authorized owner account.</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Authorized Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="email" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-white outline-none focus:border-violet-500 transition focus:ring-2 focus:ring-violet-500/50" 
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
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-white outline-none focus:border-violet-500 transition focus:ring-2 focus:ring-violet-500/50" 
                placeholder="••••••••"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-violet-500 hover:bg-violet-600 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-violet-500/30 disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating Account...' : 'Create Owner Account'}
          </button>
        </form>
      </div>
    </div>
  );
}