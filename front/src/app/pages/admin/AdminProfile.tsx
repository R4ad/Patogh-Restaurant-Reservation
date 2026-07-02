import { useState, useEffect } from 'react';
import {
  User, Phone, Save, Loader2, Lock, Eye, EyeOff,
  CheckCircle, ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { getProfile, updateProfile, changePassword } from '../../services/user.service';
import type { UserProfile } from '../../types';
import { formatJalaliDate } from '../../utils/jalali';
import { inputClass } from '../../utils/validators';

interface ProfileForm  { displayName: string; }
interface PasswordForm { currentPassword: string; newPassword: string; confirmPassword: string; }

export function AdminProfile() {
  const [profile,     setProfile]     = useState<UserProfile | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const profileForm  = useForm<ProfileForm>({ defaultValues: { displayName: '' } });
  const passwordForm = useForm<PasswordForm>();

  useEffect(() => {
    getProfile()
      .then((p) => {
        setProfile(p);
        profileForm.reset({ displayName: p.displayName ?? '' });
      })
      .catch(() => toast.error('دریافت پروفایل با خطا مواجه شد'))
      .finally(() => setLoading(false));
  }, []);

  const onSaveProfile = profileForm.handleSubmit(async (data) => {
    try {
      const updated = await updateProfile({ displayName: data.displayName.trim() || null });
      setProfile(updated);
      toast.success('پروفایل با موفقیت ذخیره شد');
    } catch { toast.error('خطا در ذخیره پروفایل'); }
  });

  const onChangePassword = passwordForm.handleSubmit(async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      passwordForm.setError('confirmPassword', { message: 'رمز عبور جدید با تکرار آن یکسان نیست' });
      return;
    }
    try {
      await changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('رمز عبور با موفقیت تغییر کرد');
      passwordForm.reset();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'خطا در تغییر رمز عبور');
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = profile?.displayName || 'مدیر ارشد';

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            پروفایل مدیر ارشد
          </h1>
          <p className="text-muted-foreground text-sm">مشاهده و ویرایش اطلاعات حساب مدیر سامانه</p>
        </div>

        {/* کارت اطلاعات */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
            <div className="text-center sm:text-right flex-1">
              <h2 className="text-xl font-semibold mb-1">{displayName}</h2>
              <p className="text-muted-foreground text-sm" dir="ltr">{profile?.phoneNumber}</p>
              {profile?.memberSince && (
                <p className="text-muted-foreground text-xs mt-1">
                  عضو از {formatJalaliDate(profile.memberSince)}
                </p>
              )}
              <span className="mt-2 inline-flex items-center gap-1 px-3 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                <ShieldCheck className="w-3 h-3" />
                مدیر ارشد سامانه
              </span>
            </div>
          </div>
        </div>

        {/* ویرایش اطلاعات */}
        <form onSubmit={onSaveProfile} className="bg-white rounded-xl border border-border p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            ویرایش اطلاعات
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">نام نمایشی</label>
              <input {...profileForm.register('displayName')} type="text"
                className={inputClass(false)} placeholder="نام نمایشی" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                شماره موبایل
                <span className="mr-2 text-xs text-muted-foreground/70">(قابل تغییر نیست)</span>
              </label>
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border border-border rounded-lg">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground" dir="ltr">{profile?.phoneNumber}</span>
              </div>
            </div>
            <button type="submit" disabled={profileForm.formState.isSubmitting}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {profileForm.formState.isSubmitting
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Save className="w-4 h-4" />}
              {profileForm.formState.isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </button>
          </div>
        </form>

        {/* تغییر رمز عبور */}
        <form onSubmit={onChangePassword} className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            تغییر رمز عبور
          </h3>
          <div className="space-y-4">
            {[
              { label: 'رمز عبور فعلی',       name: 'currentPassword' as const, show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
              { label: 'رمز عبور جدید',        name: 'newPassword' as const,     show: showNew,     toggle: () => setShowNew(!showNew) },
              { label: 'تکرار رمز عبور جدید', name: 'confirmPassword' as const, show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm text-muted-foreground mb-2">{field.label}</label>
                <div className="relative">
                  <input
                    {...passwordForm.register(field.name, { required: `${field.label} الزامی است` })}
                    type={field.show ? 'text' : 'password'}
                    className={inputClass(!!passwordForm.formState.errors[field.name])}
                    placeholder={field.label}
                    dir="ltr"
                  />
                  <button type="button" onClick={field.toggle}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors[field.name] && (
                  <p className="text-destructive text-xs mt-1">{passwordForm.formState.errors[field.name]?.message}</p>
                )}
              </div>
            ))}
            <button type="submit" disabled={passwordForm.formState.isSubmitting}
              className="w-full px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {passwordForm.formState.isSubmitting
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <CheckCircle className="w-4 h-4" />}
              {passwordForm.formState.isSubmitting ? 'در حال تغییر...' : 'تغییر رمز عبور'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
