import { useState, useEffect } from 'react';
import { X, Loader2, User, Mail, ShieldAlert, KeyRound } from 'lucide-react';
import api from '../../api/axios';

export default function SuperAdminSettingsModal({ isOpen, onClose, adminName, adminEmail, onUpdateSuccess }) {
  const [activeTab, setActiveTab] = useState('general'); // general, email, password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. General tab state
  const [name, setName] = useState(adminName || '');

  // 2. Email tab state
  const [newEmail, setNewEmail] = useState('');
  const [oldEmailOtp, setOldEmailOtp] = useState('');
  const [newEmailOtp, setNewEmailOtp] = useState('');
  const [emailOtpRequested, setEmailOtpRequested] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);

  // 3. Password tab state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordOtp, setPasswordOtp] = useState('');
  const [passwordOtpRequested, setPasswordOtpRequested] = useState(false);
  const [passwordTimer, setPasswordTimer] = useState(0);

  // Sync props when open
  useEffect(() => {
    if (isOpen) {
      setName(adminName || '');
      setError('');
      setSuccess('');
    }
  }, [isOpen, adminName]);

  // Timers for OTP requests cooldowns
  useEffect(() => {
    let interval = null;
    if (emailTimer > 0) {
      interval = setInterval(() => {
        setEmailTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emailTimer]);

  useEffect(() => {
    let interval = null;
    if (passwordTimer > 0) {
      interval = setInterval(() => {
        setPasswordTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [passwordTimer]);

  if (!isOpen) return null;

  // ─── Actions ──────────────────────────────────────────────────────────

  // 1. General Change Name
  const handleUpdateName = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.patch('/auth/profile/name', { name });
      if (res.data.success) {
        setSuccess('Display name updated successfully.');
        onUpdateSuccess(res.data.user);
      } else {
        setError(res.data.error || 'Failed to update name.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile name.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Email Change OTP Dispatch
  const handleRequestEmailOTPs = async () => {
    if (!newEmail || !newEmail.trim()) {
      setError('Please enter your new email address.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.post('/auth/profile/request-email-otp', { newEmail });
      if (res.data.success) {
        setSuccess('Verification codes dispatched! Check both your current and new inbox.');
        setEmailOtpRequested(true);
        setEmailTimer(60); // 60 seconds cooldown
      } else {
        setError(res.data.error || 'Failed to request codes.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to dispatch verification codes.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Confirm Email Change
  const handleConfirmEmailChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.post('/auth/profile/confirm-email', {
        newEmail,
        oldEmailOtp,
        newEmailOtp,
      });
      if (res.data.success) {
        setSuccess('Email address changed successfully.');
        onUpdateSuccess(res.data.user);
        // Reset state
        setNewEmail('');
        setOldEmailOtp('');
        setNewEmailOtp('');
        setEmailOtpRequested(false);
      } else {
        setError(res.data.error || 'Failed to update email.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify email update codes.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Password Change OTP Dispatch
  const handleRequestPasswordOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.post('/auth/profile/request-password-otp');
      if (res.data.success) {
        setSuccess('Verification code sent to your email.');
        setPasswordOtpRequested(true);
        setPasswordTimer(60);
      } else {
        setError(res.data.error || 'Failed to request code.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to dispatch password OTP.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Confirm Password Change
  const handleConfirmPasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/profile/confirm-password', {
        oldPassword,
        newPassword,
        otp: passwordOtp,
      });
      if (res.data.success) {
        setSuccess('Password changed successfully.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordOtp('');
        setPasswordOtpRequested(false);
      } else {
        setError(res.data.error || 'Failed to change password.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify password verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/75 transition-opacity" />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl z-50 flex flex-col font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
          <div>
            <h3 className="text-lg font-bold text-white font-serif">Super Admin Profile Settings</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5 font-sans">Update your credentials and account parameters.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 text-xs font-semibold bg-zinc-950/40">
          <button
            onClick={() => { setActiveTab('general'); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 border-b-2 transition-all ${
              activeTab === 'general' ? 'border-emerald-500 text-emerald-400 bg-zinc-900/30' : 'border-transparent text-zinc-450 hover:text-white'
            }`}
          >
            General
          </button>
          <button
            onClick={() => { setActiveTab('email'); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 border-b-2 transition-all ${
              activeTab === 'email' ? 'border-emerald-500 text-emerald-400 bg-zinc-900/30' : 'border-transparent text-zinc-450 hover:text-white'
            }`}
          >
            Change Email
          </button>
          <button
            onClick={() => { setActiveTab('password'); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 border-b-2 transition-all ${
              activeTab === 'password' ? 'border-emerald-500 text-emerald-400 bg-zinc-900/30' : 'border-transparent text-zinc-450 hover:text-white'
            }`}
          >
            Security (Password)
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[60vh] text-left text-zinc-300">
          
          {/* Status Banners */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
              <ShieldAlert size={14} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-xs p-3 rounded-lg flex items-center gap-2">
              <span>{success}</span>
            </div>
          )}

          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <form onSubmit={handleUpdateName} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-450 mb-1">Current Email Address</label>
                <div className="flex items-center gap-2 bg-zinc-950 px-3 py-2.5 rounded-lg border border-zinc-850 text-xs text-zinc-500 font-mono">
                  <Mail size={14} />
                  <span>{adminEmail}</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">Email changes are managed securely in the separate Email Change tab.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-zinc-550" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="pl-9 pr-4 py-2.5 w-full rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || name.trim() === adminName}
                  className="w-full flex justify-center items-center bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save Profile Details'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: CHANGE EMAIL */}
          {activeTab === 'email' && (
            <form onSubmit={handleConfirmEmailChange} className="space-y-4 font-sans">
              <div>
                <label className="block text-xs font-semibold text-zinc-450 mb-1">Current Email</label>
                <p className="text-xs font-mono text-zinc-400 bg-zinc-950/60 border border-zinc-850 px-3 py-2 rounded">
                  {adminEmail}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">New Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. new-email@elisadecor.com"
                  className="w-full rounded-lg bg-zinc-805 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-xs"
                  disabled={loading || emailOtpRequested}
                />
              </div>

              {!emailOtpRequested ? (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleRequestEmailOTPs}
                    disabled={loading || !newEmail || emailTimer > 0}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded text-xs font-semibold border border-zinc-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mx-auto h-4 w-4" />
                    ) : emailTimer > 0 ? (
                      `Request Codes (${emailTimer}s)`
                    ) : (
                      'Request OTP Verification Codes'
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4 border-t border-zinc-850 pt-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] leading-relaxed p-3 rounded">
                    ⚠️ To secure this request, verification codes have been sent to **both** your current email (`{adminEmail}`) and your new target email (`{newEmail}`). Both codes are required to authorize this modification.
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
                        Current Email OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={oldEmailOtp}
                        onChange={(e) => setOldEmailOtp(e.target.value)}
                        placeholder="6-digit code"
                        className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-2 text-center text-sm font-semibold text-white tracking-widest focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
                        New Email OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={newEmailOtp}
                        onChange={(e) => setNewEmailOtp(e.target.value)}
                        placeholder="6-digit code"
                        className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-2 text-center text-sm font-semibold text-white tracking-widest focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEmailOtpRequested(false)}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 border border-zinc-700 rounded text-xs font-semibold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !oldEmailOtp || !newEmailOtp}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin mx-auto h-4 w-4" /> : 'Confirm Email Update'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleRequestEmailOTPs}
                    disabled={loading || emailTimer > 0}
                    className="w-full text-[10px] text-zinc-550 hover:text-white text-center hover:underline"
                  >
                    {emailTimer > 0 ? `Resend codes in ${emailTimer}s` : 'Resend verification codes'}
                  </button>
                </div>
              )}
            </form>
          )}

          {/* TAB 3: CHANGE PASSWORD */}
          {activeTab === 'password' && (
            <form onSubmit={handleConfirmPasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Current Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-zinc-550" />
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="pl-9 pr-4 py-2.5 w-full rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Retype password"
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    disabled={loading}
                  />
                </div>
              </div>

              {!passwordOtpRequested ? (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleRequestPasswordOTP}
                    disabled={loading || !oldPassword || !newPassword || newPassword !== confirmPassword || passwordTimer > 0}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded text-xs font-semibold border border-zinc-700 transition-colors disabled:opacity-50 animate-none"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mx-auto h-4 w-4" />
                    ) : passwordTimer > 0 ? (
                      `Request OTP (${passwordTimer}s)`
                    ) : (
                      'Request OTP for Password Change'
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4 border-t border-zinc-850 pt-4 animate-none">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Verification Code (OTP)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={passwordOtp}
                      onChange={(e) => setPasswordOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP code"
                      className="w-full rounded bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-center text-sm font-semibold tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                      disabled={loading}
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">Dispatched to your registered email address (`{adminEmail}`).</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPasswordOtpRequested(false)}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 border border-zinc-700 rounded text-xs font-semibold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !passwordOtp}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin mx-auto h-4 w-4" /> : 'Confirm Password Update'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleRequestPasswordOTP}
                    disabled={loading || passwordTimer > 0}
                    className="w-full text-[10px] text-zinc-550 hover:text-white text-center hover:underline"
                  >
                    {passwordTimer > 0 ? `Resend OTP in ${passwordTimer}s` : 'Resend verification code'}
                  </button>
                </div>
              )}
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
