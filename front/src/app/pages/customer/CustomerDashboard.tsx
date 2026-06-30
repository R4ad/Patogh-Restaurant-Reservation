import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Calendar, Clock, Users, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getMyReservations, cancelReservation } from '../../services/reservation.service';
import { formatJalaliDate } from '../../utils/jalali';
import type { Reservation } from '../../types';

export function CustomerDashboard() {
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isError,      setIsError]      = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadReservations = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await getMyReservations();
      setReservations(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadReservations(); }, []);

  const handleCancel = async (reservationId: string) => {
    if (!window.confirm('آیا از لغو این رزرو مطمئن هستید؟')) return;
    setCancellingId(reservationId);
    try {
      await cancelReservation({ ReservationId: reservationId });
      toast.success('رزرو با موفقیت لغو شد');
      await loadReservations();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطا در لغو رزرو');
    } finally {
      setCancellingId(null);
    }
  };

  // آمار محاسبه‌شده از داده‌های واقعی
  const pendingCount  = reservations.filter((r) => r.status === 'pending').length;
  const approvedCount = reservations.filter((r) => r.status === 'approved').length;
  const totalCount    = reservations.length;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">رزروهای من</h1>
            <p className="text-muted-foreground">مشاهده و مدیریت رزروهای خود</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="text-sm text-muted-foreground mb-1">در انتظار تأیید</div>
              <div className="text-3xl font-semibold text-yellow-600">
                {isLoading ? '—' : pendingCount.toLocaleString('fa-IR')}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="text-sm text-muted-foreground mb-1">تأیید شده</div>
              <div className="text-3xl font-semibold text-green-600">
                {isLoading ? '—' : approvedCount.toLocaleString('fa-IR')}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="text-sm text-muted-foreground mb-1">کل رزروها</div>
              <div className="text-3xl font-semibold text-primary">
                {isLoading ? '—' : totalCount.toLocaleString('fa-IR')}
              </div>
            </div>
          </div>

          {/* حالت بارگذاری */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {/* حالت خطا */}
          {!isLoading && isError && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <p className="text-muted-foreground mb-4">خطا در بارگذاری رزروها</p>
              <button onClick={loadReservations} className="text-primary hover:underline text-sm">
                تلاش مجدد
              </button>
            </div>
          )}

          {/* لیست رزروها — دسکتاپ */}
          {!isLoading && !isError && (
            <>
              <div className="hidden md:block bg-white rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        {['رستوران', 'تاریخ', 'ساعت', 'تعداد نفرات', 'وضعیت', 'عملیات'].map((h) => (
                          <th key={h} className="text-right px-6 py-4 text-sm text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {reservations.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                            هنوز رزروی ثبت نکرده‌اید
                          </td>
                        </tr>
                      )}
                      {reservations.map((r) => (
                        <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={r.restaurant.image}
                                alt={r.restaurant.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <div className="font-medium">{r.restaurant.name}</div>
                                <div className="text-sm text-muted-foreground">{r.reservationNumber}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">{formatJalaliDate(r.date)}</td>
                          <td className="px-6 py-4">{r.time}</td>
                          <td className="px-6 py-4">{r.guests} نفر</td>
                          <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                          <td className="px-6 py-4">
                            {r.status === 'pending' && (
                              <button
                                onClick={() => handleCancel(r.id)}
                                disabled={cancellingId === r.id}
                                className="text-sm text-destructive hover:underline disabled:opacity-50"
                              >
                                {cancellingId === r.id ? <Loader2 className="w-4 h-4 animate-spin inline" /> : 'لغو رزرو'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* لیست رزروها — موبایل */}
              <div className="md:hidden space-y-4">
                {reservations.length === 0 && (
                  <p className="text-center text-muted-foreground py-12">هنوز رزروی ثبت نکرده‌اید</p>
                )}
                {reservations.map((r) => (
                  <div key={r.id} className="bg-white rounded-xl p-4 border border-border">
                    <div className="flex items-start gap-3 mb-4">
                      <img
                        src={r.restaurant.image}
                        alt={r.restaurant.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{r.restaurant.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{r.reservationNumber}</p>
                        <StatusBadge status={r.status} />
                      </div>
                    </div>
                    <div className="space-y-2 pt-3 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatJalaliDate(r.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{r.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{r.guests} نفر</span>
                      </div>
                      {r.status === 'pending' && (
                        <button
                          onClick={() => handleCancel(r.id)}
                          disabled={cancellingId === r.id}
                          className="w-full mt-2 py-2 text-sm text-destructive border border-destructive rounded-lg hover:bg-destructive/10 transition-colors disabled:opacity-50"
                        >
                          {cancellingId === r.id ? 'در حال لغو...' : 'لغو رزرو'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}