import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Check, X, Calendar, Clock, Users, Loader2, AlertCircle, Store, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { getRestaurantReservations, approveReservation, rejectReservation } from '../../services/reservation.service';
import { getManagerRestaurant } from '../../services/restaurant.service';
import { formatJalaliDate } from '../../utils/jalali';
import type { ManagerReservation, Restaurant } from '../../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { BarChart2 } from 'lucide-react'; // به lucide imports اضافه کن

export function ManagerDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // رستوران مدیر
  const [restaurant,    setRestaurant]    = useState<Restaurant | null>(null);
  const [loadingRest,   setLoadingRest]   = useState(true);

  // رزروها
  const [requests,      setRequests]      = useState<ManagerReservation[]>([]);
  const [loadingReqs,   setLoadingReqs]   = useState(true);
  const [isError,       setIsError]       = useState(false);
  const [processingId,  setProcessingId]  = useState<string | null>(null);

  useEffect(() => {
    getManagerRestaurant()
      .then(setRestaurant)
      .finally(() => setLoadingRest(false));

    getRestaurantReservations()
      .then(setRequests)
      .catch(() => setIsError(true))
      .finally(() => setLoadingReqs(false));
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await approveReservation({ ReservationId: id });
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: 'approved' as const } : r));
      toast.success('رزرو تأیید شد ✓');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطا در تأیید رزرو');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await rejectReservation({ ReservationId: id });
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: 'rejected' as const } : r));
      toast.error('رزرو رد شد');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطا در رد رزرو');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount  = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isManager isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">داشبورد مدیر</h1>
            <p className="text-muted-foreground">مدیریت رستوران و درخواست‌های رزرو</p>
          </div>

          {/* وضعیت رستوران — فاز ۷ */}
          {!loadingRest && (
            <div className="mb-8">
              {restaurant ? (
                <div className={`rounded-xl p-6 border flex items-center justify-between ${
                  restaurant.IsApproved
                    ? 'bg-green-50 border-green-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      restaurant.IsApproved ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      <Store className={`w-6 h-6 ${restaurant.IsApproved ? 'text-green-600' : 'text-yellow-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{restaurant.Name}</h3>
                      <p className={`text-sm ${restaurant.IsApproved ? 'text-green-700' : 'text-yellow-700'}`}>
                        {restaurant.IsApproved ? '✓ رستوران تأیید شده و فعال است' : 'در انتظار تأیید مدیر ارشد'}
                      </p>
                    </div>
                  </div>
                  {restaurant.IsApproved && (
                    <button
                      onClick={() => navigate('/manager-dashboard/menu')}
                      className="flex items-center gap-1 text-sm text-green-700 hover:underline"
                    >
                      مدیریت منو <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-6 border border-dashed border-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Store className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium">هنوز رستورانی ثبت نکرده‌اید</h3>
                      <p className="text-sm text-muted-foreground">اطلاعات رستوران خود را ثبت کنید</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/restaurant-onboarding')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
                  >
                    ثبت رستوران
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="text-sm text-muted-foreground mb-1">در انتظار بررسی</div>
              <div className="text-3xl font-semibold text-yellow-600">
                {loadingReqs ? '—' : pendingCount.toLocaleString('fa-IR')}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="text-sm text-muted-foreground mb-1">تأیید شده</div>
              <div className="text-3xl font-semibold text-green-600">
                {loadingReqs ? '—' : approvedCount.toLocaleString('fa-IR')}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="text-sm text-muted-foreground mb-1">کل درخواست‌ها</div>
              <div className="text-3xl font-semibold text-primary">
                {loadingReqs ? '—' : requests.length.toLocaleString('fa-IR')}
              </div>
            </div>
          </div>

          {/* عنوان بخش رزروها */}
          <h2 className="text-xl mb-4">درخواست‌های رزرو</h2>

          {/* بارگذاری */}
          {loadingReqs && (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {/* خطا */}
          {!loadingReqs && isError && (
            <div className="flex flex-col items-center py-16 text-center">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <p className="text-muted-foreground">خطا در بارگذاری درخواست‌ها</p>
            </div>
          )}

          {/* جدول — دسکتاپ */}
          {!loadingReqs && !isError && (
            <>
              <div className="hidden md:block bg-white rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        {['مشتری', 'تاریخ', 'ساعت', 'تعداد نفرات', 'وضعیت', 'عملیات'].map((h) => (
                          <th key={h} className="text-right px-6 py-4 text-sm text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {requests.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                            هنوز درخواست رزروی وجود ندارد
                          </td>
                        </tr>
                      )}
                      {requests.map((req) => (
                        <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium">{req.customer.name}</div>
                            <div className="text-sm text-muted-foreground">{req.customer.phone}</div>
                            {req.notes && <div className="text-xs text-muted-foreground mt-1">{req.notes}</div>}
                          </td>
                          <td className="px-6 py-4">{formatJalaliDate(req.date)}</td>
                          <td className="px-6 py-4">{req.time}</td>
                          <td className="px-6 py-4">{req.guests} نفر</td>
                          <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                          <td className="px-6 py-4">
                            {req.status === 'pending' && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleApprove(req.id)}
                                  disabled={processingId === req.id}
                                  className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors disabled:opacity-50"
                                  title="تأیید"
                                >
                                  {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => handleReject(req.id)}
                                  disabled={processingId === req.id}
                                  className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-50"
                                  title="رد"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* کارت — موبایل */}
              <div className="md:hidden space-y-4">
                {requests.length === 0 && (
                  <p className="text-center text-muted-foreground py-12">هنوز درخواست رزروی وجود ندارد</p>
                )}
                {requests.map((req) => (
                  <div key={req.id} className="bg-white rounded-xl p-4 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium mb-0.5">{req.customer.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{req.customer.phone}</p>
                        <StatusBadge status={req.status} />
                      </div>
                    </div>
                    {req.notes && (
                      <div className="mb-3 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">{req.notes}</div>
                    )}
                    <div className="space-y-2 pb-3 border-b border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatJalaliDate(req.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{req.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{req.guests} نفر</span>
                      </div>
                    </div>
                    {req.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleApprove(req.id)}
                          disabled={processingId === req.id}
                          className="flex-1 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" /><span>تأیید</span>
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          disabled={processingId === req.id}
                          className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <X className="w-4 h-4" /><span>رد</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
          {/* فاز ۱۱ — آمار رزروها */}
          {!loadingReqs && !isError && requests.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl mb-4 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary" />
                آمار رزروها
              </h2>
              <div className="bg-white rounded-xl border border-border p-6">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={[
                      { status: 'در انتظار',  count: requests.filter((r) => r.status === 'pending').length,   fill: '#f59e0b' },
                      { status: 'تأیید شده', count: requests.filter((r) => r.status === 'approved').length,  fill: '#22c55e' },
                      { status: 'رد شده',    count: requests.filter((r) => r.status === 'rejected').length,  fill: '#ef4444' },
                    ].filter((d) => d.count > 0)}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="status" tick={{ fontSize: 13 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: number) => [v.toLocaleString('fa-IR'), 'تعداد']} />
                    <Bar dataKey="count" name="تعداد" radius={[6, 6, 0, 0]}>
                      {[
                        { fill: '#f59e0b' }, { fill: '#22c55e' }, { fill: '#ef4444' },
                      ].map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}