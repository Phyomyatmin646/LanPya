import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { KeyRound, Eye, EyeOff, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import useAuthStore from '@/contexts/authStore';
import { getErrorMessage } from '@/utils/helpers';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const newPwd = watch('newPassword');

  const pwdMutation = useMutation({
    mutationFn: (data) => authService.forgotPassword(user.email),
    onSuccess: () => { toast.success('Password reset email sent!'); reset(); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <h1 className="page-title">Settings</h1>

      {/* Security */}
      <motion.div className="card p-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-lg">Security</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-sm font-medium text-amber-700">Reset Password</p>
            <p className="text-xs text-amber-600 mt-0.5">We'll send a reset link to your email address.</p>
            <button
              onClick={() => pwdMutation.mutate()}
              disabled={pwdMutation.isPending}
              className="btn btn-warning btn-sm mt-3 gap-2"
              style={{ background: '#f59e0b', color: '#fff' }}
            >
              <KeyRound className="w-3.5 h-3.5" />
              {pwdMutation.isPending ? 'Sending…' : 'Send Reset Link'}
            </button>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-700">Email</p>
            <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
            {user?.email_verified
              ? <span className="badge badge-success mt-2">✓ Verified</span>
              : <span className="badge badge-warning mt-2">Not verified</span>}
          </div>
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div className="card p-6 border-red-100"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h2 className="font-display font-semibold text-lg text-red-500 mb-4">Danger Zone</h2>
        <button onClick={handleLogout} className="btn btn-danger btn-md gap-2 w-full sm:w-auto">
          <LogOut className="w-4 h-4" /> Sign Out of All Devices
        </button>
      </motion.div>
    </div>
  );
}
