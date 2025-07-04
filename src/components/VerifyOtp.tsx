import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../services/api';

const VerifyOtp: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state && (location.state as any).email) || '';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      setSuccess('Account verified! You can now log in.');
      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setSuccess('');
    try {
      await resendOtp(email);
      setResent(true);
      setSuccess('OTP resent to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-600">Verify Your Account</h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300 text-center">
          Enter the OTP sent to <span className="font-semibold">{email}</span>
        </p>
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors text-lg"
            placeholder="Enter OTP"
            maxLength={6}
            required
          />
          {error && <div className="p-2 bg-red-100 text-red-600 rounded text-center">{error}</div>}
          {success && <div className="p-2 bg-green-100 text-green-700 rounded text-center">{success}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
        <div className="text-center mt-6">
          <button
            onClick={handleResend}
            disabled={resendLoading || resent}
            className="text-purple-600 hover:text-purple-800 font-medium disabled:opacity-50"
          >
            {resendLoading ? 'Resending...' : resent ? 'OTP Sent!' : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp; 