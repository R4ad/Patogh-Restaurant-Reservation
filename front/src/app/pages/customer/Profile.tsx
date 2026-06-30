import { useState, useEffect } from 'react';
import { User, Phone, Save, Loader2, Calendar, Heart, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { getMyReservations } from '../../services/reservation.service';
import { getFavorites }      from '../../services/favorite.service';
import { formatNumber } from '../../utils/format';
import {formatJalaliDate } from '../../utils/jalali';

import { inputClass } from '../../utils/validators';

const MEMBER_SINCE = '2024-01-15'; // mock

export function Profile() {
  const phone       = localStorage.getItem('phoneNumber') ?? '—';
  const [name,      setName]      = useState(localStorage.getItem('displayName') ?? '');
  const [isSaving,  setIsSaving]  = useState(false);
  const [resCount,  setResCount]  = useState<number | null>(null);
  const [favCount,  setFavCount]  = useState<number | null>(null);

  useEffect(() => {
    getMyReservations().then((r) => setResCount(r.length)).catch(() => setResCount(0));
    getFavorites().then((f)       => setFavCount(f.length)).catch(() => setFavCount(0));
  }, []);

  const handleSave = async () => {
    if (!name.trim()) { toast.error('نام الزامی است'); return; }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    localStorage.setItem('displayName', name.trim());
    toast.success('پروفایل با موفقیت ذخیره شد');
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">پروفایل</h1>
          <p className="text-muted-foreground">مشاهده و ویرایش اطلاعات حساب شما</p>
        </div>

        {/* آواتار + آمار */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div className="text-center sm:text-right flex-1">
              <h2 className="text-xl font-semibold mb-1">
                {name || 'کاربر پاتوق'}
              </h2>
              <p className="text-muted-foreground text-sm">{phone}</p>
              <p className="text-muted-foreground text-xs mt-1">
                عضو از {formatJalaliDate(MEMBER_SINCE)}
              </p>
            </div>
          </div>

          {/* آمار */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            {[
              { icon: ClipboardList, label: 'رزرو',         value: resCount, color: 'text-primary' },
              { icon: Heart,         label: 'علاقه‌مندی',  value: favCount, color: 'text-red-500' },
              { icon: Calendar,      label: 'ماه عضویت',   value: 5,        color: 'text-green-600' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value === null ? '—' : formatNumber(stat.value)}
                </div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* فرم ویرایش */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4">ویرایش اطلاعات</h3>
          <div className="space-y-4">

            {/* نام نمایشی */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">نام نمایشی</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass(false)}
                placeholder="نام خود را وارد کنید"
              />
            </div>

            {/* شماره موبایل — فقط خواندنی */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                شماره موبایل
                <span className="mr-2 text-xs text-muted-foreground/70">(قابل تغییر نیست)</span>
              </label>
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border border-border rounded-lg">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground" dir="ltr">{phone}</span>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}