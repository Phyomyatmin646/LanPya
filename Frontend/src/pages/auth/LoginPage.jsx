import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success('Successfully logged in!');
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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
          <h2 className="text-2xl tracking-tight text-[#24292F]">Sign in to LanPya</h2>
        </div>

        <div className="gh-box p-4 mb-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="gh-label" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="gh-input"
              />
              {errors.email && <p className="text-[#CF222E] text-xs mt-1 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="gh-label" htmlFor="password">Password</label>
                <Link to="/forgot-password" className="text-xs text-accent hover:underline mb-1">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="gh-input"
              />
              {errors.password && <p className="text-[#CF222E] text-xs mt-1 font-medium">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full mt-2"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#24292F] gh-box p-4 bg-white">
          New to LanPya?{' '}
          <Link to="/register" className="text-accent hover:underline font-medium">
            Create an account
          </Link>.
        </p>
      </div>
    </div>
  );
}
