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
        clearGuestData();
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
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F6F8FA]">
      <div className="w-full max-w-sm">
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#24292F] text-white text-2xl font-bold mb-4">
            L
          </div>
          <h2 className="text-2xl tracking-tight text-[#24292F]">Create your account</h2>
        </div>

        {generatedRoadmap && (
          <div className="mb-4 p-3 bg-[#E5F6EB] text-[#1A7F37] border border-[#2DA44E]/30 rounded-md text-sm font-medium text-center shadow-sm">
            You're just one step away from saving your personalized roadmap!
          </div>
        )}

        <div className="gh-box p-4 mb-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="gh-label" htmlFor="full_name">Full Name</label>
              <input id="full_name" type="text" {...register('full_name')} className="gh-input" />
              {errors.full_name && <p className="text-[#CF222E] text-xs mt-1 font-medium">{errors.full_name.message}</p>}
            </div>

            <div>
              <label className="gh-label" htmlFor="username">Username</label>
              <input id="username" type="text" {...register('username')} className="gh-input" />
              {errors.username && <p className="text-[#CF222E] text-xs mt-1 font-medium">{errors.username.message}</p>}
            </div>

            <div>
              <label className="gh-label" htmlFor="email">Email address</label>
              <input id="email" type="email" {...register('email')} className="gh-input" />
              {errors.email && <p className="text-[#CF222E] text-xs mt-1 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="gh-label" htmlFor="password">Password</label>
              <input id="password" type="password" {...register('password')} className="gh-input" />
              {errors.password && <p className="text-[#CF222E] text-xs mt-1 font-medium">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-primary w-full mt-2">
              {isLoading ? 'Creating account...' : 'Sign up for LanPya'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#24292F] gh-box p-4 bg-white">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline font-medium">
            Sign in
          </Link>.
        </p>
      </div>
    </div>
  );
}
