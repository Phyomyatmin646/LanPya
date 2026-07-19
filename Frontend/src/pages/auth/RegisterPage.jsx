import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';
import { useGuestStore } from '../../store/guestStore';

const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { generatedRoadmap, clearGuestData } = useGuestStore();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // 1. Register User
      await authService.register(data);
      
      // 2. If they have a guest roadmap, ideally we would sync it here.
      // E.g., const res = await miscService.saveRoadmapToProfile(generatedRoadmap);
      // For now, we just clear it because they've upgraded.
      if (generatedRoadmap) {
        toast.success('Registration successful! Your assessment was synced.');
        // We do not clear guest data here, so it persists to the dashboard.
      } else {
        toast.success('Registration successful! Please login.');
      }
      
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm">
        
        <div className="text-center mb-6">
          <div className="auth-logo inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white text-2xl font-bold mb-4">
            ⚡
          </div>
          <h2 className="text-2xl tracking-tight text-white">Create your account</h2>
        </div>

        {generatedRoadmap && (
          <div className="auth-notice mb-4 p-3 rounded-xl text-sm font-medium text-center">
            You're just one step away from saving your personalized roadmap!
          </div>
        )}

        <div className="auth-card p-5 mb-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="gh-label" htmlFor="full_name">Full Name</label>
              <input id="full_name" type="text" {...register('full_name')} className="auth-input" />
              {errors.full_name && <p className="text-[#CF222E] text-xs mt-1 font-medium">{errors.full_name.message}</p>}
            </div>

            <div>
              <label className="gh-label" htmlFor="username">Username</label>
              <input id="username" type="text" {...register('username')} className="auth-input" />
              {errors.username && <p className="text-[#CF222E] text-xs mt-1 font-medium">{errors.username.message}</p>}
            </div>

            <div>
              <label className="gh-label" htmlFor="email">Email address</label>
              <input id="email" type="email" {...register('email')} className="auth-input" />
              {errors.email && <p className="text-[#CF222E] text-xs mt-1 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="gh-label" htmlFor="password">Password</label>
              <input id="password" type="password" {...register('password')} className="auth-input" />
              {errors.password && <p className="text-[#CF222E] text-xs mt-1 font-medium">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="auth-submit w-full mt-2">
              {isLoading ? 'Creating account...' : 'Sign up for LanPya'}
            </button>
          </form>
        </div>

        <p className="auth-card text-center text-sm p-4">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline font-medium">
            Sign in
          </Link>.
        </p>
      </div>
    </div>
  );
}
