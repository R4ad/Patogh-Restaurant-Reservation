import { useState, useEffect, useRef } from 'react';
import {
  User, Phone, Save, Loader2, Calendar, Heart,
  ClipboardList, Lock, Eye, EyeOff, Camera, CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { getProfile, updateProfile, changePassword, uploadAvatar } from '../../services/user.service';
import type { UserProfile } from '../../types';
import { formatNumber } from '../../utils/format';
import { formatJalaliDate } from '../../utils/jalali';
import { inputClass } from '../../utils/validators';

// ── Sub-forms ────────────────────────────────────────────────

interface ProfileForm { displayName: string; }
interface PasswordForm { currentPassword: string; newPassword: string; confirmPassword: string; }

// ── Main Component ──────────────────────────────────────────

export function Profile() {
  const [profile,      setProfile]      = useState<UserProfile | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [showCurrent,  setShowCurrent]  = useState(false);
  const [showNew,      setShowNew]      = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<ProfileForm>({ defaultValues: { displayName: '' } });
  const passwordForm = useForm<PasswordForm>();

  // fetch profile
  useEffect(() => {
    getProfile()
      .then((p) => {
        setProfile(p);
        profileForm.reset({ displayName: p.displayName ?? '' });
      })
      .catch(() => toast.error('دریافت پروفایل با خطا مواجه شد'))
      .finally(() => setLoading(false));
  }, []);

  // save display name
  const onSaveProfile = profileForm.handleSubmit(async (data) => {
    try {
      const updated = await updateProfile({ displayName: data.displayName.trim() || null });
      setProfile(updated);
      toast.success('پروفایل با موفقیت ذخیره شد');
    } catch {
      toast.error('خطا در ذخیره پروفایل');
    }
  });

  // change password
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
      const msg = e instanceof Error ? e.message : 'خطا در تغییر رمز عبور';
      toast.error(msg);
    }
  });

  // avatar upload
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      const url = await uploadAvatar(file);
      setProfile((p) => p ? { ...p, avatarUrl: url } : p);
      toast.success('تصویر پروفایل بارگذاری شد');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'خطا در آپلود تصویر';
      toast.error(msg);
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = profile?.displayName || 'کاربر پاتوق';
  const BASE_URL = import.meta.env.VITE_API_URL ?? '';

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">پروفایل</h1>
          <p className="text-muted-foreground">مشاهده و ویرایش اطلاعات حساب شما</p>
        </div>

        {/* ── آواتار + اطلاعات + آمار ─────────────────────── */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {profile?.avatarUrl ? (
                  <img
                    src={`${BASE_URL}${profile.avatarUrl}`}
                    alt="پروفایل"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <User className="w-12 h-12 text-primary" />
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {avatarLoading
                    ? <Loader2 className="w-6 h-6 text-white animate-spin" />
                    : <Camera className="w-6 h-6 text-white" />}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={onAvatarChange}
              />
            </div>

            {/* Info */}
            <div className="text-center sm:text-right flex-1">
              <h2 className="text-xl font-semibold mb-1">{displayName}</h2>
              <p className="text-muted-foreground text-sm" dir="ltr">{profile?.phoneNumber}</p>
              {profile?.memberSince && (
                <p className="text-muted-foreground text-xs mt-1">
                  عضو از {formatJalaliDate(profile.memberSince)}
                </p>
              )}
              <span className="mt-2 inline-block px-3 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                مشتری
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            {[
              { icon: ClipboardList, label: 'رزرو',        value: profile?.totalReservations ?? 0, color: 'text-primary' },
              { icon: Heart,         label: 'علاقه‌مندی', value: profile?.favoritesCount ?? 0,    color: 'text-red-500' },
              { icon: Calendar,      label: 'ماه عضویت',  value: profile?.memberSince
                ? Math.max(1, Math.floor((Date.now() - new Date(profile.memberSince).getTime()) / (1000*60*60*24*30)))
                : 0,                                                                                color: 'text-green-600' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                <div className={`text-2xl font-bold ${stat.color}`}>{formatNumber(stat.value)}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ویرایش اطلاعات ──────────────────────────────── */}
        <form onSubmit={onSaveProfile} className="bg-white rounded-xl border border-border p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            ویرایش اطلاعات
          </h3>
          <div className="space-y-4">
            {/* نام نمایشی */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">نام نمایشی</label>
              <input
                {...profileForm.register('displayName')}
                type="text"
                className={inputClass(!!profileForm.formState.errors.displayName)}
                placeholder="نام خود را وارد کنید"
              />
            </div>

            {/* شماره موبایل */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                شماره موبایل
                <span className="mr-2 text-xs text-muted-foreground/70">(قابل تغییر نیست)</span>
              </label>
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border border-border rounded-lg">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground" dir="ltr">{profile?.phoneNumber}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={profileForm.formState.isSubmitting}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {profileForm.formState.isSubmitting
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Save className="w-4 h-4" />}
              {profileForm.formState.isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </button>
          </div>
        </form>

        {/* ── تغییر رمز عبور ──────────────────────────────── */}
        <form onSubmit={onChangePassword} className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            تغییر رمز عبور
          </h3>
          <div className="space-y-4">
            {/* رمز فعلی */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">رمز عبور فعلی</label>
              <div className="relative">
                <input
                  {...passwordForm.register('currentPassword', { required: 'رمز عبور فعلی الزامی است' })}
                  type={showCurrent ? 'text' : 'password'}
                  className={inputClass(!!passwordForm.formState.errors.currentPassword)}
                  placeholder="رمز عبور فعلی"
                  dir="ltr"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-destructive text-xs mt-1">{passwordForm.formState.errors.currentPassword.message}</p>
              )}
            </div>

            {/* رمز جدید */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">رمز عبور جدید</label>
              <div className="relative">
                <input
                  {...passwordForm.register('newPassword', {
                    required: 'رمز عبور جدید الزامی است',
                    minLength: { value: 6, message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' },
                  })}
                  type={showNew ? 'text' : 'password'}
                  className={inputClass(!!passwordForm.formState.errors.newPassword)}
                  placeholder="رمز عبور جدید (حداقل ۶ کاراکتر)"
                  dir="ltr"
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordForm.formState.errors.newPassword && (
                <p className="text-destructive text-xs mt-1">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>

            {/* تکرار رمز جدید */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">تکرار رمز عبور جدید</label>
              <div className="relative">
                <input
                  {...passwordForm.register('confirmPassword', { required: 'تکرار رمز عبور الزامی است' })}
                  type={showConfirm ? 'text' : 'password'}
                  className={inputClass(!!passwordForm.formState.errors.confirmPassword)}
                  placeholder="تکرار رمز عبور جدید"
                  dir="ltr"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-destructive text-xs mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
              className="w-full px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
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
