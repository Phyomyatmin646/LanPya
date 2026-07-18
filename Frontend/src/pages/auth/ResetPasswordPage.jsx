import { useForm } from 'react-hook-form';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { getErrorMessage } from '@/utils/helpers';

export default function ResetPasswordPage() {
  const { token }  = useParams();
  const navigate   = useNavigate();
  const [showPwd,  setShowPwd]  = useState(false);
  const [done,     setDone]     = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const pwd = watch('password');

  const mutation = useMutation({
    mutationFn: ({ password }) => authService.resetPassword(token, password),
    onSuccess: () => { setDone(true); setTimeout(() => navigate('/login'), 2500); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const Shell = ({ children }) => (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg,#f0edf8 0%,#f5f0fe 60%,#ece1fd 100%)' }}>
      <motion.div className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-2xl"
            style={{ background: 'linear-gradient(135deg,#3E276D,#8955F3)' }}>L</div>
          <span className="font-display font-bold text-2xl gradient-text">LanPya</span>
        </div>
        <div className="card p-8">{children}</div>
      </motion.div>
    </div>
  );

  if (done) return (
    <Shell>
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="font-display font-bold text-2xl text-dark mb-2">Password reset!</h2>
        <p className="text-gray-500 text-sm">Redirecting you to Sign In…</p>
      </div>
    </Shell>
  );

  return (
    <Shell>
      <div className="mb-7">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <KeyRound className="w-6 h-6 text-primary" />
        </div>
        <h2 className="font-display font-bold text-2xl text-dark">Set new password</h2>
        <p className="text-gray-500 text-sm mt-1">Choose a strong password for your account.</p>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <div className="form-group">
          <label className="label">New Password</label>
          <div className="relative">
            <input type={showPwd ? 'text' : 'password'} className={`input pr-11 ${errors.password ? 'input-error' : ''}`} placeholder="Min 6 characters"
              {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="form-error">{errors.password.message}</p>}
        </div>

        <div className="form-group">
          <label className="label">Confirm Password</label>
          <input type="password" className={`input ${errors.confirm ? 'input-error' : ''}`} placeholder="Repeat password"
            {...register('confirm', { required: 'Required', validate: (v) => v === pwd || 'Passwords do not match' })} />
          {errors.confirm && <p className="form-error">{errors.confirm.message}</p>}
        </div>

        <button type="submit" disabled={mutation.isPending} className="btn btn-primary btn-lg w-full">
          {mutation.isPending ? 'Resetting…' : 'Reset Password'}
        </button>
      </form>
    </Shell>
  );
}
