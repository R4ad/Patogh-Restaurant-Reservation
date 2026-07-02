import { useState, useEffect } from 'react';
import {
  ShieldCheck, LogOut, MapPin, Clock, CheckCircle, XCircle,
  Loader2, Building2, RefreshCw, BarChart2, User,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { getPendingRestaurants, getRestaurants, approveRestaurant } from '../../services/restaurant.service';
import type { Restaurant } from '../../types';

type Tab = 'pending' | 'all' | 'stats';

export function AdminDashboard() {
  const { logout } = useAuth();
  const [tab, setTab] = useState<Tab>('pending');

  const [pending,  setPending]  = useState<Restaurant[]>([]);
  const [approved, setApproved] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const [pend, appr] = await Promise.all([getPendingRestaurants(), getRestaurants()]);
      setPending(pend);
      setApproved(appr);
    } catch {
      toast.error('خطا در دریافت اطلاعات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDecision = async (restaurantId: string, isApproved: boolean) => {
    setProcessingId(restaurantId);
    try {
      await approveRestaurant({ RestaurantId: restaurantId, IsApproved: isApproved });
      toast.success(isApproved ? 'رستوران تأیید شد ✓' : 'رستوران رد شد');
      setPending((prev) => prev.filter((r) => r.Id !== restaurantId));
      if (isApproved) {
        const restaurant = pending.find((r) => r.Id === restaurantId);
        if (restaurant) setApproved((prev) => [...prev, { ...restaurant, IsApproved: true }]);
      }
    } catch {
      toast.error('خطایی پیش آمد، دوباره تلاش کنید');
    } finally {
      setProcessingId(null);
    }
  };

  const totalCount    = pending.length + approved.length;
  const pendingCount  = pending.length;
  const approvedCount = approved.length;

  const chartData = [
    { name: 'تأیید شده', count: approvedCount, fill: '#22c55e' },
    { name: 'در انتظار',  count: pendingCount,  fill: '#f59e0b' },
    { name: 'کل',         count: totalCount,    fill: '#6366f1' },
  ];

  const tabs: { key: Tab; label: string }[] = [
    { key: 'pending', label: `در انتظار تأیید (${pendingCount})` },
    { key: 'all',     label: `همه رستوران‌ها (${totalCount})` },
    { key: 'stats',   label: 'گزارش آماری' },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">

      {/* هدر */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold leading-none">پاتوق</p>
              <p className="text-xs text-muted-foreground">پنل مدیر ارشد</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/profile"
              className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors text-sm"
            >
              <User className="w-4 h-4" />
              پروفایل
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* آمار کلی */}
        {!isLoading && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-border text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {pendingCount.toLocaleString('fa-IR')}
              </div>
              <div className="text-xs text-muted-foreground">در انتظار تأیید</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-border text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {approvedCount.toLocaleString('fa-IR')}
              </div>
              <div className="text-xs text-muted-foreground">تأیید شده</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-border text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {totalCount.toLocaleString('fa-IR')}
              </div>
              <div className="text-xs text-muted-foreground">کل رستوران‌ها</div>
            </div>
          </div>
        )}

        {/* تب‌ها + دکمه refresh */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  tab === t.key
                    ? 'bg-white shadow text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button
            onClick={load}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            بروزرسانی
          </button>
        </div>

        {/* بارگذاری */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* تب: در انتظار تأیید */}
        {!isLoading && tab === 'pending' && (
          <>
            {pending.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-semibold mb-1">همه رستوران‌ها بررسی شدن</h3>
                <p className="text-muted-foreground text-sm">هیچ درخواستی در انتظار تأیید نیست</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pending.map((restaurant) => (
                  <div key={restaurant.Id} className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0">
                        <img
                          src={restaurant.Image ?? '/images/restaurant-1.jpg'}
                          alt={restaurant.Name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h2 className="text-lg font-bold">{restaurant.Name}</h2>
                            <span className="text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full px-2 py-0.5 whitespace-nowrap flex-shrink-0">
                              در انتظار تأیید
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {restaurant.Description}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Building2 className="w-4 h-4 flex-shrink-0" />
                              <span>{restaurant.FoodType}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span>{restaurant.Location}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              <span dir="ltr">{restaurant.StartTime} – {restaurant.EndTime}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => handleDecision(restaurant.Id, true)}
                            disabled={processingId === restaurant.Id}
                            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60 text-sm font-medium"
                          >
                            {processingId === restaurant.Id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            تأیید
                          </button>
                          <button
                            onClick={() => handleDecision(restaurant.Id, false)}
                            disabled={processingId === restaurant.Id}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-colors disabled:opacity-60 text-sm font-medium"
                          >
                            {processingId === restaurant.Id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                            رد
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* تب: همه رستوران‌ها */}
        {!isLoading && tab === 'all' && (
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  {['نام', 'نوع', 'موقعیت', 'ساعت کاری', 'وضعیت'].map((h) => (
                    <th key={h} className="text-right px-6 py-4 text-sm text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...approved, ...pending].map((r) => (
                  <tr key={r.Id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{r.Name}</td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">{r.FoodType}</td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">{r.Location}</td>
                    <td className="px-6 py-4 text-muted-foreground text-sm" dir="ltr">{r.StartTime} – {r.EndTime}</td>
                    <td className="px-6 py-4">
                      {r.IsApproved ? (
                        <span className="text-xs bg-green-100 text-green-700 border border-green-200 rounded-full px-2 py-0.5">تأیید شده</span>
                      ) : (
                        <span className="text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full px-2 py-0.5">در انتظار</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* تب: گزارش آماری */}
        {!isLoading && tab === 'stats' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart2 className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">وضعیت رستوران‌ها</h3>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => [value.toLocaleString('fa-IR'), 'تعداد']}
                  />
                  <Bar dataKey="count" name="تعداد" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* خلاصه آماری */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {chartData.map((item) => (
                <div key={item.name} className="bg-white rounded-xl border border-border p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: item.fill + '20' }}>
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: item.fill }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: item.fill }}>
                      {item.count.toLocaleString('fa-IR')}
                    </div>
                    <div className="text-sm text-muted-foreground">{item.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}