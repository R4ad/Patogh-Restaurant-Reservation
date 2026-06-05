import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sendOTP } from '../../services/auth.service';
import { IS_MOCK } from '../../services/client';

type LoginMode = 'otp' | 'password';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const isOwner = location.pathname.includes('owner');

  const [mode, setMode] = useState<LoginMode>(isOwner ? 'password' : 'otp');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'password') {
        // ورود مستقیم با رمز — auth context redirect رو انجام می‌ده
        await login({ PhoneNumber: phone, Password: password });
      } else {
        // ارسال OTP و رفتن به صفحه تأیید
        await sendOTP({ PhoneNumber: phone });
        navigate('/otp-verify', { state: { phone } });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'مشکلی پیش آمد، دوباره تلاش کنید');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* تصویر سمت چپ */}
        <div className="hidden lg:block relative">
          <img
            src="/images/restaurant-1.jpg"
            alt="کافه"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 flex items-end">
            <div className="p-12 text-white">
              <h2 className="text-4xl mb-4">به پاتوق خوش آمدید</h2>
              <p className="text-lg text-white/90">
                بهترین رستوران‌ها و کافه‌ها را کشف کنید و به راحتی رزرو کنید
              </p>
            </div>
          </div>
        </div>

        {/* فرم سمت راست */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* لوگو */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">پ</span>
                </div>
                <span className="text-3xl font-bold">پاتوق</span>
              </div>
              <h1 className="text-2xl mb-2">
                ورود / ثبت‌نام {isOwner ? 'صاحب رستوران' : 'مشتری'}
              </h1>
              <p className="text-muted-foreground text-sm">
                {IS_MOCK && (
                  <span className="inline-block bg-yellow-50 text-yellow-700 border border-yellow-200 rounded px-2 py-1 text-xs mb-2">
                    حالت تست — شماره: ۰۹۱۲۱۲۳۴۵۶۷ / رمز: ۱۲۳۴
                  </span>
                )}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
              {/* Toggle حالت ورود (فقط برای مشتری) */}
              {!isOwner && (
                <div className="flex bg-muted rounded-lg p-1 mb-6">
                  <button
                    type="button"
                    onClick={() => { setMode('otp'); setError(''); }}
                    className={`flex-1 py-2 rounded-md text-sm transition-colors ${
                      mode === 'otp'
                        ? 'bg-white shadow text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    ورود با پیامک
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('password'); setError(''); }}
                    className={`flex-1 py-2 rounded-md text-sm transition-colors ${
                      mode === 'password'
                        ? 'bg-white shadow text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    ورود با رمز عبور
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* شماره موبایل */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    شماره موبایل
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    dir="ltr"
                  />
                </div>

                {/* رمز عبور (فقط در حالت password) */}
                {mode === 'password' && (
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      رمز عبور
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="رمز عبور خود را وارد کنید"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* پیام خطا */}
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}

                {/* دکمه ارسال */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {mode === 'otp' ? 'ارسال کد تأیید' : 'ورود'}
                </button>

                <p className="text-sm text-muted-foreground text-center">
                  با ورود، شما{' '}
                  <a href="#" className="text-primary hover:underline">
                    قوانین و مقررات
                  </a>{' '}
                  پاتوق را می‌پذیرید
                </p>
              </form>
            </div>

            {/* سوییچ نقش */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isOwner ? 'مشتری هستید؟' : 'صاحب رستوران یا کافه هستید؟'}{' '}
                <button
                  onClick={() => navigate(isOwner ? '/login/customer' : '/login/owner')}
                  className="text-primary hover:underline"
                >
                  {isOwner ? 'ورود مشتری' : 'ورود مدیریت'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
