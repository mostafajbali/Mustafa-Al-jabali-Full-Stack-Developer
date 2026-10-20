import React, { useState } from 'react';
import { Lock, ArrowLeft, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useI18n, LanguageSwitcher } from '../i18n';

interface AdminLoginProps {
  defaultEmail?: string;
  onLoginSuccess: (token: string, admin: { email: string; name: string; role: string }) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  defaultEmail = 'mostafa_dev',
  onLoginSuccess,
  onBackToSite,
}) => {
  const { lang } = useI18n();
  const isAr = lang === 'ar';

  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.authenticated) {
        setError(
          isAr
            ? 'بيانات الدخول غير صحيحة. تأكد من اسم المستخدم (mostafa_dev) وكلمة المرور.'
            : data.error || 'Authentication failed. Please check your credentials.'
        );
        setLoading(false);
        return;
      }

      onLoginSuccess(data.token, data.admin);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen tech-canvas text-sky-50 flex flex-col justify-between p-4 sm:p-6 overflow-x-hidden">
      {/* Top Bar */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-3 py-2">
        <button
          type="button"
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-xs font-mono text-sky-200/75 hover:text-[#00F0FF] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>{isAr ? 'العودة إلى الموقع العام' : 'RETURN TO PUBLIC PORTFOLIO'}</span>
        </button>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <div className="hidden md:block text-xs font-mono text-cyan-400/70">
            {isAr ? 'بوابة إدارة المنصة المحمية' : 'ADMIN CMS GATEWAY'}
          </div>
        </div>
      </div>

      {/* Centered Auth Card */}
      <div className="my-8 sm:my-auto max-w-md w-full mx-auto">
        <div className="rounded-2xl tech-panel p-6 sm:p-10 space-y-6 sm:space-y-7 shadow-2xl">
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-400/15 border border-cyan-400/40 flex items-center justify-center text-[#00F0FF]">
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono text-[#00F0FF]">
              {isAr ? 'لوحة تحكم المطور مصطفى الجبالي' : 'ADMINISTRATOR SESSION'}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tech-title-gradient tracking-tight">
              {isAr ? 'تسجيل دخول الأدمن' : 'Admin Dashboard Login'}
            </h1>
            <p className="text-xs sm:text-sm text-sky-100/75 leading-relaxed">
              {isAr
                ? 'سجّل الدخول باسم المستخدم وكلمة المرور لإضافة مشاريعك الحقيقية، رفع الصور والفيديوهات، وتحديث بياناتك.'
                : 'Sign in with your administrator username and password to upload real projects, media assets, and manage site settings.'}
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-mono text-sky-100">
                {isAr ? 'اسم المستخدم (Username)' : 'ADMINISTRATOR USERNAME'}
              </label>
              <input
                type="text"
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mostafa_dev"
                className="w-full px-4 py-3 rounded-xl bg-[#030712] border border-cyan-500/30 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00F0FF] transition-colors font-mono text-left"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono text-sky-100">
                {isAr ? 'كلمة المرور (Password)' : 'PASSWORD'}
              </label>
              <div className="relative" dir="ltr">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isAr ? 'أدخل كلمة المرور' : 'Enter administrator password'}
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-[#030712] border border-cyan-500/30 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00F0FF] transition-colors font-mono text-left"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#00F0FF] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl tech-btn-primary disabled:opacity-50 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {loading
                  ? isAr
                    ? 'جاري التحقق...'
                    : 'Verifying Session...'
                  : isAr
                  ? 'دخول إلى لوحة التحكم'
                  : 'Authenticate & Enter CMS'}
              </span>
            </button>
          </form>

          {/* Quick Fill Helper */}
          <div className="pt-4 border-t border-cyan-500/20 flex items-center justify-between gap-2 text-xs text-sky-200/70">
            <span>
              {isAr ? 'بيانات الدخول للمسؤول' : 'Administrator credentials'}
            </span>
            <button
              type="button"
              onClick={() => {
                setEmail('mostafa_dev');
                setPassword('admin123');
              }}
              className="font-mono text-[#00F0FF] hover:text-cyan-300 underline cursor-pointer"
            >
              {isAr ? 'تعبئة تلقائية (mostafa_dev)' : 'Fill Credentials'}
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-cyan-400/60 font-mono py-2">
        {isAr
          ? 'محمي بواسطة توقيع الجلسات الخادمي HMAC-SHA256'
          : 'Protected by Server-Side HMAC-SHA256 Session Verification'}
      </div>
    </div>
  );
};
