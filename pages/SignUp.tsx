
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { UserRole } from '../types';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState<UserRole>('INVESTOR');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role') as UserRole;
    if (roleParam === 'BUILDER' || roleParam === 'INVESTOR') {
      setRole(roleParam);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signUp(formData.email, formData.name, role);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 bg-white dark:bg-slate-950 transition-colors">
      <Link to="/" className="flex items-center gap-3 text-fintech-purple-600 font-black text-3xl tracking-tighter mb-12">
        <div className="w-12 h-12 bg-fintech-purple-600 rounded-xl flex items-center justify-center text-white">
          <Building2 className="w-7 h-7" />
        </div>
        <span>PropToken</span>
      </Link>
      
      <div className="w-full max-w-md bg-white dark:bg-slate-900 p-10 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-xl">
        <div className="mb-8">
           <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${role === 'BUILDER' ? 'bg-slate-900 text-white' : 'bg-fintech-purple-600 text-white'}`}>
             Joining as {role === 'BUILDER' ? 'Seller' : 'Buyer'}
           </span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter mb-2">Create Account</h2>
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-10">Start your property journey</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Full Name</label>
            <input 
              required
              type="text" 
              placeholder="Your name"
              className="w-full px-6 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-transparent dark:text-slate-100 focus:border-fintech-purple-600 outline-none transition-all font-bold"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Email Address</label>
            <input 
              required
              type="email" 
              placeholder="name@example.com"
              className="w-full px-6 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-transparent dark:text-slate-100 focus:border-fintech-purple-600 outline-none transition-all font-bold"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="relative">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Password</label>
            <input 
              required
              type={showPassword ? "text" : "password"} 
              placeholder="Min. 6 characters"
              className="w-full px-6 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-transparent dark:text-slate-100 focus:border-fintech-purple-600 outline-none transition-all font-bold"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 bottom-4 text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button 
            disabled={isLoading}
            type="submit" 
            className="w-full bg-fintech-purple-600 text-white py-5 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-slate-900 transition-all flex items-center justify-center disabled:opacity-70 shadow-lg"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Create Account Now"}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Already have an account? <Link to="/signin" className="text-fintech-purple-600 dark:text-neon-emerald hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
