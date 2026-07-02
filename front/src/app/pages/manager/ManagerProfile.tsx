import { useState, useEffect, useRef } from 'react';
import {
  User, Phone, Save, Loader2, Lock, Eye, EyeOff,
  Camera, CheckCircle, Store, ChefHat,
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { getProfile, updateProfile, changePassword, uploadAvatar } from '../../services/user.service';
import type { UserProfile } from '../../types';
import { formatJalaliDate } from '../../utils/jalali';
import { inputClass } from '../../utils/validators';

interface ProfileForm  { displayName: string; }
interface PasswordForm { currentPassword: string; newPassword: string; confirmPassword: string; }

export function ManagerProfile() {
  const [profile,       setProfile]       = useState<UserProfile | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [showCurrent,   setShowCurrent]   = useState(false);
  const [showNew,       setShowNew]       = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      const url = await uploadAvatar(file);
      setProfile((p) => p ? { ...p, avatarUrl: url } : p);
      toast.success('تصویر پروفایل بارگذاری شد');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'خطا در آپلود تصویر');
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = profile?.displayName || 'مدیر رستوران';
  const BASE_URL = import.meta.env.VITE_API_URL ?? '';

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">پروفایل</h1>
        <p className="text-muted-foreground text-sm">مشاهده و ویرایش اطلاعات حساب مدیر رستوران</p>
      </div>

      {/* آواتار + اطلاعات */}
      <div className="bg-white rounded-xl border border-border p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative flex-shrink-0">
            <div
              className="w-24 h-24 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {profile?.avatarUrl ? (
                <img src={`${BASE_URL}${profile.avatarUrl}`} alt="پروفایل"
                  className="w-full h-full object-cover" />
              ) : (
                <ChefHat className="w-12 h-12 text-primary" />
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {avatarLoading
                  ? <Loader2 className="w-6 h-6 text-white animate-spin" />
                  : <Camera className="w-6 h-6 text-white" />}
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp"
              className="hidden" onChange={onAvatarChange} />
          </div>

          <div className="text-center sm:text-right flex-1">
            <h2 className="text-xl font-semibold mb-1">{displayName}</h2>
            <p className="text-muted-foreground text-sm" dir="ltr">{profile?.phoneNumber}</p>
            {profile?.memberSince && (
              <p className="text-muted-foreground text-xs mt-1">
                عضو از {formatJalaliDate(profile.memberSince)}
              </p>
            )}
            <span className="mt-2 inline-flex items-center gap-1 px-3 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
              <Store className="w-3 h-3" />
              مدیر رستوران
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
              className={inputClass(false)} placeholder="نام خود را وارد کنید" />
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
            { label: 'رمز عبور فعلی', name: 'currentPassword' as const, show: showCurrent, toggle: () => setShowCurrent(!showCurrent), required: 'رمز عبور فعلی الزامی است', placeholder: 'رمز عبور فعلی' },
            { label: 'رمز عبور جدید', name: 'newPassword' as const, show: showNew, toggle: () => setShowNew(!showNew), required: 'رمز عبور جدید الزامی است', placeholder: 'رمز عبور جدید' },
            { label: 'تکرار رمز عبور جدید', name: 'confirmPassword' as const, show: showConfirm, toggle: () => setShowConfirm(!showConfirm), required: 'تکرار الزامی است', placeholder: 'تکرار رمز عبور جدید' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm text-muted-foreground mb-2">{field.label}</label>
              <div className="relative">
                <input
                  {...passwordForm.register(field.name, { required: field.required })}
                  type={field.show ? 'text' : 'password'}
                  className={inputClass(!!passwordForm.formState.errors[field.name])}
                  placeholder={field.placeholder}
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
  );
}
