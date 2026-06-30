import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { register as registerUser, sendOTP } from '../../services/auth.service';
import { validateIranianPhone, validatePasswordLength, inputClass, FieldError } from '../../utils/validators';

type RegisterFormData = {
  phone: string;
  password: string;
  confirmPassword: string;
  isManager: boolean;
};

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: { phone: location.state?.phone ?? '', isManager: false },
  });

  // watch برای اعتبارسنجی تطابق رمز
  const passwordValue = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setServerError('');
    // UserRole enum: Customer=1, RestaurantOwner=2
    const roleValue: number = data.isManager ? 2 : 1;
    localStorage.setItem('userRole', data.isManager ? 'manager' : 'customer');
    try {
      await registerUser({ PhoneNumber: data.phone, Password: data.password, Role: roleValue });
      await sendOTP({ PhoneNumber: data.phone });
      navigate('/otp-verify', { state: { phone: data.phone } });
    } catch (err) {
      localStorage.removeItem('userRole');
      setServerError(err instanceof Error ? err.message : 'مشکلی پیش آمد');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">پ</span>
            </div>
            <span className="text-3xl font-bold">پاتوق</span>
          </div>
          <h1 className="text-2xl mb-2">ثبت‌نام</h1>
          <p className="text-muted-foreground text-sm">ایجاد حساب کاربری جدید</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* شماره موبایل */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">شماره موبایل</label>
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

            {/* رمز عبور */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">رمز عبور</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'رمز عبور الزامی است',
                    validate: validatePasswordLength,
                  })}
                  className={inputClass(!!errors.password)}
                  placeholder="حداقل ۶ کاراکتر"
                  dir="ltr"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldError message={errors.password?.message} />
            </div>

            {/* تکرار رمز عبور */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">تکرار رمز عبور</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'تکرار رمز عبور الزامی است',
                    validate: (val) => val === passwordValue || 'رمز عبور و تکرار آن مطابقت ندارند',
                  })}
                  className={inputClass(!!errors.confirmPassword)}
                  placeholder="رمز عبور را دوباره وارد کنید"
                  dir="ltr"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldError message={errors.confirmPassword?.message} />
            </div>

            {/* چک‌باکس مدیر */}
            <label className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                type="checkbox"
                {...register('isManager')}
                className="mt-0.5 w-4 h-4 accent-primary flex-shrink-0"
              />
              <div>
                <p className="text-sm font-medium">ثبت‌نام به عنوان مدیر رستوران</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  پس از تأیید توسط مدیر ارشد سامانه فعال می‌شود
                </p>
              </div>
            </label>

            {serverError && (
              <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              ثبت‌نام و دریافت کد تأیید
            </button>

            <p className="text-xs text-muted-foreground text-center">
              با ثبت‌نام،{' '}
              <a href="#" className="text-primary hover:underline">قوانین و مقررات</a>
              {' '}پاتوق را می‌پذیرید
            </p>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            قبلاً ثبت‌نام کرده‌اید؟{' '}
            <button onClick={() => navigate(-1)} className="text-primary hover:underline">ورود</button>
          </p>
        </div>
      </div>
    </div>
  );
}