import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { sendOTP } from '../../services/auth.service';
import { IS_MOCK } from '../../services/client';
import {
  validateIranianPhone,
  validatePasswordLength,
  inputClass,
  FieldError,
} from '../../utils/validators';

type LoginMode = 'otp' | 'password';
type LoginFormData = { phone: string; password: string };

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const isOwner = location.pathname.includes('owner');

  const [mode, setMode] = useState<LoginMode>(isOwner ? 'password' : 'otp');
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ shouldUnregister: true });

  const onSubmit = async (data: LoginFormData) => {
    setServerError('');
    const role = isOwner ? 'manager' : 'customer';
    localStorage.setItem('userRole', role);
    try {
      if (mode === 'password') {
        await login({ PhoneNumber: data.phone, Password: data.password });
      } else {
        await sendOTP({ PhoneNumber: data.phone });
        navigate('/otp-verify', { state: { phone: data.phone } });
      }
    } catch (err) {
      localStorage.removeItem('userRole');
      if (err instanceof Error && err.message === 'USER_NOT_FOUND') {
        navigate('/register', { state: { phone: data.phone } });
        return;
      }
      setServerError(
        err instanceof Error ? err.message : 'مشکلی پیش آمد، دوباره تلاش کنید'
      );
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
              {IS_MOCK && (
                <span className="inline-block bg-yellow-50 text-yellow-700 border border-yellow-200 rounded px-2 py-1 text-xs">
                  حالت تست — شماره: ۰۹۱۲۱۲۳۴۵۶۷ / رمز: ۱۲۳۴
                </span>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">

              {/* تاگل حالت ورود — فقط برای مشتری */}
              {!isOwner && (
                <div className="flex bg-muted rounded-lg p-1 mb-6">
                  <button
                    type="button"
                    onClick={() => { setMode('otp'); setServerError(''); }}
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
                    onClick={() => { setMode('password'); setServerError(''); }}
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

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* شماره موبایل */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    شماره موبایل
                  </label>
                  <input
                    type="tel"
                    {...register('phone', {
                      required: 'شماره موبایل الزامی است',
                      validate: validateIranianPhone,
                    })}
                    className={inputClass(!!errors.phone)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    dir="ltr"
                  />
                  <FieldError message={errors.phone?.message} />
                </div>

                {/* رمز عبور — فقط در حالت password */}
                {mode === 'password' && (
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      رمز عبور
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', {
                          required: 'رمز عبور الزامی است',
                          validate: validatePasswordLength,
                        })}
                        className={inputClass(!!errors.password)}
                        placeholder="رمز عبور خود را وارد کنید"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword
                          ? <EyeOff className="w-4 h-4" />
                          : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <FieldError message={errors.password?.message} />
                  </div>
                )}

                {/* خطای سرور */}
                {serverError && (
                  <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3">
                    {serverError}
                  </div>
                )}

                {/* دکمه ارسال */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {mode === 'otp' ? 'ارسال کد تأیید' : 'ورود'}
                </button>

                <p className="text-sm text-muted-foreground text-center">
                  با ورود، شما{' '}
                  <a href="#" className="text-primary hover:underline">قوانین و مقررات</a>
                  {' '}پاتوق را می‌پذیرید
                </p>
              </form>
            </div>

            {/* سوییچ نقش */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isOwner ? 'مشتری هستید؟' : 'صاحب رستوران یا کافه هستید؟'}{' '}
                <button
                  onClick={() =>
                    navigate(isOwner ? '/login/customer' : '/login/owner')
                  }
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