import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setIsSent(true);
      toast.success('Password reset email sent');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
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
          <h2 className="text-2xl tracking-tight text-[#24292F]">Reset your password</h2>
        </div>

        <div className="gh-box p-4 mb-4 text-sm text-[#24292F]">
          {isSent ? (
            <div className="text-center">
              <p className="mb-4">Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.</p>
              <Link to="/login" className="btn btn-default w-full">Return to sign in</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <p className="mb-4">Enter your user account's verified email address and we will send you a password reset link.</p>
              <div>
                <label className="gh-label" htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="gh-input"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-[#CF222E] text-xs mt-1 font-medium">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full mt-2"
              >
                {isLoading ? 'Sending...' : 'Send password reset email'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
