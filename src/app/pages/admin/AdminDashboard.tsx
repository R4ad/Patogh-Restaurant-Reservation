import { useState, useEffect } from 'react';
import {
  ShieldCheck, LogOut, MapPin, Clock, CheckCircle,
  XCircle, Loader2, Building2, RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { getPendingRestaurants, approveRestaurant } from '../../services/restaurant.service';
import type { Restaurant } from '../../types';

export function AdminDashboard() {
  const { logout } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadPending = async () => {
    setIsLoading(true);
    try {
      const data = await getPendingRestaurants();
      setRestaurants(data);
    } catch {
      toast.error('خطا در دریافت رستوران‌ها');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleDecision = async (restaurantId: string, isApproved: boolean) => {
    setProcessingId(restaurantId);
    try {
      await approveRestaurant({ RestaurantId: restaurantId, IsApproved: isApproved });
      toast.success(isApproved ? 'رستوران تأیید شد ✓' : 'رستوران رد شد');
      // حذف از لیست
      setRestaurants((prev) => prev.filter((r) => r.Id !== restaurantId));
    } catch {
      toast.error('خطایی پیش آمد، دوباره تلاش کنید');
    } finally {
      setProcessingId(null);
    }
  };

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
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            خروج
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* عنوان + refresh */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">رستوران‌های در انتظار تأیید</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isLoading ? 'در حال بارگذاری...' : `${restaurants.length} رستوران در صف بررسی`}
            </p>
          </div>
          <button
            onClick={loadPending}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            بروزرسانی
          </button>
        </div>

        {/* loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-muted-foreground text-sm">در حال دریافت اطلاعات...</p>
            </div>
          </div>
        )}

        {/* empty state */}
        {!isLoading && restaurants.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-semibold mb-1">همه رستوران‌ها بررسی شدن</h3>
            <p className="text-muted-foreground text-sm">هیچ درخواستی در انتظار تأیید نیست</p>
          </div>
        )}

        {/* لیست رستوران‌ها */}
        {!isLoading && restaurants.length > 0 && (
          <div className="space-y-4">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.Id}
                className="bg-white rounded-xl border border-border overflow-hidden shadow-sm"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* تصویر */}
                  <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0">
                    <img
                      src={restaurant.Image ?? '/images/restaurant-1.jpg'}
                      alt={restaurant.Name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* اطلاعات */}
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

                    {/* دکمه‌ها */}
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleDecision(restaurant.Id, true)}
                        disabled={processingId === restaurant.Id}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60 text-sm font-medium"
                      >
                        {processingId === restaurant.Id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        تأیید
                      </button>
                      <button
                        onClick={() => handleDecision(restaurant.Id, false)}
                        disabled={processingId === restaurant.Id}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-colors disabled:opacity-60 text-sm font-medium"
                      >
                        {processingId === restaurant.Id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        رد
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
