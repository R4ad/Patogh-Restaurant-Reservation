import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, User, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateProfile, changePassword } from '../../services/user.service';
import { inputClass, FieldError } from '../../utils/validators';

interface CompleteProfileForm {
  displayName: string;
  newPassword: string;
  confirmPassword: string;
}

export function CompleteProfile() {
  const navigate = useNavigate();
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CompleteProfileForm>({ defaultValues: { displayName: '', newPassword: '', confirmPassword: '' } });

  const newPasswordValue = watch('newPassword');

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.displayName.trim()) {
        await updateProfile({ displayName: data.displayName.trim() });
      }
      if (data.newPassword) {
        // currentPassword is empty for OTP-created accounts (backend allows this)
        await changePassword({ currentPassword: '', newPassword: data.newPassword });
      }
      toast.success('اطلاعات با موفقیت ذخیره شد');
      navigate('/customer-dashboard', { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطایی پیش آمد');
    }
  });

  const skipToDashboard = () => {
    navigate('/customer-dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4" dir="rtl">
      <div className="w-full max-w-md">

        {/* هدر */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">پ</span>
            </div>
            <span className="text-3xl font-bold">پاتوق</span>
          </div>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">ثبت‌نام موفق!</h1>
          <p className="text-muted-foreground text-sm">
            برای استفاده بهتر از پاتوق، اطلاعات زیر را تکمیل کنید
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
          <form onSubmit={onSubmit} className="space-y-5">

            {/* نام نمایشی */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2 flex items-center gap-1">
                <User className="w-4 h-4" />
                نام نمایشی
                <span className="text-xs text-muted-foreground/60">(اختیاری)</span>
              </label>
              <input
                type="text"
                {...register('displayName')}
                className={inputClass(!!errors.displayName)}
                placeholder="مثلاً: علی احمدی"
              />
              <FieldError message={errors.displayName?.message} />
            </div>

            {/* رمز عبور */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2 flex items-center gap-1">
                <Lock className="w-4 h-4" />
                رمز عبور
                <span className="text-xs text-muted-foreground/60">(اختیاری — برای ورود با رمز)</span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  {...register('newPassword', {
                    validate: (v) =>
                      !v || v.length >= 6 || 'رمز عبور باید حداقل ۶ کاراکتر باشد',
                  })}
                  className={inputClass(!!errors.newPassword)}
                  placeholder="حداقل ۶ کاراکتر (اختیاری)"
                  dir="ltr"
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldError message={errors.newPassword?.message} />
            </div>

            {/* تکرار رمز عبور */}
            {newPasswordValue && (
              <div>
                <label className="block text-sm text-muted-foreground mb-2">تکرار رمز عبور</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      validate: (v) =>
                        !newPasswordValue || v === newPasswordValue || 'رمز عبور و تکرار آن یکسان نیستند',
                    })}
                    className={inputClass(!!errors.confirmPassword)}
                    placeholder="رمز عبور را تکرار کنید"
                    dir="ltr"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <FieldError message={errors.confirmPassword?.message} />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              ذخیره و ورود به پنل
            </button>

          </form>
        </div>

        {/* دکمه رد کردن */}
        <div className="mt-4 text-center">
          <button
            onClick={skipToDashboard}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            بعداً تکمیل می‌کنم — ورود به پنل
          </button>
        </div>

      </div>
    </div>
  );
}
